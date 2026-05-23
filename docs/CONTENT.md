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
- tela de campanha antes do bar escolhido
- capa autoral do bar antes da partida
- gameplay principal integrada dentro da tela do celular
- mesa 3D/2.5D estilizada com cartas animadas
- HUD lateral esquerda e direita bem avancadas
- modo debug na tela inicial para abrir qualquer bar sem depender do progresso salvo
- roster inicial de personagens estruturado em codigo
- tela de selecao de parceira funcional dentro do `gameViewport`
- parceira escolhida persistida por bar
- dois primeiros bares com adversarios fixos
- fluxo de consulta/conselho da parceira no truco ja implementado
- primeira versao da capa do `Bar do Ze Catinga` com assets proprios
- scorepad da coluna esquerda corrigido e validado visualmente na gameplay
- gameplay escalada como stage logico dentro da moldura landscape
- telas autorais de vitoria e derrota do `Bar do Ze Catinga`

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

- a capa do `Bar do Ze Catinga` foi refinada e salva no Git
- o scorepad da coluna esquerda foi corrigido sem trocar o asset do caderno
- o fluxo antes da partida esta preservado:
  - tela de campanha
  - capa do `Bar do Ze Catinga`
  - selecao de parceira depois da capa, se necessario
  - entrada na partida
- a validacao visual confirmou o fluxo real ate a gameplay:
  - campanha
  - capa do bar
  - entrada no jogo
  - scorepad renderizado sem sobreposicao entre labels e numeros
- a gameplay foi estabilizada como stage logico `1080x500` escalado no wrapper externo
- a mao do humano e o botao `MENU` foram protegidos dentro da faixa inferior
- o menu em jogo abre acima da mesa e fecha antes dos modais de confirmacao
- as telas de resultado do `Bar do Ze Catinga` agora usam artes proprias para vitoria e derrota
- a tela de selecao de parceira foi aceita como pronta no estado atual
- a parceira antes chamada `Ze Catinga` foi renomeada para `Joca do Busão` com id `joca-busao`
- a persistencia antiga do perfil foi invalidada depois da mudanca de id
- a tela de campanha do primeiro trecho agora tem arte autoral para o estado atual do `Bar do Ze Catinga`
- a campanha autoral usa `src/assets/campaign/botecos-rua-ze-catinga.png`
- os controles `VOLTAR`, `ENTRAR NO BAR` e `TROCAR PARCEIRA` sao hotspots HTML invisiveis sobre a imagem
- a tela de campanha dinamica continua como fallback para bares/estados sem arte propria
- a tela de resultado preserva a ultima mesa visivel e espera 1 segundo antes de exibir vitoria/derrota
- `npm run build` passou depois da estabilizacao da gameplay, das telas de resultado, da campanha autoral e da consistencia da parceira renomeada
- o proximo foco recomendado e criar o proximo estado autoral da campanha, começando pelo `Bar Maneco Banguela`

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
- o stage interno da gameplay tem resolucao logica fixa e escala no conjunto quando o viewport muda
- pequenas alteracoes de composicao interna ainda devem respeitar as trilhas controladas do stage
- o scorepad responde ao proprio card e nao deve ser reaberto junto com mudancas grandes de layout
- evitar reabrir retrabalho estrutural da gameplay sem regressao real

### Coluna esquerda

Estado atual:

- bloco compacto dos 4 jogadores
- avatares ampliados recentemente
- scorepad em formato de caderno consolidado
- scorepad com grid interno corrigido:
  - topo: `Nos` e `Eles` com pontuacao da partida
  - baixo: `Mao` e `Mao` com pontuacao parcial da rodada
  - labels e numeros centralizados nas suas celulas
  - divisao visual sutil entre placar da partida e placar da mao

Regras consolidadas:

- `Voce`, `Parceira`, `Adversario esquerdo`, `Adversario direito`
- scorepad mostrando:
  - topo: `Nos` e `Eles` com pontuacao da partida
  - baixo: `Mao` e `Mao` com pontuacao parcial da rodada
- scorepad usa:
  - `src/assets/ui-left/scorepad-notebook-clean-cut.png`

Observacao:

