import {
  createInitialPlayerProfile,
  type PlayerProfile,
} from "../../profile/playerProfile"

const PLAYER_PROFILE_STORAGE_KEY = "truco-game.player-profile"

export function loadPlayerProfile(): PlayerProfile {
  const initialProfile = createInitialPlayerProfile()

  if (typeof window === "undefined") {
    return initialProfile
  }

  const rawValue = window.localStorage.getItem(PLAYER_PROFILE_STORAGE_KEY)

  if (!rawValue) {
    return initialProfile
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PlayerProfile>

    return {
      ...initialProfile,
      ...parsed,
      currencies: {
        ...initialProfile.currencies,
        ...parsed.currencies,
      },
      campaign: {
        ...initialProfile.campaign,
        ...parsed.campaign,
        venueWinsById: {
          ...initialProfile.campaign.venueWinsById,
          ...parsed.campaign?.venueWinsById,
        },
      },
      settings: {
        ...initialProfile.settings,
        ...parsed.settings,
      },
      unlockedItemIds: parsed.unlockedItemIds ?? initialProfile.unlockedItemIds,
    }
  } catch {
    return initialProfile
  }
}

export function savePlayerProfile(profile: PlayerProfile) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(PLAYER_PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

export function resetPlayerProfileStorage() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(PLAYER_PROFILE_STORAGE_KEY)
}
