import test from "node:test"
import assert from "node:assert/strict"
import { CAMPAIGN_STAGES } from "../../src/career/campaign/campaignData.ts"
import {
  applyCampaignLoss,
  applyCampaignWin,
  getCurrentCampaignStage,
  getCurrentCampaignVenue,
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
import { installWindowLocalStorageMock } from "../helpers/storageMock.ts"

test("a campanha começa no primeiro boteco da rua", () => {
  const profile = createInitialPlayerProfile()

  const stage = getCurrentCampaignStage(profile, CAMPAIGN_STAGES)
  const venue = getCurrentCampaignVenue(profile, CAMPAIGN_STAGES)

  assert.equal(stage?.id, "rua-periferia")
  assert.equal(venue?.id, "bar-do-ze-catinga")
})

test("vitórias parciais contam para o local, mas não o concluem antes da meta", () => {
  let profile = createInitialPlayerProfile()

  profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile

  assert.equal(profile.campaign.venueWinsById["bar-do-ze-catinga"], 2)
  assert.deepEqual(profile.campaign.clearedVenueIds, [])
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
  assert.equal(resolution?.unlockedStage?.id, "circuito-bairro")
  assert.equal(profile.campaign.currentStageId, "circuito-bairro")
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
})

test("é possível concluir uma etapa inteira e começar a próxima acumulando vitórias por local", () => {
  let profile = createInitialPlayerProfile()

  for (let i = 0; i < 3; i++) {
    profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  }

  for (let i = 0; i < 4; i++) {
    profile = applyCampaignWin(profile, CAMPAIGN_STAGES).profile
  }

  assert.equal(profile.campaign.currentStageId, "circuito-bairro")
  assert.ok(profile.campaign.completedStageIds.includes("rua-periferia"))
  assert.equal(getCurrentCampaignVenue(profile, CAMPAIGN_STAGES)?.id, "mercearia-central")
})

test("storage salva, carrega e reseta o perfil da campanha", () => {
  const { cleanup } = installWindowLocalStorageMock()

  try {
    const profile = createInitialPlayerProfile()
    profile.campaign.wins = 7
    profile.campaign.venueWinsById["bar-do-ze-catinga"] = 2
    profile.currencies.coins = 123

    savePlayerProfile(profile)

    const loadedProfile = loadPlayerProfile()
    assert.equal(loadedProfile.campaign.wins, 7)
    assert.equal(loadedProfile.campaign.venueWinsById["bar-do-ze-catinga"], 2)
    assert.equal(loadedProfile.currencies.coins, 123)

    resetPlayerProfileStorage()

    const resetProfile = loadPlayerProfile()
    assert.deepEqual(resetProfile.campaign, INITIAL_PLAYER_PROFILE.campaign)
    assert.deepEqual(resetProfile.currencies, INITIAL_PLAYER_PROFILE.currencies)
  } finally {
    cleanup()
  }
})
