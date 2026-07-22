export type GameVariant = "MINEIRO" | "PAULISTA"

export const DEFAULT_TRUCO_VARIANT: GameVariant = "PAULISTA"

export function getGameVariantLabel(variant: GameVariant): string {
  return variant === "PAULISTA" ? "Truco Paulista" : "Truco Mineiro"
}
