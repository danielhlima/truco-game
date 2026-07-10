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
- clicar em um circuito abre a tela autoral de campanha do primeiro bar daquele circuito, quando existe arte cadastrada
- o `Voltar` dessa tela autoral retorna ao hub do `Modo Livre`
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

### Balanceamento de IA

A proxima frente deve ser o rebalanceamento da IA de truco.

Motivo:

- a IA atual ainda tende a trucar com pouco
- os dialogos e raises ja ganharam cobertura unitaria inicial
- as variantes por bar ja passaram a ser aplicadas na criacao de partida
- agora da para mexer no comportamento da IA com uma base mais segura

Ordem recomendada:

1. conferir `docs/TRUCO_RULES.md`
2. ler os testes existentes de IA e de dialogos em `tests/**/*.test.ts`
3. mapear os cortes atuais em `src/ai/trucoDecision.ts` e `src/ai/trucoPersonalities.ts`
4. escrever ou ajustar testes antes de mudar thresholds, blefes, aceite, corrida ou raise
5. rebalancear uma decisao por vez:
   - pedir truco
   - aceitar truco
   - correr
   - contra-aumentar
   - aconselhar/consultar parceira
6. rodar `npm test`
7. rodar `npm run build`

## Pendencias De Produto E Regras

Frentes ainda pendentes, em prioridade menor que IA:

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
- segunda e terceira vazas:
  - permitir jogar carta virada para baixo
  - definir como a resolucao dessa carta funciona
  - cobrir com testes

Frentes que deixaram de ser pendencia aberta nesta rodada:

- dialogos e raises ganharam cobertura unitaria inicial
- variantes Mineiro/Paulista passaram a ser criadas pela configuracao do bar
- o fluxo pos-campanha ganhou `Modo Livre` para revisitar circuitos e resetar campanha com confirmacao interna

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
- criar novos assets antes de terminar a primeira rodada de balanceamento de IA

## Prompt Para Chat Novo

O prompt pronto para continuar em um chat novo esta em:

- `docs/NEXT_CHAT_PROMPT.md`
