import type { Card } from "../game/card"
import { compareCards } from "../game/compare"
import type { RuleSet } from "../game/ruleSet"
import { isTeammate } from "./utils"

export function chooseCard(
  ruleSet: RuleSet,
  playerId: number,
  hand: Card[],
  table: { playerId: number; card: Card }[],
  vira?: Card
): Card {
  if (table.length === 0) {
    return getLowestCard(ruleSet, hand, vira)
  }

  let best = table[0]

  for (let i = 1; i < table.length; i++) {
    const current = table[i]
    if (compareCards(ruleSet, current.card, best.card, vira) > 0) {
      best = current
    }
  }

  const teammateWinning = isTeammate(playerId, best.playerId)

  if (teammateWinning) {
    return getLowestCard(ruleSet, hand, vira)
  }

  const winningCards = getWinningCards(ruleSet, hand, best.card, vira)

  if (winningCards.length > 0) {
    return getLowestCard(ruleSet, winningCards, vira)
  }

  // If the trick is already unwinnable, preserve every stronger card and throw the cheapest one.
  return getLowestCard(ruleSet, hand, vira)
}

function getWinningCards(
  ruleSet: RuleSet,
  cards: Card[],
  bestTableCard: Card,
  vira?: Card
): Card[] {
  return cards.filter((card) => compareCards(ruleSet, card, bestTableCard, vira) > 0)
}

function getLowestCard(
  ruleSet: RuleSet,
  cards: Card[],
  vira?: Card
): Card {
  return cards.reduce((lowest, card) => {
    return compareCards(ruleSet, card, lowest, vira) < 0 ? card : lowest
  })
}
