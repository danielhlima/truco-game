import { useMemo, useState } from "react"
import type { Card } from "./game/card"
import { createHandState } from "./game/createHandState"
import type { HandState } from "./game/handState"
import { playHumanCard } from "./game/playHumanCard"
import { requestTruco } from "./game/requestTruco"
import { respondToTruco } from "./game/respondToTruco"
import { stepHand } from "./game/stepHand"
import { getBetCallLabel, getBetLabel, getNextBet } from "./game/truco"
import type { GameVariant } from "./game/variant"
import { clearLogs, getLogsAsText, initLogger } from "./utils/logger"

initLogger()

function App() {
  const [variant, setVariant] = useState<GameVariant>("MINEIRO")
  const [handState, setHandState] = useState<HandState | null>(null)
  const [logs, setLogs] = useState("")
  const [eventMessage, setEventMessage] = useState("")
  const [trucoMessage, setTrucoMessage] = useState("Nenhum pedido de truco nesta mão.")

  const player1 = useMemo(
    () => handState?.players.find((p) => p.id === 1) ?? null,
    [handState]
  )
  const player2 = useMemo(
    () => handState?.players.find((p) => p.id === 2) ?? null,
    [handState]
  )
  const player3 = useMemo(
    () => handState?.players.find((p) => p.id === 3) ?? null,
    [handState]
  )
  const player4 = useMemo(
    () => handState?.players.find((p) => p.id === 4) ?? null,
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

  const nextStepDisabled =
    !handState ||
    handState.finished ||
    canHumanRespondToTruco ||
    (handState.currentPlayerId === 1 &&
      handState.table.length < 4 &&
      handState.truco.phase === "idle")

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

    syncLogs()
  }

  function handleStartHand() {
    clearLogs()

    const state = createHandState(variant, 1)
    applyHandState(state, {
      eventMessage: "Nova mão iniciada.",
      trucoMessage: "Nenhum pedido de truco nesta mão.",
    })
  }

  function handleNextStep() {
    if (!handState) return

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

  const statusMessage = getStatusMessage(handState)
  const currentTurnLabel = getCurrentTurnLabel(handState)
  const scoreLabel = handState
    ? `Nós ${handState.score.A} x ${handState.score.B} Eles`
    : "Nós 0 x 0 Eles"

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
          <div style={styles.panelCard}>
            <div style={styles.panelTitle}>Controles</div>

            <div style={styles.controlRow}>
              <label htmlFor="variant" style={styles.label}>
                Variante
              </label>

              <select
                id="variant"
                value={variant}
                onChange={(e) => setVariant(e.target.value as GameVariant)}
                style={styles.select}
              >
                <option value="MINEIRO">Truco Mineiro</option>
                <option value="PAULISTA">Truco Paulista</option>
              </select>
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.primaryButton} onClick={handleStartHand}>
                Iniciar mão
              </button>

              <button
                style={{
                  ...styles.secondaryButton,
                  ...(nextStepDisabled ? styles.disabledButton : {}),
                }}
                onClick={handleNextStep}
                disabled={nextStepDisabled}
              >
                {getNextStepButtonLabel(handState)}
              </button>
            </div>

            <div style={styles.helpBox}>
              <div style={styles.helpTitle}>Como jogar agora</div>
              <p style={styles.helpText}>
                1. Inicie a mão.
                <br />
                2. Quando for sua vez, clique em uma carta.
                <br />
                3. Para pedir o próximo lance, use o botão na área de ações.
                <br />
                4. Se a IA pedir truco, seis, nove ou doze, responda com <strong>Aceitar</strong> ou <strong>Correr</strong>.
              </p>
            </div>
          </div>

          <div style={styles.panelCard}>
            <div style={styles.panelTitle}>Status da mão</div>

            <div style={styles.infoGrid}>
              <InfoBox label="Variante" value={handState?.variant ?? variant} />
              <InfoBox
                label="Vira"
                value={handState?.vira ? formatCard(handState.vira) : "—"}
              />
              <InfoBox label="Manilha" value={getManilhaLabel(handState)} />
              <InfoBox
                label="Rodada"
                value={handState ? String(handState.roundNumber) : "—"}
              />
              <InfoBox label="Placar" value={scoreLabel} />
              <InfoBox label="Vez" value={currentTurnLabel} />
              <InfoBox
                label="Valendo"
                value={handState ? getBetBadgeLabel(handState.currentBet) : getBetBadgeLabel(1)}
              />
              <InfoBox
                label="Estado"
                value={getStateLabel(handState)}
              />
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
              <div style={styles.eventBannerText}>
                {eventMessage || "Nenhum evento ainda."}
              </div>
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
        </section>

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
                ? `Mão encerrada · ${getWinnerLabel(handState.winner)}`
                : handState
                ? `Rodada ${handState.roundNumber}`
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
              />
            </div>

            <div style={styles.middleSeatsRow}>
              <div style={styles.sideSeat}>
                <PlayerSeat
                  name="Adversário Esq. (Jogador 2)"
                  detail={`Cartas: ${player2?.hand.length ?? 0}`}
                  active={handState?.currentPlayerId === 2}
                  team="Eles"
                />
              </div>

              <div style={styles.tableSurface}>
                <div style={styles.tableCenterArea}>
                  <TableCardSlot
                    label="Topo"
                    playerId={3}
                    card={tableByPlayer[3]}
                    highlight={lastPlayedPlayerId === 3}
                  />

                  <div style={styles.tableMiddleRow}>
                    <TableCardSlot
                      label="Esquerda"
                      playerId={2}
                      card={tableByPlayer[2]}
                      highlight={lastPlayedPlayerId === 2}
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
                    />
                  </div>

                  <TableCardSlot
                    label="Baixo"
                    playerId={1}
                    card={tableByPlayer[1]}
                    highlight={lastPlayedPlayerId === 1}
                  />
                </div>
              </div>

              <div style={styles.sideSeat}>
                <PlayerSeat
                  name="Adversário Dir. (Jogador 4)"
                  detail={`Cartas: ${player4?.hand.length ?? 0}`}
                  active={handState?.currentPlayerId === 4}
                  team="Eles"
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

                <div style={styles.trucoPanel}>
                  <div style={styles.trucoPanelHeader}>
                    <div style={styles.trucoPanelTitle}>Truco</div>
                    <div style={styles.trucoPanelStatus}>
                      {getTrucoStatusLabel(handState)}
                    </div>
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
                        onClick={handleRequestTruco}
                        disabled={!canRequestTruco}
                      >
                        {getRequestBetButtonLabel(handState)}
                      </button>

                      <button
                        style={{
                          ...styles.trucoSecondaryButton,
                          ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
                        }}
                        onClick={handleAcceptTruco}
                        disabled={!canHumanRespondToTruco}
                      >
                        Aceitar
                      </button>

                      <button
                        style={{
                          ...styles.trucoSecondaryButton,
                          ...(!canHumanRespondToTruco || !canHumanRaiseInResponse(handState) ? styles.disabledButton : {}),
                        }}
                        onClick={handleRaiseTruco}
                        disabled={!canHumanRespondToTruco || !canHumanRaiseInResponse(handState)}
                      >
                        {getRaiseResponseButtonLabel(handState)}
                      </button>

                      <button
                        style={{
                          ...styles.trucoSecondaryButton,
                          ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
                        }}
                        onClick={handleRunFromTruco}
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

                <div style={styles.handPanel}>
                  <div style={styles.handTitle}>Sua mão</div>

                  {!player1 || player1.hand.length === 0 ? (
                    <div style={styles.emptyHandBox}>Você não tem mais cartas.</div>
                  ) : (
                    <div style={styles.handRow}>
                      {player1.hand.map((card, index) => {
                        return (
                          <button
                            key={`${card.rank}-${card.suit}-${index}`}
                            style={{
                              ...styles.cardButton,
                              ...(canPlayHumanCard
                                ? styles.cardButtonActive
                                : styles.cardButtonDisabled),
                            }}
                            onClick={() => handlePlayCard(card)}
                            disabled={!canPlayHumanCard}
                            title={formatCard(card)}
                          >
                            <div style={styles.cardCornerTop}>
                              <div style={styles.cardRank}>{card.rank}</div>
                              <div style={styles.cardSuit}>{getSuitSymbol(card.suit)}</div>
                            </div>

                            <div style={styles.cardCenterSuit}>
                              {getSuitSymbol(card.suit)}
                            </div>

                            <div style={styles.cardCornerBottom}>
                              <div style={styles.cardRank}>{card.rank}</div>
                              <div style={styles.cardSuit}>{getSuitSymbol(card.suit)}</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <div style={styles.actionHintBox}>
                    {handState && handState.finished ? (
                      <span>
                        A mão terminou. Clique em <strong>Iniciar mão</strong> para jogar novamente.
                      </span>
                    ) : handState && canHumanRespondToTruco ? (
                      <span>
                        O time adversário pediu {getPendingBetText(handState)}. Escolha entre <strong>Aceitar</strong> ou <strong>Correr</strong>.
                      </span>
                    ) : handState && handState.truco.phase === "awaiting-response" ? (
                      <span>
                        O pedido de {getPendingBetText(handState)} está aguardando resposta da IA. Clique em <strong>{getNextStepButtonLabel(handState)}</strong>.
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
                      <span>
                        É sua vez. Escolha uma carta ou peça o próximo lance.
                      </span>
                    ) : (
                      <span>Inicie uma mão para começar.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.logsCard}>
          <div style={styles.logsHeader}>
            <h2 style={styles.sectionTitle}>Logs</h2>
            <button
              style={{
                ...styles.secondaryButton,
                ...(!logs ? styles.disabledButton : {}),
              }}
              onClick={handleCopyLogs}
              disabled={!logs}
            >
              Copiar log
            </button>
          </div>

          <textarea readOnly value={logs} style={styles.logsArea} />
        </section>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
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
}: {
  name: string
  detail: string
  team: "Nós" | "Eles"
  active?: boolean
  isHuman?: boolean
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
}: {
  label: string
  playerId: number
  card?: Card
  highlight?: boolean
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

function formatCard(card: Card): string {
  return `${card.rank} de ${card.suit}`
}

function getCurrentTurnLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase === "awaiting-response") {
    if (handState.truco.awaitingResponseFromTeam === "A") {
      return "Você / nosso time"
    }

    return "Time adversário"
  }

  switch (handState.currentPlayerId) {
    case 1:
      return "Você"
    case 2:
      return "Adversário esquerdo"
    case 3:
      return "Parceira"
    case 4:
      return "Adversário direito"
    default:
      return `Jogador ${handState.currentPlayerId}`
  }
}

function getWinnerLabel(winner?: "A" | "B"): string {
  if (!winner) return "Sem vencedor"

  return winner === "A" ? "Nós vencemos" : "Eles venceram"
}

function getStatusMessage(handState: HandState | null): string {
  if (!handState) {
    return "Escolha a variante e clique em “Iniciar mão”."
  }

  if (handState.finished) {
    return getWinnerLabel(handState.winner)
  }

  if (handState.truco.phase === "awaiting-response") {
    if (handState.truco.awaitingResponseFromTeam === "A") {
      return `O time adversário pediu ${getPendingBetText(handState)}. Responda.`
    }

    return "O jogo está pausado aguardando resposta do time adversário."
  }

  if (handState.table.length === 4) {
    return "A vaza está completa e pronta para ser resolvida."
  }

  if (handState.currentPlayerId === 1) {
    return "É sua vez de jogar."
  }

  return `Aguardando jogada de ${getCurrentTurnLabel(handState).toLowerCase()}.`
}

function getNextStepButtonLabel(handState: HandState | null): string {
  if (!handState) {
    return "Próxima jogada"
  }

  if (handState.finished) {
    return "Mão encerrada"
  }

  if (handState.truco.phase === "awaiting-response") {
      return "Resolver lance"
  }

  if (handState.table.length === 4) {
    return "Resolver vaza"
  }

  return "Continuar"
}

function getRoundWinMessage(
  handState: HandState,
  previousScore: { A: number; B: number }
): string {
  const usWonRound = handState.score.A > previousScore.A
  const themWonRound = handState.score.B > previousScore.B

  if (usWonRound) {
    return "Nós vencemos a rodada."
  }

  if (themWonRound) {
    return "Eles venceram a rodada."
  }

  return "A rodada foi resolvida."
}

function getHandEndMessage(handState: HandState): string {
  if (handState.winner === "A") {
    return `Fim da mão: nós vencemos valendo ${getBetBadgeLabel(handState.currentBet)}.`
  }

  if (handState.winner === "B") {
    return `Fim da mão: eles venceram valendo ${getBetBadgeLabel(handState.currentBet)}.`
  }

  return "Fim da mão."
}

function getEventMessageForTransition(
  previousState: HandState | null,
  nextState: HandState
): string | null {
  if (!previousState) {
    return null
  }

  if (
    !previousState.finished &&
    nextState.finished
  ) {
    return getHandEndMessage(nextState)
  }

  if (
    nextState.score.A !== previousState.score.A ||
    nextState.score.B !== previousState.score.B
  ) {
    return getRoundWinMessage(nextState, previousState.score)
  }

  if (nextState.roundNumber > previousState.roundNumber) {
    return `Começou a rodada ${nextState.roundNumber}.`
  }

  if (previousState.table.length === 4 && nextState.table.length === 0) {
    return "A mesa foi limpa para a próxima jogada."
  }

  return null
}

function getTrucoMessageForTransition(
  previousState: HandState | null,
  nextState: HandState
): string | null {
  if (!previousState) {
    return null
  }

  if (
    previousState.truco.phase === "idle" &&
    nextState.truco.phase === "awaiting-response"
  ) {
    if (nextState.truco.requestedByTeam === "A") {
      return `Nosso time pediu ${getPendingBetText(nextState)}. Aguardando resposta deles.`
    }

    if (nextState.truco.requestedByTeam === "B") {
      return `O time adversário pediu ${getPendingBetText(nextState)}. Responda.`
    }
  }

  if (
    previousState.truco.phase === "awaiting-response" &&
    nextState.truco.phase === "idle"
  ) {
    if (nextState.finished) {
      if (previousState.truco.requestedByTeam === "A") {
        return `O time adversário correu de ${getPendingBetText(previousState)}.`
      }

      if (previousState.truco.requestedByTeam === "B") {
        return `Nosso time correu de ${getPendingBetText(previousState)}.`
      }
    }

    if (nextState.currentBet > previousState.currentBet) {
      return getAcceptedBetMessage(nextState.currentBet)
    }
  }

  return null
}

function getSuitSymbol(suit: Card["suit"]): string {
  switch (suit) {
    case "copas":
      return "♥"
    case "ouros":
      return "♦"
    case "espada":
      return "♠"
    case "paus":
      return "♣"
    default:
      return "?"
  }
}

function getManilhaLabel(handState: HandState | null): string {
  if (!handState) return "—"
  if (handState.variant === "MINEIRO") return "Fixa"

  const viraRank = handState.vira?.rank
  if (!viraRank) return "—"

  const nextRank = getNextRank(viraRank)
  return nextRank ?? "—"
}

function getNextRank(rank: string): string | null {
  const order = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"]
  const index = order.indexOf(rank)

  if (index === -1) return null

  const nextIndex = (index + 1) % order.length
  return order[nextIndex]
}

function getStateLabel(handState: HandState | null): string {
  if (!handState) return "Aguardando início"
  if (handState.finished) return "Encerrada"
  if (handState.truco.phase === "awaiting-response") return "Lance pendente"
  return "Em andamento"
}

function getTrucoStatusLabel(handState: HandState | null): string {
  if (!handState) return "Sem mão ativa"
  if (handState.finished) return "Mão encerrada"
  if (handState.truco.phase === "awaiting-response") {
    if (handState.truco.awaitingResponseFromTeam === "A") {
      return "Sua resposta"
    }

    return "Aguardando resposta"
  }
  return "Disponível"
}

function canHumanRaiseInResponse(handState: HandState | null): boolean {
  if (!handState) return false
  if (handState.truco.phase !== "awaiting-response") return false
  if (handState.truco.awaitingResponseFromTeam !== "A") return false

  return getNextRaiseValueFromPendingTruco(handState) !== null
}

function getRaiseResponseButtonLabel(handState: HandState | null): string {
  const nextRaise = getNextRaiseValueFromPendingTruco(handState)

  if (!nextRaise) {
    return "Aumentar"
  }

  return `Pedir ${getBetCallLabelFromNumber(nextRaise)}`
}

function getNextRaiseValueFromPendingTruco(handState: HandState | null): number | null {
  if (!handState) return null
  if (handState.truco.phase !== "awaiting-response") return null
  if (!handState.truco.proposedBet) return null

  const order = [1, 3, 6, 9, 12]
  const index = order.indexOf(handState.truco.proposedBet)

  if (index === -1 || index === order.length - 1) {
    return null
  }

  return order[index + 1]
}

function getTrucoRequestedByLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase !== "awaiting-response") {
    return "—"
  }

  if (handState.truco.requestedByTeam === "A") {
    return "Nós"
  }

  if (handState.truco.requestedByTeam === "B") {
    return "Eles"
  }

  return "—"
}

function getTrucoAwaitingLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase !== "awaiting-response") {
    return "Ninguém"
  }

  if (handState.truco.awaitingResponseFromTeam === "A") {
    return "Nossa resposta"
  }

  if (handState.truco.awaitingResponseFromTeam === "B") {
    return "Resposta deles"
  }

  return "—"
}

function getTrucoProposedBetLabel(handState: HandState | null): string {
  if (!handState) return "—"

  if (handState.truco.phase !== "awaiting-response") {
    return "—"
  }

  return handState.truco.proposedBet
    ? `${getBetCallLabel(handState.truco.proposedBet)} (${handState.truco.proposedBet})`
    : "—"
}

function getRequestBetButtonLabel(handState: HandState | null): string {
  if (!handState) {
    return "Pedir truco"
  }

  const nextBet = getNextBet(handState.currentBet)
  if (!nextBet) {
    return "Sem aumento"
  }

  return `Pedir ${getBetCallLabel(nextBet)}`
}

function getPendingBetText(handState: HandState | null): string {
  if (!handState || handState.truco.phase !== "awaiting-response" || !handState.truco.proposedBet) {
    return "truco"
  }

  return getBetCallLabel(handState.truco.proposedBet)
}

function getBetCallLabelFromNumber(value: number): string {
  if (value === 3 || value === 6 || value === 9 || value === 12) {
    return getBetCallLabel(value)
  }

  return String(value)
}

function getBetBadgeLabel(bet: 1 | 3 | 6 | 9 | 12): string {
  return `Valendo ${bet} (${capitalizeBetLabel(getBetLabel(bet))})`
}

function capitalizeBetLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function getAcceptedBetMessage(bet: 1 | 3 | 6 | 9 | 12): string {
  return `${capitalizeBetLabel(getBetCallLabel(bet))} aceito. A mão agora vale ${bet} ponto(s).`
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
    gridTemplateColumns: "260px 1fr 260px",
    gap: "18px",
    alignItems: "stretch",
  },
  sideSeat: {
    display: "flex",
    alignItems: "center",
  },
  playerSeat: {
    width: "100%",
    borderRadius: "16px",
    padding: "14px",
    background: "#f8fafc",
    border: "1px solid #d5dce6",
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
    fontSize: "17px",
  },
  playerSeatDetail: {
    color: "#475569",
    fontSize: "14px",
    marginBottom: "8px",
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
    minHeight: "420px",
    padding: "24px",
    boxSizing: "border-box",
    border: "4px solid #0f3d24",
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)",
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
