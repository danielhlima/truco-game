import {
  applyCampaignWin,
  getCurrentCampaignVenue,
} from "../career/campaign/progression"
import type { CampaignStage } from "../career/campaign/types"
import type { Card } from "../game/card"
import type { HandState, TeamId } from "../game/handState"
import { getNextPlayerClockwise as getClockwisePlayerId } from "../game/trucoTarget"
import { getBetCallLabel, getNextBet } from "../game/truco"

export const DEFAULT_TRUCO_MESSAGE = "Nenhum pedido de truco nesta mão."

export interface SpeechBubbleState {
  playerId: number
  text: string
}

interface TrucoAcceptSpeechSequence {
  primary: SpeechBubbleState
  followUp?: SpeechBubbleState
}

export function formatCard(card: Card): string {
  return `${card.rank} de ${card.suit}`
}

export function getCurrentTurnLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase === "awaiting-response") {
    return getPlayerLabel(getTrucoTargetPlayerId(handState))
  }

  switch (handState.currentPlayerId) {
    case 1:
      return "Você"
    case 2:
      return "Adversário esquerdo"
    case 3:
      return "Parceira"
    case 4:
      return "Adversário direito"
    default:
      return `Jogador ${handState.currentPlayerId}`
  }
}

export function getWinnerLabel(winner?: "A" | "B"): string {
  if (!winner) return "Sem vencedor"

  return winner === "A" ? "Nós vencemos" : "Eles venceram"
}

export function getStatusMessage(handState: HandState | null): string {
  if (!handState) {
    return "Escolha a variante e clique em “Iniciar partida”."
  }

  if (handState.finished) {
    return getWinnerLabel(handState.winner)
  }

  if (handState.truco.phase === "awaiting-response") {
    if (getTrucoTargetPlayerId(handState) === 1) {
      return `O time adversário pediu ${getPendingBetText(handState)}. Responda.`
    }

    return `Aguardando resposta de ${getPlayerLabel(getTrucoTargetPlayerId(handState)).toLowerCase()}.`
  }

  if (handState.table.length === 4) {
    return "A vaza está completa e pronta para ser resolvida."
  }

  if (handState.currentPlayerId === 1) {
    return "É sua vez de jogar."
  }

  return `Aguardando jogada de ${getCurrentTurnLabel(handState).toLowerCase()}.`
}

export function getNextStepButtonLabel(
  handState: HandState | null,
  matchFinished = false
): string {
  if (!handState) {
    return "Próxima jogada"
  }

  if (handState.finished) {
    return matchFinished ? "Partida encerrada" : "Próxima mão"
  }

  if (handState.truco.phase === "awaiting-response") {
    return "Resolver lance"
  }

  if (handState.table.length === 4) {
    return "Resolver vaza"
  }

  return "Continuar"
}

export function getRoundWinMessage(
  handState: HandState,
  previousScore: { A: number; B: number }
): string {
  const usWonRound = handState.score.A > previousScore.A
  const themWonRound = handState.score.B > previousScore.B

  if (usWonRound) {
    return "Nós vencemos a rodada."
  }

  if (themWonRound) {
    return "Eles venceram a rodada."
  }

  return "A rodada foi resolvida."
}

export function getHandEndMessage(handState: HandState): string {
  if (handState.winner === "A") {
    return `Fim da mão: nós vencemos valendo ${handState.currentBet} ponto(s).`
  }

  if (handState.winner === "B") {
    return `Fim da mão: eles venceram valendo ${handState.currentBet} ponto(s).`
  }

  return "Fim da mão."
}

export function getEventMessageForTransition(
  previousState: HandState | null,
  nextState: HandState
): string | null {
  if (!previousState) {
    return null
  }

  if (!previousState.finished && nextState.finished) {
    return getHandEndMessage(nextState)
  }

  if (
    nextState.score.A !== previousState.score.A ||
    nextState.score.B !== previousState.score.B
  ) {
    return getRoundWinMessage(nextState, previousState.score)
  }

  if (nextState.roundNumber > previousState.roundNumber) {
    return `Começou a rodada ${nextState.roundNumber}.`
  }

  if (previousState.table.length === 4 && nextState.table.length === 0) {
    return "A mesa foi limpa para a próxima jogada."
  }

  return null
}

