import { logEvent } from "../utils/logger"
import type { HandState, TeamId } from "./handState"
import { getTargetPlayerForTruco } from "./trucoTarget"
import { canTeamAskForTruco, getBetCallLabel, getNextBet, type MatchScore } from "./truco"
import { getTeam } from "./teams"

function getOpposingTeam(team: TeamId): TeamId {
  return team === "A" ? "B" : "A"
}

export function requestTruco(
  state: HandState,
  playerId: number,
  matchScore?: MatchScore
): HandState {
  if (state.finished) {
    return state
  }

  if (state.truco.phase !== "idle") {
    return state
  }

    const requestingTeam = getTeam(playerId)

  if (
    state.currentBet > 1 &&
    state.truco.nextRaiseByTeam &&
    state.truco.nextRaiseByTeam !== requestingTeam
  ) {
    throw new Error("Este time não pode aumentar a aposta agora")
  }

  if (!canTeamAskForTruco(matchScore, requestingTeam)) {
    logEvent(`Pedido de truco ignorado: time ${requestingTeam} já atingiu 9 pontos.`)
    return state
  }

  if (state.currentPlayerId !== playerId) {
    throw new Error("Não é a vez deste jogador pedir truco")
  }

  if (state.table.length === 4) {
    throw new Error("Não é possível pedir truco com a vaza completa")
  }

  const proposedBet = getNextBet(state.currentBet)

  if (!proposedBet) {
    logEvent("Pedido de truco ignorado: aposta já está no valor máximo.")
    return state
  }

  const requestedByTeam = requestingTeam
  const awaitingResponseFromTeam = getOpposingTeam(requestedByTeam)
  const awaitingResponseFromPlayerId = getTargetPlayerForTruco(state, playerId)
  const callLabel = getBetCallLabel(proposedBet)
  const initialRequestedByPlayerId = playerId
  const initialRequestedByTeam = requestedByTeam

  logEvent(`Jogador ${playerId} pediu ${callLabel}.`)
  logEvent("Time que pediu:", requestedByTeam)
  logEvent("Time aguardando resposta:", awaitingResponseFromTeam)
  logEvent("Próxima aposta proposta:", `${callLabel} (${proposedBet})`)

  return {
    ...state,
    truco: {
      phase: "awaiting-response",
      requestedByPlayerId: playerId,
      requestedByTeam,
      initialRequestedByPlayerId,
      initialRequestedByTeam,
      awaitingResponseFromPlayerId,
      awaitingResponseFromTeam,
      proposedBet,
      promptKind: "request",
    },
  }
}
