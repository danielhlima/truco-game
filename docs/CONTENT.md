# Contexto Consolidado

## Como retomar este projeto em um chat novo

Antes de agir, leia nesta ordem:

1. `docs/CONTENT.md`
2. `docs/LAYOUT_RULES.md`
3. `docs/TRUCO_RULES.md`
4. `docs/IMAGE_PROMPT_STANDARDS.md`
5. `docs/NEXT_STEPS.md`
6. `docs/CAMPAIGN_PATH.md`
7. `docs/NEXT_CHAT_PROMPT.md`

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
- intro cinematografica curta antes da gameplay
- tela inicial definitiva com arte propria
- caminho principal com pacote visual autoral integrado ate o `Cassino Mé Maior`
- proxima frente definida: prompts e assets do nivel bonus `Circuito Intergaláctico` / `Órbita da Lua`

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
- `docs/IMAGE_PROMPT_STANDARDS.md`

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
- o menu em jogo agora inclui:
  - `Vencer esta partida`, para validar progressao sem jogar a partida inteira
  - `Perder esta partida`, para validar a tela de derrota
  - `Resetar progresso`, com confirmacao especifica antes de apagar campanha, escolhas de parceira, skin do jogador e historico salvo
- as telas de resultado do `Bar do Ze Catinga` agora usam artes proprias para vitoria e derrota
- a tela de selecao de parceira foi aceita como pronta no estado atual
- a parceira antes chamada `Ze Catinga` foi renomeada para `Joca do Busão` com id `joca-busao`
- a persistencia antiga do perfil foi invalidada depois da mudanca de id
- as telas de campanha autorais atuais ficam em:
  - `src/assets/campaign/botecos-rua-ze-catinga.png`
  - `src/assets/campaign/botecos-rua-maneco-banguela.png`
  - `src/assets/campaign/campeonato-vila-nana-trem-do-jaca.png`
  - `src/assets/campaign/campeonato-vila-nana-adega-do-juca-bigode.png`
  - `src/assets/campaign/conquista-zonas-garagem-norte.png`
  - `src/assets/campaign/conquista-zonas-quintal-da-leste.png`
  - `src/assets/campaign/conquista-zonas-subsolo-do-centro.png`
  - `src/assets/campaign/conquista-zonas-salao-da-sul.png`
- os controles `VOLTAR`, `ENTRAR NO BAR` e `TROCAR PARCEIRA` sao hotspots HTML invisiveis sobre a imagem
- a tela de campanha dinamica continua como fallback para bares/estados sem arte propria
- a tela de resultado preserva a ultima mesa visivel e espera 1 segundo antes de exibir vitoria/derrota
- a intro de gameplay foi implementada:
  - ao iniciar a partida, a moldura mostra apenas o background do bar por cerca de 1 segundo
  - mesa, HUDs, oponentes e cartas aparecem depois com fade curto
  - cartas, truco e `MENU` ficam bloqueados ate a intro terminar
  - a logica da partida fica preparada por baixo sem alterar regras, placares ou progressao
  - validacao visual feita no `Bar do Ze Catinga` e no `Bar Maneco Banguela`
- `npm run build` passou depois da estabilizacao da gameplay, das telas de resultado, da campanha autoral e da consistencia da parceira renomeada
- `npm run build` passou depois da intro cinematografica curta
- a tela inicial definitiva foi implementada com arte propria em `src/assets/start/truco-raiz-start.png`
- a primeira tela visivel agora mostra somente a arte de capa e um hotspot HTML sobre `COMEÇAR`
- debug de bar, reset de campanha e seletor de variante foram removidos da tela inicial visivel
- o caminho principal foi expandido visualmente ate o `Cassino Mé Maior`
- o proximo foco recomendado e gerar prompts para o pacote bonus `Circuito Intergaláctico` / `Órbita da Lua`
- antes de implementar novos assets autorais, gerar prompts seguindo `docs/IMAGE_PROMPT_STANDARDS.md`

## Direcao de produto atual

O projeto esta em bom estado de tela e fluxo para mudar o foco principal de polimento visual para expansao de conteudo.

Decisao atual:

