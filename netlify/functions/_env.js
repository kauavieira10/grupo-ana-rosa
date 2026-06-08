/* _env.js — helper compartilhado pelas Netlify Functions.
   CLIENT = slug CamelCase do cliente (sem colchete/espaço/acento). */
const CLIENT = "GrupoAnaRosa";
const env = (base) => process.env[base + CLIENT];
const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify(obj)
});
module.exports = { CLIENT, env, json };
