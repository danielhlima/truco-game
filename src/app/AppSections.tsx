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
import avatarOpponentLeftAsset from "../assets/ui-left/avatar-opponent-left.png"
import avatarOpponentRightAsset from "../assets/ui-left/avatar-opponent-right.png"
import avatarPartnerAsset from "../assets/ui-left/avatar-partner.png"
import scorePadNotebookAsset from "../assets/ui-left/scorepad-notebook-clean-cut.png"
import avatarYouAsset from "../assets/ui-left/avatar-you.png"
import actionButtonAsset from "../assets/ui-right/action-button-solid.png"
import statsPanelWoodAsset from "../assets/ui-right/stats-panel-wood-main.png"
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
  getStartMatchButtonLabel,
  getStateLabel,
  getSuitColor,
  getSuitSymbol,
  getPlayerLabel,
  type SpeechBubbleState,
} from "./gameSessionHelpers"

type StyleMap = Record<string, React.CSSProperties>

const PLAYER_AVATAR_BY_ID: Record<number, string> = {
  1: avatarYouAsset,
  2: avatarOpponentLeftAsset,
  3: avatarPartnerAsset,
  4: avatarOpponentRightAsset,
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
  campaignCompleted,
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
          {getStartMatchButtonLabel(currentCampaignVenue, campaignCompleted)}
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
              mundial, com pós-campanha intergaláctica.
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
  matchState: MatchState | null
  currentCampaignVenue: CampaignVenue | null
  debugModeEnabled: boolean
  debugVenueId: string
  debugVenueOptions: Array<{ id: string; label: string }>
  dealAnimationNonce: number
  menuScreen: "start" | "character-select"
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  selectableCharacters: TrucoCharacterProfile[]
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
  onOpenCharacterSelect: () => void
  onResetCampaign: () => void
  onSelectNextCharacter: () => void
  onSelectPreviousCharacter: () => void
  onStart: () => void
  onRequestTruco: () => void
  onAcceptTruco: () => void
  onAdvisePartner: (advice: PartnerAdvice) => void
  onRaiseTruco: () => void
  onRunFromTruco: () => void
  onPlayCard: (card: Card) => void
  styles: StyleMap
}

export function TableSection({
  activeVariant,
  campaignCompleted,
  handState,
  matchState,
  currentCampaignVenue,
  debugModeEnabled,
  debugVenueId,
  debugVenueOptions,
  dealAnimationNonce,
  menuScreen,
  selectedCharacter,
  selectedCharacterIndex,
  selectableCharacters,
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
  onOpenCharacterSelect,
  onResetCampaign,
  onSelectNextCharacter,
  onSelectPreviousCharacter,
  onStart,
  onRequestTruco,
  onAcceptTruco,
  onAdvisePartner,
  onRaiseTruco,
  onRunFromTruco,
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
  const rosterPlayers = handState?.players ?? [
    { id: 2, hand: [] },
    { id: 3, hand: [] },
    { id: 4, hand: [] },
    { id: 1, hand: [] },
  ]

  return (
    <section style={styles.tablePanel}>
      <div style={styles.tableHudSurface}>
        <div style={styles.gameViewportFrame}>
          <div style={styles.gameViewport}>
            {isMenuMode ? (
              menuScreen === "character-select" ? (
                <CharacterSelectionScreen
                  currentCampaignVenue={currentCampaignVenue}
                  selectedCharacter={selectedCharacter}
                  selectedCharacterIndex={selectedCharacterIndex}
                  selectableCharacters={selectableCharacters}
                  onBack={onCloseCharacterSelect}
                  onNext={onSelectNextCharacter}
                  onPrevious={onSelectPreviousCharacter}
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
                  onOpenCharacterSelect={onOpenCharacterSelect}
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
                              src={PLAYER_AVATAR_BY_ID[player.id]}
                              alt={getPlayerLabel(player.id)}
                              style={styles.rosterAvatarImage}
                            />
                          </div>
                          <div style={styles.rosterName}>{getPlayerLabel(player.id)}</div>
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
                      player1={player1}
                      canPlayHumanCard={canPlayHumanCard}
                      onPlayCard={onPlayCard}
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
        </div>
      </div>
    </section>
  )
}

function GameStartScreen({
  activeVariant,
  campaignCompleted,
  currentCampaignVenue,
  debugModeEnabled,
  debugVenueId,
  debugVenueOptions,
  onChangeVariant,
  onChangeDebugVenue,
  onOpenCharacterSelect,
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
  onOpenCharacterSelect: () => void
  onResetCampaign: () => void
  onStart: () => void
  styles: StyleMap
  variantSelectionDisabled: boolean
}) {
  return (
    <div style={styles.gameStartScreen}>
      <button style={styles.gameStartTopActionButton} onClick={onOpenCharacterSelect}>
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
          {getStartMatchButtonLabel(currentCampaignVenue, campaignCompleted)}
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
          {getStartMatchButtonLabel(currentCampaignVenue, campaignCompleted)}
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

function CharacterSelectionScreen({
  currentCampaignVenue: _currentCampaignVenue,
  selectedCharacter,
  selectedCharacterIndex,
  selectableCharacters,
  onBack,
  onNext,
  onPrevious,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  selectableCharacters: TrucoCharacterProfile[]
  onBack: () => void
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
                style={{
                  ...styles.characterSelectActionButton,
                  ...styles.disabledButton,
                }}
                disabled
              >
                Jogar com este parceiro
              </button>
            </div>
          </div>
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
  player1,
  canPlayHumanCard,
  onPlayCard,
  styles,
}: {
  handState: HandState | null
  player1: Player | null
  canPlayHumanCard: boolean
  onPlayCard: (card: Card) => void
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
