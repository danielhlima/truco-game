export function getTeam(playerId: number): "A" | "B" {
  return playerId % 2 === 1 ? "A" : "B"
}