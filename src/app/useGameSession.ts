import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  getTeamTrucoDecisionFromPartnerAdvice,
  getTeamPartnerAdvice,
  type PartnerAdvice,
} from "../ai/trucoDecision"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import {
  applyCampaignLoss,
  applyCampaignWin,
  getCurrentCampaignStage,
  getCurrentCampaignVenue,
  isCampaignCompleted,
  type CampaignResolution,
} from "../career/campaign/progression"
import { buildCampaignSummary } from "../career/campaign/summary"
import type { CampaignStage, CampaignVenue } from "../career/campaign/types"
import type { Card } from "../game/card"
import type { HandState } from "../game/handState"
import {
  applyCompletedHandToMatch,
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
  TRUCO_CHARACTER_BY_ID,
  TRUCO_CHARACTER_ROSTER,
  type TrucoCharacterId,
  type TrucoCharacterProfile,
} from "../content/characters"
import { STARTER_PARTNER_CHARACTER_IDS } from "../content/partnerProgression"
import {
  DEFAULT_PLAYER_SKIN_ID,
  PLAYER_SKINS,
  getPlayerSkinById,
  type PlayerSkinId,
} from "../content/playerSkins"
import { clearLogs, getLogsAsText, logEvent } from "../utils/logger"
import {
  DEFAULT_TRUCO_MESSAGE,
  createNextHandStateForMatch,
  createVenueMatchState,
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
  shouldPartnerConsultHuman,
  type SpeechBubbleState,
} from "./gameSessionHelpers"
import { getRuleSet } from "../game/getRuleSet"

const DEBUG_MODE = true
type MenuScreen =
  | "start"
  | "journey-intro"
  | "player-skin-select"
  | "character-select"
  | "venue-intro"
  | "campaign-victory"
  | "match-result"

interface MatchResultScreenState {
  hostLine: string
  outcome: "win" | "loss"
  progressionText?: string
  progressionTitle?: string
  title: string
  subtitle: string
  venueId?: string
  venueName: string
}

interface CampaignVictoryScreenState {
  id: string
  kind: "stage" | "venue"
  title: string
}

const DEFINITIVE_VICTORY_VENUE_IDS = new Set([
  "bar-do-ze-catinga",
  "bar-maneco-banguela",
  "trem-do-jaca",
  "adega-do-juca-bigode",
  "zona-norte-garagem",
  "zona-leste-quintal",
  "centro-subsolo",
  "zona-sul-salao",
  "centro-convencoes-prefeitura",
  "ginasio-estadual-maneco-file",
  "arena-nacional",
  "centro-americano-truqueiro-medelin",
  "hotel-truco-segovia-espanha",
  "casino-me-maior",
  "orbita-da-lua",
])

const DEFINITIVE_VICTORY_STAGE_IDS = new Set([
  "rua-periferia",
  "campeonato-vila-nana",
  "zonas-da-cidade",
  "campeonato-estadual",
  "campeonato-nacional",
  "circuito-panamericano",
  "jogos-mundiais",
  "mundial",
  "intergalactico",
])

function buildCampaignVictoryScreens(
  resolution: CampaignResolution
): CampaignVictoryScreenState[] {
  const screens: CampaignVictoryScreenState[] = []

  if (
    resolution.clearedVenue &&
    DEFINITIVE_VICTORY_VENUE_IDS.has(resolution.clearedVenue.id)
  ) {
    screens.push({
      id: resolution.clearedVenue.id,
      kind: "venue",
      title: `${resolution.clearedVenue.name} conquistado`,
    })
  }

  if (
    resolution.clearedStage &&
    DEFINITIVE_VICTORY_STAGE_IDS.has(resolution.clearedStage.id)
  ) {
    screens.push({
      id: resolution.clearedStage.id,
      kind: "stage",
      title: `${resolution.clearedStage.name} concluído`,
    })
  }

  return screens
}

interface DebugVenueOption {
  id: string
  label: string
}

type InGameConfirmationIntent = "swap-partner" | "exit-match" | "reset-progress"
type CharacterSelectReturnScreen = "journey-intro" | "venue-intro"
type GameplayIntroPhase = "background" | "reveal" | "done"

interface InGameConfirmationState {
  intent: InGameConfirmationIntent
  title: string
  message: string
  confirmLabel: string
  warning: string
}

