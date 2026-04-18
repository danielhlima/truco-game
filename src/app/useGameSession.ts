import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  getTeamPartnerAdvice,
  getTeamTrucoDecision,
  type PartnerAdvice,
} from "../ai/trucoDecision"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import {
  applyCampaignLoss,
  applyCampaignWin,
  getCurrentCampaignStage,
  getCurrentCampaignVenue,
  isCampaignCompleted,
} from "../career/campaign/progression"
import { buildCampaignSummary } from "../career/campaign/summary"
import type { CampaignStage, CampaignVenue } from "../career/campaign/types"
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
import { canTeamAskForTruco, getBetCallLabel } from "../game/truco"
import type { GameVariant } from "../game/variant"
import {
  loadPlayerProfile,
  resetPlayerProfileStorage,
  savePlayerProfile,
} from "../platform/storage/profileStorage"
import { createInitialPlayerProfile } from "../profile/playerProfile"
import type { PlayerProfile } from "../profile/playerProfile"
import {
  BAR_ROSTER_BY_CAMPAIGN_VENUE_ID,
  BAR_ROSTERS,
  STARTER_PARTNER_CHARACTER_IDS,
  TRUCO_CHARACTER_BY_ID,
  TRUCO_CHARACTER_ROSTER,
  type TrucoCharacterId,
  type TrucoCharacterProfile,
} from "../content/characters"
import { clearLogs, getLogsAsText, logEvent } from "../utils/logger"
import {
  DEFAULT_TRUCO_MESSAGE,
  formatCard,
  getAcceptedBetMessage,
  getBetCallLabelFromNumber,
  getCampaignTrucoSummary,
  getCampaignWinMessage,
  getCurrentTurnLabel,
  getEventMessageForTransition,
  getFollowUpSpeechBubbleForTransition,
  getMatchEndMessage,
  getNextRaiseValueFromPendingTruco,
  getPendingBetText,
  getSpeechBetLabel,
  getSpeechBubbleForTransition,
  getStatusMessage,
  getTrucoMessageForTransition,
  getPlayerLabel,
  type SpeechBubbleState,
} from "./gameSessionHelpers"
import { getRuleSet } from "../game/getRuleSet"

const DEBUG_MODE = true
type MenuScreen = "start" | "character-select"

interface DebugVenueOption {
  id: string
  label: string
}

