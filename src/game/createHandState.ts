import { dealCards } from "./deal"
import type { HandState } from "./handState"
import { getVira } from "./vira"
import type { GameVariant } from "./variant"

export function createHandState(
  variant: GameVariant,
  startingPlayerId: number
): HandState {
  const { players, remainingDeck } = dealCards()
  const vira = getVira(remainingDeck, variant)

  return {
    variant,
    vira,
    players,
    table: [],
    currentPlayerId: startingPlayerId,
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
  }
}