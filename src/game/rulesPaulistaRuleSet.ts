import type { Card, Rank, Suit } from "./card"
import { RANK_ORDER } from "./rankOrder"
import type { RuleSet } from "./ruleSet"

const MANILHA_SUIT_ORDER: Suit[] = ["ouros", "espada", "copas", "paus"]

function getNextRank(rank: Rank): Rank {
  const index = RANK_ORDER.indexOf(rank)

  if (index === -1) {
    throw new Error(`Rank inválido: ${rank}`)
  }

  return index === RANK_ORDER.length - 1
    ? RANK_ORDER[0]
    : RANK_ORDER[index + 1]
}

function isManilha(card: Card, vira?: Card): number {
  if (!vira) {
    throw new Error("Vira é obrigatória no Truco Paulista")
  }

  const manilhaRank = getNextRank(vira.rank)

  if (card.rank !== manilhaRank) {
    return -1
  }

  return MANILHA_SUIT_ORDER.indexOf(card.suit)
}

function compareCards(a: Card, b: Card, vira?: Card): number {
  const ma = isManilha(a, vira)
  const mb = isManilha(b, vira)

  // ambos são manilha
  if (ma !== -1 && mb !== -1) {
    if (ma === mb) return 0
    return ma > mb ? 1 : -1
  }

  // apenas um é manilha
  if (ma !== -1) return 1
  if (mb !== -1) return -1

  // comparação normal
  const ra = RANK_ORDER.indexOf(a.rank)
  const rb = RANK_ORDER.indexOf(b.rank)

  if (ra === rb) return 0

  return ra > rb ? 1 : -1
}

export const paulistaRuleSet: RuleSet = {
  variant: "PAULISTA",
  isManilha(card: Card, vira?: Card) {
    return isManilha(card, vira)
  },
  compareCards(a: Card, b: Card, vira?: Card) {
    return compareCards(a, b, vira)
  }
}