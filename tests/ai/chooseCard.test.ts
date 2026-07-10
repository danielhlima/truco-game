import assert from "node:assert/strict"
import test from "node:test"
import { chooseCard } from "../../src/ai/chooseCard.ts"
import { getRuleSet } from "../../src/game/getRuleSet.ts"
import { createCard } from "../helpers/gameFixtures.ts"

test("IA não queima copilha depois do zap no Mineiro quando não pode ganhar a vaza", () => {
  const table = [
    { playerId: 1, card: createCard("Q", "espada") },
    { playerId: 2, card: createCard("2", "espada") },
    { playerId: 3, card: createCard("4", "paus") },
  ]
  const hand = [
    createCard("7", "copas"),
    createCard("3", "copas"),
    createCard("6", "paus"),
  ]

  assert.deepEqual(chooseCard(getRuleSet("MINEIRO"), 4, hand, table), createCard("6", "paus"))
})

test("IA descarta a menor carta quando a parceira já está ganhando no Paulista", () => {
  const table = [
    { playerId: 1, card: createCard("Q", "espada") },
    { playerId: 2, card: createCard("2", "espada") },
    { playerId: 3, card: createCard("4", "paus") },
  ]
  const hand = [
    createCard("7", "copas"),
    createCard("3", "copas"),
    createCard("6", "paus"),
  ]

  assert.deepEqual(
    chooseCard(getRuleSet("PAULISTA"), 4, hand, table, createCard("5", "ouros")),
    createCard("7", "copas")
  )
})
