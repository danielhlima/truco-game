import type { Card } from "./card"
import type { HandState } from "./handState"
import { getPlayerById } from "./getPlayerById"
import { logEvent } from "../utils/logger"

interface PlayHumanCardOptions {
  covered?: boolean
}

export function playHumanCard(
  state: HandState,
  card: Card,
  options: PlayHumanCardOptions = {}
): HandState {
  if (state.finished) {
    return state
  }

  if (state.truco.phase !== "idle") {
    throw new Error("Não é possível jogar carta enquanto o truco aguarda resposta")
  }

  if (state.currentPlayerId !== 1) {
    throw new Error("Não é a vez do jogador humano")
  }

  if (options.covered && state.roundNumber === 1) {
    throw new Error("Carta coberta só é permitida a partir da segunda vaza")
  }

  const player = getPlayerById(state.players, 1)

  const cardIndex = player.hand.findIndex(
    (c) => c.rank === card.rank && c.suit === card.suit
  )

  if (cardIndex === -1) {
    throw new Error("Carta não encontrada na mão do jogador")
  }

  const selectedCard = player.hand[cardIndex]
  const nextPlayers = state.players.map((currentPlayer) => {
    if (currentPlayer.id !== 1) {
      return currentPlayer
    }

    return {
      ...currentPlayer,
      hand: currentPlayer.hand.filter((_, index) => index !== cardIndex),
    }
  })
  const nextTable = [
    ...state.table,
    {
      playerId: 1,
      card: selectedCard,
      covered: options.covered,
    },
  ]

  if (options.covered) {
    logEvent("Jogador humano jogou carta coberta.")
  } else {
    logEvent("Jogador humano jogou:", selectedCard)
  }
  logEvent("Mesa após jogada humana:", maskCoveredTableCards(nextTable))

  return {
    ...state,
    players: nextPlayers,
    table: nextTable,
    currentPlayerId: 2,
  }
}

function maskCoveredTableCards(table: HandState["table"]): unknown[] {
  return table.map((entry) =>
    entry.covered
      ? {
          playerId: entry.playerId,
          card: "coberta",
          covered: true,
        }
      : entry
  )
}
