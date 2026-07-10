import { chooseCard } from "../ai/chooseCard"
import { logEvent } from "../utils/logger"
import { compareCards } from "./compare"
import { getPlayerById } from "./getPlayerById"
import { getRuleSet } from "./getRuleSet"
import type { HandState } from "./handState"
import type { TableCard } from "./tableCard"
import { isTeammate } from "../ai/utils"

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
  const uncoveredTable = state.table.filter((entry) => !entry.covered)

  const chosen = chooseCard(
    ruleSet,
    player.id,
    player.hand,
    uncoveredTable,
    state.vira
  )
  const playCovered = shouldPlayCoveredCard(state, player.id, chosen)

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
      covered: playCovered,
    },
  ]

  if (playCovered) {
    logEvent(`Jogador ${player.id} jogou carta coberta.`)
  } else {
    logEvent(`Jogador ${player.id} jogou:`, card)
  }
  logEvent("Mesa após jogada da IA:", maskCoveredTableCards(nextTable))

  const nextPlayerId = state.currentPlayerId === 4 ? 1 : state.currentPlayerId + 1

  return {
    ...state,
    players: nextPlayers,
    table: nextTable,
    currentPlayerId: nextPlayerId,
  }
}

function shouldPlayCoveredCard(state: HandState, playerId: number, chosenCard: TableCard["card"]): boolean {
  if (state.roundNumber === 1 || state.table.length === 0) {
    return false
  }

  const best = getBestUncoveredTableCard(state)
  if (!best) {
    return false
  }

  if (isTeammate(playerId, best.playerId)) {
    return true
  }

  const ruleSet = getRuleSet(state.variant)
  return compareCards(ruleSet, chosenCard, best.card, state.vira) <= 0
}

function getBestUncoveredTableCard(state: HandState): TableCard | null {
  const ruleSet = getRuleSet(state.variant)
  const uncoveredCards = state.table.filter((entry) => !entry.covered)

  if (uncoveredCards.length === 0) {
    return null
  }

  return uncoveredCards.reduce((best, current) =>
    compareCards(ruleSet, current.card, best.card, state.vira) > 0 ? current : best
  )
}

function maskCoveredTableCards(table: TableCard[]): unknown[] {
  return table.map((entry) =>
    entry.covered
      ? {
          playerId: entry.playerId,
          card: "coberta",
          covered: true,
        }
      : entry
  )
}