export function useGameSession() {
  const AUTO_STEP_DELAY_MS = 820
  const NEXT_HAND_DELAY_MS = 1180
  const BUBBLE_DURATION_MS = 1500
  const [variant, setVariant] = useState<GameVariant>("MINEIRO")
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(loadPlayerProfile)
  const [handState, setHandState] = useState<HandState | null>(null)
  const [matchState, setMatchState] = useState<MatchState | null>(null)
  const [logs, setLogs] = useState("")
  const [eventMessage, setEventMessage] = useState("")
  const [trucoMessage, setTrucoMessage] = useState(DEFAULT_TRUCO_MESSAGE)
  const [speechBubble, setSpeechBubble] = useState<SpeechBubbleState | null>(null)
  const [dealAnimationNonce, setDealAnimationNonce] = useState(0)
  const [shownPartnerAdviceKey, setShownPartnerAdviceKey] = useState<string | null>(null)
  const [shownPartnerConsultKey, setShownPartnerConsultKey] = useState<string | null>(null)
  const [debugVenueId, setDebugVenueId] = useState("")
  const [sessionDebugVenueId, setSessionDebugVenueId] = useState<string | null>(null)
  const [menuScreen, setMenuScreen] = useState<MenuScreen>("start")
  const speechBubbleTimeoutRef = useRef<number | null>(null)
  const followUpSpeechTimeoutRef = useRef<number | null>(null)
  const partnerAdviceTimeoutRef = useRef<number | null>(null)
  const partnerConsultTimeoutRef = useRef<number | null>(null)
  const partnerConsultResolutionTimeoutRef = useRef<number | null>(null)
  const lastPartnerAdviceKeyRef = useRef<string | null>(null)
  const lastPartnerConsultKeyRef = useRef<string | null>(null)
  const lastDealAnimationKeyRef = useRef<string | null>(null)

  const actualCampaignStage =
    getCurrentCampaignStage(playerProfile, CAMPAIGN_STAGES) ?? CAMPAIGN_STAGES[0]
  const actualCampaignVenue = getCurrentCampaignVenue(playerProfile, CAMPAIGN_STAGES)
  const campaignCompleted = isCampaignCompleted(playerProfile, CAMPAIGN_STAGES)
  const debugVenueLookup = useMemo(() => {
    const lookup = new Map<
      string,
      {
        stage: CampaignStage
        venue: CampaignVenue
      }
    >()

    CAMPAIGN_STAGES.forEach((stage) => {
      stage.venues.forEach((venue) => {
        lookup.set(venue.id, { stage, venue })
      })
    })

    return lookup
  }, [])
  const debugVenueOptions = useMemo<DebugVenueOption[]>(() => {
    return CAMPAIGN_STAGES.flatMap((stage) =>
      stage.venues.map((venue) => ({
        id: venue.id,
        label: `${stage.name} · ${venue.name}`,
      }))
    )
  }, [])
  const selectedDebugVenue = debugVenueId ? debugVenueLookup.get(debugVenueId)?.venue ?? null : null
  const selectedDebugStage = debugVenueId ? debugVenueLookup.get(debugVenueId)?.stage ?? null : null
  const sessionDebugVenue = sessionDebugVenueId
    ? debugVenueLookup.get(sessionDebugVenueId)?.venue ?? null
    : null
  const sessionDebugStage = sessionDebugVenueId
    ? debugVenueLookup.get(sessionDebugVenueId)?.stage ?? null
    : null
  const currentCampaignVenue = sessionDebugVenue ?? selectedDebugVenue ?? actualCampaignVenue
  const currentCampaignStage = sessionDebugStage ?? selectedDebugStage ?? actualCampaignStage
  const selectableCharacters = useMemo(
    () =>
      STARTER_PARTNER_CHARACTER_IDS.map((characterId) => TRUCO_CHARACTER_BY_ID[characterId]).filter(
        (character) => !!character.avatarAsset
      ),
    []
  )
  const [selectedCharacterId, setSelectedCharacterId] = useState<TrucoCharacterId>(
    () => selectableCharacters[0]?.id ?? "nega-catimbo"
  )
  const [selectedPartnerCharacterId, setSelectedPartnerCharacterId] = useState<TrucoCharacterId>(
    () => selectableCharacters[0]?.id ?? "nega-catimbo"
  )
  const selectedCharacter =
    selectableCharacters.find((character) => character.id === selectedCharacterId) ??
    selectableCharacters[0] ??
    null
  const selectedPartnerCharacter =
    selectableCharacters.find((character) => character.id === selectedPartnerCharacterId) ??
    selectableCharacters[0] ??
    null
  const selectedCharacterIndex = selectedCharacter
    ? selectableCharacters.findIndex((character) => character.id === selectedCharacter.id)
    : -1
  const partnerAiPersonalityId = selectedPartnerCharacter?.personalityId ?? "conservative"
  const currentBarRoster = useMemo(() => {
    const rosterId = currentCampaignVenue
      ? BAR_ROSTER_BY_CAMPAIGN_VENUE_ID[currentCampaignVenue.id]
      : undefined

    return rosterId ? BAR_ROSTERS[rosterId] : null
  }, [currentCampaignVenue])
  const opponentCharacters = useMemo<TrucoCharacterProfile[]>(() => {
    if (!currentBarRoster) {
      return TRUCO_CHARACTER_ROSTER.filter((character) => character.role === "opponent").slice(0, 2)
    }

    return currentBarRoster
      .map((characterId) => TRUCO_CHARACTER_BY_ID[characterId])
      .filter(Boolean)
      .slice(0, 2)
  }, [currentBarRoster])
  const opponentAiPersonalityId = opponentCharacters[0]?.personalityId ?? "balanced"
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

  const partnerAdviceKey = useMemo(() => {
    if (
      !handState ||
      handState.finished ||
      handState.truco.phase !== "awaiting-response" ||
      handState.truco.awaitingResponseFromTeam !== "A" ||
      handState.truco.awaitingResponseFromPlayerId !== 1 ||
      handState.truco.promptKind !== "request" ||
      handState.truco.requestedByTeam !== "B" ||
      !handState.truco.proposedBet
    ) {
      return null
    }

    return [
      handState.roundNumber,
      handState.truco.requestedByPlayerId ?? 0,
      handState.truco.proposedBet,
      handState.truco.promptKind ?? "request",
    ].join(":")
  }, [handState])

  const partnerConsultKey = useMemo(() => {
    if (
      !handState ||
      handState.finished ||
      handState.truco.phase !== "awaiting-response" ||
      handState.truco.awaitingResponseFromTeam !== "A" ||
      handState.truco.awaitingResponseFromPlayerId !== 3 ||
      handState.truco.promptKind !== "request" ||
      handState.truco.requestedByTeam !== "B" ||
      !handState.truco.proposedBet
    ) {
      return null
    }

    return [
      handState.roundNumber,
      handState.truco.requestedByPlayerId ?? 0,
      handState.truco.proposedBet,
      handState.truco.promptKind ?? "request",
      "consult",
    ].join(":")
  }, [handState])

  const canHumanRespondToTruco =
    !!handState &&
    !handState.finished &&
    handState.truco.phase === "awaiting-response" &&
    handState.truco.awaitingResponseFromTeam === "A" &&
    handState.truco.awaitingResponseFromPlayerId === 1 &&
    (!partnerAdviceKey || shownPartnerAdviceKey === partnerAdviceKey)

  const canHumanAdvisePartner =
    !!handState &&
    !handState.finished &&
    handState.truco.phase === "awaiting-response" &&
    handState.truco.awaitingResponseFromTeam === "A" &&
    handState.truco.awaitingResponseFromPlayerId === 3 &&
    handState.truco.promptKind === "request" &&
    handState.truco.requestedByTeam === "B" &&
    (!partnerConsultKey || shownPartnerConsultKey === partnerConsultKey)

  const canRequestTruco =
    !!handState &&
    !!matchState &&
    !handState.finished &&
    handState.currentPlayerId === 1 &&
    handState.table.length < 4 &&
    handState.truco.phase === "idle" &&
    canTeamAskForTruco(matchState.score, "A") &&
    (
      handState.currentBet === 1 ||
      !handState.truco.nextRaiseByTeam ||
      handState.truco.nextRaiseByTeam === "A"
    )

  const canHumanRaiseTruco =
    !!handState &&
    !!matchState &&
    canHumanRespondToTruco &&
    canTeamAskForTruco(matchState.score, "A") &&
    getNextRaiseValueFromPendingTruco(handState) !== null

  const canPlayHumanCard =
    !!handState &&
    !handState.finished &&
    handState.currentPlayerId === 1 &&
    handState.table.length < 4 &&
    handState.truco.phase === "idle"

  const statusMessage = getStatusMessage(handState)
  const currentTurnLabel = getCurrentTurnLabel(handState)
  const handScoreLabel = handState
    ? `Nós ${handState.score.A} x ${handState.score.B} Eles`
    : "Nós 0 x 0 Eles"
  const matchScoreLabel = matchState
    ? `Nós ${matchState.score.A} x ${matchState.score.B} Eles`
    : "Nós 0 x 0 Eles"
  const campaignSummary = buildCampaignSummary(CAMPAIGN_STAGES)

  useEffect(() => {
    if (!selectedCharacter && selectableCharacters[0]) {
      setSelectedCharacterId(selectableCharacters[0].id)
    }
  }, [selectedCharacter, selectableCharacters])

  useEffect(() => {
    if (!selectedPartnerCharacter && selectableCharacters[0]) {
      setSelectedPartnerCharacterId(selectableCharacters[0].id)
    }
  }, [selectedPartnerCharacter, selectableCharacters])

  const syncLogs = useCallback(() => {
    setLogs(getLogsAsText())
  }, [])

  const showSpeechBubble = useCallback((nextSpeechBubble: SpeechBubbleState | null) => {
    if (speechBubbleTimeoutRef.current) {
      window.clearTimeout(speechBubbleTimeoutRef.current)
      speechBubbleTimeoutRef.current = null
    }
    if (followUpSpeechTimeoutRef.current) {
      window.clearTimeout(followUpSpeechTimeoutRef.current)
      followUpSpeechTimeoutRef.current = null
    }

    setSpeechBubble(nextSpeechBubble)

    if (!nextSpeechBubble) {
      return
    }

    logEvent(`Balão ${getPlayerLabel(nextSpeechBubble.playerId)}: ${nextSpeechBubble.text}`)

    speechBubbleTimeoutRef.current = window.setTimeout(() => {
      setSpeechBubble((current) =>
        current === nextSpeechBubble ? null : current
      )
      speechBubbleTimeoutRef.current = null
    }, BUBBLE_DURATION_MS)
  }, [BUBBLE_DURATION_MS])

  const applyHandState = useCallback((
    nextState: HandState,
    explicitMessages?: {
      eventMessage?: string
      trucoMessage?: string
      speechBubble?: SpeechBubbleState | null
      followUpSpeechBubble?: SpeechBubbleState | null
    }
  ) => {
    const hasExplicitSpeechBubble =
      !!explicitMessages && Object.prototype.hasOwnProperty.call(explicitMessages, "speechBubble")
    const hasExplicitFollowUpSpeechBubble =
      !!explicitMessages &&
      Object.prototype.hasOwnProperty.call(explicitMessages, "followUpSpeechBubble")

    const nextEventMessage =
      explicitMessages?.eventMessage ?? getEventMessageForTransition(handState, nextState)
    const nextTrucoMessage =
      explicitMessages?.trucoMessage ?? getTrucoMessageForTransition(handState, nextState)
    const nextSpeechBubble =
      hasExplicitSpeechBubble
        ? explicitMessages?.speechBubble ?? null
        : getSpeechBubbleForTransition(handState, nextState)
    const nextFollowUpSpeechBubble =
      hasExplicitFollowUpSpeechBubble
        ? explicitMessages?.followUpSpeechBubble ?? null
        : getFollowUpSpeechBubbleForTransition(handState, nextState)

    setHandState(nextState)
    showSpeechBubble(nextSpeechBubble)

    if (nextSpeechBubble && nextFollowUpSpeechBubble) {
      followUpSpeechTimeoutRef.current = window.setTimeout(() => {
        setSpeechBubble(nextFollowUpSpeechBubble)
        logEvent(
          `Balão ${getPlayerLabel(nextFollowUpSpeechBubble.playerId)}: ${nextFollowUpSpeechBubble.text}`
        )
        speechBubbleTimeoutRef.current = window.setTimeout(() => {
          setSpeechBubble((current) =>
            current === nextFollowUpSpeechBubble ? null : current
          )
          speechBubbleTimeoutRef.current = null
        }, BUBBLE_DURATION_MS)
        followUpSpeechTimeoutRef.current = null
      }, BUBBLE_DURATION_MS + 120)
    }

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

        if (sessionDebugVenueId) {
          const debugVenueName = sessionDebugVenue?.name ?? currentCampaignVenue?.name ?? "local de debug"
          setEventMessage(
            nextState.winner === "A"
              ? `Vitória no modo debug em ${debugVenueName}.`
              : `Derrota no modo debug em ${debugVenueName}.`
          )
          setTrucoMessage("Partida de teste finalizada. O progresso da campanha não foi alterado.")
        } else if (nextState.winner === "A") {
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
  }, [
    currentCampaignVenue,
    handState,
    matchState,
    playerProfile,
    sessionDebugVenue,
    sessionDebugVenueId,
    showSpeechBubble,
    syncLogs,
  ])

  function handleStartHand() {
    if (!currentCampaignVenue) return

    clearLogs()

    const firstPlayerId = 1
    const state = createHandState(activeVariant, firstPlayerId)

    setVariant(activeVariant)
    setMatchState(createMatchState(activeVariant, firstPlayerId))
    setSessionDebugVenueId(DEBUG_MODE && debugVenueId ? debugVenueId : null)
    setMenuScreen("start")

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
    setSessionDebugVenueId(null)
    setMenuScreen("start")
    setEventMessage("Campanha reiniciada do zero.")
    setTrucoMessage("Tudo pronto para voltar ao primeiro boteco.")
    showSpeechBubble(null)
    setShownPartnerAdviceKey(null)
    syncLogs()
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

    const nextState = requestTruco(handState, 1, matchState?.score)
    const requestedBet = nextState.truco.proposedBet
    applyHandState(nextState, {
      eventMessage: requestedBet
        ? `Você pediu ${getBetCallLabel(requestedBet)}.`
        : "Você pediu aumento.",
      trucoMessage: requestedBet
        ? `Nosso time pediu ${getBetCallLabel(requestedBet)}. Aguardando resposta deles.`
        : "Nosso time pediu aumento. Aguardando resposta deles.",
      speechBubble: requestedBet
        ? { playerId: 1, text: getSpeechBetLabel(requestedBet) }
        : null,
    })
  }

  function handleAcceptTruco() {
    if (!handState || !canHumanRespondToTruco) return

    const nextState = respondToTruco(handState, "accept", matchState?.score)
    const acceptedBet = nextState.currentBet
    applyHandState(nextState, {
      eventMessage: `Você aceitou ${getBetCallLabel(acceptedBet)}.`,
      trucoMessage: getAcceptedBetMessage(acceptedBet),
    })
  }

  function handleRunFromTruco() {
    if (!handState || !canHumanRespondToTruco) return

    const nextState = respondToTruco(handState, "run", matchState?.score)
    applyHandState(nextState, {
      eventMessage: `Você correu de ${getPendingBetText(handState)}.`,
      trucoMessage: `Nosso time correu de ${getPendingBetText(handState)}.`,
      speechBubble: { playerId: 1, text: "TÔ FORA!" },
    })
  }

  function handleRaiseTruco() {
    if (!handState || !canHumanRaiseTruco) return

    const requestedValue = getNextRaiseValueFromPendingTruco(handState)
    const nextState = respondToTruco(handState, "raise", matchState?.score)

    applyHandState(nextState, {
      eventMessage: requestedValue
        ? `Você aceitou e pediu ${getBetCallLabelFromNumber(requestedValue)}.`
        : "Você aceitou e pediu aumento.",
      trucoMessage: requestedValue
        ? `Nosso time pediu ${getBetCallLabelFromNumber(requestedValue)}. Aguardando resposta deles.`
        : "Nosso time pediu aumento. Aguardando resposta deles.",
      speechBubble: requestedValue
        ? { playerId: 1, text: getSpeechBetLabel(requestedValue) }
        : { playerId: 1, text: "DESCE!" },
    })
  }

  function handlePartnerAdvice(advice: PartnerAdvice) {
    if (!handState || !canHumanAdvisePartner || !player1 || !player3) return

    showSpeechBubble({ playerId: 1, text: advice })
    setShownPartnerConsultKey(partnerConsultKey)

    partnerConsultResolutionTimeoutRef.current = window.setTimeout(() => {
      const ruleSet = getRuleSet(handState.variant)
      const fallbackDecision = getTeamTrucoDecision(
        ruleSet,
        [player1.hand, player3.hand],
        handState.truco.proposedBet!,
        handState.vira,
        partnerAiPersonalityId
      )

      const decision =
        advice === "MELHOR CORRER!"
          ? "run"
          : advice === "BORA!"
            ? "accept"
            : fallbackDecision

      const nextState = respondToTruco(handState, decision, matchState?.score)

      if (decision === "run") {
        applyHandState(nextState, {
          eventMessage: `A parceira correu de ${getPendingBetText(handState)}.`,
          trucoMessage: `Nosso time correu de ${getPendingBetText(handState)}.`,
          speechBubble: null,
        })
        partnerConsultResolutionTimeoutRef.current = null
        return
      }

      if (decision === "raise") {
        const requestedValue = nextState.truco.proposedBet
        applyHandState(nextState, {
          eventMessage: requestedValue
            ? `A parceira aceitou e pediu ${getBetCallLabelFromNumber(requestedValue)}.`
            : "A parceira aceitou e pediu aumento.",
          trucoMessage: requestedValue
            ? `Nosso time pediu ${getBetCallLabelFromNumber(requestedValue)}. Aguardando resposta deles.`
            : "Nosso time pediu aumento. Aguardando resposta deles.",
          speechBubble: null,
        })
        partnerConsultResolutionTimeoutRef.current = null
        return
      }

      const acceptedBet = nextState.currentBet
      applyHandState(nextState, {
        eventMessage: `A parceira aceitou ${getBetCallLabel(acceptedBet)}.`,
        trucoMessage: getAcceptedBetMessage(acceptedBet),
        speechBubble: null,
      })
      partnerConsultResolutionTimeoutRef.current = null
    }, BUBBLE_DURATION_MS + 120)
  }

  useEffect(() => {
    if (!handState || !matchState || matchState.finished) {
      return
    }

    if (canHumanRespondToTruco || canHumanAdvisePartner || canPlayHumanCard) {
      return
    }

    let dealTriggerTimeoutId: number | null = null

    if (handState.finished) {
      const dealAnimationKey = `${matchState.handNumber}:${handState.roundNumber}:${handState.winner ?? "none"}`

      if (lastDealAnimationKeyRef.current !== dealAnimationKey) {
        lastDealAnimationKeyRef.current = dealAnimationKey
        dealTriggerTimeoutId = window.setTimeout(() => {
          setDealAnimationNonce((current) => current + 1)
        }, 0)
      }
    }

    const timeoutId = window.setTimeout(() => {
      if (handState.finished) {
        const nextStartingPlayerId = matchState.startingPlayerId
        const nextHandNumber = matchState.handNumber
        const nextState = createHandState(activeVariant, nextStartingPlayerId)

        applyHandState(nextState, {
          eventMessage: `Mão ${nextHandNumber} iniciada.`,
          trucoMessage: DEFAULT_TRUCO_MESSAGE,
          speechBubble: null,
        })
        return
      }

      const nextState = stepHand(handState, {
        A: partnerAiPersonalityId,
        B: opponentAiPersonalityId,
      }, matchState.score)
      applyHandState(nextState)
    }, handState.finished ? NEXT_HAND_DELAY_MS : AUTO_STEP_DELAY_MS)

    return () => {
      if (dealTriggerTimeoutId) {
        window.clearTimeout(dealTriggerTimeoutId)
      }
      window.clearTimeout(timeoutId)
    }
  }, [
    activeVariant,
    applyHandState,
    canHumanAdvisePartner,
    canHumanRespondToTruco,
    canPlayHumanCard,
    handState,
    matchState,
  ])

  useEffect(() => {
    return () => {
      if (speechBubbleTimeoutRef.current) {
        window.clearTimeout(speechBubbleTimeoutRef.current)
      }
      if (followUpSpeechTimeoutRef.current) {
        window.clearTimeout(followUpSpeechTimeoutRef.current)
      }
      if (partnerAdviceTimeoutRef.current) {
        window.clearTimeout(partnerAdviceTimeoutRef.current)
      }
      if (partnerConsultTimeoutRef.current) {
        window.clearTimeout(partnerConsultTimeoutRef.current)
      }
      if (partnerConsultResolutionTimeoutRef.current) {
        window.clearTimeout(partnerConsultResolutionTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!partnerAdviceKey || !handState) {
      lastPartnerAdviceKeyRef.current = null
      if (partnerAdviceTimeoutRef.current) {
        window.clearTimeout(partnerAdviceTimeoutRef.current)
        partnerAdviceTimeoutRef.current = null
      }
      return
    }

    const adviceKey = partnerAdviceKey

    if (lastPartnerAdviceKeyRef.current === adviceKey) {
      return
    }

    lastPartnerAdviceKeyRef.current = adviceKey

    const partnerAdvice = getTeamPartnerAdvice(
      getRuleSet(handState.variant),
      [player1?.hand ?? [], player3?.hand ?? []],
      handState.truco.proposedBet!,
      handState.vira,
      partnerAiPersonalityId
    )

    partnerAdviceTimeoutRef.current = window.setTimeout(() => {
      showSpeechBubble({
        playerId: 3,
        text: partnerAdvice,
      })
      setShownPartnerAdviceKey(adviceKey)
      partnerAdviceTimeoutRef.current = null
    }, BUBBLE_DURATION_MS + 120)

    return () => {
      if (partnerAdviceTimeoutRef.current) {
        window.clearTimeout(partnerAdviceTimeoutRef.current)
        partnerAdviceTimeoutRef.current = null
      }
    }
  }, [
    BUBBLE_DURATION_MS,
    handState,
    partnerAdviceKey,
    player1,
    player3,
    showSpeechBubble,
  ])

  useEffect(() => {
    if (!partnerConsultKey) {
      lastPartnerConsultKeyRef.current = null
      if (partnerConsultTimeoutRef.current) {
        window.clearTimeout(partnerConsultTimeoutRef.current)
        partnerConsultTimeoutRef.current = null
      }
      return
    }

    const consultKey = partnerConsultKey

    if (lastPartnerConsultKeyRef.current === consultKey) {
      return
    }

    lastPartnerConsultKeyRef.current = consultKey

    partnerConsultTimeoutRef.current = window.setTimeout(() => {
      showSpeechBubble({
        playerId: 3,
        text: "E AÍ, PARCEIRO?",
      })
      setShownPartnerConsultKey(consultKey)
      partnerConsultTimeoutRef.current = null
    }, BUBBLE_DURATION_MS + 120)

    return () => {
      if (partnerConsultTimeoutRef.current) {
        window.clearTimeout(partnerConsultTimeoutRef.current)
        partnerConsultTimeoutRef.current = null
      }
    }
  }, [BUBBLE_DURATION_MS, partnerConsultKey, showSpeechBubble])

  async function handleCopyLogs() {
    try {
      await navigator.clipboard.writeText(logs)
      alert("Log copiado com sucesso!")
    } catch {
      alert("Não foi possível copiar automaticamente. Copie manualmente.")
    }
  }

  function handleOpenCharacterSelect() {
    setMenuScreen("character-select")
  }

  function handleCloseCharacterSelect() {
    setSelectedCharacterId(selectedPartnerCharacterId)
    setMenuScreen("start")
  }

  function handleConfirmCharacterSelect() {
    if (!selectedCharacter) return

    setSelectedPartnerCharacterId(selectedCharacter.id)
    setMenuScreen("start")
  }

  function handleSelectNextCharacter() {
    if (selectableCharacters.length === 0) return

    const currentIndex = selectableCharacters.findIndex(
      (character) => character.id === selectedCharacterId
    )
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % selectableCharacters.length : 0
    setSelectedCharacterId(selectableCharacters[nextIndex].id)
  }

  function handleSelectPreviousCharacter() {
    if (selectableCharacters.length === 0) return

    const currentIndex = selectableCharacters.findIndex(
      (character) => character.id === selectedCharacterId
    )
    const previousIndex =
      currentIndex >= 0
        ? (currentIndex - 1 + selectableCharacters.length) % selectableCharacters.length
        : 0
    setSelectedCharacterId(selectableCharacters[previousIndex].id)
  }

  return {
    activeVariant,
    canHumanRespondToTruco,
    canHumanAdvisePartner,
    canPlayHumanCard,
    canHumanRaiseTruco,
    canRequestTruco,
    campaignCompleted,
    campaignSummary,
    currentCampaignStage,
    currentCampaignVenue,
    currentTurnLabel,
    currentVenueWins,
    debugModeEnabled: DEBUG_MODE,
    debugVenueId,
    debugVenueOptions,
    dealAnimationNonce,
    eventMessage,
    handScoreLabel,
    handState,
    handleAcceptTruco,
    handleCopyLogs,
    handlePlayCard,
    handlePartnerAdvice,
    handleRaiseTruco,
    handleRequestTruco,
    handleResetCampaign,
    handleRunFromTruco,
    handleStartHand,
    lastPlayedPlayerId,
    logs,
    matchScoreLabel,
    matchState,
    menuScreen,
    player1,
    player2,
    player3,
    player4,
    playerProfile,
    selectedCharacter,
    selectedCharacterIndex,
    selectedPartnerCharacter,
    selectableCharacters,
    setVariant,
    setDebugVenueId,
    statusMessage,
    speechBubble,
    tableByPlayer,
    trucoMessage,
    variant,
    variantSelectionDisabled,
    opponentCharacters,
    handleCloseCharacterSelect,
    handleConfirmCharacterSelect,
    handleOpenCharacterSelect,
    handleSelectNextCharacter,
    handleSelectPreviousCharacter,
  }
}
