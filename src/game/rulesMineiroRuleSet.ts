import type { Card } from "./card"
import { RANK_ORDER } from "./rankOrder"
import type { RuleSet } from "./ruleSet"

const MANILHAS: Card[] = [
  { rank: "4", suit: "paus" },
  { rank: "7", suit: "copas" },
  { rank: "A", suit: "espada" },
  { rank: "7", suit: "ouros" }
]

function isManilha(card: Card): number {
  return MANILHAS.findIndex(
    m => m.rank === card.rank && m.suit === card.suit
  )
}

function compareCards(a: Card, b: Card): number {
  const ma = isManilha(a)
  const mb = isManilha(b)

  if (ma !== -1 && mb !== -1) {
    if (ma === mb) return 0
    return ma < mb ? 1 : -1
  }

  if (ma !== -1) return 1
  if (mb !== -1) return -1

  const ra = RANK_ORDER.indexOf(a.rank)
  const rb = RANK_ORDER.indexOf(b.rank)

  if (ra === rb) return 0

  return ra > rb ? 1 : -1
}

export const mineiroRuleSet: RuleSet = {
  variant: "MINEIRO",
  isManilha(card: Card) {
    return isManilha(card)
  },
  compareCards(a: Card, b: Card) {
    return compareCards(a, b)
  }
}