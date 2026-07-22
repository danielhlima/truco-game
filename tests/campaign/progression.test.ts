import test from "node:test"
import assert from "node:assert/strict"
import { CAMPAIGN_STAGES } from "../../src/career/campaign/campaignData.ts"
import { getAiTrucoPersonalityIdForDifficulty } from "../../src/ai/trucoPersonalities.ts"
import {
  applyCampaignLoss,
  applyCampaignWin,
  getCurrentCampaignStage,
  getCurrentCampaignVenue,
  isCampaignCompleted,
} from "../../src/career/campaign/progression.ts"
import {
  createInitialPlayerProfile,
  INITIAL_PLAYER_PROFILE,
} from "../../src/profile/playerProfile.ts"
import {
  loadPlayerProfile,
  resetPlayerProfileStorage,
  savePlayerProfile,
} from "../../src/platform/storage/profileStorage.ts"
import {
  STARTER_PARTNER_CHARACTER_IDS,
  getPartnerAdviceSkillLevel,
} from "../../src/content/partnerProgression.ts"
import { installWindowLocalStorageMock } from "../helpers/storageMock.ts"

test("a campanha começa no primeiro boteco da rua", () => {
  const profile = createInitialPlayerProfile()

  const stage = getCurrentCampaignStage(profile, CAMPAIGN_STAGES)
  const venue = getCurrentCampaignVenue(profile, CAMPAIGN_STAGES)

  assert.equal(stage?.id, "rua-periferia")
  assert.equal(venue?.id, "bar-do-ze-catinga")
})

test("cada local declara dupla adversária fixa e estado visual mínimo", () => {
  const opponentVenueByCharacterId = new Map<string, string>()

  for (const stage of CAMPAIGN_STAGES) {
    for (const venue of stage.venues) {
      assert.equal(venue.opponentCharacterIds.length, 2, venue.id)
      assert.notEqual(venue.opponentCharacterIds[0], venue.opponentCharacterIds[1], venue.id)
      assert.deepEqual(venue.partnerUnlockCharacterIds, venue.opponentCharacterIds, venue.id)
      assert.ok(venue.minimumVisualState.length > 0, venue.id)

      for (const characterId of venue.opponentCharacterIds) {
        assert.equal(
          opponentVenueByCharacterId.get(characterId),
          undefined,
          `${characterId} não pode se repetir em ${venue.id}`
        )
        opponentVenueByCharacterId.set(characterId, venue.id)
      }
    }
  }
})

test("os quatro primeiros bares seguem o caminho vertical planejado", () => {
  const route = CAMPAIGN_STAGES.flatMap((stage) =>
    stage.venues.map((venue) => ({
      stage: stage.name,
      venue,
    }))
  )

  const firstPlayableVenues = route.slice(0, 4).map(({ stage, venue }) => ({
    stage,
    id: venue.id,
    name: venue.name,
    visualTheme: venue.visualTheme,
    variant: venue.variant,
    difficulty: venue.difficulty.aiLevel,
    opponents: venue.opponentCharacterIds,
    wins: venue.matchesToClear,
  }))

  assert.deepEqual(firstPlayableVenues, [
    {
      stage: "Botecos da Rua",
      id: "bar-do-ze-catinga",
      name: "Bar do Zé Catinga",
      visualTheme: "boteco-raiz-ze-catinga-photo",
      variant: "PAULISTA",
      difficulty: 1,
      opponents: ["tiao-casca-grossa", "cida-fumaca"],
      wins: 3,
    },
    {
      stage: "Botecos da Rua",
      id: "bar-maneco-banguela",
      name: "Bar Maneco Banguela",
      visualTheme: "boteco-raiz-claro",
      variant: "PAULISTA",
      difficulty: 1,
      opponents: ["tonhao-rasga-lata", "patricia-monique"],
      wins: 4,
    },
    {
      stage: "Campeonato da Vila Naná",
      id: "trem-do-jaca",
      name: "Trem do Jaça",
      visualTheme: "bairro-madeira-suja",
      variant: "PAULISTA",
      difficulty: 2,
      opponents: ["naldo-tramela", "dalva-seringa"],
      wins: 5,
    },
    {
      stage: "Campeonato da Vila Naná",
      id: "adega-do-juca-bigode",
      name: "Adega do Juca Bigode",
      visualTheme: "bairro-metal-patio",
      variant: "PAULISTA",
      difficulty: 2,
      opponents: ["biu-caolho", "aninha-passarela"],
      wins: 6,
    },
  ])
})

