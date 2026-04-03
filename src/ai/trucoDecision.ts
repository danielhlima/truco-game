import type { Card } from "../game/card"
import type { BetValue } from "../game/truco"
import type { RuleSet } from "../game/ruleSet"

export function shouldRaiseBet(
  ruleSet: RuleSet,
  hand: Card[],
  currentBet: BetValue,
  vira?: Card
): boolean {
  const strength = evaluateHandStrength(ruleSet, hand, vira)

  if (currentBet === 1) return strength >= 2
  if (currentBet === 3) return strength >= 3
  if (currentBet === 6) return strength >= 4
  if (currentBet === 9) return strength >= 5

  return false
}

export function respondToRaise(
  ruleSet: RuleSet,
  hand: Card[],
  nextBet: BetValue,
  vira?: Card
): "accept" | "run" {
  const strength = evaluateHandStrength(ruleSet, hand, vira)

  if (nextBet === 3) return strength >= 1 ? "accept" : "run"
  if (nextBet === 6) return strength >= 2 ? "accept" : "run"
  if (nextBet === 9) return strength >= 3 ? "accept" : "run"
  if (nextBet === 12) return strength >= 4 ? "accept" : "run"

  return "run"
}

function evaluateHandStrength(
  ruleSet: RuleSet,
  hand: Card[],
  vira?: Card
): number {
  let score = 0

  for (const card of hand) {
    if (ruleSet.isManilha(card, vira) !== -1) {
      score += 3
      continue
    }

    if (card.rank === "3") {
      score += 2
      continue
    }

    if (card.rank === "2") {
      score += 2
      continue
    }

    if (card.rank === "A") {
      score += 1
      continue
    }

    if (card.rank === "K") {
      score += 1
    }
  }

  return score
}