- tratar o caminho principal como visualmente integrado ate o `Cassino Mé Maior`
- seguir para o bonus pos-campanha antes de mexer em regras complexas
- gerar prompts do bonus antes de implementar imagens
- alem dos 8 assets de costume, gerar imagens pequenas dos adversarios do bonus
- manter o bonus divertido e cosmico, sem ETs assustadores, monstros, horror, gore ou criaturas grotescas
- depois do pacote bonus, voltar para regras, tutorial, balanceamento, falas e refinamentos

Kit minimo recomendado por bar:

- nome e endereco/territorio
- tema visual e clima do ambiente
- variante de truco
- dificuldade pretendida
- dupla adversaria fixa
- personalidade/estilo dos adversarios
- numero de vitorias necessario para passar
- recompensa ou marco de progressao, quando aplicavel
- capa/background ou fallback visual aceitavel
- textos de entrada e resultado, mesmo que sem arte autoral inicial

Plano pratico da proxima frente:

1. ler `docs/IMAGE_PROMPT_STANDARDS.md`
2. gerar prompts para `Órbita da Lua`
3. incluir prompts dos 8 assets padrao e das imagens pequenas dos adversarios
4. aguardar o usuario trazer as imagens aprovadas
5. integrar os assets do bonus no mesmo padrao dos locais recentes
6. rodar `npm run build`
7. depois disso, retomar pendencias de regra/produto em `docs/NEXT_STEPS.md`

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

### Intro antes da partida

Estado consolidado:

- antes de cada partida, a tela exibe apenas o background do bar por cerca de 1 segundo dentro da moldura
- depois revela mesa, HUDs, oponentes e cartas com fade curto
- a logica da partida e preparada por baixo, mas a interacao fica bloqueada ate a intro terminar
- cartas, truco e `MENU` nao ficam clicaveis durante a intro
- a primeira versao e simples e reutilizavel para qualquer bar
- a intro reutiliza o background correto do bar atual, incluindo o background proprio do `Bar Maneco Banguela`
- preservar o stage logico `1080x500` e o fluxo `campanha > capa do bar > escolha de parceira se necessario > jogo`

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
- `src/assets/boteco/table-top-trem-jaca.png`
- `src/assets/boteco/table-top-adega-juca-bigode.png`
- `src/assets/boteco/table-top-garagem-norte.png`
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
- `Bar Maneco Banguela` tem artes proprias para:
  - vitoria: `src/assets/venues/maneco-banguela/match-result-win.png`
  - derrota: `src/assets/venues/maneco-banguela/match-result-loss.png`
- `Trem do Jaça` tem artes proprias para:
  - vitoria: `src/assets/venues/trem-do-jaca/match-result-win.png`
  - derrota: `src/assets/venues/trem-do-jaca/match-result-loss.png`
- `Adega do Juca Bigode` tem artes proprias para:
  - vitoria: `src/assets/venues/adega-do-juca-bigode/match-result-win.png`
  - derrota: `src/assets/venues/adega-do-juca-bigode/match-result-loss.png`
- `Garagem Norte` tem artes proprias para:
  - vitoria: `src/assets/venues/zona-norte-garagem/match-result-win.png`
  - derrota: `src/assets/venues/zona-norte-garagem/match-result-loss.png`
- `Quintal da Leste` tem artes proprias para:
  - vitoria: `src/assets/venues/zona-leste-quintal/match-result-win.png`
  - derrota: `src/assets/venues/zona-leste-quintal/match-result-loss.png`
- `Subsolo do Centro` tem artes proprias para:
  - vitoria: `src/assets/venues/centro-subsolo/match-result-win.png`
  - derrota: `src/assets/venues/centro-subsolo/match-result-loss.png`
- `Salao da Sul` tem artes proprias para:
  - vitoria: `src/assets/venues/zona-sul-salao/match-result-win.png`
  - derrota: `src/assets/venues/zona-sul-salao/match-result-loss.png`
