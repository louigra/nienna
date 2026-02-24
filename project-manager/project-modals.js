// project-manager/project-modals.js
// Bootstrap modal wiring: comment, note, estimate, and the Add dropdown.

import { EVENT_TYPES } from './events.config.js';
import { addNote, addEventComment, addEstimate } from './eventService.js';

const projectId = new URLSearchParams(location.search).get('project_id');

// ---------- Add Event Comment Modal ----------

const addCmtModalEl = document.getElementById('addCommentModal');
const addCmtModal   = new bootstrap.Modal(addCmtModalEl);
const addCmtForm    = document.getElementById('add-comment-form');
const cmtBodyEl     = document.getElementById('comment-body');
const parentIdEl    = document.getElementById('parent-comment-id');
const addCmtErrEl   = document.getElementById('add-comment-error');
const addCmtSubmit  = document.getElementById('add-comment-submit');

let currentTargetEventId = null;

export function openAddEventCommentModal(eventId, parentId = null) {
  currentTargetEventId = eventId;
  parentIdEl.value = parentId ? String(parentId) : '';
  addCmtErrEl.classList.add('d-none');
  addCmtErrEl.textContent = '';
  cmtBodyEl.value = '';
  addCmtModal.show();
  setTimeout(() => cmtBodyEl.focus(), 200);
}

cmtBodyEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    addCmtForm.requestSubmit();
  }
});

// ---------- Add Note Modal ----------

const addNoteModalEl = document.getElementById('addNoteModal');
const addNoteModal   = new bootstrap.Modal(addNoteModalEl);
const addNoteForm    = document.getElementById('add-note-form');
const noteBodyEl     = document.getElementById('note-body');
const noteErrEl      = document.getElementById('add-note-error');
const addNoteSubmit  = document.getElementById('add-note-submit');

addNoteModalEl.addEventListener('show.bs.modal', () => {
  noteErrEl.classList.add('d-none');
  noteErrEl.textContent = '';
  noteBodyEl.value = '';
  setTimeout(() => noteBodyEl.focus(), 200);
});

// ---------- Add Estimate Modal ----------

const addEstModalEl   = document.getElementById('addEstimateModal');
const addEstModal     = new bootstrap.Modal(addEstModalEl);
const addEstForm      = document.getElementById('add-estimate-form');
const estTypeEl       = document.getElementById('estimate-type');
const estStatusEl     = document.getElementById('estimate-status');
const estDateEl       = document.getElementById('estimate-date');
const estAwardYearEl  = document.getElementById('estimate-award-year');
const estTaskTbody    = document.getElementById('est-task-tbody');
const estRunningTotal = document.getElementById('est-running-total');
const addTaskRowBtn   = document.getElementById('add-task-row-btn');
const estErrEl        = document.getElementById('add-estimate-error');
const addEstSubmit    = document.getElementById('add-estimate-submit');

const codePattern = /^\d+[A-Za-z]$/i;

function calcRunningTotal() {
  let sum = 0;
  for (const input of estTaskTbody.querySelectorAll('[data-field="amount"]')) {
    sum += parseFloat(input.value) || 0;
  }
  estRunningTotal.textContent =
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sum);
}

function swapRows(rowA, rowB) {
  const parent = rowA.parentNode;
  const siblingA = rowA.nextSibling === rowB ? rowA : rowA.nextSibling;
  parent.insertBefore(rowA, rowB.nextSibling);
  parent.insertBefore(rowB, siblingA);
}

