import type { Card } from "../game/card"
import type { BetValue } from "../game/truco"
import type { RuleSet } from "../game/ruleSet"
import {
  getAiTrucoPersonality,
  type AiTrucoPersonalityId,
} from "./trucoPersonalities"

export type PartnerAdvice = "BORA!" | "CÊ QUE SABE!" | "MELHOR CORRER!"
export type TrucoTeamDecision = "accept" | "run" | "raise"
export type RandomSource = () => number

export function shouldRaiseBet(
  ruleSet: RuleSet,
  hand: Card[],
  currentBet: BetValue,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced",
  randomSource: RandomSource = Math.random
): boolean {
  const personality = getAiTrucoPersonality(personalityId)
  const strength = evaluateHandStrength(ruleSet, hand, vira)
  const threshold = personality.raiseThresholdByCurrentBet[currentBet]

  if (typeof threshold === "number") {
    if (strength >= threshold) {
      return true
    }

    const bluffChance = personality.bluffChanceRequestByCurrentBet[currentBet] ?? 0
    const withinBluffMargin = strength >= threshold - personality.raiseBluffMargin

    if (withinBluffMargin && bluffChance > 0) {
      return randomSource() < bluffChance
    }
  }

  return false
}

export function respondToRaise(
  ruleSet: RuleSet,
  hand: Card[],
  nextBet: BetValue,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced",
  randomSource: RandomSource = Math.random
): "accept" | "run" {
  const personality = getAiTrucoPersonality(personalityId)
  const strength = evaluateHandStrength(ruleSet, hand, vira)
  const threshold = personality.acceptThresholdByNextBet[nextBet]

  if (typeof threshold === "number") {
    if (strength >= threshold) {
      return "accept"
    }

    const bluffChance = personality.bluffChanceAcceptByNextBet[nextBet] ?? 0
    const withinBluffMargin = strength >= threshold - personality.acceptBluffMargin

    if (withinBluffMargin && bluffChance > 0 && randomSource() < bluffChance) {
      return "accept"
    }
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
  personalityId: AiTrucoPersonalityId = "balanced",
  randomSource: RandomSource = Math.random
): TrucoTeamDecision {
  const shouldAccept = hands.some(
    (hand) => respondToRaise(ruleSet, hand, nextBet, vira, personalityId, randomSource) === "accept"
  )

  if (!shouldAccept) {
    return "run"
  }

  const canRaise = nextBet !== 12
  const shouldReRaise =
    canRaise &&
    hands.some((hand) => shouldRaiseBet(ruleSet, hand, nextBet, vira, personalityId, randomSource))

  if (shouldReRaise) {
    return "raise"
  }

  return "accept"
}

export function getTeamTrucoDecisionFromPartnerAdvice(
  ruleSet: RuleSet,
  humanHand: Card[],
  partnerHand: Card[],
  nextBet: BetValue,
  humanAdvice: PartnerAdvice,
  vira?: Card,
  personalityId: AiTrucoPersonalityId = "balanced"
): TrucoTeamDecision {
  const personality = getAiTrucoPersonality(personalityId)
  const partnerStrength = evaluateHandStrength(ruleSet, partnerHand, vira)
  const humanStrength = getWeightedHumanStrength(
    evaluateHandStrength(ruleSet, humanHand, vira),
    humanAdvice
  )
  const totalStrength = partnerStrength + humanStrength
  const acceptThreshold = getAcceptThreshold(nextBet, personalityId)
  const raiseThreshold = personality.raiseThresholdByCurrentBet[nextBet] ?? 99

  const shouldAccept =
    partnerStrength >= acceptThreshold ||
    humanStrength >= acceptThreshold ||
    totalStrength >= acceptThreshold + personality.partnerMaybeOffset

  if (!shouldAccept) {
    return "run"
  }

  const canRaise = nextBet !== 12
  const shouldReRaise =
    canRaise &&
    (
      partnerStrength >= raiseThreshold ||
      humanStrength >= raiseThreshold ||
      totalStrength >= raiseThreshold + personality.partnerGoOffset
    )

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

function getWeightedHumanStrength(baseStrength: number, advice: PartnerAdvice): number {
  switch (advice) {
    case "BORA!":
      return baseStrength + 2
    case "CÊ QUE SABE!":
      return baseStrength + 1
    case "MELHOR CORRER!":
      return Math.max(0, baseStrength - 3)
  }
}
