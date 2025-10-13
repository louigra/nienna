
export async function showFormModal({ def, title, row={} }) {
    const host = document.getElementById("modal-host");
    const id = `m${Date.now()}`;
    host.innerHTML = `
      <div class="modal fade" id="${id}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form>
              <div class="modal-body">
                <div class="row g-3">
                  ${def.columns.map(col => renderField(col, row[col.key])).join("")}
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
    const el = host.firstElementChild;
    const modal = new bootstrap.Modal(el);
    modal.show();
  
    return await new Promise(resolve => {
      el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        const payload = {};
        for (const c of def.columns) {
          if (c.editable === false) continue;
          const input = el.querySelector(`[name="${c.key}"]`);
          if (!input) continue;
          const v = input.value.trim();
          payload[c.key] = c.type === "number" ? (v===""? null : Number(v)) : (v || null);
        }
        modal.hide(); resolve(payload);
      };
      el.addEventListener("hidden.bs.modal", () => resolve(null), { once: true });
    });
  }
  
  function renderField(c, value) {
    const ro = c.editable === false ? "readonly" : "";
    const required = c.required ? "required" : "";
    const step = c.step ? `step="${c.step}"` : "";
    const type = c.type === "number" ? "number" : "text";
    const col = c.grow ? `col-12 col-md-${Math.min(12, 4*c.grow)}` : "col-12 col-md-4";
    return `
      <div class="${col}">
        <label class="form-label small" for="fld_${c.key}">${c.label}</label>
        <input ${ro} ${required} ${step} id="fld_${c.key}" name="${c.key}" type="${type}" class="form-control" value="${value ?? ""}" />
      </div>`;
  }