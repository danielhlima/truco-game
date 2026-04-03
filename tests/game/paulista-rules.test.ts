import test from "node:test"
import assert from "node:assert/strict"
import { createHandState } from "../../src/game/createHandState.ts"
import { compareCards } from "../../src/game/compare.ts"
import { getRuleSet } from "../../src/game/getRuleSet.ts"
import { resolveTrick } from "../../src/game/resolveTrick.ts"
import { createCard, createHandStateFixture } from "../helpers/gameFixtures.ts"

test("createHandState em paulista sempre define vira", () => {
  const handState = createHandState("PAULISTA", 1)

  assert.ok(handState.vira)
})

test("createHandState em mineiro não define vira", () => {
  const handState = createHandState("MINEIRO", 1)

  assert.equal(handState.vira, undefined)
})

test("regra paulista identifica a manilha pela próxima carta da vira", () => {
  const ruleSet = getRuleSet("PAULISTA")
  const vira = createCard("Q", "copas")

  assert.equal(ruleSet.isManilha(createCard("J", "ouros"), vira), 0)
  assert.equal(ruleSet.isManilha(createCard("J", "espada"), vira), 1)
  assert.equal(ruleSet.isManilha(createCard("J", "copas"), vira), 2)
  assert.equal(ruleSet.isManilha(createCard("J", "paus"), vira), 3)
  assert.equal(ruleSet.isManilha(createCard("Q", "paus"), vira), -1)
})

test("compareCards em paulista faz manilha vencer carta alta comum", () => {
  const ruleSet = getRuleSet("PAULISTA")
  const vira = createCard("A", "copas")
  const manilha = createCard("2", "ouros")
  const highNonManilha = createCard("3", "paus")

  assert.equal(compareCards(ruleSet, manilha, highNonManilha, vira), 1)
  assert.equal(compareCards(ruleSet, highNonManilha, manilha, vira), -1)
})

test("compareCards em paulista respeita a ordem de naipes da manilha", () => {
  const ruleSet = getRuleSet("PAULISTA")
  const vira = createCard("Q", "copas")
  const manilhaOuros = createCard("J", "ouros")
  const manilhaEspada = createCard("J", "espada")
  const manilhaCopas = createCard("J", "copas")
  const manilhaPaus = createCard("J", "paus")

  assert.equal(compareCards(ruleSet, manilhaEspada, manilhaOuros, vira), 1)
  assert.equal(compareCards(ruleSet, manilhaCopas, manilhaEspada, vira), 1)
  assert.equal(compareCards(ruleSet, manilhaPaus, manilhaCopas, vira), 1)
})

test("resolveTrick em paulista usa a manilha dinâmica para definir a vaza", () => {
  const handState = createHandStateFixture(
    {
      variant: "PAULISTA",
      vira: createCard("Q", "copas"),
      table: [
        { playerId: 1, card: createCard("3", "copas") },
        { playerId: 2, card: createCard("J", "ouros") },
        { playerId: 3, card: createCard("2", "paus") },
        { playerId: 4, card: createCard("A", "espada") },
      ],
      currentPlayerId: 1,
    },
    "PAULISTA"
  )

  const resolved = resolveTrick(handState)

  assert.equal(resolved.score.A, 0)
  assert.equal(resolved.score.B, 1)
  assert.equal(resolved.currentPlayerId, 2)
  assert.equal(resolved.firstNonTieWinner, "B")
  assert.equal(resolved.table.length, 0)
})

test("resolveTrick em paulista escolhe a maior manilha quando mais de uma aparece", () => {
  const handState = createHandStateFixture(
    {
      variant: "PAULISTA",
      vira: createCard("Q", "ouros"),
      table: [
        { playerId: 1, card: createCard("J", "copas") },
        { playerId: 2, card: createCard("J", "ouros") },
        { playerId: 3, card: createCard("7", "paus") },
        { playerId: 4, card: createCard("J", "paus") },
      ],
      currentPlayerId: 1,
    },
    "PAULISTA"
  )

  const resolved = resolveTrick(handState)

  assert.equal(resolved.score.A, 0)
  assert.equal(resolved.score.B, 1)
  assert.equal(resolved.currentPlayerId, 4)
  assert.equal(resolved.firstNonTieWinner, "B")
})

test("resolveTrick em paulista ainda encerra a mão ao fazer duas vazas", () => {
  const handState = createHandStateFixture(
    {
      variant: "PAULISTA",
      vira: createCard("A", "espada"),
      roundNumber: 2,
      score: { A: 1, B: 0 },
      firstNonTieWinner: "A",
      table: [
        { playerId: 1, card: createCard("2", "paus") },
        { playerId: 2, card: createCard("3", "copas") },
        { playerId: 3, card: createCard("K", "ouros") },
        { playerId: 4, card: createCard("Q", "espada") },
      ],
      currentPlayerId: 1,
    },
    "PAULISTA"
  )

  const resolved = resolveTrick(handState)

  assert.equal(resolved.finished, true)
  assert.equal(resolved.winner, "A")
  assert.deepEqual(resolved.score, { A: 2, B: 0 })
})
