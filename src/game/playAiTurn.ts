import { chooseCard } from "../ai/chooseCard"
import { logEvent } from "../utils/logger"
import { compareCards } from "./compare"
import { getPlayerById } from "./getPlayerById"
import { getRuleSet } from "./getRuleSet"
import type { HandState } from "./handState"
import type { TableCard } from "./tableCard"
import type { MatchScore } from "./truco"
import { isTeammate } from "../ai/utils"
import { evaluateHandStrength } from "../ai/trucoDecision"
import { getTeam } from "./teams"

export function playAiTurn(state: HandState, matchScore?: MatchScore): HandState {
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

  const index = player.hand.findIndex(
    (c) => c.rank === chosen.rank && c.suit === chosen.suit
  )
  if (index === -1) {
    return state
  }

  const card = player.hand[index]
  const playCovered = shouldPlayCoveredCard(
    state,
    player.id,
    card,
    player.hand,
    matchScore
  )

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

function shouldPlayCoveredCard(
  state: HandState,
  playerId: number,
  chosenCard: TableCard["card"],
  hand: TableCard["card"][],
  matchScore?: MatchScore
): boolean {
  if (state.roundNumber === 1) {
    return false
  }

  if (state.table.length === 0) {
    return shouldLeadCoveredCard(state, playerId, chosenCard, hand, matchScore)
  }

  const best = getBestUncoveredTableCard(state)
  if (!best) {
    return shouldFollowPartnerCoveredCard(state, playerId, matchScore)
  }

  if (isTeammate(playerId, best.playerId)) {
    return true
  }

  const ruleSet = getRuleSet(state.variant)
  return compareCards(ruleSet, chosenCard, best.card, state.vira) <= 0
}

function shouldLeadCoveredCard(
  state: HandState,
  playerId: number,
  chosenCard: TableCard["card"],
  hand: TableCard["card"][],
  matchScore?: MatchScore
): boolean {
  if (state.roundNumber !== 2 || state.nineHand) {
    return false
  }

  const team = getTeam(playerId)
  if (state.score[team] < 1) {
    return false
  }

  if (wouldCurrentHandWinMatch(state, team, matchScore)) {
    return false
  }

  const ruleSet = getRuleSet(state.variant)
  const remainingHand = removeFirstMatchingCard(hand, chosenCard)
  const reserveStrength = evaluateHandStrength(ruleSet, remainingHand, state.vira)

  return reserveStrength >= 2
}

function shouldFollowPartnerCoveredCard(
  state: HandState,
  playerId: number,
  matchScore?: MatchScore
): boolean {
  const teammateCovered = state.table.some(
    (entry) => entry.covered && isTeammate(playerId, entry.playerId)
  )

  if (!teammateCovered) {
    return false
  }

  const team = getTeam(playerId)
  if (shouldContestCoveredTrick(state, team, matchScore)) {
    return false
  }

  return true
}

function shouldContestCoveredTrick(
  state: HandState,
  team: "A" | "B",
  matchScore?: MatchScore
): boolean {
  if (state.score[team] >= 1) {
    return true
  }

  if (wouldCurrentHandWinMatch(state, team, matchScore)) {
    return true
  }

  const opponentTeam = team === "A" ? "B" : "A"
  if (
    state.roundNumber === 3 &&
    (state.firstNonTieWinner !== team || state.score[opponentTeam] >= 1)
  ) {
    return true
  }

  return state.score[opponentTeam] >= 1 && wouldCurrentHandWinMatch(state, opponentTeam, matchScore)
}

function wouldCurrentHandWinMatch(
  state: HandState,
  team: "A" | "B",
  matchScore?: MatchScore
): boolean {
  return !!matchScore && matchScore[team] + state.currentBet >= 12
}

function removeFirstMatchingCard(cards: TableCard["card"][], cardToRemove: TableCard["card"]) {
  const index = cards.findIndex(
    (card) => card.rank === cardToRemove.rank && card.suit === cardToRemove.suit
  )

  if (index === -1) {
    return cards
  }

  return cards.filter((_, cardIndex) => cardIndex !== index)
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
