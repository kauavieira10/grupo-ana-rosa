/* table.js — tabela de detalhamento diário (respeita filtro de plataforma). */

window.DetailTable = (function () {
  function render(m) {
    const host = U.byId("detail-table");
    if (!host) return;
    const pf = m.platformFilter;
    const showG = CONFIG.features.google && (pf === "all" || pf === "google");
    const showM = CONFIG.features.meta && (pf === "all" || pf === "meta");

    const head = ["Data", "Dia"];
    if (showG) head.push("Verba Google", "Leads Google");
    if (showM) head.push("Verba Meta", "Leads Meta");
    head.push("CPL dia", "Leads acum.", "% Meta");

    let tg = 0, tgl = 0, tm = 0, tml = 0;
    const rows = m.daily.map((d) => {
      const gl = d.googleLeads, ml = d.metaLeads;
      const spend = (showG ? d.googleSpend : 0) + (showM ? d.metaSpend : 0);
      const leads = (showG ? gl : 0) + (showM ? ml : 0);
      tg += d.googleSpend; tgl += gl; tm += d.metaSpend; tml += ml;
      const cpl = leads ? spend / leads : 0;
      const cells = [U.fmtDateShort(d.date), d.day];
      if (showG) cells.push(U.money0(d.googleSpend), U.int(gl));
      if (showM) cells.push(U.money0(d.metaSpend), U.int(ml));
      cells.push(U.money(cpl), U.int(d.leadsAccum), U.pct(d.pctGoal));
      return `<tr>${cells.map((c, i) => `<td${i === 0 ? "" : ""}>${c}</td>`).join("")}</tr>`;
    }).join("");

    const foot = ["Total", ""];
    if (showG) foot.push(U.money0(tg), U.int(tgl));
    if (showM) foot.push(U.money0(tm), U.int(tml));
    const totSpend = (showG ? tg : 0) + (showM ? tm : 0);
    const totLeads = (showG ? tgl : 0) + (showM ? tml : 0);
    foot.push(U.money(totLeads ? totSpend / totLeads : 0), U.int(totLeads), "—");

    host.innerHTML = `
      <div class="table-scroll">
        <table class="detail">
          <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr>${foot.map((f) => `<td>${f}</td>`).join("")}</tr></tfoot>
        </table>
      </div>`;
  }
  return { render };
})();
