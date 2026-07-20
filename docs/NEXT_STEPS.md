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
- nas telas autorais da Jornada de Campanha, a placa/nome e a foto/cartao do bar atual entram no mesmo bar por hotspots invisiveis
- clicar em um circuito inicia uma run temporaria daquele circuito
- a run temporaria avanca de bar em bar ao cumprir as vitorias locais e retorna ao hub ao concluir o circuito livre
- o `Voltar` dessa tela autoral retorna ao hub do `Modo Livre` e encerra a run temporaria
- a run temporaria nao altera progresso, recompensas ou desbloqueios da campanha principal ja concluida
- o botao `Recomeçar campanha` abre confirmacao dentro do jogo, nao alerta nativo do navegador
- testes unitarios de dialogos/raises ja cobrem `TRUCO!`, `SEIS!`, `NOVE!`, `DOZE!`, `DESCE!`, `TOMA!` e `TÔ FORA!`
- helpers de sessao criam partidas a partir do bar e aplicam a variante declarada pelo local
- ha testes para criacao de partida por local Mineiro/Paulista e para proxima mao Paulista mantendo vira/manilha
- carta coberta esta implementada a partir da segunda vaza e coberta por testes
- mao de 9 esta implementada com decisao `Jogar`/`Correr`
- tutorial jogavel esta implementado, cobre aulas 1 a 10 e foi testado pelo usuario
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

### Capacitor + Android Studio + Xcode

A frente mobile ja foi iniciada. Capacitor esta configurado como ponte entre o build web do Vite e os projetos nativos Android/iOS.

Objetivo:

- manter o jogo web funcional
- manter Capacitor sem reestruturar a arquitetura de estado
- validar os projetos nativos Android/iOS gerados
- validar a experiencia em device real antes de criar novas regras opcionais

Estado ja feito:

- `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` e `@capacitor/ios` alinhados em `8.3.0`
- `capacitor.config.ts` criado com:
  - `appId`: `com.trucoraiz.game`
  - `appName`: `Truco Raiz`
  - `webDir`: `dist`
- plataformas `android/` e `ios/` geradas
- build web sincronizado para as plataformas com `npx cap sync`
- orientacao nativa travada em landscape:
  - Android: `android:screenOrientation="landscape"`
  - iOS: apenas `UIInterfaceOrientationLandscapeLeft` e `UIInterfaceOrientationLandscapeRight`
- no Capacitor, o app renderiza somente a `TableSection` em tela cheia:
  - sem header `Truco Game`
  - sem paineis externos de status/campanha/logs usados no Chrome
  - sem limite global de largura do `#root`
- Android usa modo imersivo fullscreen na `MainActivity`:
  - esconde status bar
  - esconde navigation bar/botoes voltar-home-recentes
  - permite ocupar area de notch/cutout em landscape
  - reaplica fullscreen em `onResume` e ao recuperar foco
- scripts adicionados:
  - `npm run cap:sync`
  - `npm run cap:open:android`
  - `npm run cap:open:ios`
- `npm test`, `npm run build` e `npm run cap:sync` passaram
- Android compilou por terminal com `assembleDebug`
- Android Studio/device fisico ja rodou o app
- ajustes observados no Android foram aplicados:
  - app nativo renderiza somente a tela jogavel
  - fullscreen imersivo esconde status/navigation bars
  - widget central `Etapa` / `Endereco` saiu da gameplay normal
  - botoes de truco/aceitar/aumentar/correr foram ampliados e centralizados verticalmente
- Android Studio/Gradle novo exigiu trocar `getDefaultProguardFile('proguard-android.txt')` por `getDefaultProguardFile('proguard-android-optimize.txt')` em `android/app/build.gradle`

Estado do ambiente nativo:

- Android:
  - o terminal nao encontrou Java no PATH normal
  - o JDK embutido do Android Studio funcionou em `/Applications/Android Studio.app/Contents/jbr/Contents/Home`
  - Gradle baixou Build-Tools 35 e Android Platform 36
  - `assembleDebug` terminou com `BUILD SUCCESSFUL`
