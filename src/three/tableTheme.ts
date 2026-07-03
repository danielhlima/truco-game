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
    | "adega-juca-bigode"
    | "garagem-norte"
    | "quintal-da-leste"
    | "subsolo-do-centro"
    | "salao-da-sul"
    | "centro-convencoes-prefeitura"
    | "ginasio-estadual-maneco-file"
    | "arena-nacional"
    | "casino-me-maior"
    | "centro-americano-truqueiro-medelin"
    | "hotel-truco-segovia-espanha"
    | "orbita-da-lua"
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

const ADEGA_JUCA_BIGODE_THEME: TableTheme = {
  backgroundColor: "#202a2b",
  tableColor: "#7f8680",
  railColor: "#3f342d",
  badgeColor: "#8a3f18",
  emptySlotColor: "#e2e8f0",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#7a4225",
  illustratedTableAsset: "adega-juca-bigode",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.12,
  sceneVignetteStrength: 0.2,
}

const GARAGEM_NORTE_THEME: TableTheme = {
  backgroundColor: "#2e2c27",
  tableColor: "#c4b9aa",
  railColor: "#3f3a34",
  badgeColor: "#7c3f1d",
  emptySlotColor: "#f1eadc",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#77452b",
  illustratedTableAsset: "garagem-norte",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.14,
  sceneVignetteStrength: 0.18,
}

const QUINTAL_LESTE_THEME: TableTheme = {
  backgroundColor: "#3a2f1f",
  tableColor: "#d4bc89",
  railColor: "#6b4a2b",
  badgeColor: "#9a3412",
  emptySlotColor: "#f8e6bf",
  activeSlotColor: "#facc15",
  accentColor: "#d97706",
  tableKind: "steel",
  rustColor: "#8a4b28",
  illustratedTableAsset: "quintal-da-leste",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.13,
  sceneVignetteStrength: 0.16,
}

const SUBSOLO_CENTRO_THEME: TableTheme = {
  backgroundColor: "#201916",
  tableColor: "#6f4424",
  railColor: "#2f2925",
  badgeColor: "#7f1d1d",
  emptySlotColor: "#ead7b3",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#6f3f24",
  illustratedTableAsset: "subsolo-do-centro",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.1,
  sceneVignetteStrength: 0.22,
}

const SALAO_SUL_THEME: TableTheme = {
  backgroundColor: "#2d2118",
  tableColor: "#8a5324",
  railColor: "#4b3422",
  badgeColor: "#8f4d17",
  emptySlotColor: "#f4e1bd",
  activeSlotColor: "#facc15",
  accentColor: "#d97706",
  tableKind: "steel",
  rustColor: "#7c4a26",
  illustratedTableAsset: "salao-da-sul",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.14,
  sceneVignetteStrength: 0.16,
}

const CENTRO_CONVENCOES_PREFEITURA_THEME: TableTheme = {
  backgroundColor: "#25383a",
  tableColor: "#d6c8a8",
  railColor: "#6c6960",
  badgeColor: "#8b2f24",
  emptySlotColor: "#f3ead7",
  activeSlotColor: "#facc15",
  accentColor: "#b45309",
  tableKind: "steel",
  rustColor: "#7a5430",
  illustratedTableAsset: "centro-convencoes-prefeitura",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.08,
  sceneVignetteStrength: 0.12,
}

const GINASIO_ESTADUAL_MANECO_FILE_THEME: TableTheme = {
  backgroundColor: "#162d24",
  tableColor: "#0f4a2d",
  railColor: "#64533c",
  badgeColor: "#8b2f24",
  emptySlotColor: "#e8ddc3",
  activeSlotColor: "#facc15",
  accentColor: "#d4a13f",
  tableKind: "steel",
  rustColor: "#755234",
  illustratedTableAsset: "ginasio-estadual-maneco-file",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.1,
  sceneVignetteStrength: 0.12,
}

const ARENA_NACIONAL_THEME: TableTheme = {
  backgroundColor: "#071822",
  tableColor: "#06351f",
  railColor: "#8a6730",
  badgeColor: "#0f2f4a",
  emptySlotColor: "#f4e6c2",
  activeSlotColor: "#fbbf24",
  accentColor: "#d4af37",
  tableKind: "steel",
  rustColor: "#8b6b2f",
  illustratedTableAsset: "arena-nacional",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.08,
  sceneVignetteStrength: 0.1,
}

