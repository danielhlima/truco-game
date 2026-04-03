import type  { Card, Suit, Rank } from "./card"

const suits: Suit[] = ["copas", "ouros", "paus", "espada"]
const ranks: Rank[] = ["4","5","6","7","Q","J","K","A","2","3"]

export function createDeck(): Card[] {
  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank })
    }
  }

  return deck
}

export function shuffle(deck: Card[]): Card[] {
  return [...deck].sort(() => Math.random() - 0.5)
}