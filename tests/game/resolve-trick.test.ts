import test from "node:test"
import assert from "node:assert/strict"
import { resolveTrick } from "../../src/game/resolveTrick.ts"
import { createCard, createHandStateFixture } from "../helpers/gameFixtures.ts"

test("resolveTrick marca vencedor da vaza e encerra a mão ao fazer duas vazas", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    score: { A: 1, B: 0 },
    firstNonTieWinner: "A",
    currentPlayerId: 2,
    table: [
      { playerId: 2, card: createCard("K", "ouros") },
      { playerId: 3, card: createCard("4", "paus") },
      { playerId: 4, card: createCard("Q", "copas") },
      { playerId: 1, card: createCard("A", "espada") },
    ],
  })

  const nextState = resolveTrick(state)

  assert.equal(nextState.score.A, 2)
  assert.equal(nextState.finished, true)
  assert.equal(nextState.winner, "A")
  assert.deepEqual(nextState.table, [])
  assert.equal(nextState.currentPlayerId, 3)
})

test("resolveTrick mantém empate na vaza sem somar ponto", () => {
  const state = createHandStateFixture({
    table: [
      { playerId: 1, card: createCard("3", "copas") },
      { playerId: 2, card: createCard("3", "ouros") },
      { playerId: 3, card: createCard("Q", "espada") },
      { playerId: 4, card: createCard("K", "paus") },
    ],
  })

  const nextState = resolveTrick(state)

  assert.deepEqual(nextState.score, { A: 0, B: 0 })
  assert.equal(nextState.finished, false)
  assert.equal(nextState.roundNumber, 2)
})

test("resolveTrick usa o primeiro vencedor não empatado como critério na terceira vaza empatada", () => {
  const state = createHandStateFixture({
    roundNumber: 3,
    score: { A: 1, B: 1 },
    firstNonTieWinner: "A",
    currentPlayerId: 4,
    table: [
      { playerId: 1, card: createCard("3", "copas") },
      { playerId: 2, card: createCard("3", "ouros") },
      { playerId: 3, card: createCard("Q", "espada") },
      { playerId: 4, card: createCard("K", "paus") },
    ],
  })

  const nextState = resolveTrick(state)

  assert.equal(nextState.finished, true)
  assert.equal(nextState.winner, "A")
  assert.deepEqual(nextState.score, { A: 1, B: 1 })
})

test("resolveTrick usa o time do jogador mão quando todas as três vazas empatam", () => {
  const state = createHandStateFixture({
    roundNumber: 3,
    score: { A: 0, B: 0 },
    firstNonTieWinner: null,
    currentPlayerId: 2,
    table: [
      { playerId: 1, card: createCard("3", "copas") },
      { playerId: 2, card: createCard("3", "ouros") },
      { playerId: 3, card: createCard("Q", "espada") },
      { playerId: 4, card: createCard("K", "paus") },
    ],
  })

  const nextState = resolveTrick(state)

  assert.equal(nextState.finished, true)
  assert.equal(nextState.winner, "A")
  assert.deepEqual(nextState.score, { A: 0, B: 0 })
})
