import type { Card } from "../game/card"
import type { BetValue } from "../game/truco"
import type { RuleSet } from "../game/ruleSet"
import {
  getAiTrucoPersonality,
  type AiTrucoPersonalityId,
} from "./trucoPersonalities"

export type PartnerAdvice = "BORA!" | "CÊ QUE SABE!" | "MELHOR CORRER!"
export type PartnerAdviceSkillLevel = 1 | 2 | 3 | 4 | 5
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
  const personality = getAiTrucoPersonality(personalityId)
  const strengths = hands.map((hand) => evaluateHandStrength(ruleSet, hand, vira))
  const acceptThreshold = getAcceptThreshold(nextBet, personalityId)
  const shouldAcceptByCards =
    strengths.some((strength) => strength >= acceptThreshold) ||
    getTeamStrengthTotal(strengths) >= acceptThreshold + personality.partnerMaybeOffset + 1
  const shouldAcceptByBluff = shouldAcceptByCards
    ? false
    : hands.some(
        (hand) => respondToRaise(ruleSet, hand, nextBet, vira, personalityId, randomSource) === "accept"
      )
  const shouldAccept = shouldAcceptByCards || shouldAcceptByBluff

  if (!shouldAccept) {
    return "run"
  }

  const canRaise = nextBet !== 12
  const shouldReRaise =
    canRaise &&
    shouldTeamRaiseFromStrengths(strengths, nextBet, personality, randomSource)

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
  personalityId: AiTrucoPersonalityId = "balanced",
  randomSource: RandomSource = Math.random,
  partnerAdviceSkillLevel: PartnerAdviceSkillLevel = 3
): TrucoTeamDecision {
  const personality = getAiTrucoPersonality(personalityId)
  const partnerStrength = evaluateHandStrength(ruleSet, partnerHand, vira)
  const humanStrength = getWeightedHumanStrength(
    evaluateHandStrength(ruleSet, humanHand, vira),
    humanAdvice,
    partnerAdviceSkillLevel
  )
  const totalStrength = partnerStrength + humanStrength
  const acceptThreshold = getAcceptThreshold(nextBet, personalityId)
  const teamAcceptThreshold = getConsultTeamAcceptThreshold(
    acceptThreshold,
    personality.partnerMaybeOffset,
    humanAdvice,
    partnerAdviceSkillLevel
  )

  const shouldAccept =
    partnerStrength >= acceptThreshold ||
    humanStrength >= acceptThreshold ||
    totalStrength >= teamAcceptThreshold

  if (!shouldAccept && humanAdvice !== "BORA!") {
    return "run"
  }

  const canRaise = nextBet !== 12
  const shouldReRaise =
    canRaise &&
    shouldTeamRaiseFromStrengths(
      [partnerStrength, humanStrength],
      nextBet,
      personality,
      randomSource
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

function shouldTeamRaiseFromStrengths(
  strengths: number[],
  currentBet: BetValue,
  personality: ReturnType<typeof getAiTrucoPersonality>,
  randomSource: RandomSource
): boolean {
  const threshold = personality.raiseThresholdByCurrentBet[currentBet]

  if (typeof threshold !== "number") {
    return false
  }

  const best = strengths.length > 0 ? Math.max(...strengths) : 0
  const total = getTeamStrengthTotal(strengths)
  const strongSingleHand = best >= threshold + 1
  const strongCombinedHands = total >= threshold + personality.partnerGoOffset + 2

  if (strongSingleHand || strongCombinedHands) {
    return true
  }

  const bluffChance = personality.bluffChanceRequestByCurrentBet[currentBet] ?? 0
  const withinBluffMargin =
    best >= threshold - personality.raiseBluffMargin ||
    total >= threshold + personality.partnerGoOffset

  return withinBluffMargin && bluffChance > 0 && randomSource() < bluffChance
}

function getTeamStrengthTotal(strengths: number[]): number {
  return strengths.reduce((sum, strength) => sum + strength, 0)
}

function getConsultTeamAcceptThreshold(
  acceptThreshold: number,
  partnerMaybeOffset: number,
  advice: PartnerAdvice,
  partnerAdviceSkillLevel: PartnerAdviceSkillLevel
): number {
  if (advice === "CÊ QUE SABE!") {
    return acceptThreshold + Math.max(0, partnerMaybeOffset + 2 - partnerAdviceSkillLevel)
  }

  if (advice === "MELHOR CORRER!") {
    return acceptThreshold + partnerMaybeOffset + 2
  }

  return acceptThreshold
}

function getWeightedHumanStrength(
  baseStrength: number,
  advice: PartnerAdvice,
  partnerAdviceSkillLevel: PartnerAdviceSkillLevel
): number {
  switch (advice) {
    case "BORA!":
      return baseStrength + 2 + Math.floor(partnerAdviceSkillLevel / 2)
    case "CÊ QUE SABE!":
      return Math.max(baseStrength, partnerAdviceSkillLevel >= 3 ? 2 : 1)
    case "MELHOR CORRER!":
      return 0
  }
}
