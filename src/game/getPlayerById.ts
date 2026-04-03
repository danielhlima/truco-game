import type { Player } from "./gameState"

export function getPlayerById(players: Player[], playerId: number): Player {
  const player = players.find((p) => p.id === playerId)

  if (!player) {
    throw new Error(`Jogador ${playerId} não encontrado`)
  }

  return player
}