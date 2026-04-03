# README.md

## Truco Game

Projeto de jogo de truco em TypeScript com foco em arquitetura modular, engine desacoplada e evolução incremental para uma experiência jogável com IA.

---

## Stack

* TypeScript
* Vite
* React
* Runtime: Browser

Planejado para o futuro:

* UI mais sofisticada
* possível uso de Three.js
* backend para ranking
* empacotamento mobile

---

## Variantes suportadas

* Truco Mineiro
* Truco Paulista

---

## Estrutura atual

```txt id="q615tv"
src/
  ai/
    chooseCard.ts
    trucoDecision.ts
    utils.ts

  game/
    card.ts
    compare.ts
    createHandState.ts
    deal.ts
    deck.ts
    gameState.ts
    getPlayerById.ts
    getRuleSet.ts
    handState.ts
    playAiTurn.ts
    playHand.ts
    playHumanCard.ts
    playMatch.ts
    playRound.ts
    rankOrder.ts
    resolveTrick.ts
    ruleSet.ts
    rulesMineiroRuleSet.ts
    rulesPaulistaRuleSet.ts
    stepHand.ts
    tableCard.ts
    teams.ts
    truco.ts
    turnOrder.ts
    variant.ts
    vira.ts

  utils/
    logger.ts

  App.tsx
  main.tsx
```

---

## Estado atual

### Engine

* [x] comparação de cartas
* [x] manilhas fixas
* [x] manilhas dinâmicas
* [x] vira
* [x] empate
* [x] times
* [x] rodada
* [x] mão
* [x] partida automática
* [x] suporte a Mineiro e Paulista

### IA

* [x] escolha de carta
* [x] lógica de parceiro
* [x] decisão básica de truco

### UI

* [x] escolha da variante
* [x] iniciar mão
* [x] jogador humano joga carta
* [x] IA joga passo a passo
* [x] resolução controlada da vaza
* [x] logs exibidos e copiáveis

---

## Filosofia do projeto

* não refatorar desnecessariamente
* preservar a engine atual
* evoluir incrementalmente
* separar bem lógica, IA e interface
* usar logs para auditoria

---

## Próximas prioridades

* truco interativo na UI
* melhorar legibilidade da mesa
* integrar múltiplas mãos na interface
* polir UX
