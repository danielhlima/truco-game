# Next Steps

## Pre-plano Consolidado

### 1. Consolidar a gameplay screen

- fazer a tela principal se resolver dentro da tela do celular
- eliminar dependencia de controles externos
- fechar nomenclatura e HUD essencial

Status:

- amplamente concluido

### 2. Fechar o fluxo completo de truco dentro da tela

- decisao em dupla
- consultas da parceira
- baloes consistentes
- fluxo de aceite, raise e corrida estabilizado

Status:

- funcional
- blindagem por testes reforcada
- regra de consulta da parceira ajustada para nao consultar de novo quando ela iniciou ou ja recebeu respaldo no fluxo

### 3. Preparar a arquitetura/layout da tela final

- coluna esquerda
- mesa central
- coluna direita
- HUD integrada ao cenario

Status:

- em bom estado para seguir
- revisitar so se houver regressao real

### 4. Construir a tela de selecao de parceira IA

- transformar o roster em experiencia navegavel
- ligar retrato, historia, estilo de jogo e atributos
- preparar o fluxo para escolha real da parceira

Status:

- funcional e aceito como pronto no estado atual
- reabrir apenas se houver regressao real ou nova decisao de produto

## Estado Atual Real

### Marco de foco

- a gameplay screen esta em bom estado, e o scorepad da coluna esquerda ja teve a sobreposicao corrigida
- a escolha de parceira por bar ja funciona
- a tela de campanha ja existe antes da entrada no bar
- a capa do `Bar do Ze Catinga` foi refinada, limpa e salva no Git
- a gameplay foi estabilizada como stage logico `1080x500` escalado dentro da moldura landscape
- a mao do jogador, o `MENU`, o popover do menu e modais de confirmacao foram ajustados dentro desse stage
- o `Bar do Ze Catinga` ganhou telas autorais de vitoria e derrota com CTA clicavel sobre a arte
- o ajuste do scorepad:
  - preservou `src/assets/ui-left/scorepad-notebook-clean-cut.png`
  - ficou restrito ao layout interno em `src/App.tsx`
  - separou placar da partida e placar da mao
  - foi validado visualmente no fluxo real ate a gameplay
  - passou em `npm run build`
- a tela de selecao de parceira foi aceita como pronta no estado atual
- a parceira antes chamada `Ze Catinga` agora e `Joca do Busão`, id `joca-busao`
- a persistencia antiga do perfil foi invalidada para nao carregar escolha salva com o id anterior
- a tela de campanha dos estados atuais do `Bar do Ze Catinga` e do `Bar Maneco Banguela` usa arte autoral com hotspots HTML invisiveis
- a tela dinamica de campanha segue como fallback para estados sem arte propria
- a capa e a gameplay do `Bar Maneco Banguela` ja usam o background proprio do bar e reaproveitam os HUDs/placas existentes
- a intro cinematografica curta antes da gameplay foi implementada e validada:
  - mostra apenas o background do bar por cerca de 1 segundo
  - revela mesa, HUDs, oponentes e cartas com fade curto
  - bloqueia cartas, truco e `MENU` ate terminar
  - foi validada no `Bar do Ze Catinga` e no `Bar Maneco Banguela`
- o foco imediato recomendado agora e trabalhar a tela inicial definitiva do jogo

### Truco e dialogos

Estado atual:

- consultas da parceira ja existem
- conselho da parceira ao humano ja existe
- a leitura do humano pesa na decisao final da parceira
- a regra da `escalada vigente` para `DESCE!/TOMA!` foi consolidada
- a parceira nao consulta novamente o humano quando ela iniciou a escalada ou ja recebeu respaldo antes

Ponto critico:

- manter a cobertura de testes antes de mexer de novo no fluxo de dialogo
- qualquer ajuste novo em `truco + raise` deve vir com teste

### Selecao de parceira

Estado atual:

- apenas as 5 starter partners aparecem
- a escolha fica salva por bar
- ao entrar em bar sem escolha salva, a tela reaparece
- os dois primeiros bares ja tem adversarios fixos

