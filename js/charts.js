/* charts.js — Chart.js 4.x. Todos os gráficos leem tokens CSS via
   getComputedStyle, então a paleta propaga automaticamente.
   Fallbacks e palette[] ajustados para a paleta do cliente (seção 5.2). */

window.Charts = (function () {
  const inst = {};   // instâncias por id (para destruir no re-render)

  function css(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // cores de tema (fallbacks = paleta Grupo Ana Rosa)
  function themeColors() {
    return {
      primary: css("--primary", "#8E1622"),
      accent:  css("--accent",  "#B5384A"),
      text:    css("--text",    "#2A1418"),
      muted:   css("--muted",   "#8A6E73"),
      grid:    css("--glass-border", "rgba(0,0,0,.08)"),
      purple:  "#A78BFA",
      red:     "#F87171"
    };
  }

  // paleta categórica do donut (10 cores). 1ª = primária, 2ª = acento.
  function donutPalette() {
    const c = themeColors();
    return [c.primary, c.accent, "#C9748A", "#7E2A3A", "#D99AA6",
            "#A23B4E", "#E0B4BC", "#6E0F19", c.purple, "#5B4045"];
  }

  function baseOpts(t) {
    return {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: css("--glass-bg", "#fff"),
          titleColor: t.text, bodyColor: t.text, borderColor: t.grid, borderWidth: 1,
          padding: 10, cornerRadius: 10, displayColors: true
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: t.muted, font: { size: 11 } } },
        y: { grid: { color: t.grid }, ticks: { color: t.muted, font: { size: 11 } }, beginAtZero: true }
      }
    };
  }

  function destroy(id) { if (inst[id]) { inst[id].destroy(); delete inst[id]; } }

  function mk(id, cfg) {
    const el = U.byId(id); if (!el) return;
    destroy(id);
    inst[id] = new Chart(el.getContext("2d"), cfg);
  }

  function combined(m) {
    const t = themeColors();
    const labels = m.daily.map((d) => U.fmtDateShort(d.date));
    const invest = m.daily.map((d) => (m.platformFilter !== "meta" ? d.googleSpend : 0) + (m.platformFilter !== "google" ? d.metaSpend : 0));
    // leads acumulados respeitando filtro de plataforma
    let acc = 0;
    const leadsAcc = m.daily.map((d) => { acc += (m.platformFilter !== "meta" ? d.googleLeads : 0) + (m.platformFilter !== "google" ? d.metaLeads : 0); return acc; });
    const opts = baseOpts(t);
    opts.scales.y.title = { display: true, text: "Investimento", color: t.muted };
    opts.scales.y1 = { position: "right", grid: { drawOnChartArea: false }, ticks: { color: t.muted, font: { size: 11 } }, beginAtZero: true, title: { display: true, text: "Leads acum.", color: t.muted } };
    mk("chart-combined", {
      data: {
        labels,
        datasets: [
          { type: "bar", label: "Investimento", data: invest, backgroundColor: t.primary, borderRadius: 6, yAxisID: "y", maxBarThickness: 26 },
          { type: "line", label: "Leads acumulados", data: leadsAcc, borderColor: t.accent, backgroundColor: t.accent, tension: .35, borderWidth: 3, pointRadius: 0, yAxisID: "y1" }
        ]
      },
      options: opts
    });
  }

  function leadsPerDay(m) {
    const t = themeColors();
    const labels = m.daily.map((d) => U.fmtDateShort(d.date));
    const g = m.daily.map((d) => d.googleLeads);
    const me = m.daily.map((d) => d.metaLeads);
    const ds = [];
    if (m.platformFilter !== "meta")   ds.push({ label: "Google", data: g,  backgroundColor: t.primary, borderRadius: 5, stack: "s" });
    if (m.platformFilter !== "google") ds.push({ label: "Meta",   data: me, backgroundColor: t.accent,  borderRadius: 5, stack: "s" });
    const opts = baseOpts(t); opts.scales.x.stacked = true; opts.scales.y.stacked = true;
    mk("chart-leads", { type: "bar", data: { labels, datasets: ds }, options: opts });
  }

  function cplPerDay(m) {
    const t = themeColors();
    const labels = m.daily.map((d) => U.fmtDateShort(d.date));
    const cpl = m.daily.map((d) => {
      const sp = (m.platformFilter !== "meta" ? d.googleSpend : 0) + (m.platformFilter !== "google" ? d.metaSpend : 0);
      const ld = (m.platformFilter !== "meta" ? d.googleLeads : 0) + (m.platformFilter !== "google" ? d.metaLeads : 0);
      return ld ? +(sp / ld).toFixed(2) : 0;
    });
    const opts = baseOpts(t);
    mk("chart-cpl", {
      type: "line",
      data: { labels, datasets: [
        { label: "CPL", data: cpl, borderColor: t.primary, backgroundColor: t.primary + "22", fill: true, tension: .35, borderWidth: 3, pointRadius: 0 },
        { label: "Meta CPL", data: labels.map(() => m.goals.cpl), borderColor: t.red, borderDash: [6, 6], borderWidth: 2, pointRadius: 0 }
      ] },
      options: opts
    });
  }

  function donut(m) {
    const t = themeColors();
    const data = (m.donut || []).filter((d) => {
      if (m.platformFilter === "google") return /google/i.test(d.label);
      if (m.platformFilter === "meta")   return /meta|facebook/i.test(d.label);
      return true;
    });
    const colors = donutPalette();
    mk("chart-donut", {
      type: "doughnut",
      data: { labels: data.map((d) => d.label), datasets: [{ data: data.map((d) => d.value), backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%",
        plugins: { legend: { display: false },
          tooltip: { backgroundColor: css("--glass-bg", "#fff"), titleColor: t.text, bodyColor: t.text, borderColor: t.grid, borderWidth: 1, padding: 10, cornerRadius: 10,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${U.money0(ctx.parsed)}` } } } }
    });
    // legenda manual
    const legend = U.byId("donut-legend");
    if (legend) {
      const total = U.sum(data, "value") || 1;
      legend.innerHTML = data.map((d, i) => `
        <div class="donut-legend__item">
          <span class="donut-legend__dot" style="background:${colors[i % colors.length]}"></span>
          <span>${d.label}</span>
          <span class="donut-legend__val">${U.pct((d.value / total) * 100, 0)}</span>
        </div>`).join("");
    }
  }

  function render(m) { combined(m); leadsPerDay(m); cplPerDay(m); donut(m); }
  function destroyAll() { Object.keys(inst).forEach(destroy); }

  return { render, destroyAll, themeColors };
})();
