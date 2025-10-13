
console.log('[tableView] module loaded'); // add this for visibility
import { listRows, insertRow, updateRow, deleteRow } from "../db.js";
import { showFormModal } from "./formModal.js";

export async function renderTableView({ def, container, filtersEl, pagerEl, statusEl, addBtn, searchInput, page = 1, search = "" }) {
  const pageSize = 25;

  // Build filters UI from def.filters (if any)
  filtersEl.innerHTML = "";
  const filterControls = [];
  for (const f of (def.filters || [])) {
    const wrap = document.createElement("div");
    wrap.className = "d-flex align-items-center gap-2";
    const label = document.createElement("label");
    label.className = "form-label small mb-0";
    label.textContent = f.label;
    const sel = document.createElement("select");
    sel.className = "form-select form-select-sm";
    sel.setAttribute("data-key", f.key); // used later when building the query
    sel.innerHTML = `<option value="">All</option>` + f.options.map(o => `<option value="${o}">${o}</option>`).join("");
    sel.onchange = () => refresh(1);
    wrap.appendChild(label);
    wrap.appendChild(sel);
    filtersEl.appendChild(wrap);
    filterControls.push(sel);
  }

  // Search
  if (searchInput) {
    searchInput.value = search;
    searchInput.oninput = debounce(() => refresh(1), 300);
  }

  // Add
  addBtn.onclick = async () => {
    const payload = await showFormModal({ def, title: `Add ${def.title}` });
    if (payload) { await insertRow(def.table, payload); await refresh(1); }
  };

  // Initial load
  await refresh(page);

  async function refresh(nextPage = 1) {
    try {
      statusEl.textContent = "Loading…";

      const filters = filterControls
        .filter(sel => sel.value !== "")
        .map(sel => ({ key: sel.getAttribute("data-key"), op: "eq", value: isNaN(sel.value) ? sel.value : Number(sel.value) }));

      const selectKeys = Array.from(new Set([def.pk, ...def.columns.map(c => c.key)])).join(",");
      const { rows, total } = await listRows({
        table: def.table,
        select: selectKeys,
        page: nextPage,
        pageSize,
        order: def.defaultSort,
        filters,
        search: searchInput?.value || "",
        searchCols: def.searchCols || []
      });

      // Table
      container.innerHTML = "";
      const table = document.createElement("table");
      table.className = "table table-sm table-hover align-middle";
      table.innerHTML = `
        <thead><tr>
          ${def.columns.map(c => `<th style="${c.width ? `width:${c.width}px;` : ''}">${c.label}</th>`).join("")}
          <th class="text-end">Actions</th>
        </tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr data-id="${r[def.pk]}">
              ${def.columns.map(c => `<td>${formatCell(r[c.key], c)}</td>`).join("")}
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-1 edit">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete">Delete</button>
              </td>
            </tr>`).join("")}
        </tbody>`;
      container.appendChild(table);

      // Actions
      table.onclick = async (e) => {
        const tr = e.target.closest("tr");
        if (!tr) return;
        const id = tr.dataset.id;
        if (e.target.classList.contains("edit")) {
          const rowId = rows.findIndex(r => String(r[def.pk]) === String(id));
          const row = rows[rowId];
          const payload = await showFormModal({ def, title: `Edit ${def.title}`, row });
          if (payload) { await updateRow(def.table, def.pk, id, payload); await refresh(nextPage); }
        }
        if (e.target.classList.contains("delete")) {
          if (confirm("Delete this row?")) { await deleteRow(def.table, def.pk, id); await refresh(nextPage); }
        }
      };

      // Pager
      const pages = Math.max(1, Math.ceil(total / pageSize));
      pagerEl.innerHTML = `
        <div>Showing ${(nextPage - 1) * pageSize + 1}-${Math.min(nextPage * pageSize, total)} of ${total}</div>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-light prev" ${nextPage <= 1 ? 'disabled' : ''}>Prev</button>
          <span class="btn btn-sm btn-outline-light disabled">${nextPage}/${pages}</span>
          <button class="btn btn-sm btn-outline-light next" ${nextPage >= pages ? 'disabled' : ''}>Next</button>
        </div>`;
      pagerEl.querySelector('.prev').onclick = () => refresh(nextPage - 1);
      pagerEl.querySelector('.next').onclick = () => refresh(nextPage + 1);

      statusEl.textContent = `Loaded ${rows.length} row(s) • Total ${total}`;
    } catch (err) {
      console.error("[TableView] Load error:", err);
      statusEl.textContent = err?.message || "Failed to load rows";
      container.innerHTML = `<div class="alert alert-danger">Failed to load: ${err?.message || err}</div>`;
    }
  }
}

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function formatCell(v, c) { if (v == null) return ""; return String(v); }