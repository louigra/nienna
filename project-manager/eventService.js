// project-manager/eventService.js
// JavaScript implementations of the event-related stored procedures.
// All DB access goes through the adapter in db/index.js — no direct Supabase calls.

import { db } from '../db/index.js';
import { EVENT_TYPES } from './events.config.js';

// Replicates: left(regexp_replace(body, '\s+', ' ', 'g'), 140)
export function summarize(text) {
  return (text || '').replace(/\s+/g, ' ').trim().slice(0, 140);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

export function estimateSummary({ estimateType, status, estimateDate, estimateAwardYear, totalAmount }) {
  const initcap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Draft';
  const parts = [
    estimateType || '',
    initcap(status),
    estimateDate ? String(estimateDate).slice(0, 10) : '',
  ];
  if (estimateAwardYear != null) parts.push(`Award ${estimateAwardYear}`);
  parts.push(formatCurrency(totalAmount));
  return parts.filter(Boolean).join(' • ').slice(0, 140);
}

// Builds the summary + payload shape for a dimension, matching what project-events.js renders.
function buildEventShape(dimType, fields) {
  switch (dimType) {
    case 'note':
      return {
        event_type: 'note.added',
        summary: summarize(fields.body || ''),
        payload: { body_preview: String(fields.body || '').slice(0, 280), parent_note_id: fields.parent_note_id ?? null },
      };
    case 'estimate':
      return {
        event_type: 'estimate.added',
        summary: estimateSummary({
          estimateType: fields.estimate_type,
          status: fields.status,
          estimateDate: fields.estimate_date,
          estimateAwardYear: fields.estimate_award_year,
          totalAmount: fields.total_amount,
        }),
        payload: {
          estimate_type: fields.estimate_type,
          status: fields.status,
          estimate_date: fields.estimate_date,
          estimate_award_year: fields.estimate_award_year,
          total_amount: fields.total_amount,
        },
      };
    case 'comment':
      return {
        event_type: 'comment.added',
        summary: summarize(fields.body || ''),
        payload: { body_preview: String(fields.body || '').slice(0, 280), parent_comment_id: fields.parent_comment_id ?? null },
      };
    default:
      return { event_type: `${dimType}.added`, summary: '', payload: {} };
  }
}

// ---------- Load events + nested comments for a project ----------
// Each note/estimate/comment dimension with display_in_feed=true IS a feed entry.
// No separate feed_event rows needed.
export async function loadEvents({ projectId, typeKey }) {
  const pid = Number(projectId);

  // Determine which dimension types to load (based on tab filter)
  let dimTypes;
  if (typeKey === 'feed') {
    dimTypes = ['note', 'estimate', 'comment'];
  } else {
    const def = EVENT_TYPES.find(t => t.key === typeKey);
    if (!def) throw new Error(`Unknown event type key: ${typeKey}`);
    const eventTypeSet = new Set(Array.isArray(def.eventTypes) ? def.eventTypes : [typeKey]);
    // Map event type prefixes back to dimension types
    dimTypes = ['note', 'estimate', 'comment', 'document'].filter(dt =>
      [...eventTypeSet].some(et => et.startsWith(`${dt}.`))
    );
    if (!dimTypes.length) dimTypes = ['note', 'estimate', 'comment'];
  }

  // Fetch IDs for each type, filtering by project_id (display_in_feed=true is set on all inserts)
  const idLists = await Promise.all(
    dimTypes.map(type => db.findDimensionsByField(type, 'project_id', pid))
  );
  const typedIds = dimTypes.flatMap((type, i) => idLists[i].map(id => ({ id, type })));
  if (!typedIds.length) return [];

  // Load dimension metadata + fields, build event-shaped objects
  const events = await Promise.all(
    typedIds.map(async ({ id, type }) => {
      const { rows: [dim] } = await db.query('dimensions', {
        select: 'id, created_by, created_at',
        filters: [{ key: 'id', op: 'eq', value: id }],
        pageSize: 1,
      });
      const fields = await db.getDimensionFields(id);
      return {
        id,
        subject_id: id,  // the dimension IS the subject (used by estimate task toggle + edit)
        created_at: dim?.created_at,
        actor_id: dim?.created_by,
        ...buildEventShape(type, fields),
      };
    })
  );

  events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Load all comments for each feed item via root_event_id (always points to the root
  // note/estimate/comment dim regardless of threading depth).
  const commentDimIdsByEvent = await Promise.all(
    events.map(e => db.findDimensionsByField('comment', 'root_event_id', e.id))
  );
  const allCommentDimIds = commentDimIdsByEvent.flat();

  const commentObjs = await Promise.all(
    allCommentDimIds.map(async id => {
      const { rows: [dim] } = await db.query('dimensions', {
        select: 'id, created_by, created_at',
        filters: [{ key: 'id', op: 'eq', value: id }],
        pageSize: 1,
      });
      const fields = await db.getDimensionFields(id, ['root_event_id', 'parent_dimension_id', 'body']);
      return { id, author_id: dim?.created_by, created_at: dim?.created_at, ...fields };
    })
  );

  const commentsByEvent = {};
  for (const c of commentObjs) {
    const eid = c.root_event_id;
    if (!eid) continue;
    if (!commentsByEvent[eid]) commentsByEvent[eid] = [];
    commentsByEvent[eid].push(c);
  }

  const commentAuthorIds = commentObjs.map(c => c.author_id).filter(Boolean);
  const actorIds = [...new Set([...events.map(e => e.actor_id), ...commentAuthorIds].filter(Boolean))];
  const { rows: profiles } = actorIds.length ? await db.query('profiles', {
    select: 'user_id, display_name',
    filters: [{ key: 'user_id', op: 'in', value: actorIds }],
    pageSize: null,
  }) : { rows: [] };
  const nameById = Object.fromEntries(profiles.map(p => [p.user_id, p.display_name]));

  return events.map(e => ({
    ...e,
    actor_name: nameById[e.actor_id] || null,
    event_comments: (commentsByEvent[e.id] || []).map(c => ({
      ...c,
      author_name: nameById[c.author_id] || null,
    })),
  }));
}

// ---------- app_add_note ----------
export async function addNote({ projectId, body, parentNoteId = null, clientReqId }) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!body?.trim()) throw new Error('empty note');

  if (clientReqId) {
    const [existingNoteId] = await db.findDimensionsByField('note', 'client_req_id', clientReqId);
    if (existingNoteId) {
      const fields = await db.getDimensionFields(existingNoteId, ['body', 'parent_note_id', 'client_req_id']);
      return { note: { id: existingNoteId, ...fields } };
    }
  }

  const note = await db.createDimension('note', userId, {
    project_id: Number(projectId),
    body,
    parent_note_id: parentNoteId ?? null,
    client_req_id: clientReqId ?? null,
    display_in_feed: true,
  });

  return { note };
}

