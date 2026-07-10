# Game Engine Module

## Responsabilidade

Gerenciar toda a lógica do jogo de truco:

* regras
* fluxo
* estado
* pontuação

---

## Componentes Atuais

### Modelos

* `card.ts`
* `handState.ts`
* `matchState.ts`

  * Suit
  * Rank
  * Card
  * estado de mão
  * estado de partida

---

### Baralho

* `deck.ts`
* `deal.ts`

---

### Regras

* `rulesMineiroRuleSet.ts`
* `rulesPaulistaRuleSet.ts`
* `getRuleSet.ts`

  * manilhas fixas
  * manilha dinâmica por vira
  * seleção de regra por variante

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

* `playHumanCard.ts`
* `playAiTurn.ts`
* `stepHand.ts`
* `resolveTrick.ts`

  * execução de uma vaza
  * integração com IA
  * detecção de empate
  * execução automática de passos da mão
  * resolução de mão e rotação

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
  * descarta a menor carta quando não consegue ganhar a vaza
  * usa a menor carta vencedora quando consegue ganhar

* `trucoDecision.ts`
* `trucoPersonalities.ts`

  * decisão de aposta
  * heurística de força de mão
  * perfis de risco, blefe e disciplina

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

## Limitações / Próximas Regras

* Carta virada para baixo/carta coberta ainda não implementada.
* Mão especial de 9/dez pontos ainda não implementada.
* Ponto acima ainda depende de decisão de produto.
* A camada deve continuar independente de UI, campanha, economia e monetização.

---

## Próximas evoluções

* Modelar carta coberta no estado da mão.
* Garantir que carta coberta não vença vaza e não revele identidade.
* Permitir carta coberta a partir da segunda vaza.
* Cobrir a regra com testes antes de ligar UI mobile.
* Evoluir IA apenas quando testes em jogo apontarem comportamento ruim.

---

## Observação de design

A engine foi projetada para:

* reutilização (backend/multiplayer)
* testes unitários
* independência de renderização