Decisao atual:

- a tela foi considerada pronta no estado em que esta
- manter o fluxo e a persistencia por bar
- nao reabrir acabamento da selecao no proximo chat

### Capa do Bar do Ze Catinga

Estado atual:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo` ja esta implementado
- assets do Ze Catinga estao em `src/assets/venues/ze-catinga/`
- a capa usa fundo, dono do bar, lousa, HUD de estatisticas, adversarios, dificuldade e placa `ENTRAR NO BAR`
- coluna esquerda esta aceitavel por enquanto
- coluna central mostra informacoes do bar, adversarios e dificuldade ampliada
- coluna direita mostra estatisticas e CTA centralizados
- assets antigos da capa foram limpos
- commit salvo e enviado:
  - `0f90926 Refine Ze Catinga venue cover`

Pendencias principais da capa:

- nao ha pendencia imediata bloqueante na capa
- manter o layout atual preservado enquanto o foco volta para a gameplay

### Resultados do Bar do Ze Catinga

Estado atual:

- vitoria usa `src/assets/venues/ze-catinga/match-result-win.png`
- derrota usa `src/assets/venues/ze-catinga/match-result-loss.png`
- as artes ocupam a tela de resultado inteira dentro da moldura
- `VOLTAR AO FLUXO DE BARES` fica clicavel por area real sobre a placa desenhada
- o resultado guarda `venueId` para continuar usando a arte do bar encerrado quando a campanha avanca
- placares numericos foram removidos dos textos autorais de resultado

## Proximo foco recomendado

### Opcao principal

- trabalhar a tela inicial definitiva do jogo

### Itens para atacar primeiro

- Tela inicial:
  1. transformar a tela atual de entrada em experiencia final
  2. usar a captura enviada em 2026-05-25 como referencia do estado atual a melhorar
  3. preservar `COMEÇAR` como entrada para o fluxo `campanha > capa do bar > escolha de parceira se necessario > jogo`
  4. manter o debug de bar discreto, se ainda necessario para desenvolvimento
  5. manter a moldura landscape e o clima visual de boteco
- Validacao:
  - abrir a tela inicial em tamanhos representativos
  - confirmar que `COMEÇAR` continua abrindo a campanha
  - confirmar que o fluxo ate a gameplay continua preservado
  - testar em tamanhos representativos da moldura landscape
  - rodar `npm run build`

### Opcao seguinte depois disso

- criar telas autorais de vitoria/derrota do `Bar Maneco Banguela`

## Pendencias abertas

- expandir o fluxo autoral da campanha:
  - imagem para estados concluidos do primeiro trecho
  - imagem para transicao ao `Circuito do Bairro`
  - hotspots revisados por estado
- criar resultado autoral do `Bar Maneco Banguela`
- refinar a intro de gameplay com entrada escalonada de mesa, HUDs e cartas, caso haja nova decisao visual
- transformar a tela inicial em tela definitiva do jogo
- dar mais contexto narrativo aos bares
- decidir como parceiros gratuitos/pagos entram no fluxo
- otimizar mais os assets fotograficos grandes, se necessario

## O que nao deve virar prioridade agora

- refatoracao total da engine
- troca da arquitetura de estado
- backend, ranking online ou empacotamento mobile
- reabrir grandes retrabalhos na gameplay screen sem motivo real

## Regra de trabalho

Antes de iniciar qualquer nova frente em um chat novo:

1. ler `docs/CONTENT.md`
2. ler `docs/LAYOUT_RULES.md`
3. ler `docs/TRUCO_RULES.md`
4. ler `docs/NEXT_STEPS.md`
5. validar no codigo os arquivos realmente afetados

## Prompt operacional para o proximo chat

Copie e cole no proximo chat:

```text
Estamos continuando o projeto truco-game.

Antes de agir, leia nesta ordem:
1. docs/README.md
2. docs/CONTENT.md
3. docs/LAYOUT_RULES.md
4. docs/TRUCO_RULES.md
5. docs/NEXT_STEPS.md

