# TikTok LIVE Conector

Painel HTML inicial para configurar usuário do TikTok e conectar a um gateway WebSocket.

## Estado atual

- Interface responsiva criada em `index.html`.
- Campos para usuário TikTok e URL WebSocket.
- Indicador de conexão baseado nos eventos reais do WebSocket.
- Painel de eventos e contadores básicos para comentários, presentes e curtidas.
- **A integração completa com Tik.Tools ainda não está pronta.** O navegador precisa de um gateway backend compatível que autentique/conecte à LIVE e encaminhe os eventos para o WebSocket.

## Como testar a interface

Abra `index.html` em um navegador e informe:
1. O nome de usuário do TikTok (com ou sem `@`).
2. A URL WebSocket do gateway, por exemplo `wss://seu-dominio/gateway`.

A URL acima é apenas um exemplo; use a URL real do seu servidor. O painel envia ao abrir o WebSocket uma mensagem JSON com `action: "connect"`, `username` e `uniqueId`. O backend deve implementar esse protocolo ou o frontend deve ser adaptado ao protocolo real do gateway.

## Segurança

Não coloque API keys, tokens privados ou segredos no HTML público. Mantenha credenciais no backend/variáveis de ambiente do serviço de hospedagem.

## Próxima etapa

Integrar o protocolo real da API Tik.Tools e o webhook/gateway já configurados, conferir os logs do backend e validar uma conexão real com uma LIVE. Não considerar a LIVE conectada apenas porque o WebSocket abriu; o backend deve confirmar que a conexão TikTok foi estabelecida.