- o ajuste do scorepad foi incremental e ficou restrito a `src/App.tsx`
- o asset do caderno foi preservado
- evitar reabrir o scorepad junto com outras alteracoes grandes de layout, salvo regressao visual nova
- preservar a mesa, a coluna direita, o fluxo de truco e a capa do bar

### Responsividade da gameplay

Estado consolidado:

- stage logico interno em `1080x500`
- wrapper externo calcula a escala para caber na area disponivel
- o frame interno recebe `transform: scale(...)` e a composicao principal escala como unidade
- ajustes internos ficam limitados aos modos `regular`, `compact` e `tiny`
- mesa, rails laterais, faixa da mao e menu em jogo foram validados em tamanhos representativos
- continuar aceitando letterbox/pillarbox quando a proporcao externa nao bater com a proporcao do jogo
- dentro da gameplay, evitar recolocar `vw`/`dvh` em blocos que deveriam seguir o stage

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

## Estado atual das telas de resultado

- `Bar do Ze Catinga` tem artes proprias para:
  - vitoria: `src/assets/venues/ze-catinga/match-result-win.png`
  - derrota: `src/assets/venues/ze-catinga/match-result-loss.png`
- a arte ocupa a tela de resultado dentro da moldura do stage
- a placa `VOLTAR AO FLUXO DE BARES` da arte recebe uma area clicavel invisivel por cima
- o `venueId` do resultado preserva qual arte usar mesmo quando a campanha avanca depois da partida
- placares numericos nao devem ser embutidos nas artes ou textos de resultado autorais
- a tela generica continua como fallback para bares sem arte de resultado

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
- `joca-busao`

Unlockables separados em codigo:

- `aninha-passarela`
- `dalva-seringa`
- `naldo-tramela`
- `quiteria-mao-torta`
- `dito-marrua`

Estado:

- funcional no fluxo real
- aceita como pronta no estado atual
- nao reabrir sem regressao real ou nova decisao de produto

## Fluxo atual antes da partida

Fluxo desejado e implementado parcialmente:

1. tela inicial com `COMEÇAR`
2. tela de campanha com os desafios
3. capa do bar selecionado
4. escolha de parceira, caso o bar ainda nao tenha parceira salva
5. jogo

Observacoes:

- a capa do bar nao deve falar da campanha inteira
- a capa deve falar apenas daquele bar
- o `Bar do Ze Catinga` ja possui uma primeira capa autoral
- outros bares ainda podem cair em fallback generico

### Capa do Bar do Ze Catinga

Arquivos principais:

- `src/app/AppSections.tsx`
- `src/app/useGameSession.ts`
- `src/App.tsx`
- `src/assets/venues/ze-catinga/`

Assets atuais:

- `background.png`
- `host-ze-catinga.png`
- `host-quote-board.png`
- `cta-plaque.png`
- `stats-plaque-aged-blank.png`
- `difficulty-bottle.png`
- `divider-ornament.png`

Estado visual atual:

- coluna esquerda esta aceitavel por enquanto
- coluna central mostra nome, endereco, descricao, adversarios e dificuldade ampliada
- coluna direita mostra estatisticas em placa propria e botao de entrada centralizados
- a frase `Proximo desafio` foi removida da capa
- a placa `ENTRAR NO BAR` e a lousa do dono seguem protegidas contra estouro de texto
- assets antigos da capa foram limpos

## Campanha e bares atuais mais importantes

### Estado atual da tela de campanha

- para o estado atual do `Bar do Ze Catinga`, a campanha usa uma arte autoral completa
- a arte mostra o trecho `Botecos da Rua`, o bar atual, o proximo bar bloqueado e a etapa seguinte
- a imagem fica em `src/assets/campaign/botecos-rua-ze-catinga.png`
- o React posiciona areas clicaveis invisiveis sobre:
  - `VOLTAR`
  - `ENTRAR NO BAR`
  - `TROCAR PARCEIRA`
- a tela de campanha dinamica permanece como fallback para outros bares/estados
- o jogador deve reconhecer com clareza onde esta naquele momento
- preservar a separacao entre:
  - tela de campanha com percurso e progresso
  - capa do bar com contexto do local selecionado
  - selecao de parceira quando o bar ainda nao tiver escolha salva
- nao reabrir a tela de selecao de parceira nem a responsividade da gameplay sem regressao real

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
