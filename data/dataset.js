/* data/dataset.js — SNAPSHOT DE FALLBACK + identidade do cliente.
   ⚠ NÚMEROS PLACEHOLDER: substitua pelos dados reais do Grupo Ana Rosa.
   As iniciais do logo são geradas a partir de meta.clientName (ou meta.initials).
   Período de referência: maio/2026 (ajuste conforme a planilha real). */

window.DATASET = {
  meta: {
    clientName: "Grupo Ana Rosa",
    initials: "AR",                 // opcional; se removido, gera das iniciais do nome
    segment: "Saúde / Clínica",
    periodStart: "2026-05-01",
    periodEnd:   "2026-05-31",
    currency: "BRL",
    source: "fallback"              // sobrescrito por 'live' quando a planilha responde
  },

  // metas do período
  goals: {
    leads: 500,
    cpl: 55.00,
    budget: 30000.00
  },

  // totais consolidados (período inteiro)
  totals: {
    budgetPlanned: 30000.00,
    budgetSpent:   27450.00,
    leads:         521,
    cpl:           52.69,
    pctGoal:       104.2,   // % da meta de leads atingida
    pctBreak:      3.1      // % de quebra média
  },

  // quebra por plataforma
  platforms: {
    google: { budgetPlanned: 15000, budgetSpent: 14200, leads: 286, cpl: 49.65 },
    meta:   { budgetPlanned: 15000, budgetSpent: 13250, leads: 235, cpl: 56.38 }
  },

  // composição do investimento (donut)
  donut: [
    { label: "Google – Pesquisa",   value: 9800 },
    { label: "Google – Display",    value: 4400 },
    { label: "Meta – Conversões",   value: 8100 },
    { label: "Meta – Tráfego",      value: 3150 },
    { label: "Meta – Remarketing",  value: 2000 }
  ],

  // top campanhas por investimento (Google entra manual; Meta via API no futuro)
  campaigns: [
    { name: "Oftalmologia – Pesquisa",      platform: "google", spend: 6200, leads: 138, cpl: 44.93 },
    { name: "Check-up Saúde – Conversões",  platform: "meta",   spend: 5100, leads: 92,  cpl: 55.43 },
    { name: "Cardiologia – Pesquisa",       platform: "google", spend: 3600, leads: 71,  cpl: 50.70 },
    { name: "Dermatologia – Tráfego",       platform: "meta",   spend: 3150, leads: 58,  cpl: 54.31 },
    { name: "Marca – Remarketing",          platform: "meta",   spend: 2000, leads: 41,  cpl: 48.78 }
  ],

  // Expad (ATIVA): leads qualificados + ganho
  expad: {
    active: true,
    qualifiedLeads: 184,
    revenue: 96400.00,
    ticket: 523.91,
    sales: [
      { date: "2026-05-09", amount: 1200 },
      { date: "2026-05-16", amount: 2400 },
      { date: "2026-05-23", amount: 1800 }
    ]
  },

  // série diária — colunas equivalentes ao layout A–M da planilha
  // {date, day, googleSpend, googleLeads, expadLeads, pctBreak, expadCPL,
  //  metaSpend, metaLeads, metaCPL, leadsAccum, pctRef, pctGoal}
  daily: [
    { date: "2026-05-01", day: "Qui", googleSpend: 980, googleLeads: 19, expadLeads: 7,  pctBreak: 2.1, expadCPL: 51.5, metaSpend: 910, metaLeads: 15, metaCPL: 60.6, leadsAccum: 34,  pctRef: 100, pctGoal: 102 },
    { date: "2026-05-02", day: "Sex", googleSpend: 1020,googleLeads: 21, expadLeads: 8,  pctBreak: 1.8, expadCPL: 48.6, metaSpend: 880, metaLeads: 16, metaCPL: 55.0, leadsAccum: 71,  pctRef: 99,  pctGoal: 104 },
    { date: "2026-05-05", day: "Seg", googleSpend: 1100,googleLeads: 23, expadLeads: 9,  pctBreak: 3.0, expadCPL: 47.8, metaSpend: 950, metaLeads: 18, metaCPL: 52.8, leadsAccum: 112, pctRef: 101, pctGoal: 106 },
    { date: "2026-05-06", day: "Ter", googleSpend: 1040,googleLeads: 20, expadLeads: 7,  pctBreak: 2.5, expadCPL: 52.0, metaSpend: 1010,metaLeads: 17, metaCPL: 59.4, leadsAccum: 149, pctRef: 98,  pctGoal: 103 },
    { date: "2026-05-07", day: "Qua", googleSpend: 1080,googleLeads: 22, expadLeads: 8,  pctBreak: 4.2, expadCPL: 49.1, metaSpend: 940, metaLeads: 16, metaCPL: 58.8, leadsAccum: 187, pctRef: 100, pctGoal: 105 },
    { date: "2026-05-08", day: "Qui", googleSpend: 990, googleLeads: 18, expadLeads: 6,  pctBreak: 3.6, expadCPL: 55.0, metaSpend: 870, metaLeads: 15, metaCPL: 58.0, leadsAccum: 220, pctRef: 97,  pctGoal: 101 },
    { date: "2026-05-09", day: "Sex", googleSpend: 1060,googleLeads: 24, expadLeads: 10, pctBreak: 2.0, expadCPL: 44.2, metaSpend: 1100,metaLeads: 19, metaCPL: 57.9, leadsAccum: 263, pctRef: 102, pctGoal: 108 },
    { date: "2026-05-12", day: "Seg", googleSpend: 1130,googleLeads: 25, expadLeads: 9,  pctBreak: 2.8, expadCPL: 45.2, metaSpend: 980, metaLeads: 18, metaCPL: 54.4, leadsAccum: 306, pctRef: 101, pctGoal: 107 },
    { date: "2026-05-13", day: "Ter", googleSpend: 1010,googleLeads: 20, expadLeads: 7,  pctBreak: 3.3, expadCPL: 50.5, metaSpend: 900, metaLeads: 16, metaCPL: 56.3, leadsAccum: 342, pctRef: 99,  pctGoal: 104 },
    { date: "2026-05-14", day: "Qua", googleSpend: 1070,googleLeads: 22, expadLeads: 8,  pctBreak: 3.9, expadCPL: 48.6, metaSpend: 1020,metaLeads: 18, metaCPL: 56.7, leadsAccum: 382, pctRef: 100, pctGoal: 105 },
    { date: "2026-05-15", day: "Qui", googleSpend: 1000,googleLeads: 19, expadLeads: 6,  pctBreak: 4.5, expadCPL: 52.6, metaSpend: 860, metaLeads: 14, metaCPL: 61.4, leadsAccum: 415, pctRef: 96,  pctGoal: 100 },
    { date: "2026-05-16", day: "Sex", googleSpend: 1090,googleLeads: 23, expadLeads: 10, pctBreak: 2.2, expadCPL: 47.4, metaSpend: 1080,metaLeads: 19, metaCPL: 56.8, leadsAccum: 457, pctRef: 102, pctGoal: 108 },
    { date: "2026-05-19", day: "Seg", googleSpend: 1120,googleLeads: 24, expadLeads: 9,  pctBreak: 2.6, expadCPL: 46.7, metaSpend: 970, metaLeads: 17, metaCPL: 57.1, leadsAccum: 498, pctRef: 101, pctGoal: 106 },
    { date: "2026-05-20", day: "Ter", googleSpend: 980, googleLeads: 18, expadLeads: 7,  pctBreak: 3.1, expadCPL: 51.1, metaSpend: 800, metaLeads: 13, metaCPL: 61.5, leadsAccum: 529, pctRef: 95,  pctGoal: 99 }
  ],

  // fallback dos criativos (Meta) caso a API não responda
  creatives: [
    { id: "c1", name: "Check-up — Vídeo 15s",     platform: "meta", status: "active", spend: 1820, leads: 34, cpl: 53.5, thumb: "" },
    { id: "c2", name: "Oftalmo — Carrossel",       platform: "meta", status: "active", spend: 1540, leads: 29, cpl: 53.1, thumb: "" },
    { id: "c3", name: "Dermato — Imagem única",    platform: "meta", status: "paused", spend: 980,  leads: 16, cpl: 61.3, thumb: "" },
    { id: "c4", name: "Marca — Remarketing",       platform: "meta", status: "active", spend: 2000, leads: 41, cpl: 48.8, thumb: "" },
    { id: "c5", name: "Cardio — Reels",            platform: "meta", status: "paused", spend: 760,  leads: 11, cpl: 69.1, thumb: "" }
  ]
};
