# Next Steps

## Estado Atual Real

O caminho principal da campanha esta visualmente integrado ate o `Cassino Mé Maior`, e o bonus pos-campanha `Circuito Intergaláctico` / `Órbita da Lua` tambem ja esta integrado como ultima etapa do jogo.

Estado consolidado:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`
- gameplay dentro de stage logico `1080x500`
- intro curta antes da partida, mostrando primeiro apenas o background do local
- tela de selecao de parceira aceita como pronta no estado atual
- escolha de skin do jogador implementada antes da campanha quando ainda nao existe skin salva
- menu em partida com opcoes de validacao, troca de parceira, saida e reset de progresso
- telas normais de vitoria/derrota por local
- telas definitivas de conquista de local e circuito
- progressao principal com parceiros desbloqueados conforme a dupla adversaria e derrotada
- bonus final com `Mané Banguela` + `Cosme Órbita`, campanha propria, background, host, mesa, resultados normais e vitorias definitivas de local/circuito
- a tela de campanha da `Órbita da Lua` nao tem `next venue`
- ao fechar o bonus, o fluxo exibe a conquista da `Órbita da Lua` e depois a conquista do `Circuito Intergaláctico`
- depois da campanha concluida, `COMEÇAR` abre o `Modo Livre`
- o `Modo Livre` usa `src/assets/campaign/free-play-circuit-hub.png`
- no `Modo Livre`, cada quadro de circuito e um hotspot invisivel
- clicar em um circuito inicia uma run temporaria daquele circuito
- a run temporaria avanca de bar em bar ao cumprir as vitorias locais e retorna ao hub ao concluir o circuito livre
- o `Voltar` dessa tela autoral retorna ao hub do `Modo Livre` e encerra a run temporaria
- a run temporaria nao altera progresso, recompensas ou desbloqueios da campanha principal ja concluida
- o botao `Recomeçar campanha` abre confirmacao dentro do jogo, nao alerta nativo do navegador
- testes unitarios de dialogos/raises ja cobrem `TRUCO!`, `SEIS!`, `NOVE!`, `DOZE!`, `DESCE!`, `TOMA!` e `TÔ FORA!`
- helpers de sessao criam partidas a partir do bar e aplicam a variante declarada pelo local
- ha testes para criacao de partida por local Mineiro/Paulista e para proxima mao Paulista mantendo vira/manilha
- `npm run build` deve continuar sendo a validacao minima antes de concluir qualquer frente

Locais com pacote visual autoral integrado:

- `Bar do Ze Catinga`
- `Bar Maneco Banguela`
- `Trem do Jaça`
- `Adega do Juca Bigode`
- `Garagem Norte`
- `Quintal da Leste`
- `Subsolo do Centro`
- `Salao da Sul`
- `Centro de Convenções da Prefeitura`
- `Ginásio Estadual Maneco Filé`
- `Arena Nacional`
- `Centro Americano Truqueiro de Medelin`
- `Hotel Truco de Segóvia, Espanha`
- `Cassino Mé Maior`
- `Órbita da Lua`

## Proximo Foco Recomendado

### Carta Virada Para Baixo

A proxima frente recomendada e implementar carta virada para baixo/carta coberta a partir da segunda vaza da mao.

Regra desejada:

- na primeira vaza, todas as cartas jogadas continuam abertas
- na segunda e na terceira vaza, qualquer jogador pode jogar uma carta virada para baixo
- a carta coberta nao disputa a vaza e deve funcionar como descarte sem forca
- a carta coberta nao deve revelar identidade para adversarios nem para parceiro durante a partida
- a mesa e os logs devem deixar claro que uma carta coberta foi jogada, sem revelar a carta real
- a IA deve poder usar carta coberta como descarte quando nao fizer sentido disputar a vaza

Ordem recomendada:

1. conferir `docs/TRUCO_RULES.md`
2. ler `src/game/handState.ts`, `src/game/playHumanCard.ts`, `src/game/playAiTurn.ts`, `src/game/resolveTrick.ts`, `src/ai/chooseCard.ts` e os testes existentes em `tests/**/*.test.ts`
3. criar testes antes de mudar comportamento:
   - primeira vaza nao permite carta coberta
   - segunda/terceira vaza permitem carta coberta
   - carta coberta nunca vence a vaza
   - carta coberta nao revela identidade nos logs/estado publico
   - IA descarta coberto quando apropriado
4. implementar estado/modelo para jogada coberta
5. implementar acao humana e decisao da IA
6. rodar `npm test`
7. rodar `npm run build`

### Estado da IA

A primeira rodada de rebalanceamento da IA de truco foi aplicada com testes, validada em jogo real e enviada para `origin/main`.

Estado apos a primeira rodada:

- o perfil `balanced` subiu cortes de pedido, aceite e contra-aumento
- conselhos da parceira ficaram menos otimistas com dupla fraca
- perfis agressivos/blefadores ainda podem blefar, mas com probabilidades menores
- dificuldade maxima disciplinada agora usa `trickster`, nao `reckless`
- quando nao consegue ganhar a vaza, a IA descarta a menor carta disponivel
- quando consegue ganhar a vaza, a IA usa a menor carta vencedora
- os dialogos e raises ja ganharam cobertura unitaria inicial
- as variantes por bar ja passaram a ser aplicadas na criacao de partida
- `Jogos Mundiais` e `Mundial` usam Truco Mineiro
- novas rodadas de ajuste devem continuar usando testes antes de mudar comportamento

## Pendencias De Produto E Regras

Frentes ainda pendentes, em prioridade menor que carta coberta:

- mao especial de 9/dez pontos:
  - documentacao antiga registra `mao de nove`
  - conversa posterior citou "ver cartas na mao de dez pontos"
  - confirmar nomenclatura e gatilho antes de implementar
  - permitir que parceiros vejam as cartas um do outro nessa mao especial
  - permitir que a dupla escolha jogar ou nao jogar depois de ver as cartas
  - se a dupla optar por nao jogar, adversarios recebem `1 ponto`
  - se a dupla optar por jogar e perder, adversarios recebem `3 pontos`
  - explicar visualmente por que pedir truco/aumentar fica bloqueado
- opcao de usar ou nao a variante `ponto acima`
- tutorial jogavel:
  - ensinar fluxo basico de rodada, mao e vaza
  - ensinar truco, aceite, corrida e aumentos
  - ensinar conselho/consulta da parceira
  - ensinar progressao de campanha e desbloqueio de parceiros
- segunda rodada fina de IA:
  - fazer apenas se novos testes em jogo apontarem comportamento ruim
  - preservar testes existentes de thresholds, blefes e descarte

Frentes que deixaram de ser pendencia aberta nesta rodada:

- dialogos e raises ganharam cobertura unitaria inicial
- variantes Mineiro/Paulista passaram a ser criadas pela configuracao do bar
- o fluxo pos-campanha ganhou `Modo Livre` para jogar runs temporarias de circuitos e resetar campanha com confirmacao interna
- primeira rodada de IA foi validada em jogo real
- `Jogos Mundiais` e `Mundial` foram corrigidos para Truco Mineiro
- descarte da IA quando nao pode ganhar a vaza ficou coberto por testes

## Validacao Recomendada

Antes de concluir qualquer implementacao:

- verificar `git status`
- preservar mudancas locais existentes
- abrir o fluxo real desde `COMEÇAR` quando houver mudanca visual ou de progressao
- confirmar que a arte correta carrega para campanha, background, mesa, host e resultados quando a mudanca tocar esses pontos
- testar hotspots invisiveis quando houver tela de campanha nova
- rodar `npm test` quando houver mudanca de regra, IA, truco, progressao ou helpers de sessao
- rodar `npm run build`

## O Que Nao Deve Virar Prioridade Agora

- refatoracao total da engine
- troca da arquitetura de estado
- backend, ranking online ou empacotamento mobile
- reabrir a responsividade da gameplay sem regressao real
- reabrir a tela de selecao de parceira sem regressao real
- reabrir o pacote visual principal ou bonus sem regressao ou nova decisao explicita de polimento
- criar novos assets antes de definir e validar a interacao mobile da carta coberta

## Prompt Para Chat Novo

O prompt pronto para continuar em um chat novo esta em:

- `docs/NEXT_CHAT_PROMPT.md`
