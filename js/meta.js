/* meta.js — Meta Ads (view CRIATIVOS). Busca em /api/meta-creatives e
   normaliza para {id,name,platform,status,spend,leads,cpl,thumb}. */

window.Meta = (function () {
  function normalize(json) {
    const list = json.creatives || json.data || (Array.isArray(json) ? json : []);
    return list.map((c, i) => {
      const spend = U.parseNum(c.spend ?? c.amount_spent);
      const leads = U.parseNum(c.leads ?? c.results ?? c.actions);
      return {
        id: c.id || c.ad_id || "ad" + i,
        name: c.name || c.ad_name || ("Criativo " + (i + 1)),
        platform: "meta",
        status: /active|ativo/i.test(c.status || c.effective_status || "") ? "active" : "paused",
        spend, leads,
        cpl: leads ? spend / leads : 0,
        thumb: c.thumb || c.thumbnail_url || c.image_url || ""
      };
    });
  }

  async function loadCreatives() {
    if (!CONFIG.features.meta) return null;
    try {
      const json = await U.fetchJSON(CONFIG.api.metaCreatives, CONFIG.requestTimeoutMs);
      if (json && json.configured === false) return null;   // sem env -> fallback
      const arr = normalize(json);
      return arr.length ? arr : null;
    } catch (e) {
      console.warn("[meta] usando fallback de criativos:", e.message);
      return null;
    }
  }

  return { loadCreatives, normalize };
})();
