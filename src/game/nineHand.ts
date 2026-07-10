import type { HandState, TeamId } from "./handState"
import type { MatchScore } from "./truco"

export const NINE_HAND_SCORE = 9
const MATCH_POINT_SCORE = 12

export type NineHandDecision = "play" | "fold"

export function getNineHandTeam(matchScore: MatchScore | null | undefined): TeamId | null {
  if (!matchScore) {
    return null
  }

  if (isNineHandScore(matchScore.A)) {
    return "A"
  }

  if (isNineHandScore(matchScore.B)) {
    return "B"
  }

  return null
}

export function applyNineHandRules(
  state: HandState,
  matchScore: MatchScore | null | undefined
): HandState {
  const nineHandTeam = getNineHandTeam(matchScore)

  if (!nineHandTeam) {
    return state
  }

  return {
    ...state,
    currentBet: 3,
    nineHand: {
      team: nineHandTeam,
      phase: "awaiting-decision",
    },
  }
}

export function isNineHandAwaitingDecision(state: HandState | null | undefined): boolean {
  return state?.nineHand?.phase === "awaiting-decision"
}

export function decideNineHand(state: HandState, decision: NineHandDecision): HandState {
  if (!isNineHandAwaitingDecision(state) || !state.nineHand) {
    return state
  }

  if (decision === "play") {
    return {
      ...state,
      currentBet: 3,
      nineHand: {
        ...state.nineHand,
        phase: "playing",
      },
    }
  }

  return {
    ...state,
    currentBet: 1,
    finished: true,
    winner: getOpposingTeam(state.nineHand.team),
    nineHand: {
      ...state.nineHand,
      phase: "playing",
    },
  }
}

function getOpposingTeam(team: TeamId): TeamId {
  return team === "A" ? "B" : "A"
}

function isNineHandScore(score: number): boolean {
  return score >= NINE_HAND_SCORE && score < MATCH_POINT_SCORE
}
