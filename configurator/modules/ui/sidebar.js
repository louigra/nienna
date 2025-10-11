// modules/ui/sidebar.js
export function buildSidebar(container, registry, router) {
    const current = new URL(location.href).searchParams.get("t") || Object.keys(registry)[0];
    container.innerHTML = "";
  
    Object.entries(registry).forEach(([key, def]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
      if (key === current) btn.classList.add("active");
      btn.innerHTML = `<span>${def.title}</span><span class="badge bg-secondary">${def.table}</span>`;
      btn.onclick = () => router.goto({ t: key, p: 1, q: "" });
      container.appendChild(btn);
    });
  }