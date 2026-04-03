export type TrucoResponse = "accept" | "run" | "raise"

export const BET_STEPS = [1, 3, 6, 9, 12] as const

export type BetValue = (typeof BET_STEPS)[number]

export function getBetLabel(bet: BetValue): string {
  switch (bet) {
    case 1:
      return "truco"
    case 3:
      return "truco"
    case 6:
      return "seis"
    case 9:
      return "nove"
    case 12:
      return "doze"
  }
}

export function getBetCallLabel(bet: BetValue): string {
  return bet === 3 ? "truco" : getBetLabel(bet)
}

export function getNextBet(currentBet: BetValue): BetValue | null {
  const index = BET_STEPS.indexOf(currentBet)

  if (index === -1 || index === BET_STEPS.length - 1) {
    return null
  }

  return BET_STEPS[index + 1]
}

export function getPreviousBet(currentBet: BetValue): BetValue {
  const index = BET_STEPS.indexOf(currentBet)

  if (index <= 0) {
    return BET_STEPS[0]
  }

  return BET_STEPS[index - 1]
}
