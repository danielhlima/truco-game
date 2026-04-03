export type Suit = "copas" | "ouros" | "paus" | "espada"

export type Rank =
  | "4" | "5" | "6" | "7"
  | "Q" | "J" | "K"
  | "A" | "2" | "3"

export interface Card {
  suit: Suit
  rank: Rank
}