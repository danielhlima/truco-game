import type { EconomyReward } from "../../economy/types"
import type { GameVariant } from "../../game/variant"
import type { AiTrucoPersonalityId } from "../../ai/trucoPersonalities"

export type CampaignTier =
  | "rua"
  | "bairro"
  | "zona"
  | "cidade"
  | "estado"
  | "nacional"
  | "panamericano"
  | "jogos-mundiais"
  | "mundial"
  | "bonus"

export interface DifficultyProfile {
  aiLevel: 1 | 2 | 3 | 4 | 5
  aggression: 1 | 2 | 3 | 4 | 5
  trucoDiscipline: 1 | 2 | 3 | 4 | 5
  personalityId?: AiTrucoPersonalityId
}

export interface CampaignVenue {
  id: string
  name: string
  districtLabel: string
  visualTheme: string
  atmosphere: string
  matchesToClear: number
  variant: GameVariant
  difficulty: DifficultyProfile
  entryNarrative: string
  reward: EconomyReward
  monetizationHooks?: {
    rewardedAdOfferId?: string
    cosmeticPreviewId?: string
  }
}

export interface CampaignStage {
  id: string
  tier: CampaignTier
  name: string
  shortDescription: string
  mapLabel: string
  unlockRequirement?: string
  cutsceneIntro: string
  cutsceneOutro: string
  reward: EconomyReward
  venues: CampaignVenue[]
}
