import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react"
import { Capacitor } from "@capacitor/core"
import { useGameSession } from "./app/useGameSession"
import type { HandState } from "./game/handState"
import cardFlipSoundAsset from "./assets/audio/cardflip.mp3"
import botecoSceneBgAsset from "./assets/boteco/boteco-scene-bg.png"
import cardFaceAgedPaperAsset from "./assets/cards/card-face-aged-paper.png"
import adegaJucaBigodeSceneBgAsset from "./assets/venues/adega-do-juca-bigode/background.png"
import zonaNorteGaragemSceneBgAsset from "./assets/venues/zona-norte-garagem/background.png"
import zonaLesteQuintalSceneBgAsset from "./assets/venues/zona-leste-quintal/background.png"
import centroSubsoloSceneBgAsset from "./assets/venues/centro-subsolo/background.png"
import centroConvencoesPrefeituraSceneBgAsset from "./assets/venues/centro-convencoes-prefeitura/background.png"
import ginasioEstadualManecoFileSceneBgAsset from "./assets/venues/ginasio-estadual-maneco-file/background.png"
import arenaNacionalSceneBgAsset from "./assets/venues/arena-nacional/background.png"
import centroAmericanoTruqueiroMedelinSceneBgAsset from "./assets/venues/centro-americano-truqueiro-medelin/background.png"
import hotelTrucoSegoviaEspanhaSceneBgAsset from "./assets/venues/hotel-truco-segovia-espanha/background.png"
import casinoMeMaiorSceneBgAsset from "./assets/venues/casino-me-maior/background.png"
import orbitaDaLuaSceneBgAsset from "./assets/venues/orbita-da-lua/background.png"
import zonaSulSalaoSceneBgAsset from "./assets/venues/zona-sul-salao/background.png"
import manecoBanguelaSceneBgAsset from "./assets/venues/maneco-banguela/background.png"
import tremDoJacaSceneBgAsset from "./assets/venues/trem-do-jaca/background.png"

const GAMEPLAY_STAGE_WIDTH = 1080
const GAMEPLAY_STAGE_HEIGHT = 500
const NATIVE_PLATFORM = Capacitor.getPlatform()
const IS_NATIVE_SHELL = Capacitor.isNativePlatform()
const IS_IOS_NATIVE_SHELL = NATIVE_PLATFORM === "ios"
const CARD_FLIP_VOLUME = 0.82
const DEAL_CARD_SOUND_REPEAT_COUNT = 10
const DEAL_CARD_SOUND_INTERVAL_MS = 48
const PAULISTA_VIRA_DEAL_INTRO_DELAY_MS = 520
const DEAL_CARD_SOUND_VOLUME = 0.58
const GAMEPLAY_BACKGROUND_ASSET_BY_VENUE_ID: Record<string, string> = {
  "bar-maneco-banguela": manecoBanguelaSceneBgAsset,
  "trem-do-jaca": tremDoJacaSceneBgAsset,
  "adega-do-juca-bigode": adegaJucaBigodeSceneBgAsset,
  "zona-norte-garagem": zonaNorteGaragemSceneBgAsset,
  "zona-leste-quintal": zonaLesteQuintalSceneBgAsset,
  "centro-subsolo": centroSubsoloSceneBgAsset,
  "zona-sul-salao": zonaSulSalaoSceneBgAsset,
  "centro-convencoes-prefeitura": centroConvencoesPrefeituraSceneBgAsset,
  "ginasio-estadual-maneco-file": ginasioEstadualManecoFileSceneBgAsset,
  "arena-nacional": arenaNacionalSceneBgAsset,
  "centro-americano-truqueiro-medelin": centroAmericanoTruqueiroMedelinSceneBgAsset,
  "hotel-truco-segovia-espanha": hotelTrucoSegoviaEspanhaSceneBgAsset,
  "casino-me-maior": casinoMeMaiorSceneBgAsset,
  "orbita-da-lua": orbitaDaLuaSceneBgAsset,
}

const TableSection = lazy(async () => {
  const mod = await import("./app/AppSections")
  return { default: mod.TableSection }
})
const HandStatusPanel = lazy(async () => {
  const mod = await import("./app/AppSections")
  return { default: mod.HandStatusPanel }
})
const CampaignPanel = lazy(async () => {
  const mod = await import("./app/AppSections")
  return { default: mod.CampaignPanel }
})
const LogsPanel = lazy(async () => {
  const mod = await import("./app/AppSections")
  return { default: mod.LogsPanel }
})

type GameplayLayoutMode = "regular" | "compact" | "tiny"
type GameplayViewportMetrics = {
  mode: GameplayLayoutMode
  scale: number
}

function getGameplayViewportMetrics(isNativeShell = false): GameplayViewportMetrics {
  if (typeof window === "undefined") {
    return { mode: "regular", scale: 1 }
  }

  const availableWidth = isNativeShell
    ? Math.max(320, window.innerWidth)
    : Math.max(320, Math.min(window.innerWidth, 1126) - 116)
  const availableHeight = isNativeShell
    ? Math.max(260, window.innerHeight)
    : Math.max(260, window.innerHeight - 260)
  const scale = Math.max(
    0.5,
    Math.min(1, availableWidth / GAMEPLAY_STAGE_WIDTH, availableHeight / GAMEPLAY_STAGE_HEIGHT)
  )

  if (scale < 0.72) {
    return { mode: "tiny", scale }
  }
  if (scale < 0.9) {
    return { mode: "compact", scale }
  }
  return { mode: "regular", scale }
}

function playCardFlipSound(audio: HTMLAudioElement | null, volume = CARD_FLIP_VOLUME) {
  if (!audio) {
    return
  }

  const sound = audio.cloneNode(true) as HTMLAudioElement
  sound.volume = volume
  sound.currentTime = 0
  void sound.play().catch(() => {
    // Audio can be blocked before the first trusted interaction, especially on mobile WebViews.
  })
}

function getDealCardSoundStartDelay(handState: HandState | null) {
  return handState?.variant === "PAULISTA" && handState.vira
    ? PAULISTA_VIRA_DEAL_INTRO_DELAY_MS
    : 0
}

function scheduleDealCardFlipSounds(
  audio: HTMLAudioElement | null,
  startDelayMs: number
): number[] {
  return Array.from({ length: DEAL_CARD_SOUND_REPEAT_COUNT }, (_, index) =>
    window.setTimeout(() => {
      playCardFlipSound(audio, DEAL_CARD_SOUND_VOLUME)
    }, startDelayMs + index * DEAL_CARD_SOUND_INTERVAL_MS)
  )
}

