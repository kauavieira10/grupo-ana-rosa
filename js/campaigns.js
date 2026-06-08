/* campaigns.js — top campanhas por investimento (filtra por plataforma). */

window.Campaigns = (function () {
  function bar(pct) {
    return `<div style="height:6px;border-radius:99px;background:var(--primary-soft);overflow:hidden;margin-top:6px">
      <div style="height:100%;width:${Math.min(100, pct)}%;background:var(--header-grad)"></div></div>`;
  }

  function render(m) {
    const host = U.byId("campaigns");
    if (!host) return;
    let list = (m.campaigns || []).filter((c) => m.platformFilter === "all" || c.platform === m.platformFilter);
    list = list.sort((a, b) => b.spend - a.spend).slice(0, 6);
    if (!list.length) { host.innerHTML = `<div class="empty">Sem campanhas para o filtro atual.</div>`; return; }
    const max = list[0].spend || 1;
    host.innerHTML = list.map((c) => `
      <div style="padding:12px 0;border-bottom:1px solid var(--glass-border)">
        <div style="display:flex;justify-content:space-between;gap:12px;font-size:13.5px">
          <span style="font-weight:600">${c.name}</span>
          <span class="tnum" style="font-weight:700">${U.money0(c.spend)}</span>
        </div>
        <div class="muted" style="font-size:12px;margin-top:2px">${U.int(c.leads)} leads · CPL ${U.money(c.cpl)} · ${c.platform === "google" ? "Google" : "Meta"}</div>
        ${bar((c.spend / max) * 100)}
      </div>`).join("");
  }

  return { render };
})();
