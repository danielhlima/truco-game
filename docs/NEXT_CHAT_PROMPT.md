# Prompt Para Continuar Em Um Chat Novo

Copie e cole o texto abaixo no proximo chat.

```text
Estamos continuando o projeto truco-game.

Antes de agir, leia nesta ordem:
1. docs/README.md
2. docs/CONTENT.md
3. docs/LAYOUT_RULES.md
4. docs/TRUCO_RULES.md
5. docs/IMAGE_PROMPT_STANDARDS.md
6. docs/NEXT_STEPS.md
7. docs/CAMPAIGN_PATH.md
8. docs/NEXT_CHAT_PROMPT.md

Use esses arquivos como fonte de verdade.

Contexto atual:
- O caminho principal da campanha ja tem pacotes visuais autorais integrados ate o Cassino Mé Maior.
- O bonus pos-campanha Circuito Intergaláctico / Órbita da Lua ja esta integrado como ultima etapa do jogo.
- A tela de campanha da Órbita da Lua nao tem next venue.
- O bonus usa Mané Banguela + Cosme Órbita como dupla adversaria.
- O bonus tem vitoria definitiva da Órbita da Lua e vitoria definitiva do Circuito Intergaláctico cadastradas.
- Depois da campanha concluida, COMEÇAR abre o Modo Livre.
- O Modo Livre usa src/assets/campaign/free-play-circuit-hub.png.
- No Modo Livre, cada circuito e um hotspot invisivel.
- Clicar em um circuito inicia uma run temporaria daquele circuito.
- A run temporaria comeca no primeiro bar e avanca para o proximo bar ao cumprir as vitorias do local.
- Concluir o ultimo bar do circuito livre retorna ao hub do Modo Livre.
- O Voltar da tela autoral retorna ao hub do Modo Livre e encerra a run temporaria.
- A run temporaria nao altera progresso, recompensas ou desbloqueios da campanha principal ja concluida.
- Recomeçar campanha usa confirmacao interna do jogo, nao alerta nativo do navegador.
- O fluxo atual deve ser preservado: COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo.
- A gameplay usa stage logico 1080x500.
- A intro curta antes da partida mostra primeiro apenas o background do local.
- As telas de campanha autorais usam hotspots HTML invisiveis sobre a arte.
- Testes unitarios de dialogos/raises ja cobrem TRUCO!, SEIS!, NOVE!, DOZE!, DESCE!, TOMA! e TÔ FORA!.
- A criacao de partida por bar ja aplica a variante declarada no local.
- Ha testes para criacao de partida Mineiro/Paulista e proxima mao Paulista mantendo vira.
- Nao reabrir responsividade, selecao de parceira, arquitetura de estado ou pacote visual sem regressao real.

Objetivo deste chat:
Rebalancear a IA de truco com cobertura de testes.

Prioridade recomendada:
1. Conferir git status antes de editar.
2. Ler src/ai/trucoDecision.ts e src/ai/trucoPersonalities.ts.
3. Ler os testes existentes em tests/**/*.test.ts, especialmente os de IA, dialogos e raises.
4. Antes de alterar comportamento, criar ou ajustar testes para a decisao que sera balanceada.
5. Rebalancear uma decisao por vez:
   - pedir truco
   - aceitar truco
   - correr
   - contra-aumentar
   - aconselhar/consultar parceira
6. Rodar npm test e npm run build antes de concluir.

Problema conhecido:
- A primeira rodada de rebalanceamento ja subiu cortes do perfil balanced, reduziu blefes e corrigiu dificuldade maxima disciplinada para trickster.
- Evitar ajustar tudo por tentativa e erro; qualquer nova mudanca em thresholds, blefes e perfis deve vir com testes pequenos e objetivos.

Pendencias que continuam abertas, mas nao sao a primeira prioridade deste chat:
- Mao especial de 9/dez pontos.
- Opcao de escolher ou nao a versao ponto acima.
- Tutorial jogavel.
- Carta virada para baixo na segunda e terceira vazas.

Regras de continuidade:
- Preservar mudancas locais do usuario.
- Fazer mudancas incrementais.
- Nao reabrir responsividade, selecao de parceira, arquitetura de estado ou pacote visual sem regressao real.
- Se alterar progressao, campanha ou resultado, validar o fluxo real desde COMEÇAR.
- Rodar npm test quando houver mudanca de regra, IA ou helpers de sessao.
- Rodar npm run build antes de concluir qualquer frente de codigo.
```