export function getTrucoMessageForTransition(
  previousState: HandState | null,
  nextState: HandState
): string | null {
  if (!previousState) {
    return null
  }

  if (
    previousState.truco.phase === "idle" &&
    nextState.truco.phase === "awaiting-response"
  ) {
    if (nextState.truco.requestedByTeam === "A") {
      return `Nosso time pediu ${getPendingBetText(nextState)}. Aguardando resposta deles.`
    }

    if (nextState.truco.requestedByTeam === "B") {
      return `O time adversário pediu ${getPendingBetText(nextState)}. Responda.`
    }
  }

  if (
    previousState.truco.phase === "awaiting-response" &&
    nextState.truco.phase === "idle"
  ) {
    if (nextState.finished) {
      if (previousState.truco.requestedByTeam === "A") {
        return `O time adversário correu de ${getPendingBetText(previousState)}.`
      }

      if (previousState.truco.requestedByTeam === "B") {
        return `Nosso time correu de ${getPendingBetText(previousState)}.`
      }
    }

    if (nextState.currentBet > previousState.currentBet) {
      return getAcceptedBetMessage(nextState.currentBet)
    }
  }

  return null
}

export function getSpeechBubbleForTransition(
  previousState: HandState | null,
  nextState: HandState
): SpeechBubbleState | null {
  if (!previousState) {
    return null
  }

  if (
    previousState.truco.phase === "idle" &&
    nextState.truco.phase === "awaiting-response" &&
    nextState.truco.requestedByPlayerId &&
    nextState.truco.proposedBet
  ) {
    return {
      playerId: nextState.truco.requestedByPlayerId,
      text: getSpeechBetLabel(nextState.truco.proposedBet),
    }
  }

  if (
    previousState.truco.phase === "awaiting-response" &&
    previousState.truco.requestedByPlayerId
  ) {
    const responderPlayerId = getTrucoSpeechResponderPlayerId(previousState)

    if (nextState.finished) {
      return {
        playerId: responderPlayerId,
        text: "TÔ FORA!",
      }
    }

    if (
      nextState.truco.phase === "awaiting-response" &&
      previousState.truco.proposedBet &&
      nextState.truco.proposedBet &&
      nextState.truco.proposedBet > previousState.truco.proposedBet
    ) {
      return {
        playerId: responderPlayerId,
        text: getSpeechBetLabel(nextState.truco.proposedBet),
      }
    }

    if (
      nextState.truco.phase === "idle" &&
      previousState.truco.proposedBet &&
      nextState.currentBet >= previousState.truco.proposedBet
    ) {
      return getTrucoAcceptSpeechSequence(previousState)?.primary ?? null
    }
  }

  return null
}

function getTrucoSpeechResponderPlayerId(handState: HandState): number {
  return getTrucoTargetPlayerId(handState)
}

function getTrucoAcceptSpeechSequence(
  handState: HandState
): TrucoAcceptSpeechSequence | null {
  const responderPlayerId = getTrucoSpeechResponderPlayerId(handState)
  const currentRequesterPlayerId = handState.truco.requestedByPlayerId ?? null

  if (!currentRequesterPlayerId) {
    return null
  }

  return {
    primary: {
      playerId: responderPlayerId,
      text: "DESCE!",
    },
    followUp: {
      playerId: currentRequesterPlayerId,
      text: "TOMA!",
    },
  }
}

export function getFollowUpSpeechBubbleForTransition(
  previousState: HandState | null,
  nextState: HandState
): SpeechBubbleState | null {
  if (!previousState) {
    return null
  }

  if (
    previousState.truco.phase === "awaiting-response" &&
    nextState.truco.phase === "idle" &&
    !nextState.finished &&
    previousState.truco.proposedBet &&
    nextState.currentBet >= previousState.truco.proposedBet
  ) {
    return getTrucoAcceptSpeechSequence(previousState)?.followUp ?? null
  }

  return null
}

export function getSpeechBetLabel(bet: number): string {
  switch (bet) {
    case 3:
      return "TRUCO!"
    case 6:
      return "SEIS!"
    case 9:
      return "NOVE!"
    case 12:
      return "DOZE!"
    default:
      return "TRUCO!"
  }
}

