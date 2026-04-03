import type { TeamId } from "./handState"
import type { BetValue } from "./truco"
import type { GameVariant } from "./variant"

export interface MatchState {
  variant: GameVariant
  score: {
    A: number
    B: number
  }
  handNumber: number
  startingPlayerId: number
  finished: boolean
  winner?: TeamId
}

export interface CompletedHandLike {
  finished: boolean
  winner?: TeamId
  currentBet: BetValue
}

export function createMatchState(
  variant: GameVariant,
  startingPlayerId = 1
): MatchState {
  return {
    variant,
    score: {
      A: 0,
      B: 0,
    },
    handNumber: 1,
    startingPlayerId,
    finished: false,
  }
}

export function applyCompletedHandToMatch(
  matchState: MatchState,
  handState: CompletedHandLike
): MatchState {
  if (!handState.finished || !handState.winner) {
    throw new Error("A mão precisa estar finalizada para atualizar a partida")
  }

  if (matchState.finished) {
    return matchState
  }

  const nextScore = {
    ...matchState.score,
    [handState.winner]: Math.min(
      12,
      matchState.score[handState.winner] + handState.currentBet
    ),
  }
  const finished = nextScore[handState.winner] >= 12

  return {
    ...matchState,
    score: nextScore,
    handNumber: finished ? matchState.handNumber : matchState.handNumber + 1,
    startingPlayerId: finished
      ? matchState.startingPlayerId
      : getNextStartingPlayerId(matchState.startingPlayerId),
    finished,
    winner: finished ? handState.winner : undefined,
  }
}

export function getNextStartingPlayerId(currentPlayerId: number): number {
  return currentPlayerId === 4 ? 1 : currentPlayerId + 1
}