- vitorias definitivas de bar e circuito ficam em `src/assets/campaign-victories/`
- quando uma vitoria completa o bar, a tela normal de vitoria da partida nao aparece; entra a vitoria definitiva daquele bar
- quando o bar completo tambem fecha o circuito, a sequencia e: vitoria definitiva do bar, depois vitoria definitiva do circuito, depois fluxo de bares
- vitorias definitivas de bar cadastradas: `Bar do Ze Catinga`, `Bar Maneco Banguela`, `Trem do Jaça`, `Adega do Juca Bigode`, `Garagem Norte`, `Quintal da Leste`, `Subsolo do Centro` e `Salao da Sul`
- vitorias definitivas de circuito cadastradas: `Botecos da Rua`, `Campeonato da Vila Naná` e `Conquista das Zonas`
- a arte de resultado deve caber inteira dentro da moldura do stage, sem cortar a placa `VOLTAR AO FLUXO DE BARES`
- quando a arte autoral for menos larga que o stage logico `1080x500`, aceitar respiro lateral em vez de cortar topo ou rodape
- a placa `VOLTAR AO FLUXO DE BARES` da arte recebe uma area clicavel invisivel por cima
- o `venueId` do resultado preserva qual arte usar mesmo quando a campanha avanca depois da partida
- a progressao da campanha so e aplicada visualmente junto com a entrada da tela de resultado, evitando piscar a capa/background do proximo bar antes da vitoria
- placares numericos nao devem ser embutidos nas artes ou textos de resultado autorais
- a tela generica continua como fallback para bares sem arte de resultado

## Estado atual da tela inicial

Estado atual:

- a tela inicial usa a arte `src/assets/start/truco-raiz-start.png`
- a arte entra inteira dentro do stage, com uma copia desfocada no fundo para preencher laterais sem cortar logo ou botao
- o botao `COMEÇAR` e um hotspot HTML invisivel posicionado sobre a placa desenhada
- `COMEÇAR` continua levando para a tela de campanha
- reset de progresso, debug de bar e selecao de variante nao aparecem mais na primeira tela visivel
- reset total do progresso fica disponivel durante a partida no `MENU`, com confirmacao

Arquivos principais:

- `src/app/useGameSession.ts`
- `src/app/AppSections.tsx`
- `src/App.tsx`
- `src/assets/start/truco-raiz-start.png`

## Estado atual da selecao de parceira

Arquivos principais:

- `src/content/characters.ts`
- `src/content/partnerProgression.ts`
- `src/app/useGameSession.ts`
- `src/app/AppSections.tsx`
- `src/App.tsx`

Ja existe:

- roster de 35 personagens com:
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
- duplas adversarias exclusivas por bar, sem repetir personagens em outro local
- segundo lote de `11` adversarios integrado com avatares em `src/assets/characters/`
- catalogo completo navegavel na selecao, com camada cinza sobre personagens ainda indisponiveis
- desbloqueio persistido da dupla adversaria depois da conquista de cada bar
- validacao para impedir que uma escolha antiga use como parceira um personagem ainda bloqueado
- o botao so mostra `Parceira atualmente escolhida` quando o bar realmente ja tem uma parceira salva

Starter partners atuais:

- `nega-catimbo`
- `leninha-lambreta`
- `rita-gambiarra`
- `joca-busao`

Regra de desbloqueio:

- nenhum starter partner antecipa um adversario futuro
- ao concluir um bar, os dois adversarios derrotados entram na lista persistida de parceiros disponiveis
- personagens indisponiveis continuam visiveis na selecao com indicacao do bar necessario para libera-los e botao de escolha desativado

## Estado atual das skins do jogador

Arquivos principais:

- `src/content/playerSkins.ts`
- `src/profile/playerProfile.ts`
- `src/platform/storage/profileStorage.ts`
- `src/app/useGameSession.ts`
- `src/app/AppSections.tsx`

Ja existe:

- catalogo separado de `11` skins do protagonista:
  - `Zeca Viramao`
  - `Lia Virada`
  - `Bento Seca-Mesa`
  - `Nara Certeira`
  - `Gui Meia-Lua`
  - `Solange Viracao`
  - `Clara Vira-Folha`
  - `Dario Sete-Copas`
  - `Akemi Corte-Certo`
  - `Kenji Meia-Noite`
  - `Mei Lin Conta-Fria`
