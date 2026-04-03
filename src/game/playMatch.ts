import { playHand } from "./playHand"
import type { GameVariant } from "./variant"

export function playMatch(variant: GameVariant) {
  const matchScore = {
    A: 0,
    B: 0
  }

  let handNumber = 1
  let startingPlayerId = 1

  console.log("===== INÍCIO DA PARTIDA =====")
  console.log("Variante da partida:", variant)

  while (matchScore.A < 12 && matchScore.B < 12) {
    console.log("")
    console.log(`===== MÃO ${handNumber} =====`)
    console.log("Placar antes da mão:", matchScore)
    console.log("Jogador mão desta mão:", startingPlayerId)

    const result = playHand(variant, startingPlayerId)

    matchScore[result.winner] = Math.min(
      12,
      matchScore[result.winner] + result.points
    )

    console.log("Resultado da mão:", result)
    console.log("Placar após a mão:", matchScore)

    handNumber++
    startingPlayerId = startingPlayerId === 4 ? 1 : startingPlayerId + 1
  }

  const winner = matchScore.A >= 12 ? "A" : "B"

  console.log("")
  console.log("===== FIM DA PARTIDA =====")
  console.log(`Vencedor da partida: Time ${winner}`)
  console.log("Placar final:", matchScore)

  return {
    winner,
    score: matchScore
  }
}