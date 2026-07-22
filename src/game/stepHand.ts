import { evaluateHandStrength, getTeamTrucoDecision, shouldRaiseBet } from "../ai/trucoDecision"
import type { AiTrucoPersonalityId } from "../ai/trucoPersonalities"
import { getRuleSet } from "./getRuleSet"
import type { HandState } from "./handState"
import { playAiTurn } from "./playAiTurn"
import { requestTruco } from "./requestTruco"
import { resolveTrick } from "./resolveTrick"
import { respondToTruco } from "./respondToTruco"
import { decideNineHand, isNineHandAwaitingDecision } from "./nineHand"
import { getTeam } from "./teams"
import { canTeamAskForTruco, type BetValue, type MatchScore } from "./truco"
import { logEvent } from "../utils/logger"

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

  if (isNineHandAwaitingDecision(state)) {
    if (state.nineHand?.team === "A") {
      return state
    }

    return decideNineHand(state, shouldAiPlayNineHand(state) ? "play" : "fold")
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
    const strengths = awaitingPlayers.map((player) =>
      evaluateHandStrength(ruleSet, player.hand, state.vira)
    )
    const decision = getTeamTrucoDecision(
      ruleSet,
      awaitingPlayers.map((player) => player.hand),
      proposedBet,
      state.vira,
      aiPersonalityId
    )
    logAiTrucoDecision({
      action: "resposta",
      team: awaitingTeam,
      personalityId: aiPersonalityId,
      strengths,
      proposedBet,
      decision,
    })

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
    const canAskForTruco = canTeamAskForTruco(matchScore, currentTeam)

    const shouldAskForTruco =
      !state.nineHand &&
      canAskForTruco &&
      canRaiseNow &&
      shouldRaiseBet(
        ruleSet,
        currentPlayer.hand,
        state.currentBet,
        state.vira,
        aiPersonalityId
      )

    if (shouldAskForTruco) {
      const nextState = requestTruco(state, currentPlayer.id, matchScore)

      if (nextState !== state) {
        logAiTrucoDecision({
          action: "pedido",
          playerId: currentPlayer.id,
          team: currentTeam,
          personalityId: aiPersonalityId,
          strengths: [evaluateHandStrength(ruleSet, currentPlayer.hand, state.vira)],
          currentBet: state.currentBet,
          decision: "pedir",
        })
        return nextState
      }
    }

    return playAiTurn(state, matchScore)
  }

  return state
}

function shouldAiPlayNineHand(state: HandState): boolean {
  if (!state.nineHand) {
    return false
  }

  const ruleSet = getRuleSet(state.variant)
  const teamPlayers = state.players.filter((player) => getTeam(player.id) === state.nineHand?.team)
  const strengths = teamPlayers.map((player) =>
    evaluateHandStrength(ruleSet, player.hand, state.vira)
  )
  const totalStrength = strengths.reduce((sum, strength) => sum + strength, 0)
  const bestStrength = strengths.length > 0 ? Math.max(...strengths) : 0

  return totalStrength >= 5 || bestStrength >= 4
}

function logAiTrucoDecision({
  action,
  playerId,
  team,
  personalityId,
  strengths,
  currentBet,
  proposedBet,
  decision,
}: {
  action: "pedido" | "resposta"
  playerId?: number
  team: "A" | "B"
  personalityId: AiTrucoPersonalityId
  strengths: number[]
  currentBet?: BetValue
  proposedBet?: BetValue
  decision: "pedir" | "accept" | "run" | "raise"
}) {
  const details = [
    `acao ${action}`,
    playerId ? `jogador ${playerId}` : null,
    `time ${team}`,
    `perfil ${personalityId}`,
    `forcas [${strengths.join(", ")}]`,
    typeof currentBet === "number" ? `aposta atual ${currentBet}` : null,
    typeof proposedBet === "number" ? `aposta proposta ${proposedBet}` : null,
    `decisao ${decision}`,
  ].filter(Boolean)

  logEvent(`DEBUG IA Truco: ${details.join(", ")}`)
}
