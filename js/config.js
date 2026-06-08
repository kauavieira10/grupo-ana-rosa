/* config.js — configuração do cliente e endpoints do proxy.
   Cliente: Grupo Ana Rosa · Integrações: Google + Meta · Expad: ATIVA */

window.CONFIG = {
  clientSlug: "GrupoAnaRosa",

  // liga/desliga integrações (refletido na UI por main.js)
  features: {
    google: true,
    meta:   true,
    expad:  true   // ATIVADA por confirmação do cliente
  },

  // endpoints amigáveis servidos pelo proxy (server.js / netlify functions)
  api: {
    sheets:        "/api/sheets",
    metaCreatives: "/api/meta-creatives",
    expadSales:    "/api/expad-sales",
    expadWebhook:  "/api/webhook/expad"
  },

  // tenta dados ao vivo; se falhar, usa o snapshot em data/dataset.js
  useLiveData: true,
  requestTimeoutMs: 9000
};
