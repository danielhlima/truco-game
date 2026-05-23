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

## Estado do foco atual

A responsividade estrutural da gameplay foi estabilizada depois da capa do `Bar do Ze Catinga`.

Estado consolidado:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`
- capa autoral do `Bar do Ze Catinga` com HUD de estatisticas em placa propria
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
- tela de selecao de parceira aceita como pronta no estado atual
- parceira antes chamada `Ze Catinga` renomeada para `Joca do Busão` com id `joca-busao`
- tela de campanha do primeiro trecho (`Botecos da Rua`) usa arte autoral para o estado atual do `Bar do Ze Catinga`
- a arte de campanha fica em `src/assets/campaign/botecos-rua-ze-catinga.png`
- os botoes da campanha autoral sao areas HTML invisiveis sobre a imagem:
  - `VOLTAR`
  - `ENTRAR NO BAR`
  - `TROCAR PARCEIRA`
- a tela de campanha dinamica continua como fallback para outros bares/estados
- telas autorais de vitoria e derrota do `Bar do Ze Catinga`:
  - `src/assets/venues/ze-catinga/match-result-win.png`
  - `src/assets/venues/ze-catinga/match-result-loss.png`
- a tela de resultado so aparece depois da ultima carta visivel na mesa, com atraso de 1 segundo para leitura humana

## Prioridade imediata para o proximo chat

No proximo chat, expandir o modelo autoral da campanha para o proximo estado do percurso.

Proximo foco recomendado:

- gerar/implementar a arte de campanha quando o jogador estiver no `Bar Maneco Banguela`
- manter a abordagem de imagem autoral com hotspots HTML invisiveis
- preservar o fallback dinamico para estados ainda sem arte propria

Depois disso, seguir para:

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
