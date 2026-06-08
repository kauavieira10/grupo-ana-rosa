/* sheets.js — Google Sheets (FONTE PRIMÁRIA). Busca em /api/sheets e
   converte para o modelo `daily`. Layout padrão das colunas (A–M):
   A=Data B=Dia C=VerbaGoogle D=LeadGoogle E=LeadExpad F=%Quebra G=CPLExpad
   H=VerbaFacebook I=LeadFB J=CPL_FB K=LeadTotalAcum L=%REF M=%META
   Se o cliente usar outro layout, ajuste só os índices em COL. */

window.Sheets = (function () {
  const COL = { data:0, dia:1, gSpend:2, gLeads:3, eLeads:4, quebra:5, eCPL:6,
                fSpend:7, fLeads:8, fCPL:9, leadsAcum:10, pctRef:11, pctMeta:12 };

  function isHeaderRow(row) {
    const a = String(row[0] || "").toLowerCase();
    return /data|dia|^$/.test(a) && !/^\d/.test(a);
  }
  function toISO(raw) {
    const s = String(raw || "").trim();
    let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);     // dd/mm/aaaa
    if (m) { const y = m[3].length === 2 ? "20" + m[3] : m[3]; return `${y}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`; }
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);  // já ISO
    return s;
  }

  function parseRows(values) {
    if (!Array.isArray(values)) return [];
    const out = [];
    for (const row of values) {
      if (!row || !row.length) continue;
      if (isHeaderRow(row)) continue;
      const date = toISO(row[COL.data]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;        // só linhas diárias válidas
      out.push({
        date,
        day:        String(row[COL.dia] || "").slice(0, 3),
        googleSpend: U.parseNum(row[COL.gSpend]),
        googleLeads: U.parseNum(row[COL.gLeads]),
        expadLeads:  U.parseNum(row[COL.eLeads]),
        pctBreak:    U.parseNum(row[COL.quebra]),
        expadCPL:    U.parseNum(row[COL.eCPL]),
        metaSpend:   U.parseNum(row[COL.fSpend]),
        metaLeads:   U.parseNum(row[COL.fLeads]),
        metaCPL:     U.parseNum(row[COL.fCPL]),
        leadsAccum:  U.parseNum(row[COL.leadsAcum]),
        pctRef:      U.parseNum(row[COL.pctRef]),
        pctGoal:     U.parseNum(row[COL.pctMeta])
      });
    }
    return out;
  }

  // monta totais/plataformas/donut a partir das linhas diárias
  function buildFromDaily(daily, base) {
    const gSpend = U.sum(daily, "googleSpend"), gLeads = U.sum(daily, "googleLeads");
    const mSpend = U.sum(daily, "metaSpend"),   mLeads = U.sum(daily, "metaLeads");
    const spent = gSpend + mSpend, leads = gLeads + mLeads;
    const ds = JSON.parse(JSON.stringify(base));    // clona o fallback como esqueleto
    ds.daily = daily;
    ds.platforms.google = { ...ds.platforms.google, budgetSpent: gSpend, leads: gLeads, cpl: gLeads ? gSpend / gLeads : 0 };
    ds.platforms.meta   = { ...ds.platforms.meta,   budgetSpent: mSpend, leads: mLeads, cpl: mLeads ? mSpend / mLeads : 0 };
    ds.totals.budgetSpent = spent;
    ds.totals.leads = leads;
    ds.totals.cpl = leads ? spent / leads : 0;
    ds.totals.pctGoal = ds.goals.leads ? (leads / ds.goals.leads) * 100 : 0;
    const last = daily[daily.length - 1];
    if (last && last.pctBreak) ds.totals.pctBreak = last.pctBreak;
    ds.meta.source = "live";
    return ds;
  }

  async function load() {
    if (!CONFIG.useLiveData || !CONFIG.features.google) return null;
    try {
      const json = await U.fetchJSON(CONFIG.api.sheets, CONFIG.requestTimeoutMs);
      const values = json.values || json.data || json.rows || json;
      const daily = parseRows(values);
      if (!daily.length) return null;
      return buildFromDaily(daily, window.DATASET);
    } catch (e) {
      console.warn("[sheets] usando fallback:", e.message);
      return null;
    }
  }

  return { load, parseRows, buildFromDaily, COL };
})();
