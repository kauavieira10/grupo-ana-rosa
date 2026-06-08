/* netlify/functions/sheets.js -> /api/sheets (redirect em netlify.toml) */
const { env, json } = require("./_env");
exports.handler = async () => {
  const key = env("GoogleSheetsApiKey"), id = env("GoogleSheetsId");
  const name = env("GoogleSheetsName") || "Página1";
  const range = env("GoogleSheetsRange") || "A1:M1000";
  if (!key || !id) return json(500, { error: "Sheets env vars ausentes" });
  try {
    const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(name + "!" + range)}?key=${key}`);
    if (!r.ok) return json(r.status, { error: "Falha Google Sheets" });
    const data = await r.json();
    return json(200, { values: data.values || [] });
  } catch (e) { return json(502, { error: e.message }); }
};
