/* expad-qualified.js — métricas de leads QUALIFICADOS da Expad e o card
   de funil (lead -> qualificado -> venda). Depende de Expad (expad.js). */

window.ExpadQualified = (function () {
  // taxa de qualificação e de conversão a partir do dataset corrente
  function metrics(ds) {
    const e = ds.expad || {};
    const totalLeads = ds.totals.leads || 0;
    const qualified = e.qualifiedLeads || 0;
    const sales = (e.sales && e.sales.length) || 0;
    return {
      totalLeads,
      qualified,
      sales,
      qualRate: totalLeads ? (qualified / totalLeads) * 100 : 0,
      convRate: qualified ? (sales / qualified) * 100 : 0,
      revenue: e.revenue || 0,
      ticket: e.ticket || 0
    };
  }

  function render(ds) {
    const host = U.byId("expad-card");
    if (!host) return;
    if (!CONFIG.features.expad || !ds.expad || !ds.expad.active) { host.style.display = "none"; return; }
    host.style.display = "";
    const m = metrics(ds);
    host.innerHTML = `
      <div class="card__head">
        <div><div class="card__title">Funil Expad</div>
        <div class="card__sub">Leads qualificados e ganho</div></div>
      </div>
      <div class="forecast">
        <div class="forecast__cell"><div class="forecast__label">Leads qualificados</div>
          <div class="forecast__value">${U.int(m.qualified)}</div>
          <div class="muted" style="font-size:12px;margin-top:4px">${U.pct(m.qualRate)} dos leads</div></div>
        <div class="forecast__cell"><div class="forecast__label">Vendas</div>
          <div class="forecast__value">${U.int(m.sales)}</div>
          <div class="muted" style="font-size:12px;margin-top:4px">${U.pct(m.convRate)} de conversão</div></div>
        <div class="forecast__cell"><div class="forecast__label">Ganho</div>
          <div class="forecast__value">${U.money0(m.revenue)}</div></div>
        <div class="forecast__cell"><div class="forecast__label">Ticket médio</div>
          <div class="forecast__value">${U.money0(m.ticket)}</div></div>
      </div>`;
  }

  return { render, metrics };
})();
