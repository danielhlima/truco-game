import type { EconomyReward } from "../../economy/types"
import type { PlayerProfile } from "../../profile/playerProfile"
import type { CampaignStage, CampaignVenue } from "./types"

export interface CampaignResolution {
  profile: PlayerProfile
  currentStage: CampaignStage | null
  currentVenue: CampaignVenue | null
  campaignCompleted: boolean
  unlockedStage?: CampaignStage
  clearedStage?: CampaignStage
  clearedVenue?: CampaignVenue
  rewardsApplied: EconomyReward
}

export function getCurrentCampaignStage(
  profile: PlayerProfile,
  stages: CampaignStage[]
): CampaignStage | null {
  return stages.find((stage) => stage.id === profile.campaign.currentStageId) ?? null
}

export function getCurrentCampaignVenue(
  profile: PlayerProfile,
  stages: CampaignStage[]
): CampaignVenue | null {
  const currentStage = getCurrentCampaignStage(profile, stages)

  if (!currentStage) {
    return null
  }

  return (
    currentStage.venues.find(
      (venue) => !isVenueCleared(profile, venue)
    ) ?? null
  )
}

export function isCampaignCompleted(
  profile: PlayerProfile,
  stages: CampaignStage[]
): boolean {
  return stages.every((stage) =>
    stage.venues.every((venue) => isVenueCleared(profile, venue))
  )
}

export function applyCampaignWin(
  profile: PlayerProfile,
  stages: CampaignStage[]
): CampaignResolution {
  const currentStage = getCurrentCampaignStage(profile, stages)
  const currentVenue = getCurrentCampaignVenue(profile, stages)

  if (!currentStage || !currentVenue) {
    return {
      profile,
      currentStage,
      currentVenue,
      campaignCompleted: isCampaignCompleted(profile, stages),
      rewardsApplied: {},
    }
  }

  const nextVenueWins = {
    ...profile.campaign.venueWinsById,
    [currentVenue.id]: (profile.campaign.venueWinsById[currentVenue.id] ?? 0) + 1,
  }
  const venueJustCleared = nextVenueWins[currentVenue.id] >= currentVenue.matchesToClear
  const nextClearedVenueIds = venueJustCleared && !profile.campaign.clearedVenueIds.includes(currentVenue.id)
    ? [...profile.campaign.clearedVenueIds, currentVenue.id]
    : profile.campaign.clearedVenueIds

  let rewardsApplied: EconomyReward = {}

  if (venueJustCleared) {
    rewardsApplied = mergeRewards(rewardsApplied, currentVenue.reward)
  }

  let completedStageIds = profile.campaign.completedStageIds
  let clearedStage: CampaignStage | undefined
  const stageCompleted = currentStage.venues.every((venue) =>
    nextClearedVenueIds.includes(venue.id)
  )

  if (stageCompleted && !completedStageIds.includes(currentStage.id)) {
    completedStageIds = [...completedStageIds, currentStage.id]
    clearedStage = currentStage
    rewardsApplied = mergeRewards(rewardsApplied, currentStage.reward)
  }

  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStage.id)
  let unlockedStage: CampaignStage | undefined
  let nextStageId = currentStage.id

  if (stageCompleted) {
    const nextStage = stages[currentStageIndex + 1]

    if (nextStage) {
      nextStageId = nextStage.id
      unlockedStage = nextStage
    }
  }

  const nextProfile: PlayerProfile = {
    ...profile,
    currencies: {
      coins: profile.currencies.coins + (rewardsApplied.coins ?? 0),
      gems: profile.currencies.gems + (rewardsApplied.gems ?? 0),
    },
    unlockedItemIds: dedupe([
      ...profile.unlockedItemIds,
      ...(rewardsApplied.unlockIds ?? []),
    ]),
    campaign: {
      ...profile.campaign,
      wins: profile.campaign.wins + 1,
      clearedVenueIds: nextClearedVenueIds,
      completedStageIds,
      venueWinsById: nextVenueWins,
      currentStageId: nextStageId,
    },
  }

  return {
    profile: nextProfile,
    currentStage: getCurrentCampaignStage(nextProfile, stages),
    currentVenue: getCurrentCampaignVenue(nextProfile, stages),
    campaignCompleted: isCampaignCompleted(nextProfile, stages),
    unlockedStage,
    clearedStage,
    clearedVenue: venueJustCleared ? currentVenue : undefined,
    rewardsApplied,
  }
}

export function applyCampaignLoss(
  profile: PlayerProfile,
  stages: CampaignStage[]
): CampaignResolution {
  const nextProfile: PlayerProfile = {
    ...profile,
    campaign: {
      ...profile.campaign,
      losses: profile.campaign.losses + 1,
    },
  }

  return {
    profile: nextProfile,
    currentStage: getCurrentCampaignStage(nextProfile, stages),
    currentVenue: getCurrentCampaignVenue(nextProfile, stages),
    campaignCompleted: isCampaignCompleted(nextProfile, stages),
    rewardsApplied: {},
  }
}

function mergeRewards(base: EconomyReward, extra: EconomyReward): EconomyReward {
  return {
    coins: (base.coins ?? 0) + (extra.coins ?? 0),
    gems: (base.gems ?? 0) + (extra.gems ?? 0),
    unlockIds: dedupe([...(base.unlockIds ?? []), ...(extra.unlockIds ?? [])]),
  }
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)]
}

function isVenueCleared(profile: PlayerProfile, venue: CampaignVenue): boolean {
  return (
    profile.campaign.clearedVenueIds.includes(venue.id) ||
    (profile.campaign.venueWinsById[venue.id] ?? 0) >= venue.matchesToClear
  )
}
