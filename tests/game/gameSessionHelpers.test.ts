import test from "node:test"
import assert from "node:assert/strict"
import {
  getFollowUpSpeechBubbleForTransition,
  getSpeechBubbleForTransition,
} from "../../src/app/gameSessionHelpers.ts"
import { createHandStateFixture } from "../helpers/gameFixtures.ts"
import { requestTruco } from "../../src/game/requestTruco.ts"

test("aceite de contra-aumento pelo autor do truco usa TOMA como fala principal", () => {
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

test("aceite de pedido inicial gera TOMA como follow-up de quem abriu o truco", () => {
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

  assert.deepEqual(bubble, {
    playerId: 2,
    text: "TOMA!",
  })
})

test("aceite de contra-aumento pelo autor do truco não gera TOMA duplicado no follow-up", () => {
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

test("pedido posterior de seis preserva quem falou truco como origem da sequência", () => {
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
  assert.equal(nextState.truco.initialRequestedByPlayerId, 2)
  assert.equal(nextState.truco.initialRequestedByTeam, "B")
})

test("aceite de nove após seis posterior gera TOMA para quem falou truco original", () => {
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
      promptKind: "raise",
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
  assert.deepEqual(followUp, {
    playerId: 2,
    text: "TOMA!",
  })
})

test("aceite de doze após truco iniciado pelo jogador 4 usa TOMA do jogador 4", () => {
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
