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
- a tela inicial definitiva foi implementada:
  - usa `src/assets/start/truco-raiz-start.png`
  - mostra a arte inteira com preenchimento desfocado nas laterais quando necessario
  - usa hotspot HTML invisivel sobre o `COMEÇAR` desenhado
  - removeu debug, reset e variante da primeira tela visivel
- o `MENU` em partida agora possui:
  - `Vencer esta partida`, para validar progressao sem jogar a partida inteira
  - `Perder esta partida`, para validar a tela de derrota
  - `Resetar progresso`, com confirmacao antes de apagar campanha, escolhas de parceira, skin do jogador e historico salvo
- o foco imediato recomendado agora e expandir a campanha verticalmente, bar a bar, ate fechar o caminho principal do jogo

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

- `4` starter partners ficam disponiveis desde o inicio
- o catalogo inteiro aparece na selecao, com camada cinza e botao de escolha desativado para personagens ainda indisponiveis
- ao concluir um bar, a dupla adversaria derrotada e salva como nova opcao de parceria
- nenhum starter partner antecipa adversarios de bares futuros
- a escolha fica salva por bar
- ao entrar em bar sem escolha salva, a tela reaparece
- escolhas antigas de personagens ainda bloqueados deixam de valer ate a liberacao correta

Decisao atual:

- a tela foi considerada pronta no estado em que esta
- manter o fluxo, a persistencia por bar e a persistencia dos desbloqueios
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
- as artes cabem inteiras dentro da moldura, sem cortar a placa `VOLTAR AO FLUXO DE BARES`
- `VOLTAR AO FLUXO DE BARES` fica clicavel por area real sobre a placa desenhada
- o resultado guarda `venueId` para continuar usando a arte do bar encerrado quando a campanha avanca
- placares numericos foram removidos dos textos autorais de resultado

### Resultados do Bar Maneco Banguela

Estado atual:

- vitoria usa `src/assets/venues/maneco-banguela/match-result-win.png`
- derrota usa `src/assets/venues/maneco-banguela/match-result-loss.png`
- as artes cabem inteiras dentro da moldura, sem cortar a placa `VOLTAR AO FLUXO DE BARES`
- `VOLTAR AO FLUXO DE BARES` fica clicavel por area real sobre a placa desenhada

### Trem do Jaça

Estado atual:

- campanha usa `src/assets/campaign/campeonato-vila-nana-trem-do-jaca.png`
- background usa `src/assets/venues/trem-do-jaca/background.png`
- host usa `src/assets/venues/trem-do-jaca/host-trem-do-jaca.png`
- mesa usa `src/assets/boteco/table-top-trem-jaca.png`
- vitoria usa `src/assets/venues/trem-do-jaca/match-result-win.png`
- derrota usa `src/assets/venues/trem-do-jaca/match-result-loss.png`
- capa do bar reaproveita o sistema visual do Ze Catinga/Maneco com textos proprios do Jaça
- resultado autoral preserva a arte inteira no stage, aceitando respiro lateral quando necessario

## Proximo foco recomendado

### Opcao principal

- expandir a campanha bar a bar e fechar o caminho principal jogavel

### Itens para atacar primeiro

- Campanha vertical:
  1. usar `Bar Maneco Banguela` e `Trem do Jaça` como modelos completos ja integrados
  2. completar o proximo bar em estado jogavel, com prioridade para `Adega do Juca Bigode`
  3. comparar a nova entrada da Adega com `docs/CAMPAIGN_PATH.md` e `src/career/campaign/campaignData.ts`
  4. validar que nao ha repeticao de personagens entre bares e que parceiros iniciais nao antecipam adversarios futuros
  5. verificar a variante declarada por bar, mantendo a aplicacao real de Mineiro/Paulista como pendencia separada se nao bloquear a campanha
  6. garantir fallback visual aceitavel para bares sem arte propria antes de criar novas imagens
- Validacao:
  - abrir o fluxo real desde `COMEÇAR`
  - confirmar progressao de bar em bar
  - confirmar que cada bar carrega adversarios, dificuldade e variante esperados
  - testar em tamanhos representativos da moldura landscape
  - rodar `npm run build`

### Opcao seguinte depois disso

- refinar artes autorais, resultados especiais, falas e balanceamento de IA

## Pendencias abertas

- mapear tabela consolidada da campanha principal
- definir tema, dificuldade, variante e adversarios de cada bar
- completar o caminho principal de bares em estado jogavel
- executar o passo 3 da expansao vertical nesta ordem:
  1. consolidar tabela do caminho principal
  2. fechar `Bar Maneco Banguela` como bar-modelo completo
  3. completar `Adega do Juca Bigode` como proximo bar jogavel
  4. validar exclusividade de personagens por bar
  5. conferir variantes declaradas sem misturar com a correcao completa das regras Mineiro/Paulista
  6. manter fallback visual aceitavel para bares sem arte propria
