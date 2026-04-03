import type { Card } from "./card"

export interface Player {
  id: number
  hand: Card[]
}

export interface GameState {
  players: Player[]
  table: Card[]
}