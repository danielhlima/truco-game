import type { Card } from "./card"
import type { RuleSet } from "./ruleSet"

export function compareCards(
  ruleSet: RuleSet,
  a: Card,
  b: Card,
  vira?: Card
): number {
  return ruleSet.compareCards(a, b, vira)
}