# Contexto Consolidado

## Como retomar este projeto em um chat novo

Antes de agir, leia nesta ordem:

1. `docs/CONTENT.md`
2. `docs/LAYOUT_RULES.md`
3. `docs/TRUCO_RULES.md`
4. `docs/NEXT_STEPS.md`

Esses arquivos sao a fonte de verdade do estado atual do projeto.

## Resumo executivo

`truco-game` ja deixou de ser um prototipo simples de engine e virou uma gameplay screen cenografica dentro de uma tela de celular em landscape.

Hoje o projeto ja possui:

- engine funcional para Truco Mineiro e Truco Paulista
- fluxo jogavel com humano + parceira IA + dupla adversaria IA
- progressao de campanha por bares e circuitos
- gameplay principal integrada dentro da tela do celular
- mesa 3D/2.5D estilizada com cartas animadas
- HUD lateral esquerda e direita bem avancadas
- modo debug na tela inicial para abrir qualquer bar sem depender do progresso salvo
- roster inicial de personagens estruturado em codigo
- tela de selecao de parceira funcional dentro do `gameViewport`
- parceira escolhida persistida por bar
- dois primeiros bares com adversarios fixos
- fluxo de consulta/conselho da parceira no truco ja implementado

## Arquitetura que deve ser preservada

### Centro da logica

O centro do fluxo continua sendo o `HandState`.

Arquivos principais:

- `src/game/createHandState.ts`
- `src/game/playHumanCard.ts`
- `src/game/stepHand.ts`
- `src/game/resolveTrick.ts`
- `src/game/handState.ts`

### Interface principal

Arquivos principais da UI atual:

- `src/App.tsx`
- `src/app/AppSections.tsx`
- `src/app/useGameSession.ts`
- `src/three/GameTableScene.tsx`
- `src/three/tableTheme.ts`

### IA de truco

Arquivos principais:

- `src/ai/trucoDecision.ts`
- `src/ai/trucoPersonalities.ts`

### Conteudo de personagens

Arquivos principais:

- `src/content/characters.ts`
- `src/assets/characters/`

## Regras de ouro de continuidade

- nao refatorar o projeto do zero
- nao desmontar a arquitetura atual para voltar a autoplay total
- nao ignorar o estado atual da HUD e da gameplay screen
- evoluir incrementalmente
- preservar a separacao entre regras, IA e cena
- sempre validar com `npm run build`

## Marco atual

- a gameplay screen esta tratada como pronta por enquanto
- o foco principal saiu do polimento do gameplay e foi para:
  - selecao de parceira
  - fluxo de campanha por bar
  - estabilidade do dialogo de `truco + raise`

## Estado atual da gameplay screen

### Composicao geral

A tela principal esta dividida em:

- coluna esquerda
- coluna central
- coluna direita

Dentro da coluna central:

- mesa principal
- faixa inferior das cartas do jogador humano

Importante:

- as areas sao separadas visualmente, mas ainda compartilham o mesmo layout mestre
- pequenas alteracoes de proporcao ainda podem afetar outros blocos
- o scorepad foi parcialmente blindado para responder mais ao proprio card do que ao viewport geral
- evitar reabrir retrabalho estrutural da gameplay sem motivo real

### Coluna esquerda

Estado atual:

- bloco compacto dos 4 jogadores
- avatares ampliados recentemente
- scorepad em formato de caderno consolidado

Regras consolidadas:

- `Voce`, `Parceira`, `Adversario esquerdo`, `Adversario direito`
- scorepad mostrando:
  - topo: `Nos` e `Eles` com pontuacao da partida
  - baixo: `Mao` e `Mao` com pontuacao parcial da rodada
- scorepad usa:
  - `src/assets/ui-left/scorepad-notebook-clean-cut.png`

Observacao:

- evitar mexer no scorepad junto com outras alteracoes grandes de layout

### Coluna central

Estado atual:

- mesa quadrada e dominante
- cartas abertas com textura de papel envelhecido
- cartas viradas com verso fotografico envelhecido
- cartas jogadas entram de fora da mesa
- limpeza entre maos recolhe as cartas para fora do enquadramento
- distribuicao entre rodadas mantida
- simbolos de naipe das cartas do humano ampliados

Assets principais:

- `src/assets/boteco/boteco-scene-bg.png`
- `src/assets/boteco/table-top-ze-catinga-photo.png`
- `src/assets/boteco/table-top-maneco-wood.png`
- `src/assets/boteco/table-top-wood-street.png`
- `src/assets/boteco/table-top-steel-patio.png`
- `src/assets/cards/card-back-aged-photo.png`
- `src/assets/cards/card-face-aged-paper.png`

### Coluna direita

