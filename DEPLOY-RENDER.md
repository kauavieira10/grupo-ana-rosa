# Deploy no Render — Grupo Ana Rosa

Fluxo atual de testes: subir no GitHub e conectar ao Render.

## 1. GitHub
1. Crie um repositório (ex.: `dashboard-grupo-ana-rosa`).
2. Suba todos os arquivos deste projeto (a raiz contém `index.html`, `server.js`, etc.).

## 2. Render
1. **New +** → **Web Service** → conecte o repositório.
2. Configurações:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (para testes)
   > O `render.yaml` já traz isso pronto se usar **Blueprint**.

## 3. Variáveis de ambiente (Environment)
Cadastre em **Environment** (marque tokens/keys como **Sensitive**):

```
GoogleSheetsApiKeyGrupoAnaRosa   = <API key do Google Sheets>
GoogleSheetsIdGrupoAnaRosa       = <ID da planilha>
GoogleSheetsNameGrupoAnaRosa     = <nome da aba, ex.: Página1>
GoogleSheetsRangeGrupoAnaRosa    = <range, ex.: A1:M1000>
MetaAccessTokenGrupoAnaRosa      = <access token do Meta>
MetaAdAccountIdGrupoAnaRosa      = act_<id da conta de anúncios>
ExpadApiKeyGrupoAnaRosa          = <api key Expad>
ExpadAccountIdGrupoAnaRosa       = <account id Expad>
ExpadClientIdGrupoAnaRosa        = <client id Expad>
```

> As chaves usam o slug **GrupoAnaRosa** (sem colchete/espaço/acento). Render só
> aceita letras, números e `_`.

## 4. Planilha pública
No Google Sheets: **Compartilhar → Qualquer pessoa com o link → Leitor**.

## 5. Webhook Expad (opcional)
Aponte o webhook da Expad para:
```
https://<seu-servico>.onrender.com/api/webhook/expad
```
Inspecione os últimos eventos em `/api/expad-debug`.

## 6. Validar
- Abra a URL do serviço.
- O badge no topo deve mudar de “Snapshot de fallback” para **“Dados ao vivo (Google Sheets)”**.
- Aba **Criativos** lista os anúncios do Meta; o card **Funil Expad** mostra qualificados/ganho.
