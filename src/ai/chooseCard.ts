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

  const winningCards = hand.filter(card =>
    compareCards(ruleSet, card, best.card, vira) > 0
  )

  if (winningCards.length > 0) {
    return getLowestCard(ruleSet, winningCards, vira)
  }

  return getLowestCard(ruleSet, hand, vira)
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