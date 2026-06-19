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
    | "ze-catinga-photo"
    | "maneco-wood"
    | "trem-jaca"
    | "wood-street"
    | "steel-patio"
  illustratedTableScale?: number
  illustratedTableOffsetX?: number
  illustratedTableOffsetY?: number
  sceneWarmGlowStrength?: number
  sceneVignetteStrength?: number
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
  sceneWarmGlowStrength: 0.16,
  sceneVignetteStrength: 0.26,
}

const ZE_CATINGA_PHOTO_THEME: TableTheme = {
  backgroundColor: "#2d211b",
  tableColor: "#5c4333",
  railColor: "#3a2a20",
  badgeColor: "#9a3412",
  emptySlotColor: "#f5f5f4",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#7a4a2f",
  illustratedTableAsset: "ze-catinga-photo",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.22,
  sceneVignetteStrength: 0.24,
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
  sceneWarmGlowStrength: 0.18,
  sceneVignetteStrength: 0.22,
}

const TREM_JACA_THEME: TableTheme = {
  backgroundColor: "#3d2b1d",
  tableColor: "#b8792e",
  railColor: "#6b4728",
  badgeColor: "#8f4d17",
  emptySlotColor: "#f4e1bd",
  activeSlotColor: "#facc15",
  accentColor: "#b7791f",
  tableKind: "steel",
  rustColor: "#8a5a2c",
  illustratedTableAsset: "trem-jaca",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.16,
  sceneVignetteStrength: 0.2,
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
  sceneWarmGlowStrength: 0.1,
  sceneVignetteStrength: 0.18,
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
  sceneWarmGlowStrength: 0.12,
  sceneVignetteStrength: 0.2,
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
  sceneWarmGlowStrength: 0.18,
  sceneVignetteStrength: 0.18,
}

export function getTableTheme(visualTheme?: string): TableTheme {
  if (!visualTheme) {
    return STREET_THEME
  }

  if (visualTheme.includes("ze-catinga-photo")) {
    return ZE_CATINGA_PHOTO_THEME
  }

  if (visualTheme.includes("madeira-suja")) {
    return TREM_JACA_THEME
  }

  if (visualTheme.includes("metal-patio")) {
    return STEEL_PATIO_THEME
  }

  if (visualTheme.includes("claro")) {
    return STREET_CLEAN_THEME
  }

  if (
    visualTheme.includes("premium") ||
    visualTheme.includes("casino") ||
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