- expandir o roster de personagens antes dos ambientes dos proximos bares:
  - cada bar deve ter uma dupla adversaria exclusiva
  - nao repetir adversarios em bares diferentes
  - avatares cadastrados sem arte concluidos: `jura-pancada`, `marlene-pimenta`, `zito-parafuso` e `creusa-rabugenta`
  - `11` novos personagens adicionados para eliminar repeticoes nas fases avancadas e no bonus
  - prompts usados na producao externa preservados em `docs/CHARACTER_AVATAR_PROMPTS.md`
  - lista de parceiros disponiveis aumenta gradualmente conforme cada bar e conquistado
  - dupla adversaria derrotada e desbloqueada como parceria depois da conquista do proprio bar
- escolha da skin/personagem visual do jogador:
  - `10` novas skins exclusivas foram recebidas, reduzidas e integradas como assets
  - as skins ficam em catalogo separado em `src/content/playerSkins.ts`
  - a escolha inicial do protagonista foi implementada antes da campanha quando ainda nao existe skin salva
  - a tela de escolha da skin e apenas cosmetica e foi simplificada para foto, nome, apelido, frase, aviso discreto e botao; nao mostra atributos como coragem, paciencia ou blefe
  - a escolha e persistida em `playerProfile.settings.selectedPlayerSkinId`
  - o avatar de `Você` na gameplay e nas capas dinamicas usa a skin escolhida
  - `Resetar progresso` no `MENU` apaga tambem a skin escolhida e retorna para a tela inicial
  - pendencia futura: decidir se a troca de protagonista tera um atalho permanente fora do primeiro fluxo de escolha
- implementar regras pendentes do truco com cobertura de testes:
  - mao de nove: parceiros da dupla com `9 pontos` podem ver as cartas um do outro
  - mao de nove: se essa dupla optar por nao jogar depois da consulta, os adversarios recebem `1 ponto`
  - mao de nove: se essa dupla optar por jogar e perder, os adversarios recebem `3 pontos`
  - mao de nove: criar indicacao visual/HUD quando o time estiver em `9 pontos`, explicando que pedir truco/aumentar fica bloqueado pela regra especial
  - segunda e terceira vazas: permitir jogar carta virada para baixo sem revelar a identidade nem ao parceiro
  - corrigir a aplicacao efetiva da variante configurada por bar; hoje partidas declaradas como Paulista ainda se comportam como Mineiro
- expandir o fluxo autoral da campanha:
  - imagem para estados concluidos do primeiro trecho
  - imagem para transicao ao `Campeonato da Vila Naná`
  - hotspots revisados por estado
- refinar a intro de gameplay com entrada escalonada de mesa, HUDs e cartas, caso haja nova decisao visual
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
- a base atual ja esta commitada e enviada para origin/main antes do proximo chat
- a capa do Bar do Ze Catinga foi refinada e consolidada
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
- a tela inicial definitiva esta implementada:
  - arte em `src/assets/start/truco-raiz-start.png`
  - botao `COMEÇAR` como hotspot HTML invisivel sobre a arte
  - debug, reset e variante removidos da primeira tela visivel
- o menu de contexto em partida tem `Resetar progresso`, com confirmacao antes de apagar todo o progresso salvo, incluindo a skin do jogador
- a tela de escolha da skin do jogador foi simplificada para foto, nome, apelido, frase e botao
- a selecao de parceira teve um ajuste pequeno: o botao so mostra `Parceira atualmente escolhida` quando o bar realmente ja tem parceira salva
- proximo foco:
  - voltar para expansao vertical da campanha
  - seguir os 6 pontos do passo 3: tabela, Maneco e Trem do Jaça como modelos, proximo bar jogavel, exclusividade de personagens, variantes declaradas e fallback visual
  - preservar o fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`

Objetivo deste chat:
1. retomar a expansao vertical pelo passo 3
2. comparar `docs/CAMPAIGN_PATH.md` com `src/career/campaign/campaignData.ts`
3. fechar o `Bar Maneco Banguela` como bar-modelo completo apos o `Bar do Ze Catinga`
4. preparar `Adega do Juca Bigode` como proximo bar jogavel minimo
5. validar exclusividade de personagens, desbloqueio de parceiros e fallback visual
6. preservar a tela inicial definitiva, a intro curta, a capa do bar, a selecao de parceira, a gameplay e as regras de truco

Arquivos provaveis:
- docs/CAMPAIGN_PATH.md
- src/career/campaign/campaignData.ts
- src/career/campaign/progression.ts
- src/career/campaign/types.ts
- src/content/characters.ts
- src/content/partnerProgression.ts
- src/app/AppSections.tsx
- src/App.tsx
- testes em tests/campaign/progression.test.ts
- evitar solicitar novos assets sem necessidade; usar fallback visual quando possivel

Importante:
- verificar `git status` e preservar mudancas locais existentes
- nao reabrir a responsividade da gameplay sem regressao real
- nao reabrir a tela de selecao de parceira sem regressao real
- nao mudar regras de truco, pontuacao ou progressao de campanha
- nao corrigir a aplicacao Mineiro/Paulista neste passo, salvo se bloquear diretamente o caminho jogavel
- nao quebrar a intro cinematografica curta antes da gameplay
- nao quebrar `Resetar progresso` no menu de contexto
- nao desmontar a arquitetura atual
- fazer mudancas incrementais
- validar visualmente no navegador
- validar com `npm run build`
```
