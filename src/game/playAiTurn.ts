import { chooseCard } from "../ai/chooseCard"
import { logEvent } from "../utils/logger"
import { getPlayerById } from "./getPlayerById"
import { getRuleSet } from "./getRuleSet"
import type { HandState } from "./handState"

export function playAiTurn(state: HandState): HandState {
  if (state.finished) {
    return state
  }

  if (state.truco.phase !== "idle") {
    return state
  }

  if (state.currentPlayerId === 1) {
    return state
  }

  const ruleSet = getRuleSet(state.variant)
  const player = getPlayerById(state.players, state.currentPlayerId)

  const chosen = chooseCard(
    ruleSet,
    player.id,
    player.hand,
    state.table,
    state.vira
  )

  const index = player.hand.findIndex(
    (c) => c.rank === chosen.rank && c.suit === chosen.suit
  )

  const card = player.hand[index]
  const nextPlayers = state.players.map((currentPlayer) => {
    if (currentPlayer.id !== player.id) {
      return currentPlayer
    }

    return {
      ...currentPlayer,
      hand: currentPlayer.hand.filter((_, handIndex) => handIndex !== index),
    }
  })
  const nextTable = [
    ...state.table,
    {
      playerId: player.id,
      card,
    },
  ]

  logEvent(`Jogador ${player.id} jogou:`, card)
  logEvent("Mesa após jogada da IA:", nextTable)

  const nextPlayerId = state.currentPlayerId === 4 ? 1 : state.currentPlayerId + 1

  return {
    ...state,
    players: nextPlayers,
    table: nextTable,
    currentPlayerId: nextPlayerId,
  }
}
