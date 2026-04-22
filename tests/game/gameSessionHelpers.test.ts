import test from "node:test"
import assert from "node:assert/strict"
import {
  getFollowUpSpeechBubbleForTransition,
  getSpeechBubbleForTransition,
  getSpeechBetLabel,
} from "../../src/app/gameSessionHelpers.ts"
import { createHandStateFixture } from "../helpers/gameFixtures.ts"
import { requestTruco } from "../../src/game/requestTruco.ts"

test("aceite de contra-aumento no mesmo cabo de guerra usa TOMA de quem abriu o truco", () => {
  const previousState = createHandStateFixture({
    currentBet: 3,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 3,
      requestedByTeam: "A",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 2,
      awaitingResponseFromTeam: "B",
      proposedBet: 6,
      promptKind: "raise",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 6,
    truco: {
      phase: "idle",
      nextRaiseByTeam: "B",
    },
  })

  const bubble = getSpeechBubbleForTransition(previousState, nextState)

  assert.deepEqual(bubble, {
    playerId: 2,
    text: "TOMA!",
  })
})

test("aceite de pedido inicial mantém o locutor como quem recebeu o pedido", () => {
  const previousState = createHandStateFixture({
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 1,
      awaitingResponseFromTeam: "A",
      proposedBet: 3,
      promptKind: "request",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 3,
    truco: {
      phase: "idle",
      nextRaiseByTeam: "A",
    },
  })

  const bubble = getSpeechBubbleForTransition(previousState, nextState)

  assert.deepEqual(bubble, {
    playerId: 1,
    text: "DESCE!",
  })
})

test("aceite de pedido inicial não gera follow-up extra", () => {
  const previousState = createHandStateFixture({
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 1,
      awaitingResponseFromTeam: "A",
      proposedBet: 3,
      promptKind: "request",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 3,
    currentPlayerId: 2,
    truco: {
      phase: "idle",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      nextRaiseByTeam: "A",
    },
  })

  const bubble = getFollowUpSpeechBubbleForTransition(previousState, nextState)

  assert.equal(bubble, null)
})

test("aceite de contra-aumento no mesmo cabo de guerra não gera segundo balão", () => {
  const previousState = createHandStateFixture({
    currentBet: 3,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 3,
      requestedByTeam: "A",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 2,
      awaitingResponseFromTeam: "B",
      proposedBet: 6,
      promptKind: "raise",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 6,
    truco: {
      phase: "idle",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      nextRaiseByTeam: "B",
    },
  })

  const bubble = getFollowUpSpeechBubbleForTransition(previousState, nextState)

  assert.equal(bubble, null)
})

test("pedido posterior após retomada da jogada reinicia a escalada vigente", () => {
  const state = createHandStateFixture({
    currentBet: 3,
    currentPlayerId: 3,
    truco: {
      phase: "idle",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      nextRaiseByTeam: "A",
    },
  })

  const nextState = requestTruco(state, 3)

  assert.equal(nextState.truco.requestedByPlayerId, 3)
  assert.equal(nextState.truco.initialRequestedByPlayerId, 3)
  assert.equal(nextState.truco.initialRequestedByTeam, "A")
})

test("aceite de nove em nova escalada usa DESCE de quem responde", () => {
  const previousState = createHandStateFixture({
    currentBet: 6,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 3,
      awaitingResponseFromTeam: "A",
      proposedBet: 9,
      promptKind: "request",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 9,
    truco: {
      phase: "idle",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      nextRaiseByTeam: "A",
    },
  })

  const primary = getSpeechBubbleForTransition(previousState, nextState)
  const followUp = getFollowUpSpeechBubbleForTransition(previousState, nextState)

  assert.deepEqual(primary, {
    playerId: 3,
    text: "DESCE!",
  })
  assert.equal(followUp, null)
})

