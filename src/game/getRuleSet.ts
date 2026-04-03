import type { RuleSet } from "./ruleSet"
import type { GameVariant } from "./variant"
import { mineiroRuleSet } from "./rulesMineiroRuleSet"
import { paulistaRuleSet } from "./rulesPaulistaRuleSet"

export function getRuleSet(variant: GameVariant): RuleSet {
  switch (variant) {
    case "MINEIRO":
      return mineiroRuleSet
    case "PAULISTA":
      return paulistaRuleSet
    default:
      throw new Error("Variante inválida")
  }
}