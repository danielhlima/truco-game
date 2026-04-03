# Architecture Roadmap

## Objetivo

Evoluir o protótipo atual de truco para um jogo mobile com:

- campanha progressiva
- identidade visual crescente
- parceiro IA e dupla adversária IA
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

Essa camada deve continuar independente de UI, economia e monetização.

### `src/career`

Meta-jogo:

- estágios da campanha
- botecos e campeonatos
- progressão por tiers
- cenas de introdução e encerramento
- curva de dificuldade

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
