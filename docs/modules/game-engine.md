# Game Engine Module

## Responsabilidade

Gerenciar toda a lógica do jogo de truco:

* regras
* fluxo
* estado
* pontuação

---

## Componentes

### Modelos

* `card.ts`

  * Suit
  * Rank
  * Card

---

### Baralho

* `deck.ts`
* `deal.ts`

---

### Regras

* `rulesMineiro.ts`

  * manilhas fixas

---

### Comparação

* `compare.ts`

  * comparação de cartas
  * suporte a empate

---

### Turnos

* `turnOrder.ts`

  * rotação de jogadores

---

### Times

* `teams.ts`

  * definição de duplas

---

### Execução

* `playRound.ts`

  * execução de uma vaza
  * integração com IA
  * detecção de empate

* `playHand.ts`

  * execução de uma mão
  * controle de aposta
  * resolução de empate
  * controle de vazas

* `playMatch.ts`

  * controle da partida completa
  * rotação de jogador mão
  * pontuação até 12

---

### Truco

* `truco.ts`

  * definição de valores de aposta
  * progressão (1→12)

---

## IA

* `chooseCard.ts`

  * decisão de carta
  * considera parceiro

* `trucoDecision.ts`

  * decisão de aposta
  * heurística de força de mão

---

## Fluxo do jogo

1. `playMatch()`
2. loop de mãos
3. `playHand(startingPlayer)`
4. até 3 vazas
5. `playRound()`
6. `compareCards()`
7. definição de vencedor

---

## Características

* Funções puras
* Sem dependência de UI
* Determinístico (exceto shuffle)
* Testável via logs

---

## Limitações

* IA simplificada
* Apenas truco mineiro
* Sem interface gráfica

---

## Próximas evoluções

* RuleSet (Mineiro vs Paulista)
* IA avançada
* UI (React + Three.js)
* Backend

---

## Observação de design

A engine foi projetada para:

* reutilização (backend/multiplayer)
* testes unitários
* independência de renderização