- iOS:
  - projeto Xcode foi gerado e o scheme `App` foi listado com sucesso
  - SwiftPM resolveu `capacitor-swift-pm` em `8.3.0`
  - `Info.plist` esta valido e em landscape
  - build por terminal ficou bloqueado pelo ambiente Xcode/CoreSimulator:
    - `xcode-select` estava apontando para `/Library/Developer/CommandLineTools`
    - CoreSimulator reportou versao local `1051.54.0`, abaixo da esperada `1051.55.0`
    - Xcode pediu plataforma/destino iOS alinhado antes de compilar

Ordem recomendada agora:

1. conferir `git status` e preservar mudancas locais
2. rodar `npm test` e `npm run cap:sync`
3. se mexer em layout/mobile, validar Android de novo com `npm run cap:open:android`
4. antes do Xcode, alinhar ambiente se necessario:
   - apontar Command Line Tools para o Xcode completo
   - abrir Xcode e concluir componentes/primeira inicializacao
   - instalar/atualizar plataforma iOS/Simulator em `Xcode > Settings > Components`
5. abrir iOS com `npm run cap:open:ios`
6. no Xcode, escolher simulador/device, configurar signing se usar device fisico e rodar o app
7. testar em device real:
   - orientacao landscape
   - safe areas/notch/home indicator
   - toque em cartas, botoes, hotspots invisiveis, menu e tutorial
   - escala do stage logico `1080x500`
   - performance da mesa, animacoes e transicoes
8. registrar qualquer ajuste mobile necessario antes de implementar novas regras

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
- mao de 9 implementada:
  - gatilho em `9`, `10` ou `11` pontos
  - dupla em 9 ve cartas da parceria antes de decidir
  - `Correr` entrega `1 ponto` aos adversarios
  - `Jogar` deixa a mao valendo `3 pontos`
  - truco/aumento bloqueados nessa mao especial
- novas rodadas de ajuste devem continuar usando testes antes de mudar comportamento

## Pendencias De Produto E Regras

Frentes ainda pendentes, em prioridade menor que validacao mobile:

- opcao de usar ou nao a variante `ponto acima`
- segunda rodada fina de IA:
  - fazer apenas se novos testes em jogo apontarem comportamento ruim
  - preservar testes existentes de thresholds, blefes e descarte
- extrair o roteiro/estado do tutorial de `src/app/AppSections.tsx` para modulo proprio, apenas se o tutorial aprovado comecar a atrapalhar manutencao

Frentes que deixaram de ser pendencia aberta nesta rodada:

- dialogos e raises ganharam cobertura unitaria inicial
- variantes Mineiro/Paulista passaram a ser criadas pela configuracao do bar
- o fluxo pos-campanha ganhou `Modo Livre` para jogar runs temporarias de circuitos e resetar campanha com confirmacao interna
- primeira rodada de IA foi validada em jogo real
- `Jogos Mundiais` e `Mundial` foram corrigidos para Truco Mineiro
- descarte da IA quando nao pode ganhar a vaza ficou coberto por testes
- carta coberta foi implementada e validada
- mao de 9 foi implementada e validada
- tutorial jogavel foi implementado, ajustado visualmente e aprovado pelo usuario

## Validacao Recomendada

Antes de concluir qualquer implementacao:

- verificar `git status`
- preservar mudancas locais existentes
- abrir o fluxo real desde `COMEÇAR` quando houver mudanca visual ou de progressao
- confirmar que a arte correta carrega para campanha, background, mesa, host e resultados quando a mudanca tocar esses pontos
- testar hotspots invisiveis quando houver tela de campanha nova
- rodar `npm test` quando houver mudanca de regra, IA, truco, progressao ou helpers de sessao
- rodar `npm run build`
- para mobile, rodar `npm run cap:sync` antes de abrir Android Studio/Xcode
- para Android, validar `assembleDebug` quando houver mudanca nativa relevante

## O Que Nao Deve Virar Prioridade Agora

- refatoracao total da engine
- troca da arquitetura de estado
- backend ou ranking online
- novas regras opcionais antes de validar o pacote mobile basico
- reabrir a responsividade da gameplay sem regressao real
- reabrir a tela de selecao de parceira sem regressao real
- reabrir o pacote visual principal ou bonus sem regressao ou nova decisao explicita de polimento
- criar novos assets antes de validar a experiencia em device real

## Prompt Para Chat Novo

O prompt pronto para continuar em um chat novo esta em:

- `docs/NEXT_CHAT_PROMPT.md`
