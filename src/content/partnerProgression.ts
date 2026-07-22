import type { PartnerAdviceSkillLevel } from "../ai/trucoDecision"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import type { TrucoCharacterId } from "./characters"

export const STARTER_PARTNER_CHARACTER_IDS: TrucoCharacterId[] = [
  "nega-catimbo",
  "leninha-lambreta",
  "rita-gambiarra",
  "joca-busao",
]

const STARTER_PARTNER_ADVICE_SKILL_LEVEL: PartnerAdviceSkillLevel = 1

const PARTNER_ADVICE_SKILL_LEVEL_BY_CHARACTER_ID: Partial<Record<TrucoCharacterId, PartnerAdviceSkillLevel>> =
  CAMPAIGN_STAGES.reduce<Partial<Record<TrucoCharacterId, PartnerAdviceSkillLevel>>>(
    (skillByCharacterId, stage) => {
      stage.venues.forEach((venue) => {
        const venueSkillLevel = toPartnerAdviceSkillLevel(venue.difficulty.aiLevel)

        venue.partnerUnlockCharacterIds.forEach((characterId) => {
          const currentSkillLevel = skillByCharacterId[characterId] ?? STARTER_PARTNER_ADVICE_SKILL_LEVEL

          if (venueSkillLevel > currentSkillLevel) {
            skillByCharacterId[characterId] = venueSkillLevel
          }
        })
      })

      return skillByCharacterId
    },
    {}
  )

export function getPartnerAdviceSkillLevel(
  characterId?: TrucoCharacterId | null
): PartnerAdviceSkillLevel {
  if (!characterId || STARTER_PARTNER_CHARACTER_IDS.includes(characterId)) {
    return STARTER_PARTNER_ADVICE_SKILL_LEVEL
  }

  return PARTNER_ADVICE_SKILL_LEVEL_BY_CHARACTER_ID[characterId] ?? STARTER_PARTNER_ADVICE_SKILL_LEVEL
}

function toPartnerAdviceSkillLevel(value: number): PartnerAdviceSkillLevel {
  return Math.max(1, Math.min(5, value)) as PartnerAdviceSkillLevel
}
