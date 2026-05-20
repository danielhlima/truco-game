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

A capa do `Bar do Ze Catinga` foi refinada e salva no Git.

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

## Prioridade imediata para o proximo chat

No proximo chat, estabilizar a responsividade da gameplay screen.

Problema observado em video:

- quando a janela do navegador muda de tamanho, os elementos dentro da moldura de celular em landscape refluem e ficam baguncados
- o problema parece vir de uma mistura de medidas responsivas internas (`vw`, `dvh`, `clamp`, transforms e grids fluidos)
- a gameplay deve se comportar mais como um stage de jogo escalado do que como uma pagina web que reflowa continuamente

Proximo foco recomendado:

- fixar uma resolucao logica da gameplay
- escalar a tela inteira como uma unidade
- permitir letterbox/pillarbox quando a proporcao do device for diferente
- reduzir dependencia de `vw`/`dvh` dentro da gameplay
- manter no maximo 2 ou 3 modos internos controlados (`regular`, `compact`, `tiny`)

Depois disso, seguir para:

- revisao responsiva da tela de selecao de parceira
- expansao do modelo da capa para outros bares

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
