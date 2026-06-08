/* theme.js — alternador de tema (lua/sol) com persistência em localStorage */

window.Theme = (function () {
  const KEY = "ana-rosa-theme";
  function apply(t) { document.documentElement.setAttribute("data-theme", t); }
  function current() { return document.documentElement.getAttribute("data-theme") || "light"; }

  function init() {
    let t = localStorage.getItem(KEY);
    if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    apply(t);
    const btn = U.byId("btn-theme");
    if (btn) btn.addEventListener("click", toggle);
  }
  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem(KEY, next);
    document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  }
  return { init, toggle, current };
})();
