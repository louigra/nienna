// project-manager/project-events.js
// Left rail navigation, event loading, event card rendering, and comment threads.

import { EVENT_TYPES } from './events.config.js';
import { loadEvents, loadEstimateTasks } from './eventService.js';

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

export async function loadEventsForType(typeKey, onComment) {
  msg.textContent = 'Loading…';
  try {
    const events = await loadEvents({ projectId, typeKey });
    renderEventsWithComments(events, onComment);
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
    const parts = [
      escapeHtml(p.status || ''),
      escapeHtml(p.estimate_type || ''),
      escapeHtml(p.estimate_date ? String(p.estimate_date).slice(0, 10) : ''),
    ].filter(Boolean);
    return parts.join(' · ') || 'Estimate';
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

export function renderEventsWithComments(rows, onComment) {
  if (!rows.length) {
    content.innerHTML = `<div class="text-secondary">No events yet.</div>`;
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'd-flex flex-column gap-3';

  for (const ev of rows) {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-3';
    card.style.background = 'rgba(18,20,25,.7)';
    card.style.border = '1px solid rgba(255,255,255,.08)';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-baseline';
    header.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-${iconForEvent(ev)}"></i>
        <strong>${titleForEvent(ev)}</strong>
      </div>
      <small class="text-secondary">${new Date(ev.created_at).toLocaleString()}</small>
    `;

    const body = document.createElement('div');
    body.className = 'mt-1 text-light';
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
    actions.className = 'mt-2';
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-sm btn-outline-light';
    addBtn.innerHTML = `<i class="bi bi-chat-dots"></i> Comment`;
    addBtn.addEventListener('click', () => onComment?.(ev.id, null));
    actions.appendChild(addBtn);

    const comments = Array.isArray(ev.event_comments) ? ev.event_comments.slice() : [];
    const thread = renderCommentThread(comments, (parentId) => onComment?.(ev.id, parentId));

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(actions);
    if (thread) {
      const hr = document.createElement('hr');
      hr.className = 'text-secondary';
      hr.style.opacity = .2;
      hr.style.margin = '12px 0';
      card.appendChild(hr);
      card.appendChild(thread);
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
    const pid = r.parent_comment_id;
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
