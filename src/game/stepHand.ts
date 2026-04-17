import { getTeamTrucoDecision, shouldRaiseBet } from "../ai/trucoDecision"
import type { AiTrucoPersonalityId } from "../ai/trucoPersonalities"
import { getRuleSet } from "./getRuleSet"
import type { HandState } from "./handState"
import { playAiTurn } from "./playAiTurn"
import { requestTruco } from "./requestTruco"
import { resolveTrick } from "./resolveTrick"
import { respondToTruco } from "./respondToTruco"
import { getTeam } from "./teams"
import type { MatchScore } from "./truco"

interface AiPersonalityByTeam {
  A: AiTrucoPersonalityId
  B: AiTrucoPersonalityId
}

export function stepHand(
  state: HandState,
  aiPersonalityByTeam: AiPersonalityByTeam = {
    A: "balanced",
    B: "balanced",
  },
  matchScore?: MatchScore
): HandState {
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

    if (awaitingTeam === "A" && awaitingPlayerId === 1) {
      return state
    }

    const ruleSet = getRuleSet(state.variant)
    const awaitingPlayers = state.players.filter((player) => getTeam(player.id) === awaitingTeam)
    const aiPersonalityId = aiPersonalityByTeam[awaitingTeam]
    const decision = getTeamTrucoDecision(
      ruleSet,
      awaitingPlayers.map((player) => player.hand),
      proposedBet,
      state.vira,
      aiPersonalityId
    )

    if (decision === "raise") {
      return respondToTruco(state, "raise", matchScore)
    }

    return respondToTruco(state, decision === "accept" ? "accept" : "run", matchScore)
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
    const aiPersonalityId = aiPersonalityByTeam[currentTeam]

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
        state.vira,
        aiPersonalityId
      )

    if (shouldAskForTruco) {
      return requestTruco(state, currentPlayer.id, matchScore)
    }

    return playAiTurn(state)
  }

  return state
}
