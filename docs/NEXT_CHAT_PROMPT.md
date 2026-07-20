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
9. docs/TUTORIAL_PLAN.md

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
- Na Jornada de Campanha, `ENTRAR NO BAR` tambem cobre a foto/cartao do bar atual quando ela aparece como alvo de toque.
- Testes unitarios de dialogos/raises ja cobrem TRUCO!, SEIS!, NOVE!, DOZE!, DESCE!, TOMA! e TÔ FORA!.
- A criacao de partida por bar ja aplica a variante declarada no local.
- Ha testes para criacao de partida Mineiro/Paulista e proxima mao Paulista mantendo vira.
- A primeira rodada de IA foi validada em jogo real e enviada para origin/main.
- A IA descarta a menor carta quando nao consegue ganhar a vaza.
- A IA usa a menor carta vencedora quando consegue ganhar a vaza.
- Jogos Mundiais e Mundial usam Truco Mineiro.
- Logs de inicio de mao registram regra ativa; em Paulista tambem registram vira e manilha.
- Carta coberta ja esta implementada a partir da segunda vaza, com UI mobile e testes.
- Mao de 9 ja esta implementada:
  - gatilho em `9`, `10` ou `11` pontos
  - dupla em 9 ve cartas da parceria
  - `Correr` entrega `1 ponto` aos adversarios
  - `Jogar` deixa a mao valendo `3 pontos`
  - truco/aumento ficam bloqueados nessa mao especial.
- Tutorial jogavel ja esta implementado e testado pelo usuario:
  - aulas 1 a 10 cobrem mesa/vaza, ordem comum, manilhas, truco, respostas, parceira, carta coberta, Truco Paulista/vira e mao de 9.
- Capacitor ja foi integrado:
  - `capacitor.config.ts` aponta para `dist`
  - `android/` e `ios/` foram gerados
  - `npm run cap:sync` faz build web e sync nativo
  - orientacao nativa esta travada em landscape
  - Android compilou por terminal com `assembleDebug`
  - Android Studio/device fisico ja rodou o app
  - fullscreen, tela jogavel nativa e controles maiores/centralizados ja foram ajustados no Android
  - iOS foi gerado e o scheme `App` foi listado pelo Xcode, mas build/run depende de alinhar Xcode/CoreSimulator.
- Nao reabrir responsividade, selecao de parceira, arquitetura de estado ou pacote visual sem regressao real.

Objetivo deste chat:
Continuar a validacao mobile com Capacitor + Android Studio + Xcode, preservando o jogo web atual.

Prioridade recomendada:
1. Conferir git status antes de editar.
2. Rodar `npm test` e `npm run cap:sync`.
3. Revalidar Android no Android Studio apenas se houver nova mudanca mobile.
4. Alinhar ambiente iOS:
   - apontar Command Line Tools para `/Applications/Xcode.app/Contents/Developer`
   - abrir Xcode e concluir primeira inicializacao/componentes
   - instalar/atualizar plataforma iOS/Simulator em `Xcode > Settings > Components`
5. Abrir/validar iOS no Xcode com `npm run cap:open:ios`.
6. Testar em device real:
   - orientacao landscape
   - safe areas/notch/home indicator
   - toque em cartas, botoes, hotspots invisiveis, menu e tutorial
   - escala do stage logico `1080x500`
   - performance da mesa, animacoes e transicoes
7. Registrar e corrigir apenas regressões concretas de device.

Estado recente:
- Carta coberta ja esta implementada a partir da segunda vaza.
- Mao de 9 ja esta implementada:
  - gatilho em `9`, `10` ou `11` pontos
  - dupla em 9 ve cartas da parceria
  - `Correr` entrega `1 ponto` aos adversarios
  - `Jogar` deixa a mao valendo `3 pontos`
  - truco/aumento ficam bloqueados nessa mao especial.
- Tutorial jogavel foi implementado, ajustado visualmente e aprovado pelo usuario.

Pendencias que continuam abertas, mas nao sao a primeira prioridade deste chat:
- Opcao de escolher ou nao a versao ponto acima.
- Segunda rodada fina de IA, apenas se novos testes em jogo apontarem comportamento ruim.
- Extrair o tutorial para modulo proprio, apenas se a manutencao em `AppSections.tsx` ficar pesada.

Regras de continuidade:
- Preservar mudancas locais do usuario.
- Fazer mudancas incrementais.
- Nao reabrir responsividade, selecao de parceira, arquitetura de estado ou pacote visual sem regressao real.
- Se alterar progressao, campanha ou resultado, validar o fluxo real desde COMEÇAR.
- Rodar npm test quando houver mudanca de regra, IA ou helpers de sessao.
- Rodar npm run build antes de concluir qualquer frente de codigo.
```
