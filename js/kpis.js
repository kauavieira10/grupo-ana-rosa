/* kpis.js — renderiza os KPI cards a partir do view-model corrente.
   Usa ícones SVG inline (não trocar o set — regra #2 do PROMPT-MOLDE). */

window.KPIs = (function () {
  const I = {
    budget: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    leads:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    cpl:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41 13.42 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/></svg>',
    goal:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
    revenue:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>'
  };

  function badge(kind, txt) {
    const cls = kind === "up" ? "badge--up" : kind === "down" ? "badge--down" : kind === "warn" ? "badge--warn" : "badge--neutral";
    const arrow = kind === "up" ? "▲ " : kind === "down" ? "▼ " : "";
    return `<span class="badge ${cls}">${arrow}${txt}</span>`;
  }

  function card(icon, label, value, foot) {
    return `<div class="kpi glass">
      <div class="kpi__head"><span class="kpi__icon">${icon}</span><span class="kpi__label">${label}</span></div>
      <div class="kpi__value tnum">${value}</div>
      <div class="kpi__foot">${foot || ""}</div>
    </div>`;
  }

  function render(m) {
    const host = U.byId("kpis");
    if (!host) return;
    const t = m.totals, g = m.goals;
    const goalKind = t.pctGoal >= 100 ? "up" : t.pctGoal >= 90 ? "warn" : "down";
    const cplKind = t.cpl <= g.cpl ? "up" : "down";
    const cards = [
      card(I.budget, "Investimento", U.money0(t.budgetSpent),
        `${badge("neutral", U.pct((t.budgetSpent / (t.budgetPlanned || 1)) * 100))} de ${U.money0(t.budgetPlanned)} previsto`),
      card(I.leads, "Leads", U.int(t.leads),
        `${badge(goalKind, U.pct(t.pctGoal))} da meta (${U.int(g.leads)})`),
      card(I.cpl, "CPL médio", U.money(t.cpl),
        `${badge(cplKind, cplKind === "up" ? "abaixo da meta" : "acima da meta")} · meta ${U.money(g.cpl)}`),
      card(I.goal, "Quebra média", U.pct(t.pctBreak),
        badge(t.pctBreak <= 5 ? "up" : "warn", t.pctBreak <= 5 ? "saudável" : "atenção"))
    ];
    if (CONFIG.features.expad && m.expad && m.expad.active) {
      cards.push(card(I.revenue, "Ganho (Expad)", U.money0(m.expad.revenue),
        `${badge("neutral", U.int(m.expad.qualifiedLeads) + " qualif.")} · ticket ${U.money0(m.expad.ticket)}`));
    }
    host.innerHTML = cards.join("");
  }

  return { render };
})();
