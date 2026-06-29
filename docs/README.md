# Documentacao do Projeto

## Ordem de leitura obrigatoria

Para continuar o projeto em qualquer chat novo do Codex, leia nesta ordem:

1. `docs/CONTENT.md`
2. `docs/LAYOUT_RULES.md`
3. `docs/TRUCO_RULES.md`
4. `docs/IMAGE_PROMPT_STANDARDS.md`
5. `docs/NEXT_STEPS.md`
6. `docs/CAMPAIGN_PATH.md`
7. `docs/NEXT_CHAT_PROMPT.md`

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

### `docs/IMAGE_PROMPT_STANDARDS.md`

Define os padroes de prompts de imagem que funcionaram melhor:

- estrutura obrigatoria para prompts de mesa, background, host, campanha e resultado
- restricoes negativas para evitar artes inutilizaveis
- lembrete de que mesa de gameplay nao pode ter fundo/cenario
- direcao visual por tipo de asset e orientacoes para o proximo pacote bonus

### `docs/CAMPAIGN_PATH.md`

Registra a expansao vertical da campanha:

- tabela simples do caminho principal
- dupla adversaria fixa, variante e dificuldade por bar
- estado visual minimo aceito antes do polimento autoral

### `docs/NEXT_CHAT_PROMPT.md`

Entrega um prompt pronto para abrir um chat novo:

- arquivos que devem ser lidos primeiro
- estado atual da campanha principal
- objetivo do proximo chat
- restricoes criativas do nivel bonus
- pendencias de regras e produto que devem ser tratadas depois dos prompts/assets

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
- a tela de campanha dinamica continua como fallback para outros bares/estados
- tela inicial definitiva com arte propria:
  - `src/assets/start/truco-raiz-start.png`
  - botao `COMEÇAR` como hotspot HTML invisivel sobre a placa da arte
  - debug, reset e seletor de variante removidos da primeira tela visivel
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
- caminho principal da campanha agora tem pacote visual autoral integrado ate o `Cassino Mé Maior`:
  - `Centro de Convenções da Prefeitura`
  - `Ginásio Estadual Maneco Filé`
  - `Arena Nacional`
  - `Centro Americano Truqueiro de Medelin`
  - `Hotel Truco de Segóvia, Espanha`
  - `Cassino Mé Maior`
- os pacotes recentes incluem campanha, background de gameplay, host, mesa, vitoria/derrota normal e conquistas definitivas de local/circuito

## Prioridade imediata para o proximo chat

No proximo chat, retomar pelo conteudo bonus pos-campanha.

Proximo foco recomendado:

- usar `docs/NEXT_CHAT_PROMPT.md` como briefing inicial copiavel
- gerar primeiro os prompts do nivel bonus `Circuito Intergaláctico` / `Órbita da Lua`
- alem dos 8 assets de costume, gerar tambem prompts para imagens pequenas dos adversarios do bonus
- manter a direcao bonus divertida, cosmica, autoral e truqueira, sem monstros, ETs assustadores, horror, gore ou criaturas grotescas
- nao implementar assets antes de o usuario trazer as imagens aprovadas
- depois dos prompts/assets do bonus, retomar pendencias de produto e regra:
  - ver cartas na mao especial de 9/dez pontos, confirmando a nomenclatura desejada antes de implementar
  - opcao para escolher ou nao a variante `ponto acima`
  - tutorial jogavel
  - aplicacao efetiva das variantes Mineiro/Paulista
  - carta virada para baixo na segunda e terceira vazas

Depois disso, seguir para:

- integracao do pacote bonus aprovado
- testes de progressao pos-campanha
- refinamento de regras, tutorial e escolhas de variante

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
