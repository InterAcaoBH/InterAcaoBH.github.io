# App da equipe Atleta: onde revisar

Todo o texto clínico está em `content.js`. Não precisa mexer em `app.js`, `index.html` nem `style.css`.

- `meta`: aviso de rascunho, decisão vigente, lado lesado, link do app do paciente.
- `roteiro`: tela principal (Sessão). Fonte: 07b-mensagem-julio-curta-FINAL.md (aprovado por Natália e Leo).
- `guia`: passo a passo detalhado, abre ao tocar. Fonte: 07-mensagem-julio-detalhada.md. Aguarda revisão da Natália.
- `ficha`: campos da ficha de registro. Fonte: 01, seção 8.
- `retorno`: critérios para jogar, regra do jogo, cenários A e B, princípios e fases. Fonte: 02.
- `emergencia`: sinais de emergência. Fonte: 01 item 1, 02 e 05(b).
- `carta`: carta ao médico pt-BR e EN. Fonte: 05(d).
- `staff`: mensagem ao staff de saúde pt-BR e EN, com selo RASCUNHO. Fonte: 06.

Formato: markdown simples dentro das strings (`## título`, `- item`, `1. item`, tabelas com `|`). Quebra de linha é `\n`. Escrever PENDENTE vira selo automaticamente.
Depois de editar, aumente o número em `const C="eq-v1"` no `sw.js` (eq-v2, eq-v3) para os celulares pegarem a versão nova.
