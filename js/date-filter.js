/* date-filter.js — filtro de período. Mantém estado e emite 'periodchange'
   com {start, end}. Presets relativos ao período do dataset. */

window.DateFilter = (function () {
  let _all = [];          // datas ISO disponíveis (do dataset)
  let _state = { start: null, end: null, preset: "all" };

  function bounds() {
    if (!_all.length) return { min: null, max: null };
    return { min: _all[0], max: _all[_all.length - 1] };
  }

  function setData(daily) {
    _all = daily.map((d) => d.date).sort();
    const b = bounds();
    if (!_state.start) { _state.start = b.min; _state.end = b.max; }
  }

  function presetRange(preset) {
    const b = bounds();
    if (!b.max) return { start: null, end: null };
    const max = new Date(b.max + "T12:00:00");
    const back = (n) => { const d = new Date(max); d.setDate(d.getDate() - n + 1); const iso = d.toISOString().slice(0,10); return iso < b.min ? b.min : iso; };
    switch (preset) {
      case "7":  return { start: back(7),  end: b.max };
      case "14": return { start: back(14), end: b.max };
      case "30": return { start: back(30), end: b.max };
      default:   return { start: b.min, end: b.max };
    }
  }

  function emit() { document.dispatchEvent(new CustomEvent("periodchange", { detail: { ...
    _state } })); }

  function select(preset) {
    _state.preset = preset;
    const r = presetRange(preset);
    _state.start = r.start; _state.end = r.end;
    syncLabel(); markActive(); emit();
  }

  function custom(start, end) {
    _state.preset = "custom"; _state.start = start; _state.end = end;
    syncLabel(); markActive(); emit();
  }

  function get() { return { ..._state }; }

  function inRange(iso) {
    return (!_state.start || iso >= _state.start) && (!_state.end || iso <= _state.end);
  }

  function syncLabel() {
    const lbl = U.byId("df-label");
    if (!lbl) return;
    const map = { "7": "Últimos 7 dias", "14": "Últimos 14 dias", "30": "Últimos 30 dias", all: "Período todo", custom: "Personalizado" };
    lbl.textContent = map[_state.preset] || "Período";
  }
  function markActive() {
    U.qsa("#df-menu [data-preset]").forEach((b) => b.classList.toggle("is-active", b.dataset.preset === _state.preset));
  }

  function init() {
    const trigger = U.byId("df-trigger");
    const menu = U.byId("df-menu");
    if (!trigger || !menu) return;
    trigger.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("open"); });
    document.addEventListener("click", () => menu.classList.remove("open"));
    menu.addEventListener("click", (e) => e.stopPropagation());
    U.qsa("[data-preset]", menu).forEach((b) =>
      b.addEventListener("click", () => { select(b.dataset.preset); menu.classList.remove("open"); }));
    const cs = U.byId("df-start"), ce = U.byId("df-end");
    const applyCustom = () => { if (cs.value && ce.value) custom(cs.value, ce.value); };
    cs && cs.addEventListener("change", applyCustom);
    ce && ce.addEventListener("change", applyCustom);
    syncLabel(); markActive();
  }

  return { init, setData, select, custom, get, inRange };
})();
