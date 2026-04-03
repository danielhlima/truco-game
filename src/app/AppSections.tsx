import type React from "react"
import type { CampaignStage, CampaignVenue } from "../career/campaign/types"
import type { Card } from "../game/card"
import type { HandState } from "../game/handState"
import type { Player } from "../game/gameState"
import type { GameVariant } from "../game/variant"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import { STORE_PRODUCTS, UNLOCKABLE_ITEMS } from "../economy/catalog"
import type { PlayerProfile } from "../profile/playerProfile"
import {
  canHumanRaiseInResponse,
  formatCard,
  getBetBadgeLabel,
  getCampaignTierLabel,
  getManilhaLabel,
  getNextStepButtonLabel,
  getPendingBetText,
  getRaiseResponseButtonLabel,
  getRequestBetButtonLabel,
  getStartMatchButtonLabel,
  getStateLabel,
  getSuitSymbol,
  getTrucoAwaitingLabel,
  getTrucoProposedBetLabel,
  getTrucoRequestedByLabel,
  getTrucoStatusLabel,
  getWinnerLabel,
} from "./gameSessionHelpers"

type StyleMap = Record<string, React.CSSProperties>

interface ControlsPanelProps {
  activeVariant: GameVariant
  campaignCompleted: boolean
  nextStepDisabled: boolean
  handState: HandState | null
  matchFinished: boolean
  variantSelectionDisabled: boolean
  currentCampaignVenue: CampaignVenue | null
  onChangeVariant: (variant: GameVariant) => void
  onStart: () => void
  onNextStep: () => void
  styles: StyleMap
}

