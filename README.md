# TikTok LIVE Conector

Painel HTML e backend Node.js para consultar o estado de uma LIVE via Tik.Tools.

## Deploy no Render

- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`
- Runtime: Node.js 20+

Configure estas variáveis no serviço Render:

- `TIKTOOLS_API_KEY`: chave da API Tik.Tools. Como a chave anterior foi compartilhada na conversa, gere uma nova antes de produção.
- `TIKTOK_USERNAME`: `nandobr_ofc` (sem @).

Nunca coloque a chave da API em `index.html`, arquivos públicos ou no navegador.

## Endpoints

- `GET /health` — informa se o serviço está ativo e se a chave está configurada.
- `GET /api/live-status` — consulta `https://api.tik.tools/webcast/check_alive` pelo backend. Opcional: `?username=nandobr_ofc`.

## Estado atual e limitações

A interface existente permite configurar usuário e URL WebSocket e exibe eventos recebidos. O novo backend adiciona a consulta de status, mas não implementa ainda o gateway WebSocket para receber comentários, presentes e curtidas. Portanto, a consulta de status não significa que a conexão em tempo real esteja pronta.

Antes de declarar a integração concluída, confirme o protocolo oficial atual da Tik.Tools para conectar à LIVE, os eventos suportados e como o webhook/gateway existente deve ser conectado.

## Teste

Após publicar o serviço, abra `/health` e depois `/api/live-status`. HTTP 503 indica variável `TIKTOOLS_API_KEY` ausente. HTTP 502 indica falha/erro na consulta upstream; confira os logs e a resposta da Tik.Tools.