test("aceite de doze pelo iniciador da escalada vigente usa TOMA", () => {
  const previousState = createHandStateFixture({
    currentBet: 9,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 3,
      requestedByTeam: "A",
      initialRequestedByPlayerId: 4,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 4,
      awaitingResponseFromTeam: "B",
      proposedBet: 12,
      promptKind: "raise",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 12,
    truco: {
      phase: "idle",
      initialRequestedByPlayerId: 4,
      initialRequestedByTeam: "B",
      nextRaiseByTeam: "B",
    },
  })

  const primary = getSpeechBubbleForTransition(previousState, nextState)
  const followUp = getFollowUpSpeechBubbleForTransition(previousState, nextState)

  assert.deepEqual(primary, {
    playerId: 4,
    text: "TOMA!",
  })
  assert.equal(followUp, null)
})

test("seis pedido em nova escalada usa DESCE de quem aceitou", () => {
  const previousState = createHandStateFixture({
    currentBet: 3,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 3,
      requestedByTeam: "A",
      initialRequestedByPlayerId: 3,
      initialRequestedByTeam: "A",
      awaitingResponseFromPlayerId: 2,
      awaitingResponseFromTeam: "B",
      proposedBet: 6,
      promptKind: "request",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 6,
    truco: {
      phase: "idle",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      nextRaiseByTeam: "B",
    },
  })

  const primary = getSpeechBubbleForTransition(previousState, nextState)
  const followUp = getFollowUpSpeechBubbleForTransition(previousState, nextState)

  assert.deepEqual(primary, {
    playerId: 2,
    text: "DESCE!",
  })
  assert.equal(followUp, null)
})

test("pedidos de truco e raises usam a fala e o emissor corretos", () => {
  const cases = [
    { requestedByPlayerId: 1, proposedBet: 3, expectedText: "TRUCO!" },
    { requestedByPlayerId: 3, proposedBet: 6, expectedText: "SEIS!" },
    { requestedByPlayerId: 2, proposedBet: 9, expectedText: "NOVE!" },
    { requestedByPlayerId: 4, proposedBet: 12, expectedText: "DOZE!" },
  ] as const

  for (const { requestedByPlayerId, proposedBet, expectedText } of cases) {
    const previousState = createHandStateFixture()
    const nextState = createHandStateFixture({
      truco: {
        phase: "awaiting-response",
        requestedByPlayerId,
        requestedByTeam: requestedByPlayerId % 2 === 1 ? "A" : "B",
        initialRequestedByPlayerId: requestedByPlayerId,
        initialRequestedByTeam: requestedByPlayerId % 2 === 1 ? "A" : "B",
        awaitingResponseFromPlayerId: requestedByPlayerId === 4 ? 1 : requestedByPlayerId + 1,
        awaitingResponseFromTeam: requestedByPlayerId % 2 === 1 ? "B" : "A",
        proposedBet,
        promptKind: proposedBet === 3 ? "request" : "raise",
      },
    })

    assert.deepEqual(getSpeechBubbleForTransition(previousState, nextState), {
      playerId: requestedByPlayerId,
      text: expectedText,
    })
  }
})

test("corrida usa TÔ FORA no balão do respondente", () => {
  const previousState = createHandStateFixture({
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 2,
      initialRequestedByTeam: "B",
      awaitingResponseFromPlayerId: 1,
      awaitingResponseFromTeam: "A",
      proposedBet: 3,
      promptKind: "request",
    },
  })

  const nextState = createHandStateFixture({
    finished: true,
    winner: "B",
    truco: {
      phase: "idle",
    },
  })

  assert.deepEqual(getSpeechBubbleForTransition(previousState, nextState), {
    playerId: 1,
    text: "TÔ FORA!",
  })
})

test("rótulos de fala cobrem a escada oficial até doze", () => {
  assert.equal(getSpeechBetLabel(3), "TRUCO!")
  assert.equal(getSpeechBetLabel(6), "SEIS!")
  assert.equal(getSpeechBetLabel(9), "NOVE!")
  assert.equal(getSpeechBetLabel(12), "DOZE!")
})