export function ControlsPanel({
  activeVariant,
  campaignCompleted,
  nextStepDisabled,
  handState,
  matchFinished,
  variantSelectionDisabled,
  currentCampaignVenue,
  onChangeVariant,
  onStart,
  onNextStep,
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

        <button
          style={{
            ...styles.secondaryButton,
            ...(nextStepDisabled ? styles.disabledButton : {}),
          }}
          onClick={onNextStep}
          disabled={nextStepDisabled}
        >
          {getNextStepButtonLabel(handState, matchFinished)}
        </button>
      </div>

      <div style={styles.helpBox}>
        <div style={styles.helpTitle}>Como jogar agora</div>
        <p style={styles.helpText}>
          1. Inicie a partida do local atual.
          <br />
          2. Quando for sua vez, clique em uma carta.
          <br />
          3. Para pedir o próximo lance, use o botão na área de ações.
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
          label="Rodada"
          value={handState ? String(handState.roundNumber) : "—"}
          styles={styles}
        />
        <InfoBox label="Mão" value={String(matchHandNumber)} styles={styles} />
        <InfoBox label="Placar partida" value={matchScoreLabel} styles={styles} />
        <InfoBox label="Vazas" value={handScoreLabel} styles={styles} />
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
  handState: HandState | null
  matchState: { handNumber: number; finished: boolean; winner?: "A" | "B" } | null
  tableByPlayer: Record<number, Card | undefined>
  lastPlayedPlayerId: number | null
  player1: Player | null
  player2: Player | null
  player3: Player | null
  player4: Player | null
  canRequestTruco: boolean
  canHumanRespondToTruco: boolean
  canPlayHumanCard: boolean
  trucoMessage: string
  onRequestTruco: () => void
  onAcceptTruco: () => void
  onRaiseTruco: () => void
  onRunFromTruco: () => void
  onPlayCard: (card: Card) => void
  styles: StyleMap
}

export function TableSection({
  handState,
  matchState,
  tableByPlayer,
  lastPlayedPlayerId,
  player1,
  player2,
  player3,
  player4,
  canRequestTruco,
  canHumanRespondToTruco,
  canPlayHumanCard,
  trucoMessage,
  onRequestTruco,
  onAcceptTruco,
  onRaiseTruco,
  onRunFromTruco,
  onPlayCard,
  styles,
}: TableSectionProps) {
  return (
    <section style={styles.tablePanel}>
      <div style={styles.tablePanelHeader}>
        <div>
          <div style={styles.tableTitle}>Mesa</div>
          <div style={styles.tableSubtitle}>
            Visão de cima · cartas da vaza atual no centro
          </div>
        </div>

        <div style={styles.roundPill}>
          {handState?.finished
            ? matchState?.finished && matchState.winner
              ? `Partida encerrada · ${getWinnerLabel(matchState.winner)}`
              : `Mão encerrada · ${getWinnerLabel(handState.winner)}`
            : handState
            ? `Mão ${matchState?.handNumber ?? 1} · Rodada ${handState.roundNumber}`
            : "Aguardando início"}
        </div>
      </div>

      <div style={styles.board}>
        <div style={styles.topSeat}>
          <PlayerSeat
            name="Parceira (Jogador 3)"
            detail={`Cartas: ${player3?.hand.length ?? 0}`}
            active={handState?.currentPlayerId === 3}
            team="Nós"
            styles={styles}
          />
        </div>

        <div style={styles.middleSeatsRow}>
          <div style={styles.sideSeat}>
            <PlayerSeat
              name="Adversário Esq. (Jogador 2)"
              detail={`Cartas: ${player2?.hand.length ?? 0}`}
              active={handState?.currentPlayerId === 2}
              team="Eles"
              styles={styles}
            />
          </div>

          <div style={styles.tableSurface}>
            <div style={styles.tableCenterArea}>
              <TableCardSlot
                label="Topo"
                playerId={3}
                card={tableByPlayer[3]}
                highlight={lastPlayedPlayerId === 3}
                styles={styles}
              />

              <div style={styles.tableMiddleRow}>
                <TableCardSlot
                  label="Esquerda"
                  playerId={2}
                  card={tableByPlayer[2]}
                  highlight={lastPlayedPlayerId === 2}
                  styles={styles}
                />

                <div style={styles.tableCenterBadge}>
                  <div style={styles.tableCenterBadgeTop}>TRUCO</div>
                  <div style={styles.tableCenterBadgeBottom}>
                    {handState ? getBetBadgeLabel(handState.currentBet) : getBetBadgeLabel(1)}
                  </div>
                </div>

                <TableCardSlot
                  label="Direita"
                  playerId={4}
                  card={tableByPlayer[4]}
                  highlight={lastPlayedPlayerId === 4}
                  styles={styles}
                />
              </div>

              <TableCardSlot
                label="Baixo"
                playerId={1}
                card={tableByPlayer[1]}
                highlight={lastPlayedPlayerId === 1}
                styles={styles}
              />
            </div>
          </div>

          <div style={styles.sideSeat}>
            <PlayerSeat
              name="Adversário Dir. (Jogador 4)"
              detail={`Cartas: ${player4?.hand.length ?? 0}`}
              active={handState?.currentPlayerId === 4}
              team="Eles"
              styles={styles}
            />
          </div>
        </div>

        <div style={styles.bottomSeatBlock}>
          <PlayerSeat
            name="Você (Jogador 1)"
            detail={`Cartas: ${player1?.hand.length ?? 0}`}
            active={handState?.currentPlayerId === 1}
            team="Nós"
            isHuman
            styles={styles}
          />

          <div style={styles.actionArea}>
            <div style={styles.actionAreaHeader}>
              <div>
                <div style={styles.actionAreaTitle}>Ações da mão</div>
                <div style={styles.actionAreaSubtitle}>
                  Truco integrado para pedido da IA e resposta humana
                </div>
              </div>

              <div style={styles.betBadge}>
                {handState ? getBetBadgeLabel(handState.currentBet) : getBetBadgeLabel(1)}
              </div>
            </div>

            <TrucoPanel
              handState={handState}
              trucoMessage={trucoMessage}
              canRequestTruco={canRequestTruco}
              canHumanRespondToTruco={canHumanRespondToTruco}
              onRequestTruco={onRequestTruco}
              onAcceptTruco={onAcceptTruco}
              onRaiseTruco={onRaiseTruco}
              onRunFromTruco={onRunFromTruco}
              styles={styles}
            />

            <HandPanel
              handState={handState}
              matchState={matchState}
              player1={player1}
              canHumanRespondToTruco={canHumanRespondToTruco}
              canPlayHumanCard={canPlayHumanCard}
              onPlayCard={onPlayCard}
              styles={styles}
            />
          </div>
        </div>
      </div>
    </section>
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

function TrucoPanel({
  handState,
  trucoMessage,
  canRequestTruco,
  canHumanRespondToTruco,
  onRequestTruco,
  onAcceptTruco,
  onRaiseTruco,
  onRunFromTruco,
  styles,
}: {
  handState: HandState | null
  trucoMessage: string
  canRequestTruco: boolean
  canHumanRespondToTruco: boolean
  onRequestTruco: () => void
  onAcceptTruco: () => void
  onRaiseTruco: () => void
  onRunFromTruco: () => void
  styles: StyleMap
}) {
  return (
    <div style={styles.trucoPanel}>
      <div style={styles.trucoPanelHeader}>
        <div style={styles.trucoPanelTitle}>Truco</div>
        <div style={styles.trucoPanelStatus}>{getTrucoStatusLabel(handState)}</div>
      </div>

      <div style={styles.trucoPanelBody}>
        <div style={styles.trucoMessageBox}>
          <div style={styles.trucoMessageLabel}>Estado atual</div>
          <div style={styles.trucoMessageText}>{trucoMessage}</div>
        </div>

        <div style={styles.trucoDetailsGrid}>
          <div style={styles.trucoDetailCard}>
            <div style={styles.trucoDetailLabel}>Pediu</div>
            <div style={styles.trucoDetailValue}>
              {getTrucoRequestedByLabel(handState)}
            </div>
          </div>

          <div style={styles.trucoDetailCard}>
            <div style={styles.trucoDetailLabel}>Aguardando</div>
            <div style={styles.trucoDetailValue}>
              {getTrucoAwaitingLabel(handState)}
            </div>
          </div>

          <div style={styles.trucoDetailCard}>
            <div style={styles.trucoDetailLabel}>Próximo valor</div>
            <div style={styles.trucoDetailValue}>
              {getTrucoProposedBetLabel(handState)}
            </div>
          </div>
        </div>

        <div style={styles.trucoActionsRow}>
          <button
            style={{
              ...styles.trucoPrimaryButton,
              ...(!canRequestTruco ? styles.disabledButton : {}),
            }}
            onClick={onRequestTruco}
            disabled={!canRequestTruco}
          >
            {getRequestBetButtonLabel(handState)}
          </button>

          <button
            style={{
              ...styles.trucoSecondaryButton,
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
              ...(!canHumanRespondToTruco || !canHumanRaiseInResponse(handState)
                ? styles.disabledButton
                : {}),
            }}
            onClick={onRaiseTruco}
            disabled={!canHumanRespondToTruco || !canHumanRaiseInResponse(handState)}
          >
            {getRaiseResponseButtonLabel(handState)}
          </button>

          <button
            style={{
              ...styles.trucoSecondaryButton,
              ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
            }}
            onClick={onRunFromTruco}
            disabled={!canHumanRespondToTruco}
          >
            Correr
          </button>
        </div>

        <div style={styles.trucoHintBox}>
          Agora a IA pode pedir truco. Quando isso acontecer, responda por aqui.
        </div>
      </div>
    </div>
  )
}

function HandPanel({
  handState,
  matchState,
  player1,
  canHumanRespondToTruco,
  canPlayHumanCard,
  onPlayCard,
  styles,
}: {
  handState: HandState | null
  matchState: { finished: boolean } | null
  player1: Player | null
  canHumanRespondToTruco: boolean
  canPlayHumanCard: boolean
  onPlayCard: (card: Card) => void
  styles: StyleMap
}) {
  return (
    <div style={styles.handPanel}>
      <div style={styles.handTitle}>Sua mão</div>

      {!player1 || player1.hand.length === 0 ? (
        <div style={styles.emptyHandBox}>Você não tem mais cartas.</div>
      ) : (
        <div style={styles.handRow}>
          {player1.hand.map((card, index) => (
            <button
              key={`${card.rank}-${card.suit}-${index}`}
              style={{
                ...styles.cardButton,
                ...(canPlayHumanCard
                  ? styles.cardButtonActive
                  : styles.cardButtonDisabled),
              }}
              onClick={() => onPlayCard(card)}
              disabled={!canPlayHumanCard}
              title={formatCard(card)}
            >
              <div style={styles.cardCornerTop}>
                <div style={styles.cardRank}>{card.rank}</div>
                <div style={styles.cardSuit}>{getSuitSymbol(card.suit)}</div>
              </div>

              <div style={styles.cardCenterSuit}>{getSuitSymbol(card.suit)}</div>

              <div style={styles.cardCornerBottom}>
                <div style={styles.cardRank}>{card.rank}</div>
                <div style={styles.cardSuit}>{getSuitSymbol(card.suit)}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div style={styles.actionHintBox}>
        {handState && handState.finished && matchState?.finished ? (
          <span>
            A partida terminou. Clique em <strong>Iniciar partida</strong> para jogar novamente.
          </span>
        ) : handState && handState.finished ? (
          <span>
            A mão terminou. Clique em{" "}
            <strong>{getNextStepButtonLabel(handState, !!matchState?.finished)}</strong>{" "}
            para seguir.
          </span>
        ) : handState && canHumanRespondToTruco ? (
          <span>
            O time adversário pediu {getPendingBetText(handState)}. Escolha entre{" "}
            <strong>Aceitar</strong> ou <strong>Correr</strong>.
          </span>
        ) : handState && handState.truco.phase === "awaiting-response" ? (
          <span>
            O pedido de {getPendingBetText(handState)} está aguardando resposta da IA.
            Clique em <strong>{getNextStepButtonLabel(handState)}</strong>.
          </span>
        ) : handState && !handState.finished && handState.table.length === 4 ? (
          <span>
            A vaza está completa. Clique em <strong>{getNextStepButtonLabel(handState)}</strong>.
          </span>
        ) : handState && handState.currentPlayerId !== 1 && !handState.finished ? (
          <span>
            Agora é a vez da IA. Clique em <strong>{getNextStepButtonLabel(handState)}</strong>.
          </span>
        ) : handState && handState.currentPlayerId === 1 && !handState.finished ? (
          <span>É sua vez. Escolha uma carta ou peça o próximo lance.</span>
        ) : (
          <span>Inicie uma partida para começar.</span>
        )}
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

function PlayerSeat({
  name,
  detail,
  team,
  active,
  isHuman,
  styles,
}: {
  name: string
  detail: string
  team: "Nós" | "Eles"
  active?: boolean
  isHuman?: boolean
  styles: StyleMap
}) {
  return (
    <div
      style={{
        ...styles.playerSeat,
        ...(active ? styles.playerSeatActive : {}),
        ...(isHuman ? styles.playerSeatHuman : {}),
      }}
    >
      <div style={styles.playerSeatTopRow}>
        <div style={styles.playerSeatName}>{name}</div>
        <div
          style={{
            ...styles.teamBadge,
            ...(team === "Nós" ? styles.teamBadgeUs : styles.teamBadgeThem),
          }}
        >
          {team}
        </div>
      </div>

      <div style={styles.playerSeatDetail}>{detail}</div>

      {active ? <div style={styles.turnIndicator}>É a vez deste jogador</div> : null}
    </div>
  )
}

function TableCardSlot({
  label,
  playerId,
  card,
  highlight,
  styles,
}: {
  label: string
  playerId: number
  card?: Card
  highlight?: boolean
  styles: StyleMap
}) {
  return (
    <div
      style={{
        ...styles.tableCardSlot,
        ...(highlight ? styles.tableCardSlotHighlight : {}),
      }}
    >
      <div style={styles.tableCardSlotHeader}>
        {label} · J{playerId}
      </div>

      {card ? (
        <div style={styles.tableCardFace}>
          <div style={styles.tableCardRank}>{card.rank}</div>
          <div style={styles.tableCardSuit}>{getSuitSymbol(card.suit)}</div>
          <div style={styles.tableCardText}>{card.suit}</div>
        </div>
      ) : (
        <div style={styles.tableCardEmpty}>Aguardando carta</div>
      )}
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
