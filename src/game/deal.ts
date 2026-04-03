import { createDeck, shuffle } from "./deck"
import type { Player } from "./gameState"
import type { Card } from "./card"

export interface DealResult {
  players: Player[]
  remainingDeck: Card[]
}

export function dealCards(): DealResult {
  const deck = shuffle(createDeck())

  const players: Player[] = [
    { id: 1, hand: [] },
    { id: 2, hand: [] },
    { id: 3, hand: [] },
    { id: 4, hand: [] }
  ]

  for (let i = 0; i < 3; i++) {
    for (const player of players) {
      const card = deck.pop()
      if (card) {
        player.hand.push(card)
      }
    }
  }

  return {
    players,
    remainingDeck: deck
  }
}