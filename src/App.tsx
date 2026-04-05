import { useGameSession } from "./app/useGameSession"
import {
  CampaignPanel,
  ControlsPanel,
  HandStatusPanel,
  LogsPanel,
  TableSection,
} from "./app/AppSections"

function App() {
  const {
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
    speechBubble,
    statusMessage,
    tableByPlayer,
    trucoMessage,
    variantSelectionDisabled,
  } = useGameSession()

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

        <section style={styles.topGrid}>
          <ControlsPanel
            activeVariant={activeVariant}
            campaignCompleted={campaignCompleted}
            variantSelectionDisabled={variantSelectionDisabled}
            currentCampaignVenue={currentCampaignVenue}
            onChangeVariant={setVariant}
            onStart={handleStartHand}
            styles={styles}
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
            styles={styles}
          />
        </section>

        <TableSection
          handState={handState}
          matchState={matchState}
          currentCampaignVenue={currentCampaignVenue}
          matchScoreLabel={matchScoreLabel}
          handScoreLabel={handScoreLabel}
          currentTurnLabel={currentTurnLabel}
          statusMessage={statusMessage}
          speechBubble={speechBubble}
          tableByPlayer={tableByPlayer}
          lastPlayedPlayerId={lastPlayedPlayerId}
          player1={player1}
          canRequestTruco={canRequestTruco}
          canHumanRespondToTruco={canHumanRespondToTruco}
          canPlayHumanCard={canPlayHumanCard}
          trucoMessage={trucoMessage}
          onRequestTruco={handleRequestTruco}
          onAcceptTruco={handleAcceptTruco}
          onRaiseTruco={handleRaiseTruco}
          onRunFromTruco={handleRunFromTruco}
          onPlayCard={handlePlayCard}
          styles={styles}
        />

        <CampaignPanel
          campaignCompleted={campaignCompleted}
          currentCampaignStage={currentCampaignStage}
          currentCampaignVenue={currentCampaignVenue}
          currentVenueWins={currentVenueWins}
          campaignSummary={campaignSummary}
          playerProfile={playerProfile}
          onResetCampaign={handleResetCampaign}
          styles={styles}
        />

        <LogsPanel logs={logs} onCopyLogs={handleCopyLogs} styles={styles} />
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
    opacity: 0.5,
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
    background: "#163823",
    borderRadius: "26px",
    padding: "16px",
    border: "4px solid #0f3d24",
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)",
  },
  gameViewport: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 300px",
    gap: "16px",
    alignItems: "stretch",
  },
  gameMainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    minWidth: 0,
  },
  gameSidebarColumn: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
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
    background: "radial-gradient(circle at center, #1f7a4c 0%, #14532d 100%)",
    borderRadius: "24px",
    aspectRatio: "1 / 1",
    minHeight: "360px",
    maxHeight: "58vh",
    padding: "12px",
    boxSizing: "border-box",
    width: "100%",
  },
  playerCardsBlock: {
    borderRadius: "18px",
    background: "rgba(255,255,255,0.96)",
    padding: "12px",
  },
  tableHudSidebar: {
    height: "100%",
    borderRadius: "20px",
    background: "rgba(9, 18, 12, 0.54)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    color: "#f8fafc",
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
    background: "rgba(255,255,255,0.06)",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  tableHudStatLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "13px",
    alignItems: "center",
  },
  tableHudVenue: {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.06)",
    padding: "12px",
  },
  tableHudVenueTitle: {
    fontSize: "16px",
    fontWeight: 800,
    marginBottom: "4px",
  },
  tableHudVenueText: {
    fontSize: "12px",
    color: "rgba(248,250,252,0.82)",
  },
  tableHudMessage: {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    padding: "12px",
    fontSize: "12px",
    lineHeight: 1.4,
    color: "#fff7ed",
    minHeight: "48px",
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
    gap: "10px",
  },
  mobileHandHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  mobileHandTitle: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f172a",
  },
  mobileHandMeta: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#475569",
  },
  mobileHandRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  mobileCardButton: {
    width: "72px",
    minWidth: "72px",
    minHeight: "106px",
    borderRadius: "12px",
    background: "#fffef9",
    border: "1px solid #d9c7a8",
    boxShadow: "0 4px 10px rgba(15,23,42,0.12)",
    padding: "8px",
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
    fontSize: "22px",
    fontWeight: 800,
    lineHeight: 1,
  },
  mobileCardSuit: {
    fontSize: "18px",
    lineHeight: 1,
  },
  mobileCardCenterSuit: {
    fontSize: "28px",
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
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#c2410c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
  },
  trucoSecondaryButton: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #fdba74",
    background: "#fff",
    color: "#9a3412",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
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
