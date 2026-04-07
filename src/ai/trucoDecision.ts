import type { Card } from "../game/card"
import type { BetValue } from "../game/truco"
import type { RuleSet } from "../game/ruleSet"

export type PartnerAdvice = "BORA!" | "CÊ QUE SABE!" | "MELHOR CORRER!"
export type TrucoTeamDecision = "accept" | "run" | "raise"

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

export function getTeamPartnerAdvice(
  ruleSet: RuleSet,
  hands: Card[][],
  nextBet: BetValue,
  vira?: Card
): PartnerAdvice {
  const strengths = hands.map((hand) => evaluateHandStrength(ruleSet, hand, vira))
  const best = strengths.length > 0 ? Math.max(...strengths) : 0
  const total = strengths.reduce((sum, value) => sum + value, 0)
  const acceptThreshold = getAcceptThreshold(nextBet)
  const goThreshold = acceptThreshold + 1

  if (best >= goThreshold || total >= goThreshold + 2) {
    return "BORA!"
  }

  if (best >= acceptThreshold || total >= acceptThreshold + 1) {
    return "CÊ QUE SABE!"
  }

  return "MELHOR CORRER!"
}

export function getTeamTrucoDecision(
  ruleSet: RuleSet,
  hands: Card[][],
  nextBet: BetValue,
  vira?: Card
): TrucoTeamDecision {
  const shouldAccept = hands.some(
    (hand) => respondToRaise(ruleSet, hand, nextBet, vira) === "accept"
  )

  if (!shouldAccept) {
    return "run"
  }

  const canRaise = nextBet !== 12
  const shouldReRaise =
    canRaise && hands.some((hand) => shouldRaiseBet(ruleSet, hand, nextBet, vira))

  if (shouldReRaise) {
    return "raise"
  }

  return "accept"
}

export function evaluateHandStrength(
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

function getAcceptThreshold(nextBet: BetValue): number {
  if (nextBet === 3) return 1
  if (nextBet === 6) return 2
  if (nextBet === 9) return 3
  if (nextBet === 12) return 4

  return 99
}
