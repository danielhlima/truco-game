import type { Card } from "./card"
import type { GameVariant } from "./variant"

export function getVira(deck: Card[], variant: GameVariant): Card | undefined {
  if (variant !== "PAULISTA") {
    return undefined
  }

  const vira = deck.pop()

  if (!vira) {
    throw new Error("Não foi possível gerar a vira")
  }

  return vira
}