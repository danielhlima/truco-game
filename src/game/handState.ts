import type { Card } from "./card"
import type { Player } from "./gameState"
import type { TableCard } from "./tableCard"
import type { BetValue } from "./truco"
import type { GameVariant } from "./variant"

export type TeamId = "A" | "B"

export type TrucoPhase = "idle" | "awaiting-response"
export type TrucoPromptKind = "request" | "raise"

export interface TrucoState {
  phase: TrucoPhase
  requestedByPlayerId?: number
  requestedByTeam?: TeamId
  awaitingResponseFromPlayerId?: number
  awaitingResponseFromTeam?: TeamId
  proposedBet?: BetValue
  promptKind?: TrucoPromptKind
  nextRaiseByTeam?: TeamId
}

export interface HandState {
  variant: GameVariant
  vira?: Card
  players: Player[]
  table: TableCard[]
  currentPlayerId: number
  currentBet: BetValue
  score: {
    A: number
    B: number
  }
  firstNonTieWinner: TeamId | null
  roundNumber: number
  finished: boolean
  winner?: TeamId
  truco: TrucoState
}
