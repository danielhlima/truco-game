# Contexto Consolidado

## Como retomar este projeto em um chat novo

Antes de agir, leia nesta ordem:

1. `docs/CONTENT.md`
2. `docs/LAYOUT_RULES.md`
3. `docs/TRUCO_RULES.md`
4. `docs/NEXT_STEPS.md`

Esses arquivos são a fonte de verdade do estado atual do projeto.

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
- primeira versao da tela de selecao de parceiro IA em implementacao

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
- o foco atual saiu do polimento do gameplay e foi para a experiencia de selecao de personagens/parceira IA
- novas alteracoes na gameplay devem ser mais conservadoras, para nao reabrir retrabalho de layout

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
- ja foi identificado risco real de acoplamento excessivo entre os blocos
- a proxima etapa recomendada e uma blindagem estrutural antes de continuar polimento visual pesado

### Coluna esquerda

Ja esta em estado bom o bastante para seguir em frente.

Contem:

- bloco compacto dos 4 jogadores
- scorepad em formato de caderno

Regras consolidadas:

- `Voce`, `Parceira`, `Adversario esquerdo`, `Adversario direito`
- scorepad mostrando:
  - topo: `Nos` e `Eles` com pontuacao da partida
  - baixo: `Mao` e `Mao` com pontuacao parcial da rodada
- scorepad usa o asset:
  - `src/assets/ui-left/scorepad-notebook-clean-cut.png`

Observacao:

- o scorepad recebeu muitos ajustes finos manuais
- evitar mexer nele junto com outras alteracoes grandes de layout

### Coluna central

Estado atual:

- mesa quadrada e ampliada levemente
- cartas abertas com textura de papel envelhecido
- cartas viradas com verso fotorealista envelhecido
- cartas jogadas entram de fora da mesa
- limpeza entre maos agora recolhe as cartas para fora do enquadramento
- distribuicao entre rodadas continua existindo e usa cartas viradas para baixo

Assets principais da mesa/carta:

- fundo da cena:
  - `src/assets/boteco/boteco-scene-bg.png`
- mesa do Zé Catinga:
  - `src/assets/boteco/table-top-ze-catinga-photo.png`
- mesa do Maneco:
  - `src/assets/boteco/table-top-maneco-wood.png`
- mesa do Mercearia Central:
  - `src/assets/boteco/table-top-wood-street.png`
- mesa da Arena do Largo:
  - `src/assets/boteco/table-top-steel-patio.png`
- verso das cartas:
  - `src/assets/cards/card-back-aged-photo.png`
- frente das cartas:
  - `src/assets/cards/card-face-aged-paper.png`

Observacoes importantes:

- as pilhas viradas persistentes ao redor da mesa foram removidas
- a animacao de distribuicao entre rodadas foi mantida
- houve um bug de flicker na carta jogada; a ultima correcao foi feita em `src/three/GameTableScene.tsx`
- se o flicker voltar, inspecionar primeiro a transicao entre `animatingCards` e a carta estavel da mesa

### Coluna direita

Estado atual:

- fundo marrom claro estrutural foi removido para deixar o fundo cenografico aparente
- bloco superior `Valendo` usa `tento/tentos`
- bloco central mostra:
  - `Etapa`
  - `Endereco`
- bloco inferior mostra os botoes de truco
- label `Acoes` foi removida

Assets em uso:

- `src/assets/ui-right/value-plaque-solid.png`
- `src/assets/ui-right/stats-panel-wood-main.png`
- `src/assets/ui-right/action-button-solid.png`

Observacao importante:

- o HUD superior `Valendo` foi removido da coluna direita para liberar altura
- hoje a coluna direita mostra apenas:
  - card do local
  - botoes de truco
- isso ajudou bastante a responsividade e a manter o botao `Correr` visivel

## Estado atual da tela inicial

Existe um modo debug para acelerar testes visuais.

Comportamento:

- na tela inicial o usuario pode escolher um bar especifico
- isso ignora momentaneamente o progresso da campanha
- esse fluxo foi pensado para testes de layout, arte e IA

Arquivos principais:

