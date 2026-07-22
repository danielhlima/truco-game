import test from "node:test"
import assert from "node:assert/strict"
import {
  getTeamPartnerAdvice,
  getTeamTrucoDecisionFromPartnerAdvice,
  getTeamTrucoDecision,
  respondToRaise,
  shouldRaiseBet,
} from "../../src/ai/trucoDecision.ts"
import { getAiTrucoPersonalityIdForDifficulty } from "../../src/ai/trucoPersonalities.ts"
import { getRuleSet } from "../../src/game/getRuleSet.ts"
import { createCard } from "../helpers/gameFixtures.ts"

const ruleSet = getRuleSet("MINEIRO")

test("perfil balanced só abre truco inicial com mão boa", () => {
  const mediumHand = [
    createCard("2", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]
  const firmHand = [
    createCard("2", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]
  const goodHand = [
    createCard("2", "copas"),
    createCard("A", "copas"),
    createCard("K", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 1, undefined, "balanced"), false)
  assert.equal(shouldRaiseBet(ruleSet, firmHand, 1, undefined, "balanced"), false)
  assert.equal(shouldRaiseBet(ruleSet, goodHand, 1, undefined, "balanced"), true)
})

test("perfil balanced corre de truco com mão fraca e aceita com duas honras", () => {
  const weakishHand = [
    createCard("A", "copas"),
    createCard("7", "espada"),
    createCard("4", "ouros"),
  ]
  const playableHand = [
    createCard("A", "copas"),
    createCard("K", "espada"),
    createCard("4", "ouros"),
  ]

  assert.equal(respondToRaise(ruleSet, weakishHand, 3, undefined, "balanced"), "run")
  assert.equal(respondToRaise(ruleSet, playableHand, 3, undefined, "balanced"), "accept")
})

test("perfil balanced aceita, mas não contra-aumenta, com mão só razoável", () => {
  const teamHands = [
    [createCard("2", "ouros"), createCard("K", "espada"), createCard("Q", "copas")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "balanced"), "accept")
})

test("perfil balanced contra-aumenta quando a dupla tem uma mão forte", () => {
  const teamHands = [
    [createCard("4", "paus"), createCard("3", "ouros"), createCard("2", "espada")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "balanced"), "raise")
})

test("perfil agressivo só passa do balanced em mão média por blefe controlado", () => {
  const mediumHand = [
    createCard("2", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 1, undefined, "balanced"), false)
  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 1, undefined, "aggressive", () => 0.01), true)
  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 1, undefined, "aggressive", () => 0.95), false)
})

test("conselho da parceira manda correr quando a dupla só tem uma honra", () => {
  const teamHands = [
    [createCard("A", "copas"), createCard("7", "espada"), createCard("4", "ouros")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamPartnerAdvice(ruleSet, teamHands, 3, undefined, "balanced"), "MELHOR CORRER!")
})

test("perfil ultra conservador pede menos que o conservador com mão boa, mas não ótima", () => {
  const goodHand = [
    createCard("2", "copas"),
    createCard("A", "copas"),
    createCard("K", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, goodHand, 1, undefined, "conservative"), true)
  assert.equal(shouldRaiseBet(ruleSet, goodHand, 1, undefined, "ultra_conservative"), false)
})

test("perfil agressivo aumenta com mão firme onde o balanced só aceita", () => {
  const mediumHand = [
    createCard("3", "copas"),
    createCard("2", "copas"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 3, undefined, "balanced"), false)
  assert.equal(shouldRaiseBet(ruleSet, mediumHand, 3, undefined, "aggressive"), true)
})

test("perfil trickster blefa no pedido quando está um ponto abaixo do limiar", () => {
  const bluffableHand = [
    createCard("2", "copas"),
    createCard("K", "espada"),
    createCard("Q", "ouros"),
  ]

  assert.equal(shouldRaiseBet(ruleSet, bluffableHand, 3, undefined, "trickster", () => 0.05), true)
  assert.equal(shouldRaiseBet(ruleSet, bluffableHand, 3, undefined, "trickster", () => 0.95), false)
})

test("perfil reckless aceita no blefe onde o balanced corre", () => {
  const bluffableHand = [
    createCard("A", "copas"),
    createCard("K", "espada"),
    createCard("4", "ouros"),
  ]

  assert.equal(respondToRaise(ruleSet, bluffableHand, 6, undefined, "balanced", () => 0.01), "run")
  assert.equal(respondToRaise(ruleSet, bluffableHand, 6, undefined, "reckless", () => 0.01), "accept")
})

test("perfil trickster pode transformar aceite em raise por blefe controlado", () => {
  const teamHands = [
    [createCard("2", "copas"), createCard("K", "espada"), createCard("Q", "ouros")],
    [createCard("7", "paus"), createCard("6", "espada"), createCard("4", "copas")],
  ]

  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "trickster", () => 0.05), "raise")
  assert.equal(getTeamTrucoDecision(ruleSet, teamHands, 3, undefined, "trickster", () => 0.95), "accept")
})

test("conselho forte da parceira pode transformar aceite em raise", () => {
  const humanHand = [
    createCard("3", "copas"),
    createCard("2", "espada"),
    createCard("A", "copas"),
  ]
  const partnerHand = [
    createCard("A", "paus"),
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
    createCard("K", "espada"),
    createCard("4", "ouros"),
  ]
  const partnerHand = [
    createCard("2", "espada"),
    createCard("6", "paus"),
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

test("BORA! impede a parceira de correr depois da consulta", () => {
  const weakHumanHand = [
    createCard("6", "copas"),
    createCard("6", "espada"),
    createCard("5", "ouros"),
  ]
  const weakPartnerHand = [
    createCard("Q", "paus"),
    createCard("J", "copas"),
    createCard("4", "ouros"),
  ]

  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      weakHumanHand,
      weakPartnerHand,
      12,
      "BORA!"
    ),
    "accept"
  )
  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      weakHumanHand,
      weakPartnerHand,
      6,
      "CÊ QUE SABE!"
    ),
    "run"
  )
  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      weakHumanHand,
      weakPartnerHand,
      6,
      "MELHOR CORRER!"
    ),
    "run"
  )
})

test("CÊ QUE SABE! pesa mais para parceiras com leitura melhor", () => {
  const oneMediumCardSignal = [
    createCard("Q", "copas"),
    createCard("J", "espada"),
    createCard("5", "ouros"),
  ]
  const partnerWithOneGoodCard = [
    createCard("2", "espada"),
    createCard("6", "paus"),
    createCard("5", "copas"),
  ]

  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      oneMediumCardSignal,
      partnerWithOneGoodCard,
      6,
      "CÊ QUE SABE!",
      undefined,
      "conservative",
      undefined,
      1
    ),
    "run"
  )
  assert.equal(
    getTeamTrucoDecisionFromPartnerAdvice(
      ruleSet,
      oneMediumCardSignal,
      partnerWithOneGoodCard,
      6,
      "CÊ QUE SABE!",
      undefined,
      "conservative",
      undefined,
      5
    ),
    "accept"
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
        [createCard("A", "paus"), createCard("K", "copas"), createCard("K", "espada")],
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

test("dificuldade máxima disciplinada usa blefe controlado em vez de reckless", () => {
  assert.equal(
    getAiTrucoPersonalityIdForDifficulty({
      aiLevel: 5,
      aggression: 5,
      trucoDiscipline: 5,
    }),
    "trickster"
  )
  assert.equal(
    getAiTrucoPersonalityIdForDifficulty({
      aiLevel: 5,
      aggression: 5,
      trucoDiscipline: 2,
    }),
    "reckless"
  )
})
