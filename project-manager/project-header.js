// project-manager/project-header.js
// Project header: load, display, and editing of project metadata.

import { db } from '../db/index.js';
import { getOfficialBudget } from './demo-data.js';

const projectId = new URLSearchParams(location.search).get('project_id');

const titleEl    = document.getElementById('proj-header-title');
const psrEl      = document.getElementById('proj-header-psr');
const planningEl = document.getElementById('proj-header-planning');
const projIdEl   = document.getElementById('proj-header-projid');
const msg        = document.getElementById('page-msg');

const formatCurrency = amt =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt || 0);

export async function loadProjectHeader() {
  msg.textContent = 'Loading project…';

  const { rows: [dim] } = await db.query('dimensions', {
    select: 'id',
    filters: [
      { key: 'id', op: 'eq', value: projectId },
      { key: 'dimension_type', op: 'eq', value: 'project' },
    ],
    pageSize: 1,
  });
  if (!dim) { msg.textContent = 'Project not found.'; return; }

  const fields = await db.getDimensionFields(projectId, [
    'project_title', 'agency', 'cip', 'category', 'element', 'project_acep',
    'psr_key', 'planning_number_prefix', 'planning_number_suffix', 'project_id', 'pse_number',
  ]);
  const data = { id: Number(projectId), ...fields };

  titleEl.textContent = data.project_title || '—';
  psrEl.textContent = data.psr_key || '—';
  planningEl.textContent = [data.planning_number_prefix || '—', data.planning_number_suffix || '']
    .filter(Boolean).join('-');
  projIdEl.textContent = data.project_id || '—';

  const acepBase = [
    data.agency   != null ? String(data.agency)                           : null,
    data.cip      != null ? String(data.cip)                              : null,
    data.category != null ? String(data.category).padStart(2, '0')        : null,
    data.element  != null ? String(data.element).padStart(2, '0')         : null,
  ].filter(Boolean).join('');
  const acepCode = acepBase && data.project_acep
    ? `${acepBase}/${data.project_acep}`
    : acepBase || data.project_acep || '';
  const acepBadge = document.getElementById('proj-acep-badge');
  if (acepCode) {
    document.getElementById('proj-header-acep').textContent = acepCode;
    acepBadge.style.display = '';
  }

  // Find the most recent estimate dimension for this project.
  // We fetch all estimates for the project, pick the one with the latest estimate_date.
  const estimateDimIds = await db.findDimensionsByField('estimate', 'project_id', Number(projectId));
  let latestEstTotal = null;
  if (estimateDimIds.length) {
    const estimateFieldRows = await Promise.all(
      estimateDimIds.map(id => db.getDimensionFields(id, ['estimate_date', 'total_amount']))
    );
    estimateFieldRows.sort((a, b) => {
      const da = a.estimate_date ? new Date(a.estimate_date) : new Date(0);
      const db_ = b.estimate_date ? new Date(b.estimate_date) : new Date(0);
      return db_ - da;
    });
    latestEstTotal = estimateFieldRows[0]?.total_amount ?? null;
  }
  document.getElementById('proj-header-est-total').textContent =
    latestEstTotal != null ? formatCurrency(latestEstTotal) : '—';

  const officialBudget = getOfficialBudget(projectId);
  document.getElementById('proj-header-official-budget').textContent =
    formatCurrency(officialBudget.total);

  const milestonesEl = document.getElementById('proj-milestones');
  milestonesEl.innerHTML = Object.entries(officialBudget.milestone_dates || {}).map(([label, iso]) => {
    const d = new Date(iso + 'T00:00:00');
    const fmt = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:.4rem;padding:.3rem .6rem;text-align:center;min-width:5.5rem">
      <div class="text-secondary" style="font-size:.65rem;line-height:1.3;text-transform:uppercase;letter-spacing:.05em">${label}</div>
      <div style="font-size:.8rem;font-weight:500;line-height:1.4">${fmt}</div>
    </div>`;
  }).join('');

  const varianceEl = document.getElementById('proj-header-variance');
  if (latestEstTotal != null) {
    const diff = latestEstTotal - officialBudget.total;
    const sign = diff >= 0 ? '+' : '−';
    const abs  = formatCurrency(Math.abs(diff));
    varianceEl.textContent = `${sign} ${abs}`;
    varianceEl.className   = `badge ms-1 ${diff > 0 ? 'text-bg-danger' : 'text-bg-success'}`;
  } else {
    varianceEl.textContent = '';
  }

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

    const strOrNull = v => { const s = (v ?? '').toString().trim(); return s === '' ? null : s; };
    const numOrNull = v => { const s = (v ?? '').toString().trim(); if (!s) return null; const n = Number(s); return isNaN(n) ? null : n; };

    try {
      const updates = {
        project_title:           strOrNull($('proj-title').value),
        psr_key:                 strOrNull($('proj-psr').value),
        planning_number_prefix:  strOrNull($('proj-plan-prefix').value),
        planning_number_suffix:  strOrNull($('proj-plan-suffix').value),
        project_id:              strOrNull($('proj-projectid').value),
        pse_number:              strOrNull($('proj-pse').value),
        agency:                  strOrNull($('proj-agency').value),
        cip:                     numOrNull($('proj-cip').value),
        category:                numOrNull($('proj-category').value),
        element:                 strOrNull($('proj-element').value),
        project_acep:            strOrNull($('proj-acep').value),
      };

      await db.setDimensionFields(projectId, 'project', updates);

      // Update header from submitted values — don't depend on the DB response row
      titleEl.textContent = updates.project_title || '—';
      psrEl.textContent = updates.psr_key || '—';
      planningEl.textContent = [updates.planning_number_prefix || '—', updates.planning_number_suffix || '']
        .filter((x, i) => i === 0 || x !== '').join('-');
      projIdEl.textContent = updates.project_id || '—';

      const acepBase = [
        updates.agency   != null ? String(updates.agency)                           : null,
        updates.cip      != null ? String(updates.cip)                              : null,
        updates.category != null ? String(updates.category).padStart(2, '0')        : null,
        updates.element  != null ? String(updates.element).padStart(2, '0')         : null,
      ].filter(Boolean).join('');
      const acepCode = acepBase && updates.project_acep
        ? `${acepBase}/${updates.project_acep}`
        : acepBase || updates.project_acep || '';
      document.getElementById('proj-header-acep').textContent = acepCode || '—';
      document.getElementById('proj-acep-badge').style.display = acepCode ? '' : 'none';

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
      await db.delete('dimensions', 'id', projectId);
      bootstrap.Modal.getInstance(document.getElementById('projectModal'))?.hide();
      location.replace('./managerDash.html');
    } catch (err) {
      console.error(err);
      msg.textContent = err?.message || 'Delete failed.';
    }
  });
}
