import { logEvent } from "../utils/logger"
import type { HandState } from "./handState"
import { canTeamAskForTruco, getBetCallLabel, getNextBet, type MatchScore } from "./truco"
import type { TrucoResponse } from "./truco"

export function respondToTruco(
  state: HandState,
  response: TrucoResponse,
  matchScore?: MatchScore
): HandState {
  if (state.finished) {
    return state
  }

  if (state.truco.phase !== "awaiting-response") {
    return state
  }

  const requestedByTeam = state.truco.requestedByTeam
  const requestedByPlayerId = state.truco.requestedByPlayerId
  const awaitingResponseFromPlayerId = state.truco.awaitingResponseFromPlayerId
  const awaitingResponseFromTeam = state.truco.awaitingResponseFromTeam
  const proposedBet = state.truco.proposedBet
  const initialRequestedByPlayerId =
    state.truco.initialRequestedByPlayerId ?? requestedByPlayerId
  const initialRequestedByTeam =
    state.truco.initialRequestedByTeam ?? requestedByTeam

  if (
    !requestedByTeam ||
    !requestedByPlayerId ||
    !awaitingResponseFromPlayerId ||
    !awaitingResponseFromTeam ||
    !proposedBet
  ) {
    throw new Error("Estado de truco inválido")
  }

  const normalizedResponse: TrucoResponse =
    response === "raise" && !canTeamAskForTruco(matchScore, awaitingResponseFromTeam)
      ? "accept"
      : response

  if (normalizedResponse === "accept") {
    logEvent(`Time ${awaitingResponseFromTeam} aceitou ${getBetCallLabel(proposedBet)}.`)
    logEvent(`Mão agora vale ${proposedBet} ponto(s).`)

    return {
      ...state,
      currentBet: proposedBet,
      truco: {
        phase: "idle",
        nextRaiseByTeam: awaitingResponseFromTeam,
      },
    }
  }

  if (normalizedResponse === "raise") {
    const nextBet = getNextBet(proposedBet)

    if (!nextBet) {
      throw new Error("Não é possível aumentar além do valor máximo")
    }

    logEvent(
      `Time ${awaitingResponseFromTeam} aceitou ${getBetCallLabel(proposedBet)} e pediu ${getBetCallLabel(nextBet)}.`
    )
    logEvent(`Nova aposta proposta: ${capitalizeBetCallLabel(getBetCallLabel(nextBet))} (${nextBet}).`)

    return {
      ...state,
      currentBet: proposedBet,
      truco: {
        phase: "awaiting-response",
        requestedByPlayerId: awaitingResponseFromPlayerId,
        requestedByTeam: awaitingResponseFromTeam,
        initialRequestedByPlayerId,
        initialRequestedByTeam,
        // Truco escalates only between who asked and who answered.
        // Partners can advise, but they do not become the formal responder.
        awaitingResponseFromPlayerId: requestedByPlayerId,
        awaitingResponseFromTeam: requestedByTeam,
        proposedBet: nextBet,
        promptKind: "raise",
        nextRaiseByTeam: state.truco.nextRaiseByTeam,
      },
    }
  }

  logEvent(`Time ${awaitingResponseFromTeam} correu do truco.`)
  logEvent("Mão finalizada por truco. Vencedor:", requestedByTeam)
  logEvent("Valor da mão mantido em:", state.currentBet)

  return {
    ...state,
    finished: true,
    winner: requestedByTeam,
    truco: {
      phase: "idle",
      awaitingResponseFromPlayerId: undefined,
      promptKind: undefined,
      nextRaiseByTeam: undefined,
    },
  }
}

function capitalizeBetCallLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1)
}
