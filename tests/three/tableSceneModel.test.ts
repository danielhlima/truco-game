import test from "node:test"
import assert from "node:assert/strict"
import { buildTableSceneModel } from "../../src/three/tableSceneModel.ts"
import { createCard, createHandStateFixture } from "../helpers/gameFixtures.ts"

test("modelo da mesa mostra a vira apenas no Truco Paulista", () => {
  const mineiroState = createHandStateFixture()
  const paulistaState = createHandStateFixture(
    {
      vira: createCard("5", "ouros"),
    },
    "PAULISTA"
  )

  const mineiroModel = buildTableSceneModel(mineiroState, {}, null, null)
  const paulistaModel = buildTableSceneModel(paulistaState, {}, null, null)

  assert.equal(mineiroModel.centerDeck.show, false)
  assert.equal(mineiroModel.centerDeck.vira, undefined)
  assert.equal(paulistaModel.centerDeck.show, true)
  assert.deepEqual(paulistaModel.centerDeck.vira, {
    rank: "5",
    suit: "ouros",
    suitSymbol: "♦",
  })
})
