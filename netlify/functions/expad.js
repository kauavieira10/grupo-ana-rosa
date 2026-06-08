/* netlify/functions/expad.js -> /api/expad-sales */
const { env, json } = require("./_env");
exports.handler = async () => {
  const key = env("ExpadApiKey"), account = env("ExpadAccountId"), client = env("ExpadClientId");
  if (!key || !account) return json(500, { error: "Expad env vars ausentes" });
  try {
    const url = `https://api.expad.com.br/v1/sales?accountId=${encodeURIComponent(account)}` + (client ? `&clientId=${encodeURIComponent(client)}` : "");
    const r = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
    if (!r.ok) return json(r.status, { error: "Falha Expad" });
    return json(200, await r.json());
  } catch (e) { return json(502, { error: e.message }); }
};
