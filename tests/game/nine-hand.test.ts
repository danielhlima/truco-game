import test from "node:test"
import assert from "node:assert/strict"
import { applyCompletedHandToMatch, createMatchState } from "../../src/game/matchState.ts"
import { applyNineHandRules, decideNineHand } from "../../src/game/nineHand.ts"
import { requestTruco } from "../../src/game/requestTruco.ts"
import { createHandStateFixture } from "../helpers/gameFixtures.ts"

test("mão de 9 começa pausada para decisão e valendo 3", () => {
  const state = applyNineHandRules(createHandStateFixture(), { A: 9, B: 4 })

  assert.deepEqual(state.nineHand, { team: "A", phase: "awaiting-decision" })
  assert.equal(state.currentBet, 3)
})

test("mão de 9 também dispara se o time passa direto para 10 ou 11 pontos", () => {
  const state = applyNineHandRules(createHandStateFixture(), { A: 10, B: 4 })

  assert.deepEqual(state.nineHand, { team: "A", phase: "awaiting-decision" })
  assert.equal(state.currentBet, 3)
})

test("mão de 9 não dispara para time que já fechou 12 pontos", () => {
  const state = applyNineHandRules(createHandStateFixture(), { A: 12, B: 4 })

  assert.equal(state.nineHand, undefined)
  assert.equal(state.currentBet, 1)
})

test("desistir na mão de 9 dá 1 ponto aos adversários", () => {
  const matchState = {
    ...createMatchState("MINEIRO", 1),
    score: { A: 9, B: 4 },
  }
  const state = applyNineHandRules(createHandStateFixture(), matchState.score)

  const folded = decideNineHand(state, "fold")
  const nextMatchState = applyCompletedHandToMatch(matchState, folded)

  assert.equal(folded.finished, true)
  assert.equal(folded.winner, "B")
  assert.equal(folded.currentBet, 1)
  assert.deepEqual(nextMatchState.score, { A: 9, B: 5 })
})

test("jogar a mão de 9 mantém a mão valendo 3", () => {
  const state = applyNineHandRules(createHandStateFixture(), { A: 9, B: 4 })

  const playing = decideNineHand(state, "play")

  assert.deepEqual(playing.nineHand, { team: "A", phase: "playing" })
  assert.equal(playing.finished, false)
  assert.equal(playing.currentBet, 3)
})

test("perder depois de jogar a mão de 9 dá 3 pontos aos adversários", () => {
  const matchState = {
    ...createMatchState("MINEIRO", 1),
    score: { A: 9, B: 4 },
  }
  const state = decideNineHand(
    applyNineHandRules(createHandStateFixture(), matchState.score),
    "play"
  )

  const lost = {
    ...state,
    finished: true,
    winner: "B" as const,
  }
  const nextMatchState = applyCompletedHandToMatch(matchState, lost)

  assert.deepEqual(nextMatchState.score, { A: 9, B: 7 })
})

test("não é possível pedir truco na mão de 9", () => {
  const state = decideNineHand(
    applyNineHandRules(createHandStateFixture({ currentPlayerId: 1 }), { A: 9, B: 4 }),
    "play"
  )

  const nextState = requestTruco(state, 1, { A: 9, B: 4 })

  assert.equal(nextState, state)
  assert.equal(nextState.truco.phase, "idle")
})
