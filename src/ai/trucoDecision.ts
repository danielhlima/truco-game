import type { Card } from "../game/card"
import type { BetValue } from "../game/truco"
import type { RuleSet } from "../game/ruleSet"
import {
  getAiTrucoPersonality,
  type AiTrucoPersonalityId,
} from "./trucoPersonalities"

export type PartnerAdvice = "BORA!" | "CÊ QUE SABE!" | "MELHOR CORRER!"
export type TrucoTeamDecision = "accept" | "run" | "raise"

export function shouldRaiseBet(
  ruleSet: RuleSet,
  hand: Card[],
  currentBet: BetValue,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced"
): boolean {
  const personality = getAiTrucoPersonality(personalityId)
  const strength = evaluateHandStrength(ruleSet, hand, vira)
  const threshold = personality.raiseThresholdByCurrentBet[currentBet]

  if (typeof threshold === "number") {
    return strength >= threshold
  }

  return false
}

export function respondToRaise(
  ruleSet: RuleSet,
  hand: Card[],
  nextBet: BetValue,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced"
): "accept" | "run" {
  const personality = getAiTrucoPersonality(personalityId)
  const strength = evaluateHandStrength(ruleSet, hand, vira)
  const threshold = personality.acceptThresholdByNextBet[nextBet]

  if (typeof threshold === "number") {
    return strength >= threshold ? "accept" : "run"
  }

  return "run"
}

export function getTeamPartnerAdvice(
  ruleSet: RuleSet,
  hands: Card[][],
  nextBet: BetValue,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced"
): PartnerAdvice {
  const personality = getAiTrucoPersonality(personalityId)
  const strengths = hands.map((hand) => evaluateHandStrength(ruleSet, hand, vira))
  const best = strengths.length > 0 ? Math.max(...strengths) : 0
  const total = strengths.reduce((sum, value) => sum + value, 0)
  const acceptThreshold = getAcceptThreshold(nextBet, personalityId)
  const goThreshold = acceptThreshold + personality.partnerGoOffset

  if (best >= goThreshold || total >= goThreshold + personality.partnerTotalGoOffset) {
    return "BORA!"
  }

  if (best >= acceptThreshold || total >= acceptThreshold + personality.partnerMaybeOffset) {
    return "CÊ QUE SABE!"
  }

  return "MELHOR CORRER!"
}

export function getTeamTrucoDecision(
  ruleSet: RuleSet,
  hands: Card[][],
  nextBet: BetValue,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced"
): TrucoTeamDecision {
  const shouldAccept = hands.some(
    (hand) => respondToRaise(ruleSet, hand, nextBet, vira, personalityId) === "accept"
  )

  if (!shouldAccept) {
    return "run"
  }

  const canRaise = nextBet !== 12
  const shouldReRaise =
    canRaise &&
    hands.some((hand) => shouldRaiseBet(ruleSet, hand, nextBet, vira, personalityId))

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

function getAcceptThreshold(
  nextBet: BetValue,
  personalityId: AiTrucoPersonalityId
): number {
  const personality = getAiTrucoPersonality(personalityId)
  const threshold = personality.acceptThresholdByNextBet[nextBet]

  if (typeof threshold === "number") {
    return threshold
  }

  return 99
}
