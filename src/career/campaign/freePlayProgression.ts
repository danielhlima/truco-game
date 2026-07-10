import type { CampaignStage, CampaignVenue } from "./types"

export interface FreePlayRunState {
  stageId: string
  currentVenueId: string
  completedVenueIds: string[]
  venueWinsById: Record<string, number>
}

export interface FreePlayRunResolution {
  run: FreePlayRunState | null
  stage: CampaignStage | null
  currentVenue: CampaignVenue | null
  clearedVenue?: CampaignVenue
  nextVenue?: CampaignVenue
  stageCompleted: boolean
}

export function createFreePlayRun(stage: CampaignStage): FreePlayRunState | null {
  const firstVenue = stage.venues[0]

  if (!firstVenue) {
    return null
  }

  return {
    stageId: stage.id,
    currentVenueId: firstVenue.id,
    completedVenueIds: [],
    venueWinsById: {},
  }
}

export function getFreePlayRunStage(
  run: FreePlayRunState | null,
  stages: CampaignStage[]
): CampaignStage | null {
  if (!run) {
    return null
  }

  return stages.find((stage) => stage.id === run.stageId) ?? null
}

export function getFreePlayRunCurrentVenue(
  run: FreePlayRunState | null,
  stages: CampaignStage[]
): CampaignVenue | null {
  if (!run) {
    return null
  }

  const stage = getFreePlayRunStage(run, stages)

  return stage?.venues.find((venue) => venue.id === run.currentVenueId) ?? null
}

export function applyFreePlayRunWin(
  run: FreePlayRunState,
  stages: CampaignStage[]
): FreePlayRunResolution {
  const stage = getFreePlayRunStage(run, stages)
  const currentVenue = getFreePlayRunCurrentVenue(run, stages)

  if (!stage || !currentVenue) {
    return {
      run,
      stage,
      currentVenue,
      stageCompleted: false,
    }
  }

  const nextVenueWins = {
    ...run.venueWinsById,
    [currentVenue.id]: (run.venueWinsById[currentVenue.id] ?? 0) + 1,
  }
  const venueJustCleared = nextVenueWins[currentVenue.id] >= currentVenue.matchesToClear

  if (!venueJustCleared) {
    return {
      run: {
        ...run,
        venueWinsById: nextVenueWins,
      },
      stage,
      currentVenue,
      stageCompleted: false,
    }
  }

  const completedVenueIds = run.completedVenueIds.includes(currentVenue.id)
    ? run.completedVenueIds
    : [...run.completedVenueIds, currentVenue.id]
  const currentVenueIndex = stage.venues.findIndex((venue) => venue.id === currentVenue.id)
  const nextVenue = currentVenueIndex >= 0 ? stage.venues[currentVenueIndex + 1] ?? null : null

  if (!nextVenue) {
    return {
      run: null,
      stage,
      currentVenue: null,
      clearedVenue: currentVenue,
      stageCompleted: true,
    }
  }

  return {
    run: {
      ...run,
      currentVenueId: nextVenue.id,
      completedVenueIds,
      venueWinsById: nextVenueWins,
    },
    stage,
    currentVenue: nextVenue,
    clearedVenue: currentVenue,
    nextVenue,
    stageCompleted: false,
  }
}
