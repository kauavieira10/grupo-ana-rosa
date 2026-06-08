/* platforms.js — cards de quebra por plataforma (Google / Meta). */

window.Platforms = (function () {
  const ICON = {
    google: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.6 4.1-5.35 4.1A6.4 6.4 0 1 1 12 5.6c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.73 3.02 14.6 2 12 2a10 10 0 1 0 0 20c5.77 0 9.6-4.06 9.6-9.78 0-.66-.07-1.16-.25-1.12Z"/></svg>',
    meta:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>'
  };

  function card(key, label, p) {
    const spent = p.budgetSpent || 0, planned = p.budgetPlanned || 0;
    const used = planned ? (spent / planned) * 100 : 0;
    return `<div class="card glass">
      <div class="card__head">
        <div class="card__title" style="display:flex;align-items:center;gap:8px">
          <span class="kpi__icon" style="width:28px;height:28px">${ICON[key]}</span> ${label}</div>
        <span class="badge badge--neutral">${U.pct(used)} da verba</span>
      </div>
      <div class="forecast">
        <div class="forecast__cell"><div class="forecast__label">Investimento</div><div class="forecast__value tnum">${U.money0(spent)}</div></div>
        <div class="forecast__cell"><div class="forecast__label">Leads</div><div class="forecast__value tnum">${U.int(p.leads)}</div></div>
        <div class="forecast__cell"><div class="forecast__label">CPL</div><div class="forecast__value tnum">${U.money(p.cpl)}</div></div>
      </div>
    </div>`;
  }

  function render(m) {
    const host = U.byId("platforms");
    if (!host) return;
    const cards = [];
    const pf = m.platformFilter;
    if (CONFIG.features.google && (pf === "all" || pf === "google")) cards.push(card("google", "Google Ads", m.platforms.google));
    if (CONFIG.features.meta && (pf === "all" || pf === "meta"))     cards.push(card("meta", "Meta Ads", m.platforms.meta));
    host.innerHTML = cards.join("");
    host.style.gridTemplateColumns = cards.length === 1 ? "1fr" : "1fr 1fr";
  }

  return { render };
})();
