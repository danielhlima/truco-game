import { dealCards } from "./deal"
import { playRound } from "./playRound"
import { getTeam } from "./teams"
import type { BetValue } from "./truco"
import type { GameVariant } from "./variant"
import { getRuleSet } from "./getRuleSet"
import { getBetCallLabel, getNextBet, getPreviousBet } from "./truco"
import { shouldRaiseBet, respondToRaise } from "../ai/trucoDecision"
import { getVira } from "./vira"
import type { Card } from "./card"

export function playHand(
  variant: GameVariant,
  startingPlayerId: number
) {
  const { players, remainingDeck } = dealCards()
  const ruleSet = getRuleSet(variant)
  const vira: Card | undefined = getVira(remainingDeck, variant)

  const score = { A: 0, B: 0 }
  let currentPlayer = startingPlayerId
  let firstNonTieWinner: "A" | "B" | null = null
  let currentBet: BetValue = 1

  console.log("=== NOVA MÃO ===")
  console.log("Variante:", variant)
  console.log("Jogador mão da vez:", startingPlayerId)

  if (vira) {
    console.log("Vira:", vira)
  }

  players.forEach(p => {
    console.log(`Player ${p.id}:`, p.hand)
  })

  for (let i = 0; i < 3; i++) {
    console.log(`--- Vaza ${i + 1} ---`)
    console.log("Jogador inicial:", currentPlayer)
    console.log("Valor atual da mão:", currentBet)

    const starter = players.find(p => p.id === currentPlayer)

    if (!starter) {
      throw new Error("Jogador inicial não encontrado")
    }

    const starterTeam = getTeam(starter.id)
    const opponentTeam = starterTeam === "A" ? "B" : "A"

    const nextBet = getNextBet(currentBet)

    if (
      nextBet !== null &&
      shouldRaiseBet(ruleSet, starter.hand, currentBet, vira)
    ) {
      const trucoResult = resolveTrucoSequence(
        ruleSet,
        players,
        starterTeam,
        opponentTeam,
        nextBet,
        vira
      )

      if (trucoResult.ranAway) {
        console.log(
          `=== VENCEDOR DA MÃO: ${trucoResult.winner} (${trucoResult.awardedPoints} ponto(s)) ===`
        )

        return {
          winner: trucoResult.winner,
          points: trucoResult.awardedPoints
        }
      }

      currentBet = trucoResult.acceptedBet
    }

    const winnerPlayer = playRound(ruleSet, players, currentPlayer, vira)

    if (winnerPlayer === null) {
      console.log("Empate na vaza")
      continue
    }

    const winnerTeam = getTeam(winnerPlayer)

    if (firstNonTieWinner === null) {
      firstNonTieWinner = winnerTeam
    }

    score[winnerTeam]++

    console.log("Placar:", score)

    currentPlayer = winnerPlayer

    if (score.A === 2 || score.B === 2) {
      break
    }
  }

  let winner: "A" | "B"

  if (score.A === score.B) {
    if (firstNonTieWinner !== null) {
      winner = firstNonTieWinner
    } else {
      winner = getTeam(startingPlayerId)
    }
  } else {
    winner = score.A > score.B ? "A" : "B"
  }

  console.log(`=== VENCEDOR DA MÃO: ${winner} (${currentBet} ponto(s)) ===`)

  return {
    winner,
    points: currentBet
  }
}

function resolveTrucoSequence(
  ruleSet: ReturnType<typeof getRuleSet>,
  players: ReturnType<typeof dealCards>["players"],
  requestingTeam: "A" | "B",
  respondingTeam: "A" | "B",
  proposedBet: BetValue,
  vira?: Card
) {
  let currentRequestingTeam = requestingTeam
  let currentRespondingTeam = respondingTeam
  let currentProposedBet = proposedBet

  while (true) {
    console.log(
      `Time ${currentRequestingTeam} pediu ${getBetCallLabel(currentProposedBet)} (${currentProposedBet})!`
    )

    const responder = players.find((player) => getTeam(player.id) === currentRespondingTeam)

    if (!responder) {
      throw new Error("Jogador respondente não encontrado")
    }

    const response = respondToRaise(ruleSet, responder.hand, currentProposedBet, vira)

    if (response === "run") {
      console.log(`Time ${currentRespondingTeam} correu!`)

      return {
        ranAway: true as const,
        winner: currentRequestingTeam,
        awardedPoints: getPreviousBet(currentProposedBet),
      }
    }

    const nextBet = getNextBet(currentProposedBet)
    const shouldReRaise =
      nextBet !== null &&
      shouldRaiseBet(ruleSet, responder.hand, currentProposedBet, vira)

    if (!shouldReRaise) {
      console.log(
        `Time ${currentRespondingTeam} aceitou ${getBetCallLabel(currentProposedBet)} (${currentProposedBet})!`
      )

      return {
        ranAway: false as const,
        acceptedBet: currentProposedBet,
      }
    }

    console.log(
      `Time ${currentRespondingTeam} aceitou ${getBetCallLabel(currentProposedBet)} e pediu ${getBetCallLabel(nextBet)} (${nextBet})!`
    )

    currentRequestingTeam = currentRespondingTeam
    currentRespondingTeam = currentRespondingTeam === "A" ? "B" : "A"
    currentProposedBet = nextBet
  }
}
