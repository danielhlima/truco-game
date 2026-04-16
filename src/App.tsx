import { useEffect, useMemo, useState } from "react"
import { useGameSession } from "./app/useGameSession"
import {
  CampaignPanel,
  HandStatusPanel,
  LogsPanel,
  TableSection,
} from "./app/AppSections"
import botecoSceneBgAsset from "./assets/boteco/boteco-scene-bg.png"
import cardFaceAgedPaperAsset from "./assets/cards/card-face-aged-paper.png"

type GameplayLayoutMode = "regular" | "compact"

function getGameplayLayoutMode(): GameplayLayoutMode {
  if (typeof window === "undefined") {
    return "regular"
  }

  return window.innerWidth < 1440 || window.innerHeight < 860 ? "compact" : "regular"
}

function App() {
  const [layoutMode, setLayoutMode] = useState<GameplayLayoutMode>(getGameplayLayoutMode)

  useEffect(() => {
    const handleResize = () => {
      setLayoutMode(getGameplayLayoutMode())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const {
    activeVariant,
    canHumanAdvisePartner,
    canHumanRespondToTruco,
    canPlayHumanCard,
    canRequestTruco,
    campaignCompleted,
    campaignSummary,
    currentCampaignStage,
    currentCampaignVenue,
    currentTurnLabel,
    currentVenueWins,
    debugModeEnabled,
    debugVenueId,
    debugVenueOptions,
    dealAnimationNonce,
    eventMessage,
    handScoreLabel,
    handState,
    handleAcceptTruco,
    handlePartnerAdvice,
    handleCopyLogs,
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
    player1,
    playerProfile,
    setVariant,
    setDebugVenueId,
    speechBubble,
    statusMessage,
    tableByPlayer,
    variantSelectionDisabled,
  } = useGameSession()

  const isCompactLayout = layoutMode === "compact"

  const responsiveStyles = useMemo<Record<string, React.CSSProperties>>(
    () => ({
      ...styles,
      gameViewportFrame: {
        ...styles.gameViewportFrame,
        width: isCompactLayout
          ? "min(100%, calc((100dvh - 228px) * 2.16))"
          : styles.gameViewportFrame.width,
        minHeight: isCompactLayout ? "min(400px, 64dvh)" : styles.gameViewportFrame.minHeight,
        maxHeight: isCompactLayout ? "73dvh" : styles.gameViewportFrame.maxHeight,
      },
      gameViewport: {
        ...styles.gameViewport,
        gridTemplateColumns: isCompactLayout
          ? "clamp(172px, 18vw, 196px) minmax(0, 1fr) clamp(170px, 17.4vw, 190px)"
          : "clamp(184px, 16vw, 212px) minmax(0, 1fr) clamp(176px, 15vw, 196px)",
        gap: isCompactLayout ? "clamp(5px, 0.55vw, 8px)" : styles.gameViewport.gap,
      },
      gameLeftRail: {
        ...styles.gameLeftRail,
        justifyItems: "stretch",
      },
      gameSidebarColumn: {
        ...styles.gameSidebarColumn,
        justifyItems: "stretch",
      },
      scenePanel: {
        ...styles.scenePanel,
        width: "100%",
        boxSizing: "border-box",
      },
      scorePadCard: {
        ...styles.scorePadCard,
        width: "100%",
        boxSizing: "border-box",
      },
      scorePadCardSurface: {
        ...styles.scorePadCardSurface,
        width: isCompactLayout ? "min(100%, 156px)" : "min(100%, 174px)",
        maxHeight: isCompactLayout ? "94%" : "96%",
      },
      gameMainColumn: {
        ...styles.gameMainColumn,
        gridTemplateRows: isCompactLayout ? "minmax(0, 1fr) minmax(78px, auto)" : "minmax(0, 1fr) auto",
      },
      tableSurface: {
        ...styles.tableSurface,
        transform: isCompactLayout ? "scale(1.04)" : "scale(1.08)",
        maxWidth: isCompactLayout ? "98%" : "100%",
      },
      playerCardsBlock: {
        ...styles.playerCardsBlock,
        width: "100%",
        boxSizing: "border-box",
        minHeight: isCompactLayout
          ? "clamp(74px, 6.6vw, 90px)"
          : styles.playerCardsBlock.minHeight,
      },
      tableHudSidebar: {
        ...styles.tableHudSidebar,
        width: "100%",
        boxSizing: "border-box",
        gridTemplateRows: isCompactLayout
          ? "max-content minmax(150px, 1fr) max-content"
          : "max-content minmax(0, 1fr) max-content",
      },
      actionDisplayCard: {
        ...styles.actionDisplayCard,
        width: isCompactLayout ? "90%" : "88%",
      },
      tableHudStats: {
        ...styles.tableHudStats,
        width: isCompactLayout ? "90%" : "88%",
      },
      inGameActionsCard: {
        ...styles.inGameActionsCard,
        width: isCompactLayout ? "90%" : "88%",
      },
      tableCenterArea: {
        ...styles.tableCenterArea,
        minHeight: isCompactLayout ? "clamp(300px, 38dvh, 340px)" : styles.tableCenterArea.minHeight,
      },
    }),
    [isCompactLayout]
  )

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Truco Game</h1>
            <p style={styles.subtitle}>
              Mesa jogável · fluxo passo a passo · foco em clareza visual
            </p>
          </div>
        </header>

        <TableSection
          activeVariant={activeVariant}
          campaignCompleted={campaignCompleted}
          handState={handState}
          matchState={matchState}
          currentCampaignVenue={currentCampaignVenue}
          debugModeEnabled={debugModeEnabled}
          debugVenueId={debugVenueId}
          debugVenueOptions={debugVenueOptions}
          dealAnimationNonce={dealAnimationNonce}
          speechBubble={speechBubble}
          tableByPlayer={tableByPlayer}
          lastPlayedPlayerId={lastPlayedPlayerId}
          player1={player1}
          canRequestTruco={canRequestTruco}
          canHumanAdvisePartner={canHumanAdvisePartner}
          canHumanRespondToTruco={canHumanRespondToTruco}
          canPlayHumanCard={canPlayHumanCard}
          variantSelectionDisabled={variantSelectionDisabled}
          onChangeVariant={setVariant}
          onChangeDebugVenue={setDebugVenueId}
          onResetCampaign={handleResetCampaign}
          onStart={handleStartHand}
          onRequestTruco={handleRequestTruco}
          onAcceptTruco={handleAcceptTruco}
          onAdvisePartner={handlePartnerAdvice}
          onRaiseTruco={handleRaiseTruco}
          onRunFromTruco={handleRunFromTruco}
          onPlayCard={handlePlayCard}
          styles={responsiveStyles}
        />

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

        <LogsPanel logs={logs} onCopyLogs={handleCopyLogs} styles={responsiveStyles} />
      </div>
    </div>
  )
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
    opacity: 0.72,
    filter: "saturate(0.82)",
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
  gameHudLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  tableHudSurface: {
    backgroundImage: `linear-gradient(180deg, rgba(16, 10, 7, 0.42) 0%, rgba(10, 7, 5, 0.5) 100%), url(${botecoSceneBgAsset})`,
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
  gameViewportFrame: {
    width: "min(100%, calc((100vh - 240px) * 2.16))",
    maxWidth: "100%",
    aspectRatio: "19.5 / 9",
    minHeight: "min(420px, 68vh)",
    maxHeight: "76vh",
    margin: "0 auto",
    display: "flex",
    overflow: "hidden",
    borderRadius: "22px",
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
    gridTemplateRows: "minmax(0, 1fr)",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
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
    gap: "clamp(2px, 0.2vw, 4px) clamp(6px, 0.55vw, 8px)",
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
    minHeight: "clamp(56px, 5.2vw, 68px)",
    boxShadow: "none",
  },
  rosterCardHuman: {
    border: "1px solid transparent",
    boxShadow: "none",
  },
  rosterAvatar: {
    width: "clamp(34px, 2.7vw, 42px)",
    height: "clamp(34px, 2.7vw, 42px)",
    borderRadius: "13px",
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
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  rosterName: {
    fontSize: "clamp(7px, 0.66vw, 9px)",
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
    gridTemplateRows: "1fr 1fr",
    minHeight: "100%",
    gap: 0,
    position: "relative",
    zIndex: 1,
    width: "100%",
  },
  scorePadCellTopLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: "18%",
    paddingLeft: "15%",
    paddingRight: "15%",
    minWidth: 0,
    transform: "translateY(22%)",
  },
  scorePadCellTopRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: "18%",
    paddingLeft: "15%",
    paddingRight: "15%",
    minWidth: 0,
    transform: "translateY(22%)",
  },
  scorePadCellBottomLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: "14%",
    paddingLeft: "15%",
    paddingRight: "15%",
    minWidth: 0,
    transform: "translateY(-48%)",
  },
  scorePadCellBottomRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: "14%",
    paddingLeft: "15%",
    paddingRight: "15%",
    minWidth: 0,
    transform: "translateY(-48%)",
  },
  scorePadLabel: {
    fontSize: "clamp(15px, 1rem, 17px)",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "0.02em",
    color: "#5e4734",
    whiteSpace: "nowrap",
  },
  scorePadLabelLeft: {
    alignSelf: "flex-start",
    textAlign: "center",
    width: "100%",
    transform: "translateX(18%)",
  },
  scorePadLabelRight: {
    alignSelf: "flex-end",
    textAlign: "center",
    width: "100%",
    transform: "translateX(-18%)",
  },
  scorePadValue: {
    marginTop: "4%",
    fontSize: "clamp(16px, 1.1rem, 20px)",
    lineHeight: 1,
    fontWeight: 900,
    color: "#2f241b",
    width: "100%",
  },
  scorePadValueLeft: {
    textAlign: "center",
    transform: "translateX(18%)",
  },
  scorePadValueRight: {
    textAlign: "center",
    transform: "translateX(-18%)",
  },
  scorePadMetaLabel: {
    fontSize: "clamp(14px, 0.96rem, 16px)",
    lineHeight: 1,
    fontWeight: 900,
    color: "#70543c",
    whiteSpace: "nowrap",
  },
  scorePadMetaLabelLeft: {
    alignSelf: "flex-start",
    textAlign: "center",
    width: "100%",
    transform: "translateX(18%)",
  },
  scorePadMetaLabelRight: {
    alignSelf: "flex-end",
    textAlign: "center",
    width: "100%",
    transform: "translateX(-18%)",
  },
  scorePadMetaValue: {
    marginTop: "4%",
    fontSize: "clamp(15px, 1rem, 18px)",
    lineHeight: 1,
    fontWeight: 900,
    color: "#33271d",
    width: "100%",
  },
  scorePadMetaValueLeft: {
    textAlign: "center",
    transform: "translateX(18%)",
  },
  scorePadMetaValueRight: {
    textAlign: "center",
    transform: "translateX(-18%)",
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
    gridTemplateRows: "max-content minmax(0, 1fr) max-content",
    gap: "clamp(8px, 0.7vw, 10px)",
    justifyItems: "center",
    color: "#f8fafc",
    minHeight: 0,
    overflow: "hidden",
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
    borderRadius: "14px",
    background: "linear-gradient(180deg, rgba(109,72,48,0.78) 0%, rgba(57,36,24,0.84) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "clamp(8px, 0.68vw, 10px) clamp(11px, 0.92vw, 13px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "clamp(6px, 0.5vw, 8px)",
    width: "88%",
    alignSelf: "center",
    justifySelf: "center",
    marginTop: "clamp(2px, 0.2vw, 4px)",
    minHeight: 0,
    height: "100%",
  },
  tableHudStatsDivider: {
    width: "78%",
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
    gap: "clamp(5px, 0.4vw, 6px)",
    textAlign: "center",
    lineHeight: 1.2,
  },
  tableHudStatLabelCentered: {
    color: "rgba(255,244,228,0.9)",
    fontSize: "clamp(8px, 0.72vw, 9px)",
    fontWeight: 700,
    letterSpacing: "0.01em",
    textShadow: "0 1px 2px rgba(0,0,0,0.58)",
  },
  tableHudStatValueCentered: {
    color: "#fffaf2",
    fontSize: "clamp(11px, 1.02vw, 13px)",
    fontWeight: 800,
    textAlign: "center",
    textShadow: "0 1px 2px rgba(0,0,0,0.82)",
    lineHeight: 1.15,
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
    borderRadius: "16px",
    background: "linear-gradient(180deg, #f3e7cf 0%, #dec49c 100%)",
    border: "1px solid #b18553",
    padding: "clamp(7px, 0.62vw, 9px) clamp(10px, 0.88vw, 12px)",
    color: "#2f241b",
    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
    width: "88%",
    alignSelf: "center",
    justifySelf: "center",
    minHeight: "clamp(72px, 6.6vw, 90px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  actionDisplayLabel: {
    fontSize: "clamp(8px, 0.66vw, 9px)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "4px",
    textAlign: "center",
  },
  actionDisplayValue: {
    fontSize: "clamp(12px, 1.06vw, 16px)",
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
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minHeight: "100%",
  },
  mobileHandHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
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
  mobileHandRow: {
    display: "flex",
    gap: "clamp(4px, 0.35vw, 6px)",
    flexWrap: "nowrap",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingTop: "clamp(2px, 0.2vw, 4px)",
  },
  inGameActionsCard: {
    borderRadius: "16px",
    background: "linear-gradient(180deg, rgba(25,16,11,0.22) 0%, rgba(17,10,7,0.34) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "clamp(7px, 0.58vw, 9px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(7px, 0.58vw, 9px)",
    width: "88%",
    alignSelf: "center",
    justifySelf: "center",
    marginTop: "clamp(8px, 0.8vw, 12px)",
    transform: "translateY(0)",
  },
  inGameActionsRow: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(6px, 0.46vw, 8px)",
    alignItems: "stretch",
    width: "100%",
  },
  inGameActionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "clamp(5px, 0.4vw, 6px)",
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
  mobileCardButton: {
    width: "clamp(40px, 3.6vw, 50px)",
    minWidth: "clamp(40px, 3.6vw, 50px)",
    minHeight: "clamp(58px, 5.2vw, 72px)",
    borderRadius: "8px",
    background: `center / cover no-repeat url(${cardFaceAgedPaperAsset})`,
    border: "1px solid #d9c7a8",
    boxShadow: "0 4px 10px rgba(15,23,42,0.12)",
    padding: "clamp(3px, 0.28vw, 4px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
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
    fontSize: "clamp(11px, 0.9vw, 13px)",
    fontWeight: 800,
    lineHeight: 1,
  },
  mobileCardSuit: {
    fontSize: "clamp(9px, 0.78vw, 11px)",
    lineHeight: 1,
  },
  mobileCardCenterSuit: {
    fontSize: "clamp(12px, 1.05vw, 15px)",
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
    padding: "clamp(5px, 0.44vw, 7px) clamp(10px, 0.9vw, 13px)",
    borderRadius: "12px",
    border: "none",
    background: "#c2410c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "clamp(9px, 0.82vw, 11px)",
    fontWeight: 800,
    minHeight: "clamp(30px, 2.45vw, 34px)",
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
    padding: "clamp(5px, 0.44vw, 7px) clamp(10px, 0.9vw, 13px)",
    borderRadius: "12px",
    border: "1px solid #fdba74",
    background: "#fff",
    color: "#9a3412",
    cursor: "pointer",
    fontSize: "clamp(9px, 0.82vw, 11px)",
    fontWeight: 800,
    minHeight: "clamp(30px, 2.45vw, 34px)",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "clamp(14px, 1.4vw, 24px)",
    boxSizing: "border-box",
    gap: "clamp(16px, 2vw, 28px)",
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
