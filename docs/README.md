# Documentacao do Projeto

## Ordem de leitura obrigatoria

Para continuar o projeto em qualquer chat novo do Codex, leia nesta ordem:

1. `docs/README.md`
2. `docs/CONTENT.md`
3. `docs/LAYOUT_RULES.md`
4. `docs/TRUCO_RULES.md`
5. `docs/IMAGE_PROMPT_STANDARDS.md`
6. `docs/NEXT_STEPS.md`
7. `docs/CAMPAIGN_PATH.md`
8. `docs/NEXT_CHAT_PROMPT.md`
9. `docs/TUTORIAL_PLAN.md`

## Papel de cada arquivo

### `docs/README.md`

Indice e contrato de continuidade da documentacao.

### `docs/CONTENT.md`

Entrega o estado consolidado do projeto:

- arquitetura atual
- layout atual
- campanha atual
- IA atual
- assets em uso
- pontos sensiveis de continuidade

### `docs/LAYOUT_RULES.md`

Define as regras consolidadas da gameplay screen:

- hierarquia visual
- composicao das colunas
- materiais visuais
- regras da mesa, scorepad e coluna direita

### `docs/TRUCO_RULES.md`

Define a verdade oficial para:

- nomenclatura do projeto
- falas de truco
- conselho da parceira
- ping-pong de truco e raises

### `docs/NEXT_STEPS.md`

Define o pre-plano vivo:

- o que ja esta consolidado
- o que esta em andamento
- o proximo foco recomendado

### `docs/IMAGE_PROMPT_STANDARDS.md`

Define os padroes de prompts de imagem que funcionaram melhor:

- estrutura obrigatoria para prompts de mesa, background, host, campanha e resultado
- restricoes negativas para evitar artes inutilizaveis
- lembrete de que mesa de gameplay nao pode ter fundo/cenario
- direcao visual por tipo de asset e referencia do pacote bonus ja integrado

### `docs/CAMPAIGN_PATH.md`

Registra a expansao vertical da campanha:

- tabela simples do caminho principal
- dupla adversaria fixa e dificuldade por bar; variante agora e configuracao global
- estado visual minimo aceito antes do polimento autoral

### `docs/NEXT_CHAT_PROMPT.md`

Entrega um prompt pronto para abrir um chat novo:

- arquivos que devem ser lidos primeiro
- estado atual da campanha principal e do bonus pos-campanha
- objetivo recomendado para o proximo chat
- pendencias de regras e produto que devem ser tratadas agora

### `docs/TUTORIAL_PLAN.md`

Registra o tutorial jogavel aprovado:

- aulas 1 a 10
- conceitos ensinados antes da primeira experiencia mobile
- estado atual de implementacao e futura limpeza opcional

### `docs/CHARACTER_AVATAR_PROMPTS.md`

Organiza a expansao externa do roster:

- substituicoes necessarias para eliminar adversarios repetidos
- nomes e arquivos dos personagens integrados no segundo lote
- prompts historicos usados para gerar avatares fora do Codex

### `docs/PLAYER_SKIN_PROMPTS.md`

Organiza as skins exclusivas do jogador:

- conjunto inicial com `Zeca Viramao` e mais `10` protagonistas
- nomes e arquivos das novas skins
- prompts historicos usados para geracao externa
- estado de integracao das skins recebidas e da escolha inicial do protagonista

## Estado do foco atual

O projeto esta com fluxo visual principal, bonus pos-campanha e `Modo Livre` pos-campanha consolidados; a primeira rodada de balanceamento de IA com testes foi aplicada, validada em jogo real e enviada para `origin/main`.

