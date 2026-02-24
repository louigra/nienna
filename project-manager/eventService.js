// project-manager/eventService.js
// JavaScript implementations of the event-related stored procedures.
// All DB access goes through the adapter in db/index.js — no direct Supabase calls.

import { db } from '../db/index.js';
import { EVENT_TYPES } from './events.config.js';

// Replicates: left(regexp_replace(body, '\s+', ' ', 'g'), 140)
function summarize(text) {
  return (text || '').replace(/\s+/g, ' ').trim().slice(0, 140);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

function estimateSummary({ estimateType, status, estimateDate, estimateAwardYear, totalAmount }) {
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

// ---------- Load events + nested comments for a project ----------
// Replaces the direct supabase query in project.html loadEventsForType().
// Does two queries (events, then event_comments) and joins in JS so the
// query format is not tied to PostgREST's nested-select syntax.
export async function loadEvents({ projectId, typeKey }) {
  const filters = [
    { key: 'project_id', op: 'eq', value: projectId },
    { key: 'event_type', op: 'neq', value: 'comment.added' },
  ];

  if (typeKey !== 'feed') {
    const def = EVENT_TYPES.find(t => t.key === typeKey);
    if (!def) throw new Error(`Unknown event type key: ${typeKey}`);
    const types = Array.isArray(def.eventTypes) && def.eventTypes.length
      ? def.eventTypes
      : [typeKey];
    filters.push({ key: 'event_type', op: 'in', value: types });
  }

  const { rows: events } = await db.query('events', {
    select: 'id, project_id, actor_id, event_type, subject_table, subject_id, summary, payload, created_at',
    filters,
    order: { col: 'created_at', dir: 'desc' },
    pageSize: null,
  });

  if (!events.length) return events;

  const eventIds = events.map(e => e.id);
  const { rows: comments } = await db.query('event_comments', {
    select: 'id, event_id, author_id, body, parent_comment_id, created_at',
    filters: [{ key: 'event_id', op: 'in', value: eventIds }],
    pageSize: null,
  });

  const commentsByEvent = {};
  for (const c of comments) {
    if (!commentsByEvent[c.event_id]) commentsByEvent[c.event_id] = [];
    commentsByEvent[c.event_id].push(c);
  }

  return events.map(e => ({ ...e, event_comments: commentsByEvent[e.id] || [] }));
}

// ---------- app_add_note ----------
export async function addNote({ projectId, body, parentNoteId = null, clientReqId }) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!body?.trim()) throw new Error('empty note');

  if (clientReqId) {
    const existing = await db.findOne('notes', 'client_req_id', clientReqId);
    if (existing) {
      const { rows: [event] } = await db.query('events', {
        filters: [
          { key: 'subject_id', op: 'eq', value: existing.id },
          { key: 'subject_table', op: 'eq', value: 'notes' },
        ],
        pageSize: 1,
      });
      return { note: existing, event: event ?? null };
    }
  }

  const note = await db.insert('notes', {
    project_id: projectId,
    author_id: userId,
    body,
    parent_note_id: parentNoteId,
    client_req_id: clientReqId ?? null,
  });

  const event = await db.insert('events', {
    project_id: projectId,
    actor_id: userId,
    event_type: 'note.added',
    subject_table: 'notes',
    subject_id: note.id,
    summary: summarize(body),
    payload: { body_preview: body.slice(0, 280), parent_note_id: parentNoteId },
    client_req_id: clientReqId ?? null,
  });

  return { note, event };
}

// ---------- app_add_event_comment ----------
export async function addEventComment({ eventId, body, parentCommentId = null, clientReqId }) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!body?.trim()) throw new Error('empty comment');

  if (clientReqId) {
    const existing = await db.findOne('event_comments', 'client_req_id', clientReqId);
    if (existing) {
      const { rows: [feedEvent] } = await db.query('events', {
        filters: [
          { key: 'subject_id', op: 'eq', value: existing.id },
          { key: 'subject_table', op: 'eq', value: 'event_comments' },
        ],
        pageSize: 1,
      });
      return { comment: existing, feedEvent: feedEvent ?? null };
    }
  }

  // Need the parent event's project_id and event_type to build the feed entry
  const parentEvent = await db.findOne('events', 'id', eventId, 'id, project_id, event_type');
  if (!parentEvent) throw new Error(`event ${eventId} not found`);

  const comment = await db.insert('event_comments', {
    event_id: eventId,
    author_id: userId,
    body,
    parent_comment_id: parentCommentId ?? null,
    client_req_id: clientReqId ?? null,
  });

  const feedEvent = await db.insert('events', {
    project_id: parentEvent.project_id,
    actor_id: userId,
    event_type: 'comment.added',
    subject_table: 'event_comments',
    subject_id: comment.id,
    summary: summarize(body),
    payload: {
      body_preview: body.slice(0, 280),
      parent_comment_id: parentCommentId,
      on_event_id: eventId,
      on_event_type: parentEvent.event_type,
    },
    client_req_id: clientReqId ?? null,
  });

  return { comment, feedEvent };
}

