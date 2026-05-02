import type React from "react"
import type { CampaignStage, CampaignVenue } from "../career/campaign/types"
import type { Card } from "../game/card"
import type { HandState } from "../game/handState"
import type { Player } from "../game/gameState"
import type { MatchState } from "../game/matchState"
import type { GameVariant } from "../game/variant"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import { STORE_PRODUCTS, UNLOCKABLE_ITEMS } from "../economy/catalog"
import { GameTableScene } from "../three/GameTableScene"
import { buildTableSceneModel } from "../three/tableSceneModel"
import scorePadNotebookAsset from "../assets/ui-left/scorepad-notebook-clean-cut.png"
import avatarYouAsset from "../assets/characters/zeca-viramao.png"
import actionButtonAsset from "../assets/ui-right/action-button-solid.png"
import statsPanelWoodAsset from "../assets/ui-right/stats-panel-wood-main.png"
import zeCatingaBackgroundAsset from "../assets/venues/ze-catinga/background.png"
import zeCatingaHostAsset from "../assets/venues/ze-catinga/host-ze-catinga.png"
import zeCatingaQuoteBoardAsset from "../assets/venues/ze-catinga/host-quote-board.png"
import zeCatingaPanelAsset from "../assets/venues/ze-catinga/panel-dark-vertical.png"
import zeCatingaCtaPlaqueAsset from "../assets/venues/ze-catinga/cta-plaque.png"
import zeCatingaNameStripAsset from "../assets/venues/ze-catinga/name-strip.png"
import zeCatingaVictoryIconAsset from "../assets/venues/ze-catinga/icon-victory.png"
import zeCatingaDefeatIconAsset from "../assets/venues/ze-catinga/icon-defeat.png"
import zeCatingaAccuracyIconAsset from "../assets/venues/ze-catinga/icon-accuracy.png"
import zeCatingaDifficultyBottleAsset from "../assets/venues/ze-catinga/difficulty-bottle.png"
import zeCatingaDividerAsset from "../assets/venues/ze-catinga/divider-ornament.png"
import type { PlayerProfile } from "../profile/playerProfile"
import type { PartnerAdvice } from "../ai/trucoDecision"
import type { TrucoCharacterProfile } from "../content/characters"
import {
  formatCard,
  getBetBadgeLabel,
  getCampaignTierLabel,
  getManilhaLabel,
  getRaiseResponseButtonLabel,
  getRequestBetButtonLabel,
  getStateLabel,
  getSuitColor,
  getSuitSymbol,
  type SpeechBubbleState,
} from "./gameSessionHelpers"

type StyleMap = Record<string, React.CSSProperties>
type MatchResultScreenState = {
  hostLine: string
  outcome: "win" | "loss"
  progressionText?: string
  progressionTitle?: string
  title: string
  subtitle: string
  venueName: string
}

type VenueCoverConfig = {
  hostName: string
  hostRole: string
  hostQuote: string
  leadEyebrow: string
  leadText: string
  description: string
  backgroundAsset: string
  hostPortraitAsset: string
  quoteBoardAsset: string
  mainPanelAsset: string
  ctaPlaqueAsset: string
  nameStripAsset: string
  iconVictoryAsset: string
  iconDefeatAsset: string
  iconAccuracyAsset: string
  difficultyBottleAsset: string
  dividerAsset: string
}

const VENUE_COVER_CONFIG_BY_ID: Record<string, VenueCoverConfig> = {
  "bar-do-ze-catinga": {
    hostName: "Zé Catinga",
    hostRole: "Dono do Bar",
    hostQuote: "Aqui dentro, fama não paga dose. Só entra quem aguenta pressão.",
    leadEyebrow: "Próximo desafio",
    leadText: "Boteco raiz. Cachaça forte, conversa curta e truco valendo a honra.",
    description: "A mesa aqui não compra pose. Ou você aguenta o calor, ou sai pela porta menor.",
    backgroundAsset: zeCatingaBackgroundAsset,
    hostPortraitAsset: zeCatingaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    mainPanelAsset: zeCatingaPanelAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    nameStripAsset: zeCatingaNameStripAsset,
    iconVictoryAsset: zeCatingaVictoryIconAsset,
    iconDefeatAsset: zeCatingaDefeatIconAsset,
    iconAccuracyAsset: zeCatingaAccuracyIconAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
  },
}

interface ControlsPanelProps {
  activeVariant: GameVariant
  campaignCompleted: boolean
  variantSelectionDisabled: boolean
  currentCampaignVenue: CampaignVenue | null
  onChangeVariant: (variant: GameVariant) => void
  onStart: () => void
  styles: StyleMap
}

export function ControlsPanel({
  activeVariant,
  campaignCompleted: _campaignCompleted,
  variantSelectionDisabled,
  currentCampaignVenue,
  onChangeVariant,
  onStart,
  styles,
}: ControlsPanelProps) {
  return (
    <div style={styles.panelCard}>
      <div style={styles.panelTitle}>Controles</div>

      <div style={styles.controlRow}>
        <label htmlFor="variant" style={styles.label}>
          Variante
        </label>

        <select
          id="variant"
          value={activeVariant}
          onChange={(e) => onChangeVariant(e.target.value as GameVariant)}
          style={styles.select}
          disabled={variantSelectionDisabled}
        >
          <option value="MINEIRO">Truco Mineiro</option>
          <option value="PAULISTA">Truco Paulista</option>
        </select>
      </div>

      <div style={styles.buttonRow}>
        <button
          style={{
            ...styles.primaryButton,
            ...(!currentCampaignVenue ? styles.disabledButton : {}),
          }}
          onClick={onStart}
          disabled={!currentCampaignVenue}
        >
          COMEÇAR
        </button>
      </div>

      <div style={styles.helpBox}>
        <div style={styles.helpTitle}>Como jogar agora</div>
        <p style={styles.helpText}>
          1. Inicie a partida do local atual.
          <br />
          2. Quando for sua vez, clique em uma carta.
          <br />
          3. As IAs jogam automaticamente, e os balões mostram o que está acontecendo.
          <br />
          4. Se a IA pedir truco, seis, nove ou doze, responda com <strong>Aceitar</strong> ou <strong>Correr</strong>.
        </p>
      </div>
    </div>
  )
}

interface HandStatusPanelProps {
  activeVariant: GameVariant
  currentCampaignVenue: CampaignVenue | null
  handState: HandState | null
  matchHandNumber: number
  matchScoreLabel: string
  handScoreLabel: string
  currentTurnLabel: string
  statusMessage: string
  eventMessage: string
  styles: StyleMap
}

export function HandStatusPanel({
  activeVariant,
  currentCampaignVenue,
  handState,
  matchHandNumber,
  matchScoreLabel,
  handScoreLabel,
  currentTurnLabel,
  statusMessage,
  eventMessage,
  styles,
}: HandStatusPanelProps) {
  return (
    <div style={styles.panelCard}>
      <div style={styles.panelTitle}>Status da mão</div>

      <div style={styles.infoGrid}>
        <InfoBox label="Variante" value={handState?.variant ?? activeVariant} styles={styles} />
        <InfoBox
          label="Local"
          value={currentCampaignVenue?.name ?? "Campanha concluída"}
          styles={styles}
        />
        <InfoBox
          label="Vira"
          value={handState?.vira ? formatCard(handState.vira) : "—"}
          styles={styles}
        />
        <InfoBox label="Manilha" value={getManilhaLabel(handState)} styles={styles} />
        <InfoBox
          label="Rodada atual"
          value={String(matchHandNumber)}
          styles={styles}
        />
        <InfoBox
          label="Mão"
          value={handState ? `${handState.roundNumber}ª` : "—"}
          styles={styles}
        />
        <InfoBox label="Placar partida" value={matchScoreLabel} styles={styles} />
        <InfoBox label="Placar das vazas" value={handScoreLabel} styles={styles} />
        <InfoBox label="Vez" value={currentTurnLabel} styles={styles} />
        <InfoBox
          label="Valendo"
          value={handState ? getBetBadgeLabel(handState.currentBet) : getBetBadgeLabel(1)}
          styles={styles}
        />
        <InfoBox label="Estado" value={getStateLabel(handState)} styles={styles} />
      </div>

      <div style={styles.statusBanner}>
        <div style={styles.statusBannerLabel}>Mensagem</div>
        <div style={styles.statusBannerText}>{statusMessage}</div>
      </div>

      <div
        style={{
          ...styles.eventBanner,
          ...(handState?.finished ? styles.eventBannerFinished : {}),
        }}
      >
        <div style={styles.eventBannerLabel}>Último evento</div>
        <div style={styles.eventBannerText}>{eventMessage || "Nenhum evento ainda."}</div>
      </div>

      <div style={styles.teamLegendRow}>
        <div style={styles.teamLegendBox}>
          <strong>Nós:</strong> Jogadores 1 e 3
        </div>
        <div style={styles.teamLegendBox}>
          <strong>Eles:</strong> Jogadores 2 e 4
        </div>
      </div>
    </div>
  )
}

