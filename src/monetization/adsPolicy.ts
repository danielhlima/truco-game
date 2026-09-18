export const FIRST_AD_VENUE_ID = "bar-maneco-banguela"
export const NO_AD_VENUE_ID = "bar-do-ze-catinga"
export const MATCHES_BETWEEN_INTERSTITIALS = 2
// Temporarily disabled to validate the every-two-matches cadence on device.
export const INTERSTITIAL_COOLDOWN_MS = 0

export type MatchAdDecision = {
  shouldCount: boolean
  shouldShow: boolean
}

export function decideInterstitialAfterMatch(input: {
  venueId?: string
  eligibleMatchCount: number
  now: number
  lastShownAt: number | null
}): MatchAdDecision {
  if (!input.venueId || input.venueId === NO_AD_VENUE_ID) {
    return { shouldCount: false, shouldShow: false }
  }

  const nextCount = input.eligibleMatchCount + 1
  // The first eligible match shows an ad; subsequent ads keep a two-match interval.
  const intervalReached = (nextCount - 1) % MATCHES_BETWEEN_INTERSTITIALS === 0
  const cooldownElapsed =
    input.lastShownAt === null || input.now - input.lastShownAt >= INTERSTITIAL_COOLDOWN_MS

  return {
    shouldCount: true,
    shouldShow: intervalReached && cooldownElapsed,
  }
}
