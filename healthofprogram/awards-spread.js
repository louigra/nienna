// healthofprogram/awards-spread.js
// Report 3: Award Timeline Distribution
// Bar chart showing project count or total estimate dollars by award month.

import { db }          from '../db/index.js';
import { getAllBudgets } from '../project-manager/demo-data.js';

// ---------- Utilities ----------

function formatCurrency(n) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n);
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Returns the last calendar date of a given month as a Date.
function lastDayOfMonth(year, month) {
  return new Date(year, month, 0); // month is 1-indexed; day=0 gives last day of previous month
}

function fmtDate(d) {
  return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
}

// ---------- Month range builder ----------

// Returns array of { year, month (1-12), key ('YYYY-MM'), label ('Jan 2026') }
function buildMonthRange(startYear, startMonth, endYear, endMonth) {
  const months = [];
  let y = startYear, m = startMonth;
  while (y < endYear || (y === endYear && m <= endMonth)) {
    const last = lastDayOfMonth(y, m);
    months.push({
      year:  y,
      month: m,
      key:   `${y}-${String(m).padStart(2, '0')}`,
      label: fmtDate(last),
    });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return months;
}

// ---------- Aggregation ----------

// Returns a parallel array of values (counts or dollars) for each month slot.
function aggregateByMonth(projects, allBudgets, latestEstByProject, months, mode) {
  const keyToIdx = new Map(months.map((mo, i) => [mo.key, i]));
  const values   = new Array(months.length).fill(0);

  for (const p of projects) {
    const budgetEntry = allBudgets[String(p.id)] ?? allBudgets._default;
    const awardDate   = budgetEntry?.milestone_dates?.Award;
    if (!awardDate) continue;

    const [ay, am] = awardDate.split('-').map(Number);
    const key      = `${ay}-${String(am).padStart(2, '0')}`;
    const idx      = keyToIdx.get(key);
    if (idx == null) continue; // outside selected range

    if (mode === 'count') {
      values[idx] += 1;
    } else {
      values[idx] += latestEstByProject[p.id]?.total_amount ?? 0;
    }
  }

  return values;
}

// ---------- Bar chart renderer ----------

function renderBarChart(months, values, mode) {
  const maxVal = Math.max(...values, 1);

  if (values.every(v => v === 0)) {
    return `<div class="text-secondary small fst-italic py-4 text-center">
      No award dates fall within this range for the selected filters.
    </div>`;
  }

  const bars = months.map((mo, i) => {
    const val    = values[i];
    const pct    = (val / maxVal * 100).toFixed(1);
    const tip    = mode === 'count' ? `${val} project${val !== 1 ? 's' : ''}` : formatCurrency(val);
    const valLbl = mode === 'count'
      ? (val > 0 ? String(val) : '')
      : (val > 0 ? formatCurrency(val) : '');

    return `
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;">
        <div style="font-size:.6rem;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center">
          ${valLbl}
        </div>
        <div style="width:100%;flex:1;display:flex;align-items:flex-end;">
          <div title="${tip}"
               style="width:100%;height:${pct}%;background:#0d6efd;border-radius:3px 3px 0 0;min-height:${val > 0 ? 2 : 0}px;transition:height .2s ease;">
          </div>
        </div>
        <div style="font-size:.62rem;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center">
          ${mo.label}
        </div>
      </div>`;
  }).join('');

  return `
    <div style="display:flex;align-items:stretch;gap:4px;height:180px;border-bottom:1px solid rgba(255,255,255,.12);">
      ${bars}
    </div>`;
}

// ---------- Controls HTML ----------

function yearOptions(selectedYear) {
  const now = new Date();
  const opts = [];
  for (let y = now.getFullYear() - 1; y <= now.getFullYear() + 5; y++) {
    opts.push(`<option value="${y}"${y === selectedYear ? ' selected' : ''}>${y}</option>`);
  }
  return opts.join('');
}

function monthOptions(selectedMonth) {
  return MONTH_LABELS.map((lbl, i) => {
    const val = i + 1;
    return `<option value="${val}"${val === selectedMonth ? ' selected' : ''}>${lbl}</option>`;
  }).join('');
}

function renderControls(sy, sm, ey, em, mode) {
  return `
    <div class="d-flex flex-wrap align-items-center gap-3 mb-4"
         style="background:rgba(15,15,18,.5);border:1px solid rgba(255,255,255,.12);border-radius:.5rem;padding:.75rem 1rem;">

      <div class="d-flex align-items-center gap-2">
        <span class="small text-secondary">From</span>
        <select id="at-start-month" class="form-select form-select-sm" style="width:auto">
          ${monthOptions(sm)}
        </select>
        <select id="at-start-year" class="form-select form-select-sm" style="width:auto">
          ${yearOptions(sy)}
        </select>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="small text-secondary">To</span>
        <select id="at-end-month" class="form-select form-select-sm" style="width:auto">
          ${monthOptions(em)}
        </select>
        <select id="at-end-year" class="form-select form-select-sm" style="width:auto">
          ${yearOptions(ey)}
        </select>
      </div>

      <div class="btn-group btn-group-sm ms-auto" role="group">
        <button id="at-mode-count"
                type="button"
                class="btn ${mode === 'count' ? 'btn-primary' : 'btn-outline-secondary'}">
          # Projects
        </button>
        <button id="at-mode-dollars"
                type="button"
                class="btn ${mode === 'dollars' ? 'btn-primary' : 'btn-outline-secondary'}">
          $ Dollars
        </button>
      </div>
    </div>`;
}

// ---------- Shell renderer (private) ----------

function renderShell(containerEl, projects, allBudgets, latestEstByProject) {
  const now = new Date();
  const defaultSY = now.getFullYear();
  const defaultSM = now.getMonth() + 1;
  const endDate   = new Date(now.getFullYear(), now.getMonth() + 12, 1);
  const defaultEY = endDate.getFullYear();
  const defaultEM = endDate.getMonth() + 1;

  containerEl.innerHTML = `
    <h5 class="mb-3">
      <i class="bi bi-calendar-range me-2"></i>Award Timeline Distribution
    </h5>
    ${renderControls(defaultSY, defaultSM, defaultEY, defaultEM, 'count')}
    <div id="awards-chart-area"></div>`;

  let currentMode = 'count';

  function readControls() {
    return {
      startYear:  Number(containerEl.querySelector('#at-start-year').value),
      startMonth: Number(containerEl.querySelector('#at-start-month').value),
      endYear:    Number(containerEl.querySelector('#at-end-year').value),
      endMonth:   Number(containerEl.querySelector('#at-end-month').value),
    };
  }

  function updateChart() {
    const { startYear, startMonth, endYear, endMonth } = readControls();

    if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
      containerEl.querySelector('#awards-chart-area').innerHTML = `
        <div class="text-warning small py-3">
          <i class="bi bi-exclamation-triangle me-1"></i>End month must be after start month.
        </div>`;
      return;
    }

    const months = buildMonthRange(startYear, startMonth, endYear, endMonth);
    const values = aggregateByMonth(projects, allBudgets, latestEstByProject, months, currentMode);
    containerEl.querySelector('#awards-chart-area').innerHTML = renderBarChart(months, values, currentMode);
  }

  // Wire date selects
  ['#at-start-month', '#at-start-year', '#at-end-month', '#at-end-year'].forEach(sel => {
    containerEl.querySelector(sel).addEventListener('change', updateChart);
  });

  // Wire mode toggle
  containerEl.querySelector('#at-mode-count').addEventListener('click', () => {
    currentMode = 'count';
    containerEl.querySelector('#at-mode-count').className   = 'btn btn-primary btn-sm';
    containerEl.querySelector('#at-mode-dollars').className = 'btn btn-outline-secondary btn-sm';
    updateChart();
  });
  containerEl.querySelector('#at-mode-dollars').addEventListener('click', () => {
    currentMode = 'dollars';
    containerEl.querySelector('#at-mode-dollars').className = 'btn btn-primary btn-sm';
    containerEl.querySelector('#at-mode-count').className   = 'btn btn-outline-secondary btn-sm';
    updateChart();
  });

  updateChart();
}

// ---------- Main export ----------

export async function renderAwardsTimeline(containerEl, { cip, agency, category, element }) {
  containerEl.innerHTML = `
    <div class="text-center p-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-secondary small">Loading report…</div>
    </div>`;

  try {
    const filters = [];
    if (cip)      filters.push({ key: 'cip',      op: 'eq', value: Number(cip) });
    if (agency)   filters.push({ key: 'agency',   op: 'eq', value: agency });
    if (category) filters.push({ key: 'category', op: 'eq', value: Number(category) });
    if (element)  filters.push({ key: 'element',  op: 'eq', value: Number(element) });

    const { rows: projects } = await db.query('projects_live', {
      select: 'id, project_title, category, element, agency',
      filters,
      pageSize: null,
    });

    const allBudgets = getAllBudgets();

    // Batch-fetch latest estimate per project (for dollar mode)
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
        if (!latestEstByProject[est.project_id]) latestEstByProject[est.project_id] = est;
      }
    }

    renderShell(containerEl, projects, allBudgets, latestEstByProject);

  } catch (err) {
    console.error('Award Timeline report error:', err);
    containerEl.innerHTML = `
      <div class="text-danger p-3">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Error loading report. See console for details.
      </div>`;
  }
}
