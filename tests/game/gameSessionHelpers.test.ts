import test from "node:test"
import assert from "node:assert/strict"
import {
  getFollowUpSpeechBubbleForTransition,
  getSpeechBubbleForTransition,
  getSpeechBetLabel,
  shouldPartnerConsultHuman,
} from "../../src/app/gameSessionHelpers.ts"
import { createHandStateFixture } from "../helpers/gameFixtures.ts"
import { requestTruco } from "../../src/game/requestTruco.ts"
import { respondToTruco } from "../../src/game/respondToTruco.ts"
import { stepHand } from "../../src/game/stepHand.ts"

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

test("aceite da parceira após consulta ao humano usa TOMA quando ela iniciou a escalada vigente", () => {
  const previousState = createHandStateFixture({
    currentBet: 9,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 3,
      initialRequestedByTeam: "A",
      awaitingResponseFromPlayerId: 3,
      awaitingResponseFromTeam: "A",
      proposedBet: 12,
      promptKind: "raise",
    },
  })

  const nextState = createHandStateFixture({
    currentBet: 12,
    truco: {
      phase: "idle",
      nextRaiseByTeam: "A",
    },
  })

  assert.deepEqual(getSpeechBubbleForTransition(previousState, nextState), {
    playerId: 3,
    text: "TOMA!",
  })
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

test("parceira só consulta o humano no pedido inicial adversário", () => {
  const initialRequestOnPartner = createHandStateFixture({
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      awaitingResponseFromPlayerId: 3,
      awaitingResponseFromTeam: "A",
      proposedBet: 3,
      promptKind: "request",
    },
  })

  const raiseAgainstPartnerAfterOurTruco = createHandStateFixture({
    currentBet: 3,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: 2,
      requestedByTeam: "B",
      initialRequestedByPlayerId: 3,
      initialRequestedByTeam: "A",
      awaitingResponseFromPlayerId: 3,
      awaitingResponseFromTeam: "A",
      proposedBet: 6,
      promptKind: "raise",
    },
  })

  const raiseAfterHumanAlreadyBackedPartner = createHandStateFixture({
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

  assert.equal(shouldPartnerConsultHuman(initialRequestOnPartner), true)
  assert.equal(shouldPartnerConsultHuman(raiseAgainstPartnerAfterOurTruco), false)
  assert.equal(shouldPartnerConsultHuman(raiseAfterHumanAlreadyBackedPartner), false)
})

test("parceira que abriu o truco responde ao seis sem nova consulta e fala NOVE", () => {
  const initialRequest = requestTruco(
    createHandStateFixture({
      currentPlayerId: 3,
      players: [
        { id: 1, hand: [] },
        {
          id: 2,
          hand: [
            { rank: "4", suit: "copas" },
            { rank: "5", suit: "ouros" },
            { rank: "6", suit: "paus" },
          ],
        },
        {
          id: 3,
          hand: [
            { rank: "3", suit: "copas" },
            { rank: "2", suit: "paus" },
            { rank: "A", suit: "espada" },
          ],
        },
        { id: 4, hand: [] },
      ],
    }),
    3
  )

  const sixFromOpponent = respondToTruco(initialRequest, "raise")
  const nextState = stepHand(sixFromOpponent, {
    A: "balanced",
    B: "conservative",
  })

  assert.equal(shouldPartnerConsultHuman(sixFromOpponent), false)
  assert.equal(nextState.truco.phase, "awaiting-response")
  assert.equal(nextState.truco.requestedByPlayerId, 3)
  assert.equal(nextState.truco.awaitingResponseFromPlayerId, 4)
  assert.equal(nextState.truco.proposedBet, 9)
  assert.deepEqual(getSpeechBubbleForTransition(sixFromOpponent, nextState), {
    playerId: 3,
    text: "NOVE!",
  })
})

test("parceira não consulta de novo após BORA anterior e responde ao nove com DOZE", () => {
  const adversaryTruco = requestTruco(
    createHandStateFixture({
      currentPlayerId: 2,
      players: [
        {
          id: 1,
          hand: [
            { rank: "3", suit: "copas" },
            { rank: "2", suit: "ouros" },
            { rank: "A", suit: "paus" },
          ],
        },
        { id: 2, hand: [] },
        {
          id: 3,
          hand: [
            { rank: "3", suit: "espada" },
            { rank: "2", suit: "paus" },
            { rank: "A", suit: "copas" },
          ],
        },
        { id: 4, hand: [] },
      ],
    }),
    2
  )

  const sixFromPartner = respondToTruco(adversaryTruco, "raise")
  const nineFromOpponent = respondToTruco(sixFromPartner, "raise")
  const nextState = stepHand(nineFromOpponent, {
    A: "balanced",
    B: "conservative",
  })

  assert.equal(shouldPartnerConsultHuman(adversaryTruco), true)
  assert.equal(shouldPartnerConsultHuman(nineFromOpponent), false)
  assert.equal(nextState.truco.phase, "awaiting-response")
  assert.equal(nextState.truco.requestedByPlayerId, 3)
  assert.equal(nextState.truco.awaitingResponseFromPlayerId, 2)
  assert.equal(nextState.truco.proposedBet, 12)
  assert.deepEqual(getSpeechBubbleForTransition(nineFromOpponent, nextState), {
    playerId: 3,
    text: "DOZE!",
  })
})
