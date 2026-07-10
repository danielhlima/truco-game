import test from "node:test"
import assert from "node:assert/strict"
import {
  applyFreePlayRunWin,
  createFreePlayRun,
  getFreePlayRunCurrentVenue,
} from "../../src/career/campaign/freePlayProgression.ts"
import { CAMPAIGN_STAGES } from "../../src/career/campaign/campaignData.ts"

const botecosStage = CAMPAIGN_STAGES.find((stage) => stage.id === "rua-periferia")

test("modo livre começa circuito pelo primeiro bar", () => {
  assert.ok(botecosStage)

  const run = createFreePlayRun(botecosStage)

  assert.equal(run?.stageId, "rua-periferia")
  assert.equal(run?.currentVenueId, "bar-do-ze-catinga")
  assert.equal(getFreePlayRunCurrentVenue(run, CAMPAIGN_STAGES)?.id, "bar-do-ze-catinga")
})

test("modo livre avança para o próximo bar ao cumprir as vitórias do local", () => {
  assert.ok(botecosStage)

  let run = createFreePlayRun(botecosStage)
  assert.ok(run)

  for (let i = 0; i < 2; i++) {
    const resolution = applyFreePlayRunWin(run, CAMPAIGN_STAGES)
    run = resolution.run

    assert.ok(run)
    assert.equal(run.currentVenueId, "bar-do-ze-catinga")
    assert.equal(resolution.clearedVenue, undefined)
  }

  const resolution = applyFreePlayRunWin(run, CAMPAIGN_STAGES)

  assert.equal(resolution.clearedVenue?.id, "bar-do-ze-catinga")
  assert.equal(resolution.nextVenue?.id, "bar-maneco-banguela")
  assert.equal(resolution.run?.currentVenueId, "bar-maneco-banguela")
})

test("modo livre encerra o circuito depois do último bar", () => {
  assert.ok(botecosStage)

  let run = createFreePlayRun(botecosStage)
  assert.ok(run)

  for (let i = 0; i < botecosStage.venues[0].matchesToClear; i++) {
    run = applyFreePlayRunWin(run, CAMPAIGN_STAGES).run
    assert.ok(run)
  }

  for (let i = 0; i < botecosStage.venues[1].matchesToClear - 1; i++) {
    const resolution = applyFreePlayRunWin(run, CAMPAIGN_STAGES)
    run = resolution.run
    assert.ok(run)
    assert.equal(resolution.stageCompleted, false)
  }

  const resolution = applyFreePlayRunWin(run, CAMPAIGN_STAGES)

  assert.equal(resolution.clearedVenue?.id, "bar-maneco-banguela")
  assert.equal(resolution.stageCompleted, true)
  assert.equal(resolution.run, null)
})
