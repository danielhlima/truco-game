import { useEffect, useMemo, useState } from "react"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import {
  applyCampaignLoss,
  applyCampaignWin,
  getCurrentCampaignStage,
  getCurrentCampaignVenue,
  isCampaignCompleted,
} from "../career/campaign/progression"
import { buildCampaignSummary } from "../career/campaign/summary"
import { createHandState } from "../game/createHandState"
import type { Card } from "../game/card"
import type { HandState } from "../game/handState"
import {
  applyCompletedHandToMatch,
  createMatchState,
  type MatchState,
} from "../game/matchState"
import { playHumanCard } from "../game/playHumanCard"
import { requestTruco } from "../game/requestTruco"
import { respondToTruco } from "../game/respondToTruco"
import { stepHand } from "../game/stepHand"
import { getBetCallLabel } from "../game/truco"
import type { GameVariant } from "../game/variant"
import {
  loadPlayerProfile,
  resetPlayerProfileStorage,
  savePlayerProfile,
} from "../platform/storage/profileStorage"
import { createInitialPlayerProfile } from "../profile/playerProfile"
import type { PlayerProfile } from "../profile/playerProfile"
import { clearLogs, getLogsAsText } from "../utils/logger"
import {
  DEFAULT_TRUCO_MESSAGE,
  formatCard,
  getAcceptedBetMessage,
  getBetCallLabelFromNumber,
  getCampaignTrucoSummary,
  getCampaignWinMessage,
  getCurrentTurnLabel,
  getEventMessageForTransition,
  getMatchEndMessage,
  getNextRaiseValueFromPendingTruco,
  getPendingBetText,
  getStatusMessage,
  getTrucoMessageForTransition,
} from "./gameSessionHelpers"