Estado consolidado:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`
- capa autoral do `Bar do Ze Catinga` com HUD de estatisticas em placa propria
- capa e gameplay do `Bar Maneco Banguela` usam o mesmo background proprio, reaproveitando os HUDs/placas da capa do Ze Catinga
- coluna direita da capa centralizada
- coluna central da capa sem `Proximo desafio`
- dificuldade do desafio ampliada abaixo dos adversarios
- limpeza de assets antigos da capa realizada
- scorepad da coluna esquerda corrigido:
  - labels `Nos`, `Eles`, `Mao` e `Mao` nao se sobrepoem mais aos numeros
  - placar da partida e placar da mao ficaram separados por grid interno previsivel
  - asset `src/assets/ui-left/scorepad-notebook-clean-cut.png` preservado
  - validacao visual feita no fluxo real ate a gameplay
  - `npm run build` validado
- gameplay dentro de stage logico `1080x500` escalado como unidade
- modos internos controlados `regular`, `compact` e `tiny`
- cartas da mao e botao `MENU` protegidos dentro da faixa inferior
- popover do `MENU` fica acima da mesa e fecha antes dos modais de confirmacao
- o `MENU` em partida possui opcoes para:
  - trocar de parceira
  - vencer esta partida, para validar progressao sem jogar a partida inteira
  - perder esta partida, para validar a tela de derrota
  - sair da partida
  - resetar todo o progresso do jogo com confirmacao
- intro cinematografica curta antes da gameplay:
  - exibe apenas o background do bar por cerca de 1 segundo
  - revela mesa, HUDs, oponentes e cartas com fade curto
  - bloqueia cartas, truco e `MENU` ate terminar
  - validada no `Bar do Ze Catinga` e no `Bar Maneco Banguela`
- tela de selecao de parceira aceita como pronta no estado atual
- selecao de parceira agora mostra o catalogo inteiro com bloqueios e libera a dupla derrotada apos cada bar
- parceira antes chamada `Ze Catinga` renomeada para `Joca do Busão` com id `joca-busao`
- tela de campanha do primeiro trecho (`Botecos da Rua`) usa artes autorais para os estados atuais:
  - `Bar do Ze Catinga`: `src/assets/campaign/botecos-rua-ze-catinga.png`
  - `Bar Maneco Banguela`: `src/assets/campaign/botecos-rua-maneco-banguela.png`
- tela de campanha do `Campeonato da Vila Naná` usa arte autoral para o estado atual:
  - `Trem do Jaça`: `src/assets/campaign/campeonato-vila-nana-trem-do-jaca.png`
  - `Adega do Juca Bigode`: `src/assets/campaign/campeonato-vila-nana-adega-do-juca-bigode.png`
- tela de campanha da `Conquista das Zonas` usa arte autoral para o estado atual:
  - `Garagem Norte`: `src/assets/campaign/conquista-zonas-garagem-norte.png`
  - `Quintal da Leste`: `src/assets/campaign/conquista-zonas-quintal-da-leste.png`
  - `Subsolo do Centro`: `src/assets/campaign/conquista-zonas-subsolo-do-centro.png`
  - `Salao da Sul`: `src/assets/campaign/conquista-zonas-salao-da-sul.png`
- os botoes da campanha autoral sao areas HTML invisiveis sobre a imagem:
  - `VOLTAR`
  - `ENTRAR NO BAR`
  - `TROCAR PARCEIRA`
- a entrada do bar tambem cobre a foto/cartao do bar atual nas telas autorais, pois esse e um alvo natural de toque para jogadores
- a tela de campanha dinamica continua como fallback para outros bares/estados
- tela inicial definitiva com arte propria:
  - `src/assets/start/truco-raiz-start.png`
  - botoes `COMEÇAR`, `TUTORIAL` e `CONFIGURAÇÕES` desenhados na arte
  - `COMEÇAR`, `TUTORIAL` e `CONFIGURAÇÕES` como hotspots HTML invisiveis sobre as placas da arte
  - `CONFIGURAÇÕES` abre a primeira tela de ajustes, com escolha global entre `Truco Paulista` e `Truco Mineiro`
  - debug e reset removidos da primeira tela visivel
- telas autorais de vitoria e derrota do `Bar do Ze Catinga`:
  - `src/assets/venues/ze-catinga/match-result-win.png`
  - `src/assets/venues/ze-catinga/match-result-loss.png`
- telas autorais de vitoria e derrota do `Bar Maneco Banguela`:
  - `src/assets/venues/maneco-banguela/match-result-win.png`
  - `src/assets/venues/maneco-banguela/match-result-loss.png`
- telas autorais de vitoria e derrota do `Trem do Jaça`:
  - `src/assets/venues/trem-do-jaca/match-result-win.png`
  - `src/assets/venues/trem-do-jaca/match-result-loss.png`
- telas autorais de vitoria e derrota da `Adega do Juca Bigode`:
  - `src/assets/venues/adega-do-juca-bigode/match-result-win.png`
  - `src/assets/venues/adega-do-juca-bigode/match-result-loss.png`
- telas autorais de vitoria e derrota da `Garagem Norte`:
  - `src/assets/venues/zona-norte-garagem/match-result-win.png`
  - `src/assets/venues/zona-norte-garagem/match-result-loss.png`
- telas autorais de vitoria e derrota do `Quintal da Leste`:
  - `src/assets/venues/zona-leste-quintal/match-result-win.png`
  - `src/assets/venues/zona-leste-quintal/match-result-loss.png`
- telas autorais de vitoria e derrota do `Subsolo do Centro`:
  - `src/assets/venues/centro-subsolo/match-result-win.png`
  - `src/assets/venues/centro-subsolo/match-result-loss.png`
- telas autorais de vitoria e derrota do `Salao da Sul`:
  - `src/assets/venues/zona-sul-salao/match-result-win.png`
  - `src/assets/venues/zona-sul-salao/match-result-loss.png`
- telas definitivas de conquista ficam em `src/assets/campaign-victories/`
- ao completar as vitorias requeridas de um bar, o jogo exibe a tela definitiva do bar no lugar da vitoria normal da partida
- se o bar completado for o ultimo do circuito, o jogo mostra a tela definitiva do bar e em seguida a tela definitiva do circuito
- a tela de resultado so aparece depois da ultima carta visivel na mesa, com atraso de 1 segundo para leitura humana
- caminho principal da campanha tem pacote visual autoral integrado ate o `Cassino Mé Maior`:
  - `Centro de Convenções da Prefeitura`
  - `Ginásio Estadual Maneco Filé`
  - `Arena Nacional`
  - `Centro Americano Truqueiro de Medelin`
  - `Hotel Truco de Segóvia, Espanha`
  - `Cassino Mé Maior`
- bonus pos-campanha integrado:
  - circuito: `Circuito Intergaláctico`
  - local: `Órbita da Lua`
  - campanha: `src/assets/campaign/circuito-intergalactico-orbita-da-lua.png`
  - background: `src/assets/venues/orbita-da-lua/background.png`
  - host: `src/assets/venues/orbita-da-lua/host-orbita-da-lua.png`
  - mesa: `src/assets/boteco/table-top-orbita-da-lua.png`
  - resultado normal: `src/assets/venues/orbita-da-lua/match-result-win.png` e `src/assets/venues/orbita-da-lua/match-result-loss.png`
  - vitoria definitiva do local: `src/assets/campaign-victories/venue-orbita-da-lua.png`
  - vitoria definitiva do circuito: `src/assets/campaign-victories/stage-intergalactico.png`
  - adversarios: `Mané Banguela` + `Cosme Órbita`
- os pacotes recentes incluem campanha, background de gameplay, host, mesa, vitoria/derrota normal e conquistas definitivas quando cadastradas
- modo livre pos-campanha integrado:
  - asset: `src/assets/campaign/free-play-circuit-hub.png`
  - aparece quando a campanha inteira ja foi concluida
  - cada quadro de circuito e um hotspot HTML invisivel
  - clicar em um circuito inicia uma run temporaria daquele circuito
  - a run temporaria começa no primeiro bar e avanca para o proximo bar ao cumprir as vitorias do local
  - o `Voltar` da tela autoral retorna ao hub do `Modo Livre` e encerra a run temporaria
  - concluir o ultimo bar do circuito livre retorna ao hub
  - a run temporaria nao altera progresso, recompensas ou desbloqueios da campanha principal ja concluida
  - `Recomeçar campanha` usa confirmacao interna do jogo, nao alerta nativo do navegador
- IA e regras validadas nesta rodada:
  - adversarios de campanha usam personalidade de truco derivada da dificuldade do bar
  - `balanced` ficou menos propenso a trucar com pouco e a contra-aumentar com mao media
  - perfis blefadores mantem blefes com probabilidades menores e menos aceite em aposta alta
  - dificuldade maxima disciplinada usa `trickster`
  - quando a parceira consulta o humano, `BORA!` impede corrida e garante no minimo aceite
  - `CE QUE SABE!` sinaliza uma carta util/mediana e pesa mais para parceiras desbloqueadas mais tarde
  - `MELHOR CORRER!` sinaliza que o humano nao tem ajuda; a parceira so segue por forca propria
  - IA descarta a menor carta quando nao consegue ganhar a vaza
  - IA usa a menor carta vencedora quando ainda consegue ganhar a vaza
  - logs de inicio de mao registram regra ativa, vira e manilha quando houver
  - logs `DEBUG IA Truco` registram acao, time, perfil, forcas e decisao para diagnosticar pedidos e raises
  - `Truco Paulista` e o padrao global; `Truco Mineiro` pode ser escolhido em `CONFIGURAÇÕES` para todos os bares
  - validacao final passou em `npm test` e `npm run build`

## Prioridade imediata para o proximo chat

No proximo chat, continuar a validacao mobile com `Capacitor + Android Studio + Xcode`, sem reabrir responsividade estrutural, selecao de parceira, arquitetura de estado ou pacote visual sem regressao real.

Estado pos-bonus:

- o bonus `Circuito Intergaláctico` / `Órbita da Lua` ja esta integrado no fluxo
- a tela de campanha do bonus e a ultima etapa do jogo; ela nao deve apontar para um proximo local
- as conquistas definitivas cadastradas para o bonus sao a do local `Órbita da Lua` e a do circuito `intergalactico`

Proximo foco recomendado:

- usar `docs/NEXT_CHAT_PROMPT.md` como briefing inicial copiavel
- carta coberta ja esta implementada a partir da segunda vaza
- mao de 9 ja esta implementada com decisao `Jogar`/`Correr`
- tutorial jogavel ja esta implementado e testado pelo usuario:
  - aulas 1 a 10 cobrem mesa/vaza, ordem comum, manilhas, truco, respostas, parceira, carta coberta, Truco Paulista/vira e mao de 9
- proxima frente recomendada:
  - Capacitor ja foi integrado com `capacitor.config.ts`, `android/` e `ios/`
  - `npm run cap:sync` faz build web e sync nativo
  - Android ja compilou por terminal com `assembleDebug`
  - Android Studio/device fisico ja rodou o app
  - fullscreen, tela jogavel nativa e controles maiores/centralizados ja foram ajustados no Android
  - ajustar ambiente do Xcode/CoreSimulator se necessario e abrir/testar no Xcode
  - validar em device real orientacao landscape, toque, safe areas, escala e performance
- proximas pendencias de produto/regras:
  - opcao de escolher ou nao a versao `ponto acima`
  - segunda rodada fina de IA apenas se novos testes em jogo apontarem regressao real

## Regra de continuidade

Se houver conflito entre memoria de chat e documentacao:

- priorizar os arquivos acima
- depois validar no codigo

## Observacao importante

O projeto mudou bastante de um prototipo mais “engine-first” para uma gameplay screen cenografica e jogavel.

Portanto:

- evitar respostas genericas de “vamos reestruturar tudo”
- evitar refatoracoes totais
- preferir evolucao incremental sobre a base atual