- `10` novas imagens recebidas, copiadas para `src/assets/characters/` e reduzidas para `256x256`
- skins do jogador nao entram no roster de parceiras nem nas duplas adversarias
- quando ainda nao existe skin salva, `COMEÇAR` abre a tela de escolha do protagonista antes da campanha
- a tela de escolha da skin e cosmetica e simplificada: foto, nome, apelido, frase, aviso discreto e botao; sem coragem, blefe, paciencia ou qualquer atributo mecanico
- a escolha e salva em `playerProfile.settings.selectedPlayerSkinId`
- o avatar de `Você` na gameplay usa a skin escolhida
- as capas dinamicas/fallback tambem usam a skin escolhida para representar o jogador
- `Resetar progresso` no `MENU` apaga tambem a skin escolhida e devolve o fluxo para a tela inicial

Pendencia:

- decidir se a troca de protagonista tera um atalho permanente depois da primeira escolha

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
- o `Bar Maneco Banguela` ja possui capa propria reaproveitando os HUDs/placas existentes e trocando host/background
- o `Trem do Jaça` ja possui capa propria reaproveitando os HUDs/placas existentes e trocando host/background
- a `Adega do Juca Bigode` ja possui capa propria reaproveitando os HUDs/placas existentes e trocando host/background
- a `Garagem Norte` ja possui capa propria reaproveitando os HUDs/placas existentes e trocando host/background
- a gameplay do `Bar Maneco Banguela` usa o mesmo background da entrada do bar
- a gameplay do `Trem do Jaça` usa o mesmo background da entrada do bar e mesa autoral propria
- a gameplay da `Adega do Juca Bigode` usa o mesmo background da entrada do bar e mesa autoral propria
- a gameplay da `Garagem Norte` usa o mesmo background da entrada do bar e mesa autoral propria
- outros bares ainda podem cair em fallback generico

### Capas autorais dos primeiros bares

Arquivos principais:

- `src/app/AppSections.tsx`
- `src/app/useGameSession.ts`
- `src/App.tsx`
- `src/assets/venues/ze-catinga/`
- `src/assets/venues/maneco-banguela/`
- `src/assets/venues/trem-do-jaca/`
- `src/assets/venues/adega-do-juca-bigode/`
- `src/assets/venues/zona-norte-garagem/`

Assets atuais:

- `background.png`
- `host-ze-catinga.png`
- `host-quote-board.png`
- `cta-plaque.png`
- `stats-plaque-aged-blank.png`
- `difficulty-bottle.png`
- `divider-ornament.png`
- `src/assets/venues/maneco-banguela/background.png`
- `src/assets/venues/maneco-banguela/host-maneco-banguela.png`
- `src/assets/venues/trem-do-jaca/background.png`
- `src/assets/venues/trem-do-jaca/host-trem-do-jaca.png`
- `src/assets/venues/adega-do-juca-bigode/background.png`
- `src/assets/venues/adega-do-juca-bigode/host-adega-do-juca-bigode.png`
- `src/assets/venues/zona-norte-garagem/background.png`
- `src/assets/venues/zona-norte-garagem/host-zona-norte-garagem.png`

Estado visual atual:

- coluna esquerda esta aceitavel por enquanto
- coluna central mostra nome, endereco, descricao, adversarios e dificuldade ampliada
- Maneco usa o mesmo sistema de layout, HUD, placa de fala, CTA, divisor, dificuldade e placa de estatisticas do Ze Catinga
- Maneco tambem usa `src/assets/venues/maneco-banguela/background.png` como background da gameplay
- Trem do Jaça usa o mesmo sistema de layout, HUD, placa de fala, CTA, divisor, dificuldade e placa de estatisticas do Ze Catinga
- Trem do Jaça tambem usa `src/assets/venues/trem-do-jaca/background.png` como background da gameplay
- Adega do Juca Bigode usa o mesmo sistema de layout, HUD, placa de fala, CTA, divisor, dificuldade e placa de estatisticas do Ze Catinga
- Adega do Juca Bigode tambem usa `src/assets/venues/adega-do-juca-bigode/background.png` como background da gameplay
- Garagem Norte usa o mesmo sistema de layout, HUD, placa de fala, CTA, divisor, dificuldade e placa de estatisticas do Ze Catinga
- Garagem Norte tambem usa `src/assets/venues/zona-norte-garagem/background.png` como background da gameplay
- coluna direita mostra estatisticas em placa propria e botao de entrada centralizados
- a frase `Proximo desafio` foi removida da capa
- a placa `ENTRAR NO BAR` e a lousa do dono seguem protegidas contra estouro de texto
- assets antigos da capa foram limpos

