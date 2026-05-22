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
- telas autorais de vitoria e derrota do `Bar do Ze Catinga`:
  - `src/assets/venues/ze-catinga/match-result-win.png`
  - `src/assets/venues/ze-catinga/match-result-loss.png`

## Prioridade imediata para o proximo chat

No proximo chat, revisar a tela de selecao de parceira dentro da moldura em landscape.

Proximo foco recomendado:

- validar a selecao em tamanhos representativos do stage
- melhorar UX, narrativa e hierarquia da escolha sem quebrar persistencia por bar
- manter o fluxo `capa do bar > escolha de parceira se necessario > jogo`

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
