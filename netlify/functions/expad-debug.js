/* netlify/functions/expad-debug.js -> /api/expad-debug
   Útil para inspecionar a config (sem expor segredos). */
const { env, json } = require("./_env");
exports.handler = async () => json(200, {
  expadConfigured: Boolean(env("ExpadApiKey") && env("ExpadAccountId")),
  metaConfigured:  Boolean(env("MetaAccessToken") && env("MetaAdAccountId")),
  sheetsConfigured: Boolean(env("GoogleSheetsApiKey") && env("GoogleSheetsId"))
});