interface CampaignPanelProps {
  campaignCompleted: boolean
  currentCampaignStage: CampaignStage
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  campaignSummary: {
    stageCount: number
    venueCount: number
    totalMatches: number
  }
  playerProfile: PlayerProfile
  onResetCampaign: () => void
  styles: StyleMap
}

export function CampaignPanel({
  campaignCompleted,
  currentCampaignStage,
  currentCampaignVenue,
  currentVenueWins,
  campaignSummary,
  playerProfile,
  onResetCampaign,
  styles,
}: CampaignPanelProps) {
  return (
    <section style={styles.progressionCard}>
      <div style={styles.progressionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Jornada do Jogador</h2>
          <div style={styles.progressionSubtitle}>
            Arquitetura inicial da campanha, progressão e economia do jogo final
          </div>
        </div>

        <div style={styles.progressionBadge}>
          {campaignCompleted
            ? "Campanha concluída"
            : `Etapa atual: ${currentCampaignStage.name}`}
        </div>
      </div>

      <div style={styles.progressionSummaryGrid}>
        <InfoBox label="Etapas" value={String(campaignSummary.stageCount)} styles={styles} />
        <InfoBox label="Locais" value={String(campaignSummary.venueCount)} styles={styles} />
        <InfoBox
          label="Partidas base"
          value={String(campaignSummary.totalMatches)}
          styles={styles}
        />
        <InfoBox
          label="Itens prontos"
          value={String(UNLOCKABLE_ITEMS.length)}
          styles={styles}
        />
        <InfoBox
          label="Produtos futuros"
          value={String(STORE_PRODUCTS.length)}
          styles={styles}
        />
        <InfoBox
          label="Moedas"
          value={`${playerProfile.currencies.coins} / ${playerProfile.currencies.gems}`}
          styles={styles}
        />
      </div>

      <div style={styles.campaignStatusBar}>
        <div style={styles.campaignStatusPrimary}>
          <div style={styles.campaignStatusTitle}>
            {currentCampaignVenue?.name ?? "Você concluiu toda a campanha atual"}
          </div>
          <div style={styles.campaignStatusText}>
            {currentCampaignVenue
              ? `${currentCampaignVenue.districtLabel} · ${currentVenueWins}/${currentCampaignVenue.matchesToClear} vitórias neste local`
              : "Use “Zerar campanha” para recomeçar desde o primeiro boteco."}
          </div>
        </div>

        <div style={styles.campaignStatusMeta}>
          <span>V {playerProfile.campaign.wins}</span>
          <span>D {playerProfile.campaign.losses}</span>
          <span>{playerProfile.currencies.coins} moedas</span>
        </div>
      </div>

      <div style={styles.campaignButtonsRow}>
        <button style={styles.secondaryButton} onClick={onResetCampaign}>
          Zerar campanha
        </button>
      </div>

      <div style={styles.progressionBody}>
        <div style={styles.progressionColumn}>
          <div style={styles.progressionColumnTitle}>Roadmap de campanha</div>

          <div style={styles.stageGrid}>
            {CAMPAIGN_STAGES.map((stage) => (
              <CampaignStageCard
                key={stage.id}
                stage={stage}
                active={stage.id === currentCampaignStage.id}
                completed={playerProfile.campaign.completedStageIds.includes(stage.id)}
                styles={styles}
              />
            ))}
          </div>
        </div>

        <div style={styles.progressionColumn}>
          <div style={styles.progressionColumnTitle}>Visão de produto</div>

          <div style={styles.roadmapBox}>
            <div style={styles.roadmapTitle}>Campanha</div>
            <p style={styles.roadmapText}>
              O jogo agora já tem estrutura para crescer de botecos de rua até o
              mundial, com uma etapa bônus depois da campanha principal.
            </p>
          </div>

          <div style={styles.roadmapBox}>
            <div style={styles.roadmapTitle}>Progressão</div>
            <p style={styles.roadmapText}>
              Cada etapa pode variar na quantidade de locais e partidas, sem
              precisar reescrever o fluxo principal.
            </p>
          </div>

          <div style={styles.roadmapBox}>
            <div style={styles.roadmapTitle}>Monetização futura</div>
            <p style={styles.roadmapText}>
              A base já separa campanha, perfil e economia para suportar
              cosméticos, remoção de anúncios e conteúdo extra sem invadir a
              lógica do truco.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TableSectionProps {
  activeVariant: GameVariant
  campaignCompleted: boolean
  handState: HandState | null
  inGameConfirmation: {
    title: string
    message: string
    confirmLabel: string
  } | null
  inGameContextMenuOpen: boolean
  matchState: MatchState | null
  matchResultScreen: MatchResultScreenState | null
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  debugModeEnabled: boolean
  debugVenueId: string
  debugVenueOptions: Array<{ id: string; label: string }>
  dealAnimationNonce: number
  hasSelectedPartnerForVenue: boolean
  menuScreen: "start" | "journey-intro" | "character-select" | "venue-intro" | "match-result"
  playerProfile: PlayerProfile
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  selectedPartnerCharacter: TrucoCharacterProfile | null
  selectableCharacters: TrucoCharacterProfile[]
  opponentCharacters: TrucoCharacterProfile[]
  speechBubble: SpeechBubbleState | null
  tableByPlayer: Record<number, Card | undefined>
  lastPlayedPlayerId: number | null
  player1: Player | null
  canRequestTruco: boolean
  canHumanAdvisePartner: boolean
  canHumanRaiseTruco: boolean
  canHumanRespondToTruco: boolean
  canPlayHumanCard: boolean
  variantSelectionDisabled: boolean
  onChangeVariant: (variant: GameVariant) => void
  onChangeDebugVenue: (venueId: string) => void
  onCloseCharacterSelect: () => void
  onCloseJourneyIntro: () => void
  onContinueToCharacterSelect: () => void
  onConfirmCharacterSelect: () => void
  onEnterVenueFromIntro: () => void
  onLaunchVenue: (venueId: string) => void
  onOpenCharacterSelect: () => void
  onOpenJourneyIntro: () => void
  onReturnToJourneyFlow: () => void
  onResetCampaign: () => void
  onSelectNextCharacter: () => void
  onSelectPreviousCharacter: () => void
  onStart: () => void
  onRequestTruco: () => void
  onAcceptTruco: () => void
  onAdvisePartner: (advice: PartnerAdvice) => void
  onCancelInGameConfirmation: () => void
  onCloseInGameContextMenu: () => void
  onConfirmInGameConfirmation: () => void
  onExitMatchFromContextMenu: () => void
  onOpenInGameContextMenu: () => void
  onRaiseTruco: () => void
  onRunFromTruco: () => void
  onSwapPartnerFromContextMenu: () => void
  onPlayCard: (card: Card) => void
  styles: StyleMap
}

export function TableSection({
  activeVariant,
  campaignCompleted,
  handState,
  inGameConfirmation,
  inGameContextMenuOpen,
  matchState,
  matchResultScreen,
  currentCampaignVenue,
  currentVenueWins,
  debugModeEnabled,
  debugVenueId,
  debugVenueOptions,
  dealAnimationNonce,
  hasSelectedPartnerForVenue,
  menuScreen,
  playerProfile,
  selectedCharacter,
  selectedCharacterIndex,
  selectedPartnerCharacter,
  selectableCharacters,
  opponentCharacters,
  speechBubble,
  tableByPlayer,
  lastPlayedPlayerId,
  player1,
  canRequestTruco,
  canHumanAdvisePartner,
  canHumanRaiseTruco,
  canHumanRespondToTruco,
  canPlayHumanCard,
  variantSelectionDisabled,
  onChangeVariant,
  onChangeDebugVenue,
  onCloseCharacterSelect,
  onCloseJourneyIntro,
  onContinueToCharacterSelect,
  onConfirmCharacterSelect,
  onEnterVenueFromIntro,
  onLaunchVenue,
  onOpenCharacterSelect,
  onOpenJourneyIntro,
  onReturnToJourneyFlow,
  onResetCampaign,
  onSelectNextCharacter,
  onSelectPreviousCharacter,
  onStart,
  onRequestTruco,
  onAcceptTruco,
  onAdvisePartner,
  onCancelInGameConfirmation,
  onCloseInGameContextMenu,
  onConfirmInGameConfirmation,
  onExitMatchFromContextMenu,
  onOpenInGameContextMenu,
  onRaiseTruco,
  onRunFromTruco,
  onSwapPartnerFromContextMenu,
  onPlayCard,
  styles,
}: TableSectionProps) {
  const tableSceneModel = buildTableSceneModel(
    handState,
    tableByPlayer,
    lastPlayedPlayerId,
    currentCampaignVenue
  )
  const isMenuMode = !handState
  const isVenueIntroMode = isMenuMode && menuScreen === "venue-intro"
  const rosterPlayers = handState?.players ?? [
    { id: 2, hand: [] },
    { id: 3, hand: [] },
    { id: 4, hand: [] },
    { id: 1, hand: [] },
  ]
  const playerAvatarById: Record<number, string> = {
    1: avatarYouAsset,
    2: opponentCharacters[0]?.avatarAsset ?? avatarYouAsset,
    3: selectedPartnerCharacter?.avatarAsset ?? avatarYouAsset,
    4: opponentCharacters[1]?.avatarAsset ?? opponentCharacters[0]?.avatarAsset ?? avatarYouAsset,
  }
  const playerNameById: Record<number, string> = {
    1: "Você",
    2: opponentCharacters[0]?.name ?? "Adversário esquerdo",
    3: selectedPartnerCharacter?.name ?? "Parceira",
    4: opponentCharacters[1]?.name ?? "Adversário direito",
  }

  if (isVenueIntroMode) {
    return (
      <section style={styles.tablePanel}>
        <div
          style={{
            ...styles.tableHudSurface,
            backgroundImage: "none",
            backgroundColor: "#120a06",
            padding: 0,
          }}
        >
          <div style={styles.gameViewportFrame}>
            <VenueIntroScreen
              currentCampaignVenue={currentCampaignVenue}
              currentVenueWins={currentVenueWins}
              hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
              opponentCharacters={opponentCharacters}
              playerProfile={playerProfile}
              onOpenCharacterSelect={onOpenCharacterSelect}
              onStart={onEnterVenueFromIntro}
              styles={styles}
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section style={styles.tablePanel}>
      <div style={styles.tableHudSurface}>
        <div style={styles.gameViewportFrame}>
          <div style={styles.gameViewport}>
            {isMenuMode ? (
              menuScreen === "match-result" ? (
                <MatchResultScreen
                  currentCampaignVenue={currentCampaignVenue}
                  result={matchResultScreen}
                  onContinue={onReturnToJourneyFlow}
                  styles={styles}
                />
              ) : menuScreen === "journey-intro" ? (
                <JourneyIntroScreen
                  currentCampaignVenue={currentCampaignVenue}
                  onBack={onCloseJourneyIntro}
                  onContinueToCharacterSelect={onContinueToCharacterSelect}
                  onLaunchVenue={onLaunchVenue}
                  styles={styles}
                />
              ) : menuScreen === "character-select" ? (
                <CharacterSelectionScreen
                  currentCampaignVenue={currentCampaignVenue}
                  selectedCharacter={selectedCharacter}
                  selectedCharacterIndex={selectedCharacterIndex}
                  selectedPartnerCharacter={selectedPartnerCharacter}
                  selectableCharacters={selectableCharacters}
                  onBack={onCloseCharacterSelect}
                  onConfirm={onConfirmCharacterSelect}
                  onNext={onSelectNextCharacter}
                  onPrevious={onSelectPreviousCharacter}
                  styles={styles}
                />
              ) : menuScreen === "venue-intro" ? (
                <VenueIntroScreen
                  currentCampaignVenue={currentCampaignVenue}
                  currentVenueWins={currentVenueWins}
                  hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
                  opponentCharacters={opponentCharacters}
                  playerProfile={playerProfile}
                  onOpenCharacterSelect={onOpenCharacterSelect}
                  onStart={onEnterVenueFromIntro}
                  styles={styles}
                />
              ) : (
                <GameStartScreen
                  activeVariant={activeVariant}
                  campaignCompleted={campaignCompleted}
                  currentCampaignVenue={currentCampaignVenue}
                  debugModeEnabled={debugModeEnabled}
                  debugVenueId={debugVenueId}
                  debugVenueOptions={debugVenueOptions}
                  onChangeVariant={onChangeVariant}
                  onChangeDebugVenue={onChangeDebugVenue}
                  onOpenJourneyIntro={onOpenJourneyIntro}
                  onResetCampaign={onResetCampaign}
                  onStart={onStart}
                  styles={styles}
                  variantSelectionDisabled={variantSelectionDisabled}
                />
              )
            ) : (
              <>
                <div style={styles.gameLeftRail}>
                  <div style={styles.scenePanel}>
                    <div style={styles.scenePanelTitle}>Mesa</div>
                    <div style={styles.rosterGrid}>
                      {rosterPlayers.map((player) => (
                        <div
                          key={player.id}
                          style={{
                            ...styles.rosterCard,
                            ...(player.id === 1 ? styles.rosterCardHuman : {}),
                          }}
                        >
                          <div style={styles.rosterAvatar}>
                            <img
                              src={playerAvatarById[player.id]}
                              alt={playerNameById[player.id]}
                              style={styles.rosterAvatarImage}
                            />
                          </div>
                          <div style={styles.rosterName}>{playerNameById[player.id]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.scorePadCard}>
                    <div
                      style={{
                        ...styles.scorePadCardSurface,
                        backgroundImage: `linear-gradient(180deg, rgba(248,242,231,0.14) 0%, rgba(233,221,198,0.18) 100%), url(${scorePadNotebookAsset})`,
                      }}
                    >
                      <div style={styles.scorePadGrid}>
                        <div style={styles.scorePadCellTopLeft}>
                          <div style={{ ...styles.scorePadLabel, ...styles.scorePadLabelLeft }}>
                            Nós
                          </div>
                          <div style={{ ...styles.scorePadValue, ...styles.scorePadValueLeft }}>
                            {matchState?.score.A ?? 0}
                          </div>
                        </div>
                        <div style={styles.scorePadCellTopRight}>
                          <div style={{ ...styles.scorePadLabel, ...styles.scorePadLabelRight }}>
                            Eles
                          </div>
                          <div style={{ ...styles.scorePadValue, ...styles.scorePadValueRight }}>
                            {matchState?.score.B ?? 0}
                          </div>
                        </div>
                        <div style={styles.scorePadCellBottomLeft}>
                          <div
                            style={{
                              ...styles.scorePadMetaLabel,
                              ...styles.scorePadMetaLabelLeft,
                            }}
                          >
                            Mão
                          </div>
                          <div
                            style={{
                              ...styles.scorePadMetaValue,
                              ...styles.scorePadMetaValueLeft,
                            }}
                          >
                            {handState?.score.A ?? 0}
                          </div>
                        </div>
                        <div style={styles.scorePadCellBottomRight}>
                          <div
                            style={{
                              ...styles.scorePadMetaLabel,
                              ...styles.scorePadMetaLabelRight,
                            }}
                          >
                            Mão
                          </div>
                          <div
                            style={{
                              ...styles.scorePadMetaValue,
                              ...styles.scorePadMetaValueRight,
                            }}
                          >
                            {handState?.score.B ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.gameMainColumn}>
                  <div style={styles.tableSurfaceWrap}>
                    <div style={styles.tableSurface}>
                      <GameTableScene
                        model={tableSceneModel}
                        speechBubble={speechBubble}
                        dealAnimationNonce={dealAnimationNonce}
                      />
                    </div>
                  </div>

                  <div style={styles.playerCardsBlock}>
                    <HumanCardsPanel
                      handState={handState}
                      inGameContextMenuOpen={inGameContextMenuOpen}
                      player1={player1}
                      canPlayHumanCard={canPlayHumanCard}
                      onCloseInGameContextMenu={onCloseInGameContextMenu}
                      onExitMatchFromContextMenu={onExitMatchFromContextMenu}
                      onOpenInGameContextMenu={onOpenInGameContextMenu}
                      onPlayCard={onPlayCard}
                      onSwapPartnerFromContextMenu={onSwapPartnerFromContextMenu}
                      styles={styles}
                    />
                  </div>
                </div>

                <div style={styles.gameSidebarColumn}>
                  <div style={styles.tableHudSidebar}>
                    <div
                      style={{
                        ...styles.tableHudStats,
                        backgroundImage: `linear-gradient(180deg, rgba(28,18,12,0.18) 0%, rgba(14,9,6,0.24) 100%), url(${statsPanelWoodAsset})`,
                        backgroundColor: "rgba(57,36,24,0.92)",
                        backgroundSize: "cover, 112% 128%",
                        backgroundPosition: "center, center",
                        backgroundRepeat: "no-repeat, no-repeat",
                        boxShadow:
                          "0 10px 20px rgba(0,0,0,0.18), inset -6px 0 0 rgba(81,55,36,0.92)",
                      }}
                    >
                      <div style={styles.tableHudStatLineCentered}>
                        <span style={styles.tableHudStatLabelCentered}>Etapa</span>
                        <strong style={styles.tableHudStatValueCentered}>
                          {currentCampaignVenue?.name ?? "Treino"}
                        </strong>
                      </div>
                      <div style={styles.tableHudStatsDivider} />
                      <div style={styles.tableHudStatLineCentered}>
                        <span style={styles.tableHudStatLabelCentered}>Endereço</span>
                        <strong style={styles.tableHudStatValueCentered}>
                          {currentCampaignVenue?.districtLabel ?? "—"}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={{
                        ...styles.inGameActionsCard,
                        background: "transparent",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      {canHumanAdvisePartner ? (
                        <div style={styles.inGameActionsGrid}>
                          <button
                            style={{
                              ...styles.trucoSecondaryButton,
                              backgroundImage: `url(${actionButtonAsset})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              border: "none",
                              color: "#f7efe0",
                              boxShadow: "none",
                            }}
                            onClick={() => onAdvisePartner("BORA!")}
                          >
                            BORA!
                          </button>
                          <button
                            style={{
                              ...styles.trucoSecondaryButton,
                              backgroundImage: `url(${actionButtonAsset})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              border: "none",
                              color: "#f7efe0",
                              boxShadow: "none",
                            }}
                            onClick={() => onAdvisePartner("CÊ QUE SABE!")}
                          >
                            CÊ QUE SABE!
                          </button>
                          <button
                            style={{
                              ...styles.trucoSecondaryButton,
                              backgroundImage: `url(${actionButtonAsset})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              border: "none",
                              color: "#f7efe0",
                              boxShadow: "none",
                            }}
                            onClick={() => onAdvisePartner("MELHOR CORRER!")}
                          >
                            MELHOR CORRER!
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={styles.inGameActionsRow}>
                            <button
                              style={{
                                ...styles.trucoPrimaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canRequestTruco ? styles.disabledButton : {}),
                              }}
                              onClick={onRequestTruco}
                              disabled={!canRequestTruco}
                            >
                              {getRequestBetButtonLabel(handState)}
                            </button>
                          </div>
                          <div style={styles.inGameActionsGrid}>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
                              }}
                              onClick={onAcceptTruco}
                              disabled={!canHumanRespondToTruco}
                            >
                              Aceitar
                            </button>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canHumanRaiseTruco
                                  ? styles.disabledButton
                                  : {}),
                              }}
                              onClick={onRaiseTruco}
                              disabled={!canHumanRaiseTruco}
                            >
                              {getRaiseResponseButtonLabel(handState)}
                            </button>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
                              }}
                              onClick={onRunFromTruco}
                              disabled={!canHumanRespondToTruco}
                            >
                              Correr
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {handState && inGameConfirmation ? (
            <div style={styles.inGameConfirmationOverlay}>
              <div style={styles.inGameConfirmationCard}>
                <div style={styles.inGameConfirmationEyebrow}>Confirmação</div>
                <h3 style={styles.inGameConfirmationTitle}>{inGameConfirmation.title}</h3>
                <p style={styles.inGameConfirmationText}>{inGameConfirmation.message}</p>
                <div style={styles.inGameConfirmationWarning}>
                  Todo o progresso desta partida atual será perdido se você continuar.
                </div>
                <div style={styles.inGameConfirmationActions}>
                  <button
                    style={styles.inGameConfirmationCancelButton}
                    onClick={onCancelInGameConfirmation}
                  >
                    Cancelar
                  </button>
                  <button
                    style={styles.inGameConfirmationConfirmButton}
                    onClick={onConfirmInGameConfirmation}
                  >
                    {inGameConfirmation.confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function GameStartScreen({
  activeVariant,
  campaignCompleted: _campaignCompleted,
  currentCampaignVenue,
  debugModeEnabled,
  debugVenueId,
  debugVenueOptions,
  onChangeVariant,
  onChangeDebugVenue,
  onOpenJourneyIntro,
  onResetCampaign,
  onStart,
  styles,
  variantSelectionDisabled,
}: {
  activeVariant: GameVariant
  campaignCompleted: boolean
  currentCampaignVenue: CampaignVenue | null
  debugModeEnabled: boolean
  debugVenueId: string
  debugVenueOptions: Array<{ id: string; label: string }>
  onChangeVariant: (variant: GameVariant) => void
  onChangeDebugVenue: (venueId: string) => void
  onOpenJourneyIntro: () => void
  onResetCampaign: () => void
  onStart: () => void
  styles: StyleMap
  variantSelectionDisabled: boolean
}) {
  return (
    <div style={styles.gameStartScreen}>
      <button style={styles.gameStartTopActionButton} onClick={onOpenJourneyIntro}>
        Parceiros
      </button>
      <div style={styles.gameStartCard}>
        <div style={styles.gameStartEyebrow}>Entrada</div>
        <h2 style={styles.gameStartTitle}>Escolha a variante</h2>
        <div style={styles.gameStartVenue}>
          {currentCampaignVenue?.name ?? "Campanha concluída"}
        </div>
        <div style={styles.gameStartVenueMeta}>
          {currentCampaignVenue?.districtLabel ?? "Reinicie a campanha para jogar novamente"}
        </div>

        {debugModeEnabled ? (
          <div style={styles.gameStartDebugPanel}>
            <div style={styles.gameStartDebugLabel}>Debug de bar</div>
            <select
              value={debugVenueId}
              onChange={(e) => onChangeDebugVenue(e.target.value)}
              style={styles.gameStartDebugSelect}
            >
              <option value="">Fluxo normal da campanha</option>
              {debugVenueOptions.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.label}
                </option>
              ))}
            </select>
            <div style={styles.gameStartDebugHint}>
              Escolha um bar aqui para testar direto, sem depender do progresso salvo.
            </div>
          </div>
        ) : null}

        <div style={styles.gameStartOptions}>
          <button
            style={{
              ...styles.gameStartOption,
              ...(activeVariant === "MINEIRO" ? styles.gameStartOptionActive : {}),
            }}
            onClick={() => onChangeVariant("MINEIRO")}
            disabled={variantSelectionDisabled}
          >
            Truco Mineiro
          </button>
          <button
            style={{
              ...styles.gameStartOption,
              ...(activeVariant === "PAULISTA" ? styles.gameStartOptionActive : {}),
            }}
            onClick={() => onChangeVariant("PAULISTA")}
            disabled={variantSelectionDisabled}
          >
            Truco Paulista
          </button>
        </div>

        <button
          style={{
            ...styles.primaryButton,
            ...(!currentCampaignVenue ? styles.disabledButton : {}),
          }}
          onClick={onStart}
          disabled={!currentCampaignVenue}
        >
          COMEÇAR
        </button>
      </div>

      <div style={styles.gameStartActionsStack}>
        <button
          style={{
            ...styles.gameStartLaunchButton,
            ...(!currentCampaignVenue ? styles.disabledButton : {}),
            ...(currentCampaignVenue ? {} : styles.gameStartResetButtonCentered),
          }}
          onClick={onStart}
          disabled={!currentCampaignVenue}
        >
          COMEÇAR
        </button>

        <button
          style={{
            ...styles.gameStartResetButton,
            ...(currentCampaignVenue ? {} : styles.gameStartResetButtonCentered),
          }}
          onClick={onResetCampaign}
        >
          Resetar progresso
        </button>
      </div>
    </div>
  )
}

function JourneyIntroScreen({
  currentCampaignVenue,
  onBack,
  onContinueToCharacterSelect,
  onLaunchVenue,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  onBack: () => void
  onContinueToCharacterSelect: () => void
  onLaunchVenue: (venueId: string) => void
  styles: StyleMap
}) {
  const hasCurrentVenue = !!currentCampaignVenue
  const activeStageIndex = currentCampaignVenue
    ? CAMPAIGN_STAGES.findIndex((stage) => stage.venues.some((venue) => venue.id === currentCampaignVenue.id))
    : -1
  const activeStageId = currentCampaignVenue
    ? CAMPAIGN_STAGES.find((stage) => stage.venues.some((venue) => venue.id === currentCampaignVenue.id))?.id
    : null
  const activeVenueIndex =
    currentCampaignVenue && activeStageIndex >= 0
      ? CAMPAIGN_STAGES[activeStageIndex]?.venues.findIndex((venue) => venue.id === currentCampaignVenue.id) ?? -1
      : -1

  return (
    <div style={styles.journeyIntroScreen}>
      <div style={styles.journeyIntroHeader}>
        <div>
          <div style={styles.journeyIntroEyebrow}>Jornada de campanha</div>
          <h2 style={styles.journeyIntroTitle}>Você tem um caminho pela frente</h2>
          <p style={styles.journeyIntroText}>
            Escolha a parceira e use este mapa para sentir o tamanho da jornada. Daqui
            você pode entrar no bar atual ou revisitar qualquer bar anterior já alcançado.
          </p>
        </div>
        <button style={styles.characterSelectBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div style={styles.journeyIntroLeadCard}>
        <div style={styles.journeyIntroLeadLabel}>Próximo desafio</div>
        <div style={styles.journeyIntroLeadVenue}>
          {currentCampaignVenue?.name ?? "Campanha concluída"}
        </div>
        <div style={styles.journeyIntroLeadMeta}>
          {currentCampaignVenue?.districtLabel ?? "Todas as etapas principais já foram vencidas."}
        </div>
        <p style={styles.journeyIntroLeadText}>
          {currentCampaignVenue?.entryNarrative ??
            "Você já cruzou toda a jornada principal disponível até aqui."}
        </p>
      </div>

      <div style={styles.journeyIntroStages}>
        {CAMPAIGN_STAGES.map((stage, index) => {
          const totalMatches = stage.venues.reduce((sum, venue) => sum + venue.matchesToClear, 0)
          const isCompleted = !hasCurrentVenue || (activeStageIndex !== -1 && index < activeStageIndex)
          const isActive = hasCurrentVenue && stage.id === activeStageId
          const isLocked = hasCurrentVenue && activeStageIndex !== -1 && index > activeStageIndex
          const stageStatusLabel = isActive
            ? "Etapa atual"
            : isCompleted
              ? "Concluída"
              : "Bloqueada"

          return (
            <div
              key={stage.id}
              style={{
                ...styles.journeyIntroStageCard,
                ...(isActive ? styles.journeyIntroStageCardActive : {}),
                ...(isCompleted ? styles.journeyIntroStageCardCompleted : {}),
                ...(isLocked ? styles.journeyIntroStageCardLocked : {}),
              }}
            >
              <div style={styles.journeyIntroStageOrder}>{String(index + 1).padStart(2, "0")}</div>
              <div style={styles.journeyIntroStageBody}>
                <div style={styles.journeyIntroStageTopRow}>
                  <div>
                    <div style={styles.journeyIntroStageTitle}>{stage.name}</div>
                    <div style={styles.journeyIntroStageTier}>
                      {stage.tier === "bonus" ? "Bônus" : getCampaignTierLabel(stage.tier)}
                    </div>
                  </div>
                  <div style={styles.journeyIntroStageBadgeStack}>
                    <div style={styles.journeyIntroStageBadge}>
                      {stage.tier === "bonus" ? "Bônus" : stage.mapLabel}
                    </div>
                    <div
                      style={{
                        ...styles.journeyIntroStageStatusBadge,
                        ...(isActive ? styles.journeyIntroStageStatusBadgeActive : {}),
                        ...(isCompleted ? styles.journeyIntroStageStatusBadgeCompleted : {}),
                        ...(isLocked ? styles.journeyIntroStageStatusBadgeLocked : {}),
                      }}
                    >
                      {stageStatusLabel}
                    </div>
                  </div>
                </div>
                <div style={styles.journeyIntroStageText}>{stage.shortDescription}</div>
                <div style={styles.journeyIntroStageMeta}>
                  <span>{stage.venues.length} locais</span>
                  <span>{totalMatches} partidas base</span>
                </div>
                <div style={styles.journeyIntroVenueList}>
                  {stage.venues.map((venue, venueIndex) => {
                    const isCurrentVenue = venue.id === currentCampaignVenue?.id
                    const isAvailable =
                      !hasCurrentVenue ||
                      (activeStageIndex !== -1 &&
                        (index < activeStageIndex ||
                          (index === activeStageIndex &&
                            activeVenueIndex !== -1 &&
                            venueIndex <= activeVenueIndex)))
                    const venueStatusLabel = isCurrentVenue
                      ? "Atual"
                      : isAvailable
                        ? "Concluído"
                        : "Bloqueado"
                    return (
                      <button
                        key={venue.id}
                        disabled={!isAvailable}
                        style={{
                          ...styles.journeyIntroVenueButton,
                          ...(isCurrentVenue ? styles.journeyIntroVenueButtonActive : {}),
                          ...(!isAvailable ? styles.journeyIntroVenueButtonLocked : {}),
                        }}
                        onClick={() => onLaunchVenue(venue.id)}
                      >
                        <span style={styles.journeyIntroVenueButtonLabel}>{venue.name}</span>
                        <span style={styles.journeyIntroVenueButtonMeta}>
                          {venueStatusLabel}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={styles.journeyIntroActions}>
        <button style={styles.gameStartResetButton} onClick={onContinueToCharacterSelect}>
          TROCAR PARCEIRA
        </button>
      </div>
    </div>
  )
}

function MatchResultScreen({
  currentCampaignVenue,
  result,
  onContinue,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  result: MatchResultScreenState | null
  onContinue: () => void
  styles: StyleMap
}) {
  const didWin = result?.outcome === "win"

  return (
    <div style={styles.matchResultScreen}>
      <div
        style={{
          ...styles.matchResultCard,
          ...(didWin ? styles.matchResultCardWin : styles.matchResultCardLoss),
        }}
      >
        <div style={styles.matchResultEyebrow}>
          {didWin ? "Vitória na mesa" : "Derrota na mesa"}
        </div>
        <h2 style={styles.matchResultTitle}>{result?.title ?? "Fim da partida"}</h2>
        <div style={styles.matchResultVenue}>
          {result?.venueName ?? currentCampaignVenue?.name ?? "Fluxo de bares"}
        </div>
        <p style={styles.matchResultSubtitle}>
          {result?.subtitle ?? "A partida terminou e a casa já reagiu ao resultado."}
        </p>

        <div style={styles.matchResultHostBox}>
          <div style={styles.matchResultHostLabel}>Host do bar</div>
          <p style={styles.matchResultHostLine}>
            {result?.hostLine ??
              "A casa comenta o resultado enquanto você se prepara para voltar ao circuito."}
          </p>
        </div>

        {result?.progressionTitle || result?.progressionText ? (
          <div style={styles.matchResultProgressBox}>
            <div style={styles.matchResultProgressLabel}>
              {result?.progressionTitle ?? "Progressão"}
            </div>
            <p style={styles.matchResultProgressText}>
              {result?.progressionText ?? "A campanha avançou depois desta vitória."}
            </p>
          </div>
        ) : null}

        <button style={styles.gameStartLaunchButton} onClick={onContinue}>
          VOLTAR AO FLUXO DE BARES
        </button>
      </div>
    </div>
  )
}

function CharacterSelectionScreen({
  currentCampaignVenue: _currentCampaignVenue,
  selectedCharacter,
  selectedCharacterIndex,
  selectedPartnerCharacter,
  selectableCharacters,
  onBack,
  onConfirm,
  onNext,
  onPrevious,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  selectedPartnerCharacter: TrucoCharacterProfile | null
  selectableCharacters: TrucoCharacterProfile[]
  onBack: () => void
  onConfirm: () => void
  onNext: () => void
  onPrevious: () => void
  styles: StyleMap
}) {
  if (!selectedCharacter) {
    return (
      <div style={styles.characterSelectScreen}>
        <div style={styles.characterSelectEmptyBox}>
          Ainda não há personagens com avatar prontos para seleção.
        </div>
      </div>
    )
  }

  const styleTokens = selectedCharacter.playStyle
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
  const totalCharacters = selectableCharacters.length
  const currentPosition = selectedCharacterIndex >= 0 ? selectedCharacterIndex + 1 : 1
  const isSelectedPartner = selectedPartnerCharacter?.id === selectedCharacter.id
  const actionLabel = isSelectedPartner
    ? "Parceira atualmente escolhida"
    : `Jogar com ${selectedCharacter.name}`

  return (
    <div style={styles.characterSelectScreen}>
      <div style={styles.characterSelectHeader}>
        <div style={styles.characterSelectEyebrow}>Escolha seu parceiro</div>
        <button style={styles.characterSelectBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div style={styles.characterSelectBoard}>
        <div style={styles.characterSelectLeftColumn}>
          <div style={styles.characterPortraitFrame}>
            <img
              src={selectedCharacter.avatarAsset}
              alt={selectedCharacter.name}
              style={styles.characterPortraitImage}
            />
            <div style={styles.characterPortraitOverlay}>
              <div style={styles.characterPortraitName}>{selectedCharacter.name}</div>
              <div style={styles.characterPortraitNickname}>{selectedCharacter.nickname}</div>
            </div>
          </div>

          <div style={styles.characterIdentityPanel}>
            <div style={styles.characterNavigator}>
              <button style={styles.characterNavButton} onClick={onPrevious}>
                ←
              </button>
              <div style={styles.characterNavDots}>
                {selectableCharacters.map((character, index) => {
                  const active = index === selectedCharacterIndex
                  return (
                    <span
                      key={character.id}
                      style={{
                        ...styles.characterNavDot,
                        ...(active ? styles.characterNavDotActive : {}),
                      }}
                    />
                  )
                })}
              </div>
              <button style={styles.characterNavButton} onClick={onNext}>
                →
              </button>
            </div>

            <div style={styles.characterNavCounter}>
              {currentPosition} de {totalCharacters}
            </div>
          </div>
        </div>

        <div style={styles.characterSelectRightColumn}>
          <div style={styles.characterInfoPanel}>
            <div style={styles.characterInfoCard}>
              <div style={styles.characterInfoSection}>
                <div style={styles.characterInfoTitle}>História</div>
                <div style={styles.characterStoryQuote}>“{selectedCharacter.story}”</div>
              </div>
            </div>

            <div style={styles.characterDetailsGrid}>
              <div style={styles.characterInfoCard}>
                <div style={styles.characterInfoSection}>
                  <div style={styles.characterInfoTitle}>Estilo de jogo</div>
                  <div style={styles.characterStyleChips}>
                    {styleTokens.map((token) => (
                      <span key={token} style={styles.characterStyleChip}>
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.characterInfoCard}>
                <div style={styles.characterInfoSection}>
                  <div style={styles.characterInfoTitle}>Atributos</div>
                  <AttributeBar
                    label="Coragem"
                    value={selectedCharacter.attributes.courage}
                    styles={styles}
                  />
                  <AttributeBar
                    label="Paciência"
                    value={selectedCharacter.attributes.patience}
                    styles={styles}
                  />
                  <AttributeBar
                    label="Blefe"
                    value={selectedCharacter.attributes.bluff}
                    styles={styles}
                  />
                </div>
              </div>
            </div>

            <div style={styles.characterActionFooter}>
              <button
                style={styles.characterSelectActionButton}
                onClick={onConfirm}
              >
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VenueIntroScreen({
  currentCampaignVenue,
  currentVenueWins,
  hasSelectedPartnerForVenue,
  opponentCharacters,
  playerProfile,
  onOpenCharacterSelect,
  onStart,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  hasSelectedPartnerForVenue: boolean
  opponentCharacters: TrucoCharacterProfile[]
  playerProfile: PlayerProfile
  onOpenCharacterSelect: () => void
  onStart: () => void
  styles: StyleMap
}) {
  const coverConfig = currentCampaignVenue
    ? VENUE_COVER_CONFIG_BY_ID[currentCampaignVenue.id]
    : undefined
  const progressPercent = currentCampaignVenue
    ? Math.min(100, Math.round((currentVenueWins / currentCampaignVenue.matchesToClear) * 100))
    : 0
  const remainingWins = currentCampaignVenue
    ? Math.max(0, currentCampaignVenue.matchesToClear - currentVenueWins)
    : 0
  const ctaLabel = hasSelectedPartnerForVenue ? "ENTRAR NO BAR" : "ESCOLHER PARCEIRA"
  const overallMatches = playerProfile.campaign.wins + playerProfile.campaign.losses
  const overallWinRate = overallMatches > 0
    ? Math.round((playerProfile.campaign.wins / overallMatches) * 100)
    : 0

  if (!coverConfig) {
    const participants = [
      {
        id: "you",
        role: "Você",
        name: "Zeca Viramão",
        description: "Chega na mesa querendo medir a temperatura do bar no carteado.",
        avatarAsset: avatarYouAsset,
      },
      ...opponentCharacters.map((character, index) => ({
        id: character.id,
        role: index === 0 ? "Adversário esquerdo" : "Adversário direito",
        name: character.name,
        description: character.story,
        avatarAsset: character.avatarAsset,
      })),
    ]

    return (
      <div style={styles.venueIntroScreen}>
        <div style={styles.venueIntroHeader}>
          <div>
            <div style={styles.venueIntroEyebrow}>Chegada no bar</div>
            <h2 style={styles.venueIntroTitle}>{currentCampaignVenue?.name ?? "Próxima mesa"}</h2>
            <div style={styles.venueIntroMeta}>
              {currentCampaignVenue?.districtLabel ?? "Local ainda não definido"}
            </div>
          </div>
          <button style={styles.characterSelectBackButton} onClick={onOpenCharacterSelect}>
            Trocar parceira
          </button>
        </div>

        <div style={styles.venueIntroBoard}>
          <div style={styles.venueIntroMainCard}>
            <div style={styles.venueIntroSectionLabel}>Clima do lugar</div>
            <p style={styles.venueIntroLead}>
              {currentCampaignVenue?.entryNarrative ??
                "A mesa já está armada. Falta só respirar fundo e começar."}
            </p>
            <p style={styles.venueIntroText}>
              {currentCampaignVenue?.atmosphere ??
                "O bar ainda espera uma descrição própria, mas a partida já está pronta para começar."}
            </p>

            <div style={styles.venueIntroFactsGrid}>
              <div style={styles.venueIntroFactCard}>
                <div style={styles.venueIntroFactLabel}>Variante</div>
                <strong style={styles.venueIntroFactValue}>
                  {currentCampaignVenue?.variant === "PAULISTA" ? "Truco Paulista" : "Truco Mineiro"}
                </strong>
              </div>
              <div style={styles.venueIntroFactCard}>
                <div style={styles.venueIntroFactLabel}>Meta do bar</div>
                <strong style={styles.venueIntroFactValue}>
                  {currentCampaignVenue?.matchesToClear ?? 0} vitórias
                </strong>
              </div>
            </div>
          </div>

          <div style={styles.venueIntroRosterPanel}>
            <div style={styles.venueIntroSectionLabel}>Quem segura a mesa</div>
            <div style={styles.venueIntroParticipants}>
              {participants.map((participant) => (
                <div key={participant.id} style={styles.venueIntroParticipantCard}>
                  <div style={styles.venueIntroParticipantAvatar}>
                    <img
                      src={participant.avatarAsset}
                      alt={participant.name}
                      style={styles.venueIntroParticipantImage}
                    />
                  </div>
                  <div style={styles.venueIntroParticipantBody}>
                    <div style={styles.venueIntroParticipantRole}>{participant.role}</div>
                    <div style={styles.venueIntroParticipantName}>{participant.name}</div>
                    <div style={styles.venueIntroParticipantText}>{participant.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.venueIntroActions}>
          <button style={styles.gameStartLaunchButton} onClick={onStart}>
            {ctaLabel}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "minmax(0, 1fr)",
        padding: 8,
        color: "#f6e7c4",
        boxSizing: "border-box",
        backgroundImage: `linear-gradient(180deg, rgba(11, 7, 4, 0.34) 0%, rgba(11, 7, 4, 0.72) 100%), url(${coverConfig.backgroundAsset})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "246px minmax(0, 1fr) 290px",
          gap: 14,
          height: "100%",
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "minmax(0, 1fr) auto auto",
            gap: 8,
            alignItems: "end",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 286,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={coverConfig.hostPortraitAsset}
              alt={coverConfig.hostName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center bottom",
                filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.42))",
                mixBlendMode: "screen",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              minHeight: 136,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "16px 18px",
              boxSizing: "border-box",
            }}
          >
            <img
              src={coverConfig.quoteBoardAsset}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                mixBlendMode: "screen",
              }}
            />
            <div
              style={{
                position: "relative",
                maxWidth: "58%",
                color: "#efe0be",
                fontFamily: "\"Georgia\", serif",
                fontSize: 15,
                lineHeight: 1.08,
                fontStyle: "italic",
                textShadow: "0 2px 14px rgba(0,0,0,0.5)",
                transform: "translateY(6px)",
              }}
            >
              “{coverConfig.hostQuote}”
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "\"Georgia\", serif",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.03em",
              }}
            >
              {coverConfig.hostName}
            </div>
            <div
            style={{
              marginTop: 4,
              color: "rgba(245, 219, 165, 0.9)",
              fontSize: 14,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
            >
              {coverConfig.hostRole}
            </div>
          </div>
        </div>

        <div
          style={{
            minHeight: 0,
            padding: "14px 18px 8px",
            display: "grid",
            gridTemplateRows: "auto auto auto auto auto auto",
            gap: 3,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, rgba(19,11,8,0.92) 0%, rgba(10,6,4,0.94) 100%)",
            border: "1px solid rgba(155, 110, 54, 0.56)",
            boxShadow: "0 16px 28px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(100,65,31,0.28)",
            borderRadius: 22,
          }}
        >
          <div style={{ position: "relative", textAlign: "center" }}>
            <div
              style={{
                color: "#e8c780",
                fontSize: 13,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
              }}
            >
              {coverConfig.leadEyebrow}
            </div>
          </div>

          <div style={{ position: "relative", textAlign: "center" }}>
            <img
              src={coverConfig.dividerAsset}
              alt=""
              aria-hidden="true"
              style={{
                width: "62%",
                maxWidth: 280,
                height: 10,
                objectFit: "contain",
                mixBlendMode: "screen",
                opacity: 0.88,
              }}
            />
            <h2
              style={{
                margin: "5px 0 5px",
                fontFamily: "\"Georgia\", serif",
                fontSize: 36,
                lineHeight: 0.96,
                color: "#e0b25d",
                textShadow: "0 2px 16px rgba(0,0,0,0.28)",
              }}
            >
              {currentCampaignVenue?.name ?? "Próximo bar"}
            </h2>
            <div
              style={{
                color: "#f2d9a7",
                fontSize: 15,
              }}
            >
              {currentCampaignVenue?.districtLabel ?? "Local ainda não definido"}
            </div>
          </div>

          <div style={{ position: "relative", textAlign: "center" }}>
            <img
              src={coverConfig.dividerAsset}
              alt=""
              aria-hidden="true"
              style={{
                width: "70%",
                maxWidth: 320,
                height: 8,
                objectFit: "contain",
                mixBlendMode: "screen",
                opacity: 0.84,
              }}
            />
          </div>

          <div
              style={{
                position: "relative",
                textAlign: "center",
                padding: "0 14px",
              }}
            >
            <p
              style={{
                margin: 0,
                fontFamily: "\"Georgia\", serif",
                fontSize: 16,
                lineHeight: 1.06,
                color: "#f0d7a0",
              }}
            >
              {coverConfig.leadText}
            </p>
            <p
              style={{
                margin: "5px 0 0",
                fontFamily: "\"Georgia\", serif",
                fontSize: 14,
                lineHeight: 1.05,
                color: "rgba(238, 220, 180, 0.9)",
              }}
            >
              {coverConfig.description}
            </p>
          </div>

          <div
              style={{
                position: "relative",
                display: "grid",
                gap: 6,
                alignContent: "start",
              }}
            >
            <div
              style={{
                color: "#d6aa57",
                letterSpacing: "0.22em",
                fontSize: 11,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Adversários
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              {opponentCharacters.map((character) => (
                <div
                  key={character.id}
                  style={{
                    display: "grid",
                    gap: 3,
                    justifyItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 102,
                      aspectRatio: "0.84",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "2px solid rgba(173, 123, 55, 0.78)",
                      boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
                      background: "linear-gradient(180deg, rgba(100,72,43,0.26) 0%, rgba(34,21,12,0.46) 100%)",
                    }}
                  >
                    <img
                      src={character.avatarAsset ?? avatarYouAsset}
                      alt={character.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: "#f0dcc0",
                      fontFamily: "\"Georgia\", serif",
                      fontWeight: 700,
                      fontSize: 13,
                      lineHeight: 1.1,
                    }}
                  >
                    <div>
                      {character.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              gap: 2,
              justifyItems: "center",
              alignContent: "start",
              marginTop: "-2px",
            }}
          >
            <div
              style={{
                color: "#c69643",
                letterSpacing: "0.22em",
                fontSize: 10,
                textTransform: "uppercase",
              }}
            >
              Dificuldade do desafio
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <img
                  key={`difficulty-${index}`}
                  src={coverConfig.difficultyBottleAsset}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: 13,
                    height: 20,
                    objectFit: "contain",
                    mixBlendMode: "screen",
                    opacity: index < (currentCampaignVenue?.difficulty.aiLevel ?? 1) ? 0.98 : 0.22,
                    filter: index < (currentCampaignVenue?.difficulty.aiLevel ?? 1)
                      ? "drop-shadow(0 4px 10px rgba(237,178,72,0.25))"
                      : "grayscale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto auto",
            alignContent: "start",
            gap: 10,
            minHeight: 0,
          }}
        >
          <div
            style={{
              borderRadius: 22,
              padding: "12px 14px",
              background:
                "linear-gradient(180deg, rgba(233, 208, 162, 0.92) 0%, rgba(186, 147, 92, 0.94) 100%)",
              color: "#2b1608",
              boxShadow: "0 20px 34px rgba(0,0,0,0.28), inset 0 0 0 2px rgba(121,72,29,0.32)",
              display: "grid",
              alignContent: "start",
              gap: 8,
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontFamily: "\"Georgia\", serif",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              Seu histórico aqui
            </div>

            {[
              {
                icon: coverConfig.iconVictoryAsset,
                label: "Vitórias",
                value: String(currentVenueWins),
                accent: "#9a6b1f",
              },
              {
                icon: coverConfig.iconDefeatAsset,
                label: "Faltam",
                value: String(remainingWins),
                accent: "#7a2318",
              },
              {
                icon: coverConfig.iconAccuracyAsset,
                label: "Progresso",
                value: `${progressPercent}%`,
                accent: "#8a5b1f",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: 4,
                  paddingBottom: 2,
                  borderBottom: "1px solid rgba(95,57,24,0.24)",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "\"Georgia\", serif",
                  }}
                  >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: item.accent,
                    fontFamily: "\"Georgia\", serif",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}

            <div
              style={{
                fontSize: 16,
                lineHeight: 1,
                color: "rgba(57, 31, 12, 0.82)",
                textAlign: "center",
              }}
            >
              Geral: {playerProfile.campaign.wins}V · {playerProfile.campaign.losses}D · {overallWinRate}%.
            </div>
          </div>

          <button
            onClick={onStart}
            style={{
              position: "relative",
              width: "100%",
              minHeight: 82,
              padding: "10px 12px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#f3d08a",
              fontFamily: "\"Georgia\", serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 0.92,
              letterSpacing: "0.03em",
              textShadow: "0 3px 10px rgba(0,0,0,0.4)",
              alignSelf: "start",
            }}
          >
            <img
              src={coverConfig.ctaPlaqueAsset}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                mixBlendMode: "screen",
              }}
            />
            <span
              style={{
                position: "relative",
                display: "inline-block",
                width: 118,
                maxWidth: "54%",
                textAlign: "center",
                whiteSpace: "normal",
              }}
            >
              {ctaLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function AttributeBar({
  label,
  value,
  styles,
}: {
  label: string
  value: 1 | 2 | 3 | 4 | 5
  styles: StyleMap
}) {
  return (
    <div style={styles.characterAttributeRow}>
      <div style={styles.characterAttributeLabel}>{label}</div>
      <div style={styles.characterAttributeTrack}>
        <div
          style={{
            ...styles.characterAttributeFill,
            width: `${(value / 5) * 100}%`,
          }}
        />
      </div>
      <div style={styles.characterAttributeValue}>{value}/5</div>
    </div>
  )
}

interface LogsPanelProps {
  logs: string
  onCopyLogs: () => void
  styles: StyleMap
}

export function LogsPanel({ logs, onCopyLogs, styles }: LogsPanelProps) {
  return (
    <section style={styles.logsCard}>
      <div style={styles.logsHeader}>
        <h2 style={styles.sectionTitle}>Logs</h2>
        <button
          style={{
            ...styles.secondaryButton,
            ...(!logs ? styles.disabledButton : {}),
          }}
          onClick={onCopyLogs}
          disabled={!logs}
        >
          Copiar log
        </button>
      </div>

      <textarea readOnly value={logs} style={styles.logsArea} />
    </section>
  )
}

function HumanCardsPanel({
  handState,
  inGameContextMenuOpen,
  player1,
  canPlayHumanCard,
  onCloseInGameContextMenu,
  onExitMatchFromContextMenu,
  onOpenInGameContextMenu,
  onPlayCard,
  onSwapPartnerFromContextMenu,
  styles,
}: {
  handState: HandState | null
  inGameContextMenuOpen: boolean
  player1: Player | null
  canPlayHumanCard: boolean
  onCloseInGameContextMenu: () => void
  onExitMatchFromContextMenu: () => void
  onOpenInGameContextMenu: () => void
  onPlayCard: (card: Card) => void
  onSwapPartnerFromContextMenu: () => void
  styles: StyleMap
}) {
  return (
    <div style={styles.mobileHandPanel}>
      <div style={styles.mobileHandHeader}>
        <div style={styles.mobileHandMeta}>
          {handState && handState.currentPlayerId === 1 && !handState.finished
            ? "Sua vez"
            : "Aguardando"}
        </div>
      </div>

      <div style={styles.mobileHandRowWrap}>
        {!player1 || player1.hand.length === 0 ? (
          <div style={styles.emptyHandBox}>Você não tem mais cartas.</div>
        ) : (
          <div style={styles.mobileHandRow}>
            {player1.hand.map((card, index) => (
              <button
                key={`${card.rank}-${card.suit}-${index}`}
                style={{
                  ...styles.mobileCardButton,
                  ...(canPlayHumanCard ? styles.cardButtonActive : styles.cardButtonDisabled),
                }}
                onClick={() => onPlayCard(card)}
                disabled={!canPlayHumanCard}
                title={formatCard(card)}
              >
                <div style={styles.mobileCardCornerTop}>
                  <div style={{ ...styles.mobileCardRank, color: getSuitColor(card.suit) }}>
                    {card.rank}
                  </div>
                  <div style={{ ...styles.mobileCardSuit, color: getSuitColor(card.suit) }}>
                    {getSuitSymbol(card.suit)}
                  </div>
                </div>
                <div style={{ ...styles.mobileCardCenterSuit, color: getSuitColor(card.suit) }}>
                  {getSuitSymbol(card.suit)}
                </div>
                <div style={styles.mobileCardCornerBottom}>
                  <div style={{ ...styles.mobileCardRank, color: getSuitColor(card.suit) }}>
                    {card.rank}
                  </div>
                  <div style={{ ...styles.mobileCardSuit, color: getSuitColor(card.suit) }}>
                    {getSuitSymbol(card.suit)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={styles.mobileHandMenuDock}>
          <div style={styles.inGameContextMenuWrap}>
            <button
              style={{
                ...styles.inGameContextMenuButton,
                ...styles.inGameContextMenuButtonHand,
              }}
              onClick={onOpenInGameContextMenu}
            >
              MENU
            </button>

            {inGameContextMenuOpen ? (
              <div style={styles.inGameContextMenuPanelHand}>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onSwapPartnerFromContextMenu}
                >
                  Trocar de parceira
                </button>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onExitMatchFromContextMenu}
                >
                  Sair
                </button>
                <button
                  style={styles.inGameContextMenuActionSecondary}
                  onClick={onCloseInGameContextMenu}
                >
                  Voltar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


function InfoBox({
  label,
  value,
  styles,
}: {
  label: string
  value: string
  styles: StyleMap
}) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoBoxLabel}>{label}</div>
      <div style={styles.infoBoxValue}>{value}</div>
    </div>
  )
}

function CampaignStageCard({
  stage,
  active,
  completed,
  styles,
}: {
  stage: CampaignStage
  active?: boolean
  completed?: boolean
  styles: StyleMap
}) {
  const totalMatches = stage.venues.reduce(
    (sum, venue) => sum + venue.matchesToClear,
    0
  )

  return (
    <div
      style={{
        ...styles.stageCard,
        ...(active ? styles.stageCardActive : {}),
        ...(completed ? styles.stageCardCompleted : {}),
      }}
    >
      <div style={styles.stageCardTopRow}>
        <div>
          <div style={styles.stageCardTitle}>{stage.name}</div>
          <div style={styles.stageCardTier}>{getCampaignTierLabel(stage.tier)}</div>
        </div>

        <div style={styles.stageCardMapLabel}>{stage.mapLabel}</div>
      </div>

      <div style={styles.stageCardText}>{stage.shortDescription}</div>

      <div style={styles.stageCardMetaRow}>
        <span>{stage.venues.length} locais</span>
        <span>{totalMatches} partidas base</span>
      </div>
    </div>
  )
}
