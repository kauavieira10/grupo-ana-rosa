/* report.js — exporta o detalhamento diário (CSV) e dispara impressão p/ PDF. */

window.Report = (function () {
  function toCSV(m) {
    const head = ["Data", "Dia", "Verba Google", "Leads Google", "Verba Meta", "Leads Meta", "Leads acum.", "% Meta"];
    const lines = [head.join(";")];
    m.daily.forEach((d) => {
      lines.push([d.date, d.day, d.googleSpend, d.googleLeads, d.metaSpend, d.metaLeads, d.leadsAccum, d.pctGoal].join(";"));
    });
    lines.push(["TOTAL", "", m.platforms.google.budgetSpent, m.platforms.google.leads,
      m.platforms.meta.budgetSpent, m.platforms.meta.leads, m.totals.leads, m.totals.pctGoal.toFixed(1)].join(";"));
    return lines.join("\n");
  }

  function downloadCSV(m) {
    const blob = new Blob(["\uFEFF" + toCSV(m)], { type: "text/csv;charset=utf-8" });
    const a = U.el("a", { href: URL.createObjectURL(blob), download: `relatorio-${CONFIG.clientSlug}-${m.meta.periodEnd}.csv` });
    document.body.appendChild(a); a.click(); a.remove();
  }

  function init(getModel) {
    const btn = U.byId("btn-report");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const m = getModel();
      downloadCSV(m);
      // opção visual de PDF via impressão (após pequeno delay para o download iniciar)
      setTimeout(() => window.print(), 400);
    });
  }

  return { init, downloadCSV, toCSV };
})();
