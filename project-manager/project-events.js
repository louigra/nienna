// project-manager/project-events.js
// Left rail navigation, event loading, event card rendering, and comment threads.

import { EVENT_TYPES } from './events.config.js';
import { loadEvents, loadEstimateTasks, loadEstimatesOverTime } from './eventService.js';

const projectId = new URLSearchParams(location.search).get('project_id');

const listEl  = document.getElementById('event-types-list');
const content = document.getElementById('content-wrap');
const msg     = document.getElementById('page-msg');

// ---------- Navigation ----------

export function buildNav() {
  listEl.innerHTML = '';

  const feed = document.createElement('a');
  feed.href = '#feed';
  feed.className = 'list-group-item list-group-item-action d-flex align-items-center gap-2';
  feed.setAttribute('role', 'tab');
  feed.dataset.key = 'feed';
  feed.innerHTML = `<i class="bi bi-newspaper"></i><span>Feed</span>`;
  listEl.appendChild(feed);

  for (const t of EVENT_TYPES) {
    const a = document.createElement('a');
    a.href = `#${encodeURIComponent(t.key)}`;
    a.className = 'list-group-item list-group-item-action d-flex align-items-center gap-2';
    a.setAttribute('role', 'tab');
    a.dataset.key = t.key;
    a.innerHTML = `<i class="bi bi-${t.icon || 'collection'}"></i><span>${t.label}</span>`;
    listEl.appendChild(a);
  }

  const eot = document.createElement('a');
  eot.href = '#estimates-over-time';
  eot.className = 'list-group-item list-group-item-action d-flex align-items-center gap-2';
  eot.setAttribute('role', 'tab');
  eot.dataset.key = 'estimates-over-time';
  eot.innerHTML = `<i class="bi bi-graph-up-arrow"></i><span>Est. Over Time</span>`;
  listEl.appendChild(eot);
}

