/* main.js — bootstrap e orquestração. Ordem de carga dos scripts definida
   no index.html (NÃO alterar). A chamada da Expad está ATIVA (cliente confirmou). */

(function () {
  let working = JSON.parse(JSON.stringify(window.DATASET)); // modelo de trabalho
  let creativesData = working.creatives.slice();
  let platformFilter = "all";       // all | google | meta
  let creativeFilter = "all";       // all | active | paused

  // ---------- header / identidade ----------
  function paintIdentity() {
    const meta = working.meta;
    const ini = meta.initials || U.initials(meta.clientName);
    U.byId("logo-initials").textContent = ini;
    U.byId("client-name").textContent = meta.clientName;
    U.byId("client-sub").textContent =
      `${meta.segment || ""} · ${U.fmtDateLong(meta.periodStart)} – ${U.fmtDateLong(meta.periodEnd)}`;
    document.title = `${meta.clientName} · Dashboard de Performance`;
    const src = U.byId("datasource");
    if (src) {
      const live = meta.source === "live";
      src.className = "datasource " + (live ? "live" : "fallback");
      src.innerHTML = `<span class="dot"></span> ${live ? "Dados ao vivo (Google Sheets)" : "Snapshot de fallback"}`;
    }
  }

  // ---------- view-model conforme filtros ----------
  function computeModel() {
    const daily = working.daily.filter((d) => DateFilter.inRange(d.date));
    const gSpend = U.sum(daily, "googleSpend"), gLeads = U.sum(daily, "googleLeads");
    const mSpend = U.sum(daily, "metaSpend"),   mLeads = U.sum(daily, "metaLeads");
    const incG = platformFilter !== "meta", incM = platformFilter !== "google";
    const spent = (incG ? gSpend : 0) + (incM ? mSpend : 0);
    const leads = (incG ? gLeads : 0) + (incM ? mLeads : 0);
    const lastBreak = daily.length ? daily[daily.length - 1].pctBreak : working.totals.pctBreak;

    return {
      meta: working.meta,
      goals: working.goals,
      platformFilter,
      daily,
      totals: {
        budgetPlanned: (incG ? working.platforms.google.budgetPlanned : 0) + (incM ? working.platforms.meta.budgetPlanned : 0),
        budgetSpent: spent,
        leads,
        cpl: leads ? spent / leads : 0,
        pctGoal: working.goals.leads ? (leads / working.goals.leads) * 100 : 0,
        pctBreak: lastBreak
      },
      platforms: {
        google: { ...working.platforms.google, budgetSpent: gSpend, leads: gLeads, cpl: gLeads ? gSpend / gLeads : 0 },
        meta:   { ...working.platforms.meta,   budgetSpent: mSpend, leads: mLeads, cpl: mLeads ? mSpend / mLeads : 0 }
      },
      donut: working.donut,
      campaigns: working.campaigns,
      expad: working.expad
    };
  }

  let _model = null;
  function getModel() { return _model; }

  function renderStats() {
    _model = computeModel();
    paintIdentity();
    KPIs.render(_model);
    Charts.render(_model);
    Platforms.render(_model);
    Campaigns.render(_model);
    DetailTable.render(_model);
    Forecast.render(_model);
    if (window.ExpadQualified) ExpadQualified.render(_model);
  }

  // ---------- criativos (view Meta) ----------
  function renderCreatives() {
    const host = U.byId("creatives-grid");
    if (!host) return;
    let list = creativesData.filter((c) => creativeFilter === "all" || c.status === creativeFilter);
    if (!list.length) { host.innerHTML = `<div class="empty">Nenhum criativo ${creativeFilter === "paused" ? "pausado" : creativeFilter === "active" ? "ativo" : ""} no período.</div>`; return; }
    host.innerHTML = list.map((c) => {
      const ini = U.initials(c.name, 2);
      const thumb = c.thumb
        ? `<img class="creative__thumb" src="${c.thumb}" alt="${c.name}" loading="lazy">`
        : `<div class="creative__thumb" style="display:grid;place-items:center;color:#fff;font-family:var(--font-title);font-weight:800;font-size:28px">${ini}</div>`;
      return `<div class="creative glass">
        ${thumb}
        <div class="creative__body">
          <div class="creative__name">${c.name}</div>
          <div class="creative__row"><span><span class="status-dot status-dot--${c.status === "active" ? "active" : "paused"}"></span>${c.status === "active" ? "Ativo" : "Pausado"}</span><b>${U.money0(c.spend)}</b></div>
          <div class="creative__row"><span>Leads</span><b>${U.int(c.leads)}</b></div>
          <div class="creative__row"><span>CPL</span><b>${U.money(c.cpl)}</b></div>
        </div>
      </div>`;
    }).join("");
  }

  // ---------- controles ----------
  function wireControls() {
    // tabs de view
    U.qsa("[data-view]").forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.view;
      U.qsa("[data-view]").forEach((x) => x.classList.toggle("is-active", x === b));
      U.qsa(".view").forEach((vw) => vw.classList.toggle("is-active", vw.dataset.viewname === v));
      if (v === "creatives") renderCreatives();
    }));

    // segmented plataforma
    U.qsa("[data-platform]").forEach((b) => b.addEventListener("click", () => {
      platformFilter = b.dataset.platform === "facebook" ? "meta" : b.dataset.platform;
      U.qsa("[data-platform]").forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
      renderStats();
    }));

    // segmented status criativos
    U.qsa("[data-creative]").forEach((b) => b.addEventListener("click", () => {
      creativeFilter = b.dataset.creative;
      U.qsa("[data-creative]").forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
      renderCreatives();
    }));

    // refresh
    const refresh = U.byId("btn-refresh");
    refresh && refresh.addEventListener("click", async () => {
      refresh.classList.add("spin");
      await loadData();
      renderStats(); renderCreatives();
      setTimeout(() => refresh.classList.remove("spin"), 600);
    });

    // tema -> redesenha gráficos com novas cores
    document.addEventListener("themechange", () => { Charts.render(computeModel()); });
    // período -> re-render
    document.addEventListener("periodchange", () => { renderStats(); });
  }

  // ---------- carga de dados ----------
  async function loadData() {
    // 1) Google Sheets = fonte primária
    const live = await Sheets.load();
    working = live || JSON.parse(JSON.stringify(window.DATASET));
    if (!live) working.meta.source = "fallback";

    // 2) Meta = criativos
    if (CONFIG.features.meta) {
      const cr = await Meta.loadCreatives();
      creativesData = cr || window.DATASET.creatives.slice();
    }

    // 3) Expad = vendas/qualificados (ATIVA — chamada habilitada)
    if (CONFIG.features.expad) {
      const ex = await Expad.loadSales();
      if (ex) working.expad = { ...working.expad, ...ex, active: true };
    }

    DateFilter.setData(working.daily);
  }

  // ---------- boot ----------
  async function boot() {
    Theme.init();
    DateFilter.init();
    wireControls();
    Report.init(getModel);
    // primeiro paint com fallback (rápido), depois tenta ao vivo
    DateFilter.setData(working.daily);
    renderStats();
    await loadData();
    DateFilter.select("all");   // garante range completo após carregar
    renderStats();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
