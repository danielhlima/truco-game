import type { StoreProduct, UnlockableItem } from "./types"

export const UNLOCKABLE_ITEMS: UnlockableItem[] = [
  {
    id: "table-boteco-rua",
    category: "table-theme",
    name: "Mesa do Boteco da Rua 12",
    description: "Tema inicial com madeira gasta, copos americanos e clima de boteco.",
    rarity: "common",
  },
  {
    id: "table-cassino-mundial",
    category: "table-theme",
    name: "Mesa do Mundial",
    description: "Tema premium da reta final com acabamento luxuoso.",
    rarity: "epic",
  },
  {
    id: "cards-intergalactico",
    category: "card-back",
    name: "Baralho Intergaláctico",
    description: "Verso especial liberado no conteúdo bônus pós-campanha.",
    rarity: "epic",
  },
]

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "remove-ads",
    type: "remove-ads",
    name: "Sem anúncios",
    description: "Remove anúncios não obrigatórios e mantém o jogo limpo.",
    priceLabel: "Compra única",
  },
  {
    id: "starter-cosmetics",
    type: "cosmetic-pack",
    name: "Pacote Raiz",
    description: "Pacote inicial com mesa e visuais inspirados em boteco de bairro.",
    priceLabel: "R$ 9,90",
    rewards: {
      unlockIds: ["table-boteco-rua"],
    },
  },
  {
    id: "premium-currency-small",
    type: "premium",
    name: "Punhado de gemas",
    description: "Moeda premium para cosméticos e expansões futuras.",
    priceLabel: "R$ 4,90",
    rewards: {
      gems: 50,
    },
  },
]
