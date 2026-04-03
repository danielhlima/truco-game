import type { CampaignStage, CampaignTier } from "./types"

export interface CampaignSummary {
  stageCount: number
  venueCount: number
  totalMatches: number
  matchesByTier: Record<CampaignTier, number>
}

export function buildCampaignSummary(stages: CampaignStage[]): CampaignSummary {
  const matchesByTier = stages.reduce<Record<CampaignTier, number>>(
    (accumulator, stage) => {
      const totalMatchesForStage = stage.venues.reduce(
        (sum, venue) => sum + venue.matchesToClear,
        0
      )

      accumulator[stage.tier] += totalMatchesForStage
      return accumulator
    },
    {
      rua: 0,
      bairro: 0,
      zona: 0,
      cidade: 0,
      estado: 0,
      nacional: 0,
      panamericano: 0,
      "jogos-mundiais": 0,
      mundial: 0,
      bonus: 0,
    }
  )

  return {
    stageCount: stages.length,
    venueCount: stages.reduce((sum, stage) => sum + stage.venues.length, 0),
    totalMatches: stages.reduce(
      (sum, stage) =>
        sum + stage.venues.reduce((stageSum, venue) => stageSum + venue.matchesToClear, 0),
      0
    ),
    matchesByTier,
  }
}