Use esses arquivos como fonte de verdade.

Estado atual:
- a capa do Bar do Ze Catinga foi refinada, limpa, commitada e enviada para origin/main
- commit da capa: 0f90926 Refine Ze Catinga venue cover
- commit mais recente conhecido: 7b427d9 Add Maneco Banguela campaign and venue visuals
- o fluxo atual deve ser preservado: COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo
- o scorepad da coluna esquerda ja foi corrigido:
  - labels `Nos`, `Eles`, `Mao` e `Mao` nao se sobrepoem mais aos numeros
  - placar da partida e placar da mao foram separados
  - asset `src/assets/ui-left/scorepad-notebook-clean-cut.png` preservado
  - validacao visual feita no fluxo real ate a gameplay
  - `npm run build` passou
- a gameplay foi estabilizada como stage logico `1080x500`:
  - moldura escala a tela como unidade
  - modos internos controlados `regular`, `compact` e `tiny`
  - mao do jogador e `MENU` foram protegidos
- o Bar do Ze Catinga tem telas autorais de resultado:
  - vitoria em `src/assets/venues/ze-catinga/match-result-win.png`
  - derrota em `src/assets/venues/ze-catinga/match-result-loss.png`
- a tela de selecao de parceira foi considerada pronta no estado atual e nao deve ser reaberta neste chat
- a parceira antes chamada Ze Catinga agora e Joca do Busão, com id `joca-busao`
- a persistencia antiga do perfil foi invalidada depois dessa mudanca de id
- a tela de campanha dos estados atuais de Ze Catinga e Maneco Banguela usa arte autoral:
  - `src/assets/campaign/botecos-rua-ze-catinga.png`
  - `src/assets/campaign/botecos-rua-maneco-banguela.png`
  - botoes HTML invisiveis sobre `VOLTAR`, `ENTRAR NO BAR` e `TROCAR PARCEIRA`
  - tela dinamica preservada como fallback
- a tela de resultado preserva a ultima mesa visivel e espera 1 segundo antes de exibir vitoria/derrota
- a capa do Bar Maneco Banguela usa:
  - `src/assets/venues/maneco-banguela/background.png`
  - `src/assets/venues/maneco-banguela/host-maneco-banguela.png`
  - HUDs/placas reaproveitados do Ze Catinga
- a gameplay do Bar Maneco Banguela usa o mesmo background da entrada
- a intro cinematografica curta antes da gameplay esta implementada:
  - antes de cada partida, exibe apenas o background do bar por cerca de 1 segundo
  - depois revela mesa, HUDs, oponentes e cartas com fade curto
  - bloqueia cartas, truco e `MENU` ate terminar
  - mantem a intro curta e reutilizavel para qualquer bar
  - validada no `Bar do Ze Catinga` e no `Bar Maneco Banguela`
- proximo foco:
  - trabalhar a tela inicial definitiva do jogo
  - usar a captura enviada em 2026-05-25 como referencia do estado atual
  - preservar o fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`

Objetivo deste chat:
1. transformar a tela inicial atual em uma tela definitiva do jogo
2. preservar `COMEÇAR` como entrada para a campanha
3. manter debug de bar discreto, se ainda necessario para desenvolvimento
4. preservar a capa do bar, a selecao de parceira, a gameplay, a intro curta e as regras de truco

Arquivos provaveis:
- src/App.tsx
- src/app/AppSections.tsx
- src/app/useGameSession.ts
- possivelmente assets novos para a tela inicial, se a direcao visual pedir

Importante:
- verificar `git status` e preservar mudancas locais existentes
- nao reabrir a responsividade da gameplay sem regressao real
- nao reabrir a tela de selecao de parceira sem regressao real
- nao mudar regras de truco, pontuacao ou progressao de campanha
- nao quebrar a intro cinematografica curta antes da gameplay
- nao desmontar a arquitetura atual
- fazer mudancas incrementais
- validar visualmente no navegador
- validar com `npm run build`
```