- `src/app/useGameSession.ts`
- `src/app/AppSections.tsx`

Estado atual:

- a tela inicial ainda existe como ponto de entrada para a campanha
- nela existe um botao generico no canto superior direito que leva para a nova tela de selecao de personagens
- esse botao foi colocado explicitamente para testes da nova tela

## Estado atual da selecao de personagens

Nova frente ativa do projeto.

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
    - `courage`
    - `patience`
    - `bluff`
  - `avatarAsset`
  - `story`
- 16 avatares novos copiados e otimizados em `src/assets/characters/`
- primeira versao da tela de selecao implementada dentro do `gameViewport`
- navegação simples entre:
  - `start`
  - `character-select`
- tela de selecao em duas colunas:
  - esquerda:
    - retrato grande
    - nome
    - alcunha
    - botoes anterior/proximo
    - contador de posicao
  - direita:
    - historia
    - chips de estilo de jogo
    - barras de atributos
    - CTA visual no rodape

O que ainda NAO esta fechado:

- acabamento visual fino para ficar mais proximo da arte de referencia
- escolha real da parceira aplicada ao jogo
- definicao de quais personagens serao parceiras jogaveis e quais serao so NPCs/adversarios
- tela ainda esta em modo de teste, acessada pelo botao generico do menu inicial

Observacao importante:

- a implementacao atual ja funciona como base estrutural
- o proximo chat deve continuar a partir dessa tela, nao recomeçar do zero

## Campanha e bares atuais mais importantes

### Botecos da Rua

- `Bar do Ze Catinga`
  - id: `bar-do-ze-catinga`
  - endereco: `Vila do Saci · Rua Viela do Jucui, 37`
  - visualTheme: `boteco-raiz-ze-catinga-photo`

- `Bar Maneco Banguela`
  - id: `bar-maneco-banguela`
  - endereco: `Rua 18`
  - visualTheme: `boteco-raiz-claro`

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
- `conservative`
- `balanced`
- `aggressive`
- `trickster`
- `reckless`

Roster estruturado em codigo:

- `src/content/characters.ts`

### Roster em construcao

Ja existe uma lista inicial de personagens para futuro uso em:

- selecao de parceira IA
- duplas adversarias por bar
- chefes de circuito
- apresentacao narrativa/cutscenes

Distribuicao atual dos perfis nomeados:

- `Zeca Viramao` -> `balanced`
- `Nega Catimbo` -> `conservative`
- `Tiao Casca Grossa` -> `balanced`
- `Mane Banguela` -> `reckless`
- `Ze Catinga` -> `ultra_conservative`
- `Rita Gambiarra` -> `trickster`
- `Tonhao Rasga-Lata` -> `aggressive`
- `Cida Fumaca` -> `balanced`
- `Dito Marrua` -> `reckless`
- `Patricia Monique` -> `trickster`
- `Naldo Tramela` -> `aggressive`
- `Dalva Seringa` -> `conservative`
- `Biu Caolho` -> `reckless`
- `Aninha Passarela` -> `balanced`
- `Celsinho Breque` -> `conservative`
- `Quiteria Mao-Torta` -> `trickster`
- `Norberto Fuba` -> `ultra_conservative`
- `Rosinha Catraca` -> `aggressive`
- `Damiao Corote` -> `reckless`
- `Leninha Lambreta` -> `balanced`

### Nomes e ajustes recentes

- `Jurema Boca de Gamba` foi substituida por `Patricia Monique`
- `Jandira Beiçola` foi substituida por `Aninha Passarela`
- as historias dessas duas personagens ja foram reescritas para refletir os novos nomes

### Avatares ja presentes no projeto

Avatares iniciais do gameplay:

- `avatar-you.png`
- `avatar-partner.png`
- `avatar-opponent-left.png`
- `avatar-opponent-right.png`

Novos avatares ja copiados para o roster:

