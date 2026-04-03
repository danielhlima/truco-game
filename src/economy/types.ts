export type CurrencyId = "coins" | "gems"

export interface CurrencyWallet {
  coins: number
  gems: number
}

export interface EconomyReward {
  coins?: number
  gems?: number
  unlockIds?: string[]
}

export interface UnlockableItem {
  id: string
  category: "table-theme" | "card-back" | "sound-pack" | "cutscene-pack"
  name: string
  description: string
  rarity: "common" | "rare" | "epic"
}

export interface StoreProduct {
  id: string
  type: "premium" | "remove-ads" | "cosmetic-pack"
  name: string
  description: string
  priceLabel: string
  rewards?: EconomyReward
}
