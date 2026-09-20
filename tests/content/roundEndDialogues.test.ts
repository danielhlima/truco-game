import test from "node:test"
import assert from "node:assert/strict"
import {
  getRoundEndDialogue,
  getNextRoundEndDialogueIndex,
  ROUND_END_DIALOGUES,
} from "../../src/content/roundEndDialogues.ts"

test("a seleção sequencial começa no primeiro diálogo de cada resultado", () => {
  assert.deepEqual(getRoundEndDialogue("A"), {
    id: "human-win-001",
    lines: [
      { playerId: 3, text: "HAHAHA! VOCÊS VIRAM DE ONDE VEIO ESSA CARTA?" },
      { playerId: 1, text: "NEM ELES VIRAM PARA ONDE FOI A RODADA!" },
      { playerId: 2, text: "EU VI. FOI EMBORA COM OS NOSSOS PONTOS." },
    ],
  })

  assert.deepEqual(getRoundEndDialogue("B"), {
    id: "human-loss-001",
    lines: [
      { playerId: 4, text: "HAHAHA! ESSA RODADA VEIO SEM FREIO!" },
      { playerId: 2, text: "E PAROU DIRETO NO NOSSO PLACAR!" },
      { playerId: 3, text: "CLARO. O NOSSO PLACAR ESTAVA FECHADO PARA REFORMA." },
    ],
  })
})

test("a seleção sequencial avança e reinicia somente depois do último diálogo", () => {
  assert.equal(getRoundEndDialogue("A", 0)?.id, "human-win-002")
  assert.equal(getRoundEndDialogue("A", 98)?.id, "human-win-100")
  assert.equal(getNextRoundEndDialogueIndex(100, -1), 0)
})

test("grupo A volta ao diálogo 001 depois do diálogo 100", () => {
  const cursorAfterLastDialogue = getNextRoundEndDialogueIndex(100, 99)

  assert.equal(cursorAfterLastDialogue, 0)
  assert.equal(getRoundEndDialogue("A", 99)?.id, "human-win-001")
})

test("grupo B volta ao diálogo 001 depois do diálogo 100", () => {
  const cursorAfterLastDialogue = getNextRoundEndDialogueIndex(100, 99)

  assert.equal(cursorAfterLastDialogue, 0)
  assert.equal(getRoundEndDialogue("B", 99)?.id, "human-loss-001")
})

test("o catálogo aprovado tem cem diálogos por resultado e IDs contínuos", () => {
  assert.equal(ROUND_END_DIALOGUES.A.length, 100)
  assert.equal(ROUND_END_DIALOGUES.B.length, 100)

  for (const [group, prefix] of [[ROUND_END_DIALOGUES.A, "human-win"], [ROUND_END_DIALOGUES.B, "human-loss"]] as const) {
    group.forEach((entry, index) => {
      assert.equal(entry.id, `${prefix}-${String(index + 1).padStart(3, "0")}`)
      assert.ok(entry.lines.length >= 2 && entry.lines.length <= 5)
      assert.ok(entry.lines.some((line) => line.text.includes("HA") || /RISADA|RIR/.test(line.text)))
      assert.ok(entry.lines.some((line) => (prefix === "human-win" ? [1, 3] : [2, 4]).includes(line.playerId)))
      assert.ok(entry.lines.some((line) => (prefix === "human-win" ? [2, 4] : [1, 3]).includes(line.playerId)))

      for (const line of entry.lines) {
        assert.equal(line.text, line.text.toLocaleUpperCase("pt-BR"))
        assert.doesNotMatch(line.text, /\bVIRA\b/i)
      }
    })
  }
})

test("não há diálogos aprovados duplicados integralmente", () => {
  const serialized = [...ROUND_END_DIALOGUES.A, ...ROUND_END_DIALOGUES.B].map((entry) =>
    JSON.stringify(entry.lines)
  )

  assert.equal(new Set(serialized).size, serialized.length)
})