const CENTRO_AMERICANO_TRUQUEIRO_MEDELIN_THEME: TableTheme = {
  backgroundColor: "#061b1c",
  tableColor: "#063d3d",
  railColor: "#8b5e2b",
  badgeColor: "#9d174d",
  emptySlotColor: "#f5e7c5",
  activeSlotColor: "#22d3ee",
  accentColor: "#f0b83e",
  tableKind: "steel",
  rustColor: "#8a5c2f",
  illustratedTableAsset: "centro-americano-truqueiro-medelin",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.08,
  sceneVignetteStrength: 0.1,
}

const HOTEL_TRUCO_SEGOVIA_ESPANHA_THEME: TableTheme = {
  backgroundColor: "#1f1712",
  tableColor: "#05352a",
  railColor: "#8b6830",
  badgeColor: "#7f1d1d",
  emptySlotColor: "#f4e7c8",
  activeSlotColor: "#f5c542",
  accentColor: "#d7a946",
  tableKind: "steel",
  rustColor: "#8a5c2f",
  illustratedTableAsset: "hotel-truco-segovia-espanha",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.09,
  sceneVignetteStrength: 0.1,
}

const CASINO_ME_MAIOR_THEME: TableTheme = {
  backgroundColor: "#080706",
  tableColor: "#052f20",
  railColor: "#6f5122",
  badgeColor: "#3f1212",
  emptySlotColor: "#f0dfbd",
  activeSlotColor: "#d4af37",
  accentColor: "#c79b3b",
  tableKind: "steel",
  rustColor: "#70512a",
  illustratedTableAsset: "casino-me-maior",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.07,
  sceneVignetteStrength: 0.1,
}

const LUNAR_ORBIT_THEME: TableTheme = {
  backgroundColor: "#07111f",
  tableColor: "#0f766e",
  railColor: "#3b2568",
  badgeColor: "#be185d",
  emptySlotColor: "#e0f2fe",
  activeSlotColor: "#f9a8d4",
  accentColor: "#22d3ee",
  tableKind: "steel",
  rustColor: "#8b5cf6",
  illustratedTableAsset: "orbita-da-lua",
  illustratedTableScale: 1,
  sceneWarmGlowStrength: 0.12,
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

  if (visualTheme.includes("steel-patio")) {
    return STEEL_PATIO_THEME
  }

  if (visualTheme.includes("metal-patio")) {
    return ADEGA_JUCA_BIGODE_THEME
  }

  if (visualTheme.includes("industrial")) {
    return GARAGEM_NORTE_THEME
  }

  if (visualTheme.includes("zona-leste") || visualTheme.includes("festival")) {
    return QUINTAL_LESTE_THEME
  }

  if (visualTheme.includes("centro") || visualTheme.includes("underground")) {
    return SUBSOLO_CENTRO_THEME
  }

  if (visualTheme.includes("zona-sul")) {
    return SALAO_SUL_THEME
  }

  if (visualTheme.includes("cidade-evento")) {
    return CENTRO_CONVENCOES_PREFEITURA_THEME
  }

  if (visualTheme.includes("estadual-classico")) {
    return GINASIO_ESTADUAL_MANECO_FILE_THEME
  }

  if (visualTheme.includes("nacional-broadcast")) {
    return ARENA_NACIONAL_THEME
  }

  if (visualTheme.includes("panamericano-show")) {
    return CENTRO_AMERICANO_TRUQUEIRO_MEDELIN_THEME
  }

  if (visualTheme.includes("mundial-esportivo")) {
    return HOTEL_TRUCO_SEGOVIA_ESPANHA_THEME
  }

  if (visualTheme.includes("casino-luxo")) {
    return CASINO_ME_MAIOR_THEME
  }

  if (
    visualTheme.includes("sci-fi") ||
    visualTheme.includes("lunar") ||
    visualTheme.includes("intergalactico")
  ) {
    return LUNAR_ORBIT_THEME
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