export function getActiveTypeKey() {
  const key = (location.hash || '').replace(/^#/, '');
  return key || 'feed';
}

export function setActiveLink() {
  const active = getActiveTypeKey();
  [...listEl.children].forEach(a => {
    a.classList.toggle('active', a.dataset.key === active);
  });
}

// ---------- Event loading ----------

export async function loadEventsForType(typeKey, onComment, onEditEstimate) {
  msg.textContent = 'Loading…';
  try {
    if (typeKey === 'estimates-over-time') {
      const data = await loadEstimatesOverTime(projectId);
      renderEstimatesOverTime(data);
    } else {
      const events = await loadEvents({ projectId, typeKey });
      renderEventsWithComments(events, onComment, onEditEstimate);
    }
  } catch (err) {
    content.innerHTML = `<div class="text-danger">${err.message}</div>`;
  }
  msg.textContent = '';
}

// ---------- Utilities ----------

export function escapeHtml(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const formatCurrency = amt =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt || 0);

const ESTIMATE_TYPE_COLORS   = { profile: '#0d6efd', ipb: '#b45309', upb: '#c2410c', rta: '#7c3aed', bid: '#0891b2' };
const ESTIMATE_STATUS_COLORS = { draft: '#4b5563', active: '#0891b2', approved: '#16a34a', archived: '#374151' };

// ---------- Per-type card body renderers ----------

function noteBody(ev) {
  const text = ev.payload?.body_preview || ev.summary || '';
  return text ? `<div class="small text-light">${escapeHtml(text)}</div>` : '';
}

function estimateBody(ev) {
  const p = ev.payload || {};
  return `
    <div class="small d-flex flex-wrap gap-3 text-light mt-1">
      <span><span class="text-secondary">Type</span> ${escapeHtml(p.estimate_type || '—')}</span>
      <span><span class="text-secondary">Status</span> ${escapeHtml(p.status || '—')}</span>
      <span><span class="text-secondary">Date</span> ${escapeHtml(p.estimate_date ? String(p.estimate_date) : '—')}</span>
      ${p.estimate_award_year ? `<span><span class="text-secondary">Award</span> ${p.estimate_award_year}</span>` : ''}
      <span><span class="text-secondary">Total</span> ${formatCurrency(p.total_amount)}</span>
    </div>
    <div class="mt-2">
      <button class="btn btn-sm btn-outline-secondary est-tasks-toggle"
              data-estimate-id="${ev.subject_id}" data-loaded="false">
        <i class="bi bi-list-task me-1"></i>Show tasks
      </button>
      <div class="est-tasks-panel mt-2 d-none"></div>
    </div>`;
}

function renderTaskTable(tasks) {
  if (!tasks.length) return '<div class="small text-secondary">No tasks.</div>';
  const rows = tasks.map(t => `
    <tr>
      <td class="text-secondary">${escapeHtml(t.code || '')}</td>
      <td>${escapeHtml(t.description || '')}</td>
      <td class="text-end">${formatCurrency(t.amount)}</td>
    </tr>`).join('');
  return `<table class="table table-dark table-sm mb-0" style="font-size:.8rem">
    <thead><tr>
      <th style="width:80px">Code</th>
      <th>Description</th>
      <th class="text-end" style="width:110px">Amount</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function defaultBody(ev) {
  const summary = ev.summary || '';
  const details = ev.payload?.body_preview || '';
  return `
    ${summary ? `<div class="small">${escapeHtml(summary)}</div>` : ''}
    ${details && details !== summary ? `<div class="small text-secondary mt-1">${escapeHtml(details)}</div>` : ''}`;
}

const eventBodyRenderers = {
  'note.added':     noteBody,
  'estimate.added': estimateBody,
};

// ---------- Title / icon helpers ----------

const eventTitleRenderers = {
  'note.added':     (ev) => escapeHtml(ev.actor_name || 'Note'),
  'estimate.added': (ev) => {
    const p = ev.payload || {};
    const base = 'padding:.15em .5em;border-radius:.35em;font-size:1.05rem;font-weight:600;margin-right:.3em';

    const typeBg   = ESTIMATE_TYPE_COLORS[(p.estimate_type||'').toLowerCase()]   ?? '#4b5563';
    const statusBg = ESTIMATE_STATUS_COLORS[(p.status||'').toLowerCase()]        ?? '#4b5563';

    const typeBadge   = p.estimate_type
      ? `<span style="${base};background:${typeBg};color:#fff">${escapeHtml(p.estimate_type)}</span>`
      : '';
    const statusBadge = p.status
      ? `<span style="${base};background:${statusBg};color:#fff">${escapeHtml(p.status)}</span>`
      : '';
    const dateBadge   = p.estimate_date
      ? `<span style="${base};background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#d1d5db">${escapeHtml(String(p.estimate_date).slice(0,10))}</span>`
      : '';

    return typeBadge + statusBadge + dateBadge || 'Estimate';
  },
};

function titleForEvent(ev) {
  const renderer = eventTitleRenderers[ev.event_type];
  if (renderer) return renderer(ev);
  return escapeHtml(ev.summary || ev.payload?.title || ev.payload?.filename || ev.event_type);
}

function iconForEvent(ev) {
  const key = ev.event_type;
  const def = EVENT_TYPES.find(t => t.key === key || t.eventTypes?.includes?.(key));
  return def?.icon || 'circle';
}

// ---------- Event card renderer ----------

export function renderEventsWithComments(rows, onComment, onEditEstimate) {
  if (!rows.length) {
    content.innerHTML = `<div class="text-secondary">No events yet.</div>`;
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'd-flex flex-column gap-3';

  for (const ev of rows) {
    const card = document.createElement('div');
    card.className = 'rounded-3 overflow-hidden';
    card.style.background = 'rgba(18,20,25,.7)';
    card.style.border = '1px solid rgba(255,255,255,.08)';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center px-3 py-2';
    header.style.cssText = 'background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.08);font-size:1.05rem';
    header.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-${iconForEvent(ev)}"></i>
        <strong>${titleForEvent(ev)}</strong>
      </div>
      <small class="text-secondary" style="font-size:.8rem">${new Date(ev.created_at).toLocaleString()}</small>
    `;

    const body = document.createElement('div');
    body.className = 'text-light px-3 pt-2';
    const renderBody = eventBodyRenderers[ev.event_type] ?? defaultBody;
    body.innerHTML = renderBody(ev);

    if (ev.event_type === 'estimate.added') {
      const toggleBtn = body.querySelector('.est-tasks-toggle');
      const panel     = body.querySelector('.est-tasks-panel');
      if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', async () => {
          const isOpen = !panel.classList.contains('d-none');
          if (isOpen) {
            panel.classList.add('d-none');
            toggleBtn.innerHTML = '<i class="bi bi-list-task me-1"></i>Show tasks';
            return;
          }
          if (toggleBtn.dataset.loaded === 'false') {
            toggleBtn.disabled = true;
            toggleBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Loading…';
            try {
              const tasks = await loadEstimateTasks(Number(toggleBtn.dataset.estimateId));
              panel.innerHTML = renderTaskTable(tasks);
              toggleBtn.dataset.loaded = 'true';
            } catch {
              panel.innerHTML = '<div class="small text-danger">Failed to load tasks.</div>';
            } finally {
              toggleBtn.disabled = false;
            }
          }
          panel.classList.remove('d-none');
          toggleBtn.innerHTML = '<i class="bi bi-list-task me-1"></i>Hide tasks';
        });
      }
    }

    const actions = document.createElement('div');
    actions.className = 'mt-2 px-3 pb-3 d-flex gap-2';
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-sm btn-outline-light';
    addBtn.innerHTML = `<i class="bi bi-chat-dots"></i> Comment`;
    addBtn.addEventListener('click', () => onComment?.(ev.id, ev.id));
    actions.appendChild(addBtn);

    if (ev.event_type === 'estimate.added') {
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-outline-secondary';
      editBtn.innerHTML = `<i class="bi bi-pencil"></i> Edit`;
      editBtn.addEventListener('click', () => onEditEstimate?.(ev.subject_id, ev.payload || {}));
      actions.appendChild(editBtn);
    }

    const comments = Array.isArray(ev.event_comments) ? ev.event_comments.slice() : [];
    // For replies: parentDimensionId = the comment being replied to; rootEventId = the feed item
    const thread = renderCommentThread(comments, (commentId) => onComment?.(commentId, ev.id));

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(actions);
    if (thread) {
      const hr = document.createElement('hr');
      hr.className = 'text-secondary';
      hr.style.cssText = 'opacity:.2;margin:0';
      card.appendChild(hr);
      const threadWrap = document.createElement('div');
      threadWrap.className = 'px-3 pt-2 pb-3';
      threadWrap.appendChild(thread);
      card.appendChild(threadWrap);
    }
    wrap.appendChild(card);
  }

  content.innerHTML = '';
  content.appendChild(wrap);
}

