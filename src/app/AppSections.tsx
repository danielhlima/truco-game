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
import actionButtonAsset from "../assets/ui-right/action-button-solid.png"
import statsPanelWoodAsset from "../assets/ui-right/stats-panel-wood-main.png"
import manecoBanguelaCampaignJourneyAsset from "../assets/campaign/botecos-rua-maneco-banguela.png"
import manecoBanguelaBackgroundAsset from "../assets/venues/maneco-banguela/background.png"
import manecoBanguelaHostAsset from "../assets/venues/maneco-banguela/host-maneco-banguela.png"
import startScreenAsset from "../assets/start/truco-raiz-start.png"
import zeCatingaCampaignJourneyAsset from "../assets/campaign/botecos-rua-ze-catinga.png"
import zeCatingaBackgroundAsset from "../assets/venues/ze-catinga/background.png"
import zeCatingaHostAsset from "../assets/venues/ze-catinga/host-ze-catinga.png"
import zeCatingaQuoteBoardAsset from "../assets/venues/ze-catinga/host-quote-board.png"
import zeCatingaCtaPlaqueAsset from "../assets/venues/ze-catinga/cta-plaque.png"
import zeCatingaDifficultyBottleAsset from "../assets/venues/ze-catinga/difficulty-bottle.png"
import zeCatingaDividerAsset from "../assets/venues/ze-catinga/divider-ornament.png"
import zeCatingaMatchResultLossAsset from "../assets/venues/ze-catinga/match-result-loss.png"
import zeCatingaMatchResultWinAsset from "../assets/venues/ze-catinga/match-result-win.png"
import zeCatingaStatsPlaqueAsset from "../assets/venues/ze-catinga/stats-plaque-aged-blank.png"
import type { PlayerProfile } from "../profile/playerProfile"
import type { PartnerAdvice } from "../ai/trucoDecision"
import type { TrucoCharacterProfile } from "../content/characters"
import type { PlayerSkinProfile } from "../content/playerSkins"
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
  venueId?: string
  venueName: string
}
type GameplayIntroPhase = "background" | "reveal" | "done"

type VenueCoverConfig = {
  hostName: string
  hostRole: string
  hostQuote: string
  leadText: string
  description: string
  backgroundAsset: string
  hostPortraitAsset: string
  quoteBoardAsset: string
  ctaPlaqueAsset: string
  difficultyBottleAsset: string
  dividerAsset: string
  statsPlaqueAsset: string
}