function App() {
  const [viewportMetrics, setViewportMetrics] = useState<GameplayViewportMetrics>(
    () => getGameplayViewportMetrics(IS_NATIVE_SHELL)
  )
  const cardFlipAudioRef = useRef<HTMLAudioElement | null>(null)
  const previousTableAudioSnapshotRef = useRef<{
    signature: string
    count: number
  } | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setViewportMetrics(getGameplayViewportMetrics(IS_NATIVE_SHELL))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const audio = new Audio(cardFlipSoundAsset)
    audio.preload = "auto"
    audio.volume = CARD_FLIP_VOLUME
    cardFlipAudioRef.current = audio

    const unlockAudio = () => {
      const targetAudio = cardFlipAudioRef.current
      if (!targetAudio) {
        return
      }

      const previousMuted = targetAudio.muted
      targetAudio.muted = true
      targetAudio.currentTime = 0
      void targetAudio.play()
        .then(() => {
          targetAudio.pause()
          targetAudio.currentTime = 0
          targetAudio.muted = previousMuted
        })
        .catch(() => {
          targetAudio.muted = previousMuted
        })

      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
    }

    window.addEventListener("pointerdown", unlockAudio, { once: true })
    window.addEventListener("keydown", unlockAudio, { once: true })

    return () => {
      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
      audio.pause()
      cardFlipAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle("truco-native-app", IS_NATIVE_SHELL)
    return () => {
      document.body.classList.remove("truco-native-app")
    }
  }, [])

  const {
    activeVariant,
    canHumanAdvisePartner,
    canHumanDecideNineHand,
    canHumanRaiseTruco,
    canHumanRespondToTruco,
    canPlayHumanCard,
    canPlayCoveredCard,
    canRequestTruco,
    campaignCompleted,
    campaignVictoryScreen,
    campaignSummary,
    currentCampaignStage,
    currentCampaignVenue,
    currentTurnLabel,
    currentVenueWins,
    hasSelectedPartnerForVenue,
    dealAnimationNonce,
    eventMessage,
    freePlayRun,
    gameplayIntroPhase,
    handScoreLabel,
    handState,
    inGameConfirmation,
    inGameContextMenuOpen,
    matchResultScreen,
    handleAcceptTruco,
    handleAddEightPointsFromContextMenu,
    handleCancelInGameConfirmation,
    handleCloseFreePlayStage,
    handleCloseInGameContextMenu,
    handleCloseCharacterSelect,
    handleCloseJourneyIntro,
    handleCloseSettings,
    handleCloseTutorial,
    handlePartnerAdvice,
    handleCopyLogs,
    handleConfirmInGameConfirmation,
    handleContinueToCharacterSelect,
    handleEnterVenueFromIntro,
    handleExitMatchFromContextMenu,
    handleLaunchVenue,
    handleLoseMatchFromContextMenu,
    handleOpenFreePlayStage,
    handleOpenInGameContextMenu,
    handleOpenCharacterSelect,
    handleOpenSettings,
    handlePlayCard,
    handlePlayNineHand,
    handleFoldNineHand,
    handleRaiseTruco,
    handleRequestTruco,
    handleResetCampaign,
    handleResetProgressFromContextMenu,
    handleReturnToJourneyFlow,
    handleRunFromTruco,
    handleSelectNextCharacter,
    handleSelectPreviousCharacter,
    handleStartHand,
    handleStartTutorial,
    handleChangeTrucoVariant,
    handleSwapPartnerFromContextMenu,
    handleWinMatchFromContextMenu,
    lastPlayedPlayerId,
    logs,
    matchScoreLabel,
    matchState,
    menuScreen,
    opponentCharacters,
    player1,
    player3,
    playerProfile,
    selectedPlayerSkin,
    selectedPlayerSkinCandidate,
    selectedPlayerSkinIndex,
    selectablePlayerSkins,
    selectedCharacter,
    selectedCharacterIndex,
    isSelectedCharacterUnlocked,
    selectedPartnerCharacter,
    selectableCharacters,
    speechBubble,
    statusMessage,
    tableByPlayer,
    handleConfirmCharacterSelect,
    handleClosePlayerSkinSelect,
    handleConfirmPlayerSkinSelect,
    handleSelectNextPlayerSkin,
    handleSelectPreviousPlayerSkin,
  } = useGameSession()

  const layoutMode = viewportMetrics.mode
  const stageScale = viewportMetrics.scale
  const isCompactLayout = layoutMode !== "regular"
  const isTinyLayout = layoutMode === "tiny"
  const useTightSidebar = layoutMode !== "regular"
  const gameplayBackgroundAsset = currentCampaignVenue?.id
    ? GAMEPLAY_BACKGROUND_ASSET_BY_VENUE_ID[currentCampaignVenue.id] ?? botecoSceneBgAsset
    : botecoSceneBgAsset

  useEffect(() => {
    const table = handState?.table ?? []
    const nextSnapshot = {
      count: table.length,
      signature: table
        .map((entry, index) =>
          [
            index,
            entry.playerId,
            entry.card.rank,
            entry.card.suit,
            entry.covered ? "covered" : "open",
          ].join(":")
        )
        .join("|"),
    }
    const previousSnapshot = previousTableAudioSnapshotRef.current
    previousTableAudioSnapshotRef.current = nextSnapshot

    if (!previousSnapshot) {
      return
    }

    if (
      nextSnapshot.count > previousSnapshot.count &&
      nextSnapshot.signature !== previousSnapshot.signature
    ) {
      playCardFlipSound(cardFlipAudioRef.current)
    }
  }, [handState?.table])

  useEffect(() => {
    if (!dealAnimationNonce) {
      return
    }

    const timeoutIds = scheduleDealCardFlipSounds(
      cardFlipAudioRef.current,
      getDealCardSoundStartDelay(handState)
    )

    return () => {
      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [dealAnimationNonce])

  const responsiveStyles = useMemo<Record<string, React.CSSProperties>>(
    () => ({
      ...styles,
      tableHudSurface: {
        ...styles.tableHudSurface,
        backgroundImage: getGameplayBackgroundImage(gameplayBackgroundAsset),
        ...(IS_NATIVE_SHELL ? styles.nativeTableHudSurface : undefined),
      },
      tablePanel: {
        ...styles.tablePanel,
        ...(IS_NATIVE_SHELL ? styles.nativeTablePanel : undefined),
      },
      gameViewportStageSlot: {
        ...styles.gameViewportStageSlot,
        width: `${GAMEPLAY_STAGE_WIDTH * stageScale}px`,
        height: `${GAMEPLAY_STAGE_HEIGHT * stageScale}px`,
        ...(IS_NATIVE_SHELL ? styles.nativeGameViewportStageSlot : undefined),
      },
      gameViewportFrame: {
        ...styles.gameViewportFrame,
        width: `${GAMEPLAY_STAGE_WIDTH}px`,
        height: `${GAMEPLAY_STAGE_HEIGHT}px`,
        transform: `scale(${stageScale})`,
        ...(IS_NATIVE_SHELL ? styles.nativeGameViewportFrame : undefined),
      },
      gameViewport: {
        ...styles.gameViewport,
        gridTemplateColumns: isCompactLayout
          ? isTinyLayout
            ? IS_NATIVE_SHELL
              ? "250px minmax(0, 1fr) 212px"
              : "196px minmax(0, 1fr) 212px"
            : IS_NATIVE_SHELL
              ? "276px minmax(0, 1fr) 235px"
              : "214px minmax(0, 1fr) 235px"
          : IS_NATIVE_SHELL
            ? "302px minmax(0, 1fr) 254px"
            : "232px minmax(0, 1fr) 254px",
        gap: isTinyLayout ? "6px" : isCompactLayout ? "7px" : "9px",
      },
      gameLeftRail: {
        ...styles.gameLeftRail,
        gridTemplateRows: IS_NATIVE_SHELL
          ? isTinyLayout
            ? IS_IOS_NATIVE_SHELL
              ? "252px minmax(0, 1fr)"
              : "232px minmax(0, 1fr)"
            : isCompactLayout
              ? IS_IOS_NATIVE_SHELL
                ? "292px minmax(0, 1fr)"
                : "270px minmax(0, 1fr)"
              : IS_IOS_NATIVE_SHELL
                ? "306px minmax(0, 1fr)"
                : "284px minmax(0, 1fr)"
          : isTinyLayout
            ? "166px minmax(0, 1fr)"
            : isCompactLayout
              ? "202px minmax(0, 1fr)"
              : styles.gameLeftRail.gridTemplateRows,
        gap: isTinyLayout ? "5px" : "6px",
        justifyItems: "stretch",
      },
      gameSidebarColumn: {
        ...styles.gameSidebarColumn,
        gap: isTinyLayout ? "5px" : "7px",
        justifyItems: "stretch",
      },
      scenePanel: {
        ...styles.scenePanel,
        width: "100%",
        boxSizing: "border-box",
        ...(IS_NATIVE_SHELL ? styles.nativeScenePanel : undefined),
      },
      scorePadCard: {
        ...styles.scorePadCard,
        padding: isTinyLayout ? "7px" : "9px",
        width: "100%",
        boxSizing: "border-box",
        ...(IS_NATIVE_SHELL ? styles.nativeScorePadCard : undefined),
      },
      scorePadCardSurface: {
        ...styles.scorePadCardSurface,
        width: isTinyLayout
          ? IS_NATIVE_SHELL
            ? "146px"
            : "126px"
          : isCompactLayout
            ? IS_NATIVE_SHELL
              ? "160px"
              : "140px"
            : "174px",
        maxHeight: isCompactLayout ? "94%" : "96%",
      },
      scorePadCellBottomLeft: {
        ...styles.scorePadCellBottomLeft,
        ...(IS_IOS_NATIVE_SHELL ? styles.nativeIosScorePadBottomCell : undefined),
      },
      scorePadCellBottomRight: {
        ...styles.scorePadCellBottomRight,
        ...(IS_IOS_NATIVE_SHELL ? styles.nativeIosScorePadBottomCell : undefined),
      },
      gameMainColumn: {
        ...styles.gameMainColumn,
        gridTemplateRows: isTinyLayout
          ? "minmax(0, 1fr) 120px"
          : isCompactLayout
            ? "minmax(0, 1fr) 139px"
            : "minmax(0, 1fr) 158px",
        gap: isTinyLayout ? "3px" : "4px",
        overflow: "visible",
      },
      tableSurface: {
        ...styles.tableSurface,
        padding: isTinyLayout ? "6px" : "8px",
        transform: isCompactLayout ? "scale(1.04)" : "scale(1.08)",
        maxWidth: isCompactLayout ? "98%" : "100%",
      },
      playerCardsBlock: {
        ...styles.playerCardsBlock,
        width: "100%",
        boxSizing: "border-box",
        height: "100%",
        minHeight: isTinyLayout ? "120px" : isCompactLayout ? "139px" : "158px",
        padding: isTinyLayout ? "7px 8px 8px" : isCompactLayout ? "8px 9px 10px" : "10px 11px 12px",
        overflow: "visible",
        position: "relative",
        zIndex: 6,
      },
      tableHudSidebar: {
        ...styles.tableHudSidebar,
        width: "100%",
        boxSizing: "border-box",
        gridTemplateRows: useTightSidebar
          ? "max-content max-content"
          : isCompactLayout
            ? "max-content max-content"
            : "max-content max-content",
        gap: useTightSidebar ? (isTinyLayout ? "6px" : "8px") : "12px",
        alignContent: "center",
        alignItems: "center",
      },
      tableHudStats: {
        ...styles.tableHudStats,
        width: isCompactLayout ? "90%" : "88%",
        padding: useTightSidebar ? (isTinyLayout ? "8px 9px" : "9px 11px") : "12px 14px",
        gap: useTightSidebar ? (isTinyLayout ? "5px" : "7px") : "11px",
        minHeight: useTightSidebar ? (isTinyLayout ? "108px" : "124px") : undefined,
        height: useTightSidebar ? "auto" : styles.tableHudStats.height,
      },
      inGameActionsCard: {
        ...styles.inGameActionsCard,
        width: isCompactLayout ? "96%" : "94%",
        marginTop: useTightSidebar ? 0 : "14px",
        gap: useTightSidebar ? (isTinyLayout ? "8px" : "10px") : "13px",
      },
      tableCenterArea: {
        ...styles.tableCenterArea,
        minHeight: isTinyLayout ? "314px" : isCompactLayout ? "332px" : "360px",
      },
      tableHudStatLineCentered: {
        ...styles.tableHudStatLineCentered,
        gap: useTightSidebar ? "3px" : "5px",
      },
      tableHudStatLabelCentered: {
        ...styles.tableHudStatLabelCentered,
        fontSize: useTightSidebar ? (isTinyLayout ? "7px" : "8px") : "9px",
      },
      tableHudStatValueCentered: {
        ...styles.tableHudStatValueCentered,
        fontSize: useTightSidebar ? (isTinyLayout ? "11px" : "13px") : "15px",
        lineHeight: useTightSidebar ? 1.05 : styles.tableHudStatValueCentered.lineHeight,
      },
      inGameActionsRow: {
        ...styles.inGameActionsRow,
        gap: useTightSidebar ? (isTinyLayout ? "8px" : "12px") : "14px",
      },
      inGameActionsGrid: {
        ...styles.inGameActionsGrid,
        gap: useTightSidebar ? (isTinyLayout ? "8px" : "12px") : "14px",
      },
      trucoPrimaryButton: {
        ...styles.trucoPrimaryButton,
        minHeight: useTightSidebar ? (isTinyLayout ? "43px" : "49px") : "55px",
        padding: useTightSidebar ? (isTinyLayout ? "6px 13px" : "9px 17px") : "12px 20px",
        fontSize: useTightSidebar ? (isTinyLayout ? "13px" : "14px") : "16px",
      },
      trucoSecondaryButton: {
        ...styles.trucoSecondaryButton,
        minHeight: useTightSidebar ? (isTinyLayout ? "43px" : "49px") : "55px",
        padding: useTightSidebar ? (isTinyLayout ? "6px 13px" : "9px 17px") : "12px 20px",
        fontSize: useTightSidebar ? (isTinyLayout ? "13px" : "14px") : "16px",
      },
      rosterGrid: {
        ...styles.rosterGrid,
        gap: IS_NATIVE_SHELL
          ? isTinyLayout
            ? "8px 14px"
            : "10px 16px"
          : isTinyLayout
            ? "3px 6px"
            : "4px 8px",
      },
      rosterCard: {
        ...styles.rosterCard,
        minHeight: IS_NATIVE_SHELL
          ? isTinyLayout
            ? "82px"
            : isCompactLayout
              ? "102px"
              : "132px"
          : isTinyLayout
            ? "70px"
            : isCompactLayout
              ? "82px"
              : "126px",
        padding: isTinyLayout ? "2px" : "4px",
        gap: "3px",
      },
      rosterAvatar: {
        ...styles.rosterAvatar,
        width: IS_NATIVE_SHELL
          ? isTinyLayout
            ? "62px"
            : isCompactLayout
              ? "82px"
              : "105px"
          : isTinyLayout
            ? "51px"
            : isCompactLayout
              ? "66px"
              : "105px",
        height: IS_NATIVE_SHELL
          ? isTinyLayout
            ? "62px"
            : isCompactLayout
              ? "82px"
              : "105px"
          : isTinyLayout
            ? "51px"
            : isCompactLayout
              ? "66px"
              : "105px",
        borderRadius: IS_NATIVE_SHELL
          ? isTinyLayout
            ? "18px"
            : isCompactLayout
              ? "22px"
              : "24px"
          : isTinyLayout
            ? "15px"
            : isCompactLayout
              ? "18px"
              : "24px",
        fontSize: isTinyLayout ? "18px" : "21px",
      },
      rosterName: {
        ...styles.rosterName,
        fontSize: IS_NATIVE_SHELL
          ? isTinyLayout
            ? IS_IOS_NATIVE_SHELL
              ? "11px"
              : "10px"
            : isCompactLayout
              ? IS_IOS_NATIVE_SHELL
                ? "13px"
                : "12px"
              : IS_IOS_NATIVE_SHELL
                ? "14px"
                : "13px"
          : isTinyLayout
            ? "6px"
            : isCompactLayout
              ? "7px"
              : "10px",
        lineHeight: IS_NATIVE_SHELL ? 1.1 : styles.rosterName.lineHeight,
      },
      mobileHandRowWrap: {
        ...styles.mobileHandRowWrap,
        gap: isTinyLayout ? "8px" : "10px",
        alignItems: "center",
      },
      mobileHandRow: {
        ...styles.mobileHandRow,
        gap: isTinyLayout ? "4px" : "6px",
        alignItems: "center",
        paddingTop: 0,
        transform: IS_NATIVE_SHELL
          ? isTinyLayout
            ? "translateY(-34px)"
            : "translateY(-38px)"
          : undefined,
      },
      mobileHandTitle: {
        ...styles.mobileHandTitle,
        fontSize: isTinyLayout ? "10px" : "12px",
      },
      mobileHandMeta: {
        ...styles.mobileHandMeta,
        fontSize: isTinyLayout ? "8px" : "9px",
      },
      coveredCardToggle: {
        ...styles.coveredCardToggle,
        minHeight: isTinyLayout ? "44px" : "48px",
        gap: isTinyLayout ? "10px" : "12px",
        padding: isTinyLayout ? "7px 16px 7px 9px" : "8px 18px 8px 10px",
        fontSize: isTinyLayout ? "15px" : "17px",
      },
      coveredCardToggleSwitch: {
        ...styles.coveredCardToggleSwitch,
        width: isTinyLayout ? "43px" : "48px",
        height: isTinyLayout ? "25px" : "28px",
        padding: "2px",
      },
      coveredCardToggleKnob: {
        ...styles.coveredCardToggleKnob,
        width: isTinyLayout ? "19px" : "22px",
        height: isTinyLayout ? "19px" : "22px",
      },
      coveredCardToggleKnobActive: {
        ...styles.coveredCardToggleKnobActive,
        transform: isTinyLayout ? "translateX(20px)" : "translateX(22px)",
      },
      mobileCardButton: {
        ...styles.mobileCardButton,
        width: isTinyLayout ? "67px" : isCompactLayout ? "76px" : "84px",
        minWidth: isTinyLayout ? "67px" : isCompactLayout ? "76px" : "84px",
        minHeight: isTinyLayout ? "94px" : isCompactLayout ? "104px" : "115px",
        padding: isTinyLayout ? "6px" : "7px",
      },
      mobileCardRank: {
        ...styles.mobileCardRank,
        fontSize: isTinyLayout ? "18px" : "22px",
      },
      mobileCardSuit: {
        ...styles.mobileCardSuit,
        fontSize: isTinyLayout ? "18px" : "22px",
      },
      mobileCardCenterSuit: {
        ...styles.mobileCardCenterSuit,
        fontSize: isTinyLayout ? "27px" : "34px",
      },
    }),
    [gameplayBackgroundAsset, isCompactLayout, isTinyLayout, stageScale, useTightSidebar]
  )

  return (
    <div style={IS_NATIVE_SHELL ? responsiveStyles.nativePage : styles.page}>
      <div style={IS_NATIVE_SHELL ? responsiveStyles.nativeContainer : styles.container}>
        {!IS_NATIVE_SHELL && <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Truco Game</h1>
            <p style={styles.subtitle}>
              Mesa jogável · fluxo passo a passo · foco em clareza visual
            </p>
          </div>
        </header>}

        <Suspense fallback={<div style={responsiveStyles.loadingCard}>Carregando mesa...</div>}>
          <TableSection
            handState={handState}
            inGameConfirmation={inGameConfirmation}
            inGameContextMenuOpen={inGameContextMenuOpen}
            matchState={matchState}
            matchResultScreen={matchResultScreen}
            campaignVictoryScreen={campaignVictoryScreen}
            currentCampaignVenue={currentCampaignVenue}
            currentVenueWins={currentVenueWins}
            dealAnimationNonce={dealAnimationNonce}
            freePlayRun={freePlayRun}
            gameplayIntroPhase={gameplayIntroPhase}
            hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
            menuScreen={menuScreen}
            opponentCharacters={opponentCharacters}
            playerProfile={playerProfile}
            selectedPlayerSkin={selectedPlayerSkin}
            selectedPlayerSkinCandidate={selectedPlayerSkinCandidate}
            selectedPlayerSkinIndex={selectedPlayerSkinIndex}
            selectablePlayerSkins={selectablePlayerSkins}
            selectedCharacter={selectedCharacter}
            selectedCharacterIndex={selectedCharacterIndex}
            isSelectedCharacterUnlocked={isSelectedCharacterUnlocked}
            selectedPartnerCharacter={selectedPartnerCharacter}
            selectableCharacters={selectableCharacters}
            speechBubble={speechBubble}
            tableByPlayer={tableByPlayer}
            lastPlayedPlayerId={lastPlayedPlayerId}
            player1={player1}
            player3={player3}
            canRequestTruco={canRequestTruco}
            canHumanAdvisePartner={canHumanAdvisePartner}
            canHumanDecideNineHand={canHumanDecideNineHand}
            canHumanRaiseTruco={canHumanRaiseTruco}
            canHumanRespondToTruco={canHumanRespondToTruco}
            canPlayHumanCard={canPlayHumanCard}
            canPlayCoveredCard={canPlayCoveredCard}
            onCloseCharacterSelect={handleCloseCharacterSelect}
            onCloseJourneyIntro={handleCloseJourneyIntro}
            onCloseSettings={handleCloseSettings}
            onCloseTutorial={handleCloseTutorial}
            onClosePlayerSkinSelect={handleClosePlayerSkinSelect}
            onConfirmCharacterSelect={handleConfirmCharacterSelect}
            onConfirmPlayerSkinSelect={handleConfirmPlayerSkinSelect}
            onEnterVenueFromIntro={handleEnterVenueFromIntro}
            onOpenCharacterSelect={handleOpenCharacterSelect}
            onPlayNineHand={handlePlayNineHand}
            onFoldNineHand={handleFoldNineHand}
            onContinueToCharacterSelect={handleContinueToCharacterSelect}
            onLaunchVenue={handleLaunchVenue}
            onReturnToJourneyFlow={handleReturnToJourneyFlow}
            onResetCampaign={handleResetCampaign}
            onSelectNextCharacter={handleSelectNextCharacter}
            onSelectPreviousCharacter={handleSelectPreviousCharacter}
            onSelectNextPlayerSkin={handleSelectNextPlayerSkin}
            onSelectPreviousPlayerSkin={handleSelectPreviousPlayerSkin}
            onStart={handleStartHand}
            onStartTutorial={handleStartTutorial}
            onChangeTrucoVariant={handleChangeTrucoVariant}
            onRequestTruco={handleRequestTruco}
            onAcceptTruco={handleAcceptTruco}
            onAddEightPointsFromContextMenu={handleAddEightPointsFromContextMenu}
            onAdvisePartner={handlePartnerAdvice}
            onCancelInGameConfirmation={handleCancelInGameConfirmation}
            onCloseFreePlayStage={handleCloseFreePlayStage}
            onCloseInGameContextMenu={handleCloseInGameContextMenu}
            onConfirmInGameConfirmation={handleConfirmInGameConfirmation}
            onExitMatchFromContextMenu={handleExitMatchFromContextMenu}
            onLoseMatchFromContextMenu={handleLoseMatchFromContextMenu}
            onOpenFreePlayStage={handleOpenFreePlayStage}
            onOpenSettings={handleOpenSettings}
            onOpenInGameContextMenu={handleOpenInGameContextMenu}
            onRaiseTruco={handleRaiseTruco}
            onResetProgressFromContextMenu={handleResetProgressFromContextMenu}
            onRunFromTruco={handleRunFromTruco}
            onSwapPartnerFromContextMenu={handleSwapPartnerFromContextMenu}
            onWinMatchFromContextMenu={handleWinMatchFromContextMenu}
            onPlayCard={handlePlayCard}
            styles={responsiveStyles}
          />
        </Suspense>

        {!IS_NATIVE_SHELL && (
          <>
            <Suspense fallback={<div style={responsiveStyles.panelLoadingCard}>Carregando status...</div>}>
              <HandStatusPanel
                activeVariant={activeVariant}
                currentCampaignVenue={currentCampaignVenue}
                handState={handState}
                matchHandNumber={matchState?.handNumber ?? 1}
                matchScoreLabel={matchScoreLabel}
                handScoreLabel={handScoreLabel}
                currentTurnLabel={currentTurnLabel}
                statusMessage={statusMessage}
                eventMessage={eventMessage}
                styles={responsiveStyles}
              />
            </Suspense>

            <Suspense fallback={<div style={responsiveStyles.panelLoadingCard}>Carregando campanha...</div>}>
              <CampaignPanel
                campaignCompleted={campaignCompleted}
                currentCampaignStage={currentCampaignStage}
                currentCampaignVenue={currentCampaignVenue}
                currentVenueWins={currentVenueWins}
                campaignSummary={campaignSummary}
                playerProfile={playerProfile}
                onResetCampaign={handleResetCampaign}
                styles={responsiveStyles}
              />
            </Suspense>

            <Suspense fallback={<div style={responsiveStyles.panelLoadingCard}>Carregando logs...</div>}>
              <LogsPanel logs={logs} onCopyLogs={handleCopyLogs} styles={responsiveStyles} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  )
}

function getGameplayBackgroundImage(backgroundAsset: string) {
  return `linear-gradient(180deg, rgba(16, 10, 7, 0.42) 0%, rgba(10, 7, 5, 0.5) 100%), url(${backgroundAsset})`
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #e7ecef 0%, #d8e1e8 100%)",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "42px",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "8px 0 0 0",
    color: "#4b5563",
    fontSize: "16px",
  },
  nativePage: {
    width: "100vw",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#120a06",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },
  nativeContainer: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#120a06",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  panelCard: {
    background: "#ffffff",
    border: "1px solid #d8dee6",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  progressionCard: {
    background: "#ffffff",
    border: "1px solid #d8dee6",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    marginBottom: "16px",
  },
  loadingCard: {
    minHeight: "320px",
    display: "grid",
    placeItems: "center",
    borderRadius: "20px",
    border: "1px solid #d8dee6",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    fontSize: "16px",
    fontWeight: 700,
    color: "#475569",
  },
  panelLoadingCard: {
    minHeight: "96px",
    display: "grid",
    placeItems: "center",
    borderRadius: "18px",
    border: "1px solid #d8dee6",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    fontSize: "14px",
    fontWeight: 700,
    color: "#64748b",
    marginTop: "16px",
  },
  progressionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  progressionSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },
  progressionBadge: {
    borderRadius: "999px",
    background: "#111827",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
  },
  progressionSummaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "16px",
  },
  campaignStatusBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    borderRadius: "16px",
    border: "1px solid #dbe4ed",
    background: "#f8fafc",
    padding: "14px",
    marginBottom: "12px",
  },
  campaignStatusPrimary: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  campaignStatusTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
  },
  campaignStatusText: {
    fontSize: "14px",
    color: "#475569",
  },
  campaignStatusMeta: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f172a",
  },
  campaignButtonsRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  progressionBody: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.9fr",
    gap: "16px",
    alignItems: "start",
  },
  progressionColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  progressionColumnTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
  },
  stageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  stageCard: {
    borderRadius: "16px",
    border: "1px solid #dbe4ed",
    background: "#f8fafc",
    padding: "14px",
  },
  stageCardActive: {
    background: "#ecfdf5",
    border: "1px solid #86efac",
  },
  stageCardCompleted: {
    background: "#eff6ff",
    border: "1px solid #93c5fd",
  },
  stageCardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
  },
  stageCardTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
  },
  stageCardTier: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginTop: "4px",
    fontWeight: 700,
  },
  stageCardMapLabel: {
    borderRadius: "999px",
    background: "#e2e8f0",
    color: "#334155",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  stageCardText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.45,
    marginBottom: "12px",
  },
  stageCardMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    fontSize: "13px",
    color: "#0f172a",
    fontWeight: 700,
  },
  roadmapBox: {
    borderRadius: "16px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    padding: "14px",
  },
  roadmapTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#9a3412",
    marginBottom: "6px",
  },
  roadmapText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#7c2d12",
  },
  panelTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "14px",
  },
  controlRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  label: {
    fontWeight: 700,
  },
  select: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    minWidth: "220px",
    fontSize: "16px",
    background: "#fff",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
  },
  disabledButton: {
    opacity: 1,
    filter: "saturate(0.68) brightness(0.76)",
    cursor: "not-allowed",
  },
  helpBox: {
    borderRadius: "14px",
    padding: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  helpTitle: {
    fontWeight: 700,
    marginBottom: "8px",
  },
  helpText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.5,
    fontSize: "15px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "14px",
  },
  infoBox: {
    borderRadius: "14px",
    padding: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    minHeight: "72px",
    boxSizing: "border-box",
  },
  infoBoxLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  infoBoxValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
  },
  statusBanner: {
    marginBottom: "12px",
    padding: "14px",
    borderRadius: "14px",
    background: "#eef6ff",
    border: "1px solid #cfe2ff",
  },
  statusBannerLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#375a7f",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  },
  statusBannerText: {
    fontSize: "17px",
    fontWeight: 700,
  },
  eventBanner: {
    marginBottom: "12px",
    padding: "14px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  eventBannerFinished: {
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
  },
  eventBannerLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  },
  eventBannerText: {
    fontSize: "16px",
    fontWeight: 700,
  },
  teamLegendRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  teamLegendBox: {
    flex: 1,
    minWidth: "220px",
    borderRadius: "12px",
    padding: "10px 12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
  },
  tablePanel: {
    background: "#ffffff",
    border: "1px solid #d8dee6",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    marginBottom: "16px",
  },
  nativeTablePanel: {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    border: "none",
    borderRadius: 0,
    boxShadow: "none",
    background: "#120a06",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  gameHudLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  tableHudSurface: {
    backgroundImage: getGameplayBackgroundImage(botecoSceneBgAsset),
    backgroundSize: "cover, cover",
    backgroundPosition: "center, center",
    backgroundRepeat: "no-repeat, no-repeat",
    borderRadius: "26px",
    padding: "clamp(10px, 1.4vw, 16px)",
    border: "4px solid #23170f",
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.05)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  nativeTableHudSurface: {
    width: "100vw",
    height: "100vh",
    padding: 0,
    border: "none",
    borderRadius: 0,
    boxShadow: "none",
    backgroundColor: "#120a06",
  },
  gameViewportStageSlot: {
    position: "relative",
    flex: "0 0 auto",
    overflow: "hidden",
    margin: "0 auto",
  },
  nativeGameViewportStageSlot: {
    margin: 0,
  },
  gameViewportFrame: {
    width: "1080px",
    height: "500px",
    display: "flex",
    transformOrigin: "top left",
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
  },
  nativeGameViewportFrame: {
    borderRadius: 0,
  },
  gameViewport: {
    display: "grid",
    gridTemplateColumns: "minmax(148px, 0.24fr) minmax(0, 1fr) minmax(126px, 0.2fr)",
    gap: "clamp(6px, 0.75vw, 10px)",
    alignItems: "stretch",
    width: "100%",
    height: "100%",
    minHeight: 0,
  },
  gameplayIntroContentBackground: {
    opacity: 0,
    transform: "scale(0.985)",
    pointerEvents: "none",
  },
  gameplayIntroContentReveal: {
    opacity: 1,
    transform: "scale(1)",
    transition: "opacity 0.42s ease, transform 0.42s ease",
    pointerEvents: "none",
  },
  gameplayIntroBlockerBackground: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    background: "transparent",
    pointerEvents: "auto",
  },
  gameplayIntroBlockerReveal: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    background: "transparent",
    pointerEvents: "auto",
  },
  gameLeftRail: {
    display: "grid",
    gridTemplateRows: "max-content minmax(0, 1fr)",
    gap: "clamp(5px, 0.55vw, 7px)",
    minWidth: 0,
    minHeight: 0,
    alignItems: "stretch",
    overflow: "hidden",
  },
  gameMainColumn: {
    display: "grid",
    gridTemplateRows: "minmax(0, 1fr) auto",
    gap: "clamp(3px, 0.34vw, 5px)",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  gameSidebarColumn: {
    display: "grid",
    gridTemplateRows: "max-content minmax(0, 1fr)",
    gap: "clamp(6px, 0.62vw, 8px)",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  gameSidebarColumnActionsOnly: {
    gridTemplateRows: "minmax(0, 1fr)",
    alignItems: "stretch",
  },
  inGameContextMenuWrap: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    minWidth: 0,
    zIndex: 30,
    transform: "translateY(-28px)",
  },
  inGameContextMenuButton: {
    borderRadius: "12px",
    border: "1px solid rgba(244, 226, 190, 0.38)",
    background: "linear-gradient(180deg, rgba(83,56,37,0.94) 0%, rgba(45,30,20,0.96) 100%)",
    color: "#fff3de",
    padding: "clamp(8px, 0.7vw, 10px) clamp(12px, 1vw, 14px)",
    fontSize: "clamp(10px, 0.84vw, 11px)",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(0,0,0,0.22)",
  },
  inGameContextMenuButtonHand: {
    minHeight: "clamp(38px, 3vw, 44px)",
    minWidth: "clamp(92px, 8.2vw, 116px)",
    padding: "clamp(8px, 0.68vw, 10px) clamp(14px, 1.05vw, 16px)",
    borderRadius: "14px",
    letterSpacing: "0.08em",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    boxShadow: "0 12px 20px rgba(0,0,0,0.24)",
  },
  inGameContextMenuPanel: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: "min(240px, 100%)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderRadius: "16px",
    padding: "12px",
    background: "linear-gradient(180deg, rgba(31,21,15,0.97) 0%, rgba(18,12,8,0.98) 100%)",
    border: "1px solid rgba(244, 226, 190, 0.16)",
    boxShadow: "0 18px 32px rgba(0,0,0,0.32)",
  },
  inGameContextMenuPanelHand: {
    position: "absolute",
    right: 0,
    bottom: "calc(100% + 20px)",
    width: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderRadius: "16px",
    padding: "12px",
    background: "linear-gradient(180deg, rgba(31,21,15,0.97) 0%, rgba(18,12,8,0.98) 100%)",
    border: "1px solid rgba(244, 226, 190, 0.16)",
    boxShadow: "0 18px 32px rgba(0,0,0,0.32)",
    zIndex: 40,
  },
  inGameConfirmationOverlay: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    padding: "clamp(16px, 1.4vw, 24px)",
    background: "rgba(0,0,0,0.48)",
    zIndex: 80,
  },
  inGameConfirmationCard: {
    width: "min(520px, 100%)",
    borderRadius: "22px",
    padding: "clamp(18px, 1.5vw, 24px)",
    background: "linear-gradient(180deg, rgba(40,27,18,0.98) 0%, rgba(20,13,9,0.99) 100%)",
    border: "1px solid rgba(244, 226, 190, 0.18)",
    boxShadow: "0 26px 44px rgba(0,0,0,0.42)",
    color: "#fff4e2",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inGameConfirmationEyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#d8c3a5",
  },
  inGameConfirmationTitle: {
    margin: 0,
    fontSize: "clamp(24px, 1.9vw, 30px)",
    lineHeight: 1.05,
    color: "#fff7ed",
    fontFamily: "Georgia, serif",
  },
  inGameConfirmationText: {
    margin: 0,
    fontSize: "clamp(14px, 1.02vw, 16px)",
    lineHeight: 1.55,
    color: "#ead8bc",
  },
  inGameConfirmationWarning: {
    borderRadius: "14px",
    padding: "12px 14px",
    background: "rgba(166, 94, 46, 0.16)",
    border: "1px solid rgba(213, 141, 71, 0.24)",
    color: "#f7d8b2",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.45,
  },
  inGameConfirmationActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
    paddingTop: "6px",
  },
  inGameConfirmationCancelButton: {
    borderRadius: "14px",
    border: "1px solid rgba(244, 226, 190, 0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#ead8bc",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },
  inGameConfirmationConfirmButton: {
    borderRadius: "14px",
    border: "1px solid rgba(213, 141, 71, 0.42)",
    background: "linear-gradient(180deg, rgba(166,94,46,0.98) 0%, rgba(120,63,28,0.98) 100%)",
    color: "#fff7ed",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 20px rgba(0,0,0,0.24)",
  },
  inGameContextMenuAction: {
    borderRadius: "12px",
    border: "1px solid rgba(244, 226, 190, 0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff3de",
    padding: "12px 14px",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "left",
    cursor: "pointer",
  },
  inGameContextMenuActionSecondary: {
    borderRadius: "12px",
    border: "1px solid rgba(244, 226, 190, 0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "#d8c3a5",
    padding: "12px 14px",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "left",
    cursor: "pointer",
  },
  scenePanel: {
    borderRadius: "22px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.03)",
    padding: "clamp(7px, 0.62vw, 9px)",
    boxShadow: "none",
    color: "#f7ede1",
    alignSelf: "start",
  },
  nativeScenePanel: {
    paddingLeft: "max(34px, env(safe-area-inset-left, 0px))",
    paddingRight: "14px",
  },
  nativeScorePadCard: {
    paddingLeft: "max(34px, env(safe-area-inset-left, 0px))",
    paddingRight: "14px",
  },
  nativeIosScorePadBottomCell: {
    transform: "translateY(-22px)",
  },
  scenePanelTitle: {
    fontSize: "clamp(9px, 0.74vw, 11px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    color: "#d9c6aa",
    marginBottom: "6px",
    textAlign: "center",
  },
  rosterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "clamp(3px, 0.24vw, 5px) clamp(6px, 0.52vw, 8px)",
    alignItems: "start",
  },
  rosterCard: {
    borderRadius: "16px",
    background: "transparent",
    border: "1px solid transparent",
    padding: "clamp(2px, 0.2vw, 4px) clamp(2px, 0.2vw, 4px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(2px, 0.16vw, 3px)",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "clamp(90px, 7.8vw, 106px)",
    boxShadow: "none",
  },
  rosterCardHuman: {
    border: "1px solid transparent",
    boxShadow: "none",
  },
  rosterAvatar: {
    width: "clamp(60px, 4.55vw, 70px)",
    height: "clamp(60px, 4.55vw, 70px)",
    borderRadius: "18px",
    background: "linear-gradient(180deg, #8a745d 0%, #4a392c 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(12px, 1vw, 15px)",
    fontWeight: 800,
    color: "#fff7ed",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    overflow: "hidden",
    border: "1px solid rgba(240, 226, 206, 0.45)",
  },
  rosterAvatarImage: {
    width: "118%",
    height: "118%",
    objectFit: "cover",
    objectPosition: "center 22%",
    display: "block",
    transform: "scale(1.12)",
  },
  rosterName: {
    fontSize: "clamp(8px, 0.8vw, 11px)",
    fontWeight: 800,
    color: "#fff7ed",
    textAlign: "center",
    lineHeight: 1.05,
    maxWidth: "100%",
  },
  scorePadCard: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    borderRadius: "20px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.03)",
    boxShadow: "none",
    padding: "clamp(8px, 0.72vw, 10px)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    width: "100%",
    height: "100%",
  },
  scorePadCardSurface: {
    width: "min(100%, 168px)",
    maxWidth: "100%",
    height: "auto",
    maxHeight: "96%",
    borderRadius: "18px",
    background: "linear-gradient(180deg, #f4ead7 0%, #ead9b8 100%)",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    border: "1px solid rgba(126, 82, 43, 0.32)",
    color: "#2f241b",
    display: "flex",
    flexDirection: "column",
    aspectRatio: "314 / 390",
    minHeight: 0,
    padding: "3.2%",
    boxSizing: "border-box",
    alignSelf: "center",
    marginTop: 0,
    position: "relative",
    overflow: "hidden",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.36)",
  },
  scorePadGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "56% 44%",
    minHeight: "100%",
    gap: 0,
    position: "relative",
    zIndex: 1,
    width: "100%",
    padding: "16% 10% 12%",
    boxSizing: "border-box",
  },
  scorePadCellTopLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 0,
    minWidth: 0,
    padding: "0 8% 12%",
    borderRight: "1px solid rgba(97, 69, 43, 0.16)",
    borderBottom: "1px solid rgba(97, 69, 43, 0.22)",
  },
  scorePadCellTopRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 0,
    minWidth: 0,
    padding: "0 8% 12%",
    borderBottom: "1px solid rgba(97, 69, 43, 0.22)",
  },
  scorePadCellBottomLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 0,
    minWidth: 0,
    padding: "12% 8% 0",
    borderRight: "1px solid rgba(97, 69, 43, 0.14)",
  },
  scorePadCellBottomRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 0,
    minWidth: 0,
    padding: "12% 8% 0",
  },
  scorePadLabel: {
    fontSize: "clamp(12px, 0.86rem, 15px)",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "0.02em",
    color: "#5e4734",
    whiteSpace: "nowrap",
  },
  scorePadLabelLeft: {
    textAlign: "center",
    width: "100%",
  },
  scorePadLabelRight: {
    textAlign: "center",
    width: "100%",
  },
  scorePadValue: {
    marginTop: "clamp(5px, 0.5vw, 8px)",
    fontSize: "clamp(18px, 1.24rem, 23px)",
    lineHeight: 1,
    fontWeight: 900,
    color: "#2f241b",
    width: "100%",
  },
  scorePadValueLeft: {
    textAlign: "center",
  },
  scorePadValueRight: {
    textAlign: "center",
  },
  scorePadMetaLabel: {
    fontSize: "clamp(11px, 0.78rem, 13px)",
    lineHeight: 1,
    fontWeight: 900,
    color: "#70543c",
    whiteSpace: "nowrap",
  },
  scorePadMetaLabelLeft: {
    textAlign: "center",
    width: "100%",
  },
  scorePadMetaLabelRight: {
    textAlign: "center",
    width: "100%",
  },
  scorePadMetaValue: {
    marginTop: "clamp(4px, 0.42vw, 7px)",
    fontSize: "clamp(14px, 0.98rem, 18px)",
    lineHeight: 1,
    fontWeight: 900,
    color: "#33271d",
    width: "100%",
  },
  scorePadMetaValueLeft: {
    textAlign: "center",
  },
  scorePadMetaValueRight: {
    textAlign: "center",
  },
  tablePanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  tableTitle: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  tableSubtitle: {
    color: "#64748b",
    fontSize: "14px",
  },
  roundPill: {
    borderRadius: "999px",
    padding: "10px 14px",
    background: "#0f172a",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
  },
  board: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  topSeat: {
    display: "flex",
    justifyContent: "center",
  },
  middleSeatsRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 280px",
    gap: "16px",
    alignItems: "stretch",
  },
  sideSeat: {
    display: "flex",
    alignItems: "center",
  },
  playerSeat: {
    width: "100%",
    borderRadius: "14px",
    padding: "10px 12px",
    background: "rgba(248,250,252,0.92)",
    border: "1px solid rgba(213,220,230,0.7)",
    boxSizing: "border-box",
  },
  playerSeatActive: {
    border: "2px solid #0f172a",
    background: "#eef2ff",
  },
  playerSeatHuman: {
    background: "#f7fbf7",
  },
  playerSeatTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
    marginBottom: "8px",
  },
  playerSeatName: {
    fontWeight: 700,
    fontSize: "14px",
  },
  playerSeatDetail: {
    color: "#475569",
    fontSize: "12px",
    marginBottom: "6px",
  },
  turnIndicator: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1d4ed8",
  },
  teamBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },
  teamBadgeUs: {
    background: "#dcfce7",
    color: "#166534",
  },
  teamBadgeThem: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  tableSurface: {
    background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0.02) 100%)",
    borderRadius: "28px",
    aspectRatio: "1 / 1",
    minHeight: 0,
    height: "100%",
    maxHeight: "100%",
    padding: "clamp(6px, 0.8vw, 10px)",
    boxSizing: "border-box",
    width: "auto",
    maxWidth: "100%",
    border: "1px solid rgba(255,255,255,0.08)",
    alignSelf: "center",
    transform: "scale(1.08)",
    transformOrigin: "center center",
  },
  tableSurfaceWrap: {
    flex: 1.32,
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  playerCardsBlock: {
    borderRadius: "18px",
    background: "transparent",
    padding: "clamp(4px, 0.38vw, 6px) clamp(9px, 0.82vw, 11px) clamp(6px, 0.54vw, 8px)",
    border: "1px solid rgba(255,255,255,0.03)",
    flexShrink: 0,
    minHeight: "clamp(78px, 7.2vw, 96px)",
    overflow: "visible",
  },
  tableHudSidebar: {
    height: "100%",
    borderRadius: "20px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.03)",
    padding: "clamp(9px, 0.82vw, 12px) clamp(9px, 0.88vw, 12px)",
    boxSizing: "border-box",
    display: "grid",
    gridTemplateRows: "max-content max-content",
    gap: "clamp(10px, 0.82vw, 12px)",
    justifyItems: "center",
    alignItems: "center",
    alignContent: "center",
    color: "#f8fafc",
    minHeight: 0,
    overflow: "hidden",
  },
  tableHudSidebarActionsOnly: {
    gridTemplateRows: "minmax(0, 1fr)",
    alignContent: "center",
    alignItems: "center",
    justifyItems: "stretch",
    justifyContent: "center",
  },
  tableHudScoreRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "15px",
    fontWeight: 800,
    flexWrap: "wrap",
  },
  tableHudStats: {
    borderRadius: "16px",
    background: "linear-gradient(180deg, rgba(109,72,48,0.78) 0%, rgba(57,36,24,0.84) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "clamp(11px, 0.88vw, 13px) clamp(12px, 1vw, 14px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "clamp(9px, 0.7vw, 11px)",
    width: "90%",
    alignSelf: "center",
    justifySelf: "center",
    marginTop: "clamp(2px, 0.2vw, 4px)",
    minHeight: 0,
    height: "100%",
  },
  tableHudStatsDivider: {
    width: "72%",
    height: "1px",
    background:
      "linear-gradient(90deg, rgba(255,244,228,0.04) 0%, rgba(255,244,228,0.32) 50%, rgba(255,244,228,0.04) 100%)",
    alignSelf: "center",
  },
  tableHudStatLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "clamp(9px, 0.82vw, 10px)",
    alignItems: "baseline",
    color: "#f8f2e8",
    textShadow: "0 1px 2px rgba(0,0,0,0.7)",
    lineHeight: 1.2,
  },
  tableHudStatLabel: {
    color: "rgba(255,244,228,0.88)",
    fontSize: "clamp(8px, 0.72vw, 9px)",
    fontWeight: 700,
    letterSpacing: "0.01em",
    textShadow: "0 1px 2px rgba(0,0,0,0.58)",
    flex: "0 0 34%",
  },
  tableHudStatValue: {
    color: "#fffaf2",
    fontSize: "clamp(10px, 0.94vw, 11px)",
    fontWeight: 800,
    textAlign: "right",
    marginLeft: "auto",
    textShadow: "0 1px 2px rgba(0,0,0,0.82)",
    flex: 1,
  },
  tableHudStatLineCentered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "clamp(4px, 0.3vw, 5px)",
    textAlign: "center",
    lineHeight: 1.2,
  },
  tableHudStatLabelCentered: {
    color: "rgba(255,244,228,0.9)",
    fontSize: "clamp(8px, 0.72vw, 9px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    textShadow: "0 1px 2px rgba(0,0,0,0.58)",
  },
  tableHudStatValueCentered: {
    color: "#fffaf2",
    fontSize: "clamp(12px, 1.1vw, 15px)",
    fontWeight: 900,
    textAlign: "center",
    textShadow: "0 1px 2px rgba(0,0,0,0.82)",
    lineHeight: 1.12,
    maxWidth: "100%",
  },
  tableHudVenue: {
    borderRadius: "14px",
    background: "rgba(0,0,0,0.18)",
    padding: "clamp(6px, 0.6vw, 8px)",
  },
  tableHudVenueTitle: {
    fontSize: "clamp(10px, 0.82vw, 12px)",
    fontWeight: 800,
    marginBottom: "4px",
  },
  tableHudVenueText: {
    fontSize: "clamp(8px, 0.72vw, 10px)",
    color: "rgba(248,250,252,0.86)",
    lineHeight: 1.45,
  },
  tableHudMessage: {
    borderRadius: "14px",
    background: "rgba(0,0,0,0.18)",
    padding: "clamp(6px, 0.6vw, 8px)",
    fontSize: "clamp(8px, 0.72vw, 10px)",
    lineHeight: 1.4,
    color: "#fff7ed",
    minHeight: "clamp(26px, 2.3vw, 32px)",
  },
  actionDisplayCard: {
    borderRadius: "18px",
    background: "linear-gradient(180deg, #f3e7cf 0%, #dec49c 100%)",
    border: "1px solid #b18553",
    padding: "clamp(9px, 0.74vw, 11px) clamp(11px, 0.96vw, 13px)",
    color: "#2f241b",
    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
    width: "90%",
    alignSelf: "center",
    justifySelf: "center",
    minHeight: "clamp(76px, 6.9vw, 94px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  actionDisplayLabel: {
    fontSize: "clamp(8px, 0.7vw, 10px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "5px",
    textAlign: "center",
  },
  actionDisplayValue: {
    fontSize: "clamp(13px, 1.12vw, 17px)",
    fontWeight: 900,
    lineHeight: 1.1,
    textAlign: "center",
  },
  tableCenterArea: {
    width: "100%",
    height: "100%",
    minHeight: "360px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableMiddleRow: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 140px 1fr",
    gap: "18px",
    alignItems: "center",
  },
  tableCenterBadge: {
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "16px 10px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  tableCenterBadgeTop: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "0.06em",
  },
  tableCenterBadgeBottom: {
    fontSize: "13px",
    marginTop: "6px",
  },
  tableCardSlot: {
    width: "120px",
    minHeight: "150px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px dashed rgba(255,255,255,0.35)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    boxSizing: "border-box",
  },
  tableCardSlotHighlight: {
    boxShadow: "0 0 0 3px #fde68a",
    background: "rgba(255,255,255,0.18)",
  },
  tableCardSlotHeader: {
    fontSize: "12px",
    marginBottom: "8px",
    opacity: 0.95,
  },
  tableCardFace: {
    width: "92px",
    minHeight: "116px",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
  },
  tableCardRank: {
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1,
  },
  tableCardSuit: {
    fontSize: "30px",
    lineHeight: 1,
  },
  tableCardText: {
    fontSize: "12px",
    color: "#475569",
  },
  tableCardEmpty: {
    fontSize: "14px",
    opacity: 0.9,
    textAlign: "center",
  },
  bottomSeatBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  actionArea: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.94)",
    padding: "14px",
    marginTop: "14px",
  },
  mobileHandPanel: {
    display: "grid",
    gridTemplateRows: "clamp(31px, 2.65vw, 36px) minmax(0, 1fr)",
    gap: "6px",
    height: "100%",
    minHeight: 0,
    position: "relative",
  },
  mobileHandHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  mobileHandHeaderControlsOnly: {
    justifyContent: "flex-end",
  },
  mobileHandRowWrap: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) max-content",
    gap: "clamp(8px, 0.7vw, 12px)",
    alignItems: "center",
    minWidth: 0,
    minHeight: 0,
  },
  mobileHandTitle: {
    fontSize: "clamp(10px, 0.82vw, 12px)",
    fontWeight: 800,
    color: "#fff7ed",
  },
  mobileHandMeta: {
    fontSize: "clamp(8px, 0.65vw, 9px)",
    fontWeight: 700,
    color: "#d6c7b2",
  },
  coveredCardToggleWrap: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  coveredCardHint: {
    position: "absolute",
    right: 0,
    bottom: "calc(100% + 7px)",
    width: "142px",
    borderRadius: "10px",
    background: "linear-gradient(180deg, rgba(255,247,237,0.98) 0%, rgba(254,215,170,0.98) 100%)",
    border: "1px solid rgba(251,191,36,0.88)",
    color: "#431407",
    boxShadow: "0 8px 18px rgba(0,0,0,0.34)",
    padding: "7px 9px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    pointerEvents: "none",
    zIndex: 12,
  },
  coveredCardHintTitle: {
    fontSize: "9px",
    fontWeight: 900,
    lineHeight: 1,
    textTransform: "uppercase",
    color: "#7c2d12",
  },
  coveredCardHintText: {
    fontSize: "9px",
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#431407",
  },
  coveredCardToggle: {
    minHeight: "38px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.28)",
    background: "rgba(31,20,14,0.62)",
    color: "#f7efe0",
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    padding: "6px 14px 6px 8px",
    fontSize: "clamp(13px, 1.05vw, 15px)",
    fontWeight: 800,
    cursor: "pointer",
    lineHeight: 1,
    boxShadow: "0 5px 12px rgba(0,0,0,0.22)",
  },
  coveredCardToggleHighlighted: {
    background: "rgba(120,53,15,0.9)",
    borderColor: "rgba(251,191,36,0.88)",
    color: "#fff7ed",
    boxShadow: "0 0 0 2px rgba(251,191,36,0.32), 0 8px 18px rgba(0,0,0,0.34)",
  },
  coveredCardToggleActive: {
    background: "rgba(245,158,11,0.22)",
    borderColor: "rgba(251,191,36,0.72)",
    color: "#fff7ed",
  },
  coveredCardToggleDisabled: {
    opacity: 0.48,
    cursor: "not-allowed",
  },
  coveredCardToggleSwitch: {
    width: "38px",
    height: "23px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    padding: "2px",
    boxSizing: "border-box",
  },
  coveredCardToggleKnob: {
    width: "17px",
    height: "17px",
    borderRadius: "999px",
    background: "#d6c7b2",
    transform: "translateX(0)",
    transition: "transform 140ms ease, background 140ms ease",
  },
  coveredCardToggleKnobActive: {
    transform: "translateX(17px)",
    background: "#fbbf24",
  },
  mobileHandRow: {
    display: "flex",
    gap: "clamp(4px, 0.35vw, 6px)",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    minWidth: 0,
  },
  mobileHandMenuDock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 0,
    minHeight: 0,
  },
  inGameActionsCard: {
    borderRadius: "16px",
    background: "linear-gradient(180deg, rgba(25,16,11,0.22) 0%, rgba(17,10,7,0.34) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "clamp(7px, 0.58vw, 9px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(9px, 0.72vw, 11px)",
    width: "90%",
    alignSelf: "center",
    justifySelf: "center",
    marginTop: "clamp(10px, 0.92vw, 14px)",
    transform: "translateY(0)",
  },
  inGameActionsRow: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 0.62vw, 10px)",
    alignItems: "stretch",
    width: "100%",
  },
  inGameActionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "clamp(8px, 0.62vw, 10px)",
    justifyItems: "stretch",
    width: "100%",
  },
  inGameActionsHint: {
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff7ed",
    padding: "clamp(6px, 0.55vw, 7px)",
    fontSize: "clamp(8px, 0.72vw, 9px)",
    lineHeight: 1.45,
  },
  nineHandDecisionPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(7px, 0.62vw, 9px)",
    width: "100%",
    alignItems: "stretch",
    position: "relative",
  },
  nineHandDecisionTooltip: {
    borderRadius: "10px",
    background: "linear-gradient(180deg, rgba(255,247,237,0.98) 0%, rgba(254,215,170,0.98) 100%)",
    border: "1px solid rgba(251,191,36,0.88)",
    color: "#431407",
    boxShadow: "0 8px 18px rgba(0,0,0,0.34)",
    padding: "7px 9px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    width: "100%",
  },
  nineHandDecisionTooltipTitle: {
    fontSize: "9px",
    fontWeight: 900,
    lineHeight: 1,
    textTransform: "uppercase",
    color: "#7c2d12",
    textAlign: "center",
  },
  nineHandDecisionTooltipText: {
    fontSize: "9px",
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#431407",
    textAlign: "center",
  },
  nineHandDecisionTitle: {
    color: "#fff7ed",
    fontSize: "clamp(11px, 0.94vw, 13px)",
    fontWeight: 900,
    lineHeight: 1,
    textAlign: "center",
    textShadow: "0 1px 2px rgba(0,0,0,0.72)",
  },
  nineHandDecisionText: {
    color: "rgba(255,247,237,0.82)",
    fontSize: "clamp(8px, 0.72vw, 9px)",
    fontWeight: 800,
    lineHeight: 1.1,
    textAlign: "center",
  },
  nineHandPartnerCards: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(4px, 0.38vw, 6px)",
    minWidth: 0,
  },
  nineHandPartnerCard: {
    width: "clamp(56px, 5.1vw, 68px)",
    minWidth: "clamp(56px, 5.1vw, 68px)",
    height: "clamp(84px, 7.3vw, 96px)",
    borderRadius: "12px",
    background: `center / cover no-repeat url(${cardFaceAgedPaperAsset})`,
    border: "1px solid #d9c7a8",
    boxShadow: "0 4px 8px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },
  nineHandPartnerRank: {
    fontSize: "clamp(24px, 2vw, 28px)",
    fontWeight: 900,
    lineHeight: 1,
  },
  nineHandPartnerSuit: {
    fontSize: "clamp(24px, 2vw, 28px)",
    lineHeight: 1,
  },
  mobileCardButton: {
    width: "clamp(56px, 5.04vw, 70px)",
    minWidth: "clamp(56px, 5.04vw, 70px)",
    minHeight: "clamp(81px, 7.28vw, 101px)",
    borderRadius: "11px",
    background: `center / cover no-repeat url(${cardFaceAgedPaperAsset})`,
    border: "1px solid #d9c7a8",
    boxShadow: "0 4px 10px rgba(15,23,42,0.12)",
    padding: "clamp(4px, 0.39vw, 6px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  mobileCardButtonCoveredPreview: {
    transform: "translateY(-3px)",
    boxShadow: "0 0 0 2px rgba(251,191,36,0.85), 0 8px 14px rgba(0,0,0,0.28)",
  },
  coveredCardPreviewBadge: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(-12deg)",
    borderRadius: "999px",
    background: "rgba(31, 20, 14, 0.86)",
    color: "#fbbf24",
    border: "1px solid rgba(251,191,36,0.72)",
    padding: "3px 6px",
    fontSize: "8px",
    fontWeight: 900,
    textTransform: "uppercase",
    zIndex: 2,
  },
  mobileCardCornerTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    lineHeight: 1,
  },
  mobileCardCornerBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1,
    transform: "rotate(180deg)",
  },
  mobileCardRank: {
    fontSize: "clamp(15px, 1.26vw, 18px)",
    fontWeight: 800,
    lineHeight: 1,
  },
  mobileCardSuit: {
    fontSize: "clamp(15px, 1.34vw, 18px)",
    lineHeight: 1,
  },
  mobileCardCenterSuit: {
    fontSize: "clamp(22px, 1.9vw, 28px)",
    lineHeight: 1,
    alignSelf: "center",
  },
  actionAreaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  actionAreaTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  actionAreaSubtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  betBadge: {
    borderRadius: "999px",
    padding: "10px 14px",
    background: "#7c2d12",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
  },
  trucoPanel: {
    borderRadius: "18px",
    padding: "16px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
  },
  trucoPanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  trucoPanelTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#9a3412",
  },
  trucoPanelStatus: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#7c2d12",
    background: "#ffedd5",
    borderRadius: "999px",
    padding: "6px 10px",
  },
  trucoPanelBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  trucoMessageBox: {
    borderRadius: "12px",
    padding: "12px",
    background: "#ffffff",
    border: "1px solid #fed7aa",
  },
  trucoMessageLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#9a3412",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  },
  trucoMessageText: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#431407",
  },
  trucoDetailsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "10px",
  },
  trucoDetailCard: {
    borderRadius: "12px",
    padding: "12px",
    background: "#ffffff",
    border: "1px solid #fed7aa",
  },

  trucoDetailLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#9a3412",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  },

  trucoDetailValue: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#431407",
  },
  trucoActionsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  trucoPrimaryButton: {
    padding: "clamp(6px, 0.5vw, 8px) clamp(11px, 0.96vw, 14px)",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#563520",
    color: "#fff",
    cursor: "pointer",
    fontSize: "clamp(10px, 0.88vw, 11px)",
    fontWeight: 800,
    minHeight: "clamp(34px, 2.8vw, 38px)",
    lineHeight: 1.05,
    textShadow: "0 1px 2px rgba(0,0,0,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minWidth: 0,
    alignSelf: "stretch",
    marginLeft: 0,
    marginRight: 0,
  },
  trucoSecondaryButton: {
    padding: "clamp(6px, 0.5vw, 8px) clamp(11px, 0.96vw, 14px)",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#563520",
    color: "#f7efe0",
    cursor: "pointer",
    fontSize: "clamp(10px, 0.88vw, 11px)",
    fontWeight: 800,
    minHeight: "clamp(34px, 2.8vw, 38px)",
    lineHeight: 1.05,
    textShadow: "0 1px 2px rgba(0,0,0,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minWidth: 0,
    alignSelf: "stretch",
    marginLeft: 0,
    marginRight: 0,
  },
  trucoHintBox: {
    borderRadius: "12px",
    padding: "12px 14px",
    background: "#fff",
    border: "1px dashed #fdba74",
    color: "#7c2d12",
    fontSize: "14px",
  },
  handPanel: {
    borderRadius: "18px",
    padding: "16px",
    background: "#f8fafc",
    border: "1px solid #dbe2ea",
  },
  handTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  emptyHandBox: {
    borderRadius: "12px",
    padding: "16px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    color: "#475569",
  },
  handRow: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  cardButton: {
    width: "120px",
    height: "170px",
    borderRadius: "14px",
    border: "1px solid #d8dee6",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "10px",
    textAlign: "left",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    boxShadow: "0 8px 16px rgba(15, 23, 42, 0.08)",
  },
  cardButtonActive: {
    cursor: "pointer",
  },
  cardButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  cardCornerTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    lineHeight: 1,
    gap: "4px",
  },
  cardCenterSuit: {
    alignSelf: "center",
    fontSize: "42px",
    lineHeight: 1,
  },
  cardCornerBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1,
    gap: "4px",
  },
  cardRank: {
    fontSize: "30px",
    fontWeight: 800,
  },
  cardSuit: {
    fontSize: "22px",
  },
  actionHintBox: {
    borderRadius: "12px",
    padding: "12px 14px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "15px",
  },
  gameStartScreen: {
    width: "100%",
    height: "100%",
    gridColumn: "1 / -1",
    display: "block",
    position: "relative",
    overflow: "hidden",
    background: "#090604",
  },
  gameStartBackdrop: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    filter: "blur(12px)",
    transform: "scale(1.06)",
    opacity: 0.72,
  },
  gameStartImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    display: "block",
    zIndex: 1,
  },
  gameStartHotspot: {
    position: "absolute",
    left: "61.8%",
    top: "38.6%",
    width: "28.4%",
    height: "26.7%",
    border: "none",
    borderRadius: "18px",
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    opacity: 0,
    zIndex: 2,
    boxSizing: "border-box",
  },
  gameStartTutorialHotspot: {
    position: "absolute",
    left: "63.2%",
    top: "65.2%",
    width: "26%",
    height: "14.2%",
    borderRadius: "14px",
    border: "none",
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    opacity: 0,
    zIndex: 2,
    boxSizing: "border-box",
  },
  gameStartSettingsHotspot: {
    position: "absolute",
    left: "63.2%",
    top: "79.6%",
    width: "26%",
    height: "12.8%",
    border: "none",
    borderRadius: "14px",
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    opacity: 0,
    zIndex: 2,
    boxSizing: "border-box",
  },
  settingsScreen: {
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "22px 28px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, rgba(34, 21, 14, 0.96) 0%, rgba(13, 8, 5, 0.98) 56%, rgba(42, 27, 18, 0.96) 100%)",
    color: "#f8e7cb",
    overflow: "hidden",
  },
  settingsHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "18px",
    flexShrink: 0,
  },
  settingsEyebrow: {
    color: "#cda05f",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  settingsTitle: {
    margin: "5px 0 0",
    fontSize: "34px",
    lineHeight: 0.98,
    color: "#fff3df",
    fontFamily: "Georgia, serif",
  },
  settingsBoard: {
    flex: 1,
    minHeight: 0,
    display: "grid",
    alignContent: "start",
    gap: "14px",
    padding: "18px",
    borderRadius: "8px",
    background: "linear-gradient(180deg, rgba(63, 42, 29, 0.9) 0%, rgba(27, 18, 12, 0.94) 100%)",
    border: "1px solid rgba(205, 160, 95, 0.2)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 36px rgba(0,0,0,0.24)",
    boxSizing: "border-box",
  },
  settingsRow: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 0.55fr) minmax(0, 1fr)",
    alignItems: "center",
    gap: "20px",
    minWidth: 0,
  },
  settingsRowLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: 0,
  },
  settingsLabel: {
    color: "#f8e7cb",
    fontSize: "20px",
    fontWeight: 900,
    fontFamily: "Georgia, serif",
  },
  settingsValue: {
    color: "#cda05f",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  settingsSegmentedControl: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    minWidth: 0,
  },
  settingsSegmentButton: {
    minHeight: "92px",
    borderRadius: "8px",
    border: "1px solid rgba(244, 226, 190, 0.22)",
    background: "rgba(18, 12, 8, 0.64)",
    color: "#ead6b6",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "6px",
    textAlign: "left",
    cursor: "pointer",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  },
  settingsSegmentButtonActive: {
    border: "1px solid rgba(245, 190, 92, 0.78)",
    background: "linear-gradient(180deg, rgba(104, 63, 28, 0.98) 0%, rgba(53, 33, 19, 0.98) 100%)",
    color: "#fff6e8",
    boxShadow: "0 16px 28px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.08)",
  },
  settingsSegmentTitle: {
    fontSize: "19px",
    lineHeight: 1.05,
    fontWeight: 900,
    fontFamily: "Georgia, serif",
  },
  settingsSegmentSubtitle: {
    color: "#d5bf9a",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  tutorialDraftScreen: {
    position: "relative",
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "232px minmax(0, 1fr) 184px",
    gap: "9px",
    alignItems: "stretch",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 46%, rgba(105, 69, 37, 0.42) 0%, rgba(24, 16, 10, 0.82) 48%, #090604 100%)",
    color: "#fff7ed",
    isolation: "isolate",
  },
  tutorialGameplayOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(5, 3, 2, 0.16) 0%, rgba(5, 3, 2, 0.24) 100%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  tutorialGameLeftRail: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateRows: "max-content minmax(0, 1fr)",
    gap: "7px",
    minWidth: 0,
    minHeight: 0,
    alignItems: "stretch",
    overflow: "hidden",
  },
  tutorialGameMainColumn: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateRows: "minmax(0, 1fr) auto",
    gap: "5px",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  tutorialGameSidebarColumn: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateRows: "max-content minmax(0, 1fr)",
    gap: "8px",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  tutorialHighlightedCard: {
    boxShadow: "0 0 0 3px rgba(251, 191, 36, 0.72), 0 12px 22px rgba(0,0,0,0.28)",
    transform: "translateY(-4px)",
  },
  tutorialHighlightedAction: {
    filter: "brightness(1.16)",
    boxShadow: "0 0 0 3px rgba(251, 191, 36, 0.78), 0 14px 24px rgba(0,0,0,0.34)",
    transform: "translateY(-2px)",
  },
  tutorialDimmedCard: {
    opacity: 0.48,
    cursor: "default",
    transform: "none",
  },
  tutorialDraftTable: {
    position: "absolute",
    left: "50%",
    top: "52%",
    width: "58%",
    height: "64%",
    transform: "translate(-50%, -50%)",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(128, 83, 45, 0.96) 0%, rgba(82, 50, 28, 0.98) 52%, rgba(49, 31, 20, 0.98) 100%)",
    border: "8px solid rgba(52, 31, 18, 0.95)",
    boxShadow: "0 28px 48px rgba(0,0,0,0.42), inset 0 0 42px rgba(255,217,153,0.08)",
  },
  tutorialDraftHeader: {
    position: "absolute",
    left: "18px",
    right: "18px",
    top: "14px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    pointerEvents: "none",
    zIndex: 12,
  },
  tutorialDraftEyebrow: {
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#f3d5a3",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  tutorialDraftTitle: {
    margin: "4px 0 0",
    fontSize: "30px",
    lineHeight: 1,
    textShadow: "0 3px 10px rgba(0,0,0,0.48)",
  },
  tutorialDraftBackButton: {
    position: "relative",
    zIndex: 1,
    pointerEvents: "auto",
    minWidth: "132px",
    minHeight: "48px",
    border: "2px solid rgba(245, 218, 169, 0.7)",
    borderRadius: "16px",
    background: "linear-gradient(180deg, rgba(67, 43, 28, 0.98) 0%, rgba(30, 20, 14, 0.98) 100%)",
    color: "#fff7ed",
    padding: "12px 18px",
    fontSize: "16px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: "pointer",
    textShadow: "0 2px 4px rgba(0,0,0,0.42)",
    boxShadow: "0 12px 22px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(255,255,255,0.08)",
  },
  tutorialDraftViraCard: {
    position: "absolute",
    right: "19%",
    top: "11%",
    width: "48px",
    height: "66px",
    borderRadius: "8px",
    background: "linear-gradient(180deg, #f5ead8 0%, #d9c4a3 100%)",
    color: "#b91c1c",
    border: "1px solid rgba(92, 58, 32, 0.48)",
    boxShadow: "0 10px 18px rgba(0,0,0,0.26)",
    transform: "rotate(-8deg)",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },
  tutorialDraftCardRank: {
    position: "absolute",
    left: "6px",
    top: "5px",
    fontSize: "14px",
  },
  tutorialDraftCardSuit: {
    fontSize: "25px",
  },
  tutorialDraftCardLabel: {
    position: "absolute",
    left: "50%",
    top: "-18px",
    transform: "translateX(-50%)",
    padding: "2px 7px",
    borderRadius: "999px",
    background: "rgba(29, 18, 10, 0.86)",
    color: "#f8ead2",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  tutorialDraftPlayedCards: {
    position: "absolute",
    left: "50%",
    top: "45%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  tutorialDraftCard: {
    width: "48px",
    height: "66px",
    borderRadius: "8px",
    background: "linear-gradient(180deg, #f5ead8 0%, #d9c4a3 100%)",
    color: "#1f2937",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    fontWeight: 900,
    boxShadow: "0 10px 18px rgba(0,0,0,0.22)",
  },
  tutorialDraftCardStrong: {
    width: "52px",
    height: "72px",
    borderRadius: "8px",
    background: "linear-gradient(180deg, #fff5e5 0%, #e1c79d 100%)",
    color: "#b91c1c",
    display: "grid",
    placeItems: "center",
    fontSize: "20px",
    fontWeight: 900,
    boxShadow: "0 0 0 3px rgba(245, 218, 169, 0.42), 0 14px 22px rgba(0,0,0,0.3)",
  },
  tutorialDraftCardBack: {
    width: "48px",
    height: "66px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #422515 0%, #1e130d 100%)",
    color: "#f5d6a3",
    border: "1px solid rgba(245, 218, 169, 0.32)",
    display: "grid",
    placeItems: "center",
    fontSize: "9px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    boxShadow: "0 10px 18px rgba(0,0,0,0.22)",
  },
  tutorialDraftHand: {
    position: "absolute",
    left: "50%",
    bottom: "7%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px",
  },
  tutorialDraftPlayerCard: {
    width: "50px",
    height: "70px",
    borderRadius: "8px",
    background: "linear-gradient(180deg, #f5ead8 0%, #d8c3a3 100%)",
    color: "#1f2937",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    fontWeight: 900,
    boxShadow: "0 12px 20px rgba(0,0,0,0.24)",
  },
  tutorialDraftActions: {
    position: "absolute",
    right: "-19%",
    top: "42%",
    display: "grid",
    gap: "10px",
  },
  tutorialDraftActionButton: {
    width: "120px",
    border: "1px solid rgba(245, 218, 169, 0.42)",
    borderRadius: "12px",
    background: "linear-gradient(180deg, rgba(91, 58, 34, 0.96) 0%, rgba(44, 28, 18, 0.96) 100%)",
    color: "#fff7ed",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 900,
  },
  tutorialDraftActionButtonMuted: {
    width: "120px",
    border: "1px solid rgba(245, 218, 169, 0.28)",
    borderRadius: "12px",
    background: "rgba(20, 13, 9, 0.58)",
    color: "#dbc7a7",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 900,
  },
  tutorialDraftBubble: {
    position: "absolute",
    width: "330px",
    maxWidth: "34%",
    minHeight: "128px",
    borderRadius: "18px",
    background: "linear-gradient(180deg, rgba(255, 250, 238, 0.98) 0%, rgba(236, 218, 185, 0.98) 100%)",
    border: "2px solid rgba(83, 55, 31, 0.86)",
    color: "#2f241b",
    padding: "16px 18px",
    boxSizing: "border-box",
    boxShadow: "0 18px 30px rgba(0,0,0,0.36)",
    animation: "tutorialBubbleIn 240ms cubic-bezier(0.22, 0.9, 0.24, 1)",
    zIndex: 4,
  },
  tutorialDraftBubbleKicker: {
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8a5a2d",
  },
  tutorialDraftBubbleTitle: {
    margin: "4px 0 6px",
    fontSize: "20px",
    lineHeight: 1.05,
  },
  tutorialDraftBubbleText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.35,
    fontWeight: 700,
  },
  tutorialDraftProgress: {
    display: "flex",
    gap: "6px",
    marginTop: "12px",
  },
  tutorialDraftProgressDot: {
    width: "7px",
    height: "7px",
    borderRadius: "999px",
    background: "rgba(82, 53, 30, 0.28)",
  },
  tutorialDraftProgressDotActive: {
    width: "18px",
    background: "#8a5a2d",
  },
  tutorialDraftControls: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "12px",
  },
  tutorialDraftControlButton: {
    border: "1px solid rgba(82, 53, 30, 0.24)",
    borderRadius: "10px",
    background: "rgba(82, 53, 30, 0.08)",
    color: "#3a2a1e",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  tutorialDraftControlButtonDisabled: {
    opacity: 0.42,
    cursor: "default",
  },
  tutorialDraftPrimaryButton: {
    border: "1px solid rgba(82, 53, 30, 0.2)",
    borderRadius: "10px",
    background: "linear-gradient(180deg, #8a5a2d 0%, #5c381f 100%)",
    color: "#fff7ed",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 8px 14px rgba(0,0,0,0.18)",
  },
  gameStartCard: {
    width: "min(100%, 460px)",
    borderRadius: "22px",
    background: "linear-gradient(180deg, rgba(58,42,31,0.95) 0%, rgba(28,20,14,0.95) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "clamp(18px, 2vw, 28px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(10px, 1.1vw, 14px)",
    color: "#fff7ed",
    boxShadow: "0 18px 34px rgba(0,0,0,0.28)",
  },
  gameStartTopActionButton: {
    position: "absolute",
    top: "clamp(14px, 1.2vw, 20px)",
    right: "clamp(14px, 1.2vw, 20px)",
    borderRadius: "999px",
    border: "1px solid rgba(244, 226, 190, 0.36)",
    background: "linear-gradient(180deg, rgba(72,48,32,0.92) 0%, rgba(34,23,16,0.92) 100%)",
    color: "#fff7ed",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(0,0,0,0.24)",
  },
  gameStartEyebrow: {
    fontSize: "clamp(11px, 0.95vw, 13px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#d8c3a5",
  },
  gameStartTitle: {
    margin: 0,
    fontSize: "clamp(26px, 2.4vw, 34px)",
    lineHeight: 1.05,
  },
  gameStartVenue: {
    fontSize: "clamp(18px, 1.6vw, 22px)",
    fontWeight: 800,
  },
  gameStartVenueMeta: {
    fontSize: "clamp(12px, 1vw, 14px)",
    color: "#d8c3a5",
    lineHeight: 1.45,
  },
  gameStartDebugPanel: {
    borderRadius: "16px",
    background: "rgba(0, 0, 0, 0.16)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  gameStartDebugLabel: {
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#f3e7cf",
  },
  gameStartDebugSelect: {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid rgba(244, 226, 190, 0.22)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff7ed",
    padding: "10px 12px",
    fontSize: "14px",
    fontWeight: 700,
    boxSizing: "border-box",
  },
  gameStartDebugHint: {
    fontSize: "12px",
    lineHeight: 1.45,
    color: "#d8c3a5",
  },
  gameStartOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "clamp(10px, 1vw, 12px)",
    margin: "6px 0 10px 0",
  },
  gameStartOption: {
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff7ed",
    padding: "clamp(12px, 1.15vw, 16px)",
    fontSize: "clamp(13px, 1.05vw, 15px)",
    fontWeight: 700,
    cursor: "pointer",
  },
  gameStartOptionActive: {
    background: "linear-gradient(180deg, #f3e7cf 0%, #dec49c 100%)",
    color: "#2f241b",
    border: "1px solid #b18553",
  },
  gameStartResetButton: {
    borderRadius: "18px",
    border: "1px solid rgba(244, 226, 190, 0.4)",
    background: "linear-gradient(180deg, rgba(86,58,39,0.94) 0%, rgba(49,33,22,0.94) 100%)",
    color: "#fff7ed",
    padding: "clamp(14px, 1.3vw, 18px) clamp(18px, 1.7vw, 24px)",
    fontSize: "clamp(16px, 1.4vw, 20px)",
    fontWeight: 800,
    boxShadow: "0 16px 28px rgba(0,0,0,0.24)",
    cursor: "pointer",
    alignSelf: "center",
    minWidth: "clamp(220px, 24vw, 300px)",
  },
  gameStartLaunchButton: {
    borderRadius: "18px",
    border: "1px solid rgba(15, 23, 42, 0.22)",
    background: "linear-gradient(180deg, #17213d 0%, #0f172a 100%)",
    color: "#fff7ed",
    padding: "clamp(14px, 1.3vw, 18px) clamp(18px, 1.7vw, 24px)",
    fontSize: "clamp(18px, 1.55vw, 22px)",
    fontWeight: 900,
    boxShadow: "0 16px 28px rgba(0,0,0,0.24)",
    cursor: "pointer",
    alignSelf: "center",
    minWidth: "clamp(220px, 24vw, 300px)",
  },
  gameStartActionsStack: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(10px, 1vw, 14px)",
    alignSelf: "center",
  },
  gameStartResetButtonCentered: {
    margin: "0 auto",
  },
  journeyIntroScreen: {
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "12px 14px",
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: 0,
  },
  journeyIntroHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexShrink: 0,
  },
  journeyIntroEyebrow: {
    fontSize: "clamp(11px, 0.92vw, 13px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#d8c3a5",
  },
  journeyIntroTitle: {
    margin: "4px 0 5px 0",
    fontSize: "28px",
    lineHeight: 1.02,
    color: "#fff3e0",
    fontFamily: "Georgia, serif",
  },
  journeyIntroText: {
    margin: 0,
    maxWidth: "860px",
    fontSize: "13px",
    lineHeight: 1.4,
    color: "#e4d2b6",
  },
  journeyIntroLeadCard: {
    borderRadius: "8px",
    padding: "12px 14px",
    background: "linear-gradient(180deg, rgba(52,35,24,0.94) 0%, rgba(24,16,11,0.96) 100%)",
    border: "1px solid rgba(205, 160, 95, 0.18)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#f8e7cb",
    flexShrink: 0,
  },
  journeyIntroLeadGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 214px",
    gap: "14px",
    alignItems: "stretch",
  },
  journeyIntroLeadPrimary: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },
  journeyIntroLeadLabel: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#d8c3a5",
  },
  journeyIntroLeadVenue: {
    fontSize: "23px",
    fontWeight: 800,
    lineHeight: 1.05,
    color: "#fff5e6",
  },
  journeyIntroLeadMeta: {
    fontSize: "12px",
    color: "#d8c3a5",
  },
  journeyIntroLeadText: {
    margin: "2px 0 0 0",
    fontSize: "13px",
    lineHeight: 1.35,
    color: "#ead8bc",
  },
  journeyIntroProgressPanel: {
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "3px",
    background: "rgba(10, 7, 5, 0.42)",
    border: "1px solid rgba(233, 196, 134, 0.18)",
  },
  journeyIntroProgressValue: {
    fontSize: "27px",
    fontWeight: 900,
    lineHeight: 1,
    color: "#ffe5ba",
  },
  journeyIntroProgressLabel: {
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#d7b981",
  },
  journeyIntroProgressText: {
    fontSize: "11px",
    lineHeight: 1.3,
    color: "#f2ddbd",
  },
  journeyIntroLeadCta: {
    width: "100%",
    minHeight: "29px",
    marginTop: "4px",
    borderRadius: "8px",
    border: "1px solid rgba(244, 206, 140, 0.52)",
    background: "linear-gradient(180deg, rgba(240, 197, 119, 0.92) 0%, rgba(173, 112, 46, 0.96) 100%)",
    color: "#24170d",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 900,
  },
  journeyIntroRouteRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 1px minmax(0, 1fr) auto",
    gap: "10px",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "9px",
  },
  journeyIntroRouteItem: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  journeyIntroRouteDivider: {
    alignSelf: "stretch",
    background: "rgba(255,255,255,0.12)",
  },
  journeyIntroRouteLabel: {
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#d7b981",
  },
  journeyIntroRouteValue: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "12px",
    color: "#fff0d6",
  },
  journeyIntroLegend: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    flexWrap: "wrap",
    color: "#ead8bc",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  journeyIntroLegendDone: {
    borderRadius: "999px",
    padding: "5px 7px",
    background: "rgba(77, 138, 85, 0.24)",
    border: "1px solid rgba(137, 201, 145, 0.32)",
    color: "#dff3dc",
  },
  journeyIntroLegendCurrent: {
    borderRadius: "999px",
    padding: "5px 7px",
    background: "rgba(218, 159, 67, 0.24)",
    border: "1px solid rgba(240, 199, 125, 0.42)",
    color: "#ffe7bc",
  },
  journeyIntroLegendLocked: {
    borderRadius: "999px",
    padding: "5px 7px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#d0bda2",
  },
  journeyIntroStages: {
    flex: 1,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    overflow: "auto",
    paddingRight: "4px",
  },
  journeyIntroStageCard: {
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr)",
    gap: "10px",
    alignItems: "start",
    borderRadius: "8px",
    padding: "11px",
    background: "linear-gradient(180deg, rgba(24,15,10,0.9) 0%, rgba(14,9,6,0.94) 100%)",
    border: "1px solid rgba(205, 160, 95, 0.14)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.16)",
  },
  journeyIntroStageCardActive: {
    border: "1px solid rgba(232, 193, 128, 0.42)",
    background: "linear-gradient(180deg, rgba(63,44,29,0.94) 0%, rgba(28,18,12,0.96) 100%)",
  },
  journeyIntroStageCardCompleted: {
    border: "1px solid rgba(144, 190, 135, 0.24)",
    background: "linear-gradient(180deg, rgba(32,37,26,0.9) 0%, rgba(17,20,14,0.94) 100%)",
  },
  journeyIntroStageCardLocked: {
    opacity: 0.62,
  },
  journeyIntroStageOrder: {
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f5dfba",
    fontSize: "18px",
    fontWeight: 900,
  },
  journeyIntroStageBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: 0,
  },
  journeyIntroStageTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  journeyIntroStageTitle: {
    fontSize: "16px",
    fontWeight: 800,
    lineHeight: 1.05,
    color: "#fff1da",
  },
  journeyIntroStageTier: {
    marginTop: "4px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#cda05f",
  },
  journeyIntroStageBadge: {
    borderRadius: "999px",
    padding: "5px 8px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f3dec0",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  journeyIntroStageBadgeStack: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end",
  },
  journeyIntroStageStatusBadge: {
    borderRadius: "999px",
    padding: "5px 8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ead8bc",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  journeyIntroStageStatusBadgeActive: {
    background: "rgba(205, 160, 95, 0.16)",
    border: "1px solid rgba(232, 193, 128, 0.32)",
    color: "#ffe9c4",
  },
  journeyIntroStageStatusBadgeCompleted: {
    background: "rgba(124, 182, 108, 0.14)",
    border: "1px solid rgba(144, 190, 135, 0.26)",
    color: "#dff0d8",
  },
  journeyIntroStageStatusBadgeLocked: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#c8b59a",
  },
  journeyIntroStageText: {
    fontSize: "12px",
    lineHeight: 1.35,
    color: "#dbc6a6",
  },
  journeyIntroStageMeta: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    fontSize: "11px",
    fontWeight: 700,
    color: "#f2dfc3",
  },
  journeyIntroVenueList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px",
    marginTop: "2px",
  },
  journeyIntroVenueButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    borderRadius: "8px",
    padding: "8px 9px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f7e8d0",
    cursor: "pointer",
    textAlign: "left",
  },
  journeyIntroVenueButtonActive: {
    background: "linear-gradient(180deg, rgba(243,231,207,0.92) 0%, rgba(222,196,156,0.9) 100%)",
    border: "1px solid #b18553",
    color: "#2f241b",
  },
  journeyIntroVenueButtonLocked: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#bda88a",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  journeyIntroVenueButtonLabel: {
    fontSize: "12px",
    fontWeight: 800,
    lineHeight: 1.2,
  },
  journeyIntroVenueButtonMeta: {
    borderRadius: "999px",
    padding: "3px 6px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "9px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  journeyIntroVenueButtonMetaRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "5px",
  },
  journeyIntroVenueButtonMetaActive: {
    background: "rgba(74, 47, 22, 0.16)",
    border: "1px solid rgba(73, 47, 22, 0.28)",
  },
  journeyIntroVenueButtonMetaCompleted: {
    background: "rgba(79, 140, 88, 0.2)",
    border: "1px solid rgba(128, 188, 135, 0.28)",
    color: "#dff1dc",
  },
  journeyIntroVenueButtonAction: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "10px",
    fontWeight: 800,
    opacity: 0.8,
  },
  journeyIntroActions: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "4px",
    flexShrink: 0,
  },
  authoredCampaignScreen: {
    gridColumn: "1 / -1",
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: "22px",
    background: "#090604",
  },
  authoredCampaignImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    userSelect: "none",
    pointerEvents: "none",
  },
  authoredCampaignHotspot: {
    position: "absolute",
    display: "block",
    border: 0,
    padding: 0,
    margin: 0,
    background: "transparent",
    color: "transparent",
    cursor: "pointer",
    appearance: "none",
  },
  freePlayScreen: {
    gridColumn: "1 / -1",
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: "22px",
    background: "#090604",
    color: "#fff3df",
  },
  freePlayImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    userSelect: "none",
    pointerEvents: "none",
  },
  freePlayBackButton: {
    position: "absolute",
    top: "4.8%",
    right: "4.5%",
    zIndex: 4,
    borderRadius: "999px",
    border: "1px solid rgba(255, 237, 202, 0.42)",
    background: "rgba(21, 13, 8, 0.68)",
    color: "#fff3df",
    padding: "8px 16px",
    fontSize: "11px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    cursor: "pointer",
  },
  freePlayResetButton: {
    position: "absolute",
    top: "4.8%",
    left: "4.5%",
    zIndex: 4,
    borderRadius: "999px",
    border: "1px solid rgba(255, 237, 202, 0.34)",
    background: "rgba(68, 32, 20, 0.66)",
    color: "#ffe9c5",
    padding: "8px 14px",
    fontSize: "10px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: "pointer",
  },
  freePlayStageHotspot: {
    position: "absolute",
    zIndex: 2,
    border: "2px solid transparent",
    borderRadius: "18px",
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    boxSizing: "border-box",
    appearance: "none",
  },
  matchResultScreen: {
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: "clamp(18px, 1.5vw, 24px)",
    boxSizing: "border-box",
  },
  matchResultImageScreen: {
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
    background: "#080604",
  },
  matchResultImageFrame: {
    position: "relative",
    height: "100%",
    width: "82.35%",
    maxWidth: "100%",
    maxHeight: "100%",
    aspectRatio: "1672 / 941",
    alignSelf: "center",
    justifySelf: "center",
    flexShrink: 0,
  },
  matchResultImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },
  matchResultImageCta: {
    position: "absolute",
    left: "31%",
    bottom: "5.8%",
    width: "40%",
    height: "13%",
    border: "none",
    borderRadius: "18px",
    background: "transparent",
    cursor: "pointer",
  },
  matchResultCard: {
    width: "min(100%, 780px)",
    borderRadius: "28px",
    padding: "clamp(22px, 2vw, 30px)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    color: "#fff6e8",
    boxShadow: "0 22px 40px rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  matchResultCardWin: {
    background: "linear-gradient(180deg, rgba(62,38,26,0.95) 0%, rgba(28,17,11,0.96) 100%)",
  },
  matchResultCardLoss: {
    background: "linear-gradient(180deg, rgba(42,24,20,0.96) 0%, rgba(18,10,9,0.97) 100%)",
  },
  matchResultEyebrow: {
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    color: "#d9c4a4",
  },
  matchResultTitle: {
    margin: 0,
    fontSize: "clamp(30px, 2.4vw, 40px)",
    lineHeight: 1,
    fontFamily: "Georgia, serif",
  },
  matchResultVenue: {
    fontSize: "clamp(17px, 1.35vw, 22px)",
    fontWeight: 800,
    color: "#f4dfbf",
  },
  matchResultSubtitle: {
    margin: 0,
    fontSize: "clamp(14px, 1.02vw, 16px)",
    lineHeight: 1.6,
    color: "#ecd9bd",
  },
  matchResultHostBox: {
    borderRadius: "20px",
    padding: "16px 18px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  matchResultHostLabel: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#d9c4a4",
  },
  matchResultHostLine: {
    margin: 0,
    fontSize: "clamp(17px, 1.25vw, 20px)",
    lineHeight: 1.5,
    color: "#fff4e1",
  },
  matchResultProgressBox: {
    borderRadius: "20px",
    padding: "16px 18px",
    background: "rgba(205,160,95,0.1)",
    border: "1px solid rgba(232,193,128,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  matchResultProgressLabel: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#d9c4a4",
  },
  matchResultProgressText: {
    margin: 0,
    fontSize: "clamp(15px, 1.08vw, 17px)",
    lineHeight: 1.55,
    color: "#f5e7d2",
  },
  characterSelectScreen: {
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 0.75vw, 12px)",
    padding: "clamp(10px, 0.95vw, 14px)",
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: 0,
  },
  venueIntroScreen: {
    gridColumn: "1 / -1",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(10px, 0.9vw, 14px)",
    padding: "clamp(12px, 1vw, 16px)",
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: 0,
  },
  venueIntroHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  venueIntroEyebrow: {
    fontSize: "clamp(11px, 0.92vw, 13px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#cda05f",
  },
  venueIntroTitle: {
    margin: "6px 0 4px 0",
    fontSize: "clamp(24px, 2.1vw, 32px)",
    lineHeight: 1.02,
    color: "#f6ead8",
    fontFamily: "Georgia, serif",
  },
  venueIntroMeta: {
    fontSize: "clamp(12px, 0.95vw, 14px)",
    color: "#d5bf9a",
  },
  venueIntroBoard: {
    flex: 1,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
    gap: "clamp(10px, 0.9vw, 16px)",
  },
  venueIntroMainCard: {
    borderRadius: "22px",
    padding: "clamp(16px, 1.4vw, 22px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "linear-gradient(180deg, rgba(54,36,24,0.94) 0%, rgba(26,17,11,0.96) 100%)",
    border: "1px solid rgba(205, 160, 95, 0.18)",
    color: "#f8e7cb",
    boxShadow: "0 18px 34px rgba(0,0,0,0.22)",
  },
  venueIntroSectionLabel: {
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#d5bf9a",
  },
  venueIntroLead: {
    margin: 0,
    fontSize: "clamp(17px, 1.35vw, 21px)",
    lineHeight: 1.35,
    fontWeight: 700,
    color: "#fff2df",
  },
  venueIntroText: {
    margin: 0,
    fontSize: "clamp(13px, 1vw, 15px)",
    lineHeight: 1.55,
    color: "#e7d3b4",
  },
  venueIntroFactsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "auto",
  },
  venueIntroFactCard: {
    borderRadius: "16px",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  venueIntroFactLabel: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#cfb48b",
  },
  venueIntroFactValue: {
    fontSize: "clamp(15px, 1.15vw, 18px)",
    color: "#fff4e3",
  },
  venueIntroRosterPanel: {
    borderRadius: "22px",
    padding: "clamp(16px, 1.4vw, 22px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "linear-gradient(180deg, rgba(29,18,12,0.94) 0%, rgba(16,10,7,0.97) 100%)",
    border: "1px solid rgba(205, 160, 95, 0.18)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.22)",
    minHeight: 0,
  },
  venueIntroParticipants: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    overflow: "auto",
    paddingRight: "4px",
  },
  venueIntroParticipantCard: {
    display: "grid",
    gridTemplateColumns: "72px minmax(0, 1fr)",
    gap: "10px",
    alignItems: "start",
    borderRadius: "18px",
    padding: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  venueIntroParticipantAvatar: {
    width: "72px",
    aspectRatio: "1 / 1.16",
    borderRadius: "14px",
    overflow: "hidden",
    background: "rgba(0,0,0,0.22)",
  },
  venueIntroParticipantImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  venueIntroParticipantBody: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },
  venueIntroParticipantRole: {
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#cda05f",
  },
  venueIntroParticipantName: {
    fontSize: "16px",
    fontWeight: 800,
    lineHeight: 1.05,
    color: "#f7e7cf",
  },
  venueIntroParticipantText: {
    fontSize: "12px",
    lineHeight: 1.45,
    color: "#d6c3a5",
  },
  venueIntroActions: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "4px",
  },
  characterSelectHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  characterSelectEyebrow: {
    fontSize: "clamp(12px, 1vw, 18px)",
    lineHeight: 0.92,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#cda05f",
    fontFamily: "Georgia, serif",
    maxWidth: "180px",
  },
  characterSelectBackButton: {
    borderRadius: "999px",
    border: "1px solid rgba(244, 226, 190, 0.28)",
    background: "rgba(18, 12, 8, 0.76)",
    color: "#f8e7cb",
    padding: "8px 14px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    cursor: "pointer",
  },
  characterSelectBoard: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "minmax(226px, 0.66fr) minmax(0, 1.34fr)",
    gap: "clamp(10px, 0.95vw, 16px)",
    padding: "clamp(6px, 0.55vw, 10px)",
    borderRadius: "24px",
    border: "1px solid rgba(203, 159, 96, 0.14)",
    background: "linear-gradient(180deg, rgba(30,18,11,0.86) 0%, rgba(19,11,7,0.88) 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    alignItems: "stretch",
    overflow: "hidden",
  },
  characterSelectLeftColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "6px",
    padding: "4px 2px 4px 0",
    borderRight: "1px solid rgba(205, 160, 95, 0.16)",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  characterPortraitFrame: {
    position: "relative",
    width: "min(100%, 218px)",
    maxWidth: "100%",
    aspectRatio: "3 / 4",
    borderRadius: "22px",
    overflow: "hidden",
    border: "1px solid rgba(205, 160, 95, 0.32)",
    background: "linear-gradient(180deg, rgba(25,16,10,0.95) 0%, rgba(12,8,5,0.95) 100%)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.06)",
    alignSelf: "center",
    flexShrink: 0,
  },
  characterPortraitImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  characterPortraitImageLocked: {
    filter: "grayscale(1) brightness(0.68)",
  },
  characterPortraitLockedLayer: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background: "rgba(103, 108, 110, 0.22)",
    pointerEvents: "none",
  },
  characterPortraitOverlay: {
    position: "absolute",
    inset: "auto 0 0 0",
    zIndex: 2,
    padding: "14px 12px 12px",
    background:
      "linear-gradient(180deg, rgba(16,10,7,0) 0%, rgba(16,10,7,0.76) 34%, rgba(16,10,7,0.94) 100%)",
  },
  characterPortraitName: {
    fontSize: "clamp(20px, 1.5vw, 27px)",
    lineHeight: 0.98,
    fontWeight: 800,
    color: "#e7bc7a",
    fontFamily: "Georgia, serif",
    textWrap: "balance",
  },
  characterPortraitNickname: {
    marginTop: "6px",
    fontSize: "clamp(12px, 0.9vw, 16px)",
    fontStyle: "italic",
    color: "#f4dfbf",
    fontFamily: "Georgia, serif",
  },
  characterPortraitTextLocked: {
    color: "#ffffff",
  },
  characterIdentityPanel: {
    width: "min(100%, 218px)",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "7px 8px",
    borderRadius: "22px",
    border: "1px solid rgba(205, 160, 95, 0.22)",
    background:
      "linear-gradient(180deg, rgba(46,30,20,0.92) 0%, rgba(28,18,12,0.94) 100%)",
    boxShadow: "0 14px 28px rgba(0,0,0,0.16)",
    boxSizing: "border-box",
    minWidth: 0,
  },
  characterIdentityBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "6px",
    textAlign: "left",
  },
  characterName: {
    fontSize: "clamp(34px, 2.8vw, 48px)",
    lineHeight: 0.96,
    fontWeight: 800,
    color: "#e0b069",
    fontFamily: "Georgia, serif",
    textWrap: "balance",
  },
  characterNickname: {
    fontSize: "clamp(18px, 1.5vw, 26px)",
    fontStyle: "italic",
    color: "#f1d7ad",
    fontFamily: "Georgia, serif",
  },
  characterNavigator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
  },
  characterNavButton: {
    width: "32px",
    height: "32px",
    borderRadius: "999px",
    border: "1px solid rgba(205, 160, 95, 0.36)",
    background: "linear-gradient(180deg, rgba(85,57,37,0.92) 0%, rgba(43,28,18,0.92) 100%)",
    color: "#f6e5c7",
    fontSize: "18px",
    fontWeight: 900,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  characterNavDots: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "4px",
    flex: 1,
    minWidth: 0,
  },
  characterNavDot: {
    width: "7px",
    height: "7px",
    borderRadius: "999px",
    background: "rgba(205,160,95,0.24)",
  },
  characterNavDotActive: {
    width: "8px",
    height: "8px",
    background: "#d7a85f",
    boxShadow: "0 0 0 2px rgba(215,168,95,0.16)",
  },
  characterNavCounter: {
    alignSelf: "center",
    fontSize: "10px",
    color: "#a77d4a",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  characterSelectRightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 0.65vw, 12px)",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  characterContextHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    width: "100%",
    minWidth: 0,
  },
  characterContextKicker: {
    color: "#cda05f",
    fontWeight: 800,
    fontSize: "clamp(11px, 0.82vw, 13px)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  characterContextLabel: {
    color: "#d3b185",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: "clamp(12px, 0.84vw, 14px)",
    lineHeight: 1.35,
    maxWidth: "none",
  },
  characterInfoPanel: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 0.65vw, 12px)",
    padding: 0,
    overflow: "hidden",
  },
  characterInfoCard: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(6px, 0.5vw, 10px)",
    padding: "clamp(10px, 0.78vw, 14px)",
    borderRadius: "22px",
    background:
      "linear-gradient(180deg, rgba(43,28,18,0.92) 0%, rgba(26,17,12,0.95) 100%)",
    border: "1px solid rgba(205,160,95,0.22)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
    minWidth: 0,
    width: "100%",
    overflow: "hidden",
    flexShrink: 0,
  },
  characterDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
    gap: "clamp(8px, 0.65vw, 12px)",
    minWidth: 0,
  },
  characterInfoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(6px, 0.5vw, 10px)",
    minWidth: 0,
    minHeight: 0,
  },
  characterInfoTitle: {
    fontSize: "clamp(14px, 1vw, 18px)",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#cda05f",
    fontFamily: "Georgia, serif",
  },
  characterStoryQuote: {
    borderLeft: "3px solid rgba(205,160,95,0.46)",
    paddingLeft: "12px",
    color: "#efd6ad",
    fontSize: "clamp(14px, 1vw, 17px)",
    lineHeight: 1.42,
    fontStyle: "italic",
    fontFamily: "Georgia, serif",
    minWidth: 0,
    minHeight: 0,
    overflowY: "auto",
    paddingRight: "6px",
    maxHeight: "100%",
  },
  characterStyleChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  characterStyleChip: {
    borderRadius: "999px",
    border: "1px solid rgba(184, 131, 63, 0.42)",
    background: "rgba(116,72,32,0.2)",
    color: "#f0d2a2",
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: 800,
    fontFamily: "Georgia, serif",
  },
  playerSkinInfoPanel: {
    justifyContent: "center",
    gap: "clamp(18px, 1.7vw, 30px)",
    padding: "clamp(16px, 1.35vw, 24px) clamp(18px, 2.1vw, 38px)",
    boxSizing: "border-box",
  },
  playerSkinStoryQuote: {
    borderLeft: "3px solid rgba(205,160,95,0.72)",
    paddingLeft: "clamp(14px, 1.2vw, 22px)",
    paddingRight: "clamp(4px, 0.5vw, 10px)",
    color: "#e8c07f",
    fontSize: "clamp(18px, 1.55vw, 26px)",
    lineHeight: 1.55,
    fontStyle: "italic",
    fontFamily: "Georgia, serif",
    textWrap: "balance",
    maxWidth: "640px",
    alignSelf: "center",
  },
  playerSkinActionArea: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  playerSkinActionButton: {
    width: "min(100%, 520px)",
    padding: "clamp(13px, 1.1vw, 17px) 18px",
    fontSize: "clamp(13px, 1vw, 17px)",
    letterSpacing: "0.1em",
  },
  characterAttributeRow: {
    display: "grid",
    gridTemplateColumns: "max-content minmax(0, 1fr) max-content",
    alignItems: "center",
    gap: "10px",
  },
  characterAttributeLabel: {
    fontSize: "clamp(12px, 0.88vw, 15px)",
    fontWeight: 800,
    color: "#efdfc3",
    fontFamily: "Georgia, serif",
  },
  characterAttributeTrack: {
    height: "10px",
    borderRadius: "999px",
    background: "rgba(58,31,17,0.9)",
    border: "1px solid rgba(205,160,95,0.28)",
    overflow: "hidden",
  },
  characterAttributeFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #b87424 0%, #e1b45f 100%)",
    boxShadow: "0 0 14px rgba(225,180,95,0.22)",
  },
  characterAttributeValue: {
    fontSize: "clamp(11px, 0.8vw, 13px)",
    fontWeight: 800,
    color: "#f2ddb8",
  },
  characterActionFooter: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "clamp(8px, 0.65vw, 12px)",
    borderRadius: "22px",
    border: "1px solid rgba(205,160,95,0.18)",
    background:
      "linear-gradient(180deg, rgba(33,21,14,0.9) 0%, rgba(20,13,9,0.94) 100%)",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    flexShrink: 0,
  },
  characterUnlockHint: {
    color: "#e3b599",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  characterSelectActionButton: {
    borderRadius: "16px",
    border: "1px solid rgba(205,160,95,0.34)",
    background: "linear-gradient(180deg, rgba(96,63,40,0.96) 0%, rgba(54,34,22,0.96) 100%)",
    color: "#f7ebd4",
    padding: "11px 14px",
    fontSize: "clamp(12px, 0.92vw, 15px)",
    fontWeight: 900,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    boxShadow: "0 16px 28px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
  characterSelectEmptyBox: {
    margin: "auto",
    borderRadius: "20px",
    padding: "24px 28px",
    background: "rgba(25,16,10,0.84)",
    border: "1px solid rgba(205,160,95,0.22)",
    color: "#f8e7cb",
    fontSize: "18px",
    fontWeight: 700,
  },
  logsCard: {
    background: "#ffffff",
    border: "1px solid #d8dee6",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  logsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "22px",
  },
  logsArea: {
    width: "100%",
    minHeight: "260px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "monospace",
    fontSize: "12px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d8dee6",
    background: "#f8fafc",
  },
}

export default App  
