/* forecast.js — insights automáticos e projeção (lê o view-model). */

window.Forecast = (function () {
  const I = {
    good: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.3 3.86 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>'
  };

  function insight(kind, html) {
    return `<div class="insight"><span class="insight__icon insight__icon--${kind}">${I[kind]}</span>
      <div class="insight__body">${html}</div></div>`;
  }

  // projeta linearmente pelo ritmo médio diário até o fim do período de meta
  function project(m) {
    const days = m.daily.length || 1;
    const leadsPerDay = m.totals.leads / days;
    const spendPerDay = m.totals.budgetSpent / days;
    const end = new Date((m.meta.periodEnd || m.daily[m.daily.length - 1].date) + "T12:00:00");
    const last = new Date(m.daily[m.daily.length - 1].date + "T12:00:00");
    const remain = Math.max(0, Math.round((end - last) / 86400000));
    return {
      projLeads: Math.round(m.totals.leads + leadsPerDay * remain),
      projSpend: m.totals.budgetSpent + spendPerDay * remain,
      remain,
      leadsPerDay, spendPerDay
    };
  }

  function render(m) {
    const ins = U.byId("insights"), fc = U.byId("forecast");
    if (ins) {
      const items = [];
      const t = m.totals;
      if (t.pctGoal >= 100) items.push(insight("good", `Meta de leads <strong>batida</strong>: ${U.int(t.leads)} de ${U.int(m.goals.leads)} (${U.pct(t.pctGoal)}).`));
      else items.push(insight("warn", `Faltam <strong>${U.int(Math.max(0, m.goals.leads - t.leads))} leads</strong> para a meta (${U.pct(t.pctGoal)} atingido).`));
      if (t.cpl <= m.goals.cpl) items.push(insight("good", `CPL em <strong>${U.money(t.cpl)}</strong>, abaixo da meta de ${U.money(m.goals.cpl)}.`));
      else items.push(insight("warn", `CPL em <strong>${U.money(t.cpl)}</strong>, acima da meta de ${U.money(m.goals.cpl)}.`));
      const best = [...m.daily].sort((a, b) => (b.googleLeads + b.metaLeads) - (a.googleLeads + a.metaLeads))[0];
      if (best) items.push(insight("info", `Melhor dia: <strong>${U.fmtDateLong(best.date)}</strong> com ${U.int(best.googleLeads + best.metaLeads)} leads.`));
      const lead = m.platforms.google.leads >= m.platforms.meta.leads ? "Google" : "Meta";
      items.push(insight("info", `<strong>${lead}</strong> lidera em volume de leads no período.`));
      ins.innerHTML = items.join("");
    }
    if (fc) {
      const p = project(m);
      fc.innerHTML = `
        <div class="forecast__cell"><div class="forecast__label">Leads projetados (fim do mês)</div><div class="forecast__value tnum">${U.int(p.projLeads)}</div></div>
        <div class="forecast__cell"><div class="forecast__label">Investimento projetado</div><div class="forecast__value tnum">${U.money0(p.projSpend)}</div></div>
        <div class="forecast__cell"><div class="forecast__label">Ritmo médio</div><div class="forecast__value tnum">${U.int(p.leadsPerDay)}/dia</div></div>
        <div class="forecast__cell"><div class="forecast__label">Dias restantes</div><div class="forecast__value tnum">${U.int(p.remain)}</div></div>`;
    }
  }

  return { render, project };
})();
