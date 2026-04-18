import type { CurrencyWallet } from "../economy/types"

export interface CampaignProgress {
  currentStageId: string
  clearedVenueIds: string[]
  completedStageIds: string[]
  venueWinsById: Record<string, number>
  selectedPartnerCharacterIdByVenueId: Record<string, string>
  wins: number
  losses: number
}

export interface PlayerProfile {
  displayName: string
  currencies: CurrencyWallet
  unlockedItemIds: string[]
  campaign: CampaignProgress
  settings: {
    adsRemoved: boolean
    selectedTableThemeId?: string
  }
}

export function createInitialPlayerProfile(): PlayerProfile {
  return {
    displayName: "Jogador",
    currencies: {
      coins: 0,
      gems: 0,
    },
    unlockedItemIds: ["table-boteco-rua"],
    campaign: {
      currentStageId: "rua-periferia",
      clearedVenueIds: [],
      completedStageIds: [],
      venueWinsById: {},
      selectedPartnerCharacterIdByVenueId: {},
      wins: 0,
      losses: 0,
    },
    settings: {
      adsRemoved: false,
      selectedTableThemeId: "table-boteco-rua",
    },
  }
}

export const INITIAL_PLAYER_PROFILE: PlayerProfile = createInitialPlayerProfile()