// ---------- Comment thread renderer ----------

function renderCommentThread(rows, onReply) {
  if (!rows.length) return null;

  const byId = new Map();
  const kids = new Map();
  for (const r of rows) { byId.set(r.id, r); kids.set(r.id, []); }
  const roots = [];
  for (const r of rows) {
    const pid = r.parent_dimension_id;
    if (pid && byId.has(pid)) kids.get(pid).push(r);
    else roots.push(r);
  }
  const byDateAsc = (a, b) => new Date(a.created_at) - new Date(b.created_at);
  roots.sort(byDateAsc);
  for (const arr of kids.values()) arr.sort(byDateAsc);

  const wrap = document.createElement('div');
  wrap.className = 'comment-thread d-flex flex-column gap-3';

  function card(c) {
    const el = document.createElement('div');
    el.className = 'comment-card p-3';
    el.innerHTML = `
      <div class="d-flex justify-content-between align-items-baseline mb-1 meta">
        <div>${escapeHtml(c.author_name || c.author_id?.slice(0, 8) || '?')}</div>
        <small class="text-secondary">${new Date(c.created_at).toLocaleString()}</small>
      </div>
      <div class="comment-body">${escapeHtml(c.body || '')}</div>
      <div class="comment-actions mt-2">
        <button class="btn btn-outline-light btn-sm"><i class="bi bi-reply"></i> Reply</button>
      </div>
    `;
    el.querySelector('button').addEventListener('click', () => onReply?.(c.id));
    return el;
  }

  function node(c) {
    const block = document.createElement('div');
    block.appendChild(card(c));
    const ch = kids.get(c.id) || [];
    if (ch.length) {
      const grp = document.createElement('div');
      grp.className = 'children mt-3 d-flex flex-column gap-3';
      ch.forEach(k => grp.appendChild(node(k)));
      block.appendChild(grp);
    }
    return block;
  }

  roots.forEach(r => wrap.appendChild(node(r)));
  return wrap;
}