export function useGameSession() {
  const AUTO_STEP_DELAY_MS = 820
  const NEXT_HAND_DELAY_MS = 1180
  const BUBBLE_DURATION_MS = 1500
  const MATCH_RESULT_REVEAL_DELAY_MS = 1000
  const GAMEPLAY_INTRO_BACKGROUND_MS = 1000
  const GAMEPLAY_INTRO_REVEAL_MS = 420
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
  const [debugVenueId, setDebugVenueId] = useState("")
  const [sessionDebugVenueId, setSessionDebugVenueId] = useState<string | null>(null)
  const [menuScreen, setMenuScreen] = useState<MenuScreen>("start")
  const [matchResultScreen, setMatchResultScreen] = useState<MatchResultScreenState | null>(null)
  const [campaignVictoryScreen, setCampaignVictoryScreen] =
    useState<CampaignVictoryScreenState | null>(null)
  const [campaignVictoryQueue, setCampaignVictoryQueue] = useState<CampaignVictoryScreenState[]>([])
  const [inGameContextMenuOpen, setInGameContextMenuOpen] = useState(false)
  const [inGameConfirmation, setInGameConfirmation] = useState<InGameConfirmationState | null>(null)
  const [gameplayIntroPhase, setGameplayIntroPhase] = useState<GameplayIntroPhase>("done")
  const [characterSelectReturnScreen, setCharacterSelectReturnScreen] =
    useState<CharacterSelectReturnScreen>("journey-intro")
  const [launchVenueAfterCharacterSelect, setLaunchVenueAfterCharacterSelect] = useState(false)
  const [selectedPlayerSkinId, setSelectedPlayerSkinId] =
    useState<PlayerSkinId>(DEFAULT_PLAYER_SKIN_ID)
  const speechBubbleTimeoutRef = useRef<number | null>(null)
  const followUpSpeechTimeoutRef = useRef<number | null>(null)
  const partnerAdviceTimeoutRef = useRef<number | null>(null)
  const partnerConsultTimeoutRef = useRef<number | null>(null)
  const partnerConsultResolutionTimeoutRef = useRef<number | null>(null)
  const matchResultRevealTimeoutRef = useRef<number | null>(null)
  const gameplayIntroBackgroundTimeoutRef = useRef<number | null>(null)
  const gameplayIntroRevealTimeoutRef = useRef<number | null>(null)
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
  const currentCampaignVenueId = currentCampaignVenue?.id ?? null
  const selectedPlayerSkin = useMemo(
    () => getPlayerSkinById(playerProfile.settings.selectedPlayerSkinId),
    [playerProfile.settings.selectedPlayerSkinId]
  )
  const hasSelectedPlayerSkin = PLAYER_SKINS.some(
    (skin) => skin.id === playerProfile.settings.selectedPlayerSkinId
  )
  const selectedPlayerSkinCandidate =
    PLAYER_SKINS.find((skin) => skin.id === selectedPlayerSkinId) ?? selectedPlayerSkin
  const selectedPlayerSkinIndex = PLAYER_SKINS.findIndex(
    (skin) => skin.id === selectedPlayerSkinCandidate.id
  )
  const availablePartnerCharacterIdSet = useMemo(
    () =>
      new Set<string>([
        ...STARTER_PARTNER_CHARACTER_IDS,
        ...playerProfile.campaign.unlockedPartnerCharacterIds,
      ]),
    [playerProfile.campaign.unlockedPartnerCharacterIds]
  )
  const selectableCharacters = useMemo(
    () => {
      const characterIds = new Set<TrucoCharacterId>([
        ...STARTER_PARTNER_CHARACTER_IDS,
        ...CAMPAIGN_STAGES.flatMap((stage) =>
          stage.venues.flatMap((venue) => venue.partnerUnlockCharacterIds)
        ),
      ])

      return [...characterIds]
        .map((characterId) => TRUCO_CHARACTER_BY_ID[characterId])
        .filter((character) => !!character.avatarAsset)
    },
    []
  )
  const availablePartnerCharacters = useMemo(
    () =>
      selectableCharacters.filter((character) =>
        availablePartnerCharacterIdSet.has(character.id)
      ),
    [availablePartnerCharacterIdSet, selectableCharacters]
  )
  const [selectedCharacterId, setSelectedCharacterId] = useState<TrucoCharacterId>(
    () => availablePartnerCharacters[0]?.id ?? "nega-catimbo"
  )
  const savedCurrentVenuePartnerCharacterId = currentCampaignVenueId
    ? playerProfile.campaign.selectedPartnerCharacterIdByVenueId[currentCampaignVenueId] ?? null
    : null
  const currentVenuePartnerCharacterId =
    availablePartnerCharacters.find(
      (character) => character.id === savedCurrentVenuePartnerCharacterId
    )?.id ?? null
  const selectedCharacter =
    selectableCharacters.find((character) => character.id === selectedCharacterId) ??
    availablePartnerCharacters[0] ??
    null
  const isSelectedCharacterUnlocked =
    !!selectedCharacter && availablePartnerCharacterIdSet.has(selectedCharacter.id)
  const selectedPartnerCharacter = currentVenuePartnerCharacterId
    ? TRUCO_CHARACTER_BY_ID[currentVenuePartnerCharacterId] ?? availablePartnerCharacters[0] ?? null
    : availablePartnerCharacters[0] ?? null
  const selectedCharacterIndex = selectedCharacter
    ? selectableCharacters.findIndex((character) => character.id === selectedCharacter.id)
    : -1
  const partnerAiPersonalityId = selectedPartnerCharacter?.personalityId ?? "conservative"
  const opponentCharacters = useMemo<TrucoCharacterProfile[]>(() => {
    if (!currentCampaignVenue) {
      return TRUCO_CHARACTER_ROSTER.filter((character) => character.role === "opponent").slice(0, 2)
    }

    return currentCampaignVenue.opponentCharacterIds
      .map((characterId) => TRUCO_CHARACTER_BY_ID[characterId])
      .filter(Boolean)
  }, [currentCampaignVenue])
  const opponentAiPersonalityId = opponentCharacters[0]?.personalityId ?? "balanced"
  const activeVariant = handState?.variant ?? variant
  const currentVenueWins = currentCampaignVenue
    ? playerProfile.campaign.venueWinsById[currentCampaignVenue.id] ?? 0
    : 0
  const variantSelectionDisabled = !!matchState && !matchState.finished
  const isGameplayIntroActive = gameplayIntroPhase !== "done"

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
    if (!shouldPartnerConsultHuman(handState)) {
      return null
    }

    const consultingState = handState!

    return [
      consultingState.roundNumber,
      consultingState.truco.requestedByPlayerId ?? 0,
      consultingState.truco.proposedBet,
      consultingState.truco.promptKind ?? "request",
      "consult",
    ].join(":")
  }, [handState])

  const canHumanRespondToTruco =
    !!handState &&
    !isGameplayIntroActive &&
    !handState.finished &&
    handState.truco.phase === "awaiting-response" &&
    handState.truco.awaitingResponseFromTeam === "A" &&
    handState.truco.awaitingResponseFromPlayerId === 1 &&
    (!partnerAdviceKey || shownPartnerAdviceKey === partnerAdviceKey)

  const canHumanAdvisePartner =
    !isGameplayIntroActive && shouldPartnerConsultHuman(handState)

  const canRequestTruco =
    !!handState &&
    !!matchState &&
    !isGameplayIntroActive &&
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
    !isGameplayIntroActive &&
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
    if (!selectedCharacter && availablePartnerCharacters[0]) {
      setSelectedCharacterId(availablePartnerCharacters[0].id)
    }
  }, [availablePartnerCharacters, selectedCharacter])

  useEffect(() => {
    const preferredCharacterId = currentVenuePartnerCharacterId ?? availablePartnerCharacters[0]?.id

    if (preferredCharacterId) {
      setSelectedCharacterId(preferredCharacterId)
    }
  }, [availablePartnerCharacters, currentCampaignVenueId, currentVenuePartnerCharacterId])

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

  const clearPendingUiTimers = useCallback(() => {
    if (speechBubbleTimeoutRef.current) {
      window.clearTimeout(speechBubbleTimeoutRef.current)
      speechBubbleTimeoutRef.current = null
    }
    if (followUpSpeechTimeoutRef.current) {
      window.clearTimeout(followUpSpeechTimeoutRef.current)
      followUpSpeechTimeoutRef.current = null
    }
    if (partnerAdviceTimeoutRef.current) {
      window.clearTimeout(partnerAdviceTimeoutRef.current)
      partnerAdviceTimeoutRef.current = null
    }
    if (partnerConsultTimeoutRef.current) {
      window.clearTimeout(partnerConsultTimeoutRef.current)
      partnerConsultTimeoutRef.current = null
    }
    if (partnerConsultResolutionTimeoutRef.current) {
      window.clearTimeout(partnerConsultResolutionTimeoutRef.current)
      partnerConsultResolutionTimeoutRef.current = null
    }
    if (matchResultRevealTimeoutRef.current) {
      window.clearTimeout(matchResultRevealTimeoutRef.current)
      matchResultRevealTimeoutRef.current = null
    }
    if (gameplayIntroBackgroundTimeoutRef.current) {
      window.clearTimeout(gameplayIntroBackgroundTimeoutRef.current)
      gameplayIntroBackgroundTimeoutRef.current = null
    }
    if (gameplayIntroRevealTimeoutRef.current) {
      window.clearTimeout(gameplayIntroRevealTimeoutRef.current)
      gameplayIntroRevealTimeoutRef.current = null
    }
  }, [])

  const startGameplayIntro = useCallback(() => {
    if (gameplayIntroBackgroundTimeoutRef.current) {
      window.clearTimeout(gameplayIntroBackgroundTimeoutRef.current)
    }
    if (gameplayIntroRevealTimeoutRef.current) {
      window.clearTimeout(gameplayIntroRevealTimeoutRef.current)
    }

    setGameplayIntroPhase("background")

    gameplayIntroBackgroundTimeoutRef.current = window.setTimeout(() => {
      setGameplayIntroPhase("reveal")
      gameplayIntroBackgroundTimeoutRef.current = null

      gameplayIntroRevealTimeoutRef.current = window.setTimeout(() => {
        setGameplayIntroPhase("done")
        gameplayIntroRevealTimeoutRef.current = null
      }, GAMEPLAY_INTRO_REVEAL_MS)
    }, GAMEPLAY_INTRO_BACKGROUND_MS)
  }, [GAMEPLAY_INTRO_BACKGROUND_MS, GAMEPLAY_INTRO_REVEAL_MS])

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
        const resultVenue = sessionDebugVenue ?? currentCampaignVenue
        const resultVenueName = resultVenue?.name ?? "o bar"
        let matchResultState: MatchResultScreenState =
          nextState.winner === "A"
            ? {
                outcome: "win",
                title: "Vocês levaram essa",
                subtitle: `O clima pesa no fim da queda, mas a mesa inteira viu quem saiu por cima em ${resultVenueName}.`,
                hostLine: `O dono do ${resultVenueName} resmunga: "Ganharam hoje porque a sorte sentou com vocês. Quero ver repetir essa coragem."`,
                venueId: resultVenue?.id,
                venueName: resultVenueName,
              }
            : {
                outcome: "loss",
                title: "A casa falou mais alto",
                subtitle: "O bar cresce para cima de vocês e a derrota fica ecoando na mesa.",
                hostLine: `O dono do ${resultVenueName} abre um sorriso torto: "Aqui é assim. Quem entra achando que vai mandar sai escutando a conversa do balcão."`,
                venueId: resultVenue?.id,
                venueName: resultVenueName,
              }

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
          const nextEventMessage = getCampaignWinMessage(finalScore, resolution)
          const nextTrucoMessage = getCampaignTrucoSummary(resolution)
          const [
            nextCampaignVictoryScreen,
            ...nextCampaignVictoryQueue
          ] = buildCampaignVictoryScreens(resolution)

          if (resolution.campaignCompleted) {
            matchResultState = {
              ...matchResultState,
              title: "Campanha concluída",
              subtitle: `Vocês fecharam a campanha disponível inteira e não deixaram dúvida no ${resultVenueName}.`,
              progressionTitle: "Jornada encerrada",
              progressionText: "Toda a campanha disponível foi concluída. Agora dá para revisitar os bares ou esperar os próximos desafios.",
            }
          } else if (resolution.clearedStage && resolution.unlockedStage) {
            matchResultState = {
              ...matchResultState,
              title: `${resolution.clearedStage.name} concluída`,
              subtitle: `Vocês fecharam ${resultVenueName} e abriram caminho para ${resolution.unlockedStage.name}.`,
              progressionTitle: "Nova fase liberada",
              progressionText:
                resolution.unlockedStage.cutsceneIntro ??
                `A próxima etapa agora é ${resolution.unlockedStage.name}.`,
            }
          } else if (resolution.clearedVenue && resolution.currentVenue) {
            matchResultState = {
              ...matchResultState,
              title: `${resolution.clearedVenue.name} conquistado`,
              subtitle: "Vocês encerraram a fase deste bar e avançaram no circuito.",
              progressionTitle: "Próximo bar liberado",
              progressionText: `Vocês passaram de fase. O próximo destino agora é ${resolution.currentVenue.name}.`,
            }
          } else if (resolution.clearedVenue) {
            matchResultState = {
              ...matchResultState,
              progressionTitle: "Bar concluído",
              progressionText: `Vocês concluíram ${resolution.clearedVenue.name} e seguiram adiante na campanha.`,
            }
          }

          matchResultRevealTimeoutRef.current = window.setTimeout(() => {
            setSpeechBubble(null)
            setHandState(null)
            setMatchState(null)
            setInGameContextMenuOpen(false)
            if (nextCampaignVictoryScreen) {
              setMatchResultScreen(null)
              setCampaignVictoryScreen(nextCampaignVictoryScreen)
              setCampaignVictoryQueue(nextCampaignVictoryQueue)
              setMenuScreen("campaign-victory")
            } else {
              setCampaignVictoryScreen(null)
              setCampaignVictoryQueue([])
              setMatchResultScreen(matchResultState)
              setMenuScreen("match-result")
            }
            setPlayerProfile(resolution.profile)
            setEventMessage(nextEventMessage)
            setTrucoMessage(nextTrucoMessage)
            matchResultRevealTimeoutRef.current = null
          }, MATCH_RESULT_REVEAL_DELAY_MS)
          syncLogs()
          return
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

        setInGameContextMenuOpen(false)
        matchResultRevealTimeoutRef.current = window.setTimeout(() => {
          setSpeechBubble(null)
          setHandState(null)
          setMatchState(null)
          setCampaignVictoryScreen(null)
          setCampaignVictoryQueue([])
          setMatchResultScreen(matchResultState)
          setMenuScreen("match-result")
          matchResultRevealTimeoutRef.current = null
        }, MATCH_RESULT_REVEAL_DELAY_MS)
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

  function startVenueMatch(targetVenue: CampaignVenue) {
    clearLogs()

    const firstPlayerId = 1
    const variantToStart = targetVenue.variant
    const { handState: state, matchState: initialMatchState } =
      createVenueMatchState(targetVenue, firstPlayerId)
    const actualVenueId = actualCampaignVenue?.id ?? null
    const shouldUseSessionDebugVenue =
      DEBUG_MODE && (!!debugVenueId || targetVenue.id !== actualVenueId)

    setVariant(variantToStart)
    setMatchState(initialMatchState)
    setSessionDebugVenueId(shouldUseSessionDebugVenue ? targetVenue.id : null)
    setMatchResultScreen(null)
    setCampaignVictoryScreen(null)
    setCampaignVictoryQueue([])
    setMenuScreen("start")
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setLaunchVenueAfterCharacterSelect(false)
    setCharacterSelectReturnScreen("journey-intro")
    startGameplayIntro()

    applyHandState(state, {
      eventMessage: `Partida iniciada em ${targetVenue.name}.`,
      trucoMessage: targetVenue.entryNarrative,
    })
  }

  function handleLaunchVenue(venueId?: string) {
    const selectedVenueId = venueId ?? currentCampaignVenue?.id ?? null
    const targetVenue = selectedVenueId ? debugVenueLookup.get(selectedVenueId)?.venue ?? null : null
    const actualVenueId = actualCampaignVenue?.id ?? null

    if (!targetVenue) return

    const shouldUseSessionDebugVenue =
      DEBUG_MODE && (!!debugVenueId || targetVenue.id !== actualVenueId)

    setSessionDebugVenueId(shouldUseSessionDebugVenue ? targetVenue.id : null)
    setMatchResultScreen(null)
    setCampaignVictoryScreen(null)
    setCampaignVictoryQueue([])
    setMenuScreen("venue-intro")
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setLaunchVenueAfterCharacterSelect(false)
    setCharacterSelectReturnScreen("journey-intro")
  }

  function handleReturnToJourneyFlow() {
    setSpeechBubble(null)
    clearPendingUiTimers()
    setHandState(null)
    setMatchState(null)
    setMatchResultScreen(null)
    if (campaignVictoryQueue.length > 0) {
      const [nextCampaignVictoryScreen, ...remainingCampaignVictoryQueue] = campaignVictoryQueue
      setCampaignVictoryScreen(nextCampaignVictoryScreen)
      setCampaignVictoryQueue(remainingCampaignVictoryQueue)
      setSessionDebugVenueId(null)
      setInGameContextMenuOpen(false)
      setInGameConfirmation(null)
      setGameplayIntroPhase("done")
      setMenuScreen("campaign-victory")
      return
    }
    setCampaignVictoryScreen(null)
    setCampaignVictoryQueue([])
    setSessionDebugVenueId(null)
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setGameplayIntroPhase("done")
    setMenuScreen("journey-intro")
  }

  function handleStartHand() {
    if (!hasSelectedPlayerSkin) {
      setSelectedPlayerSkinId(selectedPlayerSkin.id)
      setMenuScreen("player-skin-select")
      return
    }

    setMenuScreen("journey-intro")
  }

  function handleClosePlayerSkinSelect() {
    setSelectedPlayerSkinId(selectedPlayerSkin.id)
    setMenuScreen("start")
  }

  function handleConfirmPlayerSkinSelect() {
    setPlayerProfile((currentProfile) => ({
      ...currentProfile,
      settings: {
        ...currentProfile.settings,
        selectedPlayerSkinId: selectedPlayerSkinCandidate.id,
      },
    }))
    setMenuScreen("journey-intro")
  }

  function handleSelectNextPlayerSkin() {
    const currentIndex = PLAYER_SKINS.findIndex((skin) => skin.id === selectedPlayerSkinId)
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % PLAYER_SKINS.length : 0
    setSelectedPlayerSkinId(PLAYER_SKINS[nextIndex].id)
  }

  function handleSelectPreviousPlayerSkin() {
    const currentIndex = PLAYER_SKINS.findIndex((skin) => skin.id === selectedPlayerSkinId)
    const previousIndex =
      currentIndex >= 0
        ? (currentIndex - 1 + PLAYER_SKINS.length) % PLAYER_SKINS.length
        : 0
    setSelectedPlayerSkinId(PLAYER_SKINS[previousIndex].id)
  }

  function handleEnterVenueFromIntro() {
    if (!currentCampaignVenue) return

    if (!currentVenuePartnerCharacterId) {
      setSelectedCharacterId(availablePartnerCharacters[0]?.id ?? "nega-catimbo")
      setCharacterSelectReturnScreen("venue-intro")
      setLaunchVenueAfterCharacterSelect(true)
      setMenuScreen("character-select")
      return
    }

    startVenueMatch(currentCampaignVenue)
  }

  function handleResetCampaign() {
    clearLogs()
    resetPlayerProfileStorage()
    setPlayerProfile(createInitialPlayerProfile())
    setVariant("MINEIRO")
    setHandState(null)
    setMatchState(null)
    setSessionDebugVenueId(null)
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setGameplayIntroPhase("done")
    setSelectedPlayerSkinId(DEFAULT_PLAYER_SKIN_ID)
    setLaunchVenueAfterCharacterSelect(false)
    setCharacterSelectReturnScreen("journey-intro")
    setMenuScreen("start")
    setEventMessage("Campanha reiniciada do zero.")
    setTrucoMessage("Tudo pronto para voltar ao primeiro boteco.")
    showSpeechBubble(null)
    setShownPartnerAdviceKey(null)
    setMatchResultScreen(null)
    setCampaignVictoryScreen(null)
    setCampaignVictoryQueue([])
    syncLogs()
  }

  function handlePlayCard(card: Card) {
    if (!handState) return
    if (isGameplayIntroActive) return
    if (inGameContextMenuOpen || inGameConfirmation) return
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
    if (isGameplayIntroActive) return
    if (inGameContextMenuOpen || inGameConfirmation) return
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
    if (!handState || isGameplayIntroActive || !canHumanRespondToTruco || inGameContextMenuOpen || inGameConfirmation) return

    const nextState = respondToTruco(handState, "accept", matchState?.score)
    const acceptedBet = nextState.currentBet
    applyHandState(nextState, {
      eventMessage: `Você aceitou ${getBetCallLabel(acceptedBet)}.`,
      trucoMessage: getAcceptedBetMessage(acceptedBet),
    })
  }

  function handleRunFromTruco() {
    if (!handState || isGameplayIntroActive || !canHumanRespondToTruco || inGameContextMenuOpen || inGameConfirmation) return

    const nextState = respondToTruco(handState, "run", matchState?.score)
    applyHandState(nextState, {
      eventMessage: `Você correu de ${getPendingBetText(handState)}.`,
      trucoMessage: `Nosso time correu de ${getPendingBetText(handState)}.`,
      speechBubble: { playerId: 1, text: "TÔ FORA!" },
    })
  }

  function handleRaiseTruco() {
    if (!handState || isGameplayIntroActive || !canHumanRaiseTruco || inGameContextMenuOpen || inGameConfirmation) return

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
    if (!handState || isGameplayIntroActive || !canHumanAdvisePartner || !player1 || !player3 || inGameContextMenuOpen || inGameConfirmation) return

    showSpeechBubble({ playerId: 1, text: advice })

    partnerConsultResolutionTimeoutRef.current = window.setTimeout(() => {
      const ruleSet = getRuleSet(handState.variant)
      const decision = getTeamTrucoDecisionFromPartnerAdvice(
        ruleSet,
        player1.hand,
        player3.hand,
        handState.truco.proposedBet!,
        advice,
        handState.vira,
        partnerAiPersonalityId
      )

      const nextState = respondToTruco(handState, decision, matchState?.score)

      if (decision === "run") {
        applyHandState(nextState, {
          eventMessage: `A parceira correu de ${getPendingBetText(handState)}.`,
          trucoMessage: `Nosso time correu de ${getPendingBetText(handState)}.`,
          speechBubble: { playerId: 3, text: "TÔ FORA!" },
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
          speechBubble: requestedValue
            ? { playerId: 3, text: getSpeechBetLabel(requestedValue) }
            : { playerId: 3, text: "DESCE!" },
        })
        partnerConsultResolutionTimeoutRef.current = null
        return
      }

      const acceptedBet = nextState.currentBet
      applyHandState(nextState, {
        eventMessage: `A parceira aceitou ${getBetCallLabel(acceptedBet)}.`,
        trucoMessage: getAcceptedBetMessage(acceptedBet),
        speechBubble: getSpeechBubbleForTransition(handState, nextState),
      })
      partnerConsultResolutionTimeoutRef.current = null
    }, BUBBLE_DURATION_MS + 120)
  }

  useEffect(() => {
    if (isGameplayIntroActive) {
      return
    }

    if (inGameContextMenuOpen || inGameConfirmation) {
      return
    }

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
        const nextHandNumber = matchState.handNumber
        const nextState = createNextHandStateForMatch(matchState)

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
    applyHandState,
    canHumanAdvisePartner,
    canHumanRespondToTruco,
    canPlayHumanCard,
    handState,
    inGameConfirmation,
    inGameContextMenuOpen,
    isGameplayIntroActive,
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
      if (matchResultRevealTimeoutRef.current) {
        window.clearTimeout(matchResultRevealTimeoutRef.current)
      }
      if (gameplayIntroBackgroundTimeoutRef.current) {
        window.clearTimeout(gameplayIntroBackgroundTimeoutRef.current)
      }
      if (gameplayIntroRevealTimeoutRef.current) {
        window.clearTimeout(gameplayIntroRevealTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!partnerAdviceKey || !handState || inGameContextMenuOpen || inGameConfirmation) {
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
    inGameConfirmation,
    inGameContextMenuOpen,
    partnerAdviceKey,
    player1,
    player3,
    showSpeechBubble,
  ])

  useEffect(() => {
    if (!partnerConsultKey || inGameContextMenuOpen || inGameConfirmation) {
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
      partnerConsultTimeoutRef.current = null
    }, BUBBLE_DURATION_MS + 120)

    return () => {
      if (partnerConsultTimeoutRef.current) {
        window.clearTimeout(partnerConsultTimeoutRef.current)
        partnerConsultTimeoutRef.current = null
      }
    }
  }, [BUBBLE_DURATION_MS, inGameConfirmation, inGameContextMenuOpen, partnerConsultKey, showSpeechBubble])

  useEffect(() => {
    if (!inGameContextMenuOpen && !inGameConfirmation) {
      return
    }

    clearPendingUiTimers()
    setSpeechBubble(null)
    setShownPartnerAdviceKey(null)
    lastPartnerAdviceKeyRef.current = null
    lastPartnerConsultKeyRef.current = null
  }, [clearPendingUiTimers, inGameConfirmation, inGameContextMenuOpen])

  async function handleCopyLogs() {
    try {
      await navigator.clipboard.writeText(logs)
      alert("Log copiado com sucesso!")
    } catch {
      alert("Não foi possível copiar automaticamente. Copie manualmente.")
    }
  }

  function handleOpenCharacterSelect() {
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setSelectedCharacterId(currentVenuePartnerCharacterId ?? availablePartnerCharacters[0]?.id ?? "nega-catimbo")
    setCharacterSelectReturnScreen("venue-intro")
    setLaunchVenueAfterCharacterSelect(false)
    setMenuScreen("character-select")
  }

  function handleOpenJourneyIntro() {
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setSelectedCharacterId(currentVenuePartnerCharacterId ?? availablePartnerCharacters[0]?.id ?? "nega-catimbo")
    setMenuScreen("journey-intro")
  }

  function handleCloseJourneyIntro() {
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setMenuScreen("start")
  }

  function handleContinueToCharacterSelect() {
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setCharacterSelectReturnScreen("journey-intro")
    setLaunchVenueAfterCharacterSelect(false)
    setMenuScreen("character-select")
  }

  function handleCloseCharacterSelect() {
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setSelectedCharacterId(currentVenuePartnerCharacterId ?? availablePartnerCharacters[0]?.id ?? "nega-catimbo")
    setLaunchVenueAfterCharacterSelect(false)
    setMenuScreen(characterSelectReturnScreen)
  }

  function handleConfirmCharacterSelect() {
    if (!selectedCharacter || !isSelectedCharacterUnlocked || !currentCampaignVenueId) return

    setPlayerProfile((currentProfile) => ({
      ...currentProfile,
      campaign: {
        ...currentProfile.campaign,
        selectedPartnerCharacterIdByVenueId: {
          ...currentProfile.campaign.selectedPartnerCharacterIdByVenueId,
          [currentCampaignVenueId]: selectedCharacter.id,
        },
      },
    }))
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)

    if (launchVenueAfterCharacterSelect && currentCampaignVenue) {
      startVenueMatch(currentCampaignVenue)
      return
    }

    setMenuScreen(characterSelectReturnScreen)
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

  function handleOpenInGameContextMenu() {
    if (isGameplayIntroActive) return
    setInGameContextMenuOpen(true)
  }

  function handleCloseInGameContextMenu() {
    setInGameContextMenuOpen(false)
  }

  function handleWinMatchFromContextMenu() {
    if (!handState || !matchState) return

    clearPendingUiTimers()
    showSpeechBubble(null)
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)

    const resultVenue = sessionDebugVenue ?? currentCampaignVenue
    const resultVenueName = resultVenue?.name ?? "o bar"
    const finalScore = {
      A: 12,
      B: matchState.score.B,
    }
    const finishedMatchState: MatchState = {
      ...matchState,
      score: finalScore,
      finished: true,
      winner: "A",
    }
    let matchResultState: MatchResultScreenState = {
      outcome: "win",
      title: "Vocês levaram essa",
      subtitle: `Vitória manual registrada para validar o avanço em ${resultVenueName}.`,
      hostLine: `O dono do ${resultVenueName} resmunga: "Ganharam hoje porque a sorte sentou com vocês. Quero ver repetir essa coragem."`,
      venueId: resultVenue?.id,
      venueName: resultVenueName,
    }

    setMatchState(finishedMatchState)
    logEvent(`Vitória manual registrada em ${resultVenueName}.`)

    if (sessionDebugVenueId) {
      const debugVenueName = sessionDebugVenue?.name ?? currentCampaignVenue?.name ?? "local de debug"
      setEventMessage(`Vitória manual no modo debug em ${debugVenueName}.`)
      setTrucoMessage("Partida de teste finalizada. O progresso da campanha não foi alterado.")
    } else {
      const resolution = applyCampaignWin(playerProfile, CAMPAIGN_STAGES)
      const nextEventMessage = getCampaignWinMessage(finalScore, resolution)
      const nextTrucoMessage = getCampaignTrucoSummary(resolution)
      const [
        nextCampaignVictoryScreen,
        ...nextCampaignVictoryQueue
      ] = buildCampaignVictoryScreens(resolution)

      if (resolution.campaignCompleted) {
        matchResultState = {
          ...matchResultState,
          title: "Campanha concluída",
          subtitle: `Vocês fecharam a campanha disponível inteira e não deixaram dúvida no ${resultVenueName}.`,
          progressionTitle: "Jornada encerrada",
          progressionText: "Toda a campanha disponível foi concluída. Agora dá para revisitar os bares ou esperar os próximos desafios.",
        }
      } else if (resolution.clearedStage && resolution.unlockedStage) {
        matchResultState = {
          ...matchResultState,
          title: `${resolution.clearedStage.name} concluída`,
          subtitle: `Vocês fecharam ${resultVenueName} e abriram caminho para ${resolution.unlockedStage.name}.`,
          progressionTitle: "Nova fase liberada",
          progressionText:
            resolution.unlockedStage.cutsceneIntro ??
            `A próxima etapa agora é ${resolution.unlockedStage.name}.`,
        }
      } else if (resolution.clearedVenue && resolution.currentVenue) {
        matchResultState = {
          ...matchResultState,
          title: `${resolution.clearedVenue.name} conquistado`,
          subtitle: "Vocês encerraram a fase deste bar e avançaram no circuito.",
          progressionTitle: "Próximo bar liberado",
          progressionText: `Vocês passaram de fase. O próximo destino agora é ${resolution.currentVenue.name}.`,
        }
      } else if (resolution.clearedVenue) {
        matchResultState = {
          ...matchResultState,
          progressionTitle: "Bar concluído",
          progressionText: `Vocês concluíram ${resolution.clearedVenue.name} e seguiram adiante na campanha.`,
        }
      }

      matchResultRevealTimeoutRef.current = window.setTimeout(() => {
        setSpeechBubble(null)
        setHandState(null)
        setMatchState(null)
        if (nextCampaignVictoryScreen) {
          setMatchResultScreen(null)
          setCampaignVictoryScreen(nextCampaignVictoryScreen)
          setCampaignVictoryQueue(nextCampaignVictoryQueue)
          setMenuScreen("campaign-victory")
        } else {
          setCampaignVictoryScreen(null)
          setCampaignVictoryQueue([])
          setMatchResultScreen(matchResultState)
          setMenuScreen("match-result")
        }
        setPlayerProfile(resolution.profile)
        setEventMessage(nextEventMessage)
        setTrucoMessage(nextTrucoMessage)
        matchResultRevealTimeoutRef.current = null
      }, MATCH_RESULT_REVEAL_DELAY_MS)
      syncLogs()
      return
    }

    matchResultRevealTimeoutRef.current = window.setTimeout(() => {
      setSpeechBubble(null)
      setHandState(null)
      setMatchState(null)
      setCampaignVictoryScreen(null)
      setCampaignVictoryQueue([])
      setMatchResultScreen(matchResultState)
      setMenuScreen("match-result")
      matchResultRevealTimeoutRef.current = null
    }, MATCH_RESULT_REVEAL_DELAY_MS)
    syncLogs()
  }

  function handleLoseMatchFromContextMenu() {
    if (!handState || !matchState) return

    clearPendingUiTimers()
    showSpeechBubble(null)
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)

    const resultVenue = sessionDebugVenue ?? currentCampaignVenue
    const resultVenueName = resultVenue?.name ?? "o bar"
    const finalScore = {
      A: matchState.score.A,
      B: 12,
    }
    const finishedMatchState: MatchState = {
      ...matchState,
      score: finalScore,
      finished: true,
      winner: "B",
    }
    const matchResultState: MatchResultScreenState = {
      outcome: "loss",
      title: "A casa falou mais alto",
      subtitle: "Derrota manual registrada para validar a tela de perda.",
      hostLine: `O dono do ${resultVenueName} abre um sorriso torto: "Aqui é assim. Quem entra achando que vai mandar sai escutando a conversa do balcão."`,
      venueId: resultVenue?.id,
      venueName: resultVenueName,
    }

    setMatchState(finishedMatchState)
    logEvent(`Derrota manual registrada em ${resultVenueName}.`)

    if (sessionDebugVenueId) {
      const debugVenueName = sessionDebugVenue?.name ?? currentCampaignVenue?.name ?? "local de debug"
      setEventMessage(`Derrota manual no modo debug em ${debugVenueName}.`)
      setTrucoMessage("Partida de teste finalizada. O progresso da campanha não foi alterado.")
    } else {
      const resolution = applyCampaignLoss(playerProfile, CAMPAIGN_STAGES)
      setPlayerProfile(resolution.profile)
      setEventMessage(getMatchEndMessage("B", finalScore))
      setTrucoMessage(
        resolution.currentVenue
          ? `Derrota no local ${resolution.currentVenue.name}. Você pode tentar novamente.`
          : "Derrota registrada na campanha."
      )
    }

    matchResultRevealTimeoutRef.current = window.setTimeout(() => {
      setSpeechBubble(null)
      setHandState(null)
      setMatchState(null)
      setCampaignVictoryScreen(null)
      setCampaignVictoryQueue([])
      setMatchResultScreen(matchResultState)
      setMenuScreen("match-result")
      matchResultRevealTimeoutRef.current = null
    }, MATCH_RESULT_REVEAL_DELAY_MS)
    syncLogs()
  }

  function handleSwapPartnerFromContextMenu() {
    if (!handState || !matchState) return
    setInGameContextMenuOpen(false)
    setInGameConfirmation({
      intent: "swap-partner",
      title: "Trocar de parceira?",
      message: "Se você trocar de parceira agora, todo o progresso desta partida será perdido.",
      confirmLabel: "Trocar e perder progresso",
      warning: "Todo o progresso desta partida atual será perdido se você continuar.",
    })
  }

  function handleExitMatchFromContextMenu() {
    if (!handState || !matchState) return
    setInGameContextMenuOpen(false)
    setInGameConfirmation({
      intent: "exit-match",
      title: "Sair da partida?",
      message: "Se você sair agora, todo o progresso desta partida será perdido.",
      confirmLabel: "Sair e perder progresso",
      warning: "Todo o progresso desta partida atual será perdido se você continuar.",
    })
  }

  function handleResetProgressFromContextMenu() {
    if (!handState || !matchState) return
    setInGameContextMenuOpen(false)
    setInGameConfirmation({
      intent: "reset-progress",
      title: "Resetar todo o progresso?",
      message: "Isso vai apagar sua campanha, escolhas de parceira, skin do jogador e histórico salvo para recomeçar do zero.",
      confirmLabel: "Resetar tudo",
      warning: "A skin do protagonista tambem volta para a escolha inicial.",
    })
  }

  function handleCancelInGameConfirmation() {
    setInGameConfirmation(null)
  }

  function handleConfirmInGameConfirmation() {
    if (!inGameConfirmation || !handState || !matchState) return

    clearPendingUiTimers()
    showSpeechBubble(null)

    if (inGameConfirmation.intent === "reset-progress") {
      handleResetCampaign()
      return
    }

    if (inGameConfirmation.intent === "swap-partner") {
      setMatchResultScreen(null)
      setCampaignVictoryScreen(null)
      setCampaignVictoryQueue([])
      setHandState(null)
      setMatchState(null)
      setInGameContextMenuOpen(false)
      setInGameConfirmation(null)
      setSelectedCharacterId(currentVenuePartnerCharacterId ?? availablePartnerCharacters[0]?.id ?? "nega-catimbo")
      setCharacterSelectReturnScreen("journey-intro")
      setLaunchVenueAfterCharacterSelect(false)
      setMenuScreen("character-select")
      return
    }

    setHandState(null)
    setMatchState(null)
    setMatchResultScreen(null)
    setCampaignVictoryScreen(null)
    setCampaignVictoryQueue([])
    setSessionDebugVenueId(null)
    setInGameContextMenuOpen(false)
    setInGameConfirmation(null)
    setMenuScreen("start")
  }

  return {
    activeVariant,
    canHumanRespondToTruco,
    canHumanAdvisePartner,
    canPlayHumanCard,
    canHumanRaiseTruco,
    canRequestTruco,
    campaignCompleted,
    campaignVictoryScreen,
    campaignSummary,
    currentCampaignStage,
    currentCampaignVenue,
    currentTurnLabel,
    currentVenueWins,
    hasSelectedPartnerForVenue: !!currentVenuePartnerCharacterId,
    debugModeEnabled: DEBUG_MODE,
    debugVenueId,
    debugVenueOptions,
    dealAnimationNonce,
    eventMessage,
    gameplayIntroPhase,
    handScoreLabel,
    handState,
    inGameConfirmation,
    inGameContextMenuOpen,
    matchResultScreen,
    handleAcceptTruco,
    handleCancelInGameConfirmation,
    handleCloseInGameContextMenu,
    handleConfirmInGameConfirmation,
    handleCopyLogs,
    handleEnterVenueFromIntro,
    handleExitMatchFromContextMenu,
    handleLoseMatchFromContextMenu,
    handleOpenInGameContextMenu,
    handlePlayCard,
    handlePartnerAdvice,
    handleRaiseTruco,
    handleRequestTruco,
    handleResetCampaign,
    handleResetProgressFromContextMenu,
    handleReturnToJourneyFlow,
    handleRunFromTruco,
    handleSwapPartnerFromContextMenu,
    handleStartHand,
    handleWinMatchFromContextMenu,
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
    selectedPlayerSkin,
    selectedPlayerSkinCandidate,
    selectedPlayerSkinIndex,
    selectablePlayerSkins: PLAYER_SKINS,
    selectedCharacter,
    selectedCharacterIndex,
    isSelectedCharacterUnlocked,
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
    handleClosePlayerSkinSelect,
    handleConfirmCharacterSelect,
    handleConfirmPlayerSkinSelect,
    handleLaunchVenue,
    handleOpenCharacterSelect,
    handleOpenJourneyIntro,
    handleCloseJourneyIntro,
    handleContinueToCharacterSelect,
    handleSelectNextCharacter,
    handleSelectPreviousCharacter,
    handleSelectNextPlayerSkin,
    handleSelectPreviousPlayerSkin,
  }
}
