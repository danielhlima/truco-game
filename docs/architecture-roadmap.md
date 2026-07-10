# Architecture Roadmap

## Objetivo

Evoluir o jogo atual de truco para uma experiencia mobile com:

- campanha progressiva
- identidade visual crescente
- parceiro IA e dupla adversária IA
- Modo Livre pós-campanha
- regras de truco cada vez mais completas
- ranking online
- monetização pouco intrusiva

## Camadas

### `src/game`

Motor do truco:

- regras
- mão
- vaza
- turno
- truco
- escolha de carta da IA
- variantes Mineiro/Paulista

Essa camada deve continuar independente de UI, economia e monetização.

### `src/career`

Meta-jogo:

- estágios da campanha
- botecos e campeonatos
- progressão por tiers
- cenas de introdução e encerramento
- curva de dificuldade
- Modo Livre pós-campanha por circuito

### `src/profile`

Estado persistente do jogador:

- progresso da campanha
- vitórias e derrotas
- itens desbloqueados
- preferências de mesa/tema

### `src/economy`

Pronta para monetização futura:

- moedas
- recompensas
- itens desbloqueáveis
- catálogo de loja

### Futuras camadas

- `src/presentation`
- `src/platform`
- `src/monetization`

## Estrutura da campanha

O conteúdo foi pensado para aceitar quantidades variáveis de partidas por tier:

1. Rua
2. Bairro
3. Zonas da cidade
4. Cidade
5. Estado
6. Nacional
7. Panamericano
8. Jogos Mundiais
9. Mundial
10. Intergaláctico

Estado atual relevante:

- caminho principal integrado visualmente até `Cassino Mé Maior`
- bônus `Circuito Intergaláctico` / `Órbita da Lua` integrado
- `Modo Livre` pós-campanha validado
- `Jogos Mundiais` e `Mundial` usam Truco Mineiro
- primeira rodada de IA validada em jogo real
- próximos passos de regra devem focar carta virada para baixo/carta coberta

## Próxima Regra De Motor

Carta virada para baixo/carta coberta:

- disponível a partir da segunda vaza da mão
- não disputa a vaza
- não revela identidade durante a partida
- precisa ser modelada no estado antes da UI
- precisa de testes de motor, IA, logs e fluxo humano

## Diretriz de monetização

Monetização futura deve ficar fora do motor da partida.

Prioridades:

- cosméticos
- recompensas opcionais por anúncio
- remoção de anúncios
- expansões/campanhas extras

Evitar:

- pay-to-win
- bônus que alterem a justiça do truco
