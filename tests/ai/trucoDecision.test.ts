import test from "node:test"
import assert from "node:assert/strict"
import {
  getTeamPartnerAdvice,
  getTeamTrucoDecision,
  respondToRaise,
  shouldRaiseBet,
} from "../../src/ai/trucoDecision.ts"
import { getRuleSet } from "../../src/game/getRuleSet.ts"
import { createCard } from "../helpers/gameFixtures.ts"

const ruleSet = getRuleSet("MINEIRO")

test("perfil conservador pede truco menos que o balanced com mão média", () => {
  const mediumHand = [
    createCard("A", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 1, undefined, "balanced"), true)
  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 1, undefined, "conservative"), false)
})

test("perfil conservador corre de truco com mão fraca onde o balanced aceitaria", () => {
  const weakishHand = [
    createCard("A", "copas"),
    createCard("7", "espada"),
    createCard("4", "ouros"),
  ]

  assert.equal(respondToRaise(ruleSet, weakishHand, 3, undefined, "balanced"), "accept")
  assert.equal(respondToRaise(ruleSet, weakishHand, 3, undefined, "conservative"), "run")
})

test("perfil conservador evita contra-aumento com dupla só razoável", () => {
  const teamHands = [
    [createCard("2", "ouros"), createCard("K", "espada"), createCard("Q", "copas")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "balanced"), "raise")
  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "conservative"), "accept")
})

test("perfil conservador orienta correr onde o balanced ainda vê jogo", () => {
  const teamHands = [
    [createCard("A", "copas"), createCard("7", "espada"), createCard("4", "ouros")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamPartnerAdvice(ruleSet, teamHands, 3, undefined, "balanced"), "CÊ QUE SABE!")
  assert.equal(getTeamPartnerAdvice(ruleSet, teamHands, 3, undefined, "conservative"), "MELHOR CORRER!")
})
