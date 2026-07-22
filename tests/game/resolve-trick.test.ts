import test from "node:test"
import assert from "node:assert/strict"
import { playHumanCard } from "../../src/game/playHumanCard.ts"
import { playAiTurn } from "../../src/game/playAiTurn.ts"
import { resolveTrick } from "../../src/game/resolveTrick.ts"
import { createCard, createHandStateFixture } from "../helpers/gameFixtures.ts"

test("resolveTrick preserva a mesa final quando encerra a mão ao fazer duas vazas", () => {
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
  assert.deepEqual(nextState.table, state.table)
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

test("carta coberta não pode ser jogada na primeira vaza", () => {
  const state = createHandStateFixture({
    roundNumber: 1,
    currentPlayerId: 1,
  })

  assert.throws(
    () => playHumanCard(state, createCard("3", "copas"), { covered: true }),
    /segunda vaza/
  )
})

test("carta coberta pode ser jogada a partir da segunda vaza", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 1,
  })

  const nextState = playHumanCard(state, createCard("3", "copas"), { covered: true })

  assert.equal(nextState.table[0].covered, true)
  assert.deepEqual(nextState.table[0].card, createCard("3", "copas"))
})

test("carta coberta não vence a vaza mesmo quando seria a maior carta", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 4,
    table: [
      { playerId: 1, card: createCard("Q", "espada") },
      { playerId: 2, card: createCard("K", "ouros") },
      { playerId: 3, card: createCard("4", "paus"), covered: true },
      { playerId: 4, card: createCard("J", "copas") },
    ],
  })

  const nextState = resolveTrick(state)

  assert.equal(nextState.score.B, 1)
  assert.equal(nextState.currentPlayerId, 2)
})

test("IA joga carta coberta como descarte quando não consegue ganhar a vaza", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 4,
    table: [
      { playerId: 1, card: createCard("4", "paus") },
      { playerId: 2, card: createCard("2", "espada") },
      { playerId: 3, card: createCard("K", "ouros") },
    ],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      { id: 3, hand: [] },
      {
        id: 4,
        hand: [
          createCard("3", "copas"),
          createCard("2", "paus"),
          createCard("5", "espada"),
        ],
      },
    ],
  })

  const nextState = playAiTurn(state)
  const playedCard = nextState.table[3]

  assert.equal(playedCard.covered, true)
  assert.deepEqual(playedCard.card, createCard("5", "espada"))
})

test("IA abre carta baixa quando só adversários jogaram coberto", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 3,
    table: [
      { playerId: 2, card: createCard("2", "espada"), covered: true },
    ],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      {
        id: 3,
        hand: [
          createCard("5", "espada"),
          createCard("Q", "copas"),
          createCard("3", "paus"),
        ],
      },
      { id: 4, hand: [] },
    ],
  })

  const nextState = playAiTurn(state)
  const playedCard = nextState.table[1]

  assert.equal(playedCard.covered, false)
  assert.deepEqual(playedCard.card, createCard("5", "espada"))
})

test("IA acompanha carta coberta da dupla quando não precisa disputar a vaza", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 3,
    table: [
      { playerId: 1, card: createCard("3", "copas"), covered: true },
      { playerId: 2, card: createCard("2", "espada"), covered: true },
    ],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      {
        id: 3,
        hand: [
          createCard("5", "espada"),
          createCard("Q", "copas"),
          createCard("3", "paus"),
        ],
      },
      { id: 4, hand: [] },
    ],
  })

  const nextState = playAiTurn(state)
  const playedCard = nextState.table[2]

  assert.equal(playedCard.covered, true)
  assert.deepEqual(playedCard.card, createCard("5", "espada"))
})

test("IA abre carta depois da coberta da dupla quando pode ganhar a mão", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 3,
    score: { A: 1, B: 0 },
    firstNonTieWinner: "A",
    table: [
      { playerId: 1, card: createCard("3", "copas"), covered: true },
      { playerId: 2, card: createCard("2", "espada"), covered: true },
    ],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      {
        id: 3,
        hand: [
          createCard("5", "espada"),
          createCard("Q", "copas"),
        ],
      },
      { id: 4, hand: [] },
    ],
  })

  const nextState = playAiTurn(state)
  const playedCard = nextState.table[2]

  assert.equal(playedCard.covered, false)
  assert.deepEqual(playedCard.card, createCard("5", "espada"))
})

test("IA puxa coberta na segunda vaza quando tem reserva forte para a terceira", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 3,
    score: { A: 1, B: 0 },
    firstNonTieWinner: "A",
    table: [],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      {
        id: 3,
        hand: [
          createCard("3", "copas"),
          createCard("7", "copas"),
        ],
      },
      { id: 4, hand: [] },
    ],
  })

  const nextState = playAiTurn(state)
  const playedCard = nextState.table[0]

  assert.equal(playedCard.covered, true)
  assert.deepEqual(playedCard.card, createCard("3", "copas"))
})

test("IA não puxa coberta quando a mão pode fechar a partida", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 3,
    score: { A: 1, B: 0 },
    firstNonTieWinner: "A",
    table: [],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      {
        id: 3,
        hand: [
          createCard("3", "copas"),
          createCard("3", "paus"),
        ],
      },
      { id: 4, hand: [] },
    ],
  })

  const nextState = playAiTurn(state, { A: 11, B: 4 })
  const playedCard = nextState.table[0]

  assert.equal(playedCard.covered, false)
  assert.deepEqual(playedCard.card, createCard("3", "copas"))
})

test("IA ignora cartas cobertas anteriores ao avaliar se consegue ganhar", () => {
  const state = createHandStateFixture({
    roundNumber: 2,
    currentPlayerId: 3,
    table: [
      { playerId: 1, card: createCard("4", "paus"), covered: true },
      { playerId: 2, card: createCard("K", "ouros") },
    ],
    players: [
      { id: 1, hand: [] },
      { id: 2, hand: [] },
      {
        id: 3,
        hand: [
          createCard("5", "espada"),
          createCard("3", "copas"),
        ],
      },
      { id: 4, hand: [] },
    ],
  })

  const nextState = playAiTurn(state)
  const playedCard = nextState.table[2]

  assert.equal(playedCard.covered, false)
  assert.deepEqual(playedCard.card, createCard("3", "copas"))
})
