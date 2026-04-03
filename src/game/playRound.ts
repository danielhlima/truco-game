import { compareCards } from "./compare"
import type { Player } from "./gameState"
import type { Card } from "./card"
import type { RuleSet } from "./ruleSet"
import { rotatePlayers } from "./turnOrder"
import { chooseCard } from "../ai/chooseCard"

export function playRound(
  ruleSet: RuleSet,
  players: Player[],
  startingPlayerId: number,
  vira?: Card
): number | null {
  const startIndex = players.findIndex(p => p.id === startingPlayerId)
  const orderedPlayers = rotatePlayers(players, startIndex)

  const table: { playerId: number; card: Card }[] = []

  for (const player of orderedPlayers) {
    const chosen = chooseCard(
      ruleSet,
      player.id,
      player.hand,
      table,
      vira
    )

    const index = player.hand.findIndex(c => c === chosen)
    const card = player.hand.splice(index, 1)[0]

    if (card) {
      table.push({ playerId: player.id, card })
    }
  }

  console.log("Ordem da jogada:", orderedPlayers.map(p => p.id))
  console.log("Cartas na mesa:", table)

  let winner = table[0]
  let isTie = false

  for (let i = 1; i < table.length; i++) {
    const current = table[i]
    const result = compareCards(ruleSet, current.card, winner.card, vira)

    if (result > 0) {
      winner = current
      isTie = false
    } else if (result === 0) {
      isTie = true
    }
  }

  if (isTie) {
    console.log("Vaza empatou (cangou)")
    return null
  }

  console.log("Vencedor da vaza:", winner.playerId)
  return winner.playerId
}