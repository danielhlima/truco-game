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

O foco ativo mudou para:

- tela de selecao de personagens / parceira IA
- uso do roster em `src/content/characters.ts`
- continuidade da interface ja iniciada dentro do proprio menu inicial
- estabilidade do fluxo de dialogo de `truco + raise`

## Prioridade imediata para o proximo chat

No proximo chat, comecar por:

- implementar ou reforcar testes unitarios para os fluxos de `truco + raise`
- cobrir especialmente:
  - falas `TRUCO!/SEIS!/NOVE!/DOZE!`
  - falas `DESCE!/TOMA!/TO FORA!`
  - consultas da parceira
  - regra da escalada vigente

Depois disso, seguir para:

- UX da escolha de parceira com mais contexto do bar
- estabilizacao visual/UX do truco
- identidade narrativa dos bares

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
