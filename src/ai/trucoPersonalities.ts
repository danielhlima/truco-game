import type { BetValue } from "../game/truco"
import type { DifficultyProfile } from "../career/campaign/types"

export type AiTrucoPersonalityId = "balanced" | "conservative"

interface AiTrucoPersonality {
  id: AiTrucoPersonalityId
  raiseThresholdByCurrentBet: Partial<Record<BetValue, number>>
  acceptThresholdByNextBet: Partial<Record<BetValue, number>>
  partnerGoOffset: number
  partnerTotalGoOffset: number
  partnerMaybeOffset: number
}

const BALANCED_PERSONALITY: AiTrucoPersonality = {
  id: "balanced",
  raiseThresholdByCurrentBet: {
    1: 2,
    3: 3,
    6: 4,
    9: 5,
  },
  acceptThresholdByNextBet: {
    3: 1,
    6: 2,
    9: 3,
    12: 4,
  },
  partnerGoOffset: 1,
  partnerTotalGoOffset: 2,
  partnerMaybeOffset: 1,
}

const CONSERVATIVE_PERSONALITY: AiTrucoPersonality = {
  id: "conservative",
  raiseThresholdByCurrentBet: {
    1: 3,
    3: 4,
    6: 5,
    9: 6,
  },
  acceptThresholdByNextBet: {
    3: 2,
    6: 3,
    9: 4,
    12: 5,
  },
  partnerGoOffset: 2,
  partnerTotalGoOffset: 3,
  partnerMaybeOffset: 1,
}

const PERSONALITIES: Record<AiTrucoPersonalityId, AiTrucoPersonality> = {
  balanced: BALANCED_PERSONALITY,
  conservative: CONSERVATIVE_PERSONALITY,
}

export function getAiTrucoPersonality(
  personalityId: AiTrucoPersonalityId = "balanced"
): AiTrucoPersonality {
  return PERSONALITIES[personalityId] ?? BALANCED_PERSONALITY
}

export function getAiTrucoPersonalityIdForDifficulty(
  difficulty?: DifficultyProfile
): AiTrucoPersonalityId {
  if (difficulty?.personalityId) {
    return difficulty.personalityId
  }

  if (!difficulty) {
    return "balanced"
  }

  if (difficulty.aggression <= 2 && difficulty.trucoDiscipline <= 2) {
    return "conservative"
  }

  return "balanced"
}
