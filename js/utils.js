/* utils.js — formatadores e helpers de DOM (sem dependências) */

window.U = (function () {
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const brl0 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat("pt-BR");

  return {
    money:  (v) => brl.format(Number(v) || 0),
    money0: (v) => brl0.format(Number(v) || 0),
    int:    (v) => num.format(Math.round(Number(v) || 0)),
    pct:    (v, d = 1) => (Number(v) || 0).toFixed(d).replace(".", ",") + "%",

    // converte "R$ 1.234,56" / "1.234,56" / "12%" -> number
    parseNum(raw) {
      if (raw == null) return 0;
      if (typeof raw === "number") return raw;
      const s = String(raw).replace(/[R$\s%]/g, "").replace(/\./g, "").replace(",", ".");
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    },

    initials(name, max = 2) {
      return (name || "")
        .split(/\s+/).filter(Boolean)
        .map((w) => w[0])
        .join("").slice(0, max).toUpperCase() || "AC";
    },

    fmtDateShort(iso) {
      if (!iso) return "";
      const [y, m, d] = iso.split("-");
      return `${d}/${m}`;
    },
    fmtDateLong(iso) {
      if (!iso) return "";
      const d = new Date(iso + "T12:00:00");
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    },

    byId: (id) => document.getElementById(id),
    qs:  (sel, root = document) => root.querySelector(sel),
    qsa: (sel, root = document) => Array.from(root.querySelectorAll(sel)),

    el(tag, attrs = {}, html) {
      const n = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") n.className = v;
        else if (k === "dataset") Object.assign(n.dataset, v);
        else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v);
      }
      if (html != null) n.innerHTML = html;
      return n;
    },

    debounce(fn, ms = 250) {
      let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
    },

    async fetchJSON(url, timeoutMs = 9000) {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const r = await fetch(url, { signal: ctrl.signal, headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error("HTTP " + r.status);
        return await r.json();
      } finally { clearTimeout(id); }
    },

    sum: (arr, key) => arr.reduce((a, x) => a + (Number(key ? x[key] : x) || 0), 0)
  };
})();
