import type { HandState } from "./handState"

export function getNextPlayerClockwise(playerId: number): number {
  return playerId === 4 ? 1 : playerId + 1
}

export function getTargetPlayerForTruco(state: HandState, requesterPlayerId: number): number {
  if (state.table.length > 0) {
    return state.table[state.table.length - 1].playerId
  }

  return getNextPlayerClockwise(requesterPlayerId)
}

