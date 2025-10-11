// modules/router.js
export function initRouter({ onChange }) {
    function parse() {
      const u = new URL(location.href);
      return {
        tableKey: u.searchParams.get("t") || "",
        page: Number(u.searchParams.get("p")||1),
        q: u.searchParams.get("q") || ""
      };
    }
    async function emit() { onChange(parse()); }
    window.addEventListener("popstate", emit);
    emit();
  
    // expose helpers for other modules
    return {
      goto(params) {
        const u = new URL(location.href);
        for (const [k,v] of Object.entries(params)) {
          if (v===undefined || v===null || v==="") u.searchParams.delete(k);
          else u.searchParams.set(k, String(v));
        }
        history.pushState({}, "", u.toString());
        emit();
      }
    };
  }