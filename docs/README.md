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

Neste momento, a gameplay screen esta considerada pronta por enquanto.

O foco ativo mudou para a capa do bar antes da partida:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`
- primeira capa autoral do `Bar do Ze Catinga`
- uso de assets proprios em `src/assets/venues/ze-catinga/`
- refinamento visual do HUD de estatisticas do bar
- ajuste da area de adversarios e dificuldade do desafio

## Prioridade imediata para o proximo chat

No proximo chat, continuar na capa do `Bar do Ze Catinga`.

Atacar primeiro:

- refinar o HUD de estatisticas do bar na coluna direita
- fazer `Dificuldade do desafio` aparecer abaixo dos adversarios
- impedir estouros de texto na lousa do dono e na placa `ENTRAR NO BAR`
- estabilizar o layout interno para variar menos quando a janela do navegador muda

Depois disso, seguir para:

- polimento final da capa do bar
- reaproveitamento do modelo para outros bares
- escolha de quais assets novos ficam para bares futuros

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
