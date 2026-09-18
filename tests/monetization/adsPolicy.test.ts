import test from "node:test"
import assert from "node:assert/strict"
import {
  decideInterstitialAfterMatch,
  NO_AD_VENUE_ID,
  FIRST_AD_VENUE_ID,
} from "../../src/monetization/adsPolicy"

test("não conta nem exibe anúncio no Bar do Zé Catinga", () => {
  const decision = decideInterstitialAfterMatch({
    venueId: NO_AD_VENUE_ID,
    eligibleMatchCount: 10,
    now: 100_000,
    lastShownAt: null,
  })

  assert.deepEqual(decision, { shouldCount: false, shouldShow: false })
})

test("a primeira partida elegível no Maneco exibe anúncio", () => {
  const decision = decideInterstitialAfterMatch({
    venueId: FIRST_AD_VENUE_ID,
    eligibleMatchCount: 0,
    now: 100_000,
    lastShownAt: null,
  })

  assert.deepEqual(decision, { shouldCount: true, shouldShow: true })
})

test("aguarda duas partidas após o primeiro anúncio antes de exibir novamente", () => {
  const decision = decideInterstitialAfterMatch({
    venueId: FIRST_AD_VENUE_ID,
    eligibleMatchCount: 1,
    now: 100_000,
    lastShownAt: null,
  })

  assert.deepEqual(decision, { shouldCount: true, shouldShow: false })

  const thirdEligibleMatch = decideInterstitialAfterMatch({
    venueId: FIRST_AD_VENUE_ID,
    eligibleMatchCount: 2,
    now: 100_000,
    lastShownAt: null,
  })

  assert.deepEqual(thirdEligibleMatch, { shouldCount: true, shouldShow: true })
})
