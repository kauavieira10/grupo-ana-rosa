/* expad.js — integração Expad (vendas/ganho). OPCIONAL no template, porém
   ATIVADA para este cliente. A chamada real fica em main.js (Expad.loadSales).
   Proxy: /api/expad-sales · Webhook: /api/webhook/expad */

window.Expad = (function () {
  function normalize(json) {
    // aceita {sales:[...], revenue, qualifiedLeads, ticket} ou lista crua
    const sales = json.sales || json.data || (Array.isArray(json) ? json : []);
    const revenue = json.revenue != null ? U.parseNum(json.revenue)
      : sales.reduce((a, s) => a + U.parseNum(s.amount || s.value), 0);
    const qualifiedLeads = json.qualifiedLeads != null ? U.parseNum(json.qualifiedLeads) : sales.length;
    const ticket = json.ticket != null ? U.parseNum(json.ticket)
      : (qualifiedLeads ? revenue / qualifiedLeads : 0);
    return { active: true, sales, revenue, qualifiedLeads, ticket };
  }

  async function loadSales() {
    if (!CONFIG.features.expad) return null;
    try {
      const json = await U.fetchJSON(CONFIG.api.expadSales, CONFIG.requestTimeoutMs);
      return normalize(json);
    } catch (e) {
      console.warn("[expad] usando fallback:", e.message);
      return null;
    }
  }

  return { loadSales, normalize };
})();
