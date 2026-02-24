// project-manager/project-header.js
// Project header: load, display, and editing of project metadata.

import { db } from '../db/index.js';
import { updateRow, deleteRow } from '../configurator/modules/db.js';

const projectId = new URLSearchParams(location.search).get('project_id');

const titleEl    = document.getElementById('proj-header-title');
const subtitleEl = document.getElementById('proj-subtitle');
const psrEl      = document.getElementById('proj-header-psr');
const planningEl = document.getElementById('proj-header-planning');
const projIdEl   = document.getElementById('proj-header-projid');
const msg        = document.getElementById('page-msg');

const formatCurrency = amt =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt || 0);

export async function loadProjectHeader() {
  msg.textContent = 'Loading project…';
  const { rows: [data] } = await db.query('projects_live', {
    select: 'id, project_title, agency, cip, category, element, project_acep, psr_key, planning_number_prefix, planning_number_suffix, project_id, pse_number',
    filters: [{ key: 'id', op: 'eq', value: projectId }],
    pageSize: 1,
  });

  if (!data) { msg.textContent = 'Project not found.'; return; }

  titleEl.textContent = data.project_title || '—';
  subtitleEl.textContent =
    `Agency ${data.agency ?? '-'} · CIP ${data.cip ?? '-'} · Cat ${data.category ?? '-'} · Elem ${data.element ?? '-'}`;
  psrEl.textContent = data.psr_key || '—';
  planningEl.textContent = [data.planning_number_prefix || '—', data.planning_number_suffix || '']
    .filter(Boolean).join('-');
  projIdEl.textContent = data.project_id || '—';

  const { rows: [latestEst] } = await db.query('estimates', {
    select: 'total_amount',
    filters: [{ key: 'project_id', op: 'eq', value: projectId }],
    order: { col: 'created_at', dir: 'desc' },
    pageSize: 1,
  });
  document.getElementById('proj-header-est-total').textContent =
    latestEst ? formatCurrency(latestEst.total_amount) : '—';

  msg.textContent = '';
  prefillProjectModal(data);
}

function prefillProjectModal(d) {
  const $ = id => document.getElementById(id);
  $('proj-title').value        = d.project_title ?? '';
  $('proj-psr').value          = d.psr_key ?? '';
  $('proj-plan-prefix').value  = d.planning_number_prefix ?? '';
  $('proj-plan-suffix').value  = d.planning_number_suffix ?? '';
  $('proj-projectid').value    = d.project_id ?? '';
  $('proj-pse').value          = d.pse_number ?? '';
  $('proj-agency').value       = d.agency ?? '';
  $('proj-cip').value          = d.cip ?? '';
  $('proj-category').value     = d.category ?? '';
  $('proj-element').value      = d.element ?? '';
  $('proj-acep').value         = d.project_acep ?? '';

  const title = document.getElementById('projectModalTitle');
  if (title) title.textContent = 'Edit Project Details';
  const del = document.getElementById('delete-btn');
  if (del) del.classList.toggle('d-none', !d?.id);
}

export function initProjectHeaderListeners() {
  document.getElementById('proj-header-edit')?.addEventListener('click', () => {
    bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).show();
  });

  document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const $ = id => document.getElementById(id);
    const saveBtn = $('proj-save-btn');
    saveBtn.disabled = true;
    const oldHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Saving…`;

    try {
      const updates = {
        project_title:           $('proj-title').value.trim(),
        psr_key:                 $('proj-psr').value.trim(),
        planning_number_prefix:  $('proj-plan-prefix').value.trim(),
        planning_number_suffix:  $('proj-plan-suffix').value.trim(),
        project_id:              $('proj-projectid').value.trim(),
        pse_number:              $('proj-pse').value.trim(),
        agency:                  $('proj-agency').value.trim(),
        cip:                     $('proj-cip').value ? Number($('proj-cip').value) : null,
        category:                $('proj-category').value ? Number($('proj-category').value) : null,
        element:                 $('proj-element').value.trim(),
        project_acep:            $('proj-acep').value.trim(),
      };

      const updated = await updateRow('projects_live', 'id', projectId, updates);

      titleEl.textContent = updated.project_title || '—';
      subtitleEl.textContent =
        `Agency ${updated.agency ?? '-'} · CIP ${updated.cip ?? '-'} · Cat ${updated.category ?? '-'} · Elem ${updated.element ?? '-'}`;
      psrEl.textContent = updated.psr_key || '—';
      planningEl.textContent = [updated.planning_number_prefix || '—', updated.planning_number_suffix || '']
        .filter((x, i) => i === 0 || x !== '').join('-');
      projIdEl.textContent = updated.project_id || '—';

      bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).hide();
      msg.textContent = 'Project saved.';
    } catch (err) {
      console.error(err);
      msg.textContent = err?.message || 'Save failed.';
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = oldHTML;
    }
  });

  document.getElementById('delete-btn')?.addEventListener('click', async () => {
    try {
      await deleteRow('projects_live', 'id', projectId);
      bootstrap.Modal.getInstance(document.getElementById('projectModal'))?.hide();
      location.replace('./managerDash.html');
    } catch (err) {
      console.error(err);
      msg.textContent = err?.message || 'Delete failed.';
    }
  });
}
