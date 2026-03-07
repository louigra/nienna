// healthofprogram/report-budget-vs-estimate.js
// Report 1: Budget vs. Estimate
// Renders a hierarchical comparison of project estimates vs. budget envelopes,
// rolled up by Category → Element → Project for the selected Program.

import { db } from '../db/index.js';
import { TAXONOMY } from './taxonomy.js';
import { getAllBudgets } from '../project-manager/demo-data.js';

const ESTIMATE_TYPE_COLORS = {
  profile: '#0d6efd', ipb: '#b45309', upb: '#c2410c', rta: '#7c3aed', bid: '#0891b2',
};
const ESTIMATE_STATUS_COLORS = {
  draft: '#4b5563', active: '#0891b2', approved: '#16a34a', archived: '#374151',
};

function formatCurrency(n) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function diffDisplay(budget, estimate) {
  if (!budget && !estimate) return { text: '—', cls: 'text-secondary' };
  const diff = (estimate ?? 0) - (budget ?? 0);
  const sign = diff >= 0 ? '+' : '−';
  const cls = diff > 0 ? 'text-danger' : (diff < 0 ? 'text-success' : 'text-secondary');
  return { text: sign + formatCurrency(Math.abs(diff)), cls };
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---------- Summary bar ----------

function renderSummary(grandBudget, grandEstimate, awc) {
  const diff = diffDisplay(grandBudget, grandEstimate);
  const awcCell = awc != null ? `
        <div class="col-3">
          <div class="small text-secondary mb-1">AWC</div>
          <div class="fs-5 fw-bold text-info">${formatCurrency(awc)}</div>
        </div>` : '';
  const colClass = awc != null ? 'col-3' : 'col-4';
  return `
    <div class="mb-4 p-3 rounded" style="background:rgba(15,15,18,.5);border:1px solid rgba(255,255,255,.12)">
      <div class="row g-0 text-center">
        <div class="${colClass} border-end border-opacity-25">
          <div class="small text-secondary mb-1">Total Budget</div>
          <div class="fs-5 fw-bold">${formatCurrency(grandBudget)}</div>
        </div>
        <div class="${colClass} border-end border-opacity-25">
          <div class="small text-secondary mb-1">Total Estimate</div>
          <div class="fs-5 fw-bold">${formatCurrency(grandEstimate)}</div>
        </div>
        <div class="${colClass}${awc != null ? ' border-end border-opacity-25' : ''}">
          <div class="small text-secondary mb-1">Difference</div>
          <div class="fs-5 fw-bold ${diff.cls}">${diff.text}</div>
        </div>
        ${awcCell}
      </div>
    </div>`;
}

// ---------- Project rows ----------

function renderProjectRow(project) {
  const budget   = project.budget ?? 0;
  const est      = project.estimate;
  const estimate = est?.total_amount ?? null;
  const diff     = diffDisplay(budget, estimate);

  const estimateCell = est
    ? `<span class="est-amount"
            data-est-type="${escHtml(est.estimate_type)}"
            data-est-status="${escHtml(est.status)}"
            data-est-date="${escHtml(String(est.estimate_date ?? '').slice(0, 10))}"
            style="cursor:help;text-decoration:underline dotted">
          ${formatCurrency(estimate)}
        </span>`
    : `<span class="text-secondary">No estimate</span>`;

  return `
    <tr>
      <td>
        <a href="../project-manager/project.html?project_id=${escHtml(project.id)}"
           class="text-light text-decoration-none">
          ${escHtml(project.project_title || '(untitled)')}
          <i class="bi bi-box-arrow-up-right ms-1 small text-secondary"></i>
        </a>
      </td>
      <td class="text-end text-nowrap">${formatCurrency(budget)}</td>
      <td class="text-end text-nowrap">${estimateCell}</td>
      <td class="text-end text-nowrap ${diff.cls}">${diff.text}</td>
    </tr>`;
}

// ---------- Element section ----------

function renderElement(el, catIdx, elIdx) {
  const diff    = diffDisplay(el.elBudget, el.elEstimate);
  const overage = el.elBudget > 0 && el.elEstimate > el.elBudget * 1.10;
  const overageBadge = overage
    ? `<span class="badge ms-2" style="background:#dc3545;font-size:.68rem;vertical-align:middle">Est &gt;110% Budget</span>`
    : '';

  const collapseId  = `el-${catIdx}-${elIdx}`;
  const projectRows = el.projects.map(renderProjectRow).join('');
  const emptyRow    = el.projects.length === 0
    ? `<tr><td colspan="4" class="text-secondary fst-italic py-2">No projects in this element</td></tr>`
    : '';

  return `
    <div class="border-bottom border-opacity-10 py-2">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2"
           style="cursor:pointer"
           data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-chevron-right small text-secondary toggle-icon"></i>
          <span class="small">
            Element ${String(el.num).padStart(2, '0')}: ${escHtml(el.label)}
          </span>
          ${overageBadge}
        </div>
        <div class="d-flex gap-4 text-end">
          <div>
            <div style="font-size:.65rem" class="text-secondary">Budget</div>
            <div class="small">${formatCurrency(el.elBudget)}</div>
          </div>
          <div>
            <div style="font-size:.65rem" class="text-secondary">Estimate</div>
            <div class="small">${el.elEstimate > 0 ? formatCurrency(el.elEstimate) : '<span class="text-secondary">—</span>'}</div>
          </div>
          <div>
            <div style="font-size:.65rem" class="text-secondary">Diff</div>
            <div class="small ${diff.cls}">${diff.text}</div>
          </div>
        </div>
      </div>
      <div class="collapse" id="${collapseId}">
        <div class="mt-2 ps-3">
          <table class="table table-sm table-dark mb-0" style="font-size:.83rem">
            <thead>
              <tr>
                <th>Project</th>
                <th class="text-end">Budget</th>
                <th class="text-end">Estimate</th>
                <th class="text-end">Diff</th>
              </tr>
            </thead>
            <tbody>${projectRows}${emptyRow}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}

// ---------- Category card ----------

function renderCategory(cat, catIdx, agency, showAgencyLabel) {
  const diff        = diffDisplay(cat.catBudget, cat.catEstimate);
  const collapseId  = `cat-${catIdx}`;
  const elements    = cat.elements.map((el, elIdx) => renderElement(el, catIdx, elIdx)).join('');
  const agencyBadge = showAgencyLabel
    ? `<span class="badge me-1" style="background:rgba(255,255,255,.1);color:#9ca3af;font-weight:400">${escHtml(agency.code)}</span>`
    : '';

  return `
    <div class="mb-2 rounded" style="background:var(--glass-bg);border:1px solid var(--glass-border)">
      <div class="p-3 d-flex align-items-center justify-content-between flex-wrap gap-2"
           style="cursor:pointer"
           data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-chevron-right text-secondary toggle-icon"></i>
          ${agencyBadge}
          <span class="fw-semibold">
            Category ${String(cat.num).padStart(2, '0')}: ${escHtml(cat.label)}
          </span>
        </div>
        <div class="d-flex gap-4 text-end">
          <div>
            <div style="font-size:.7rem" class="text-secondary">Budget</div>
            <div>${formatCurrency(cat.catBudget)}</div>
          </div>
          <div>
            <div style="font-size:.7rem" class="text-secondary">Estimate</div>
            <div>${cat.catEstimate > 0 ? formatCurrency(cat.catEstimate) : '<span class="text-secondary">—</span>'}</div>
          </div>
          <div>
            <div style="font-size:.7rem" class="text-secondary">Diff</div>
            <div class="${diff.cls}">${diff.text}</div>
          </div>
        </div>
      </div>
      <div class="collapse" id="${collapseId}">
        <div class="px-3 pb-2">${elements}</div>
      </div>
    </div>`;
}

// ---------- Tooltip wiring ----------

function wireTooltips(containerEl) {
  const doc = containerEl.ownerDocument;

  let tip = doc.getElementById('_est-tip');
  if (!tip) {
    tip = doc.createElement('div');
    tip.id = '_est-tip';
    Object.assign(tip.style, {
      position: 'fixed', zIndex: '9999',
      background: '#1b1d24', border: '1px solid rgba(255,255,255,.15)',
      borderRadius: '.5rem', padding: '.45rem .7rem',
      pointerEvents: 'none', display: 'none',
      fontSize: '.82rem', maxWidth: '280px',
      boxShadow: '0 4px 24px rgba(0,0,0,.55)',
    });
    doc.body.appendChild(tip);
  }

  const base = 'padding:.15em .45em;border-radius:.3em;font-size:.78rem;font-weight:600;margin-right:.3em';

  containerEl.querySelectorAll('.est-amount').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const type   = el.dataset.estType;
      const status = el.dataset.estStatus;
      const date   = el.dataset.estDate;

      const typeBg   = ESTIMATE_TYPE_COLORS[type?.toLowerCase()]   ?? '#4b5563';
      const statusBg = ESTIMATE_STATUS_COLORS[status?.toLowerCase()] ?? '#4b5563';

      const typeBadge   = type   ? `<span style="${base};background:${typeBg};color:#fff">${escHtml(type)}</span>`   : '';
      const statusBadge = status ? `<span style="${base};background:${statusBg};color:#fff">${escHtml(status)}</span>` : '';
      const dateBadge   = date   ? `<span style="${base};background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#d1d5db">${escHtml(date)}</span>` : '';

      tip.innerHTML = `<div class="text-secondary mb-1" style="font-size:.72rem">Estimate source</div>
                       <div>${typeBadge}${statusBadge}${dateBadge}</div>`;
      tip.style.display = 'block';
      moveTip(e, tip);
    });
    el.addEventListener('mousemove', (e) => moveTip(e, tip));
    el.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  });

  // Rotate chevrons on collapse toggle
  containerEl.querySelectorAll('[data-bs-toggle="collapse"]').forEach(trigger => {
    const target = doc.getElementById(trigger.dataset.bsTarget?.replace('#', ''));
    if (!target) return;
    target.addEventListener('show.bs.collapse', (e) => {
      if (e.target !== target) return;
      trigger.querySelector('.toggle-icon')?.classList.replace('bi-chevron-right', 'bi-chevron-down');
    });
    target.addEventListener('hide.bs.collapse', (e) => {
      if (e.target !== target) return;
      trigger.querySelector('.toggle-icon')?.classList.replace('bi-chevron-down', 'bi-chevron-right');
    });
  });
}

function moveTip(e, tip) {
  const offset = 14;
  tip.style.left = (e.clientX + offset) + 'px';
  tip.style.top  = (e.clientY + offset) + 'px';
}

// ---------- Main export ----------

export async function renderBudgetVsEstimate(containerEl, { cip, agency, category, element }) {
  if (!cip) {
    containerEl.innerHTML = `
      <div class="text-secondary p-3">
        <i class="bi bi-info-circle me-2"></i>Select a program to view this report.
      </div>`;
    return;
  }

  containerEl.innerHTML = `
    <div class="text-center p-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-secondary small">Loading report…</div>
    </div>`;

  try {
    // Build DB filters — CIP is always required; apply optional ACEP filters
    const filters = [{ key: 'cip', op: 'eq', value: Number(cip) }];
    if (agency)   filters.push({ key: 'agency',   op: 'eq', value: agency });
    if (category) filters.push({ key: 'category', op: 'eq', value: Number(category) });
    if (element)  filters.push({ key: 'element',  op: 'eq', value: Number(element) });

    const { rows: projects } = await db.query('projects_live', {
      select: 'id, project_title, category, element, agency',
      filters,
      pageSize: null,
    });

    // Batch-fetch estimates, latest per project
    const latestEstByProject = {};
    if (projects.length) {
      const projectIds = projects.map(p => p.id);
      const { rows: estimates } = await db.query('estimates', {
        select: 'id, project_id, total_amount, estimate_type, status, estimate_date',
        filters: [{ key: 'project_id', op: 'in', value: projectIds }],
        order: { col: 'estimate_date', dir: 'desc' },
        pageSize: null,
      });
      for (const est of estimates) {
        if (!latestEstByProject[est.project_id]) {
          latestEstByProject[est.project_id] = est;
        }
      }
    }

    const allBudgets = getAllBudgets();
    const awc = allBudgets._awc?.total ?? null;

    // Group projects by agency → category → element
    const projectMap = {};
    for (const p of projects) {
      const agKey  = String(p.agency   ?? '');
      const catKey = String(p.category ?? '');
      const elKey  = String(p.element  ?? '');
      if (!projectMap[agKey]) projectMap[agKey] = {};
      if (!projectMap[agKey][catKey]) projectMap[agKey][catKey] = {};
      if (!projectMap[agKey][catKey][elKey]) projectMap[agKey][catKey][elKey] = [];
      projectMap[agKey][catKey][elKey].push({
        ...p,
        budget:   (allBudgets[String(p.id)] ?? allBudgets._default).total,
        estimate: latestEstByProject[p.id] ?? null,
      });
    }

    const taxProgram = TAXONOMY[Number(cip)];
    if (!taxProgram) {
      containerEl.innerHTML = `
        <div class="text-secondary p-3">
          <i class="bi bi-info-circle me-2"></i>
          No taxonomy defined for Program ${escHtml(cip)}.
          Add entries to <code>healthofprogram/taxonomy.js</code>.
        </div>`;
      return;
    }

    // Walk taxonomy with filter slicing: agency → category → element
    let grandBudget   = 0;
    let grandEstimate = 0;
    const categoryCards = [];
    let cardIdx = 0;

    const agenciesToShow = agency
      ? taxProgram.agencies.filter(a => a.code === agency)
      : taxProgram.agencies;

    for (const ag of agenciesToShow) {
      const agMap = projectMap[ag.code] ?? {};

      const catsToShow = category
        ? ag.categories.filter(c => String(c.num) === String(category))
        : ag.categories;

      for (const cat of catsToShow) {
        let catBudget   = 0;
        let catEstimate = 0;
        const catNum    = String(cat.num);

        const elsToShow = element
          ? cat.elements.filter(e => String(e.num) === String(element))
          : cat.elements;

        const elements = elsToShow.map(el => {
          const elNum      = String(el.num);
          const elProjects = agMap[catNum]?.[elNum] ?? [];
          let elBudget   = 0;
          let elEstimate = 0;
          for (const p of elProjects) {
            elBudget   += p.budget ?? 0;
            elEstimate += p.estimate?.total_amount ?? 0;
          }
          catBudget   += elBudget;
          catEstimate += elEstimate;
          return { ...el, elNum, projects: elProjects, elBudget, elEstimate };
        });

        grandBudget   += catBudget;
        grandEstimate += catEstimate;
        categoryCards.push(renderCategory(
          { ...cat, catNum, elements, catBudget, catEstimate },
          cardIdx++,
          ag,
          agenciesToShow.length > 1,
        ));
      }
    }

    containerEl.innerHTML = `
      <h5 class="mb-3">
        <i class="bi bi-bar-chart-line me-2"></i>
        Budget vs. Estimate — Program ${escHtml(String(cip))}
      </h5>
      ${renderSummary(grandBudget, grandEstimate, awc)}
      <div>${categoryCards.join('')}</div>`;

    wireTooltips(containerEl);

  } catch (err) {
    console.error('Budget vs Estimate report error:', err);
    containerEl.innerHTML = `
      <div class="text-danger p-3">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Error loading report. See console for details.
      </div>`;
  }
}
