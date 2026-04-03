import type { HandState } from "./handState"
import { playAiTurn } from "./playAiTurn"
import { resolveTrick } from "./resolveTrick"

export function advanceHand(state: HandState): HandState {
  let nextState = state

  while (!nextState.finished) {
    // se a mesa já completou 4 cartas, resolve antes de qualquer nova jogada
    if (nextState.table.length === 4) {
      nextState = resolveTrick(nextState)

      // se depois de resolver chegou na vez do humano ou terminou, para aqui
      if (nextState.finished || nextState.currentPlayerId === 1) {
        break
      }

      continue
    }

    // se chegou na vez do humano, para e espera clique
    if (nextState.currentPlayerId === 1) {
      break
    }

    nextState = playAiTurn(nextState)
  }

  return nextState
}