test("personalidade de truco dos adversários escala pela dificuldade do bar", () => {
  const personalitiesByVenueId = Object.fromEntries(
    CAMPAIGN_STAGES.flatMap((stage) => stage.venues).map((venue) => [
      venue.id,
      getAiTrucoPersonalityIdForDifficulty(venue.difficulty),
    ])
  )

  assert.deepEqual(personalitiesByVenueId, {
    "bar-do-ze-catinga": "ultra_conservative",
    "bar-maneco-banguela": "cautious",
    "trem-do-jaca": "conservative",
    "adega-do-juca-bigode": "disciplined",
    "zona-norte-garagem": "balanced",
    "zona-leste-quintal": "opportunistic",
    "centro-subsolo": "balanced",
    "zona-sul-salao": "balanced",
    "centro-convencoes-prefeitura": "assertive",
    "ginasio-estadual-maneco-file": "assertive",
    "arena-nacional": "crafty",
    "centro-americano-truqueiro-medelin": "crafty",
    "hotel-truco-segovia-espanha": "trickster",
    "casino-me-maior": "trickster",
    "orbita-da-lua": "trickster",
  })
})

test("todos os bares da campanha usam Truco Paulista como padrão", () => {
  const variantsByVenueId = Object.fromEntries(
    CAMPAIGN_STAGES.flatMap((stage) => stage.venues).map((venue) => [venue.id, venue.variant])
  )

  assert.deepEqual(
    Object.values(variantsByVenueId),
    Array(Object.keys(variantsByVenueId).length).fill("PAULISTA")
  )
})

test("parceiros iniciais não antecipam adversários de bares futuros", () => {
  const opponentCharacterIds = new Set(
    CAMPAIGN_STAGES.flatMap((stage) =>
      stage.venues.flatMap((venue) => venue.opponentCharacterIds)
    )
  )

  for (const characterId of STARTER_PARTNER_CHARACTER_IDS) {
    assert.equal(opponentCharacterIds.has(characterId), false, characterId)
  }
})

test("inteligência de leitura das parcerias cresce com desbloqueios da campanha", () => {
  assert.equal(getPartnerAdviceSkillLevel("nega-catimbo"), 1)
  assert.equal(getPartnerAdviceSkillLevel("tiao-casca-grossa"), 1)
  assert.equal(getPartnerAdviceSkillLevel("naldo-tramela"), 2)
  assert.equal(getPartnerAdviceSkillLevel("dito-marrua"), 3)
  assert.equal(getPartnerAdviceSkillLevel("jura-pancada"), 4)
  assert.equal(getPartnerAdviceSkillLevel("mina-compasso"), 5)
  assert.equal(getPartnerAdviceSkillLevel("cosme-orbita"), 5)
})

test("vitórias parciais contam para o local, mas não o concluem antes da meta", () => {
  let profile = createInitialPlayerProfile()

  profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile

  assert.equal(profile.campaign.venueWinsById["bar-do-ze-catinga"], 2)
  assert.deepEqual(profile.campaign.clearedVenueIds, [])
  assert.deepEqual(profile.campaign.unlockedPartnerCharacterIds, [])
  assert.equal(profile.currencies.coins, 0)
  assert.equal(getCurrentCampaignVenue(profile, CAMPAIGN_STAGES)?.id, "bar-do-ze-catinga")
})

test("ao concluir um local, a campanha libera o próximo e aplica a recompensa do local", () => {
  let profile = createInitialPlayerProfile()

  profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  const resolution = applyCampaignWin(profile, CAMPAIGN_STAGES)

  assert.equal(resolution.clearedVenue?.id, "bar-do-ze-catinga")
  assert.equal(resolution.profile.currencies.coins, 40)
  assert.ok(resolution.profile.campaign.clearedVenueIds.includes("bar-do-ze-catinga"))
  assert.deepEqual(resolution.profile.campaign.unlockedPartnerCharacterIds, [
    "tiao-casca-grossa",
    "cida-fumaca",
  ])
  assert.equal(getCurrentCampaignVenue(resolution.profile, CAMPAIGN_STAGES)?.id, "bar-maneco-banguela")
})

test("ao concluir todos os locais da etapa, a próxima etapa é liberada com recompensa de etapa", () => {
  let profile = createInitialPlayerProfile()

  for (let i = 0; i < 3; i++) {
    profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  }

  let resolution
  for (let i = 0; i < 4; i++) {
    resolution = applyCampaignWin(profile, CAMPAIGN_STAGES)
    profile = resolution.profile
  }

  assert.equal(resolution?.clearedStage?.id, "rua-periferia")
  assert.equal(resolution?.unlockedStage?.id, "campeonato-vila-nana")
  assert.equal(profile.campaign.currentStageId, "campeonato-vila-nana")
  assert.ok(profile.campaign.completedStageIds.includes("rua-periferia"))
  assert.equal(profile.currencies.coins, 40 + 55 + 150)
})

