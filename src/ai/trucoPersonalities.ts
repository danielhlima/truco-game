import type { BetValue } from "../game/truco"
import type { DifficultyProfile } from "../career/campaign/types"

export type AiTrucoPersonalityId =
  | "ultra_conservative"
  | "conservative"
  | "balanced"
  | "aggressive"
  | "trickster"
  | "reckless"

export interface AiTrucoPersonality {
  id: AiTrucoPersonalityId
  raiseThresholdByCurrentBet: Partial<Record<BetValue, number>>
  acceptThresholdByNextBet: Partial<Record<BetValue, number>>
  partnerGoOffset: number
  partnerTotalGoOffset: number
  partnerMaybeOffset: number
  raiseBluffMargin: number
  acceptBluffMargin: number
  bluffChanceRequestByCurrentBet: Partial<Record<BetValue, number>>
  bluffChanceAcceptByNextBet: Partial<Record<BetValue, number>>
}

const ULTRA_CONSERVATIVE_PERSONALITY: AiTrucoPersonality = {
  id: "ultra_conservative",
  raiseThresholdByCurrentBet: {
    1: 4,
    3: 5,
    6: 6,
    9: 7,
  },
  acceptThresholdByNextBet: {
    3: 3,
    6: 4,
    9: 5,
    12: 6,
  },
  partnerGoOffset: 3,
  partnerTotalGoOffset: 4,
  partnerMaybeOffset: 2,
  raiseBluffMargin: 0,
  acceptBluffMargin: 0,
  bluffChanceRequestByCurrentBet: {},
  bluffChanceAcceptByNextBet: {},
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
  raiseBluffMargin: 0,
  acceptBluffMargin: 0,
  bluffChanceRequestByCurrentBet: {},
  bluffChanceAcceptByNextBet: {},
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
  raiseBluffMargin: 0,
  acceptBluffMargin: 0,
  bluffChanceRequestByCurrentBet: {},
  bluffChanceAcceptByNextBet: {},
}

const AGGRESSIVE_PERSONALITY: AiTrucoPersonality = {
  id: "aggressive",
  raiseThresholdByCurrentBet: {
    1: 2,
    3: 2,
    6: 3,
    9: 4,
  },
  acceptThresholdByNextBet: {
    3: 1,
    6: 2,
    9: 2,
    12: 3,
  },
  partnerGoOffset: 1,
  partnerTotalGoOffset: 1,
  partnerMaybeOffset: 0,
  raiseBluffMargin: 1,
  acceptBluffMargin: 1,
  bluffChanceRequestByCurrentBet: {
    1: 0.22,
    3: 0.16,
    6: 0.12,
    9: 0.08,
  },
  bluffChanceAcceptByNextBet: {
    3: 0.18,
    6: 0.12,
    9: 0.1,
    12: 0.06,
  },
}

const TRICKSTER_PERSONALITY: AiTrucoPersonality = {
  id: "trickster",
  raiseThresholdByCurrentBet: {
    1: 2,
    3: 3,
    6: 4,
    9: 4,
  },
  acceptThresholdByNextBet: {
    3: 1,
    6: 2,
    9: 3,
    12: 3,
  },
  partnerGoOffset: 1,
  partnerTotalGoOffset: 1,
  partnerMaybeOffset: 0,
  raiseBluffMargin: 1,
  acceptBluffMargin: 1,
  bluffChanceRequestByCurrentBet: {
    1: 0.34,
    3: 0.28,
    6: 0.2,
    9: 0.14,
  },
  bluffChanceAcceptByNextBet: {
    3: 0.28,
    6: 0.22,
    9: 0.16,
    12: 0.1,
  },
}

const RECKLESS_PERSONALITY: AiTrucoPersonality = {
  id: "reckless",
  raiseThresholdByCurrentBet: {
    1: 1,
    3: 2,
    6: 2,
    9: 3,
  },
  acceptThresholdByNextBet: {
    3: 1,
    6: 1,
    9: 2,
    12: 2,
  },
  partnerGoOffset: 0,
  partnerTotalGoOffset: 1,
  partnerMaybeOffset: 0,
  raiseBluffMargin: 1,
  acceptBluffMargin: 1,
  bluffChanceRequestByCurrentBet: {
    1: 0.5,
    3: 0.4,
    6: 0.3,
    9: 0.2,
  },
  bluffChanceAcceptByNextBet: {
    3: 0.36,
    6: 0.28,
    9: 0.22,
    12: 0.16,
  },
}

const PERSONALITIES: Record<AiTrucoPersonalityId, AiTrucoPersonality> = {
  ultra_conservative: ULTRA_CONSERVATIVE_PERSONALITY,
  conservative: CONSERVATIVE_PERSONALITY,
  balanced: BALANCED_PERSONALITY,
  aggressive: AGGRESSIVE_PERSONALITY,
  trickster: TRICKSTER_PERSONALITY,
  reckless: RECKLESS_PERSONALITY,
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

  if (difficulty.aggression <= 1 && difficulty.trucoDiscipline <= 2) {
    return "ultra_conservative"
  }

  if (difficulty.aggression <= 2 && difficulty.trucoDiscipline <= 2) {
    return "conservative"
  }

  if (difficulty.aggression >= 5 || difficulty.trucoDiscipline >= 5) {
    return "reckless"
  }

  if (difficulty.aggression >= 4 || difficulty.trucoDiscipline >= 4) {
    return "aggressive"
  }

  return "balanced"
}