export function getNextPlayerClockwise(playerId: number): number {
  return getClockwisePlayerId(playerId)
}

export function getTrucoTargetPlayerId(handState: HandState): number {
  if (handState.truco.awaitingResponseFromPlayerId) {
    return handState.truco.awaitingResponseFromPlayerId
  }

  const requesterPlayerId = handState.truco.requestedByPlayerId
  return requesterPlayerId ? getNextPlayerClockwise(requesterPlayerId) : handState.currentPlayerId
}

export function getSuitSymbol(suit: Card["suit"]): string {
  switch (suit) {
    case "copas":
      return "♥"
    case "ouros":
      return "♦"
    case "espada":
      return "♠"
    case "paus":
      return "♣"
    default:
      return "?"
  }
}

export function getSuitColor(suit: Card["suit"]): string {
  return suit === "copas" || suit === "ouros" ? "#b91c1c" : "#1f2937"
}

export function getManilhaLabel(handState: HandState | null): string {
  if (!handState) return "—"
  if (handState.variant === "MINEIRO") return "Fixa"

  const viraRank = handState.vira?.rank
  if (!viraRank) return "—"

  const nextRank = getNextRank(viraRank)
  return nextRank ?? "—"
}

export function getNextRank(rank: string): string | null {
  const order = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"]
  const index = order.indexOf(rank)

  if (index === -1) return null

  const nextIndex = (index + 1) % order.length
  return order[nextIndex]
}

export function getStateLabel(handState: HandState | null): string {
  if (!handState) return "Aguardando início"
  if (handState.finished) return "Encerrada"
  if (handState.truco.phase === "awaiting-response") return "Lance pendente"
  return "Em andamento"
}

export function getTrucoStatusLabel(handState: HandState | null): string {
  if (!handState) return "Sem mão ativa"
  if (handState.finished) return "Mão encerrada"
  if (handState.truco.phase === "awaiting-response") {
    if (getTrucoTargetPlayerId(handState) === 1) {
      return "Sua resposta"
    }

    return "Aguardando resposta"
  }
  return "Disponível"
}

export function canHumanRaiseInResponse(handState: HandState | null): boolean {
  if (!handState) return false
  if (handState.truco.phase !== "awaiting-response") return false
  if (getTrucoTargetPlayerId(handState) !== 1) return false

  return getNextRaiseValueFromPendingTruco(handState) !== null
}

export function getRaiseResponseButtonLabel(handState: HandState | null): string {
  const nextRaise = getNextRaiseValueFromPendingTruco(handState)

  if (!nextRaise) {
    return "Aumentar"
  }

  return `Pedir ${getBetCallLabelFromNumber(nextRaise)}`
}

export function getNextRaiseValueFromPendingTruco(
  handState: HandState | null
): number | null {
  if (!handState) return null
  if (handState.truco.phase !== "awaiting-response") return null
  if (!handState.truco.proposedBet) return null

  const order = [1, 3, 6, 9, 12]
  const index = order.indexOf(handState.truco.proposedBet)

  if (index === -1 || index === order.length - 1) {
    return null
  }

  return order[index + 1]
}

export function getTrucoRequestedByLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase !== "awaiting-response") {
    return "—"
  }

  if (handState.truco.requestedByTeam === "A") {
    return "Nós"
  }

  if (handState.truco.requestedByTeam === "B") {
    return "Eles"
  }

  return "—"
}

export function getTrucoAwaitingLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase !== "awaiting-response") {
    return "Ninguém"
  }

  if (handState.truco.awaitingResponseFromTeam === "A") {
    return getTrucoTargetPlayerId(handState) === 1 ? "Sua resposta" : "Parceira"
  }

  if (handState.truco.awaitingResponseFromTeam === "B") {
    return "Resposta deles"
  }

  return "—"
}

export function getPlayerLabel(playerId: number): string {
  switch (playerId) {
    case 1:
      return "Você"
    case 2:
      return "Adversário esquerdo"
    case 3:
      return "Parceira"
    case 4:
      return "Adversário direito"
    default:
      return `Jogador ${playerId}`
  }
}

export function getTrucoProposedBetLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase !== "awaiting-response") {
    return "—"
  }

  return handState.truco.proposedBet
    ? `${getBetCallLabel(handState.truco.proposedBet)} (${handState.truco.proposedBet})`
    : "—"
}