test("derrota na campanha conta no perfil, mas não avança o local", () => {
  const resolution = applyCampaignLoss(createInitialPlayerProfile(), CAMPAIGN_STAGES)

  assert.equal(resolution.profile.campaign.losses, 1)
  assert.equal(resolution.profile.campaign.currentStageId, "rua-periferia")
  assert.equal(resolution.currentVenue?.id, "bar-do-ze-catinga")
})

test("criar perfil inicial sempre devolve campanha zerada", () => {
  const profile = createInitialPlayerProfile()

  assert.deepEqual(profile.campaign, INITIAL_PLAYER_PROFILE.campaign)
  assert.deepEqual(profile.currencies, { coins: 0, gems: 0 })
  assert.equal(profile.settings.trucoVariant, "PAULISTA")
})

test("é possível concluir uma etapa inteira e começar a próxima acumulando vitórias por local", () => {
  let profile = createInitialPlayerProfile()

  for (let i = 0; i < 3; i++) {
    profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  }

  for (let i = 0; i < 4; i++) {
    profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  }

  assert.equal(profile.campaign.currentStageId, "campeonato-vila-nana")
  assert.ok(profile.campaign.completedStageIds.includes("rua-periferia"))
  assert.equal(getCurrentCampaignVenue(profile, CAMPAIGN_STAGES)?.id, "trem-do-jaca")
})

test("o caminho completo avança por todos os locais declarados", () => {
  let profile = createInitialPlayerProfile()
  const totalMatches = CAMPAIGN_STAGES.flatMap((stage) => stage.venues)
    .reduce((sum, venue) => sum + venue.matchesToClear, 0)

  for (let i = 0; i < totalMatches; i++) {
    profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  }

  assert.equal(profile.campaign.wins, totalMatches)
  assert.equal(getCurrentCampaignVenue(profile, CAMPAIGN_STAGES), null)
  assert.equal(isCampaignCompleted(profile, CAMPAIGN_STAGES), true)
})

test("storage salva, carrega e reseta o perfil da campanha", () => {
  const { cleanup } = installWindowLocalStorageMock()

  try {
    const profile = createInitialPlayerProfile()
    profile.campaign.wins = 7
    profile.campaign.venueWinsById["bar-do-ze-catinga"] = 2
    profile.campaign.unlockedPartnerCharacterIds = ["cida-fumaca"]
    profile.currencies.coins = 123
    profile.settings.selectedPlayerSkinId = "akemi-corte-certo"
    profile.settings.trucoVariant = "MINEIRO"

    savePlayerProfile(profile)

    const loadedProfile = loadPlayerProfile()
    assert.equal(loadedProfile.campaign.wins, 7)
    assert.equal(loadedProfile.campaign.venueWinsById["bar-do-ze-catinga"], 2)
    assert.deepEqual(loadedProfile.campaign.unlockedPartnerCharacterIds, ["cida-fumaca"])
    assert.equal(loadedProfile.currencies.coins, 123)
    assert.equal(loadedProfile.settings.selectedPlayerSkinId, "akemi-corte-certo")
    assert.equal(loadedProfile.settings.trucoVariant, "MINEIRO")

    resetPlayerProfileStorage()

    const resetProfile = loadPlayerProfile()
    assert.deepEqual(resetProfile.campaign, INITIAL_PLAYER_PROFILE.campaign)
    assert.deepEqual(resetProfile.currencies, INITIAL_PLAYER_PROFILE.currencies)
    assert.equal(resetProfile.settings.trucoVariant, "PAULISTA")
    assert.equal(resetProfile.settings.selectedPlayerSkinId, undefined)
  } finally {
    cleanup()
  }
})

test("storage descarta perfis persistidos na chave legada", () => {
  const { cleanup, localStorage } = installWindowLocalStorageMock()

  try {
    const legacyProfile = createInitialPlayerProfile()
    legacyProfile.campaign.wins = 7
    legacyProfile.campaign.selectedPartnerCharacterIdByVenueId["bar-do-ze-catinga"] = "ze-catinga"
    localStorage.setItem("truco-game.player-profile", JSON.stringify(legacyProfile))

    const loadedProfile = loadPlayerProfile()

    assert.deepEqual(loadedProfile.campaign, INITIAL_PLAYER_PROFILE.campaign)
    assert.equal(localStorage.getItem("truco-game.player-profile"), null)
  } finally {
    cleanup()
  }
})
