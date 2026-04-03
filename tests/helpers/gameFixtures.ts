import type { HandState } from "../../src/game/handState.ts"
import type { Card } from "../../src/game/card.ts"
import type { GameVariant } from "../../src/game/variant.ts"

export function createCard(rank: Card["rank"], suit: Card["suit"]): Card {
  return { rank, suit }
}

export function createHandStateFixture(
  overrides: Partial<HandState> = {},
  variant: GameVariant = "MINEIRO"
): HandState {
  return {
    variant,
    players: [
      { id: 1, hand: [createCard("3", "copas"), createCard("A", "paus"), createCard("7", "ouros")] },
      { id: 2, hand: [createCard("2", "espada"), createCard("K", "ouros"), createCard("4", "copas")] },
      { id: 3, hand: [createCard("4", "paus"), createCard("7", "copas"), createCard("A", "espada")] },
      { id: 4, hand: [createCard("5", "paus"), createCard("6", "espada"), createCard("Q", "copas")] },
    ],
    table: [],
    currentPlayerId: 1,
    currentBet: 1,
    score: {
      A: 0,
      B: 0,
    },
    firstNonTieWinner: null,
    roundNumber: 1,
    finished: false,
    truco: {
      phase: "idle",
    },
    ...overrides,
  }
}
