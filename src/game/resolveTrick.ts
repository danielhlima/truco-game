import { compareCards } from "./compare"
import { getRuleSet } from "./getRuleSet"
import { getTeam } from "./teams"
import type { HandState } from "./handState"
import { logEvent } from "../utils/logger"

export function resolveTrick(state: HandState): HandState {
  if (state.table.length < 4) {
    return state
  }

  const ruleSet = getRuleSet(state.variant)

  logEvent(`--- Resolvendo vaza ${state.roundNumber} ---`)
  logEvent("Cartas na mesa:", state.table)

  let winner = state.table[0]
  let isTie = false

  for (let i = 1; i < state.table.length; i++) {
    const current = state.table[i]
    const result = compareCards(ruleSet, current.card, winner.card, state.vira)

    if (result > 0) {
      winner = current
      isTie = false
    } else if (result === 0) {
      isTie = true
    }
  }

  const nextScore = { ...state.score }
  let nextFirstNonTieWinner = state.firstNonTieWinner
  let nextCurrentPlayerId = state.currentPlayerId

  if (!isTie) {
    const winnerTeam = getTeam(winner.playerId)

    if (nextFirstNonTieWinner === null) {
      nextFirstNonTieWinner = winnerTeam
    }

    nextScore[winnerTeam]++

    logEvent("Vencedor da vaza:", winner.playerId)
    logEvent("Time vencedor da vaza:", winnerTeam)

    nextCurrentPlayerId = winner.playerId
  } else {
    logEvent("Vaza empatou (cangou)")
  }

  const handFinished =
    nextScore.A === 2 || nextScore.B === 2 || state.roundNumber === 3

  let nextWinner = state.winner
  let nextRoundNumber = state.roundNumber

  if (handFinished) {
    if (nextScore.A === nextScore.B) {
      nextWinner = nextFirstNonTieWinner ?? getTeam(1)
    } else {
      nextWinner = nextScore.A > nextScore.B ? "A" : "B"
    }

    logEvent("Mão finalizada. Vencedor:", nextWinner)
    logEvent("Placar final da mão:", nextScore)
  } else {
    nextRoundNumber++
    logEvent("Placar parcial:", nextScore)
    logEvent("Próxima vaza:", nextRoundNumber)
    logEvent("Próximo jogador:", nextCurrentPlayerId)
  }

  return {
    ...state,
    currentPlayerId: nextCurrentPlayerId,
    score: nextScore,
    firstNonTieWinner: nextFirstNonTieWinner,
    roundNumber: nextRoundNumber,
    finished: handFinished,
    winner: nextWinner,
    table: [],
  }
}
