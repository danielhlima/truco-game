export function getTeam(playerId: number): "A" | "B" {
  return playerId % 2 === 1 ? "A" : "B"
}

export function getPartnerPlayerId(playerId: number): number {
  switch (playerId) {
    case 1:
      return 3
    case 2:
      return 4
    case 3:
      return 1
    case 4:
      return 2
    default:
      return playerId
  }
}
