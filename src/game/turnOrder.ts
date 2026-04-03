import type { Player } from "./gameState"

export function rotatePlayers(players: Player[], startIndex: number): Player[] {
  return [
    ...players.slice(startIndex),
    ...players.slice(0, startIndex)
  ]
}