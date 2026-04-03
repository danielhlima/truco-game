import type  { Card } from "./card"

export const MANILHAS: Card[] = [
  { rank: "4", suit: "paus" },    // zap
  { rank: "7", suit: "copas" },
  { rank: "A", suit: "espada" },
  { rank: "7", suit: "ouros" }
]

export function isManilha(card: Card): number {
  return MANILHAS.findIndex(
    m => m.rank === card.rank && m.suit === card.suit
  )
}