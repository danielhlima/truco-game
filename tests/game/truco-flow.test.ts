import test from "node:test"
import assert from "node:assert/strict"
import { requestTruco } from "../../src/game/requestTruco.ts"
import { respondToTruco } from "../../src/game/respondToTruco.ts"
import { stepHand } from "../../src/game/stepHand.ts"
import { createHandStateFixture } from "../helpers/gameFixtures.ts"

test("requestTruco cria um pedido inicial valendo 3", () => {
  const state = createHandStateFixture()

  const nextState = requestTruco(state, 1)

  assert.equal(nextState.truco.phase, "awaiting-response")
  assert.equal(nextState.truco.requestedByTeam, "A")
  assert.equal(nextState.truco.awaitingResponseFromPlayerId, 2)
  assert.equal(nextState.truco.awaitingResponseFromTeam, "B")
  assert.equal(nextState.truco.proposedBet, 3)
})

test("time com 9 pontos não pode pedir truco", () => {
  const state = createHandStateFixture()

  const nextState = requestTruco(state, 1, {
    A: 9,
    B: 3,
  })

  assert.equal(nextState, state)
})

test("respondToTruco com accept atualiza a mão para o valor aceito", () => {
  const state = requestTruco(createHandStateFixture(), 1)

  const nextState = respondToTruco(state, "accept")

  assert.equal(nextState.currentBet, 3)
  assert.equal(nextState.truco.phase, "idle")
  assert.equal(nextState.truco.nextRaiseByTeam, "B")
  assert.equal(nextState.finished, false)
})

test("respondToTruco com run encerra a mão e dá a vitória ao time que pediu", () => {
  const state = requestTruco(createHandStateFixture(), 1)

  const nextState = respondToTruco(state, "run")

  assert.equal(nextState.finished, true)
  assert.equal(nextState.winner, "A")
  assert.equal(nextState.currentBet, 1)
  assert.equal(nextState.truco.phase, "idle")
})

test("respondToTruco com raise aceita o valor atual e propõe o próximo", () => {
  const state = requestTruco(createHandStateFixture(), 1)

  const nextState = respondToTruco(state, "raise")

  assert.equal(nextState.currentBet, 3)
  assert.equal(nextState.truco.phase, "awaiting-response")
  assert.equal(nextState.truco.requestedByPlayerId, 2)
  assert.equal(nextState.truco.requestedByTeam, "B")
  assert.equal(nextState.truco.awaitingResponseFromPlayerId, 1)
  assert.equal(nextState.truco.awaitingResponseFromTeam, "A")
  assert.equal(nextState.truco.proposedBet, 6)
})

test("stepHand permite que a IA aceite e peça aumento quando a mão for forte", () => {
  const state = createHandStateFixture({
    currentBet: 1,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 1,
      requestedByTeam: "A",
      awaitingResponseFromPlayerId: 2,
      awaitingResponseFromTeam: "B",
      proposedBet: 3,
    },
  })

  const nextState = stepHand(state)

  assert.equal(nextState.currentBet, 3)
  assert.equal(nextState.truco.phase, "awaiting-response")
  assert.equal(nextState.truco.requestedByPlayerId, 2)
  assert.equal(nextState.truco.requestedByTeam, "B")
  assert.equal(nextState.truco.awaitingResponseFromPlayerId, 1)
  assert.equal(nextState.truco.awaitingResponseFromTeam, "A")
  assert.equal(nextState.truco.proposedBet, 6)
})

test("stepHand não deixa a IA aumentar quando o time já tem 9 pontos", () => {
  const state = createHandStateFixture({
    currentBet: 1,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 1,
      requestedByTeam: "A",
      awaitingResponseFromPlayerId: 2,
      awaitingResponseFromTeam: "B",
      proposedBet: 3,
    },
  })

  const nextState = stepHand(
    state,
    {
      A: "balanced",
      B: "balanced",
    },
    { A: 3, B: 9 }
  )

  assert.equal(nextState.currentBet, 3)
  assert.equal(nextState.truco.phase, "idle")
  assert.equal(nextState.truco.nextRaiseByTeam, "B")
})

test("contra-aumento mantém a resposta com quem fez o pedido anterior", () => {
  const initialState = requestTruco(
    createHandStateFixture({
      currentPlayerId: 3,
    }),
    3
  )

  assert.equal(initialState.truco.requestedByPlayerId, 3)
  assert.equal(initialState.truco.awaitingResponseFromPlayerId, 4)

  const afterRaise = respondToTruco(initialState, "raise")

  assert.equal(afterRaise.truco.requestedByPlayerId, 4)
  assert.equal(afterRaise.truco.awaitingResponseFromPlayerId, 3)
  assert.equal(afterRaise.truco.awaitingResponseFromTeam, "A")
  assert.equal(afterRaise.truco.proposedBet, 6)
})

test("quando nosso time aumenta, a resposta volta para o adversário que pediu", () => {
  const state = requestTruco(
    createHandStateFixture({
      currentPlayerId: 2,
    }),
    2
  )

  assert.equal(state.truco.requestedByPlayerId, 2)
  assert.equal(state.truco.awaitingResponseFromPlayerId, 3)

  const afterRaise = respondToTruco(state, "raise")

  assert.equal(afterRaise.truco.requestedByPlayerId, 3)
  assert.equal(afterRaise.truco.awaitingResponseFromPlayerId, 2)
  assert.equal(afterRaise.truco.awaitingResponseFromTeam, "B")
  assert.equal(afterRaise.truco.proposedBet, 6)
})

test("stepHand resolve automaticamente contra-aumento quando a parceira foi quem pediu", () => {
  const state = createHandStateFixture({
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 4,
      requestedByTeam: "B",
      awaitingResponseFromPlayerId: 3,
      awaitingResponseFromTeam: "A",
      proposedBet: 6,
      promptKind: "raise",
    },
  })

  const nextState = stepHand(state)

  assert.notEqual(nextState, state)
  assert.equal(nextState.finished, false)
  assert.equal(nextState.truco.awaitingResponseFromTeam, "B")
  assert.equal(nextState.truco.awaitingResponseFromPlayerId, 4)
})

test("escalada completa permite sequência de truco até doze", () => {
  const initialState = requestTruco(createHandStateFixture(), 1)

  const afterSix = respondToTruco(initialState, "raise")
  assert.equal(afterSix.currentBet, 3)
  assert.equal(afterSix.truco.proposedBet, 6)

  const afterAcceptSix = respondToTruco(afterSix, "accept")
  assert.equal(afterAcceptSix.currentBet, 6)
  assert.equal(afterAcceptSix.truco.nextRaiseByTeam, "A")

  const requestNineState = requestTruco(
    createHandStateFixture({
      currentBet: afterAcceptSix.currentBet,
      currentPlayerId: 3,
      truco: afterAcceptSix.truco,
    }),
    3
  )
  assert.equal(requestNineState.truco.proposedBet, 9)

  const afterTwelve = respondToTruco(requestNineState, "raise")
  assert.equal(afterTwelve.currentBet, 9)
  assert.equal(afterTwelve.truco.proposedBet, 12)

  const afterAcceptTwelve = respondToTruco(afterTwelve, "accept")
  assert.equal(afterAcceptTwelve.currentBet, 12)
  assert.equal(afterAcceptTwelve.truco.phase, "idle")
})