export function useGameSession() {
  const [variant, setVariant] = useState<GameVariant>("MINEIRO")
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(loadPlayerProfile)
  const [handState, setHandState] = useState<HandState | null>(null)
  const [matchState, setMatchState] = useState<MatchState | null>(null)
  const [logs, setLogs] = useState("")
  const [eventMessage, setEventMessage] = useState("")
  const [trucoMessage, setTrucoMessage] = useState(DEFAULT_TRUCO_MESSAGE)

  const currentCampaignStage =
    getCurrentCampaignStage(playerProfile, CAMPAIGN_STAGES) ?? CAMPAIGN_STAGES[0]
  const currentCampaignVenue = getCurrentCampaignVenue(playerProfile, CAMPAIGN_STAGES)
  const campaignCompleted = isCampaignCompleted(playerProfile, CAMPAIGN_STAGES)
  const activeVariant = handState?.variant ?? variant
  const currentVenueWins = currentCampaignVenue
    ? playerProfile.campaign.venueWinsById[currentCampaignVenue.id] ?? 0
    : 0
  const variantSelectionDisabled = !!matchState && !matchState.finished

  useEffect(() => {
    savePlayerProfile(playerProfile)
  }, [playerProfile])

  const player1 = useMemo(
    () => handState?.players.find((player) => player.id === 1) ?? null,
    [handState]
  )
  const player2 = useMemo(
    () => handState?.players.find((player) => player.id === 2) ?? null,
    [handState]
  )
  const player3 = useMemo(
    () => handState?.players.find((player) => player.id === 3) ?? null,
    [handState]
  )
  const player4 = useMemo(
    () => handState?.players.find((player) => player.id === 4) ?? null,
    [handState]
  )

  const tableByPlayer = useMemo(() => {
    const map: Record<number, Card | undefined> = {}

    handState?.table.forEach((entry) => {
      map[entry.playerId] = entry.card
    })

    return map
  }, [handState])

  const lastPlayedPlayerId = useMemo(() => {
    if (!handState || handState.table.length === 0) {
      return null
    }

    return handState.table[handState.table.length - 1].playerId
  }, [handState])

  const canHumanRespondToTruco =
    !!handState &&
    !handState.finished &&
    handState.truco.phase === "awaiting-response" &&
    handState.truco.awaitingResponseFromTeam === "A"

  const canRequestTruco =
    !!handState &&
    !handState.finished &&
    handState.currentPlayerId === 1 &&
    handState.table.length < 4 &&
    handState.truco.phase === "idle" &&
    (
      handState.currentBet === 1 ||
      !handState.truco.nextRaiseByTeam ||
      handState.truco.nextRaiseByTeam === "A"
    )

  const canPlayHumanCard =
    !!handState &&
    !handState.finished &&
    handState.currentPlayerId === 1 &&
    handState.table.length < 4 &&
    handState.truco.phase === "idle"

  const nextStepDisabled =
    !handState ||
    !!matchState?.finished ||
    canHumanRespondToTruco ||
    (!handState.finished &&
      handState.currentPlayerId === 1 &&
      handState.table.length < 4 &&
      handState.truco.phase === "idle")

  const statusMessage = getStatusMessage(handState)
  const currentTurnLabel = getCurrentTurnLabel(handState)
  const handScoreLabel = handState
    ? `Nós ${handState.score.A} x ${handState.score.B} Eles`
    : "Nós 0 x 0 Eles"
  const matchScoreLabel = matchState
    ? `Nós ${matchState.score.A} x ${matchState.score.B} Eles`
    : "Nós 0 x 0 Eles"
  const campaignSummary = buildCampaignSummary(CAMPAIGN_STAGES)

  function syncLogs() {
    setLogs(getLogsAsText())
  }

  function applyHandState(
    nextState: HandState,
    explicitMessages?: {
      eventMessage?: string
      trucoMessage?: string
    }
  ) {
    const nextEventMessage =
      explicitMessages?.eventMessage ?? getEventMessageForTransition(handState, nextState)
    const nextTrucoMessage =
      explicitMessages?.trucoMessage ?? getTrucoMessageForTransition(handState, nextState)

    setHandState(nextState)

    if (nextEventMessage) {
      setEventMessage(nextEventMessage)
    }

    if (nextTrucoMessage) {
      setTrucoMessage(nextTrucoMessage)
    }

    if (!handState?.finished && nextState.finished && nextState.winner) {
      const nextMatchState = matchState
        ? applyCompletedHandToMatch(matchState, nextState)
        : null

      if (nextMatchState) {
        setMatchState(nextMatchState)
      }

      if (nextMatchState?.finished) {
        const finalScore = nextMatchState.score

        if (nextState.winner === "A") {
          const resolution = applyCampaignWin(playerProfile, CAMPAIGN_STAGES)
          setPlayerProfile(resolution.profile)
          setEventMessage(getCampaignWinMessage(finalScore, resolution))
          setTrucoMessage(getCampaignTrucoSummary(resolution))
        } else {
          const resolution = applyCampaignLoss(playerProfile, CAMPAIGN_STAGES)
          setPlayerProfile(resolution.profile)
          setEventMessage(getMatchEndMessage(nextState.winner, finalScore))
          setTrucoMessage(
            resolution.currentVenue
              ? `Derrota no local ${resolution.currentVenue.name}. Você pode tentar novamente.`
              : "Derrota registrada na campanha."
          )
        }
      }
    }

    syncLogs()
  }

  function handleStartHand() {
    if (!currentCampaignVenue) return

    clearLogs()

    const firstPlayerId = 1
    const state = createHandState(activeVariant, firstPlayerId)

    setVariant(activeVariant)
    setMatchState(createMatchState(activeVariant, firstPlayerId))

    applyHandState(state, {
      eventMessage: `Partida iniciada em ${currentCampaignVenue.name}.`,
      trucoMessage: currentCampaignVenue.entryNarrative,
    })
  }

  function handleResetCampaign() {
    clearLogs()
    resetPlayerProfileStorage()
    setPlayerProfile(createInitialPlayerProfile())
    setVariant("MINEIRO")
    setHandState(null)
    setMatchState(null)
    setEventMessage("Campanha reiniciada do zero.")
    setTrucoMessage("Tudo pronto para voltar ao primeiro boteco.")
    syncLogs()
  }

  function handleNextStep() {
    if (!handState) return
    if (matchState?.finished) return

    if (handState.finished) {
      if (!matchState) return

      const nextStartingPlayerId = matchState.startingPlayerId
      const nextHandNumber = matchState.handNumber
      const nextState = createHandState(activeVariant, nextStartingPlayerId)

      applyHandState(nextState, {
        eventMessage: `Mão ${nextHandNumber} iniciada.`,
        trucoMessage: DEFAULT_TRUCO_MESSAGE,
      })
      return
    }

    const nextState = stepHand(handState)
    applyHandState(nextState)
  }

  function handlePlayCard(card: Card) {
    if (!handState) return
    if (handState.finished) return
    if (handState.currentPlayerId !== 1) return
    if (handState.table.length === 4) return
    if (handState.truco.phase !== "idle") return

    const nextState = playHumanCard(handState, card)
    applyHandState(nextState, {
      eventMessage: `Você jogou ${formatCard(card)}.`,
    })
  }

  function handleRequestTruco() {
    if (!handState) return
    if (!canRequestTruco) return

    const nextState = requestTruco(handState, 1)
    const requestedBet = nextState.truco.proposedBet
    applyHandState(nextState, {
      eventMessage: requestedBet
        ? `Você pediu ${getBetCallLabel(requestedBet)}.`
        : "Você pediu aumento.",
      trucoMessage: requestedBet
        ? `Nosso time pediu ${getBetCallLabel(requestedBet)}. Aguardando resposta deles.`
        : "Nosso time pediu aumento. Aguardando resposta deles.",
    })
  }

  function handleAcceptTruco() {
    if (!handState || !canHumanRespondToTruco) return

    const nextState = respondToTruco(handState, "accept")
    const acceptedBet = nextState.currentBet
    applyHandState(nextState, {
      eventMessage: `Você aceitou ${getBetCallLabel(acceptedBet)}.`,
      trucoMessage: getAcceptedBetMessage(acceptedBet),
    })
  }

  function handleRunFromTruco() {
    if (!handState || !canHumanRespondToTruco) return

    const nextState = respondToTruco(handState, "run")
    applyHandState(nextState, {
      eventMessage: `Você correu de ${getPendingBetText(handState)}.`,
      trucoMessage: `Nosso time correu de ${getPendingBetText(handState)}.`,
    })
  }

  function handleRaiseTruco() {
    if (!handState || !canHumanRespondToTruco) return

    const requestedValue = getNextRaiseValueFromPendingTruco(handState)
    const nextState = respondToTruco(handState, "raise")

    applyHandState(nextState, {
      eventMessage: requestedValue
        ? `Você aceitou e pediu ${getBetCallLabelFromNumber(requestedValue)}.`
        : "Você aceitou e pediu aumento.",
      trucoMessage: requestedValue
        ? `Nosso time pediu ${getBetCallLabelFromNumber(requestedValue)}. Aguardando resposta deles.`
        : "Nosso time pediu aumento. Aguardando resposta deles.",
    })
  }

  async function handleCopyLogs() {
    try {
      await navigator.clipboard.writeText(logs)
      alert("Log copiado com sucesso!")
    } catch {
      alert("Não foi possível copiar automaticamente. Copie manualmente.")
    }
  }

  return {
    activeVariant,
    canHumanRespondToTruco,
    canPlayHumanCard,
    canRequestTruco,
    campaignCompleted,
    campaignSummary,
    currentCampaignStage,
    currentCampaignVenue,
    currentTurnLabel,
    currentVenueWins,
    eventMessage,
    handScoreLabel,
    handState,
    handleAcceptTruco,
    handleCopyLogs,
    handleNextStep,
    handlePlayCard,
    handleRaiseTruco,
    handleRequestTruco,
    handleResetCampaign,
    handleRunFromTruco,
    handleStartHand,
    lastPlayedPlayerId,
    logs,
    matchScoreLabel,
    matchState,
    nextStepDisabled,
    player1,
    player2,
    player3,
    player4,
    playerProfile,
    setVariant,
    statusMessage,
    tableByPlayer,
    trucoMessage,
    variant,
    variantSelectionDisabled,
  }
}