// ---------- addComment ----------
// Adds a comment to any dimension (note, estimate, document, or another comment).
// parentDimensionId: the immediate parent (feed item or another comment).
// rootEventId: the root feed item — pass the same as parentDimensionId for top-level comments,
//              or the original root when replying to a comment.
export async function addComment({ parentDimensionId, rootEventId, body, clientReqId }) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!body?.trim()) throw new Error('empty comment');

  if (clientReqId) {
    const [existingCommentId] = await db.findDimensionsByField('comment', 'client_req_id', clientReqId);
    if (existingCommentId) {
      const fields = await db.getDimensionFields(existingCommentId);
      return { comment: { id: existingCommentId, ...fields } };
    }
  }

  const resolvedRoot = rootEventId ?? parentDimensionId;

  const comment = await db.createDimension('comment', userId, {
    parent_dimension_id: parentDimensionId,
    root_event_id: resolvedRoot,
    body,
    client_req_id: clientReqId ?? null,
  });

  return { comment };
}

// ---------- loadEstimateTasks ----------
export async function loadEstimateTasks(estimateId) {
  const taskDimIds = await db.findDimensionsByField('estimate_task', 'estimate_id', estimateId);
  const tasks = await Promise.all(
    taskDimIds.map(async id => {
      const fields = await db.getDimensionFields(id, ['sort_order', 'code', 'description', 'amount', 'estimate_id']);
      return { id, ...fields };
    })
  );
  tasks.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return tasks;
}

