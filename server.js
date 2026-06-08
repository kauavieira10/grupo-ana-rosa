/* server.js — proxy serverless (Render). Nenhuma chave fica no front:
   tudo vem de variáveis de ambiente com SUFIXO do cliente.
   CLIENT = slug CamelCase do cliente (sem colchete/espaço/acento). */

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));

const CLIENT = "GrupoAnaRosa";                 // slug do cliente
const env = (base) => process.env[base + CLIENT];

// ---- credenciais (env por cliente) ----
const SHEETS_API_KEY = env("GoogleSheetsApiKey");
const SHEETS_ID      = env("GoogleSheetsId");
const SHEETS_NAME    = env("GoogleSheetsName")  || "Página1";
const SHEETS_RANGE   = env("GoogleSheetsRange") || "A1:M1000";
const META_TOKEN     = env("MetaAccessToken");
const META_ACCOUNT   = env("MetaAdAccountId");
const EXPAD_API_KEY  = env("ExpadApiKey");
const EXPAD_ACCOUNT  = env("ExpadAccountId");
const EXPAD_CLIENT   = env("ExpadClientId");

const ok  = (res, data) => res.json(data);
const bad = (res, code, msg) => res.status(code).json({ error: msg });

// ---------- /api/sheets (fonte primária) ----------
app.get("/api/sheets", async (_req, res) => {
  if (!SHEETS_API_KEY || !SHEETS_ID) return ok(res, { configured: false });
  try {
    const range = encodeURIComponent(`${SHEETS_NAME}!${SHEETS_RANGE}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${range}?key=${SHEETS_API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return bad(res, r.status, "Falha Google Sheets");
    const json = await r.json();
    ok(res, { values: json.values || [] });
  } catch (e) { bad(res, 502, e.message); }
});

// ---------- /api/meta-creatives (view Criativos) ----------
app.get("/api/meta-creatives", async (_req, res) => {
  if (!META_TOKEN || !META_ACCOUNT) return ok(res, { configured: false });
  try {
    const acct = META_ACCOUNT.startsWith("act_") ? META_ACCOUNT : "act_" + META_ACCOUNT;
    const fields = "name,effective_status,insights{spend,actions},creative{thumbnail_url}";
    const url = `https://graph.facebook.com/v19.0/${acct}/ads?fields=${encodeURIComponent(fields)}&limit=50&access_token=${META_TOKEN}`;
    const r = await fetch(url);
    if (!r.ok) return bad(res, r.status, "Falha Meta Graph");
    const json = await r.json();
    const creatives = (json.data || []).map((ad) => {
      const ins = (ad.insights && ad.insights.data && ad.insights.data[0]) || {};
      const leadAct = (ins.actions || []).find((a) => /lead/i.test(a.action_type));
      const leads = leadAct ? Number(leadAct.value) : 0;
      const spend = Number(ins.spend || 0);
      return {
        id: ad.id, name: ad.name, status: ad.effective_status,
        spend, leads, cpl: leads ? spend / leads : 0,
        thumb: ad.creative && ad.creative.thumbnail_url
      };
    });
    ok(res, { creatives });
  } catch (e) { bad(res, 502, e.message); }
});

// ---------- /api/expad-sales (vendas/qualificados) ----------
app.get("/api/expad-sales", async (_req, res) => {
  if (!EXPAD_API_KEY || !EXPAD_ACCOUNT) return ok(res, { configured: false });
  try {
    // Ajuste a URL/headers conforme a doc da Expad do cliente.
    const url = `https://api.expad.com.br/v1/sales?accountId=${encodeURIComponent(EXPAD_ACCOUNT)}` +
                (EXPAD_CLIENT ? `&clientId=${encodeURIComponent(EXPAD_CLIENT)}` : "");
    const r = await fetch(url, { headers: { Authorization: `Bearer ${EXPAD_API_KEY}` } });
    if (!r.ok) return bad(res, r.status, "Falha Expad");
    ok(res, await r.json());
  } catch (e) { bad(res, 502, e.message); }
});

// ---------- /api/webhook/expad (recebe eventos da Expad) ----------
const expadEvents = [];
app.post("/api/webhook/expad", (req, res) => {
  expadEvents.push({ at: new Date().toISOString(), body: req.body });
  res.json({ received: true });
});
app.get("/api/expad-debug", (_req, res) => ok(res, { count: expadEvents.length, last: expadEvents.slice(-5) }));

// ---------- estáticos (front) ----------
app.use(express.static(path.join(__dirname)));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard ${CLIENT} on :${PORT}`));