// ---------- app_add_comment (top-level project comment) ----------
export async function addComment({ projectId, body, parentCommentId = null, clientReqId }) {
  const userId = await db.getUserId();
  if (!userId) throw new Error('not authenticated');
  if (!body?.trim()) throw new Error('empty comment');

  if (clientReqId) {
    const existing = await db.findOne('comments', 'client_req_id', clientReqId);
    if (existing) {
      const { rows: [event] } = await db.query('events', {
        filters: [
          { key: 'subject_id', op: 'eq', value: existing.id },
          { key: 'subject_table', op: 'eq', value: 'comments' },
        ],
        pageSize: 1,
      });
      return { comment: existing, event: event ?? null };
    }
  }

  const comment = await db.insert('comments', {
    project_id: projectId,
    author_id: userId,
    body,
    parent_comment_id: parentCommentId ?? null,
    client_req_id: clientReqId ?? null,
  });

  const event = await db.insert('events', {
    project_id: projectId,
    actor_id: userId,
    event_type: 'comment.added',
    subject_table: 'comments',
    subject_id: comment.id,
    summary: summarize(body),
    payload: {
      body_preview: body.slice(0, 280),
      parent_comment_id: parentCommentId,
    },
    client_req_id: clientReqId ?? null,
  });

  return { comment, event };
}

// ---------- loadEstimateTasks ----------
export async function loadEstimateTasks(estimateId) {
  const { rows } = await db.query('estimate_tasks', {
    select: 'id, sort_order, code, description, amount',
    filters: [{ key: 'estimate_id', op: 'eq', value: estimateId }],
    order: { col: 'sort_order', dir: 'asc' },
    pageSize: null,
  });
  return rows;
}

// ---------- app_add_estimate ----------
// tasks: [{ code, description, amount }] in display order.
// total_amount on the estimate is maintained by a DB trigger that fires
// when estimate_tasks rows are inserted, so we re-fetch after inserting
// tasks to get the correct total before writing the feed event.
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
    const { rows: [existingEvent] } = await db.query('events', {
      filters: [
        { key: 'client_req_id', op: 'eq', value: clientReqId },
        { key: 'subject_table', op: 'eq', value: 'estimates' },
        { key: 'event_type', op: 'eq', value: 'estimate.added' },
      ],
      pageSize: 1,
    });
    if (existingEvent) {
      const estimate = await db.findOne('estimates', 'id', existingEvent.subject_id);
      return { estimate, event: existingEvent };
    }
  }

  const resolvedStatus = status?.trim() || 'draft';

  const estimate = await db.insert('estimates', {
    project_id: projectId,
    author_id: userId,
    status: resolvedStatus,
    estimate_type: estimateType,
    estimate_date: estimateDate,
    estimate_award_year: estimateAwardYear,
    total_amount: 0,
  });

  // Insert tasks in order — the DB trigger updates estimate.total_amount after each insert
  const insertedTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    console.log(`Inserting task ${i + 1}/${tasks.length} for estimate ${estimate.id}`);
    const task = await db.insert('estimate_tasks', {
      estimate_id: estimate.id,
      sort_order: i + 1,
      code: tasks[i].code,
      description: tasks[i].description,
      amount: tasks[i].amount,
      created_by: userId,
    });
    insertedTasks.push(task);
  }

  // Re-fetch estimate so the trigger-updated total_amount is reflected in the event
  const updatedEstimate = await db.findOne('estimates', 'id', estimate.id) ?? estimate;

  const summary = estimateSummary({
    estimateType,
    status: resolvedStatus,
    estimateDate,
    estimateAwardYear,
    totalAmount: updatedEstimate.total_amount ?? 0,
  });

  const event = await db.insert('events', {
    project_id: projectId,
    actor_id: userId,
    event_type: 'estimate.added',
    subject_table: 'estimates',
    subject_id: updatedEstimate.id,
    summary,
    payload: {
      status: updatedEstimate.status,
      estimate_type: updatedEstimate.estimate_type,
      estimate_date: updatedEstimate.estimate_date,
      estimate_award_year: updatedEstimate.estimate_award_year,
      total_amount: updatedEstimate.total_amount,
    },
    client_req_id: clientReqId ?? null,
  });

  return { estimate: updatedEstimate, event, tasks: insertedTasks };
}