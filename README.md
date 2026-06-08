# Dashboard de Performance — Grupo Ana Rosa

Dashboard de marketing digital da agência **Acesso**, clonado do template validado.
HTML/CSS/JS puro + Chart.js 4.4.0 (CDN), com proxy serverless (Render `server.js` ou
Netlify Functions). Nenhuma chave de API fica no front — tudo via variável de ambiente.

- **Cliente:** Grupo Ana Rosa (Saúde / Clínica)
- **Integrações:** Google Ads + Meta Ads + **Expad (ativa)**
- **Paleta:** primária `#8E1622` (bordô) · acento `#B5384A` (rosé) — tokens em `css/variables.css`
- **Fonte de dados:** Google Sheets (primária) · Meta Graph (criativos) · Expad (vendas/qualificados)
- Sem dados ao vivo, o painel usa o **snapshot de fallback** em `data/dataset.js`.

> ⚠️ Os números em `data/dataset.js` são **placeholder**. Substitua pelos dados reais
> do cliente (ou conecte a planilha) — ver seção "Pendências".

## Rodar local

```bash
npm install
npm start          # http://localhost:3000
```

## Variáveis de ambiente

Notação do molde: `NomeDeOrigem[Cliente]`. No painel use o slug **GrupoAnaRosa**
(sem colchete/espaço/acento). Marque chaves/tokens como **Sensitive**.

| Origem | Notação | Chave real |
|---|---|---|
| Google Sheets | `GoogleSheetsApiKey[Cliente]` | `GoogleSheetsApiKeyGrupoAnaRosa` |
| Google Sheets | `GoogleSheetsId[Cliente]` | `GoogleSheetsIdGrupoAnaRosa` |
| Google Sheets | `GoogleSheetsName[Cliente]` | `GoogleSheetsNameGrupoAnaRosa` |
| Google Sheets | `GoogleSheetsRange[Cliente]` | `GoogleSheetsRangeGrupoAnaRosa` |
| Meta Ads | `MetaAccessToken[Cliente]` | `MetaAccessTokenGrupoAnaRosa` |
| Meta Ads | `MetaAdAccountId[Cliente]` | `MetaAdAccountIdGrupoAnaRosa` |
| Expad | `ExpadApiKey[Cliente]` | `ExpadApiKeyGrupoAnaRosa` |
| Expad | `ExpadAccountId[Cliente]` | `ExpadAccountIdGrupoAnaRosa` |
| Expad | `ExpadClientId[Cliente]` | `ExpadClientIdGrupoAnaRosa` |

A planilha do Google precisa estar pública: **Qualquer pessoa com o link → Leitor**.

Layout esperado das colunas (A–M):
`A=Data · B=Dia · C=Verba Google · D=Lead Google · E=Lead Expad · F=%Quebra ·
G=CPL Expad · H=Verba Facebook · I=Lead FB · J=CPL FB · K=Lead Total Acum · L=%REF · M=%META`
Outro layout? Ajuste só os índices em `js/sheets.js` (`COL`).

## Endpoints do proxy

- `GET /api/sheets` — linhas diárias do Google Sheets
- `GET /api/meta-creatives` — criativos do Meta Ads
- `GET /api/expad-sales` — vendas/qualificados (Expad)
- `POST /api/webhook/expad` — recebe eventos da Expad (`/api/expad-debug` p/ inspecionar)

## Deploy

- **Render:** ver `DEPLOY-RENDER.md` (fluxo atual de testes).
- **Netlify:** `netlify.toml` já mapeia os endpoints para as functions.

## Pendências (placeholders a preencher)

- Números reais em `data/dataset.js` (totais, metas, donut, top campanhas, Expad).
- ID/aba/range reais da planilha do Google Sheets.
- Conta Meta (`act_…`) e conta/credenciais Expad.
- **`assets/logo-acesso-white.png` é um placeholder** — troque pela logo oficial branca da Acesso.

## O que NÃO foi alterado (regras do molde)

Design glassmorphism, ícones, fontes (Inter + Plus Jakarta Sans), as duas views
(Estatísticas/Criativos), KPIs, gráficos, donut, tabela, insights, projeção e a ordem
dos scripts em `index.html`. Mudaram apenas paleta, identidade, números e integrações.