function addTaskRow() {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-1 me-1" data-dir="up" title="Move up">↑</button>
      <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-1" data-dir="down" title="Move down">↓</button>
    </td>
    <td><input type="text" class="form-control form-control-sm" data-field="code" placeholder="3C" style="width:80px" /></td>
    <td><input type="text" class="form-control form-control-sm" data-field="description" placeholder="Description" /></td>
    <td><input type="number" class="form-control form-control-sm text-end" data-field="amount" placeholder="0.00" step="0.01" min="0" style="width:120px" /></td>
    <td><button type="button" class="btn btn-sm btn-outline-danger py-0 px-1" data-action="delete" title="Remove">✕</button></td>
  `;
  tr.querySelector('[data-dir="up"]').addEventListener('click', () => {
    const prev = tr.previousElementSibling;
    if (prev) swapRows(prev, tr);
  });
  tr.querySelector('[data-dir="down"]').addEventListener('click', () => {
    const next = tr.nextElementSibling;
    if (next) swapRows(tr, next);
  });
  tr.querySelector('[data-action="delete"]').addEventListener('click', () => {
    tr.remove();
    calcRunningTotal();
  });
  tr.querySelector('[data-field="amount"]').addEventListener('input', calcRunningTotal);
  estTaskTbody.appendChild(tr);
  tr.querySelector('[data-field="code"]').focus();
}

addTaskRowBtn.addEventListener('click', addTaskRow);

addEstModalEl.addEventListener('show.bs.modal', () => {
  estTypeEl.value = '';
  estStatusEl.value = 'draft';
  estDateEl.value = '';
  estAwardYearEl.value = '';
  estTaskTbody.innerHTML = '';
  estRunningTotal.textContent = '$0.00';
  estErrEl.classList.add('d-none');
  estErrEl.textContent = '';
});

// ---------- Modal submit handlers ----------
// Call initModals({ onEventsChanged, getActiveTypeKey }) from the boot sequence to wire up submits.
// onEventsChanged(typeKey) is called after a successful submission to reload the event list.

export function initModals({ onEventsChanged, getActiveTypeKey }) {
  addCmtForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = (cmtBodyEl.value || '').trim();
    if (!body || !currentTargetEventId) { cmtBodyEl.focus(); return; }

    addCmtSubmit.disabled = true;
    try {
      await addEventComment({
        eventId: currentTargetEventId,
        body,
        parentCommentId: parentIdEl.value ? Number(parentIdEl.value) : null,
        clientReqId: crypto.randomUUID(),
      });
      addCmtModal.hide();
      await onEventsChanged(getActiveTypeKey());
    } catch (err) {
      addCmtErrEl.textContent = err?.message || 'Failed to post comment.';
      addCmtErrEl.classList.remove('d-none');
    } finally {
      addCmtSubmit.disabled = false;
    }
  });

  addNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = (noteBodyEl.value || '').trim();
    if (!body) { noteBodyEl.focus(); return; }

    addNoteSubmit.disabled = true;
    try {
      await addNote({
        projectId: Number(projectId),
        body,
        clientReqId: crypto.randomUUID(),
      });
      addNoteModal.hide();
      await onEventsChanged(getActiveTypeKey());
    } catch (err) {
      noteErrEl.textContent = err?.message || 'Failed to add note.';
      noteErrEl.classList.remove('d-none');
    } finally {
      addNoteSubmit.disabled = false;
    }
  });

  addEstForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const estimateType = estTypeEl.value;
    if (!estimateType) { estTypeEl.focus(); return; }

    const taskRows = [...estTaskTbody.querySelectorAll('tr')];
    const tasks = [];
    for (const row of taskRows) {
      const code        = row.querySelector('[data-field="code"]').value.trim();
      const description = row.querySelector('[data-field="description"]').value.trim();
      const amount      = parseFloat(row.querySelector('[data-field="amount"]').value) || 0;
      if (!codePattern.test(code)) {
        estErrEl.textContent = `Invalid code "${code}" — must be digit(s) followed by a single letter (e.g. 3C).`;
        estErrEl.classList.remove('d-none');
        row.querySelector('[data-field="code"]').focus();
        return;
      }
      tasks.push({ code, description, amount });
    }

    estErrEl.classList.add('d-none');
    addEstSubmit.disabled = true;
    try {
      await addEstimate({
        projectId: Number(projectId),
        estimateType,
        status: estStatusEl.value || 'draft',
        estimateDate: estDateEl.value || null,
        estimateAwardYear: estAwardYearEl.value ? Number(estAwardYearEl.value) : null,
        tasks,
        clientReqId: crypto.randomUUID(),
      });
      addEstModal.hide();
      await onEventsChanged(getActiveTypeKey());
    } catch (err) {
      estErrEl.textContent = err?.message || 'Failed to add estimate.';
      estErrEl.classList.remove('d-none');
    } finally {
      addEstSubmit.disabled = false;
    }
  });
}

// ---------- Config-driven Add dropdown ----------

const modalRegistry = {};

export function buildAddDropdown() {
  const dropdownEl = document.getElementById('add-event-dropdown');
  dropdownEl.innerHTML = '';
  for (const t of EVENT_TYPES) {
    if (!t.createLabel || !t.modalId) continue;
    if (!modalRegistry[t.modalId]) {
      const el = document.getElementById(t.modalId);
      if (el) modalRegistry[t.modalId] = bootstrap.Modal.getOrCreateInstance(el);
    }
    const li  = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dropdown-item';
    btn.innerHTML = `<i class="bi bi-${t.icon} me-2"></i>${t.createLabel}`;
    btn.addEventListener('click', () => modalRegistry[t.modalId]?.show());
    li.appendChild(btn);
    dropdownEl.appendChild(li);
  }
}
