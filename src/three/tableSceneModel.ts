import type { Card } from "../game/card"
import type { HandState } from "../game/handState"
import type { CampaignVenue } from "../career/campaign/types"
import { getBetBadgeLabel, getSuitSymbol } from "../app/gameSessionHelpers"
import { getTableTheme, type TableTheme } from "./tableTheme"

export interface TableSceneSlot {
  playerId: number
  label: string
  x: number
  y: number
  highlight: boolean
  handCount: number
  card?: {
    rank: string
    suit: string
    suitSymbol: string
  }
}

export interface TableSceneModel {
  betLabel: string
  roundLabel: string
  venueLabel: string
  atmosphere: string
  theme: TableTheme
  centerDeck: {
    show: boolean
    vira?: {
      rank: string
      suit: string
      suitSymbol: string
    }
  }
  slots: TableSceneSlot[]
}

export function buildTableSceneModel(
  handState: HandState | null,
  tableByPlayer: Record<number, Card | undefined>,
  lastPlayedPlayerId: number | null,
  venue: CampaignVenue | null
): TableSceneModel {
  const slotLayout = [
    { playerId: 3, label: "Topo", x: 0, y: 1.45 },
    { playerId: 2, label: "Esquerda", x: -2.15, y: 0 },
    { playerId: 4, label: "Direita", x: 2.15, y: 0 },
    { playerId: 1, label: "Baixo", x: 0, y: -1.45 },
  ]

  return {
    betLabel: handState ? getBetBadgeLabel(handState.currentBet) : getBetBadgeLabel(1),
    roundLabel: handState ? `Rodada ${handState.roundNumber}` : "Aguardando",
    venueLabel: venue?.name ?? "Mesa de Treino",
    atmosphere: venue?.atmosphere ?? "Protótipo inicial da futura mesa 3D.",
    theme: getTableTheme(venue?.visualTheme),
    centerDeck: {
      show: handState?.variant === "PAULISTA",
      vira: handState?.variant === "PAULISTA" && handState.vira
        ? {
            rank: handState.vira.rank,
            suit: handState.vira.suit,
            suitSymbol: getSuitSymbol(handState.vira.suit),
          }
        : undefined,
    },
    slots: slotLayout.map((slot) => {
      const card = tableByPlayer[slot.playerId]
      const player = handState?.players.find((item) => item.id === slot.playerId)

      return {
        ...slot,
        highlight: lastPlayedPlayerId === slot.playerId,
        handCount: player?.hand.length ?? 0,
        card: card
          ? {
              rank: card.rank,
              suit: card.suit,
              suitSymbol: getSuitSymbol(card.suit),
            }
          : undefined,
      }
    }),
  }
}