const VENUE_COVER_CONFIG_BY_ID: Record<string, VenueCoverConfig> = {
  "bar-do-ze-catinga": {
    hostName: "Zé Catinga",
    hostRole: "Dono do Bar",
    hostQuote: "Aqui dentro, fama não paga dose. Só entra quem aguenta pressão.",
    leadText: "Boteco raiz. Cachaça forte, conversa curta e truco valendo a honra.",
    description: "A mesa aqui não compra pose. Ou você aguenta o calor, ou sai pela porta menor.",
    backgroundAsset: zeCatingaBackgroundAsset,
    hostPortraitAsset: zeCatingaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "bar-maneco-banguela": {
    hostName: "Maneco Banguela",
    hostRole: "Dono do Bar",
    hostQuote: "Aqui sorriso bonito não ganha truco.",
    leadText: "Mesa apertada, fala atravessada e truco ligeiro no balcão.",
    description: "No Maneco, ponto fácil vira história. Piscou, a mão já mudou de dono.",
    backgroundAsset: manecoBanguelaBackgroundAsset,
    hostPortraitAsset: manecoBanguelaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
}

const MATCH_RESULT_ASSET_BY_VENUE_ID: Record<string, { loss?: string; win?: string }> = {
  "bar-do-ze-catinga": {
    loss: zeCatingaMatchResultLossAsset,
    win: zeCatingaMatchResultWinAsset,
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
  handState: HandState | null
  inGameConfirmation: {
    title: string
    message: string
    confirmLabel: string
    warning: string
  } | null
  inGameContextMenuOpen: boolean
  matchState: MatchState | null
  matchResultScreen: MatchResultScreenState | null
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  dealAnimationNonce: number
  gameplayIntroPhase: GameplayIntroPhase
  hasSelectedPartnerForVenue: boolean
  menuScreen:
    | "start"
    | "journey-intro"
    | "player-skin-select"
    | "character-select"
    | "venue-intro"
    | "match-result"
  playerProfile: PlayerProfile
  selectedPlayerSkin: PlayerSkinProfile
  selectedPlayerSkinCandidate: PlayerSkinProfile
  selectedPlayerSkinIndex: number
  selectablePlayerSkins: PlayerSkinProfile[]
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  isSelectedCharacterUnlocked: boolean
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
  onCloseCharacterSelect: () => void
  onCloseJourneyIntro: () => void
  onClosePlayerSkinSelect: () => void
  onContinueToCharacterSelect: () => void
  onConfirmCharacterSelect: () => void
  onConfirmPlayerSkinSelect: () => void
  onEnterVenueFromIntro: () => void
  onLaunchVenue: (venueId: string) => void
  onOpenCharacterSelect: () => void
  onReturnToJourneyFlow: () => void
  onSelectNextCharacter: () => void
  onSelectPreviousCharacter: () => void
  onSelectNextPlayerSkin: () => void
  onSelectPreviousPlayerSkin: () => void
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
  onResetProgressFromContextMenu: () => void
  onRunFromTruco: () => void
  onSwapPartnerFromContextMenu: () => void
  onPlayCard: (card: Card) => void
  styles: StyleMap
}

export function TableSection({
  handState,
  inGameConfirmation,
  inGameContextMenuOpen,
  matchState,
  matchResultScreen,
  currentCampaignVenue,
  currentVenueWins,
  dealAnimationNonce,
  gameplayIntroPhase,
  hasSelectedPartnerForVenue,
  menuScreen,
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
  onCloseCharacterSelect,
  onCloseJourneyIntro,
  onClosePlayerSkinSelect,
  onContinueToCharacterSelect,
  onConfirmCharacterSelect,
  onConfirmPlayerSkinSelect,
  onEnterVenueFromIntro,
  onLaunchVenue,
  onOpenCharacterSelect,
  onReturnToJourneyFlow,
  onSelectNextCharacter,
  onSelectPreviousCharacter,
  onSelectNextPlayerSkin,
  onSelectPreviousPlayerSkin,
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
  onResetProgressFromContextMenu,
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
  const isGameplayIntroActive = gameplayIntroPhase !== "done"
  const gameplayIntroContentStyle =
    gameplayIntroPhase === "background"
      ? styles.gameplayIntroContentBackground
      : gameplayIntroPhase === "reveal"
        ? styles.gameplayIntroContentReveal
        : undefined
  const isVenueIntroMode = isMenuMode && menuScreen === "venue-intro"
  const rosterPlayers = handState?.players ?? [
    { id: 2, hand: [] },
    { id: 3, hand: [] },
    { id: 4, hand: [] },
    { id: 1, hand: [] },
  ]
  const playerAvatarById: Record<number, string> = {
    1: selectedPlayerSkin.avatarAsset,
    2: opponentCharacters[0]?.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    3: selectedPartnerCharacter?.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    4: opponentCharacters[1]?.avatarAsset ?? opponentCharacters[0]?.avatarAsset ?? selectedPlayerSkin.avatarAsset,
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
          <div style={styles.gameViewportStageSlot}>
            <div style={styles.gameViewportFrame}>
              <VenueIntroScreen
                currentCampaignVenue={currentCampaignVenue}
                currentVenueWins={currentVenueWins}
                hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
                opponentCharacters={opponentCharacters}
                playerProfile={playerProfile}
                selectedPlayerSkin={selectedPlayerSkin}
                onOpenCharacterSelect={onOpenCharacterSelect}
                onStart={onEnterVenueFromIntro}
                styles={styles}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section style={styles.tablePanel}>
      <div style={styles.tableHudSurface}>
        <div style={styles.gameViewportStageSlot}>
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
                    playerProfile={playerProfile}
                    onBack={onCloseJourneyIntro}
                    onContinueToCharacterSelect={onContinueToCharacterSelect}
                    onLaunchVenue={onLaunchVenue}
                    styles={styles}
                  />
                ) : menuScreen === "player-skin-select" ? (
                  <PlayerSkinSelectionScreen
                    selectedPlayerSkin={selectedPlayerSkinCandidate}
                    selectedPlayerSkinIndex={selectedPlayerSkinIndex}
                    selectablePlayerSkins={selectablePlayerSkins}
                    onBack={onClosePlayerSkinSelect}
                    onConfirm={onConfirmPlayerSkinSelect}
                    onNext={onSelectNextPlayerSkin}
                    onPrevious={onSelectPreviousPlayerSkin}
                    styles={styles}
                  />
                ) : menuScreen === "character-select" ? (
                  <CharacterSelectionScreen
                    currentCampaignVenue={currentCampaignVenue}
                    selectedCharacter={selectedCharacter}
                    selectedCharacterIndex={selectedCharacterIndex}
                    isSelectedCharacterUnlocked={isSelectedCharacterUnlocked}
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
                    selectedPlayerSkin={selectedPlayerSkin}
                    onOpenCharacterSelect={onOpenCharacterSelect}
                    onStart={onEnterVenueFromIntro}
                    styles={styles}
                  />
                ) : (
                  <GameStartScreen
                    currentCampaignVenue={currentCampaignVenue}
                    onStart={onStart}
                    styles={styles}
                  />
                )
              ) : (
                <>
                <div style={{ ...styles.gameLeftRail, ...gameplayIntroContentStyle }}>
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

                <div style={{ ...styles.gameMainColumn, ...gameplayIntroContentStyle }}>
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
                      onResetProgressFromContextMenu={onResetProgressFromContextMenu}
                      onSwapPartnerFromContextMenu={onSwapPartnerFromContextMenu}
                      gameplayIntroActive={isGameplayIntroActive}
                      styles={styles}
                    />
                  </div>
                </div>

                <div style={{ ...styles.gameSidebarColumn, ...gameplayIntroContentStyle }}>
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
                    {inGameConfirmation.warning}
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
            {handState && isGameplayIntroActive ? (
              <div
                aria-hidden="true"
                style={
                  gameplayIntroPhase === "background"
                    ? styles.gameplayIntroBlockerBackground
                    : styles.gameplayIntroBlockerReveal
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function GameStartScreen({
  currentCampaignVenue,
  onStart,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  onStart: () => void
  styles: StyleMap
}) {
  return (
    <div style={styles.gameStartScreen}>
      <img
        src={startScreenAsset}
        alt=""
        aria-hidden="true"
        style={styles.gameStartBackdrop}
      />
      <img
        src={startScreenAsset}
        alt="Truco Raiz"
        style={styles.gameStartImage}
      />
      <button
        aria-label="Começar"
        title="Começar"
        style={{
          ...styles.gameStartHotspot,
          ...(!currentCampaignVenue ? styles.disabledButton : {}),
        }}
        onClick={onStart}
        disabled={!currentCampaignVenue}
      />
    </div>
  )
}

function JourneyIntroScreen({
  currentCampaignVenue,
  playerProfile,
  onBack,
  onContinueToCharacterSelect,
  onLaunchVenue,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  playerProfile: PlayerProfile
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
  const journeyVenues = CAMPAIGN_STAGES.flatMap((stage) => stage.venues)
  const totalVenueCount = journeyVenues.length
  const clearedVenueCount = journeyVenues.filter((venue) => isCampaignVenueCleared(playerProfile, venue)).length
  const currentVenueRouteIndex = currentCampaignVenue
    ? journeyVenues.findIndex((venue) => venue.id === currentCampaignVenue.id)
    : -1
  const nextVenue = currentVenueRouteIndex >= 0 ? journeyVenues[currentVenueRouteIndex + 1] ?? null : null
  const currentStageVenueCount = currentCampaignVenue && activeStageIndex >= 0
    ? CAMPAIGN_STAGES[activeStageIndex]?.venues.length ?? 0
    : 0
  const authoredCampaign = currentCampaignVenue
    ? authoredCampaignScreens[currentCampaignVenue.id]
    : null

  if (authoredCampaign && currentCampaignVenue) {
    return (
      <div style={styles.authoredCampaignScreen}>
        <img
          src={authoredCampaign.asset}
          alt={authoredCampaign.alt}
          style={styles.authoredCampaignImage}
        />
        <button
          aria-label="Voltar"
          title="Voltar"
          style={{
            ...styles.authoredCampaignHotspot,
            ...authoredCampaign.backHotspot,
          }}
          onClick={onBack}
        />
        <button
          aria-label={`Abrir capa do ${currentCampaignVenue.name}`}
          title={`Abrir capa do ${currentCampaignVenue.name}`}
          style={{
            ...styles.authoredCampaignHotspot,
            ...authoredCampaign.enterHotspot,
          }}
          onClick={() => onLaunchVenue(currentCampaignVenue.id)}
        />
        <button
          aria-label="Trocar parceira"
          title="Trocar parceira"
          style={{
            ...styles.authoredCampaignHotspot,
            ...authoredCampaign.partnerHotspot,
          }}
          onClick={onContinueToCharacterSelect}
        />
      </div>
    )
  }

  return (
    <div style={styles.journeyIntroScreen}>
      <div style={styles.journeyIntroHeader}>
        <div>
          <div style={styles.journeyIntroEyebrow}>Jornada de campanha</div>
          <h2 style={styles.journeyIntroTitle}>Você tem um caminho pela frente</h2>
          <p style={styles.journeyIntroText}>
            Leia o percurso completo, veja o que já ficou para trás e avance pelo bar
            destacado agora. Locais vencidos continuam abertos para revisita.
          </p>
        </div>
        <button style={styles.characterSelectBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div style={styles.journeyIntroLeadCard}>
        <div style={styles.journeyIntroLeadGrid}>
          <div style={styles.journeyIntroLeadPrimary}>
            <div style={styles.journeyIntroLeadLabel}>
              {currentCampaignVenue ? "Você está aqui" : "Jornada concluída"}
            </div>
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
          <div style={styles.journeyIntroProgressPanel}>
            <div style={styles.journeyIntroProgressValue}>
              {clearedVenueCount}/{totalVenueCount}
            </div>
            <div style={styles.journeyIntroProgressLabel}>Bares concluídos</div>
            <div style={styles.journeyIntroProgressText}>
              {currentCampaignVenue
                ? `Local ${activeVenueIndex + 1} de ${currentStageVenueCount} em ${currentCampaignStageLabel(currentCampaignVenue)}.`
                : "Todos os locais da campanha atual já foram vencidos."}
            </div>
            {currentCampaignVenue ? (
              <button
                style={styles.journeyIntroLeadCta}
                onClick={() => onLaunchVenue(currentCampaignVenue.id)}
              >
                ABRIR CAPA DO BAR
              </button>
            ) : null}
          </div>
        </div>
        <div style={styles.journeyIntroRouteRow}>
          <div style={styles.journeyIntroRouteItem}>
            <span style={styles.journeyIntroRouteLabel}>Agora</span>
            <strong style={styles.journeyIntroRouteValue}>
              {currentCampaignVenue?.name ?? "Fluxo completo"}
            </strong>
          </div>
          <div style={styles.journeyIntroRouteDivider} />
          <div style={styles.journeyIntroRouteItem}>
            <span style={styles.journeyIntroRouteLabel}>Depois</span>
            <strong style={styles.journeyIntroRouteValue}>
              {nextVenue?.name ?? "Fim do percurso atual"}
            </strong>
          </div>
          <div style={styles.journeyIntroLegend}>
            <span style={styles.journeyIntroLegendDone}>Concluído</span>
            <span style={styles.journeyIntroLegendCurrent}>Atual</span>
            <span style={styles.journeyIntroLegendLocked}>Bloqueado</span>
          </div>
        </div>
      </div>

      <div style={styles.journeyIntroStages}>
        {CAMPAIGN_STAGES.map((stage, index) => {
          const totalMatches = stage.venues.reduce((sum, venue) => sum + venue.matchesToClear, 0)
          const isCompleted = stage.venues.every((venue) => isCampaignVenueCleared(playerProfile, venue))
          const isActive = hasCurrentVenue && stage.id === activeStageId
          const isLocked = !isActive && !isCompleted
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
                  {stage.venues.map((venue) => {
                    const isCurrentVenue = venue.id === currentCampaignVenue?.id
                    const isClearedVenue = isCampaignVenueCleared(playerProfile, venue)
                    const isAvailable = isCurrentVenue || isClearedVenue
                    const venueStatusLabel = isCurrentVenue
                      ? "Atual"
                      : isClearedVenue
                        ? "Concluído"
                        : "Bloqueado"
                    const venueActionLabel = isCurrentVenue
                      ? "Abrir capa"
                      : isClearedVenue
                        ? "Revisitar"
                        : "Adiante"
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
                        <span style={styles.journeyIntroVenueButtonMetaRow}>
                          <span
                            style={{
                              ...styles.journeyIntroVenueButtonMeta,
                              ...(isCurrentVenue ? styles.journeyIntroVenueButtonMetaActive : {}),
                              ...(isClearedVenue && !isCurrentVenue
                                ? styles.journeyIntroVenueButtonMetaCompleted
                                : {}),
                            }}
                          >
                            {venueStatusLabel}
                          </span>
                          <span style={styles.journeyIntroVenueButtonAction}>{venueActionLabel}</span>
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

const authoredCampaignScreens: Record<
  string,
  {
    asset: string
    alt: string
    backHotspot: React.CSSProperties
    enterHotspot: React.CSSProperties
    partnerHotspot: React.CSSProperties
  }
> = {
  "bar-do-ze-catinga": {
    asset: zeCatingaCampaignJourneyAsset,
    alt: "Jornada de campanha dos Botecos da Rua com Bar do Ze Catinga atual",
    backHotspot: {
      left: "86.2%",
      top: "6.1%",
      width: "9.5%",
      height: "7.9%",
      borderRadius: "999px",
    },
    enterHotspot: {
      left: "14.5%",
      top: "72.2%",
      width: "25.3%",
      height: "11.6%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "39.6%",
      top: "84.1%",
      width: "23.8%",
      height: "8.2%",
      borderRadius: "8px",
    },
  },
  "bar-maneco-banguela": {
    asset: manecoBanguelaCampaignJourneyAsset,
    alt: "Jornada de campanha dos Botecos da Rua com Bar Maneco Banguela atual",
    backHotspot: {
      left: "82.4%",
      top: "2.9%",
      width: "12.1%",
      height: "8.7%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "38.7%",
      top: "70.2%",
      width: "25.1%",
      height: "10.8%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "35.2%",
      top: "85.4%",
      width: "29.4%",
      height: "8.6%",
      borderRadius: "8px",
    },
  },
}

function isCampaignVenueCleared(playerProfile: PlayerProfile, venue: CampaignVenue) {
  return (
    playerProfile.campaign.clearedVenueIds.includes(venue.id) ||
    (playerProfile.campaign.venueWinsById[venue.id] ?? 0) >= venue.matchesToClear
  )
}

function currentCampaignStageLabel(currentCampaignVenue: CampaignVenue) {
  return (
    CAMPAIGN_STAGES.find((stage) => stage.venues.some((venue) => venue.id === currentCampaignVenue.id))
      ?.name ?? "sua etapa atual"
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
  const resultVenueId = result?.venueId ?? currentCampaignVenue?.id
  const resultAsset =
    result?.outcome && resultVenueId
      ? MATCH_RESULT_ASSET_BY_VENUE_ID[resultVenueId]?.[result.outcome] ?? null
      : null

  if (resultAsset) {
    return (
      <div style={styles.matchResultImageScreen}>
        <img
          src={resultAsset}
          alt={result?.title ?? "Vitória na mesa"}
          style={styles.matchResultImage}
        />
        <button
          aria-label="Voltar ao fluxo de bares"
          style={styles.matchResultImageCta}
          onClick={onContinue}
        />
      </div>
    )
  }

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

function PlayerSkinSelectionScreen({
  selectedPlayerSkin,
  selectedPlayerSkinIndex,
  selectablePlayerSkins,
  onBack,
  onConfirm,
  onNext,
  onPrevious,
  styles,
}: {
  selectedPlayerSkin: PlayerSkinProfile
  selectedPlayerSkinIndex: number
  selectablePlayerSkins: PlayerSkinProfile[]
  onBack: () => void
  onConfirm: () => void
  onNext: () => void
  onPrevious: () => void
  styles: StyleMap
}) {
  const totalSkins = selectablePlayerSkins.length
  const currentPosition = selectedPlayerSkinIndex >= 0 ? selectedPlayerSkinIndex + 1 : 1

  return (
    <div style={styles.characterSelectScreen}>
      <div style={styles.characterSelectHeader}>
        <div style={styles.characterSelectEyebrow}>Escolha seu protagonista</div>
        <button style={styles.characterSelectBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div style={styles.characterSelectBoard}>
        <div style={styles.characterSelectLeftColumn}>
          <div style={styles.characterPortraitFrame}>
            <img
              src={selectedPlayerSkin.avatarAsset}
              alt={selectedPlayerSkin.name}
              style={styles.characterPortraitImage}
            />
            <div style={styles.characterPortraitOverlay}>
              <div style={styles.characterPortraitName}>{selectedPlayerSkin.name}</div>
              <div style={styles.characterPortraitNickname}>
                {selectedPlayerSkin.nickname}
              </div>
            </div>
          </div>

          <div style={styles.characterIdentityPanel}>
            <div style={styles.characterNavigator}>
              <button style={styles.characterNavButton} onClick={onPrevious}>
                ←
              </button>
              <div style={styles.characterNavDots}>
                {selectablePlayerSkins.map((skin, index) => {
                  const active = index === selectedPlayerSkinIndex
                  return (
                    <span
                      key={skin.id}
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
              {currentPosition} de {totalSkins}
            </div>
          </div>
        </div>

        <div style={styles.characterSelectRightColumn}>
          <div style={{ ...styles.characterInfoPanel, ...styles.playerSkinInfoPanel }}>
            <div style={styles.playerSkinStoryQuote}>
              “{selectedPlayerSkin.story}”
            </div>

            <div style={styles.playerSkinActionArea}>
              <button
                style={{ ...styles.characterSelectActionButton, ...styles.playerSkinActionButton }}
                onClick={onConfirm}
              >
                Seguir com {selectedPlayerSkin.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CharacterSelectionScreen({
  selectedCharacter,
  selectedCharacterIndex,
  isSelectedCharacterUnlocked,
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
  isSelectedCharacterUnlocked: boolean
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
  const unlockVenue = CAMPAIGN_STAGES.flatMap((stage) => stage.venues).find((venue) =>
    venue.partnerUnlockCharacterIds.includes(selectedCharacter.id)
  )
  const actionLabel = isSelectedPartner
    ? "Parceira atualmente escolhida"
    : `Escolher ${selectedCharacter.name}`
  const unlockStatusText = !isSelectedCharacterUnlocked
    ? unlockVenue
      ? `Vença ${unlockVenue.name} para liberar esta parceria`
      : "Avance na campanha para liberar esta parceria"
    : null

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
              style={{
                ...styles.characterPortraitImage,
                ...(!isSelectedCharacterUnlocked ? styles.characterPortraitImageLocked : {}),
              }}
            />
            {!isSelectedCharacterUnlocked ? (
              <div style={styles.characterPortraitLockedLayer} />
            ) : null}
            <div style={styles.characterPortraitOverlay}>
              <div
                style={{
                  ...styles.characterPortraitName,
                  ...(!isSelectedCharacterUnlocked ? styles.characterPortraitTextLocked : {}),
                }}
              >
                {selectedCharacter.name}
              </div>
              <div
                style={{
                  ...styles.characterPortraitNickname,
                  ...(!isSelectedCharacterUnlocked ? styles.characterPortraitTextLocked : {}),
                }}
              >
                {selectedCharacter.nickname}
              </div>
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
              {unlockStatusText ? (
                <div style={styles.characterUnlockHint}>{unlockStatusText}</div>
              ) : null}
              <button
                style={{
                  ...styles.characterSelectActionButton,
                  ...(!isSelectedCharacterUnlocked ? styles.disabledButton : {}),
                }}
                onClick={onConfirm}
                disabled={!isSelectedCharacterUnlocked}
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
  selectedPlayerSkin,
  onOpenCharacterSelect,
  onStart,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  hasSelectedPartnerForVenue: boolean
  opponentCharacters: TrucoCharacterProfile[]
  playerProfile: PlayerProfile
  selectedPlayerSkin: PlayerSkinProfile
  onOpenCharacterSelect: () => void
  onStart: () => void
  styles: StyleMap
}) {
  const coverConfig = currentCampaignVenue
    ? VENUE_COVER_CONFIG_BY_ID[currentCampaignVenue.id]
    : undefined
  const ctaLabel = hasSelectedPartnerForVenue ? "ENTRAR NO BAR" : "ESCOLHER PARCEIRA"
  const overallMatches = playerProfile.campaign.wins + playerProfile.campaign.losses
  const overallWinRate = overallMatches > 0
    ? Math.round((playerProfile.campaign.wins / overallMatches) * 100)
    : 0
  const challengeDifficulty = currentCampaignVenue?.difficulty.aiLevel ?? 1

  if (!coverConfig) {
    const participants = [
      {
        id: "you",
        role: "Você",
        name: selectedPlayerSkin.name,
        description: selectedPlayerSkin.story,
        avatarAsset: selectedPlayerSkin.avatarAsset,
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
        width: "100%",
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
          gridTemplateColumns: "220px minmax(340px, 386px) minmax(302px, 1fr)",
          gap: 12,
          height: "100%",
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "minmax(190px, 1fr) 128px auto",
            gap: 8,
            alignItems: "end",
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 0,
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
              minHeight: 128,
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
                maxWidth: "66%",
                color: "#efe0be",
                fontFamily: "\"Georgia\", serif",
                fontSize: 13,
                lineHeight: 1.12,
                fontStyle: "italic",
                overflowWrap: "break-word",
                textShadow: "0 2px 14px rgba(0,0,0,0.5)",
                transform: "translateY(4px)",
              }}
            >
              “{coverConfig.hostQuote}”
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "\"Georgia\", serif",
                fontSize: 26,
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
              fontSize: 12,
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
            padding: "10px 16px 12px",
            display: "grid",
            gridTemplateRows: "auto auto auto auto auto",
            alignContent: "start",
            gap: 5,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, rgba(19,11,8,0.92) 0%, rgba(10,6,4,0.94) 100%)",
            border: "1px solid rgba(155, 110, 54, 0.56)",
            boxShadow: "0 16px 28px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(100,65,31,0.28)",
            borderRadius: 22,
          }}
        >
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
                margin: "3px 0 5px",
                fontFamily: "\"Georgia\", serif",
                fontSize: 32,
                lineHeight: 0.98,
                color: "#e0b25d",
                textShadow: "0 2px 16px rgba(0,0,0,0.28)",
              }}
            >
              {currentCampaignVenue?.name ?? "Próximo bar"}
            </h2>
            <div
              style={{
                color: "#f2d9a7",
                fontSize: 13,
                lineHeight: 1.15,
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
              padding: "0 8px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "\"Georgia\", serif",
                fontSize: 15,
                lineHeight: 1.08,
                color: "#f0d7a0",
              }}
            >
              {coverConfig.leadText}
            </p>
            <p
              style={{
                margin: "5px 0 0",
                fontFamily: "\"Georgia\", serif",
                fontSize: 13,
                lineHeight: 1.08,
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
              gap: 5,
              alignContent: "start",
              minHeight: 132,
            }}
          >
            <div
              style={{
                color: "#d6aa57",
                letterSpacing: "0.18em",
                fontSize: 10,
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
                gap: 10,
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
                      maxWidth: 86,
                      aspectRatio: "0.84",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "2px solid rgba(173, 123, 55, 0.78)",
                      boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
                      background: "linear-gradient(180deg, rgba(100,72,43,0.26) 0%, rgba(34,21,12,0.46) 100%)",
                    }}
                  >
                    <img
                      src={character.avatarAsset ?? selectedPlayerSkin.avatarAsset}
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
                      fontSize: 12,
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
              minHeight: 92,
            }}
          >
            <div
              style={{
                color: "#c69643",
                letterSpacing: "0.18em",
                fontSize: 12,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Dificuldade do desafio
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <img
                  key={`difficulty-${index}`}
                  src={coverConfig.difficultyBottleAsset}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: 32,
                    height: 52,
                    objectFit: "contain",
                    mixBlendMode: "screen",
                    opacity: index < challengeDifficulty ? 0.98 : 0.3,
                    filter: index < challengeDifficulty
                      ? "drop-shadow(0 6px 14px rgba(237,178,72,0.34))"
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
            gridTemplateRows: "auto 100px",
            alignContent: "center",
            justifyItems: "center",
            gap: 14,
            height: "100%",
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(96%, 302px)",
              aspectRatio: "1 / 1.08",
              color: "#2b1608",
              filter: "drop-shadow(0 20px 28px rgba(0,0,0,0.32))",
              minWidth: 0,
            }}
          >
            <img
              src={coverConfig.statsPlaqueAsset}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "fill",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "12%",
                right: "12%",
                textAlign: "center",
                fontFamily: "\"Georgia\", serif",
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 0.95,
                color: "#2a1307",
                whiteSpace: "nowrap",
                textShadow: "0 1px 0 rgba(248,218,151,0.32)",
              }}
            >
              Seu histórico aqui
            </div>

            <div
              style={{
                position: "absolute",
                top: "28%",
                left: "14%",
                right: "14%",
                bottom: "18%",
                display: "grid",
                gridTemplateRows: "repeat(3, minmax(0, 1fr))",
                gap: 3,
              }}
            >
              {[
                {
                  label: "VITÓRIAS",
                  value: String(playerProfile.campaign.wins),
                  accent: "#75480f",
                },
                {
                  label: "DERROTAS",
                  value: String(playerProfile.campaign.losses),
                  accent: "#762218",
                },
                {
                  label: "APROVEITAMENTO",
                  value: `${overallWinRate}%`,
                  accent: "#704611",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(48px, auto)",
                    alignItems: "center",
                    gap: 10,
                    minHeight: 0,
                    padding: "0 12px",
                    borderBottom: item.label === "APROVEITAMENTO"
                      ? "none"
                      : "1px solid rgba(83, 45, 15, 0.22)",
                  }}
                >
                  <div
                    style={{
                      fontSize: item.label === "APROVEITAMENTO" ? 11 : 16,
                      fontWeight: 700,
                      fontFamily: "\"Georgia\", serif",
                      lineHeight: 1,
                      letterSpacing: item.label === "APROVEITAMENTO" ? 0 : "0.02em",
                      color: "#2a1307",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      textShadow: "0 1px 0 rgba(251,225,169,0.32)",
                    }}
                    >
                    {item.label}
                  </div>
                  <div
                    style={{
                      minWidth: 0,
                      textAlign: "right",
                      fontSize: item.value.length >= 3 ? 26 : 34,
                      fontWeight: 700,
                      lineHeight: 0.95,
                      color: item.accent,
                      fontFamily: "\"Georgia\", serif",
                      textShadow: "0 1px 0 rgba(251,225,169,0.25)",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                position: "absolute",
                left: "13%",
                right: "13%",
                bottom: "7.6%",
                fontSize: 12,
                lineHeight: 1,
                color: "rgba(47, 24, 9, 0.72)",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              Neste bar: {currentVenueWins}/{currentCampaignVenue?.matchesToClear ?? 0} vitórias
            </div>
          </div>

          <button
            onClick={onStart}
            style={{
              position: "relative",
              width: "min(96%, 302px)",
              minHeight: 100,
              padding: "10px 12px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#f3d08a",
              fontFamily: "\"Georgia\", serif",
              fontWeight: 700,
              fontSize: 15,
              lineHeight: 0.98,
              letterSpacing: "0.03em",
              textShadow: "0 3px 10px rgba(0,0,0,0.4)",
              alignSelf: "start",
              display: "grid",
              placeItems: "center",
              boxSizing: "border-box",
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
                width: 132,
                maxWidth: "58%",
                textAlign: "center",
                whiteSpace: "normal",
                overflowWrap: "break-word",
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
  gameplayIntroActive,
  onCloseInGameContextMenu,
  onExitMatchFromContextMenu,
  onOpenInGameContextMenu,
  onPlayCard,
  onResetProgressFromContextMenu,
  onSwapPartnerFromContextMenu,
  styles,
}: {
  handState: HandState | null
  inGameContextMenuOpen: boolean
  player1: Player | null
  canPlayHumanCard: boolean
  gameplayIntroActive: boolean
  onCloseInGameContextMenu: () => void
  onExitMatchFromContextMenu: () => void
  onOpenInGameContextMenu: () => void
  onPlayCard: (card: Card) => void
  onResetProgressFromContextMenu: () => void
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
              disabled={gameplayIntroActive}
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
                  style={styles.inGameContextMenuAction}
                  onClick={onResetProgressFromContextMenu}
                >
                  Resetar progresso
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
