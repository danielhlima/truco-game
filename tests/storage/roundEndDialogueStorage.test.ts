import test from "node:test"
import assert from "node:assert/strict"
import {
  loadRoundEndDialogueProgress,
  saveRoundEndDialogueProgress,
} from "../../src/platform/storage/roundEndDialogueStorage.ts"
import { installWindowLocalStorageMock } from "../helpers/storageMock.ts"

test("o progresso dos diálogos persiste cursores e intervalo após reinicialização", () => {
  const { cleanup } = installWindowLocalStorageMock()

  try {
    saveRoundEndDialogueProgress({
      cursors: { A: 7, B: 12 },
      roundsUntilNextDialogue: 2,
    })

    // A nova leitura representa o estado recuperado após reinicializar o app.
    assert.deepEqual(loadRoundEndDialogueProgress(), {
      cursors: { A: 7, B: 12 },
      roundsUntilNextDialogue: 2,
    })

    saveRoundEndDialogueProgress({
      cursors: { A: 7, B: 12 },
      roundsUntilNextDialogue: 1,
    })
    assert.equal(loadRoundEndDialogueProgress().roundsUntilNextDialogue, 1)

    saveRoundEndDialogueProgress({
      cursors: { A: 7, B: 12 },
      roundsUntilNextDialogue: 0,
    })
    assert.equal(loadRoundEndDialogueProgress().roundsUntilNextDialogue, 0)
  } finally {
    cleanup()
  }
})

test("progresso inválido ou legado é normalizado com segurança", () => {
  const { cleanup, localStorage } = installWindowLocalStorageMock()

  try {
    localStorage.setItem(
      "truco-game.round-end-dialogue-cursors.v1",
      JSON.stringify({ cursors: { A: -3, B: 4 }, roundsUntilNextDialogue: 8 })
    )

    assert.deepEqual(loadRoundEndDialogueProgress(), {
      cursors: { A: -1, B: 4 },
      roundsUntilNextDialogue: 0,
    })
  } finally {
    cleanup()
  }
})