Estado atual:

- card central mostra `Etapa` e `Endereco`
- botoes de truco com textura de madeira
- os botoes mudam temporariamente para:
  - `BORA!`
  - `CE QUE SABE!`
  - `MELHOR CORRER!`
  quando a parceira consulta o humano

Assets em uso:

- `src/assets/ui-right/value-plaque-solid.png`
- `src/assets/ui-right/stats-panel-wood-main.png`
- `src/assets/ui-right/action-button-solid.png`

## Estado atual da tela inicial

Existe um modo debug para acelerar testes visuais.

Comportamento:

- na tela inicial o usuario pode escolher um bar especifico
- isso ignora momentaneamente o progresso da campanha
- esse fluxo foi pensado para testes de layout, arte e IA

Arquivos principais:

- `src/app/useGameSession.ts`
- `src/app/AppSections.tsx`

## Estado atual da selecao de parceira

Arquivos principais:

- `src/content/characters.ts`
- `src/app/useGameSession.ts`
- `src/app/AppSections.tsx`
- `src/App.tsx`

Ja existe:

- roster de 24 personagens com:
  - `id`
  - `name`
  - `nickname`
  - `personalityId`
  - `role`
  - `playStyle`
  - `attributes`
  - `avatarAsset`
  - `story`
- todos os personagens visuais consolidados em `src/assets/characters/`
- tela de selecao em duas colunas dentro do `gameViewport`
- escolha real da parceira aplicada ao fluxo
- persistencia da parceira por `venueId`
- reoferta automatica da selecao quando o jogador entra em bar sem parceira salva

Starter partners atuais:

- `nega-catimbo`
- `leninha-lambreta`
- `rosinha-catraca`
- `rita-gambiarra`
- `ze-catinga`

Unlockables separados em codigo:

- `aninha-passarela`
- `dalva-seringa`
- `naldo-tramela`
- `quiteria-mao-torta`
- `dito-marrua`

Estado:

- funcional no fluxo real
- ainda precisa de:
  - acabamento visual fino
  - contexto do bar antes da escolha
  - transicao mais narrativa entre escolha e partida

## Campanha e bares atuais mais importantes

### Botecos da Rua

- `Bar do Ze Catinga`
  - id: `bar-do-ze-catinga`
  - endereco: `Vila do Saci · Rua Viela do Jucui, 37`
  - visualTheme: `boteco-raiz-ze-catinga-photo`
  - adversarios fixos atuais:
    - `tiao-casca-grossa`
    - `cida-fumaca`

- `Bar Maneco Banguela`
  - id: `bar-maneco-banguela`
  - endereco: `Rua 18`
  - visualTheme: `boteco-raiz-claro`
  - adversarios fixos atuais:
    - `tonhao-rasga-lata`
    - `patricia-monique`

### Circuito do Bairro

- `Mercearia Central`
  - visualTheme: `bairro-madeira-suja`

- `Arena do Largo`
  - visualTheme: `bairro-metal-patio`

Regra importante:

- sempre que um nome de bar mudar, o `id` tambem deve acompanhar a mudanca
- atualizar todas as referencias relacionadas

## IA atual

### Personalidades

Ja existe uma base extensivel de perfis em:

- `src/ai/trucoPersonalities.ts`

Perfis atuais:

- `ultra_conservative`
- `cautious`
- `conservative`
- `disciplined`
- `balanced`
- `opportunistic`
- `assertive`
- `aggressive`
- `crafty`
- `trickster`
- `volatile`
- `reckless`

### Uso atual

Hoje esta assim:

- a parceira ativa usa a personalidade da personagem escolhida
- os adversarios dos bares iniciais ja estao fixados por bar
- o sistema de consulta da parceira usa:
  - leitura da mao da parceira
  - leitura ponderada da mao do humano via:
    - `BORA!`
    - `CE QUE SABE!`
    - `MELHOR CORRER!`

## Estado atual do truco e dos dialogos

Arquivos principais:

- `src/app/useGameSession.ts`
- `src/app/gameSessionHelpers.ts`
- `src/game/requestTruco.ts`
- `src/game/respondToTruco.ts`
- `src/ai/trucoDecision.ts`

Hoje ja existe:

- conselho da parceira quando o humano e o alvo do pedido adversario
- consulta da parceira ao humano quando ela e o alvo formal da resposta
- peso real da resposta do humano na decisao final da parceira
- regra da `escalada vigente` documentada e aplicada aos dialogos

Regra de continuidade importante:

- esse trecho ainda esta sensivel a regressao
- o proximo trabalho deve comecar por testes unitarios de dialogo
- evitar continuar corrigindo apenas por tentativa e erro sem blindagem
