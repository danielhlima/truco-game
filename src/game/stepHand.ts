import { respondToRaise, shouldRaiseBet } from "../ai/trucoDecision"
import { getRuleSet } from "./getRuleSet"
import type { HandState } from "./handState"
import { playAiTurn } from "./playAiTurn"
import { requestTruco } from "./requestTruco"
import { resolveTrick } from "./resolveTrick"
import { respondToTruco } from "./respondToTruco"
import { getNextBet } from "./truco"
import { getTeam } from "./teams"

export function stepHand(state: HandState): HandState {
  if (state.finished) {
    return state
  }

  if (state.truco.phase === "awaiting-response") {
    const awaitingTeam = state.truco.awaitingResponseFromTeam
    const awaitingPlayerId = state.truco.awaitingResponseFromPlayerId
    const proposedBet = state.truco.proposedBet

    if (!awaitingTeam || !awaitingPlayerId || !proposedBet) {
      return state
    }

    if (awaitingPlayerId === 1) {
      return state
    }

    const ruleSet = getRuleSet(state.variant)
    const awaitingPlayer = state.players.find((player) => player.id === awaitingPlayerId)

    if (!awaitingPlayer) {
      return state
    }

    const shouldAccept =
      respondToRaise(ruleSet, awaitingPlayer.hand, proposedBet, state.vira) === "accept"

    const canRaise = getNextBet(proposedBet) !== null
    const shouldReRaise =
      shouldAccept &&
      canRaise &&
      shouldRaiseBet(ruleSet, awaitingPlayer.hand, proposedBet, state.vira)

    if (shouldReRaise) {
      return respondToTruco(state, "raise")
    }

    return respondToTruco(state, shouldAccept ? "accept" : "run")
  }

  if (state.table.length === 4) {
    return resolveTrick(state)
  }

  if (state.currentPlayerId !== 1) {
    const ruleSet = getRuleSet(state.variant)
    const currentPlayer = state.players.find(
      (player) => player.id === state.currentPlayerId
    )

    if (!currentPlayer) {
      return state
    }

        const currentTeam = getTeam(currentPlayer.id)

    const canRaiseNow =
      state.currentBet === 1 ||
      !state.truco.nextRaiseByTeam ||
      state.truco.nextRaiseByTeam === currentTeam

    const shouldAskForTruco =
      canRaiseNow &&
      shouldRaiseBet(
        ruleSet,
        currentPlayer.hand,
        state.currentBet,
        state.vira
      )

    if (shouldAskForTruco) {
      return requestTruco(state, currentPlayer.id)
    }

    return playAiTurn(state)
  }

  return state
}
