/* netlify/functions/meta.js -> /api/meta-creatives */
const { env, json } = require("./_env");
exports.handler = async () => {
  const token = env("MetaAccessToken"), account = env("MetaAdAccountId");
  if (!token || !account) return json(200, { configured: false });
  const acct = account.startsWith("act_") ? account : "act_" + account;
  const fields = "name,effective_status,insights{spend,actions},creative{thumbnail_url}";
  try {
    const r = await fetch(`https://graph.facebook.com/v19.0/${acct}/ads?fields=${encodeURIComponent(fields)}&limit=50&access_token=${token}`);
    if (!r.ok) return json(r.status, { error: "Falha Meta Graph" });
    const data = await r.json();
    const creatives = (data.data || []).map((ad) => {
      const ins = (ad.insights && ad.insights.data && ad.insights.data[0]) || {};
      const la = (ins.actions || []).find((a) => /lead/i.test(a.action_type));
      const leads = la ? Number(la.value) : 0, spend = Number(ins.spend || 0);
      return { id: ad.id, name: ad.name, status: ad.effective_status, spend, leads, cpl: leads ? spend / leads : 0, thumb: ad.creative && ad.creative.thumbnail_url };
    });
    return json(200, { creatives });
  } catch (e) { return json(502, { error: e.message }); }
};
