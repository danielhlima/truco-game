import type { Card } from "./card"
import type { GameVariant } from "./variant"

export interface RuleSet {
  variant: GameVariant
  isManilha(card: Card, vira?: Card): number
  compareCards(a: Card, b: Card, vira?: Card): number
}