# Documentacao do Projeto

## Ordem de leitura obrigatoria

Para continuar o projeto em qualquer chat novo do Codex, leia nesta ordem:

1. `docs/CONTENT.md`
2. `docs/LAYOUT_RULES.md`
3. `docs/TRUCO_RULES.md`
4. `docs/NEXT_STEPS.md`

## Papel de cada arquivo

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

### `docs/CAMPAIGN_PATH.md`

Registra a expansao vertical da campanha:

- tabela simples do caminho principal
- dupla adversaria fixa, variante e dificuldade por bar
- estado visual minimo aceito antes do polimento autoral

### `docs/CHARACTER_AVATAR_PROMPTS.md`

Organiza a expansao externa do roster:

- substituicoes necessarias para eliminar adversarios repetidos
- nomes e arquivos dos proximos personagens
- prompts prontos para gerar novos avatares fora do Codex

### `docs/PLAYER_SKIN_PROMPTS.md`

Organiza as skins exclusivas do jogador:

- conjunto inicial planejado com `Zeca Viramao` e mais `10` protagonistas
- nomes e arquivos das novas skins
- prompts prontos para geracao externa antes da implementacao da escolha visual
- estado de integracao das skins recebidas e da escolha inicial do protagonista

## Estado do foco atual

A responsividade estrutural da gameplay foi estabilizada depois da capa do `Bar do Ze Catinga`.

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
- os botoes da campanha autoral sao areas HTML invisiveis sobre a imagem:
  - `VOLTAR`
  - `ENTRAR NO BAR`
  - `TROCAR PARCEIRA`
- a tela de campanha dinamica continua como fallback para outros bares/estados
- tela inicial definitiva com arte propria:
  - `src/assets/start/truco-raiz-start.png`
  - botao `COMEÇAR` como hotspot HTML invisivel sobre a placa da arte
  - debug, reset e seletor de variante removidos da primeira tela visivel
- telas autorais de vitoria e derrota do `Bar do Ze Catinga`:
  - `src/assets/venues/ze-catinga/match-result-win.png`
  - `src/assets/venues/ze-catinga/match-result-loss.png`
- a tela de resultado so aparece depois da ultima carta visivel na mesa, com atraso de 1 segundo para leitura humana

## Prioridade imediata para o proximo chat

No proximo chat, iniciar a expansao vertical da campanha, trabalhando bar a bar ate fechar o caminho principal do jogo.

Proximo foco recomendado:

- mapear a campanha em uma tabela simples de bares/fases
- definir para cada bar: tema, ambiente, dificuldade, variante, dupla adversaria, objetivo para passar e estado visual minimo
- usar o `Bar Maneco Banguela` como primeiro modelo completo de expansao depois do `Bar do Ze Catinga`
- preservar a tela inicial definitiva e a intro curta antes da gameplay
- preservar o fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`

Depois disso, seguir para:

- telas autorais de vitoria/derrota do `Bar Maneco Banguela`
- expansao do modelo da capa para outros bares
- telas autorais de resultado para os proximos bares

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
