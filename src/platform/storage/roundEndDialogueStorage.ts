import type { TeamId } from "../../game/handState"

const ROUND_END_DIALOGUE_STORAGE_KEY = "truco-game.round-end-dialogue-cursors.v1"

export type RoundEndDialogueCursors = Record<TeamId, number>

export interface RoundEndDialogueProgress {
  cursors: RoundEndDialogueCursors
  roundsUntilNextDialogue: number
}

const DEFAULT_PROGRESS: RoundEndDialogueProgress = {
  cursors: { A: -1, B: -1 },
  roundsUntilNextDialogue: 0,
}

export function loadRoundEndDialogueProgress(): RoundEndDialogueProgress {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROGRESS, cursors: { ...DEFAULT_PROGRESS.cursors } }
  }

  const rawValue = window.localStorage.getItem(ROUND_END_DIALOGUE_STORAGE_KEY)
  if (!rawValue) {
    return { ...DEFAULT_PROGRESS, cursors: { ...DEFAULT_PROGRESS.cursors } }
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<RoundEndDialogueProgress> &
      Partial<RoundEndDialogueCursors>

    return {
      cursors: {
        A: normalizeCursor(parsed.cursors?.A ?? parsed.A),
        B: normalizeCursor(parsed.cursors?.B ?? parsed.B),
      },
      roundsUntilNextDialogue: normalizeRoundsUntilNextDialogue(
        parsed.roundsUntilNextDialogue
      ),
    }
  } catch {
    return { ...DEFAULT_PROGRESS, cursors: { ...DEFAULT_PROGRESS.cursors } }
  }
}

export function saveRoundEndDialogueProgress(progress: RoundEndDialogueProgress) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(ROUND_END_DIALOGUE_STORAGE_KEY, JSON.stringify(progress))
}

function normalizeCursor(value: number | undefined): number {
  return typeof value === "number" && Number.isInteger(value) && value >= -1 ? value : -1
}

function normalizeRoundsUntilNextDialogue(value: number | undefined): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2
    ? value
    : 0
}
