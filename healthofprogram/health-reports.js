// healthofprogram/health-reports.js
// Builds the report navigation sidebar and dispatches to report renderers.

import { REPORTS } from './reports-config.js';
import { renderBudgetVsEstimate } from './report-budget-vs-estimate.js';
import { renderAwardsTimeline } from './awards-spread.js';

const RENDERERS = {
  estimatesvbudget: renderBudgetVsEstimate,
  awardstimeline:   renderAwardsTimeline,
};

let reportsListEl = null;
let contentWrapEl = null;
let activeKey     = null;

export function buildReportsNav() {
  reportsListEl = document.getElementById('report-types-list');
  contentWrapEl = document.getElementById('content-wrap');

  reportsListEl.innerHTML = '';

  for (const t of REPORTS) {
    const a = document.createElement('a');
    a.href      = '#';
    a.className = 'list-group-item list-group-item-action d-flex align-items-center gap-2';
    a.setAttribute('role', 'tab');
    a.dataset.key = t.key;
    a.innerHTML = `<i class="bi bi-${t.icon || 'collection'}"></i><span>${t.label}</span>`;
    reportsListEl.appendChild(a);
  }

  // Delegated click handler on the list
  reportsListEl.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-key]');
    if (!item) return;
    e.preventDefault();

    const key = item.dataset.key;
    if (key === activeKey) return;   // already active

    // Update active styling
    reportsListEl.querySelectorAll('[data-key]').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    activeKey = key;

    loadReport(key);
  });
}

function getFilters() {
  return {
    cip:      document.getElementById('tier-select')?.value      ?? '',
    agency:   document.getElementById('agency-select')?.value    ?? '',
    category: document.getElementById('category-select')?.value  ?? '',
    element:  document.getElementById('element-select')?.value   ?? '',
  };
}

function loadReport(key) {
  const renderer = RENDERERS[key];
  if (!renderer) {
    contentWrapEl.innerHTML = `<div class="text-secondary">Report "${key}" is not yet implemented.</div>`;
    return;
  }
  renderer(contentWrapEl, getFilters());
}

// Called by the filter controls in healthdash.html to refresh the active report
export function refreshActiveReport() {
  if (activeKey) loadReport(activeKey);
}