// ---------- app_add_estimate ----------
// tasks: [{ code, description, amount }] in display order.
// total_amount is computed from task amounts (no DB trigger in the new schema).
export async function addEstimate({
  projectId,
  estimateType,
  status,
  estimateDate,
  estimateAwardYear = null,
  tasks = [],
  clientReqId,
}) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!estimateType?.trim()) throw new Error('estimate_type is required');

  if (clientReqId) {
    const [existingEstimateId] = await db.findDimensionsByField('estimate', 'client_req_id', clientReqId);
    if (existingEstimateId) {
      const fields = await db.getDimensionFields(existingEstimateId);
      return { estimate: { id: existingEstimateId, ...fields } };
    }
  }

  const resolvedStatus = status?.trim() || 'draft';
  const totalAmount = tasks.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const estimate = await db.createDimension('estimate', userId, {
    project_id: Number(projectId),
    status: resolvedStatus,
    estimate_type: estimateType,
    estimate_date: estimateDate,
    estimate_award_year: estimateAwardYear ?? null,
    total_amount: totalAmount,
    client_req_id: clientReqId ?? null,
    display_in_feed: true,
  });

  const insertedTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = await db.createDimension('estimate_task', userId, {
      estimate_id: estimate.id,
      sort_order: i + 1,
      code: tasks[i].code,
      description: tasks[i].description,
      amount: tasks[i].amount,
    });
    insertedTasks.push(task);
  }

  return { estimate: { id: estimate.id, total_amount: totalAmount, status: resolvedStatus, estimate_type: estimateType, estimate_date: estimateDate, estimate_award_year: estimateAwardYear }, tasks: insertedTasks };
}

// ---------- updateEstimate ----------
// Replaces all tasks for an estimate and refreshes the event payload.
export async function updateEstimate({
  estimateId,
  estimateType,
  status,
  estimateDate,
  estimateAwardYear = null,
  tasks = [],
}) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!estimateType?.trim()) throw new Error('estimate_type is required');

  const resolvedStatus = status?.trim() || 'draft';
  const totalAmount = tasks.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  await db.setDimensionFields(estimateId, 'estimate', {
    status: resolvedStatus,
    estimate_type: estimateType,
    estimate_date: estimateDate || null,
    estimate_award_year: estimateAwardYear ?? null,
    total_amount: totalAmount,
  });

  // Sync tasks: update existing, insert new, delete removed
  const existingTasks = await loadEstimateTasks(estimateId);
  const existingIds = new Set(existingTasks.map(t => String(t.id)));
  const submittedIds = new Set(tasks.filter(t => t.id).map(t => String(t.id)));

  for (const task of existingTasks) {
    if (!submittedIds.has(String(task.id))) {
      await db.delete('dimensions_custom_fields_values', 'dimension_id', task.id);
      await db.delete('dimensions', 'id', task.id);
    }
  }

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    if (t.id && existingIds.has(String(t.id))) {
      await db.setDimensionFields(t.id, 'estimate_task', {
        sort_order: i + 1,
        code: t.code,
        description: t.description,
        amount: t.amount,
      });
    } else {
      await db.createDimension('estimate_task', userId, {
        estimate_id: estimateId,
        sort_order: i + 1,
        code: t.code,
        description: t.description,
        amount: t.amount,
      });
    }
  }

  // The estimate dimension itself is the feed item — no separate event row to sync.
  return { estimate: { id: estimateId, status: resolvedStatus, estimate_type: estimateType, estimate_date: estimateDate, estimate_award_year: estimateAwardYear, total_amount: totalAmount } };
}

// ---------- loadEstimatesOverTime ----------
// Returns all estimates for a project ordered by estimate_date ASC,
// each with its tasks pre-loaded (sorted code → description).
export async function loadEstimatesOverTime(projectId) {
  const estimateDimIds = await db.findDimensionsByField('estimate', 'project_id', Number(projectId));
  if (!estimateDimIds.length) return [];

  const estimates = await Promise.all(
    estimateDimIds.map(async id => {
      const fields = await db.getDimensionFields(id, [
        'estimate_type', 'status', 'estimate_date', 'estimate_award_year', 'total_amount',
      ]);
      return { id, ...fields };
    })
  );
  estimates.sort((a, b) => {
    const da = a.estimate_date ? new Date(a.estimate_date) : new Date(0);
    const db_ = b.estimate_date ? new Date(b.estimate_date) : new Date(0);
    return da - db_;
  });

  const estimatesWithTasks = await Promise.all(
    estimates.map(async estimate => {
      const tasks = await loadEstimateTasks(estimate.id);
      tasks.sort((a, b) =>
        String(a.code ?? '').localeCompare(String(b.code ?? ''), undefined, { numeric: true }) ||
        String(a.description ?? '').localeCompare(String(b.description ?? ''))
      );
      return { estimate, tasks };
    })
  );

  return estimatesWithTasks;
}