// ---------- Estimates Over Time renderer ----------
// Pivot table: columns = estimates (ordered by date), rows = task codes

function renderEstimatesOverTime(data) {
  if (!data.length) {
    content.innerHTML = '<div class="text-secondary">No estimates yet.</div>';
    return;
  }

  const pill = 'padding:.1em .4em;border-radius:.3em;font-size:.7rem;font-weight:600;display:inline-block;margin-bottom:.15em';

  // Collect unique code+description pairs across all estimates
  const pairSet = new Map(); // "code||desc" → { code, description }
  for (const { tasks } of data) {
    for (const t of tasks) {
      const key = `${t.code}||${t.description || ''}`;
      if (!pairSet.has(key)) pairSet.set(key, { code: t.code, description: t.description || '' });
    }
  }
  const allPairs = [...pairSet.values()].sort((a, b) =>
    a.code.localeCompare(b.code, undefined, { numeric: true }) ||
    a.description.localeCompare(b.description)
  );

  // Per-estimate: "code||description" → amount lookup
  const cols = data.map(({ estimate, tasks }) => {
    const map = new Map(tasks.map(t => [`${t.code}||${t.description || ''}`, t.amount]));
    return { estimate, map };
  });

  // Header row
  let thead = '<tr><th style="width:60px">Code</th><th>Description</th>';
  for (const { estimate: e } of cols) {
    const typeBg   = ESTIMATE_TYPE_COLORS[(e.estimate_type || '').toLowerCase()]   ?? '#4b5563';
    const statusBg = ESTIMATE_STATUS_COLORS[(e.status || '').toLowerCase()]        ?? '#4b5563';
    const dateStr  = e.estimate_date ? String(e.estimate_date).slice(0, 10) : '—';
    thead += `
      <th class="text-end" style="min-width:120px;vertical-align:top">
        <div><span style="${pill};background:${typeBg};color:#fff">${escapeHtml(e.estimate_type || '—')}</span></div>
        <div><span style="${pill};background:${statusBg};color:#fff">${escapeHtml(e.status || '—')}</span></div>
        <div class="text-secondary" style="font-size:.75rem;font-weight:400">${escapeHtml(dateStr)}</div>
      </th>`;
  }
  thead += '</tr>';

  // Task rows
  let tbody = '';
  for (const { code, description } of allPairs) {
    const key = `${code}||${description}`;
    tbody += `<tr>
      <td class="text-secondary">${escapeHtml(code)}</td>
      <td>${escapeHtml(description)}</td>`;
    for (const { map } of cols) {
      const amt = map.get(key);
      tbody += amt != null
        ? `<td class="text-end">${formatCurrency(amt)}</td>`
        : `<td></td>`;
    }
    tbody += '</tr>';
  }

  // Total row
  tbody += `<tr style="border-top:2px solid rgba(255,255,255,.2);font-weight:600">
    <td colspan="2" class="text-end pe-3 text-secondary" style="font-size:.75rem;letter-spacing:.04em;text-transform:uppercase">Total</td>`;
  for (const { estimate: e } of cols) {
    tbody += `<td class="text-end">${formatCurrency(e.total_amount || 0)}</td>`;
  }
  tbody += '</tr>';

  content.innerHTML = `
    <div style="overflow-x:auto">
      <table class="table table-dark table-sm mb-0" style="font-size:.85rem">
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>`;
}