export function getRequestBetButtonLabel(handState: HandState | null): string {
  if (!handState) {
    return "Pedir truco"
  }

  const nextBet = getNextBet(handState.currentBet)
  if (!nextBet) {
    return "Sem aumento"
  }

  return `Pedir ${getBetCallLabel(nextBet)}`
}

export function getPendingBetText(handState: HandState | null): string {
  if (
    !handState ||
    handState.truco.phase !== "awaiting-response" ||
    !handState.truco.proposedBet
  ) {
    return "truco"
  }

  return getBetCallLabel(handState.truco.proposedBet)
}

export function getBetCallLabelFromNumber(value: number): string {
  if (value === 3 || value === 6 || value === 9 || value === 12) {
    return getBetCallLabel(value)
  }

  return String(value)
}

export function getBetBadgeLabel(bet: 1 | 3 | 6 | 9 | 12): string {
  return `${bet} ${bet === 1 ? "tento" : "tentos"}`
}

export function capitalizeBetLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getAcceptedBetMessage(bet: 1 | 3 | 6 | 9 | 12): string {
  return `${capitalizeBetLabel(getBetCallLabel(bet))} aceito. A mão agora vale ${bet} ponto(s).`
}

export function getMatchEndMessage(
  winner: TeamId,
  score: { A: number; B: number }
): string {
  if (winner === "A") {
    return `Fim da partida: nós vencemos por ${score.A} a ${score.B}.`
  }

  return `Fim da partida: eles venceram por ${score.B} a ${score.A}.`
}

export function getCampaignWinMessage(
  score: { A: number; B: number },
  resolution: ReturnType<typeof applyCampaignWin>
): string {
  if (resolution.campaignCompleted) {
    return `Fim da partida: nós vencemos por ${score.A} a ${score.B} e concluímos toda a campanha disponível.`
  }

  if (resolution.clearedVenue && resolution.unlockedStage) {
    return `Fim da partida: nós vencemos por ${score.A} a ${score.B}, concluímos ${resolution.clearedVenue.name} e liberamos ${resolution.unlockedStage.name}.`
  }

  if (resolution.clearedVenue) {
    return `Fim da partida: nós vencemos por ${score.A} a ${score.B} e avançamos em ${resolution.clearedVenue.name}.`
  }

  return `Fim da partida: nós vencemos por ${score.A} a ${score.B}.`
}

export function getCampaignTrucoSummary(
  resolution: ReturnType<typeof applyCampaignWin>
): string {
  const rewards: string[] = []

  if ((resolution.rewardsApplied.coins ?? 0) > 0) {
    rewards.push(`${resolution.rewardsApplied.coins} moedas`)
  }

  if ((resolution.rewardsApplied.gems ?? 0) > 0) {
    rewards.push(`${resolution.rewardsApplied.gems} gemas`)
  }

  if ((resolution.rewardsApplied.unlockIds?.length ?? 0) > 0) {
    rewards.push(`${resolution.rewardsApplied.unlockIds?.length} item(ns)`)
  }

  const rewardsText = rewards.length > 0 ? ` Recompensas: ${rewards.join(", ")}.` : ""

  if (resolution.currentVenue) {
    return `Próximo local: ${resolution.currentVenue.name}.${rewardsText}`
  }

  return `Campanha concluída.${rewardsText}`
}

export function getCampaignTierLabel(tier: CampaignStage["tier"]): string {
  switch (tier) {
    case "rua":
      return "Rua"
    case "bairro":
      return "Bairro"
    case "zona":
      return "Zona"
    case "cidade":
      return "Cidade"
    case "estado":
      return "Estado"
    case "nacional":
      return "Nacional"
    case "panamericano":
      return "Panamericano"
    case "jogos-mundiais":
      return "Jogos Mundiais"
    case "mundial":
      return "Mundial"
    case "bonus":
      return "Bônus"
  }
}

export function getStartMatchButtonLabel(
  venue: ReturnType<typeof getCurrentCampaignVenue>,
  campaignCompleted: boolean
): string {
  if (campaignCompleted) {
    return "Campanha concluída"
  }

  if (!venue) {
    return "Sem local disponível"
  }

  return `Jogar ${venue.name}`
}