- `ze-catinga.png`
- `rita-gambiarra.png`
- `tonhao-rasga-lata.png`
- `cida-fumaca.png`
- `dito-marrua.png`
- `patricia-monique.png`
- `naldo-tramela.png`
- `dalva-seringa.png`
- `biu-caolho.png`
- `aninha-passarela.png`
- `celsinho-breque.png`
- `quiteria-mao-torta.png`
- `norberto-fuba.png`
- `rosinha-catraca.png`
- `damiao-corote.png`
- `leninha-lambreta.png`
- `Jura Pancada` -> `aggressive`
- `Marlene Pimenta` -> `conservative`
- `Zito Parafuso` -> `trickster`
- `Creusa Rabugenta` -> `ultra_conservative`

Observacao importante:

- os avatares ja gerados de `10_jurema.png` e `14_jandira.png` agora representam:
  - `Patricia Monique`
  - `Aninha Passarela`

Historias absurdas atualizadas:

- `Patricia Monique`:
  frequenta mesa de truco como se estivesse entrando num ensaio fotografico clandestino em pleno boteco. Diz que ja ganhou um seis porque o adversario ficou nervoso tentando entender se estava sendo blefado ou avaliado esteticamente.

- `Aninha Passarela`:
  jura que aprendeu a contar carta observando desfile de loja de bairro em piso encerado. Ate hoje entra na mesa como se estivesse cruzando uma passarela invisivel e, por algum motivo, isso sempre faz alguem jogar pior.

### Regra de uso atual

Hoje esta assim:

- adversarios usam `balanced`
- parceira IA do time do humano usa `conservative`

Isso vale mais para decisoes de:

- pedir truco
- aceitar
- aumentar
- aconselhar o humano

Observacao importante:

- a intencao futura e separar melhor a personalidade da parceira do bar/da dificuldade
- a parceira devera ser escolhivel pelo jogador no futuro

## Decisoes recentes de regras

### Nomenclatura

Referencia oficial:

- `Rodada`: ciclo completo antes da proxima distribuicao
- `Mao`: disputa interna da rodada
- `Vaza`: resolucao parcial

### Falas do truco

Referencia oficial em `docs/TRUCO_RULES.md`.

Pontos ja acertados:

- quem fala `TRUCO!` nunca fala `DESCE!`
- quem abriu o truco original fecha a sequencia com `TOMA!`
- parceiro pode aconselhar, mas nao entra no ping-pong principal

### Texto da coluna direita

- `Bairro` foi trocado por `Endereco`
- `Valendo 1 (Truco)` foi trocado por `1 tento`, `2 tentos`, etc.

## Estado do bundle e assets

Foi feita uma rodada de limpeza e otimizacao:

- assets sem uso em `src/assets` foram removidos
- imagens ativas grandes foram downscaled

Mesmo assim, ainda existem arquivos relativamente pesados, especialmente:

- `src/assets/cards/card-face-aged-paper.png`
- fundos cenograficos de mesa

Se o foco voltar para performance/tamanho de bundle, o proximo passo natural e converter os assets fotograficos maiores para `jpg` ou `webp`.

## O que foi considerado pronto por enquanto

- area das cartas do jogador humano
- composicao geral da coluna esquerda
- base da coluna direita
- modo debug para selecionar bar
- base de personalidades da IA

## O que ainda inspira cuidado

- scorepad: evitar retrabalho desnecessario
- animacoes da mesa: pequenas mudancas podem reintroduzir flicker
- mesa/fundo: o projeto esta migrando para um visual mais fotorealista
- qualquer novo asset ruim ou mal recortado costuma gerar retrabalho de layout
- o layout ainda esta sensivel demais a mudancas locais
- aumentar um bloco pequeno ainda pode impactar scorepad, botoes e mao do jogador
- isso precisa ser tratado antes de confiar na tela para devices com tamanhos diferentes

## Proximo foco recomendado

Apos a ultima rodada de ajustes, o proximo foco natural mudou para:

- blindagem estrutural do layout principal
- desacoplamento entre colunas e area central
- preparacao da tela para devices com tamanhos diferentes

So depois disso:

- polimento da coluna direita
- refinamento final da mesa central conforme novos assets chegarem
- aprofundar a documentacao e configuracao das personalidades da IA

Sempre confirmar no `docs/NEXT_STEPS.md` antes de avancar.