## Campanha e bares atuais mais importantes

### Estado atual da tela de campanha

- para os estados atuais do `Bar do Ze Catinga`, do `Bar Maneco Banguela`, do `Trem do Jaça`, da `Adega do Juca Bigode`, da `Garagem Norte`, do `Quintal da Leste`, do `Subsolo do Centro` e do `Salao da Sul`, a campanha usa arte autoral completa
- as artes mostram o circuito atual, o bar atual, o progresso anterior e a etapa seguinte
- as imagens ficam em:
  - `src/assets/campaign/botecos-rua-ze-catinga.png`
  - `src/assets/campaign/botecos-rua-maneco-banguela.png`
  - `src/assets/campaign/campeonato-vila-nana-trem-do-jaca.png`
  - `src/assets/campaign/campeonato-vila-nana-adega-do-juca-bigode.png`
  - `src/assets/campaign/conquista-zonas-garagem-norte.png`
  - `src/assets/campaign/conquista-zonas-quintal-da-leste.png`
  - `src/assets/campaign/conquista-zonas-subsolo-do-centro.png`
  - `src/assets/campaign/conquista-zonas-salao-da-sul.png`
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

### Campeonato da Vila Naná

- `Trem do Jaça`
  - visualTheme: `bairro-madeira-suja`

- `Adega do Juca Bigode`
  - visualTheme: `bairro-metal-patio`
  - campanha: `src/assets/campaign/campeonato-vila-nana-adega-do-juca-bigode.png`
  - background: `src/assets/venues/adega-do-juca-bigode/background.png`
  - host: `src/assets/venues/adega-do-juca-bigode/host-adega-do-juca-bigode.png`
  - mesa: `src/assets/boteco/table-top-adega-juca-bigode.png`

### Conquista das Zonas

- `Garagem Norte`
  - id: `zona-norte-garagem`
  - visualTheme: `zona-norte-industrial`
  - campanha: `src/assets/campaign/conquista-zonas-garagem-norte.png`
  - background: `src/assets/venues/zona-norte-garagem/background.png`
  - host: `src/assets/venues/zona-norte-garagem/host-zona-norte-garagem.png`
  - mesa: `src/assets/boteco/table-top-garagem-norte.png`
- `Quintal da Leste`
  - id: `zona-leste-quintal`
  - visualTheme: `zona-leste-festival`
  - campanha: `src/assets/campaign/conquista-zonas-quintal-da-leste.png`
  - background: `src/assets/venues/zona-leste-quintal/background.png`
  - host: `src/assets/venues/zona-leste-quintal/host-zona-leste-quintal.png`
  - mesa: `src/assets/boteco/table-top-quintal-da-leste.png`
- `Subsolo do Centro`
  - id: `centro-subsolo`
  - visualTheme: `centro-underground`
  - campanha: `src/assets/campaign/conquista-zonas-subsolo-do-centro.png`
  - background: `src/assets/venues/centro-subsolo/background.png`
  - host: `src/assets/venues/centro-subsolo/host-centro-subsolo.png`
  - mesa: `src/assets/boteco/table-top-subsolo-do-centro.png`
- `Salao da Sul`
  - id: `zona-sul-salao`
  - visualTheme: `zona-sul-premium`
  - campanha: `src/assets/campaign/conquista-zonas-salao-da-sul.png`
  - background: `src/assets/venues/zona-sul-salao/background.png`
  - host: `src/assets/venues/zona-sul-salao/host-zona-sul-salao.png`
  - mesa: `src/assets/boteco/table-top-salao-da-sul.png`

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
