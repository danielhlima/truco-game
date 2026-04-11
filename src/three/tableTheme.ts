export interface TableTheme {
  backgroundColor: string
  tableColor: string
  railColor: string
  badgeColor: string
  emptySlotColor: string
  activeSlotColor: string
  accentColor: string
  tableKind: "steel" | "felt"
  rustColor: string
  illustratedTableAsset?:
    | "rust-classic"
    | "maneco-wood"
    | "wood-street"
    | "steel-patio"
  illustratedTableScale?: number
  illustratedTableOffsetX?: number
  illustratedTableOffsetY?: number
}

const STREET_THEME: TableTheme = {
  backgroundColor: "#30241e",
  tableColor: "#d4d0c8",
  railColor: "#7c6f66",
  badgeColor: "#9a3412",
  emptySlotColor: "#f5f5f4",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#8a4b28",
  illustratedTableAsset: "rust-classic",
  illustratedTableScale: 1,
}

const STREET_CLEAN_THEME: TableTheme = {
  backgroundColor: "#33241b",
  tableColor: "#ddd3c5",
  railColor: "#7e5a3c",
  badgeColor: "#9a3412",
  emptySlotColor: "#f5f5f4",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#9a5a2c",
  illustratedTableAsset: "maneco-wood",
  illustratedTableScale: 1,
}

const WOOD_STREET_THEME: TableTheme = {
  backgroundColor: "#2f231c",
  tableColor: "#78614d",
  railColor: "#4f3727",
  badgeColor: "#7c2d12",
  emptySlotColor: "#ead9c2",
  activeSlotColor: "#f59e0b",
  accentColor: "#9a3412",
  tableKind: "steel",
  rustColor: "#6f4b34",
  illustratedTableAsset: "wood-street",
  illustratedTableScale: 1.03,
}

const STEEL_PATIO_THEME: TableTheme = {
  backgroundColor: "#26333a",
  tableColor: "#95a6ad",
  railColor: "#53443a",
  badgeColor: "#9a3412",
  emptySlotColor: "#e2e8f0",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#8a4b28",
  illustratedTableAsset: "steel-patio",
  illustratedTableScale: 1.38,
}

const NEON_THEME: TableTheme = {
  backgroundColor: "#111827",
  tableColor: "#0f766e",
  railColor: "#0f172a",
  badgeColor: "#db2777",
  emptySlotColor: "#bae6fd",
  activeSlotColor: "#f9a8d4",
  accentColor: "#22d3ee",
  tableKind: "felt",
  rustColor: "#7c3aed",
}

const PREMIUM_THEME: TableTheme = {
  backgroundColor: "#1f2937",
  tableColor: "#14532d",
  railColor: "#854d0e",
  badgeColor: "#7c2d12",
  emptySlotColor: "#fef3c7",
  activeSlotColor: "#fde68a",
  accentColor: "#fbbf24",
  tableKind: "felt",
  rustColor: "#92400e",
}

export function getTableTheme(visualTheme?: string): TableTheme {
  if (!visualTheme) {
    return STREET_THEME
  }

  if (visualTheme.includes("madeira-suja")) {
    return WOOD_STREET_THEME
  }

  if (visualTheme.includes("metal-patio")) {
    return STEEL_PATIO_THEME
  }

  if (visualTheme.includes("claro")) {
    return STREET_CLEAN_THEME
  }

  if (
    visualTheme.includes("premium") ||
    visualTheme.includes("cassino") ||
    visualTheme.includes("mundial")
  ) {
    return PREMIUM_THEME
  }

  if (
    visualTheme.includes("noite") ||
    visualTheme.includes("festival") ||
    visualTheme.includes("show") ||
    visualTheme.includes("underground")
  ) {
    return NEON_THEME
  }

  return STREET_THEME
}
