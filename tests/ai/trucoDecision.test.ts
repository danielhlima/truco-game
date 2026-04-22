import test from "node:test"
import assert from "node:assert/strict"
import {
  getTeamPartnerAdvice,
  getTeamTrucoDecisionFromPartnerAdvice,
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

test("perfil ultra conservador pede menos que o conservador com mão boa, mas não ótima", () => {
  const goodHand = [
    createCard("2", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, goodHand, 1, undefined, "conservative"), true)
  assert.equal(shouldRaiseBet(ruleSet, goodHand, 1, undefined, "ultra_conservative"), false)
})

test("perfil agressivo pede truco com mais facilidade que o balanced", () => {
  const mediumHand = [
    createCard("A", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 3, undefined, "balanced"), false)
  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 3, undefined, "aggressive"), true)
})

test("perfil trickster blefa no pedido quando está um ponto abaixo do limiar", () => {
  const bluffableHand = [
    createCard("A", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, bluffableHand, 3, undefined, "trickster", () => 0.05), true)
  assert.equal(shouldRaiseBet(ruleSet, bluffableHand, 3, undefined, "trickster", () => 0.95), false)
})

test("perfil reckless aceita no blefe onde o balanced corre", () => {
  const bluffableHand = [
    createCard("A", "copas"),
    createCard("7", "espada"),
    createCard("4", "ouros"),
  ]

  assert.equal(respondToRaise(ruleSet, bluffableHand, 6, undefined, "balanced", () => 0.01), "run")
  assert.equal(respondToRaise(ruleSet, bluffableHand, 6, undefined, "reckless", () => 0.01), "accept")
})

test("perfil trickster pode transformar aceite em raise por blefe controlado", () => {
  const teamHands = [
    [createCard("A", "copas"), createCard("K", "espada"), createCard("Q", "ouros")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "trickster", () => 0.05), "raise")
  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "trickster", () => 0.95), "accept")
})

test("conselho forte da parceira pode transformar aceite em raise", () => {
  const humanHand = [
    createCard("A", "copas"),
    createCard("7", "espada"),
    createCard("4", "ouros"),
  ]
  const partnerHand = [
    createCard("2", "paus"),
    createCard("6", "espada"),
    createCard("4", "copas"),
  ]

  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      humanHand,
      partnerHand,
      6,
      "CÊ QUE SABE!"
    ),
    "accept"
  )
  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      humanHand,
      partnerHand,
      6,
      "BORA!"
    ),
    "raise"
  )
})

test("MELHOR CORRER! pesa de verdade e pode derrubar o aceite da dupla", () => {
  const humanHand = [
    createCard("A", "copas"),
    createCard("7", "espada"),
    createCard("4", "ouros"),
  ]
  const partnerHand = [
    createCard("K", "paus"),
    createCard("6", "espada"),
    createCard("4", "copas"),
  ]

  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      humanHand,
      partnerHand,
      6,
      "CÊ QUE SABE!"
    ),
    "accept"
  )
  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      humanHand,
      partnerHand,
      6,
      "MELHOR CORRER!"
    ),
    "run"
  )
})

test("conselho da parceira cobre BORA!, CÊ QUE SABE! e MELHOR CORRER!", () => {
  assert.equal(
    getTeamPartnerAdvice(
      ruleSet,
      [
        [createCard("3", "copas"), createCard("2", "espada"), createCard("A", "ouros")],
        [createCard("K", "copas"), createCard("A", "paus"), createCard("7", "espada")],
      ],
      6
    ),
    "BORA!"
  )

  assert.equal(
    getTeamPartnerAdvice(
      ruleSet,
      [
        [createCard("A", "copas"), createCard("7", "espada"), createCard("4", "ouros")],
        [createCard("A", "paus"), createCard("K", "copas"), createCard("4", "espada")],
      ],
      6
    ),
    "CÊ QUE SABE!"
  )

  assert.equal(
    getTeamPartnerAdvice(
      ruleSet,
      [
        [createCard("7", "espada"), createCard("6", "paus"), createCard("Q", "ouros")],
        [createCard("J", "paus"), createCard("6", "copas"), createCard("5", "espada")],
      ],
      6
    ),
    "MELHOR CORRER!"
  )
})
