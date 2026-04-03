import test from "node:test"
import assert from "node:assert/strict"
import {
  applyCompletedHandToMatch,
  createMatchState,
  getNextStartingPlayerId,
} from "../../src/game/matchState.ts"

test("applyCompletedHandToMatch soma os pontos da mão e avança a próxima mão", () => {
  const matchState = createMatchState("MINEIRO", 1)

  const nextState = applyCompletedHandToMatch(matchState, {
    finished: true,
    winner: "A",
    currentBet: 3,
  })

  assert.deepEqual(nextState.score, { A: 3, B: 0 })
  assert.equal(nextState.handNumber, 2)
  assert.equal(nextState.startingPlayerId, 2)
  assert.equal(nextState.finished, false)
})

test("applyCompletedHandToMatch encerra a partida quando chega a 12 pontos", () => {
  const matchState = {
    ...createMatchState("PAULISTA", 3),
    score: { A: 6, B: 11 },
    handNumber: 4,
  }

  const nextState = applyCompletedHandToMatch(matchState, {
    finished: true,
    winner: "B",
    currentBet: 3,
  })

  assert.deepEqual(nextState.score, { A: 6, B: 12 })
  assert.equal(nextState.finished, true)
  assert.equal(nextState.winner, "B")
  assert.equal(nextState.handNumber, 4)
})

test("getNextStartingPlayerId rotaciona do jogador 4 para o 1", () => {
  assert.equal(getNextStartingPlayerId(4), 1)
  assert.equal(getNextStartingPlayerId(2), 3)
})
