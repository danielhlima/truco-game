import { useEffect, useState } from "react"
import type React from "react"
import type { CampaignStage, CampaignVenue } from "../career/campaign/types"
import type { FreePlayRunState } from "../career/campaign/freePlayProgression"
import type { Card } from "../game/card"
import type { HandState } from "../game/handState"
import type { Player } from "../game/gameState"
import type { TableCard } from "../game/tableCard"
import type { MatchState } from "../game/matchState"
import type { GameVariant } from "../game/variant"
import { CAMPAIGN_STAGES } from "../career/campaign/campaignData"
import { STORE_PRODUCTS, UNLOCKABLE_ITEMS } from "../economy/catalog"
import { GameTableScene } from "../three/GameTableScene"
import { buildTableSceneModel } from "../three/tableSceneModel"
import { getTableTheme } from "../three/tableTheme"
import scorePadNotebookAsset from "../assets/ui-left/scorepad-notebook-clean-cut.png"
import actionButtonAsset from "../assets/ui-right/action-button-solid.png"
import statsPanelWoodAsset from "../assets/ui-right/stats-panel-wood-main.png"
import zonaNorteGaragemCampaignJourneyAsset from "../assets/campaign/conquista-zonas-garagem-norte.png"
import zonaNorteGaragemBackgroundAsset from "../assets/venues/zona-norte-garagem/background.png"
import zonaNorteGaragemHostAsset from "../assets/venues/zona-norte-garagem/host-zona-norte-garagem.png"
import zonaNorteGaragemMatchResultLossAsset from "../assets/venues/zona-norte-garagem/match-result-loss.png"
import zonaNorteGaragemMatchResultWinAsset from "../assets/venues/zona-norte-garagem/match-result-win.png"
import zonaLesteQuintalCampaignJourneyAsset from "../assets/campaign/conquista-zonas-quintal-da-leste.png"
import zonaLesteQuintalBackgroundAsset from "../assets/venues/zona-leste-quintal/background.png"
import zonaLesteQuintalHostAsset from "../assets/venues/zona-leste-quintal/host-zona-leste-quintal.png"
import zonaLesteQuintalMatchResultLossAsset from "../assets/venues/zona-leste-quintal/match-result-loss.png"
import zonaLesteQuintalMatchResultWinAsset from "../assets/venues/zona-leste-quintal/match-result-win.png"
import centroSubsoloCampaignJourneyAsset from "../assets/campaign/conquista-zonas-subsolo-do-centro.png"
import centroSubsoloBackgroundAsset from "../assets/venues/centro-subsolo/background.png"
import centroSubsoloHostAsset from "../assets/venues/centro-subsolo/host-centro-subsolo.png"
import centroSubsoloMatchResultLossAsset from "../assets/venues/centro-subsolo/match-result-loss.png"
import centroSubsoloMatchResultWinAsset from "../assets/venues/centro-subsolo/match-result-win.png"
import centroConvencoesPrefeituraCampaignJourneyAsset from "../assets/campaign/campeonato-municipal-centro-convencoes-prefeitura.png"
import centroConvencoesPrefeituraBackgroundAsset from "../assets/venues/centro-convencoes-prefeitura/background.png"
import centroConvencoesPrefeituraHostAsset from "../assets/venues/centro-convencoes-prefeitura/host-centro-convencoes-prefeitura.png"
import centroConvencoesPrefeituraMatchResultLossAsset from "../assets/venues/centro-convencoes-prefeitura/match-result-loss.png"
import centroConvencoesPrefeituraMatchResultWinAsset from "../assets/venues/centro-convencoes-prefeitura/match-result-win.png"
import ginasioEstadualManecoFileCampaignJourneyAsset from "../assets/campaign/campeonato-estadual-ginasio-estadual-maneco-file.png"
import ginasioEstadualManecoFileBackgroundAsset from "../assets/venues/ginasio-estadual-maneco-file/background.png"
import ginasioEstadualManecoFileHostAsset from "../assets/venues/ginasio-estadual-maneco-file/host-ginasio-estadual-maneco-file.png"
import ginasioEstadualManecoFileMatchResultLossAsset from "../assets/venues/ginasio-estadual-maneco-file/match-result-loss.png"
import ginasioEstadualManecoFileMatchResultWinAsset from "../assets/venues/ginasio-estadual-maneco-file/match-result-win.png"
import arenaNacionalCampaignJourneyAsset from "../assets/campaign/campeonato-nacional-arena-nacional.png"
import arenaNacionalBackgroundAsset from "../assets/venues/arena-nacional/background.png"
import arenaNacionalHostAsset from "../assets/venues/arena-nacional/host-arena-nacional.png"
import arenaNacionalMatchResultLossAsset from "../assets/venues/arena-nacional/match-result-loss.png"
import arenaNacionalMatchResultWinAsset from "../assets/venues/arena-nacional/match-result-win.png"
import centroAmericanoTruqueiroMedelinCampaignJourneyAsset from "../assets/campaign/circuito-panamericano-centro-americano-truqueiro-medelin.png"
import centroAmericanoTruqueiroMedelinBackgroundAsset from "../assets/venues/centro-americano-truqueiro-medelin/background.png"
import centroAmericanoTruqueiroMedelinHostAsset from "../assets/venues/centro-americano-truqueiro-medelin/host-centro-americano-truqueiro-medelin.png"
import centroAmericanoTruqueiroMedelinMatchResultLossAsset from "../assets/venues/centro-americano-truqueiro-medelin/match-result-loss.png"
import centroAmericanoTruqueiroMedelinMatchResultWinAsset from "../assets/venues/centro-americano-truqueiro-medelin/match-result-win.png"
import hotelTrucoSegoviaEspanhaCampaignJourneyAsset from "../assets/campaign/jogos-mundiais-hotel-truco-segovia-espanha.png"
import hotelTrucoSegoviaEspanhaBackgroundAsset from "../assets/venues/hotel-truco-segovia-espanha/background.png"
import hotelTrucoSegoviaEspanhaHostAsset from "../assets/venues/hotel-truco-segovia-espanha/host-hotel-truco-segovia-espanha.png"
import hotelTrucoSegoviaEspanhaMatchResultLossAsset from "../assets/venues/hotel-truco-segovia-espanha/match-result-loss.png"
import hotelTrucoSegoviaEspanhaMatchResultWinAsset from "../assets/venues/hotel-truco-segovia-espanha/match-result-win.png"
import casinoMeMaiorCampaignJourneyAsset from "../assets/campaign/mundial-casino-me-maior.png"
import casinoMeMaiorBackgroundAsset from "../assets/venues/casino-me-maior/background.png"
import casinoMeMaiorHostAsset from "../assets/venues/casino-me-maior/host-casino-me-maior.png"
import casinoMeMaiorMatchResultLossAsset from "../assets/venues/casino-me-maior/match-result-loss.png"
import casinoMeMaiorMatchResultWinAsset from "../assets/venues/casino-me-maior/match-result-win.png"
import orbitaDaLuaCampaignJourneyAsset from "../assets/campaign/circuito-intergalactico-orbita-da-lua.png"
import orbitaDaLuaBackgroundAsset from "../assets/venues/orbita-da-lua/background.png"
import orbitaDaLuaHostAsset from "../assets/venues/orbita-da-lua/host-orbita-da-lua.png"
import orbitaDaLuaMatchResultLossAsset from "../assets/venues/orbita-da-lua/match-result-loss.png"
import orbitaDaLuaMatchResultWinAsset from "../assets/venues/orbita-da-lua/match-result-win.png"
import zonaSulSalaoCampaignJourneyAsset from "../assets/campaign/conquista-zonas-salao-da-sul.png"
import zonaSulSalaoBackgroundAsset from "../assets/venues/zona-sul-salao/background.png"
import zonaSulSalaoHostAsset from "../assets/venues/zona-sul-salao/host-zona-sul-salao.png"
import zonaSulSalaoMatchResultLossAsset from "../assets/venues/zona-sul-salao/match-result-loss.png"
import zonaSulSalaoMatchResultWinAsset from "../assets/venues/zona-sul-salao/match-result-win.png"
import victoryStageCampeonatoVilaNanaAsset from "../assets/campaign-victories/stage-campeonato-vila-nana.png"
import victoryStageCampeonatoEstadualAsset from "../assets/campaign-victories/stage-campeonato-estadual.png"
import victoryStageCampeonatoNacionalAsset from "../assets/campaign-victories/stage-campeonato-nacional.png"
import victoryStageCircuitoPanamericanoAsset from "../assets/campaign-victories/stage-circuito-panamericano.png"
import victoryStageIntergalacticoAsset from "../assets/campaign-victories/stage-intergalactico.png"
import victoryStageJogosMundiaisAsset from "../assets/campaign-victories/stage-jogos-mundiais.png"
import victoryStageMundialAsset from "../assets/campaign-victories/stage-mundial.png"
import victoryStageRuaPeriferiaAsset from "../assets/campaign-victories/stage-rua-periferia.png"
import victoryStageZonasCidadeAsset from "../assets/campaign-victories/stage-zonas-da-cidade.png"
import victoryVenueAdegaJucaBigodeAsset from "../assets/campaign-victories/venue-adega-do-juca-bigode.png"
import victoryVenueArenaNacionalAsset from "../assets/campaign-victories/venue-arena-nacional.png"
import victoryVenueBarDoZeCatingaAsset from "../assets/campaign-victories/venue-bar-do-ze-catinga.png"
import victoryVenueBarManecoBanguelaAsset from "../assets/campaign-victories/venue-bar-maneco-banguela.png"
import victoryVenueCentroConvencoesPrefeituraAsset from "../assets/campaign-victories/venue-centro-convencoes-prefeitura.png"
import victoryVenueCentroAmericanoTruqueiroMedelinAsset from "../assets/campaign-victories/venue-centro-americano-truqueiro-medelin.png"
import victoryVenueCentroSubsoloAsset from "../assets/campaign-victories/venue-centro-subsolo.png"
import victoryVenueGinasioEstadualManecoFileAsset from "../assets/campaign-victories/venue-ginasio-estadual-maneco-file.png"
import victoryVenueHotelTrucoSegoviaEspanhaAsset from "../assets/campaign-victories/venue-hotel-truco-segovia-espanha.png"
import victoryVenueCasinoMeMaiorAsset from "../assets/campaign-victories/venue-casino-me-maior.png"
import victoryVenueOrbitaDaLuaAsset from "../assets/campaign-victories/venue-orbita-da-lua.png"
import victoryVenueTremDoJacaAsset from "../assets/campaign-victories/venue-trem-do-jaca.png"
import victoryVenueZonaLesteQuintalAsset from "../assets/campaign-victories/venue-zona-leste-quintal.png"
import victoryVenueZonaNorteGaragemAsset from "../assets/campaign-victories/venue-zona-norte-garagem.png"
import victoryVenueZonaSulSalaoAsset from "../assets/campaign-victories/venue-zona-sul-salao.png"
import adegaJucaBigodeCampaignJourneyAsset from "../assets/campaign/campeonato-vila-nana-adega-do-juca-bigode.png"
import adegaJucaBigodeBackgroundAsset from "../assets/venues/adega-do-juca-bigode/background.png"
import adegaJucaBigodeHostAsset from "../assets/venues/adega-do-juca-bigode/host-adega-do-juca-bigode.png"
import adegaJucaBigodeMatchResultLossAsset from "../assets/venues/adega-do-juca-bigode/match-result-loss.png"
import adegaJucaBigodeMatchResultWinAsset from "../assets/venues/adega-do-juca-bigode/match-result-win.png"
import tremDoJacaCampaignJourneyAsset from "../assets/campaign/campeonato-vila-nana-trem-do-jaca.png"
import tremDoJacaBackgroundAsset from "../assets/venues/trem-do-jaca/background.png"
import tremDoJacaHostAsset from "../assets/venues/trem-do-jaca/host-trem-do-jaca.png"
import tremDoJacaMatchResultLossAsset from "../assets/venues/trem-do-jaca/match-result-loss.png"
import tremDoJacaMatchResultWinAsset from "../assets/venues/trem-do-jaca/match-result-win.png"
import manecoBanguelaCampaignJourneyAsset from "../assets/campaign/botecos-rua-maneco-banguela.png"
import manecoBanguelaBackgroundAsset from "../assets/venues/maneco-banguela/background.png"
import manecoBanguelaHostAsset from "../assets/venues/maneco-banguela/host-maneco-banguela.png"
import manecoBanguelaMatchResultLossAsset from "../assets/venues/maneco-banguela/match-result-loss.png"
import manecoBanguelaMatchResultWinAsset from "../assets/venues/maneco-banguela/match-result-win.png"
import startScreenAsset from "../assets/start/truco-raiz-start.png"
import freePlayCircuitHubAsset from "../assets/campaign/free-play-circuit-hub.png"
import zeCatingaCampaignJourneyAsset from "../assets/campaign/botecos-rua-ze-catinga.png"
import zeCatingaBackgroundAsset from "../assets/venues/ze-catinga/background.png"
import zeCatingaHostAsset from "../assets/venues/ze-catinga/host-ze-catinga.png"
import zeCatingaQuoteBoardAsset from "../assets/venues/ze-catinga/host-quote-board.png"
import zeCatingaCtaPlaqueAsset from "../assets/venues/ze-catinga/cta-plaque.png"
import zeCatingaDifficultyBottleAsset from "../assets/venues/ze-catinga/difficulty-bottle.png"
import zeCatingaDividerAsset from "../assets/venues/ze-catinga/divider-ornament.png"
import zeCatingaMatchResultLossAsset from "../assets/venues/ze-catinga/match-result-loss.png"
import zeCatingaMatchResultWinAsset from "../assets/venues/ze-catinga/match-result-win.png"
import zeCatingaStatsPlaqueAsset from "../assets/venues/ze-catinga/stats-plaque-aged-blank.png"
import type { PlayerProfile } from "../profile/playerProfile"
import type { PartnerAdvice } from "../ai/trucoDecision"
import { TRUCO_CHARACTER_BY_ID, type TrucoCharacterProfile } from "../content/characters"
import type { PlayerSkinProfile } from "../content/playerSkins"
import {
  formatCard,
  getBetBadgeLabel,
  getCampaignTierLabel,
  getManilhaLabel,
  getRaiseResponseButtonLabel,
  getRequestBetButtonLabel,
  getStateLabel,
  getSuitColor,
  getSuitSymbol,
  type SpeechBubbleState,
} from "./gameSessionHelpers"

type StyleMap = Record<string, React.CSSProperties>
type MatchResultScreenState = {
  hostLine: string
  outcome: "win" | "loss"
  progressionText?: string
  progressionTitle?: string
  title: string
  subtitle: string
  venueId?: string
  venueName: string
}
type CampaignVictoryScreenState = {
  id: string
  kind: "stage" | "venue"
  title: string
}
type GameplayIntroPhase = "background" | "reveal" | "done"

type VenueCoverConfig = {
  hostName: string
  hostRole: string
  hostQuote: string
  leadText: string
  description: string
  backgroundAsset?: string
  hostPortraitAsset: string
  quoteBoardAsset: string
  ctaPlaqueAsset: string
  difficultyBottleAsset: string
  dividerAsset: string
  statsPlaqueAsset: string
}

const VENUE_COVER_CONFIG_BY_ID: Record<string, VenueCoverConfig> = {
  "bar-do-ze-catinga": {
    hostName: "Zé Catinga",
    hostRole: "Dono do Bar",
    hostQuote: "Aqui dentro, fama não paga dose. Só entra quem aguenta pressão.",
    leadText: "Boteco raiz. Cachaça forte, conversa curta e truco valendo a honra.",
    description: "A mesa aqui não compra pose. Ou você aguenta o calor, ou sai pela porta menor.",
    backgroundAsset: zeCatingaBackgroundAsset,
    hostPortraitAsset: zeCatingaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "bar-maneco-banguela": {
    hostName: "Maneco Banguela",
    hostRole: "Dono do Bar",
    hostQuote: "Aqui sorriso bonito não ganha truco.",
    leadText: "Mesa apertada, fala atravessada e truco ligeiro no balcão.",
    description: "No Maneco, ponto fácil vira história. Piscou, a mão já mudou de dono.",
    backgroundAsset: manecoBanguelaBackgroundAsset,
    hostPortraitAsset: manecoBanguelaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "trem-do-jaca": {
    hostName: "Jaça",
    hostRole: "Dono da Mercearia",
    hostQuote: "Aqui fiado é difícil. Ganhar truco assim, mais difícil ainda.",
    leadText: "Mercearia de vila, balcão gasto e truco jogado no olho da prateleira.",
    description: "No Trem do Jaça, a luz entra pela porta e a cobrança vem pela mesa.",
    backgroundAsset: tremDoJacaBackgroundAsset,
    hostPortraitAsset: tremDoJacaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "adega-do-juca-bigode": {
    hostName: "Juca Bigode",
    hostRole: "Dono da Adega",
    hostQuote: "Aqui o balcão é frio, mas a mesa esquenta rápido.",
    leadText: "Adega apertada, metal gasto e truco com plateia espremida.",
    description: "Na Adega do Juca Bigode, a conversa sobe antes da primeira carta cair.",
    backgroundAsset: adegaJucaBigodeBackgroundAsset,
    hostPortraitAsset: adegaJucaBigodeHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "zona-norte-garagem": {
    hostName: "Hugo da Garagem",
    hostRole: "Dono da Garagem",
    hostQuote: "Aqui motor falha, mas truco não pode falhar.",
    leadText: "Concreto claro, ferramenta na parede e truco firme na Zona Norte.",
    description: "Na Garagem Norte, a mesa abre com portão levantado e pressão de oficina.",
    backgroundAsset: zonaNorteGaragemBackgroundAsset,
    hostPortraitAsset: zonaNorteGaragemHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "zona-leste-quintal": {
    hostName: "Rubão da Leste",
    hostRole: "Dono do Quintal",
    hostQuote: "Na Leste, quem aguenta a zoeira ganha respeito.",
    leadText: "Quintal aberto, resenha solta e truco com barulho de rua.",
    description: "No Quintal da Leste, a partida parece festa. Mas ninguém alivia.",
    backgroundAsset: zonaLesteQuintalBackgroundAsset,
    hostPortraitAsset: zonaLesteQuintalHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "centro-subsolo": {
    hostName: "Nestor do Subsolo",
    hostRole: "Dono do Subsolo",
    hostQuote: "No Centro, quem pensa duas vezes ganha antes da carta cair.",
    leadText: "Concreto, silêncio e truco frio no bar escondido do Centro.",
    description: "No Subsolo do Centro, pressa vira erro e cada chamada pesa.",
    backgroundAsset: centroSubsoloBackgroundAsset,
    hostPortraitAsset: centroSubsoloHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "zona-sul-salao": {
    hostName: "Sérgio do Salão",
    hostRole: "Dono do Salão",
    hostQuote: "Aqui a casa é arrumada, mas a mesa não perdoa.",
    leadText: "Salão de esquina, postura bonita e truco afiado na Zona Sul.",
    description: "No Salão da Sul, o visual é mais fino, mas a malandragem continua.",
    backgroundAsset: zonaSulSalaoBackgroundAsset,
    hostPortraitAsset: zonaSulSalaoHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "centro-convencoes-prefeitura": {
    hostName: "Célia da Comissão",
    hostRole: "Organizadora do Evento",
    hostQuote: "Aqui é campeonato, meu filho. Truco alto e respeito na mesa.",
    leadText: "Salão municipal, mesa oficial e cidade inteira querendo ver quem aguenta.",
    description: "No Centro de Convenções, o truco sai do boteco e entra na ata da prefeitura.",
    backgroundAsset: centroConvencoesPrefeituraBackgroundAsset,
    hostPortraitAsset: centroConvencoesPrefeituraHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "ginasio-estadual-maneco-file": {
    hostName: "Governador Evaristo",
    hostRole: "Governador do Estado",
    hostQuote: "Interessante. Você não tremeu.",
    leadText: "Ginásio estadual, luz alta e truco com peso de tradição.",
    description: "No Maneco Filé, a mesa já parece grande antes da primeira carta cair.",
    backgroundAsset: ginasioEstadualManecoFileBackgroundAsset,
    hostPortraitAsset: ginasioEstadualManecoFileHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "arena-nacional": {
    hostName: "Helena Nogueira",
    hostRole: "Apresentadora Nacional",
    hostQuote: "No Nacional, até silêncio vira replay.",
    leadText: "Arena lotada, transmissão ao vivo e truco com o país inteiro olhando.",
    description: "Na Arena Nacional, cada chamada pesa mais porque todo mundo viu.",
    backgroundAsset: arenaNacionalBackgroundAsset,
    hostPortraitAsset: arenaNacionalHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "centro-americano-truqueiro-medelin": {
    hostName: "Valéria Montoya",
    hostRole: "Mestre de Cerimônias",
    hostQuote: "No Panamericano, blefe também precisa passaporte.",
    leadText: "Show continental, luz colorida e truco atravessando as Américas.",
    description: "Em Medelin, a tradição local encontra a mesa grande do circuito panamericano.",
    backgroundAsset: centroAmericanoTruqueiroMedelinBackgroundAsset,
    hostPortraitAsset: centroAmericanoTruqueiroMedelinHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "hotel-truco-segovia-espanha": {
    hostName: "Isabel Valcárcel",
    hostRole: "Diretora Cerimonial",
    hostQuote: "O mundo viu. A mesa confirmou.",
    leadText: "Salão histórico, delegações em silêncio e truco com peso mundial.",
    description: "Em Segóvia, cada chamada parece ata oficial diante do mundo inteiro.",
    backgroundAsset: hotelTrucoSegoviaEspanhaBackgroundAsset,
    hostPortraitAsset: hotelTrucoSegoviaEspanhaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "casino-me-maior": {
    hostName: "Dante Maior",
    hostRole: "Dono do Cassino",
    hostQuote: "Elegante. E perigoso.",
    leadText: "Luxo silencioso, mesa final e cada blefe parecendo contrato.",
    description: "No Cassino Mé Maior, a casa sorri baixo antes de cobrar caro.",
    backgroundAsset: casinoMeMaiorBackgroundAsset,
    hostPortraitAsset: casinoMeMaiorHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
  "orbita-da-lua": {
    hostName: "Cosme Órbita",
    hostRole: "Operador da Transmissão Orbital",
    hostQuote: "Sem gravidade, mas com malícia.",
    leadText: "Bônus final. Truco em órbita, resenha lunar e blefe transmitido ao vivo.",
    description: "Na Órbita da Lua, o mundo ficou pequeno e a mesa resolveu desafiar o espaço.",
    backgroundAsset: orbitaDaLuaBackgroundAsset,
    hostPortraitAsset: orbitaDaLuaHostAsset,
    quoteBoardAsset: zeCatingaQuoteBoardAsset,
    ctaPlaqueAsset: zeCatingaCtaPlaqueAsset,
    difficultyBottleAsset: zeCatingaDifficultyBottleAsset,
    dividerAsset: zeCatingaDividerAsset,
    statsPlaqueAsset: zeCatingaStatsPlaqueAsset,
  },
}

const MATCH_RESULT_ASSET_BY_VENUE_ID: Record<string, { loss?: string; win?: string }> = {
  "bar-do-ze-catinga": {
    loss: zeCatingaMatchResultLossAsset,
    win: zeCatingaMatchResultWinAsset,
  },
  "bar-maneco-banguela": {
    loss: manecoBanguelaMatchResultLossAsset,
    win: manecoBanguelaMatchResultWinAsset,
  },
  "trem-do-jaca": {
    loss: tremDoJacaMatchResultLossAsset,
    win: tremDoJacaMatchResultWinAsset,
  },
  "adega-do-juca-bigode": {
    loss: adegaJucaBigodeMatchResultLossAsset,
    win: adegaJucaBigodeMatchResultWinAsset,
  },
  "zona-norte-garagem": {
    loss: zonaNorteGaragemMatchResultLossAsset,
    win: zonaNorteGaragemMatchResultWinAsset,
  },
  "zona-leste-quintal": {
    loss: zonaLesteQuintalMatchResultLossAsset,
    win: zonaLesteQuintalMatchResultWinAsset,
  },
  "centro-subsolo": {
    loss: centroSubsoloMatchResultLossAsset,
    win: centroSubsoloMatchResultWinAsset,
  },
  "zona-sul-salao": {
    loss: zonaSulSalaoMatchResultLossAsset,
    win: zonaSulSalaoMatchResultWinAsset,
  },
  "centro-convencoes-prefeitura": {
    loss: centroConvencoesPrefeituraMatchResultLossAsset,
    win: centroConvencoesPrefeituraMatchResultWinAsset,
  },
  "ginasio-estadual-maneco-file": {
    loss: ginasioEstadualManecoFileMatchResultLossAsset,
    win: ginasioEstadualManecoFileMatchResultWinAsset,
  },
  "arena-nacional": {
    loss: arenaNacionalMatchResultLossAsset,
    win: arenaNacionalMatchResultWinAsset,
  },
  "centro-americano-truqueiro-medelin": {
    loss: centroAmericanoTruqueiroMedelinMatchResultLossAsset,
    win: centroAmericanoTruqueiroMedelinMatchResultWinAsset,
  },
  "hotel-truco-segovia-espanha": {
    loss: hotelTrucoSegoviaEspanhaMatchResultLossAsset,
    win: hotelTrucoSegoviaEspanhaMatchResultWinAsset,
  },
  "casino-me-maior": {
    loss: casinoMeMaiorMatchResultLossAsset,
    win: casinoMeMaiorMatchResultWinAsset,
  },
  "orbita-da-lua": {
    loss: orbitaDaLuaMatchResultLossAsset,
    win: orbitaDaLuaMatchResultWinAsset,
  },
}

const CAMPAIGN_VICTORY_ASSET_BY_VENUE_ID: Record<string, string> = {
  "bar-do-ze-catinga": victoryVenueBarDoZeCatingaAsset,
  "bar-maneco-banguela": victoryVenueBarManecoBanguelaAsset,
  "trem-do-jaca": victoryVenueTremDoJacaAsset,
  "adega-do-juca-bigode": victoryVenueAdegaJucaBigodeAsset,
  "zona-norte-garagem": victoryVenueZonaNorteGaragemAsset,
  "zona-leste-quintal": victoryVenueZonaLesteQuintalAsset,
  "centro-subsolo": victoryVenueCentroSubsoloAsset,
  "zona-sul-salao": victoryVenueZonaSulSalaoAsset,
  "centro-convencoes-prefeitura": victoryVenueCentroConvencoesPrefeituraAsset,
  "ginasio-estadual-maneco-file": victoryVenueGinasioEstadualManecoFileAsset,
  "arena-nacional": victoryVenueArenaNacionalAsset,
  "centro-americano-truqueiro-medelin": victoryVenueCentroAmericanoTruqueiroMedelinAsset,
  "hotel-truco-segovia-espanha": victoryVenueHotelTrucoSegoviaEspanhaAsset,
  "casino-me-maior": victoryVenueCasinoMeMaiorAsset,
  "orbita-da-lua": victoryVenueOrbitaDaLuaAsset,
}

const CAMPAIGN_VICTORY_ASSET_BY_STAGE_ID: Record<string, string> = {
  "rua-periferia": victoryStageRuaPeriferiaAsset,
  "campeonato-vila-nana": victoryStageCampeonatoVilaNanaAsset,
  "zonas-da-cidade": victoryStageZonasCidadeAsset,
  "campeonato-estadual": victoryStageCampeonatoEstadualAsset,
  "campeonato-nacional": victoryStageCampeonatoNacionalAsset,
  "circuito-panamericano": victoryStageCircuitoPanamericanoAsset,
  "jogos-mundiais": victoryStageJogosMundiaisAsset,
  mundial: victoryStageMundialAsset,
  intergalactico: victoryStageIntergalacticoAsset,
}

interface ControlsPanelProps {
  activeVariant: GameVariant
  campaignCompleted: boolean
  variantSelectionDisabled: boolean
  currentCampaignVenue: CampaignVenue | null
  onChangeVariant: (variant: GameVariant) => void
  onStart: () => void
  styles: StyleMap
}

export function ControlsPanel({
  activeVariant,
  variantSelectionDisabled,
  currentCampaignVenue,
  onChangeVariant,
  onStart,
  styles,
}: ControlsPanelProps) {
  return (
    <div style={styles.panelCard}>
      <div style={styles.panelTitle}>Controles</div>

      <div style={styles.controlRow}>
        <label htmlFor="variant" style={styles.label}>
          Variante
        </label>

        <select
          id="variant"
          value={activeVariant}
          onChange={(e) => onChangeVariant(e.target.value as GameVariant)}
          style={styles.select}
          disabled={variantSelectionDisabled}
        >
          <option value="MINEIRO">Truco Mineiro</option>
          <option value="PAULISTA">Truco Paulista</option>
        </select>
      </div>

      <div style={styles.buttonRow}>
        <button
          style={{
            ...styles.primaryButton,
            ...(!currentCampaignVenue ? styles.disabledButton : {}),
          }}
          onClick={onStart}
          disabled={!currentCampaignVenue}
        >
          COMEÇAR
        </button>
      </div>

      <div style={styles.helpBox}>
        <div style={styles.helpTitle}>Como jogar agora</div>
        <p style={styles.helpText}>
          1. Inicie a partida do local atual.
          <br />
          2. Quando for sua vez, clique em uma carta.
          <br />
          3. As IAs jogam automaticamente, e os balões mostram o que está acontecendo.
          <br />
          4. Se a IA pedir truco, seis, nove ou doze, responda com <strong>Aceitar</strong> ou <strong>Correr</strong>.
        </p>
      </div>
    </div>
  )
}

interface HandStatusPanelProps {
  activeVariant: GameVariant
  currentCampaignVenue: CampaignVenue | null
  handState: HandState | null
  matchHandNumber: number
  matchScoreLabel: string
  handScoreLabel: string
  currentTurnLabel: string
  statusMessage: string
  eventMessage: string
  styles: StyleMap
}

export function HandStatusPanel({
  activeVariant,
  currentCampaignVenue,
  handState,
  matchHandNumber,
  matchScoreLabel,
  handScoreLabel,
  currentTurnLabel,
  statusMessage,
  eventMessage,
  styles,
}: HandStatusPanelProps) {
  return (
    <div style={styles.panelCard}>
      <div style={styles.panelTitle}>Status da mão</div>

      <div style={styles.infoGrid}>
        <InfoBox label="Variante" value={handState?.variant ?? activeVariant} styles={styles} />
        <InfoBox
          label="Local"
          value={currentCampaignVenue?.name ?? "Campanha concluída"}
          styles={styles}
        />
        <InfoBox
          label="Vira"
          value={handState?.vira ? formatCard(handState.vira) : "—"}
          styles={styles}
        />
        <InfoBox label="Manilha" value={getManilhaLabel(handState)} styles={styles} />
        <InfoBox
          label="Rodada atual"
          value={String(matchHandNumber)}
          styles={styles}
        />
        <InfoBox
          label="Mão"
          value={handState ? `${handState.roundNumber}ª` : "—"}
          styles={styles}
        />
        <InfoBox label="Placar partida" value={matchScoreLabel} styles={styles} />
        <InfoBox label="Placar das vazas" value={handScoreLabel} styles={styles} />
        <InfoBox label="Vez" value={currentTurnLabel} styles={styles} />
        <InfoBox
          label="Valendo"
          value={handState ? getBetBadgeLabel(handState.currentBet) : getBetBadgeLabel(1)}
          styles={styles}
        />
        <InfoBox label="Estado" value={getStateLabel(handState)} styles={styles} />
      </div>

      <div style={styles.statusBanner}>
        <div style={styles.statusBannerLabel}>Mensagem</div>
        <div style={styles.statusBannerText}>{statusMessage}</div>
      </div>

      <div
        style={{
          ...styles.eventBanner,
          ...(handState?.finished ? styles.eventBannerFinished : {}),
        }}
      >
        <div style={styles.eventBannerLabel}>Último evento</div>
        <div style={styles.eventBannerText}>{eventMessage || "Nenhum evento ainda."}</div>
      </div>

      <div style={styles.teamLegendRow}>
        <div style={styles.teamLegendBox}>
          <strong>Nós:</strong> Jogadores 1 e 3
        </div>
        <div style={styles.teamLegendBox}>
          <strong>Eles:</strong> Jogadores 2 e 4
        </div>
      </div>
    </div>
  )
}

interface CampaignPanelProps {
  campaignCompleted: boolean
  currentCampaignStage: CampaignStage
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  campaignSummary: {
    stageCount: number
    venueCount: number
    totalMatches: number
  }
  playerProfile: PlayerProfile
  onResetCampaign: () => void
  styles: StyleMap
}

export function CampaignPanel({
  campaignCompleted,
  currentCampaignStage,
  currentCampaignVenue,
  currentVenueWins,
  campaignSummary,
  playerProfile,
  onResetCampaign,
  styles,
}: CampaignPanelProps) {
  return (
    <section style={styles.progressionCard}>
      <div style={styles.progressionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Jornada do Jogador</h2>
          <div style={styles.progressionSubtitle}>
            Arquitetura inicial da campanha, progressão e economia do jogo final
          </div>
        </div>

        <div style={styles.progressionBadge}>
          {campaignCompleted
            ? "Campanha concluída"
            : `Etapa atual: ${currentCampaignStage.name}`}
        </div>
      </div>

      <div style={styles.progressionSummaryGrid}>
        <InfoBox label="Etapas" value={String(campaignSummary.stageCount)} styles={styles} />
        <InfoBox label="Locais" value={String(campaignSummary.venueCount)} styles={styles} />
        <InfoBox
          label="Partidas base"
          value={String(campaignSummary.totalMatches)}
          styles={styles}
        />
        <InfoBox
          label="Itens prontos"
          value={String(UNLOCKABLE_ITEMS.length)}
          styles={styles}
        />
        <InfoBox
          label="Produtos futuros"
          value={String(STORE_PRODUCTS.length)}
          styles={styles}
        />
        <InfoBox
          label="Moedas"
          value={`${playerProfile.currencies.coins} / ${playerProfile.currencies.gems}`}
          styles={styles}
        />
      </div>

      <div style={styles.campaignStatusBar}>
        <div style={styles.campaignStatusPrimary}>
          <div style={styles.campaignStatusTitle}>
            {currentCampaignVenue?.name ?? "Você concluiu toda a campanha atual"}
          </div>
          <div style={styles.campaignStatusText}>
            {currentCampaignVenue
              ? `${currentCampaignVenue.districtLabel} · ${currentVenueWins}/${currentCampaignVenue.matchesToClear} vitórias neste local`
              : "Use “Zerar campanha” para recomeçar desde o primeiro boteco."}
          </div>
        </div>

        <div style={styles.campaignStatusMeta}>
          <span>V {playerProfile.campaign.wins}</span>
          <span>D {playerProfile.campaign.losses}</span>
          <span>{playerProfile.currencies.coins} moedas</span>
        </div>
      </div>

      <div style={styles.campaignButtonsRow}>
        <button style={styles.secondaryButton} onClick={onResetCampaign}>
          Zerar campanha
        </button>
      </div>

      <div style={styles.progressionBody}>
        <div style={styles.progressionColumn}>
          <div style={styles.progressionColumnTitle}>Roadmap de campanha</div>

          <div style={styles.stageGrid}>
            {CAMPAIGN_STAGES.map((stage) => (
              <CampaignStageCard
                key={stage.id}
                stage={stage}
                active={stage.id === currentCampaignStage.id}
                completed={playerProfile.campaign.completedStageIds.includes(stage.id)}
                styles={styles}
              />
            ))}
          </div>
        </div>

        <div style={styles.progressionColumn}>
          <div style={styles.progressionColumnTitle}>Visão de produto</div>

          <div style={styles.roadmapBox}>
            <div style={styles.roadmapTitle}>Campanha</div>
            <p style={styles.roadmapText}>
              O jogo agora já tem estrutura para crescer de botecos de rua até o
              mundial, com uma etapa bônus depois da campanha principal.
            </p>
          </div>

          <div style={styles.roadmapBox}>
            <div style={styles.roadmapTitle}>Progressão</div>
            <p style={styles.roadmapText}>
              Cada etapa pode variar na quantidade de locais e partidas, sem
              precisar reescrever o fluxo principal.
            </p>
          </div>

          <div style={styles.roadmapBox}>
            <div style={styles.roadmapTitle}>Monetização futura</div>
            <p style={styles.roadmapText}>
              A base já separa campanha, perfil e economia para suportar
              cosméticos, remoção de anúncios e conteúdo extra sem invadir a
              lógica do truco.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TableSectionProps {
  handState: HandState | null
  inGameConfirmation: {
    title: string
    message: string
    confirmLabel: string
    warning: string
  } | null
  inGameContextMenuOpen: boolean
  matchState: MatchState | null
  matchResultScreen: MatchResultScreenState | null
  campaignVictoryScreen: CampaignVictoryScreenState | null
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  dealAnimationNonce: number
  freePlayRun: FreePlayRunState | null
  gameplayIntroPhase: GameplayIntroPhase
  hasSelectedPartnerForVenue: boolean
  menuScreen:
    | "start"
    | "tutorial"
    | "journey-intro"
    | "player-skin-select"
    | "character-select"
    | "venue-intro"
    | "campaign-victory"
    | "match-result"
  playerProfile: PlayerProfile
  selectedPlayerSkin: PlayerSkinProfile
  selectedPlayerSkinCandidate: PlayerSkinProfile
  selectedPlayerSkinIndex: number
  selectablePlayerSkins: PlayerSkinProfile[]
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  isSelectedCharacterUnlocked: boolean
  selectedPartnerCharacter: TrucoCharacterProfile | null
  selectableCharacters: TrucoCharacterProfile[]
  opponentCharacters: TrucoCharacterProfile[]
  speechBubble: SpeechBubbleState | null
  tableByPlayer: Record<number, TableCard | undefined>
  lastPlayedPlayerId: number | null
  player1: Player | null
  player3: Player | null
  canRequestTruco: boolean
  canHumanAdvisePartner: boolean
  canHumanDecideNineHand: boolean
  canHumanRaiseTruco: boolean
  canHumanRespondToTruco: boolean
  canPlayHumanCard: boolean
  canPlayCoveredCard: boolean
  onCloseCharacterSelect: () => void
  onCloseFreePlayStage: () => void
  onCloseJourneyIntro: () => void
  onCloseTutorial: () => void
  onClosePlayerSkinSelect: () => void
  onContinueToCharacterSelect: () => void
  onConfirmCharacterSelect: () => void
  onConfirmPlayerSkinSelect: () => void
  onEnterVenueFromIntro: () => void
  onLaunchVenue: (venueId: string) => void
  onOpenFreePlayStage: (stageId: string) => void
  onOpenCharacterSelect: () => void
  onPlayNineHand: () => void
  onFoldNineHand: () => void
  onReturnToJourneyFlow: () => void
  onResetCampaign: () => void
  onSelectNextCharacter: () => void
  onSelectPreviousCharacter: () => void
  onSelectNextPlayerSkin: () => void
  onSelectPreviousPlayerSkin: () => void
  onStart: () => void
  onStartTutorial: () => void
  onRequestTruco: () => void
  onAcceptTruco: () => void
  onAddEightPointsFromContextMenu: () => void
  onAdvisePartner: (advice: PartnerAdvice) => void
  onCancelInGameConfirmation: () => void
  onCloseInGameContextMenu: () => void
  onConfirmInGameConfirmation: () => void
  onExitMatchFromContextMenu: () => void
  onLoseMatchFromContextMenu: () => void
  onOpenInGameContextMenu: () => void
  onRaiseTruco: () => void
  onResetProgressFromContextMenu: () => void
  onRunFromTruco: () => void
  onSwapPartnerFromContextMenu: () => void
  onWinMatchFromContextMenu: () => void
  onPlayCard: (card: Card, options?: { covered?: boolean }) => void
  styles: StyleMap
}

export function TableSection({
  handState,
  inGameConfirmation,
  inGameContextMenuOpen,
  matchState,
  matchResultScreen,
  campaignVictoryScreen,
  currentCampaignVenue,
  currentVenueWins,
  dealAnimationNonce,
  freePlayRun,
  gameplayIntroPhase,
  hasSelectedPartnerForVenue,
  menuScreen,
  playerProfile,
  selectedPlayerSkin,
  selectedPlayerSkinCandidate,
  selectedPlayerSkinIndex,
  selectablePlayerSkins,
  selectedCharacter,
  selectedCharacterIndex,
  isSelectedCharacterUnlocked,
  selectedPartnerCharacter,
  selectableCharacters,
  opponentCharacters,
  speechBubble,
  tableByPlayer,
  lastPlayedPlayerId,
  player1,
  player3,
  canRequestTruco,
  canHumanAdvisePartner,
  canHumanDecideNineHand,
  canHumanRaiseTruco,
  canHumanRespondToTruco,
  canPlayHumanCard,
  canPlayCoveredCard,
  onCloseCharacterSelect,
  onCloseFreePlayStage,
  onCloseJourneyIntro,
  onCloseTutorial,
  onClosePlayerSkinSelect,
  onContinueToCharacterSelect,
  onConfirmCharacterSelect,
  onConfirmPlayerSkinSelect,
  onEnterVenueFromIntro,
  onLaunchVenue,
  onOpenFreePlayStage,
  onOpenCharacterSelect,
  onPlayNineHand,
  onFoldNineHand,
  onReturnToJourneyFlow,
  onResetCampaign,
  onSelectNextCharacter,
  onSelectPreviousCharacter,
  onSelectNextPlayerSkin,
  onSelectPreviousPlayerSkin,
  onStart,
  onStartTutorial,
  onRequestTruco,
  onAcceptTruco,
  onAddEightPointsFromContextMenu,
  onAdvisePartner,
  onCancelInGameConfirmation,
  onCloseInGameContextMenu,
  onConfirmInGameConfirmation,
  onExitMatchFromContextMenu,
  onLoseMatchFromContextMenu,
  onOpenInGameContextMenu,
  onRaiseTruco,
  onResetProgressFromContextMenu,
  onRunFromTruco,
  onSwapPartnerFromContextMenu,
  onWinMatchFromContextMenu,
  onPlayCard,
  styles,
}: TableSectionProps) {
  const [nineHandHintDismissed, setNineHandHintDismissed] = useState(false)
  const tableSceneModel = buildTableSceneModel(
    handState,
    tableByPlayer,
    lastPlayedPlayerId,
    currentCampaignVenue
  )
  const showNineHandHint = canHumanDecideNineHand && !nineHandHintDismissed
  const handlePlayNineHandClick = () => {
    setNineHandHintDismissed(true)
    onPlayNineHand()
  }
  const handleFoldNineHandClick = () => {
    setNineHandHintDismissed(true)
    onFoldNineHand()
  }
  const isMenuMode = !handState
  const isGameplayIntroActive = gameplayIntroPhase !== "done"
  const gameplayIntroContentStyle =
    gameplayIntroPhase === "background"
      ? styles.gameplayIntroContentBackground
      : gameplayIntroPhase === "reveal"
        ? styles.gameplayIntroContentReveal
        : undefined
  const isVenueIntroMode = isMenuMode && menuScreen === "venue-intro"
  const rosterPlayers = handState?.players ?? [
    { id: 2, hand: [] },
    { id: 3, hand: [] },
    { id: 4, hand: [] },
    { id: 1, hand: [] },
  ]
  const playerAvatarById: Record<number, string> = {
    1: selectedPlayerSkin.avatarAsset,
    2: opponentCharacters[0]?.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    3: selectedPartnerCharacter?.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    4: opponentCharacters[1]?.avatarAsset ?? opponentCharacters[0]?.avatarAsset ?? selectedPlayerSkin.avatarAsset,
  }
  const playerNameById: Record<number, string> = {
    1: "Você",
    2: opponentCharacters[0]?.name ?? "Adversário esquerdo",
    3: selectedPartnerCharacter?.name ?? "Parceira",
    4: opponentCharacters[1]?.name ?? "Adversário direito",
  }

  if (isVenueIntroMode) {
    return (
      <section style={styles.tablePanel}>
        <div
          style={{
            ...styles.tableHudSurface,
            backgroundImage: "none",
            backgroundColor: "#120a06",
            padding: 0,
          }}
        >
          <div style={styles.gameViewportStageSlot}>
            <div style={styles.gameViewportFrame}>
              <VenueIntroScreen
                currentCampaignVenue={currentCampaignVenue}
                currentVenueWins={currentVenueWins}
                hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
                opponentCharacters={opponentCharacters}
                playerProfile={playerProfile}
                selectedPlayerSkin={selectedPlayerSkin}
                onOpenCharacterSelect={onOpenCharacterSelect}
                onStart={onEnterVenueFromIntro}
                styles={styles}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section style={styles.tablePanel}>
      <div style={styles.tableHudSurface}>
        <div style={styles.gameViewportStageSlot}>
          <div style={styles.gameViewportFrame}>
            <div style={styles.gameViewport}>
              {isMenuMode ? (
                menuScreen === "campaign-victory" ? (
                  <CampaignVictoryScreen
                    victory={campaignVictoryScreen}
                    onContinue={onReturnToJourneyFlow}
                    styles={styles}
                  />
                ) : menuScreen === "match-result" ? (
                  <MatchResultScreen
                    currentCampaignVenue={currentCampaignVenue}
                    result={matchResultScreen}
                    onContinue={onReturnToJourneyFlow}
                    styles={styles}
                  />
                ) : menuScreen === "journey-intro" ? (
                  <JourneyIntroScreen
                    currentCampaignVenue={currentCampaignVenue}
                    freePlayRun={freePlayRun}
                    playerProfile={playerProfile}
                    onBack={onCloseJourneyIntro}
                    onCloseFreePlayStage={onCloseFreePlayStage}
                    onContinueToCharacterSelect={onContinueToCharacterSelect}
                    onLaunchVenue={onLaunchVenue}
                    onOpenFreePlayStage={onOpenFreePlayStage}
                    onResetCampaign={onResetCampaign}
                    styles={styles}
                  />
                ) : menuScreen === "player-skin-select" ? (
                  <PlayerSkinSelectionScreen
                    selectedPlayerSkin={selectedPlayerSkinCandidate}
                    selectedPlayerSkinIndex={selectedPlayerSkinIndex}
                    selectablePlayerSkins={selectablePlayerSkins}
                    onBack={onClosePlayerSkinSelect}
                    onConfirm={onConfirmPlayerSkinSelect}
                    onNext={onSelectNextPlayerSkin}
                    onPrevious={onSelectPreviousPlayerSkin}
                    styles={styles}
                  />
                ) : menuScreen === "character-select" ? (
                  <CharacterSelectionScreen
                    currentCampaignVenue={currentCampaignVenue}
                    hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
                    selectedCharacter={selectedCharacter}
                    selectedCharacterIndex={selectedCharacterIndex}
                    isSelectedCharacterUnlocked={isSelectedCharacterUnlocked}
                    selectedPartnerCharacter={selectedPartnerCharacter}
                    selectableCharacters={selectableCharacters}
                    onBack={onCloseCharacterSelect}
                    onConfirm={onConfirmCharacterSelect}
                    onNext={onSelectNextCharacter}
                    onPrevious={onSelectPreviousCharacter}
                    styles={styles}
                  />
                ) : menuScreen === "venue-intro" ? (
                  <VenueIntroScreen
                    currentCampaignVenue={currentCampaignVenue}
                    currentVenueWins={currentVenueWins}
                    hasSelectedPartnerForVenue={hasSelectedPartnerForVenue}
                    opponentCharacters={opponentCharacters}
                    playerProfile={playerProfile}
                    selectedPlayerSkin={selectedPlayerSkin}
                    onOpenCharacterSelect={onOpenCharacterSelect}
                    onStart={onEnterVenueFromIntro}
                    styles={styles}
                  />
                ) : menuScreen === "tutorial" ? (
                  <TutorialDraftScreen
                    selectedPlayerSkin={selectedPlayerSkin}
                    onBack={onCloseTutorial}
                    styles={styles}
                  />
                ) : (
                  <GameStartScreen
                    onStart={onStart}
                    onStartTutorial={onStartTutorial}
                    styles={styles}
                  />
                )
              ) : (
                <>
                <div style={{ ...styles.gameLeftRail, ...gameplayIntroContentStyle }}>
                  <div style={styles.scenePanel}>
                    <div style={styles.scenePanelTitle}>Mesa</div>
                    <div style={styles.rosterGrid}>
                      {rosterPlayers.map((player) => (
                        <div
                          key={player.id}
                          style={{
                            ...styles.rosterCard,
                            ...(player.id === 1 ? styles.rosterCardHuman : {}),
                          }}
                        >
                          <div style={styles.rosterAvatar}>
                            <img
                              src={playerAvatarById[player.id]}
                              alt={playerNameById[player.id]}
                              style={styles.rosterAvatarImage}
                            />
                          </div>
                          <div style={styles.rosterName}>{playerNameById[player.id]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.scorePadCard}>
                    <div
                      style={{
                        ...styles.scorePadCardSurface,
                        backgroundImage: `linear-gradient(180deg, rgba(248,242,231,0.14) 0%, rgba(233,221,198,0.18) 100%), url(${scorePadNotebookAsset})`,
                      }}
                    >
                      <div style={styles.scorePadGrid}>
                        <div style={styles.scorePadCellTopLeft}>
                          <div style={{ ...styles.scorePadLabel, ...styles.scorePadLabelLeft }}>
                            Nós
                          </div>
                          <div style={{ ...styles.scorePadValue, ...styles.scorePadValueLeft }}>
                            {matchState?.score.A ?? 0}
                          </div>
                        </div>
                        <div style={styles.scorePadCellTopRight}>
                          <div style={{ ...styles.scorePadLabel, ...styles.scorePadLabelRight }}>
                            Eles
                          </div>
                          <div style={{ ...styles.scorePadValue, ...styles.scorePadValueRight }}>
                            {matchState?.score.B ?? 0}
                          </div>
                        </div>
                        <div style={styles.scorePadCellBottomLeft}>
                          <div
                            style={{
                              ...styles.scorePadMetaLabel,
                              ...styles.scorePadMetaLabelLeft,
                            }}
                          >
                            Mão
                          </div>
                          <div
                            style={{
                              ...styles.scorePadMetaValue,
                              ...styles.scorePadMetaValueLeft,
                            }}
                          >
                            {handState?.score.A ?? 0}
                          </div>
                        </div>
                        <div style={styles.scorePadCellBottomRight}>
                          <div
                            style={{
                              ...styles.scorePadMetaLabel,
                              ...styles.scorePadMetaLabelRight,
                            }}
                          >
                            Mão
                          </div>
                          <div
                            style={{
                              ...styles.scorePadMetaValue,
                              ...styles.scorePadMetaValueRight,
                            }}
                          >
                            {handState?.score.B ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ ...styles.gameMainColumn, ...gameplayIntroContentStyle }}>
                  <div style={styles.tableSurfaceWrap}>
                    <div style={styles.tableSurface}>
                      <GameTableScene
                        model={tableSceneModel}
                        speechBubble={speechBubble}
                        dealAnimationNonce={dealAnimationNonce}
                        animationsEnabled={!isGameplayIntroActive}
                      />
                    </div>
                  </div>

                  <div style={styles.playerCardsBlock}>
                    <HumanCardsPanel
                      inGameContextMenuOpen={inGameContextMenuOpen}
                      player1={player1}
                      canPlayHumanCard={canPlayHumanCard}
                      canPlayCoveredCard={canPlayCoveredCard}
                      onCloseInGameContextMenu={onCloseInGameContextMenu}
                      onAddEightPointsFromContextMenu={onAddEightPointsFromContextMenu}
                      onExitMatchFromContextMenu={onExitMatchFromContextMenu}
                      onLoseMatchFromContextMenu={onLoseMatchFromContextMenu}
                      onOpenInGameContextMenu={onOpenInGameContextMenu}
                      onPlayCard={onPlayCard}
                      onResetProgressFromContextMenu={onResetProgressFromContextMenu}
                      onSwapPartnerFromContextMenu={onSwapPartnerFromContextMenu}
                      onWinMatchFromContextMenu={onWinMatchFromContextMenu}
                      gameplayIntroActive={isGameplayIntroActive}
                      styles={styles}
                    />
                  </div>
                </div>

                <div
                  style={{
                    ...styles.gameSidebarColumn,
                    ...styles.gameSidebarColumnActionsOnly,
                    ...gameplayIntroContentStyle,
                  }}
                >
                  <div style={{ ...styles.tableHudSidebar, ...styles.tableHudSidebarActionsOnly }}>
                    <div
                      style={{
                        ...styles.inGameActionsCard,
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        marginTop: 0,
                      }}
                    >
                      {canHumanDecideNineHand ? (
                        <div style={styles.nineHandDecisionPanel}>
                          {showNineHandHint ? (
                            <div style={styles.nineHandDecisionTooltip}>
                              <strong style={styles.nineHandDecisionTooltipTitle}>Mão de 9</strong>
                              <span style={styles.nineHandDecisionTooltipText}>
                                veja as cartas da parceira aqui
                              </span>
                            </div>
                          ) : null}
                          <div style={styles.nineHandDecisionTitle}>Mão de 9</div>
                          <div style={styles.nineHandDecisionText}>
                            Cartas da parceira
                          </div>
                          <div style={styles.nineHandPartnerCards}>
                            {player3?.hand.map((card, index) => (
                              <div
                                key={`${card.rank}-${card.suit}-${index}`}
                                style={styles.nineHandPartnerCard}
                              >
                                <span style={{ ...styles.nineHandPartnerRank, color: getSuitColor(card.suit) }}>
                                  {card.rank}
                                </span>
                                <span style={{ ...styles.nineHandPartnerSuit, color: getSuitColor(card.suit) }}>
                                  {getSuitSymbol(card.suit)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div style={styles.inGameActionsGrid}>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                              }}
                              onClick={handlePlayNineHandClick}
                            >
                              Jogar
                            </button>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                              }}
                              onClick={handleFoldNineHandClick}
                            >
                              Correr
                            </button>
                          </div>
                        </div>
                      ) : canHumanAdvisePartner ? (
                        <div style={styles.inGameActionsGrid}>
                          <button
                            style={{
                              ...styles.trucoSecondaryButton,
                              backgroundImage: `url(${actionButtonAsset})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              border: "none",
                              color: "#f7efe0",
                              boxShadow: "none",
                            }}
                            onClick={() => onAdvisePartner("BORA!")}
                          >
                            BORA!
                          </button>
                          <button
                            style={{
                              ...styles.trucoSecondaryButton,
                              backgroundImage: `url(${actionButtonAsset})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              border: "none",
                              color: "#f7efe0",
                              boxShadow: "none",
                            }}
                            onClick={() => onAdvisePartner("CÊ QUE SABE!")}
                          >
                            CÊ QUE SABE!
                          </button>
                          <button
                            style={{
                              ...styles.trucoSecondaryButton,
                              backgroundImage: `url(${actionButtonAsset})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              border: "none",
                              color: "#f7efe0",
                              boxShadow: "none",
                            }}
                            onClick={() => onAdvisePartner("MELHOR CORRER!")}
                          >
                            MELHOR CORRER!
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={styles.inGameActionsRow}>
                            <button
                              style={{
                                ...styles.trucoPrimaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canRequestTruco ? styles.disabledButton : {}),
                              }}
                              onClick={onRequestTruco}
                              disabled={!canRequestTruco}
                            >
                              {getRequestBetButtonLabel(handState)}
                            </button>
                          </div>
                          <div style={styles.inGameActionsGrid}>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
                              }}
                              onClick={onAcceptTruco}
                              disabled={!canHumanRespondToTruco}
                            >
                              Aceitar
                            </button>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canHumanRaiseTruco
                                  ? styles.disabledButton
                                  : {}),
                              }}
                              onClick={onRaiseTruco}
                              disabled={!canHumanRaiseTruco}
                            >
                              {getRaiseResponseButtonLabel(handState)}
                            </button>
                            <button
                              style={{
                                ...styles.trucoSecondaryButton,
                                backgroundImage: `url(${actionButtonAsset})`,
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                border: "none",
                                color: "#f7efe0",
                                boxShadow: "none",
                                ...(!canHumanRespondToTruco ? styles.disabledButton : {}),
                              }}
                              onClick={onRunFromTruco}
                              disabled={!canHumanRespondToTruco}
                            >
                              Correr
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>

            {handState && inGameConfirmation ? (
              <div style={styles.inGameConfirmationOverlay}>
                <div style={styles.inGameConfirmationCard}>
                  <div style={styles.inGameConfirmationEyebrow}>Confirmação</div>
                  <h3 style={styles.inGameConfirmationTitle}>{inGameConfirmation.title}</h3>
                  <p style={styles.inGameConfirmationText}>{inGameConfirmation.message}</p>
                  <div style={styles.inGameConfirmationWarning}>
                    {inGameConfirmation.warning}
                  </div>
                  <div style={styles.inGameConfirmationActions}>
                    <button
                      style={styles.inGameConfirmationCancelButton}
                      onClick={onCancelInGameConfirmation}
                    >
                      Cancelar
                    </button>
                    <button
                      style={styles.inGameConfirmationConfirmButton}
                      onClick={onConfirmInGameConfirmation}
                    >
                      {inGameConfirmation.confirmLabel}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {handState && isGameplayIntroActive ? (
              <div
                aria-hidden="true"
                style={
                  gameplayIntroPhase === "background"
                    ? styles.gameplayIntroBlockerBackground
                    : styles.gameplayIntroBlockerReveal
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function GameStartScreen({
  onStart,
  onStartTutorial,
  styles,
}: {
  onStart: () => void
  onStartTutorial: () => void
  styles: StyleMap
}) {
  return (
    <div style={styles.gameStartScreen}>
      <img
        src={startScreenAsset}
        alt=""
        aria-hidden="true"
        style={styles.gameStartBackdrop}
      />
      <img
        src={startScreenAsset}
        alt="Truco Raiz"
        style={styles.gameStartImage}
      />
      <button
        aria-label="Tutorial"
        style={styles.gameStartTutorialButton}
        onClick={onStartTutorial}
      >
        Tutorial
      </button>
      <button
        aria-label="Começar"
        title="Começar"
        style={styles.gameStartHotspot}
        onClick={onStart}
      />
    </div>
  )
}

type TutorialDraftStep = {
  id: string
  title: string
  text: string
  target: string
  anchor:
    | "top-left"
    | "top-right"
    | "right"
    | "left"
    | "score-right"
    | "action-left"
    | "bottom-right"
    | "bottom-left"
  expectedAction?:
    | "play-low-card"
    | "play-winning-card"
    | "play-zap"
    | "request-truco"
    | "accept-truco"
    | "run-truco"
    | "raise-truco"
    | "follow-partner-advice"
    | "toggle-covered-card"
    | "play-covered-card"
    | "play-paulista-manilha"
    | "choose-nine-play"
}

const TUTORIAL_DRAFT_STEPS: TutorialDraftStep[] = [
  {
    id: "welcome",
    title: "Vamos na mesa",
    text: "Aqui voce aprende jogando. A gente vai usar uma mesa real do Maneco Banguela e ir passo por passo.",
    target: "Tutorial",
    anchor: "top-left",
  },
  {
    id: "hand",
    title: "Essa e sua mao",
    text: "Essas tres cartas sao suas. No truco, voce joga uma carta por vaza.",
    target: "Sua mao",
    anchor: "bottom-left",
  },
  {
    id: "play-card",
    title: "Jogue uma carta",
    text: "Toque no 2 de paus destacado. Ele vai para a mesa e a vaza sera resolvida.",
    target: "Toque no 2 de paus",
    anchor: "bottom-left",
    expectedAction: "play-low-card",
  },
  {
    id: "trick-result",
    title: "A vaza resolveu",
    text: "Sua parceira ganhou essa vaza com o 3 de copas. Quando nossa dupla vence, o caderno marca ponto na mao.",
    target: "Placar da mao",
    anchor: "left",
  },
  {
    id: "common-order-intro",
    title: "Agora olha a ordem",
    text: "Nas cartas comuns do Mineiro, a forca sobe assim: 4, 5, 6, 7, Q, J, K, A, 2, 3. O 7 dos adversarios esta ganhando por enquanto.",
    target: "Aula 2 · Ordem comum",
    anchor: "right",
  },
  {
    id: "choose-winning-card",
    title: "Ganhe sem gastar demais",
    text: "Toque na Q de copas. Ela e a menor carta da sua mao que vence o 7 da mesa.",
    target: "Toque na Q de copas",
    anchor: "bottom-left",
    expectedAction: "play-winning-card",
  },
  {
    id: "common-order-result",
    title: "Boa escolha",
    text: "A Q venceu 7, 6 e 5. No Mineiro, ela ainda perde para J, K, A, 2 e 3. As manilhas ficam para a proxima aula.",
    target: "Ordem comum",
    anchor: "left",
  },
  {
    id: "manilha-intro",
    title: "Agora entram as manilhas",
    text: "No Mineiro, as manilhas sao fixas: 4 de paus, 7 de copas, A de espada e 7 de ouros. Elas vencem qualquer carta comum.",
    target: "Aula 3 · Manilhas fixas",
    anchor: "right",
  },
  {
    id: "play-zap",
    title: "Use o zap",
    text: "O 3 de paus esta ganhando como carta comum. Toque no 4 de paus, o zap, para tomar a vaza.",
    target: "Toque no 4 de paus",
    anchor: "bottom-left",
    expectedAction: "play-zap",
  },
  {
    id: "manilha-result",
    title: "Manilha manda",
    text: "O zap venceu o 3. Do mais forte para o mais fraco, as manilhas sao: 4 de paus, 7 de copas, A de espada e 7 de ouros.",
    target: "Zap",
    anchor: "left",
  },
  {
    id: "hand-finished",
    title: "Fechou a mao",
    text: "Quando uma dupla ganha duas vazas, a mao termina. Como nos vencemos duas, o ponto sai do placar de baixo e vai para a partida.",
    target: "Aula 4 · Mao e partida",
    anchor: "score-right",
  },
  {
    id: "match-score",
    title: "Partida ate 12",
    text: "O placar de cima e a partida. O placar de baixo e so da mao atual. Depois que uma mao termina, as vazas zeram e a partida continua ate 12.",
    target: "Placar da partida",
    anchor: "score-right",
  },
  {
    id: "truco-intro",
    title: "Hora de pedir truco",
    text: "Quando sua mao esta forte, voce pode pedir truco. Se os adversarios aceitarem, a mao passa a valer 3 pontos.",
    target: "Aula 5 · Pedir truco",
    anchor: "action-left",
  },
  {
    id: "request-truco",
    title: "Peça truco",
    text: "Sua mao esta boa. Toque em Pedir truco para aumentar o valor desta mao.",
    target: "Pedir truco",
    anchor: "action-left",
    expectedAction: "request-truco",
  },
  {
    id: "truco-accepted",
    title: "Eles aceitaram",
    text: "Agora esta valendo 3. No jogo real, os adversarios tambem podem correr ou aumentar para seis.",
    target: "Valendo 3",
    anchor: "action-left",
  },
  {
    id: "response-intro",
    title: "Quando eles pedem",
    text: "Agora e o outro lado: se os adversarios pedem truco, voce decide se aceita, corre ou aumenta.",
    target: "Aula 6 · Responder truco",
    anchor: "action-left",
  },
  {
    id: "respond-accept",
    title: "Aceitar",
    text: "Com uma mao jogavel, aceitar mantem a mao viva e ela passa a valer 3. Toque em Aceitar.",
    target: "Aceitar",
    anchor: "action-left",
    expectedAction: "accept-truco",
  },
  {
    id: "accept-result",
    title: "Mao valendo 3",
    text: "Voce aceitou. Agora a mao vale 3 pontos e o jogo continua normalmente.",
    target: "Valendo 3",
    anchor: "action-left",
  },
  {
    id: "run-intro",
    title: "Quando correr",
    text: "Com mao ruim, correr evita perder mais pontos. Voce entrega 1 ponto e a mao acaba.",
    target: "Correr",
    anchor: "action-left",
  },
  {
    id: "respond-run",
    title: "Corra desta",
    text: "Essa mao nao promete nada. Toque em Correr.",
    target: "Correr",
    anchor: "action-left",
    expectedAction: "run-truco",
  },
  {
    id: "run-result",
    title: "Eles levam 1",
    text: "Voce correu. Os adversarios ganham 1 ponto, mas voce escapou de disputar uma mao valendo 3.",
    target: "Placar da partida",
    anchor: "score-right",
  },
  {
    id: "raise-intro",
    title: "Quando aumentar",
    text: "Com mao muito forte, voce pode aceitar e aumentar. O proximo valor depois do truco e seis.",
    target: "Aumentar",
    anchor: "action-left",
  },
  {
    id: "respond-raise",
    title: "Aumente para seis",
    text: "Agora a mao esta forte. Toque em Aumentar.",
    target: "Aumentar",
    anchor: "action-left",
    expectedAction: "raise-truco",
  },
  {
    id: "raise-result",
    title: "Seis na mesa",
    text: "Voce aumentou. A resposta volta para os adversarios, e se eles aceitarem a mao passa a valer 6.",
    target: "Valendo 6",
    anchor: "action-left",
  },
  {
    id: "partner-intro",
    title: "Jogue com a parceira",
    text: "No truco em dupla, sua parceira tambem le a mesa. Quando alguem pede truco, o conselho dela ajuda a decidir.",
    target: "Aula 7 · Parceira",
    anchor: "left",
  },
  {
    id: "partner-advice",
    title: "Ela chamou",
    text: "A Nega Catimbo disse BORA!, sinal de que ve forca na dupla. Toque em Aceitar para seguir com ela.",
    target: "BORA!",
    anchor: "action-left",
    expectedAction: "follow-partner-advice",
  },
  {
    id: "partner-advice-result",
    title: "A dupla comprou",
    text: "Voce aceitou ouvindo a parceira. O conselho pesa, mas a decisao final continua sendo sua.",
    target: "Valendo 3",
    anchor: "action-left",
  },
  {
    id: "partner-consult",
    title: "Quando ela consulta",
    text: "Se o pedido cai na parceira, ela pode jogar a pergunta para voce: E AI, PARCEIRO? Ai voce responde pela dupla.",
    target: "E AI, PARCEIRO?",
    anchor: "left",
  },
  {
    id: "partner-summary",
    title: "Leia o tom",
    text: "BORA! indica confianca. CE QUE SABE! e meio termo. MELHOR CORRER! avisa mao fraca. Use isso junto com suas cartas.",
    target: "Conselho da parceira",
    anchor: "left",
  },
  {
    id: "covered-locked",
    title: "Primeira vaza aberta",
    text: "Carta coberta nao existe na primeira vaza. Aqui todo mundo precisa jogar aberto para a mesa comecar limpa.",
    target: "Aula 8 · Carta coberta",
    anchor: "right",
  },
  {
    id: "covered-intro",
    title: "Agora pode cobrir",
    text: "A partir da segunda vaza, o toggle Coberta aparece como opcao. Use quando quiser descartar sem disputar a vaza.",
    target: "Coberta",
    anchor: "bottom-right",
    expectedAction: "toggle-covered-card",
  },
  {
    id: "play-covered-card",
    title: "Jogue sem mostrar",
    text: "Com Coberta ligado, toque no 6 de ouros. Ele vai para a mesa virado para baixo e nao disputa essa vaza.",
    target: "Toque no 6 de ouros",
    anchor: "bottom-left",
    expectedAction: "play-covered-card",
  },
  {
    id: "covered-result",
    title: "Coberta nao ganha",
    text: "A carta ficou escondida e nao contou na vaza. Mesmo que fosse forte, coberta funciona como descarte.",
    target: "Carta coberta",
    anchor: "left",
  },
  {
    id: "paulista-intro",
    title: "Agora e Paulista",
    text: "No Truco Paulista existe a vira. Ela aparece no inicio da rodada e define qual rank vira manilha.",
    target: "Aula 9 · Truco Paulista",
    anchor: "right",
  },
  {
    id: "paulista-vira",
    title: "Leia a vira",
    text: "A vira e 5 de ouros. A proxima carta na ordem e o 6, entao todos os 6 viram manilha nesta rodada.",
    target: "Vira: 5 de ouros",
    anchor: "right",
  },
  {
    id: "play-paulista-manilha",
    title: "Use a manilha",
    text: "Toque no 6 de copas. Como a vira foi 5, esse 6 vence ate cartas comuns muito fortes.",
    target: "Toque no 6 de copas",
    anchor: "bottom-left",
    expectedAction: "play-paulista-manilha",
  },
  {
    id: "paulista-result",
    title: "Manilha dinamica",
    text: "No Paulista, a manilha muda a cada rodada. Olhe sempre a vira antes de comparar as cartas.",
    target: "Truco Paulista",
    anchor: "left",
  },
  {
    id: "nine-hand-intro",
    title: "Mao de 9",
    text: "Quando uma dupla chega a 9, 10 ou 11 pontos, vem a mao de 9. Antes de jogar, a dupla decide se entra ou corre.",
    target: "Aula 10 · Mao de 9",
    anchor: "score-right",
  },
  {
    id: "nine-hand-partner",
    title: "Olhe a parceira",
    text: "Na nossa mao de 9, voce pode ver as cartas da parceira aqui na direita antes de decidir.",
    target: "Cartas da parceira",
    anchor: "action-left",
  },
  {
    id: "nine-hand-play",
    title: "Escolha jogar",
    text: "Se jogar e perder, os adversarios levam 3. Se correr agora, eles levam so 1. Para treinar, toque em Jogar.",
    target: "Jogar",
    anchor: "action-left",
    expectedAction: "choose-nine-play",
  },
  {
    id: "nine-hand-result",
    title: "Valendo 3",
    text: "Voce decidiu jogar. A mao segue valendo 3 e truco fica bloqueado nessa mao especial.",
    target: "Mao de 9",
    anchor: "action-left",
  },
  {
    id: "tutorial-finished",
    title: "Pronto pra mesa",
    text: "Voce viu vaza, ordem das cartas, manilhas, truco, parceira, carta coberta, Paulista e mao de 9. Agora e sentar e jogar.",
    target: "Tutorial completo",
    anchor: "right",
  },
]

function getTutorialStepIndex(id: string): number {
  const index = TUTORIAL_DRAFT_STEPS.findIndex((item) => item.id === id)
  return index >= 0 ? index : 0
}

function TutorialDraftScreen({
  selectedPlayerSkin,
  onBack,
  styles,
}: {
  selectedPlayerSkin: PlayerSkinProfile
  onBack: () => void
  styles: StyleMap
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [tutorialCardPlayed, setTutorialCardPlayed] = useState(false)
  const [tutorialSecondCardPlayed, setTutorialSecondCardPlayed] = useState(false)
  const [tutorialZapPlayed, setTutorialZapPlayed] = useState(false)
  const [tutorialTrucoRequested, setTutorialTrucoRequested] = useState(false)
  const [tutorialTrucoResponse, setTutorialTrucoResponse] = useState<
    "accept" | "run" | "raise" | null
  >(null)
  const [tutorialPartnerAdviceAccepted, setTutorialPartnerAdviceAccepted] = useState(false)
  const [tutorialCoveredMode, setTutorialCoveredMode] = useState(false)
  const [tutorialCoveredCardPlayed, setTutorialCoveredCardPlayed] = useState(false)
  const [tutorialPaulistaCardPlayed, setTutorialPaulistaCardPlayed] = useState(false)
  const [tutorialNineHandDecision, setTutorialNineHandDecision] = useState<"play" | null>(null)
  const step = TUTORIAL_DRAFT_STEPS[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === TUTORIAL_DRAFT_STEPS.length - 1
  const mustPlayHighlightedCard =
    (step.expectedAction === "play-low-card" && !tutorialCardPlayed) ||
    (step.expectedAction === "play-winning-card" && !tutorialSecondCardPlayed) ||
    (step.expectedAction === "play-zap" && !tutorialZapPlayed) ||
    (step.expectedAction === "request-truco" && !tutorialTrucoRequested) ||
    (step.expectedAction === "accept-truco" && tutorialTrucoResponse !== "accept") ||
    (step.expectedAction === "run-truco" && tutorialTrucoResponse !== "run") ||
    (step.expectedAction === "raise-truco" && tutorialTrucoResponse !== "raise") ||
    (step.expectedAction === "follow-partner-advice" && !tutorialPartnerAdviceAccepted) ||
    (step.expectedAction === "toggle-covered-card" && !tutorialCoveredMode) ||
    (step.expectedAction === "play-covered-card" && !tutorialCoveredCardPlayed) ||
    (step.expectedAction === "play-paulista-manilha" && !tutorialPaulistaCardPlayed) ||
    (step.expectedAction === "choose-nine-play" && tutorialNineHandDecision !== "play")
  const isLessonTwoStep =
    step.id === "common-order-intro" ||
    step.id === "choose-winning-card" ||
    step.id === "common-order-result"
  const isLessonThreeStep =
    step.id === "manilha-intro" ||
    step.id === "play-zap" ||
    step.id === "manilha-result"
  const isLessonFourStep = step.id === "hand-finished" || step.id === "match-score"
  const isLessonFiveStep =
    step.id === "truco-intro" ||
    step.id === "request-truco" ||
    step.id === "truco-accepted"
  const isLessonSixAcceptStep =
    step.id === "response-intro" || step.id === "respond-accept" || step.id === "accept-result"
  const isLessonSixRunStep =
    step.id === "run-intro" || step.id === "respond-run" || step.id === "run-result"
  const isLessonSixRaiseStep =
    step.id === "raise-intro" || step.id === "respond-raise" || step.id === "raise-result"
  const isLessonSixStep = isLessonSixAcceptStep || isLessonSixRunStep || isLessonSixRaiseStep
  const isLessonSevenStep =
    step.id === "partner-intro" ||
    step.id === "partner-advice" ||
    step.id === "partner-advice-result" ||
    step.id === "partner-consult" ||
    step.id === "partner-summary"
  const isLessonEightStep =
    step.id === "covered-locked" ||
    step.id === "covered-intro" ||
    step.id === "play-covered-card" ||
    step.id === "covered-result"
  const isLessonNineStep =
    step.id === "paulista-intro" ||
    step.id === "paulista-vira" ||
    step.id === "play-paulista-manilha" ||
    step.id === "paulista-result"
  const isLessonTenStep =
    step.id === "nine-hand-intro" ||
    step.id === "nine-hand-partner" ||
    step.id === "nine-hand-play" ||
    step.id === "nine-hand-result"
  const isSummaryStep = step.id === "tutorial-finished"
  const tutorialPlayerHand: Card[] = isSummaryStep
    ? []
    : isLessonTenStep
    ? [
        { rank: "3", suit: "copas" },
        { rank: "A", suit: "espada" },
        { rank: "7", suit: "ouros" },
      ]
    : isLessonNineStep
    ? tutorialPaulistaCardPlayed
      ? [{ rank: "K", suit: "ouros" }]
      : [
          { rank: "6", suit: "copas" },
          { rank: "K", suit: "ouros" },
        ]
    : isLessonEightStep
    ? tutorialCoveredCardPlayed
      ? [{ rank: "K", suit: "paus" }]
      : [
          { rank: "6", suit: "ouros" },
          { rank: "K", suit: "paus" },
        ]
    : isLessonSevenStep
    ? [
        { rank: "K", suit: "copas" },
        { rank: "2", suit: "paus" },
        { rank: "6", suit: "ouros" },
      ]
    : isLessonSixRunStep
    ? [
        { rank: "4", suit: "ouros" },
        { rank: "5", suit: "espada" },
        { rank: "6", suit: "copas" },
      ]
    : isLessonSixRaiseStep
    ? [
        { rank: "4", suit: "paus" },
        { rank: "7", suit: "copas" },
        { rank: "3", suit: "espada" },
      ]
    : isLessonSixAcceptStep
    ? [
        { rank: "K", suit: "copas" },
        { rank: "A", suit: "paus" },
        { rank: "2", suit: "ouros" },
      ]
    : isLessonFiveStep
    ? [
        { rank: "3", suit: "copas" },
        { rank: "2", suit: "espada" },
        { rank: "A", suit: "ouros" },
      ]
    : isLessonFourStep
    ? []
    : isLessonThreeStep
    ? tutorialZapPlayed
      ? [{ rank: "A", suit: "ouros" }]
      : [
          { rank: "4", suit: "paus" },
          { rank: "A", suit: "ouros" },
        ]
    : tutorialSecondCardPlayed
    ? [{ rank: "5", suit: "ouros" }]
    : tutorialCardPlayed
    ? [
        { rank: "5", suit: "ouros" },
        { rank: "Q", suit: "copas" },
      ]
    : [
        { rank: "2", suit: "paus" },
        { rank: "5", suit: "ouros" },
        { rank: "Q", suit: "copas" },
      ]
  const tutorialTable: TableCard[] =
    isSummaryStep ||
    isLessonFourStep ||
    isLessonFiveStep ||
    isLessonSixStep ||
    isLessonSevenStep ||
    isLessonTenStep
      ? []
      : isLessonNineStep && tutorialPaulistaCardPlayed
      ? [
          { playerId: 2, card: { rank: "3", suit: "copas" } },
          { playerId: 3, card: { rank: "2", suit: "espada" } },
          { playerId: 4, card: { rank: "A", suit: "paus" } },
          { playerId: 1, card: { rank: "6", suit: "copas" } },
        ]
      : isLessonNineStep
      ? [
          { playerId: 2, card: { rank: "3", suit: "copas" } },
          { playerId: 3, card: { rank: "2", suit: "espada" } },
          { playerId: 4, card: { rank: "A", suit: "paus" } },
        ]
      : isLessonEightStep && tutorialCoveredCardPlayed
      ? [
          { playerId: 2, card: { rank: "3", suit: "copas" } },
          { playerId: 3, card: { rank: "5", suit: "paus" } },
          { playerId: 4, card: { rank: "2", suit: "espada" } },
          { playerId: 1, card: { rank: "6", suit: "ouros" }, covered: true },
        ]
      : isLessonEightStep && step.id !== "covered-locked"
      ? [
          { playerId: 2, card: { rank: "3", suit: "copas" } },
          { playerId: 3, card: { rank: "5", suit: "paus" } },
          { playerId: 4, card: { rank: "2", suit: "espada" } },
        ]
      : isLessonThreeStep && tutorialZapPlayed
      ? [
          { playerId: 2, card: { rank: "3", suit: "paus" } },
          { playerId: 3, card: { rank: "K", suit: "ouros" } },
          { playerId: 4, card: { rank: "A", suit: "copas" } },
          { playerId: 1, card: { rank: "4", suit: "paus" } },
        ]
      : isLessonThreeStep
      ? [
          { playerId: 2, card: { rank: "3", suit: "paus" } },
          { playerId: 3, card: { rank: "K", suit: "ouros" } },
          { playerId: 4, card: { rank: "A", suit: "copas" } },
        ]
      : isLessonTwoStep && tutorialSecondCardPlayed
      ? [
          { playerId: 2, card: { rank: "7", suit: "paus" } },
          { playerId: 3, card: { rank: "6", suit: "espada" } },
          { playerId: 4, card: { rank: "5", suit: "paus" } },
          { playerId: 1, card: { rank: "Q", suit: "copas" } },
        ]
      : isLessonTwoStep
      ? [
          { playerId: 2, card: { rank: "7", suit: "paus" } },
          { playerId: 3, card: { rank: "6", suit: "espada" } },
          { playerId: 4, card: { rank: "5", suit: "paus" } },
        ]
      : tutorialCardPlayed
      ? [
          { playerId: 1, card: { rank: "2", suit: "paus" } },
          { playerId: 2, card: { rank: "Q", suit: "espada" } },
          { playerId: 3, card: { rank: "3", suit: "copas" } },
          { playerId: 4, card: { rank: "K", suit: "paus" } },
        ]
      : []
  const tutorialCurrentWinnerId =
    isSummaryStep ||
    isLessonFourStep ||
    isLessonFiveStep ||
    isLessonSixStep ||
    isLessonSevenStep ||
    isLessonTenStep
    ? null
    : isLessonNineStep
    ? tutorialPaulistaCardPlayed
      ? 1
      : 2
    : isLessonEightStep && step.id !== "covered-locked"
    ? 2
    : isLessonThreeStep
    ? tutorialZapPlayed
      ? 1
      : 2
    : isLessonTwoStep
    ? tutorialSecondCardPlayed
      ? 1
      : 2
    : tutorialCardPlayed
    ? 3
    : null
  const tutorialVenue =
    CAMPAIGN_STAGES.flatMap((stage) => stage.venues).find(
      (venue) => venue.id === "bar-maneco-banguela"
    ) ?? null
  const partner = TRUCO_CHARACTER_BY_ID["nega-catimbo"]
  const leftOpponent = TRUCO_CHARACTER_BY_ID["tonhao-rasga-lata"]
  const rightOpponent = TRUCO_CHARACTER_BY_ID["patricia-monique"]
  const tutorialMatchScore =
    isLessonSixRunStep && tutorialTrucoResponse === "run"
      ? { A: 1, B: 1 }
      : isLessonTenStep
      ? { A: 9, B: 7 }
      : isSummaryStep ||
        isLessonFourStep ||
        isLessonFiveStep ||
        isLessonSixStep ||
        isLessonSevenStep ||
        isLessonEightStep ||
        isLessonNineStep
      ? { A: 1, B: 0 }
      : { A: 0, B: 0 }
  const tutorialHandScore =
    isSummaryStep ||
    isLessonFourStep ||
    isLessonFiveStep ||
    isLessonSixStep ||
    isLessonSevenStep ||
    isLessonTenStep
    ? { A: 0, B: 0 }
    : isLessonNineStep
    ? tutorialPaulistaCardPlayed
      ? { A: 1, B: 0 }
      : { A: 0, B: 0 }
    : isLessonEightStep
    ? step.id === "covered-result"
      ? { A: 0, B: 1 }
      : { A: 0, B: 0 }
    : isLessonThreeStep
    ? tutorialZapPlayed
      ? { A: 1, B: 0 }
      : { A: 0, B: 0 }
    : tutorialSecondCardPlayed
    ? { A: 2, B: 0 }
    : tutorialCardPlayed
    ? { A: 1, B: 0 }
    : { A: 0, B: 0 }
  const tutorialPartnerHand: Card[] = isLessonTenStep
    ? [
        { rank: "4", suit: "paus" },
        { rank: "2", suit: "copas" },
        { rank: "6", suit: "espada" },
      ]
    : [{ rank: "3", suit: "copas" }]
  const tutorialHandState: HandState = {
    variant: isLessonNineStep ? "PAULISTA" : "MINEIRO",
    vira: isLessonNineStep ? { rank: "5", suit: "ouros" } : undefined,
    players: [
      {
        id: 1,
        hand: tutorialPlayerHand,
      },
      { id: 2, hand: [{ rank: "K", suit: "espada" }] },
      { id: 3, hand: tutorialPartnerHand },
      { id: 4, hand: [{ rank: "A", suit: "paus" }] },
    ],
    table: tutorialTable,
    currentPlayerId: 1,
    currentBet:
      isLessonSevenStep && tutorialPartnerAdviceAccepted
        ? 3
        : isLessonTenStep
        ? 3
        : isLessonSevenStep
        ? 1
        : isLessonSixRaiseStep && tutorialTrucoResponse === "raise"
        ? 6
        : (isLessonFiveStep && tutorialTrucoRequested) ||
          (isLessonSixAcceptStep && tutorialTrucoResponse === "accept")
        ? 3
        : 1,
    score: tutorialHandScore,
    firstNonTieWinner:
      !isLessonThreeStep &&
      !isLessonFourStep &&
      !isLessonFiveStep &&
      !isLessonSixStep &&
      !isLessonSevenStep &&
      !isLessonEightStep &&
      !isLessonNineStep &&
      !isLessonTenStep &&
      tutorialCardPlayed
        ? "A"
        : null,
    roundNumber: isLessonTwoStep || isLessonEightStep ? 2 : 1,
    finished: false,
    nineHand: isLessonTenStep
      ? { team: "A", phase: tutorialNineHandDecision === "play" ? "playing" : "awaiting-decision" }
      : undefined,
    truco: {
      phase: "idle",
    },
  }
  const tutorialTableByPlayer = tutorialHandState.table.reduce<Record<number, TableCard | undefined>>(
    (map, entry) => {
      map[entry.playerId] = entry
      return map
    },
    {}
  )
  const tutorialTableModel = buildTableSceneModel(
    tutorialHandState,
    tutorialTableByPlayer,
    tutorialCurrentWinnerId,
    tutorialVenue
  )
  const tutorialPlayers = [
    {
      id: 1,
      label: "Você",
      avatarAsset: selectedPlayerSkin.avatarAsset,
    },
    {
      id: 2,
      label: leftOpponent.name,
      avatarAsset: leftOpponent.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    },
    {
      id: 3,
      label: partner.name,
      avatarAsset: partner.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    },
    {
      id: 4,
      label: rightOpponent.name,
      avatarAsset: rightOpponent.avatarAsset ?? selectedPlayerSkin.avatarAsset,
    },
  ]
  const tutorialSpeechBubble: SpeechBubbleState | null =
    step.id === "partner-advice" || step.id === "partner-advice-result"
      ? { playerId: 3, text: "BORA!" }
      : step.id === "partner-consult"
      ? { playerId: 3, text: "E AI, PARCEIRO?" }
      : step.id === "partner-summary"
      ? { playerId: 3, text: "CE QUE SABE!" }
      : null
  const goToPreviousStep = () => {
    setStepIndex((current) => {
      const nextIndex = Math.max(0, current - 1)
      const nextStepId = TUTORIAL_DRAFT_STEPS[nextIndex].id

      if (nextIndex <= getTutorialStepIndex("play-card")) {
        setTutorialCardPlayed(false)
        setTutorialSecondCardPlayed(false)
        setTutorialZapPlayed(false)
        setTutorialTrucoRequested(false)
        setTutorialTrucoResponse(null)
        setTutorialPartnerAdviceAccepted(false)
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextIndex <= getTutorialStepIndex("choose-winning-card")) {
        setTutorialSecondCardPlayed(false)
        setTutorialZapPlayed(false)
        setTutorialTrucoRequested(false)
        setTutorialTrucoResponse(null)
        setTutorialPartnerAdviceAccepted(false)
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextIndex <= getTutorialStepIndex("play-zap")) {
        setTutorialZapPlayed(false)
        setTutorialTrucoRequested(false)
        setTutorialTrucoResponse(null)
        setTutorialPartnerAdviceAccepted(false)
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextIndex <= getTutorialStepIndex("request-truco")) {
        setTutorialTrucoRequested(false)
        setTutorialTrucoResponse(null)
        setTutorialPartnerAdviceAccepted(false)
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (
        nextStepId === "respond-accept" ||
        nextStepId === "respond-run" ||
        nextStepId === "respond-raise"
      ) {
        setTutorialTrucoResponse(null)
        setTutorialPartnerAdviceAccepted(false)
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextStepId === "partner-advice") {
        setTutorialPartnerAdviceAccepted(false)
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextStepId === "covered-intro") {
        setTutorialCoveredMode(false)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextStepId === "play-covered-card") {
        setTutorialCoveredMode(true)
        setTutorialCoveredCardPlayed(false)
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextStepId === "play-paulista-manilha") {
        setTutorialPaulistaCardPlayed(false)
        setTutorialNineHandDecision(null)
      } else if (nextStepId === "nine-hand-play") {
        setTutorialNineHandDecision(null)
      }
      return nextIndex
    })
  }
  const goToNextStep = () => {
    if (mustPlayHighlightedCard) return

    if (isLastStep) {
      onBack()
      return
    }

    setStepIndex((current) => Math.min(TUTORIAL_DRAFT_STEPS.length - 1, current + 1))
  }
  const handleTutorialCardClick = (card: Card) => {
    if (step.expectedAction === "play-low-card") {
      if (card.rank !== "2" || card.suit !== "paus") return

      setTutorialCardPlayed(true)
      setStepIndex(getTutorialStepIndex("trick-result"))
      return
    }

    if (step.expectedAction === "play-winning-card") {
      if (card.rank !== "Q" || card.suit !== "copas") return

      setTutorialSecondCardPlayed(true)
      setStepIndex(getTutorialStepIndex("common-order-result"))
      return
    }

    if (step.expectedAction === "play-zap") {
      if (card.rank !== "4" || card.suit !== "paus") return

      setTutorialZapPlayed(true)
      setStepIndex(getTutorialStepIndex("manilha-result"))
      return
    }

    if (step.expectedAction === "play-covered-card") {
      if (!tutorialCoveredMode || card.rank !== "6" || card.suit !== "ouros") return

      setTutorialCoveredCardPlayed(true)
      setStepIndex(getTutorialStepIndex("covered-result"))
      return
    }

    if (step.expectedAction === "play-paulista-manilha") {
      if (card.rank !== "6" || card.suit !== "copas") return

      setTutorialPaulistaCardPlayed(true)
      setStepIndex(getTutorialStepIndex("paulista-result"))
    }
  }
  const handleTutorialCoveredToggle = () => {
    if (step.expectedAction !== "toggle-covered-card") return

    setTutorialCoveredMode(true)
    setStepIndex(getTutorialStepIndex("play-covered-card"))
  }
  const handleTutorialTrucoClick = () => {
    if (step.expectedAction !== "request-truco") return

    setTutorialTrucoRequested(true)
    setStepIndex(getTutorialStepIndex("truco-accepted"))
  }
  const handleTutorialResponseClick = (response: "accept" | "run" | "raise") => {
    if (step.expectedAction === "follow-partner-advice" && response === "accept") {
      setTutorialPartnerAdviceAccepted(true)
      setStepIndex(getTutorialStepIndex("partner-advice-result"))
      return
    }

    if (step.expectedAction === "accept-truco" && response === "accept") {
      setTutorialTrucoResponse("accept")
      setStepIndex(getTutorialStepIndex("accept-result"))
      return
    }

    if (step.expectedAction === "run-truco" && response === "run") {
      setTutorialTrucoResponse("run")
      setStepIndex(getTutorialStepIndex("run-result"))
      return
    }

    if (step.expectedAction === "raise-truco" && response === "raise") {
      setTutorialTrucoResponse("raise")
      setStepIndex(getTutorialStepIndex("raise-result"))
    }
  }
  const handleTutorialNineHandDecision = (decision: "play") => {
    if (step.expectedAction !== "choose-nine-play") return

    setTutorialNineHandDecision(decision)
    setStepIndex(getTutorialStepIndex("nine-hand-result"))
  }
  const isAcceptAction =
    step.expectedAction === "accept-truco" || step.expectedAction === "follow-partner-advice"
  const isRunAction = step.expectedAction === "run-truco"
  const isRaiseAction = step.expectedAction === "raise-truco"
  const isNineHandAction = step.expectedAction === "choose-nine-play"
  const canTutorialToggleCovered =
    step.expectedAction === "toggle-covered-card" ||
    step.expectedAction === "play-covered-card" ||
    (isLessonEightStep && tutorialCoveredMode)
  const showTutorialCoveredHint = step.expectedAction === "toggle-covered-card"
  const tutorialCoveredModeActive = isLessonEightStep && tutorialCoveredMode
  const isTrucoValueVisible =
    isLessonFiveStep ||
    isLessonSixStep ||
    isLessonSevenStep ||
    isLessonEightStep ||
    isLessonNineStep ||
    isLessonTenStep
  const tutorialValueLabel =
    isLessonSixRunStep && tutorialTrucoResponse === "run"
      ? "Resultado"
      : isLessonEightStep
      ? "Vaza 2"
      : isLessonNineStep
      ? "Vira"
      : isLessonTenStep
      ? "Mão de 9"
      : isLessonSevenStep && !tutorialPartnerAdviceAccepted
      ? "Parceira"
      : "Valendo"
  const tutorialValueText =
    isLessonSixRunStep && tutorialTrucoResponse === "run"
      ? "Eles +1"
      : isLessonEightStep
      ? tutorialCoveredCardPlayed
        ? "Coberta"
        : "Cobrir"
      : isLessonNineStep
      ? "5 de ouros"
      : isLessonTenStep
      ? tutorialNineHandDecision === "play"
        ? "Jogando"
        : "Decidir"
      : isLessonSevenStep && !tutorialPartnerAdviceAccepted
      ? "BORA!"
      : isLessonSixRaiseStep && tutorialTrucoResponse === "raise"
      ? "6 pontos"
      : ((isLessonFiveStep && tutorialTrucoRequested) ||
          (isLessonSixAcceptStep && tutorialTrucoResponse === "accept") ||
          (isLessonSevenStep && tutorialPartnerAdviceAccepted))
      ? "3 pontos"
      : "1 ponto"
  const tutorialNextButtonText = mustPlayHighlightedCard
    ? step.expectedAction === "play-low-card" ||
      step.expectedAction === "play-winning-card" ||
      step.expectedAction === "play-zap" ||
      step.expectedAction === "play-covered-card" ||
      step.expectedAction === "play-paulista-manilha"
      ? "Toque na carta"
      : "Toque no botão"
    : isLastStep
    ? "Fechar"
    : "Proximo"

  return (
    <div
      style={{
        ...styles.tutorialDraftScreen,
        backgroundImage:
          `linear-gradient(90deg, rgba(10,6,4,0.62) 0%, rgba(10,6,4,0.2) 44%, rgba(10,6,4,0.66) 100%), url(${manecoBanguelaBackgroundAsset})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>
        {`
          @keyframes tutorialBubbleIn {
            from {
              opacity: 0;
              transform: translate3d(-18px, 14px, 0) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
            }
          }
        `}
      </style>
      <div style={styles.tutorialGameplayOverlay} />

      <div style={styles.tutorialGameLeftRail}>
        <div style={styles.scenePanel}>
          <div style={styles.scenePanelTitle}>Mesa</div>
          <div style={styles.rosterGrid}>
            {tutorialPlayers.map((player) => (
              <div
                key={player.id}
                style={{
                  ...styles.rosterCard,
                  ...(player.id === 1 ? styles.rosterCardHuman : {}),
                }}
              >
                <div style={styles.rosterAvatar}>
                  <img
                    src={player.avatarAsset}
                    alt={player.label}
                    style={styles.rosterAvatarImage}
                  />
                </div>
                <div style={styles.rosterName}>{player.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.scorePadCard}>
          <div
            style={{
              ...styles.scorePadCardSurface,
              backgroundImage: `linear-gradient(180deg, rgba(248,242,231,0.14) 0%, rgba(233,221,198,0.18) 100%), url(${scorePadNotebookAsset})`,
            }}
          >
            <div style={styles.scorePadGrid}>
              <div style={styles.scorePadCellTopLeft}>
                <div style={{ ...styles.scorePadLabel, ...styles.scorePadLabelLeft }}>Nós</div>
                <div style={{ ...styles.scorePadValue, ...styles.scorePadValueLeft }}>
                  {tutorialMatchScore.A}
                </div>
              </div>
              <div style={styles.scorePadCellTopRight}>
                <div style={{ ...styles.scorePadLabel, ...styles.scorePadLabelRight }}>Eles</div>
                <div style={{ ...styles.scorePadValue, ...styles.scorePadValueRight }}>
                  {tutorialMatchScore.B}
                </div>
              </div>
              <div style={styles.scorePadCellBottomLeft}>
                <div style={{ ...styles.scorePadMetaLabel, ...styles.scorePadMetaLabelLeft }}>
                  Mão
                </div>
                <div style={{ ...styles.scorePadMetaValue, ...styles.scorePadMetaValueLeft }}>
                  {tutorialHandScore.A}
                </div>
              </div>
              <div style={styles.scorePadCellBottomRight}>
                <div style={{ ...styles.scorePadMetaLabel, ...styles.scorePadMetaLabelRight }}>
                  Mão
                </div>
                <div style={{ ...styles.scorePadMetaValue, ...styles.scorePadMetaValueRight }}>0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tutorialGameMainColumn}>
        <div style={styles.tableSurfaceWrap}>
          <div style={styles.tableSurface}>
            <GameTableScene
              model={tutorialTableModel}
              dealAnimationNonce={1}
              animationsEnabled={false}
              speechBubble={tutorialSpeechBubble}
            />
          </div>
        </div>

        <div style={styles.playerCardsBlock}>
          <div style={styles.mobileHandPanel}>
            <div style={styles.mobileHandHeader}>
              <div>
                <div style={styles.mobileHandTitle}>Sua vez</div>
                <div style={styles.mobileHandMeta}>
                  {isLessonThreeStep
                    ? "Aula 3 · Manilhas fixas"
                    : isLessonFourStep
                    ? "Aula 4 · Mao e partida"
                    : isLessonFiveStep
                    ? "Aula 5 · Pedir truco"
                    : isLessonSixStep
                    ? "Aula 6 · Responder truco"
                    : isLessonSevenStep
                    ? "Aula 7 · Parceira"
                    : isLessonEightStep
                    ? "Aula 8 · Carta coberta"
                    : isLessonNineStep
                    ? "Aula 9 · Truco Paulista"
                    : isLessonTenStep
                    ? "Aula 10 · Mão de 9"
                    : isLessonTwoStep
                    ? "Aula 2 · Ordem comum"
                    : "Aula 1 · Truco Mineiro"}
                </div>
              </div>
            </div>
            <div style={styles.mobileHandRowWrap}>
              <div style={styles.mobileHandRow}>
                {tutorialHandState.players[0].hand.map((card, index) => {
                  const isHighlightedCard =
                    (step.expectedAction === "play-low-card" &&
                      card.rank === "2" &&
                      card.suit === "paus") ||
                    (step.expectedAction === "play-winning-card" &&
                      card.rank === "Q" &&
                      card.suit === "copas") ||
                    (step.expectedAction === "play-zap" &&
                      card.rank === "4" &&
                      card.suit === "paus") ||
                    (step.expectedAction === "play-covered-card" &&
                      card.rank === "6" &&
                      card.suit === "ouros") ||
                    (step.expectedAction === "play-paulista-manilha" &&
                      card.rank === "6" &&
                      card.suit === "copas")
                  const isPlayableNow =
                    (step.expectedAction === "play-low-card" ||
                      step.expectedAction === "play-winning-card" ||
                      step.expectedAction === "play-zap") &&
                    isHighlightedCard
                      ? true
                      : step.expectedAction === "play-covered-card"
                      ? isHighlightedCard && tutorialCoveredModeActive
                      : step.expectedAction === "play-paulista-manilha"
                      ? isHighlightedCard
                      : false

                  return (
                    <button
                      key={`${card.rank}-${card.suit}-${index}`}
                      style={{
                        ...styles.mobileCardButton,
                        ...(isHighlightedCard ? styles.tutorialHighlightedCard : {}),
                        ...(tutorialCoveredModeActive ? styles.mobileCardButtonCoveredPreview : {}),
                        ...(step.expectedAction && !isPlayableNow
                          ? styles.tutorialDimmedCard
                          : {}),
                      }}
                      type="button"
                      disabled={Boolean(step.expectedAction && !isPlayableNow)}
                      onClick={() => handleTutorialCardClick(card)}
                    >
                      {tutorialCoveredModeActive ? (
                        <div style={styles.coveredCardPreviewBadge}>Coberta</div>
                      ) : null}
                      <div style={styles.mobileCardCornerTop}>
                        <div style={{ ...styles.mobileCardRank, color: getSuitColor(card.suit) }}>
                          {card.rank}
                        </div>
                        <div style={{ ...styles.mobileCardSuit, color: getSuitColor(card.suit) }}>
                          {getSuitSymbol(card.suit)}
                        </div>
                      </div>
                      <div style={{ ...styles.mobileCardCenterSuit, color: getSuitColor(card.suit) }}>
                        {getSuitSymbol(card.suit)}
                      </div>
                      <div style={styles.mobileCardCornerBottom}>
                        <div style={{ ...styles.mobileCardRank, color: getSuitColor(card.suit) }}>
                          {card.rank}
                        </div>
                        <div style={{ ...styles.mobileCardSuit, color: getSuitColor(card.suit) }}>
                          {getSuitSymbol(card.suit)}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div style={styles.coveredCardToggleWrap}>
                {showTutorialCoveredHint ? (
                  <div style={styles.coveredCardHint}>
                    <strong style={styles.coveredCardHintTitle}>Carta coberta</strong>
                    <span style={styles.coveredCardHintText}>toque para ativar</span>
                  </div>
                ) : null}
                <button
                  style={{
                    ...styles.coveredCardToggle,
                    ...(showTutorialCoveredHint ? styles.coveredCardToggleHighlighted : {}),
                    ...(tutorialCoveredModeActive ? styles.coveredCardToggleActive : {}),
                    ...(!canTutorialToggleCovered ? styles.coveredCardToggleDisabled : {}),
                  }}
                  type="button"
                  disabled={!canTutorialToggleCovered}
                  onClick={handleTutorialCoveredToggle}
                  aria-pressed={tutorialCoveredModeActive}
                >
                  <span style={styles.coveredCardToggleSwitch}>
                    <span
                      style={{
                        ...styles.coveredCardToggleKnob,
                        ...(tutorialCoveredModeActive ? styles.coveredCardToggleKnobActive : {}),
                      }}
                    />
                  </span>
                  Coberta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tutorialGameSidebarColumn}>
        <div style={styles.tableHudSidebar}>
          <div
            style={{
              ...styles.tableHudStats,
              backgroundImage: `linear-gradient(180deg, rgba(28,18,12,0.18) 0%, rgba(14,9,6,0.24) 100%), url(${statsPanelWoodAsset})`,
              backgroundColor: "rgba(57,36,24,0.92)",
              backgroundSize: "cover, 112% 128%",
              backgroundPosition: "center, center",
              backgroundRepeat: "no-repeat, no-repeat",
              boxShadow:
                "0 10px 20px rgba(0,0,0,0.18), inset -6px 0 0 rgba(81,55,36,0.92)",
            }}
          >
            <div style={styles.tableHudStatLineCentered}>
              <span style={styles.tableHudStatLabelCentered}>Etapa</span>
              <strong style={styles.tableHudStatValueCentered}>Tutorial</strong>
            </div>
            <div style={styles.tableHudStatsDivider} />
            <div style={styles.tableHudStatLineCentered}>
              <span style={styles.tableHudStatLabelCentered}>
                {isTrucoValueVisible ? tutorialValueLabel : "Endereço"}
              </span>
              <strong style={styles.tableHudStatValueCentered}>
                {isTrucoValueVisible ? tutorialValueText : "Rua 18"}
              </strong>
            </div>
          </div>

          <div
            style={{
              ...styles.inGameActionsCard,
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            {isLessonTenStep ? (
              <div style={styles.nineHandDecisionPanel}>
                {step.id === "nine-hand-partner" ? (
                  <div style={styles.nineHandDecisionTooltip}>
                    <strong style={styles.nineHandDecisionTooltipTitle}>Mão de 9</strong>
                    <span style={styles.nineHandDecisionTooltipText}>
                      veja as cartas da parceira aqui
                    </span>
                  </div>
                ) : null}
                <div style={styles.nineHandDecisionTitle}>Mão de 9</div>
                <div style={styles.nineHandDecisionText}>Cartas da parceira</div>
                <div style={styles.nineHandPartnerCards}>
                  {tutorialPartnerHand.map((card, index) => (
                    <div
                      key={`${card.rank}-${card.suit}-${index}`}
                      style={styles.nineHandPartnerCard}
                    >
                      <span style={{ ...styles.nineHandPartnerRank, color: getSuitColor(card.suit) }}>
                        {card.rank}
                      </span>
                      <span style={{ ...styles.nineHandPartnerSuit, color: getSuitColor(card.suit) }}>
                        {getSuitSymbol(card.suit)}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={styles.inGameActionsGrid}>
                  <button
                    type="button"
                    style={{
                      ...styles.trucoSecondaryButton,
                      backgroundImage: `url(${actionButtonAsset})`,
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      border: "none",
                      color: "#f7efe0",
                      boxShadow: "none",
                      ...(isNineHandAction ? styles.tutorialHighlightedAction : {}),
                    }}
                    disabled={!isNineHandAction}
                    onClick={() => handleTutorialNineHandDecision("play")}
                  >
                    Jogar
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.trucoSecondaryButton,
                      ...styles.coveredCardToggleDisabled,
                      backgroundImage: `url(${actionButtonAsset})`,
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      border: "none",
                      color: "#f7efe0",
                      boxShadow: "none",
                    }}
                    disabled
                  >
                    Correr
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  style={{
                    ...styles.trucoPrimaryButton,
                    ...(step.expectedAction === "request-truco" ? styles.tutorialHighlightedAction : {}),
                    backgroundImage: `url(${actionButtonAsset})`,
                    backgroundColor: "transparent",
                    backgroundSize: "100% 100%",
                  }}
                  onClick={handleTutorialTrucoClick}
                >
                  Pedir truco
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.trucoSecondaryButton,
                    ...(isAcceptAction ? styles.tutorialHighlightedAction : styles.coveredCardToggleDisabled),
                    backgroundImage: `url(${actionButtonAsset})`,
                    backgroundColor: "transparent",
                    backgroundSize: "100% 100%",
                  }}
                  disabled={!isAcceptAction}
                  onClick={() => handleTutorialResponseClick("accept")}
                >
                  Aceitar
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.trucoSecondaryButton,
                    ...(isRaiseAction ? styles.tutorialHighlightedAction : styles.coveredCardToggleDisabled),
                    backgroundImage: `url(${actionButtonAsset})`,
                    backgroundColor: "transparent",
                    backgroundSize: "100% 100%",
                  }}
                  disabled={!isRaiseAction}
                  onClick={() => handleTutorialResponseClick("raise")}
                >
                  Aumentar
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.trucoSecondaryButton,
                    ...(isRunAction ? styles.tutorialHighlightedAction : styles.coveredCardToggleDisabled),
                    backgroundImage: `url(${actionButtonAsset})`,
                    backgroundColor: "transparent",
                    backgroundSize: "100% 100%",
                  }}
                  disabled={!isRunAction}
                  onClick={() => handleTutorialResponseClick("run")}
                >
                  Correr
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={styles.tutorialDraftHeader}>
        <button style={styles.tutorialDraftBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div
        style={{
          ...styles.tutorialDraftBubble,
          ...getTutorialBubblePosition(step.anchor),
        }}
      >
        <div style={styles.tutorialDraftBubbleKicker}>{step.target}</div>
        <h3 style={styles.tutorialDraftBubbleTitle}>{step.title}</h3>
        <p style={styles.tutorialDraftBubbleText}>{step.text}</p>
        <div style={styles.tutorialDraftProgress}>
          {TUTORIAL_DRAFT_STEPS.map((item, index) => (
            <span
              key={item.title}
              style={{
                ...styles.tutorialDraftProgressDot,
                ...(index === stepIndex ? styles.tutorialDraftProgressDotActive : {}),
              }}
            />
          ))}
        </div>
        <div style={styles.tutorialDraftControls}>
          <button
            style={{
              ...styles.tutorialDraftControlButton,
              ...(isFirstStep ? styles.tutorialDraftControlButtonDisabled : {}),
            }}
            disabled={isFirstStep}
            onClick={goToPreviousStep}
          >
            Anterior
          </button>
          <button
            style={{
              ...styles.tutorialDraftPrimaryButton,
              ...(mustPlayHighlightedCard ? styles.tutorialDraftControlButtonDisabled : {}),
            }}
            disabled={mustPlayHighlightedCard}
            onClick={goToNextStep}
          >
            {tutorialNextButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

function getTutorialBubblePosition(anchor: string): React.CSSProperties {
  switch (anchor) {
    case "top-right":
      return { right: "8%", top: "14%" }
    case "right":
      return { right: "6%", top: "34%" }
    case "left":
      return { left: "7%", top: "26%" }
    case "score-right":
      return { left: "27%", top: "29%" }
    case "bottom-right":
      return { right: "8%", bottom: "14%" }
    case "top-left":
      return { left: "8%", top: "14%" }
    default:
      return { left: "8%", bottom: "14%" }
  }
}

const FREE_PLAY_STAGE_HOTSPOTS: React.CSSProperties[] = [
  { left: "3.4%", top: "21.8%", width: "18.2%", height: "32.8%" },
  { left: "22.3%", top: "21.8%", width: "18.2%", height: "32.8%" },
  { left: "41.2%", top: "21.8%", width: "18.2%", height: "32.8%" },
  { left: "60.1%", top: "21.8%", width: "18.2%", height: "32.8%" },
  { left: "79.0%", top: "21.8%", width: "18.2%", height: "32.8%" },
  { left: "3.4%", top: "55.8%", width: "18.2%", height: "32.0%" },
  { left: "22.3%", top: "55.8%", width: "18.2%", height: "32.0%" },
  { left: "41.2%", top: "55.8%", width: "18.2%", height: "32.0%" },
  { left: "60.1%", top: "55.8%", width: "18.2%", height: "32.0%" },
  { left: "79.0%", top: "55.8%", width: "18.2%", height: "32.0%" },
]

function PostCampaignFreePlayScreen({
  onBack,
  onOpenStage,
  onResetCampaign,
  styles,
}: {
  onBack: () => void
  onOpenStage: (stageId: string) => void
  onResetCampaign: () => void
  styles: StyleMap
}) {
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false)

  function handleResetCampaignFromHub() {
    setResetConfirmationOpen(true)
  }

  function handleCancelResetCampaign() {
    setResetConfirmationOpen(false)
  }

  function handleConfirmResetCampaign() {
    setResetConfirmationOpen(false)
    onResetCampaign()
  }

  return (
    <div style={styles.freePlayScreen}>
      <img
        src={freePlayCircuitHubAsset}
        alt=""
        aria-hidden="true"
        style={styles.freePlayImage}
      />

      <button style={styles.freePlayBackButton} onClick={onBack}>
        Voltar
      </button>
      <button style={styles.freePlayResetButton} onClick={handleResetCampaignFromHub}>
        Recomeçar campanha
      </button>

      {CAMPAIGN_STAGES.map((stage, index) => {
        const hotspot = FREE_PLAY_STAGE_HOTSPOTS[index]

        return (
          <button
            key={stage.id}
            aria-label={`Abrir circuito ${stage.name}`}
            title={stage.name}
            style={{
              ...styles.freePlayStageHotspot,
              ...hotspot,
            }}
            onClick={() => onOpenStage(stage.id)}
          />
        )
      })}

      {resetConfirmationOpen ? (
        <div style={styles.inGameConfirmationOverlay}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="free-play-reset-title"
            style={styles.inGameConfirmationCard}
          >
            <div style={styles.inGameConfirmationEyebrow}>Confirmação</div>
            <h3 id="free-play-reset-title" style={styles.inGameConfirmationTitle}>
              Recomeçar a campanha?
            </h3>
            <p style={styles.inGameConfirmationText}>
              Isso apaga progresso, escolhas de parceira, skin do jogador e histórico salvo.
            </p>
            <div style={styles.inGameConfirmationWarning}>
              Esta ação volta a jornada para o primeiro boteco e não pode ser desfeita.
            </div>
            <div style={styles.inGameConfirmationActions}>
              <button
                style={styles.inGameConfirmationCancelButton}
                onClick={handleCancelResetCampaign}
              >
                Cancelar
              </button>
              <button
                style={styles.inGameConfirmationConfirmButton}
                onClick={handleConfirmResetCampaign}
              >
                Recomeçar campanha
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function JourneyIntroScreen({
  currentCampaignVenue,
  freePlayRun,
  playerProfile,
  onBack,
  onCloseFreePlayStage,
  onContinueToCharacterSelect,
  onLaunchVenue,
  onOpenFreePlayStage,
  onResetCampaign,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  freePlayRun: FreePlayRunState | null
  playerProfile: PlayerProfile
  onBack: () => void
  onCloseFreePlayStage: () => void
  onContinueToCharacterSelect: () => void
  onLaunchVenue: (venueId: string) => void
  onOpenFreePlayStage: (stageId: string) => void
  onResetCampaign: () => void
  styles: StyleMap
}) {
  const campaignVenues = CAMPAIGN_STAGES.flatMap((stage) => stage.venues)
  const campaignVenueCount = campaignVenues.length
  const clearedCampaignVenueCount = campaignVenues.filter((venue) =>
    isCampaignVenueCleared(playerProfile, venue)
  ).length
  const campaignComplete = clearedCampaignVenueCount === campaignVenueCount
  const freePlayStageId = freePlayRun?.stageId ?? null
  const freePlayStage =
    campaignComplete && freePlayStageId
      ? CAMPAIGN_STAGES.find((stage) => stage.id === freePlayStageId) ?? null
      : null
  const freePlayCurrentVenue =
    freePlayStage && freePlayRun
      ? freePlayStage.venues.find((venue) => venue.id === freePlayRun.currentVenueId) ?? null
      : null
  const viewedCampaignVenue = freePlayCurrentVenue ?? currentCampaignVenue
  const viewedStages = freePlayStage ? [freePlayStage] : CAMPAIGN_STAGES
  const viewedPlayerProfile = freePlayStage
    ? createFreePlayStagePreviewProfile(playerProfile, freePlayRun)
    : playerProfile
  const hasCurrentVenue = !!viewedCampaignVenue
  const activeStageIndex = viewedCampaignVenue
    ? viewedStages.findIndex((stage) => stage.venues.some((venue) => venue.id === viewedCampaignVenue.id))
    : -1
  const activeStageId = viewedCampaignVenue
    ? viewedStages.find((stage) => stage.venues.some((venue) => venue.id === viewedCampaignVenue.id))?.id
    : null
  const activeVenueIndex =
    viewedCampaignVenue && activeStageIndex >= 0
      ? viewedStages[activeStageIndex]?.venues.findIndex((venue) => venue.id === viewedCampaignVenue.id) ?? -1
      : -1
  const journeyVenues = viewedStages.flatMap((stage) => stage.venues)
  const totalVenueCount = journeyVenues.length
  const clearedVenueCount = journeyVenues.filter((venue) =>
    isCampaignVenueCleared(viewedPlayerProfile, venue)
  ).length
  const currentVenueRouteIndex = viewedCampaignVenue
    ? journeyVenues.findIndex((venue) => venue.id === viewedCampaignVenue.id)
    : -1
  const nextVenue = currentVenueRouteIndex >= 0 ? journeyVenues[currentVenueRouteIndex + 1] ?? null : null
  const currentStageVenueCount = viewedCampaignVenue && activeStageIndex >= 0
    ? viewedStages[activeStageIndex]?.venues.length ?? 0
    : 0
  const authoredCampaign = viewedCampaignVenue
    ? authoredCampaignScreens[viewedCampaignVenue.id]
    : null

  if (authoredCampaign && viewedCampaignVenue) {
    return (
      <div style={styles.authoredCampaignScreen}>
        <img
          src={authoredCampaign.asset}
          alt={authoredCampaign.alt}
          style={styles.authoredCampaignImage}
        />
        <button
          aria-label="Voltar"
          title="Voltar"
          style={{
            ...styles.authoredCampaignHotspot,
            ...authoredCampaign.backHotspot,
          }}
          onClick={freePlayStage ? onCloseFreePlayStage : onBack}
        />
        <button
          aria-label={`Abrir capa do ${viewedCampaignVenue.name}`}
          title={`Abrir capa do ${viewedCampaignVenue.name}`}
          style={{
            ...styles.authoredCampaignHotspot,
            ...authoredCampaign.enterHotspot,
          }}
          onClick={() => onLaunchVenue(viewedCampaignVenue.id)}
        />
        <button
          aria-label="Trocar parceira"
          title="Trocar parceira"
          style={{
            ...styles.authoredCampaignHotspot,
            ...authoredCampaign.partnerHotspot,
          }}
          onClick={freePlayStage ? () => onLaunchVenue(viewedCampaignVenue.id) : onContinueToCharacterSelect}
        />
      </div>
    )
  }

  if (campaignComplete && !freePlayStage) {
    return (
      <PostCampaignFreePlayScreen
        onBack={onBack}
        onOpenStage={onOpenFreePlayStage}
        onResetCampaign={onResetCampaign}
        styles={styles}
      />
    )
  }

  return (
    <div style={styles.journeyIntroScreen}>
      <div style={styles.journeyIntroHeader}>
        <div>
          <div style={styles.journeyIntroEyebrow}>
            {freePlayStage ? "Modo livre" : "Jornada de campanha"}
          </div>
          <h2 style={styles.journeyIntroTitle}>
            {freePlayStage ? freePlayStage.name : "Você tem um caminho pela frente"}
          </h2>
          <p style={styles.journeyIntroText}>
            {freePlayStage
              ? "Vença este circuito no Modo Livre. Cada bar concluído leva ao próximo sem alterar a campanha salva."
              : "Leia o percurso completo, veja o que já ficou para trás e avance pelo bar destacado agora. Locais vencidos continuam abertos para revisita."}
          </p>
        </div>
        <button
          style={styles.characterSelectBackButton}
          onClick={freePlayStage ? onCloseFreePlayStage : onBack}
        >
          Voltar
        </button>
      </div>

      <div style={styles.journeyIntroLeadCard}>
        <div style={styles.journeyIntroLeadGrid}>
          <div style={styles.journeyIntroLeadPrimary}>
            <div style={styles.journeyIntroLeadLabel}>
              {viewedCampaignVenue ? "Você está aqui" : "Jornada concluída"}
            </div>
            <div style={styles.journeyIntroLeadVenue}>
              {viewedCampaignVenue?.name ?? "Campanha concluída"}
            </div>
            <div style={styles.journeyIntroLeadMeta}>
              {viewedCampaignVenue?.districtLabel ?? "Todas as etapas principais já foram vencidas."}
            </div>
            <p style={styles.journeyIntroLeadText}>
              {viewedCampaignVenue?.entryNarrative ??
                "Você já cruzou toda a jornada principal disponível até aqui."}
            </p>
          </div>
          <div style={styles.journeyIntroProgressPanel}>
            <div style={styles.journeyIntroProgressValue}>
              {clearedVenueCount}/{totalVenueCount}
            </div>
            <div style={styles.journeyIntroProgressLabel}>Bares concluídos</div>
            <div style={styles.journeyIntroProgressText}>
              {viewedCampaignVenue
                ? `Local ${activeVenueIndex + 1} de ${currentStageVenueCount} em ${currentCampaignStageLabel(viewedCampaignVenue)}.`
                : "Todos os locais da campanha atual já foram vencidos."}
            </div>
            {viewedCampaignVenue ? (
              <button
                style={styles.journeyIntroLeadCta}
                onClick={() => onLaunchVenue(viewedCampaignVenue.id)}
              >
                ABRIR CAPA DO BAR
              </button>
            ) : null}
          </div>
        </div>
        <div style={styles.journeyIntroRouteRow}>
          <div style={styles.journeyIntroRouteItem}>
            <span style={styles.journeyIntroRouteLabel}>Agora</span>
            <strong style={styles.journeyIntroRouteValue}>
              {viewedCampaignVenue?.name ?? "Fluxo completo"}
            </strong>
          </div>
          <div style={styles.journeyIntroRouteDivider} />
          <div style={styles.journeyIntroRouteItem}>
            <span style={styles.journeyIntroRouteLabel}>Depois</span>
            <strong style={styles.journeyIntroRouteValue}>
              {nextVenue?.name ?? "Fim do percurso atual"}
            </strong>
          </div>
          <div style={styles.journeyIntroLegend}>
            <span style={styles.journeyIntroLegendDone}>Concluído</span>
            <span style={styles.journeyIntroLegendCurrent}>Atual</span>
            <span style={styles.journeyIntroLegendLocked}>Bloqueado</span>
          </div>
        </div>
      </div>

      <div style={styles.journeyIntroStages}>
        {viewedStages.map((stage) => {
          const stageOrder = CAMPAIGN_STAGES.findIndex((campaignStage) => campaignStage.id === stage.id)
          const totalMatches = stage.venues.reduce((sum, venue) => sum + venue.matchesToClear, 0)
          const isCompleted = stage.venues.every((venue) =>
            isCampaignVenueCleared(viewedPlayerProfile, venue)
          )
          const isActive = hasCurrentVenue && stage.id === activeStageId
          const isLocked = !isActive && !isCompleted
          const stageStatusLabel = isActive
            ? "Etapa atual"
            : isCompleted
              ? "Concluída"
              : "Bloqueada"

          return (
            <div
              key={stage.id}
              style={{
                ...styles.journeyIntroStageCard,
                ...(isActive ? styles.journeyIntroStageCardActive : {}),
                ...(isCompleted ? styles.journeyIntroStageCardCompleted : {}),
                ...(isLocked ? styles.journeyIntroStageCardLocked : {}),
              }}
            >
              <div style={styles.journeyIntroStageOrder}>
                {String(stageOrder >= 0 ? stageOrder + 1 : 1).padStart(2, "0")}
              </div>
              <div style={styles.journeyIntroStageBody}>
                <div style={styles.journeyIntroStageTopRow}>
                  <div>
                    <div style={styles.journeyIntroStageTitle}>{stage.name}</div>
                    <div style={styles.journeyIntroStageTier}>
                      {stage.tier === "bonus" ? "Bônus" : getCampaignTierLabel(stage.tier)}
                    </div>
                  </div>
                  <div style={styles.journeyIntroStageBadgeStack}>
                    <div style={styles.journeyIntroStageBadge}>
                      {stage.tier === "bonus" ? "Bônus" : stage.mapLabel}
                    </div>
                    <div
                      style={{
                        ...styles.journeyIntroStageStatusBadge,
                        ...(isActive ? styles.journeyIntroStageStatusBadgeActive : {}),
                        ...(isCompleted ? styles.journeyIntroStageStatusBadgeCompleted : {}),
                        ...(isLocked ? styles.journeyIntroStageStatusBadgeLocked : {}),
                      }}
                    >
                      {stageStatusLabel}
                    </div>
                  </div>
                </div>
                <div style={styles.journeyIntroStageText}>{stage.shortDescription}</div>
                <div style={styles.journeyIntroStageMeta}>
                  <span>{stage.venues.length} locais</span>
                  <span>{totalMatches} partidas base</span>
                </div>
                <div style={styles.journeyIntroVenueList}>
                  {stage.venues.map((venue) => {
                    const isCurrentVenue = venue.id === viewedCampaignVenue?.id
                    const isClearedVenue = isCampaignVenueCleared(viewedPlayerProfile, venue)
                    const isAvailable = isCurrentVenue || isClearedVenue
                    const venueStatusLabel = isCurrentVenue
                      ? "Atual"
                      : isClearedVenue
                        ? "Concluído"
                        : "Bloqueado"
                    const venueActionLabel = isCurrentVenue
                      ? "Abrir capa"
                      : isClearedVenue
                        ? "Revisitar"
                        : "Adiante"
                    return (
                      <button
                        key={venue.id}
                        disabled={!isAvailable}
                        style={{
                          ...styles.journeyIntroVenueButton,
                          ...(isCurrentVenue ? styles.journeyIntroVenueButtonActive : {}),
                          ...(!isAvailable ? styles.journeyIntroVenueButtonLocked : {}),
                        }}
                        onClick={() => onLaunchVenue(venue.id)}
                      >
                        <span style={styles.journeyIntroVenueButtonLabel}>{venue.name}</span>
                        <span style={styles.journeyIntroVenueButtonMetaRow}>
                          <span
                            style={{
                              ...styles.journeyIntroVenueButtonMeta,
                              ...(isCurrentVenue ? styles.journeyIntroVenueButtonMetaActive : {}),
                              ...(isClearedVenue && !isCurrentVenue
                                ? styles.journeyIntroVenueButtonMetaCompleted
                                : {}),
                            }}
                          >
                            {venueStatusLabel}
                          </span>
                          <span style={styles.journeyIntroVenueButtonAction}>{venueActionLabel}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!freePlayStage ? (
        <div style={styles.journeyIntroActions}>
          <button style={styles.gameStartResetButton} onClick={onContinueToCharacterSelect}>
            TROCAR PARCEIRA
          </button>
        </div>
      ) : null}
    </div>
  )
}

const authoredCampaignScreens: Record<
  string,
  {
    asset: string
    alt: string
    backHotspot: React.CSSProperties
    enterHotspot: React.CSSProperties
    partnerHotspot: React.CSSProperties
  }
> = {
  "bar-do-ze-catinga": {
    asset: zeCatingaCampaignJourneyAsset,
    alt: "Jornada de campanha dos Botecos da Rua com Bar do Ze Catinga atual",
    backHotspot: {
      left: "86.2%",
      top: "6.1%",
      width: "9.5%",
      height: "7.9%",
      borderRadius: "999px",
    },
    enterHotspot: {
      left: "14.5%",
      top: "72.2%",
      width: "25.3%",
      height: "11.6%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "39.6%",
      top: "84.1%",
      width: "23.8%",
      height: "8.2%",
      borderRadius: "8px",
    },
  },
  "bar-maneco-banguela": {
    asset: manecoBanguelaCampaignJourneyAsset,
    alt: "Jornada de campanha dos Botecos da Rua com Bar Maneco Banguela atual",
    backHotspot: {
      left: "82.4%",
      top: "2.9%",
      width: "12.1%",
      height: "8.7%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "38.7%",
      top: "70.2%",
      width: "25.1%",
      height: "10.8%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "35.2%",
      top: "85.4%",
      width: "29.4%",
      height: "8.6%",
      borderRadius: "8px",
    },
  },
  "trem-do-jaca": {
    asset: tremDoJacaCampaignJourneyAsset,
    alt: "Jornada de campanha do Campeonato da Vila Nana com Trem do Jaca atual",
    backHotspot: {
      left: "84.4%",
      top: "3.4%",
      width: "11.1%",
      height: "6.9%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "38.1%",
      top: "69.1%",
      width: "25.2%",
      height: "10.3%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "39.6%",
      top: "84.4%",
      width: "23.5%",
      height: "8.2%",
      borderRadius: "8px",
    },
  },
  "adega-do-juca-bigode": {
    asset: adegaJucaBigodeCampaignJourneyAsset,
    alt: "Jornada de campanha do Campeonato da Vila Nana com Adega do Juca Bigode atual",
    backHotspot: {
      left: "83.3%",
      top: "3.3%",
      width: "11.5%",
      height: "7.3%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "37.2%",
      top: "69.4%",
      width: "26.6%",
      height: "10.9%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "39.6%",
      top: "84.4%",
      width: "23.6%",
      height: "8.3%",
      borderRadius: "8px",
    },
  },
  "zona-norte-garagem": {
    asset: zonaNorteGaragemCampaignJourneyAsset,
    alt: "Jornada de campanha da Conquista das Zonas com Garagem Norte atual",
    backHotspot: {
      left: "81.6%",
      top: "2.8%",
      width: "13.3%",
      height: "12%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "30.1%",
      top: "79.5%",
      width: "39.8%",
      height: "11.8%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "38.4%",
      top: "92.5%",
      width: "23.3%",
      height: "5.8%",
      borderRadius: "8px",
    },
  },
  "zona-leste-quintal": {
    asset: zonaLesteQuintalCampaignJourneyAsset,
    alt: "Jornada de campanha da Conquista das Zonas com Quintal da Leste atual",
    backHotspot: {
      left: "0%",
      top: "78.8%",
      width: "17.1%",
      height: "16.1%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "29.6%",
      top: "79.9%",
      width: "31.6%",
      height: "12.1%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "62.8%",
      top: "80.7%",
      width: "25.3%",
      height: "11.8%",
      borderRadius: "8px",
    },
  },
  "centro-subsolo": {
    asset: centroSubsoloCampaignJourneyAsset,
    alt: "Jornada de campanha da Conquista das Zonas com Subsolo do Centro atual",
    backHotspot: {
      left: "0%",
      top: "82.9%",
      width: "18.2%",
      height: "14.8%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "25.2%",
      top: "80.2%",
      width: "34.7%",
      height: "13.2%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "61%",
      top: "80.6%",
      width: "24.7%",
      height: "12.6%",
      borderRadius: "8px",
    },
  },
  "zona-sul-salao": {
    asset: zonaSulSalaoCampaignJourneyAsset,
    alt: "Jornada de campanha da Conquista das Zonas com Salao da Sul atual",
    backHotspot: {
      left: "15.3%",
      top: "84.1%",
      width: "16.6%",
      height: "11.9%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "33.5%",
      top: "84.1%",
      width: "33.2%",
      height: "12.2%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "68.1%",
      top: "84%",
      width: "21.9%",
      height: "12%",
      borderRadius: "8px",
    },
  },
  "centro-convencoes-prefeitura": {
    asset: centroConvencoesPrefeituraCampaignJourneyAsset,
    alt: "Jornada de campanha do Campeonato Municipal com Centro de Convencoes da Prefeitura atual",
    backHotspot: {
      left: "4.2%",
      top: "87.4%",
      width: "14.8%",
      height: "10.4%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "31.2%",
      top: "74.2%",
      width: "39.6%",
      height: "12.8%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "31.1%",
      top: "89%",
      width: "33.5%",
      height: "9.5%",
      borderRadius: "8px",
    },
  },
  "ginasio-estadual-maneco-file": {
    asset: ginasioEstadualManecoFileCampaignJourneyAsset,
    alt: "Jornada de campanha do Campeonato Estadual com Ginasio Estadual Maneco File atual",
    backHotspot: {
      left: "12.1%",
      top: "89.4%",
      width: "14.3%",
      height: "8.8%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "31.2%",
      top: "85.9%",
      width: "35.9%",
      height: "12.1%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "68.8%",
      top: "88.6%",
      width: "22.9%",
      height: "9.2%",
      borderRadius: "8px",
    },
  },
  "arena-nacional": {
    asset: arenaNacionalCampaignJourneyAsset,
    alt: "Jornada de campanha do Campeonato Nacional com Arena Nacional atual",
    backHotspot: {
      left: "2.7%",
      top: "83.8%",
      width: "20.3%",
      height: "9.2%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "28.7%",
      top: "74.9%",
      width: "43.8%",
      height: "12.1%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "32.4%",
      top: "87.7%",
      width: "36.8%",
      height: "9.8%",
      borderRadius: "8px",
    },
  },
  "centro-americano-truqueiro-medelin": {
    asset: centroAmericanoTruqueiroMedelinCampaignJourneyAsset,
    alt: "Jornada de campanha do Circuito Panamericano com Centro Americano Truqueiro de Medelin atual",
    backHotspot: {
      left: "2%",
      top: "87.6%",
      width: "14.3%",
      height: "9.4%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "30.7%",
      top: "81.5%",
      width: "41.8%",
      height: "14.8%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "72.2%",
      top: "80.9%",
      width: "23.4%",
      height: "15.4%",
      borderRadius: "8px",
    },
  },
  "hotel-truco-segovia-espanha": {
    asset: hotelTrucoSegoviaEspanhaCampaignJourneyAsset,
    alt: "Jornada de campanha dos Jogos Mundiais com Hotel Truco de Segóvia atual",
    backHotspot: {
      left: "1.4%",
      top: "87.6%",
      width: "13.2%",
      height: "8.8%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "31.5%",
      top: "74.8%",
      width: "36%",
      height: "12.6%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "37%",
      top: "89%",
      width: "25.6%",
      height: "8%",
      borderRadius: "8px",
    },
  },
  "casino-me-maior": {
    asset: casinoMeMaiorCampaignJourneyAsset,
    alt: "Jornada de campanha do Mundial com Cassino Mé Maior atual",
    backHotspot: {
      left: "0.4%",
      top: "88.2%",
      width: "18.8%",
      height: "9.1%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "29.4%",
      top: "75.2%",
      width: "41%",
      height: "11.4%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "34%",
      top: "88.7%",
      width: "31.8%",
      height: "8.9%",
      borderRadius: "8px",
    },
  },
  "orbita-da-lua": {
    asset: orbitaDaLuaCampaignJourneyAsset,
    alt: "Jornada bonus final do Circuito Intergalactico com Orbita da Lua atual",
    backHotspot: {
      left: "28.8%",
      top: "88.5%",
      width: "42.5%",
      height: "9.6%",
      borderRadius: "8px",
    },
    enterHotspot: {
      left: "49.4%",
      top: "68.6%",
      width: "25.2%",
      height: "17%",
      borderRadius: "8px",
    },
    partnerHotspot: {
      left: "25.7%",
      top: "68.7%",
      width: "22.5%",
      height: "16.8%",
      borderRadius: "8px",
    },
  },
}

function isCampaignVenueCleared(playerProfile: PlayerProfile, venue: CampaignVenue) {
  return (
    playerProfile.campaign.clearedVenueIds.includes(venue.id) ||
    (playerProfile.campaign.venueWinsById[venue.id] ?? 0) >= venue.matchesToClear
  )
}

function createFreePlayStagePreviewProfile(
  playerProfile: PlayerProfile,
  freePlayRun: FreePlayRunState | null
): PlayerProfile {
  return {
    ...playerProfile,
    campaign: {
      ...playerProfile.campaign,
      completedStageIds: [],
      clearedVenueIds: freePlayRun?.completedVenueIds ?? [],
      venueWinsById: freePlayRun?.venueWinsById ?? {},
    },
  }
}

function currentCampaignStageLabel(currentCampaignVenue: CampaignVenue) {
  return (
    CAMPAIGN_STAGES.find((stage) => stage.venues.some((venue) => venue.id === currentCampaignVenue.id))
      ?.name ?? "sua etapa atual"
  )
}

function CampaignVictoryScreen({
  victory,
  onContinue,
  styles,
}: {
  victory: CampaignVictoryScreenState | null
  onContinue: () => void
  styles: StyleMap
}) {
  const victoryAsset =
    victory?.kind === "stage"
      ? CAMPAIGN_VICTORY_ASSET_BY_STAGE_ID[victory.id] ?? null
      : victory?.id
        ? CAMPAIGN_VICTORY_ASSET_BY_VENUE_ID[victory.id] ?? null
        : null

  if (victoryAsset) {
    return (
      <div style={styles.matchResultImageScreen}>
        <div style={styles.matchResultImageFrame}>
          <img
            src={victoryAsset}
            alt={victory?.title ?? "Conquista definitiva"}
            style={styles.matchResultImage}
          />
          <button
            aria-label="Voltar ao fluxo de bares"
            style={styles.matchResultImageCta}
            onClick={onContinue}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={styles.matchResultScreen}>
      <div style={{ ...styles.matchResultCard, ...styles.matchResultCardWin }}>
        <div style={styles.matchResultEyebrow}>Conquista definitiva</div>
        <h2 style={styles.matchResultTitle}>{victory?.title ?? "Bar conquistado"}</h2>
        <p style={styles.matchResultSubtitle}>
          A campanha avançou. Volte ao fluxo de bares para ver o próximo passo.
        </p>
        <button style={styles.gameStartLaunchButton} onClick={onContinue}>
          VOLTAR AO FLUXO DE BARES
        </button>
      </div>
    </div>
  )
}

function MatchResultScreen({
  currentCampaignVenue,
  result,
  onContinue,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  result: MatchResultScreenState | null
  onContinue: () => void
  styles: StyleMap
}) {
  const didWin = result?.outcome === "win"
  const resultVenueId = result?.venueId ?? currentCampaignVenue?.id
  const resultAsset =
    result?.outcome && resultVenueId
      ? MATCH_RESULT_ASSET_BY_VENUE_ID[resultVenueId]?.[result.outcome] ?? null
      : null

  if (resultAsset) {
    return (
      <div style={styles.matchResultImageScreen}>
        <div style={styles.matchResultImageFrame}>
          <img
            src={resultAsset}
            alt={result?.title ?? "Vitória na mesa"}
            style={styles.matchResultImage}
          />
          <button
            aria-label="Voltar ao fluxo de bares"
            style={styles.matchResultImageCta}
            onClick={onContinue}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={styles.matchResultScreen}>
      <div
        style={{
          ...styles.matchResultCard,
          ...(didWin ? styles.matchResultCardWin : styles.matchResultCardLoss),
        }}
      >
        <div style={styles.matchResultEyebrow}>
          {didWin ? "Vitória na mesa" : "Derrota na mesa"}
        </div>
        <h2 style={styles.matchResultTitle}>{result?.title ?? "Fim da partida"}</h2>
        <div style={styles.matchResultVenue}>
          {result?.venueName ?? currentCampaignVenue?.name ?? "Fluxo de bares"}
        </div>
        <p style={styles.matchResultSubtitle}>
          {result?.subtitle ?? "A partida terminou e a casa já reagiu ao resultado."}
        </p>

        <div style={styles.matchResultHostBox}>
          <div style={styles.matchResultHostLabel}>Host do bar</div>
          <p style={styles.matchResultHostLine}>
            {result?.hostLine ??
              "A casa comenta o resultado enquanto você se prepara para voltar ao circuito."}
          </p>
        </div>

        {result?.progressionTitle || result?.progressionText ? (
          <div style={styles.matchResultProgressBox}>
            <div style={styles.matchResultProgressLabel}>
              {result?.progressionTitle ?? "Progressão"}
            </div>
            <p style={styles.matchResultProgressText}>
              {result?.progressionText ?? "A campanha avançou depois desta vitória."}
            </p>
          </div>
        ) : null}

        <button style={styles.gameStartLaunchButton} onClick={onContinue}>
          VOLTAR AO FLUXO DE BARES
        </button>
      </div>
    </div>
  )
}

function PlayerSkinSelectionScreen({
  selectedPlayerSkin,
  selectedPlayerSkinIndex,
  selectablePlayerSkins,
  onBack,
  onConfirm,
  onNext,
  onPrevious,
  styles,
}: {
  selectedPlayerSkin: PlayerSkinProfile
  selectedPlayerSkinIndex: number
  selectablePlayerSkins: PlayerSkinProfile[]
  onBack: () => void
  onConfirm: () => void
  onNext: () => void
  onPrevious: () => void
  styles: StyleMap
}) {
  const totalSkins = selectablePlayerSkins.length
  const currentPosition = selectedPlayerSkinIndex >= 0 ? selectedPlayerSkinIndex + 1 : 1

  return (
    <div style={styles.characterSelectScreen}>
      <div style={styles.characterSelectHeader}>
        <div style={styles.characterSelectEyebrow}>Escolha seu protagonista</div>
        <button style={styles.characterSelectBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div style={styles.characterSelectBoard}>
        <div style={styles.characterSelectLeftColumn}>
          <div style={styles.characterPortraitFrame}>
            <img
              src={selectedPlayerSkin.avatarAsset}
              alt={selectedPlayerSkin.name}
              style={styles.characterPortraitImage}
            />
            <div style={styles.characterPortraitOverlay}>
              <div style={styles.characterPortraitName}>{selectedPlayerSkin.name}</div>
              <div style={styles.characterPortraitNickname}>
                {selectedPlayerSkin.nickname}
              </div>
            </div>
          </div>

          <div style={styles.characterIdentityPanel}>
            <div style={styles.characterNavigator}>
              <button style={styles.characterNavButton} onClick={onPrevious}>
                ←
              </button>
              <div style={styles.characterNavDots}>
                {selectablePlayerSkins.map((skin, index) => {
                  const active = index === selectedPlayerSkinIndex
                  return (
                    <span
                      key={skin.id}
                      style={{
                        ...styles.characterNavDot,
                        ...(active ? styles.characterNavDotActive : {}),
                      }}
                    />
                  )
                })}
              </div>
              <button style={styles.characterNavButton} onClick={onNext}>
                →
              </button>
            </div>

            <div style={styles.characterNavCounter}>
              {currentPosition} de {totalSkins}
            </div>
          </div>
        </div>

        <div style={styles.characterSelectRightColumn}>
          <div style={{ ...styles.characterInfoPanel, ...styles.playerSkinInfoPanel }}>
            <div style={styles.playerSkinStoryQuote}>
              “{selectedPlayerSkin.story}”
            </div>

            <div style={styles.playerSkinActionArea}>
              <button
                style={{ ...styles.characterSelectActionButton, ...styles.playerSkinActionButton }}
                onClick={onConfirm}
              >
                Seguir com {selectedPlayerSkin.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CharacterSelectionScreen({
  hasSelectedPartnerForVenue,
  selectedCharacter,
  selectedCharacterIndex,
  isSelectedCharacterUnlocked,
  selectedPartnerCharacter,
  selectableCharacters,
  onBack,
  onConfirm,
  onNext,
  onPrevious,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  hasSelectedPartnerForVenue: boolean
  selectedCharacter: TrucoCharacterProfile | null
  selectedCharacterIndex: number
  isSelectedCharacterUnlocked: boolean
  selectedPartnerCharacter: TrucoCharacterProfile | null
  selectableCharacters: TrucoCharacterProfile[]
  onBack: () => void
  onConfirm: () => void
  onNext: () => void
  onPrevious: () => void
  styles: StyleMap
}) {
  if (!selectedCharacter) {
    return (
      <div style={styles.characterSelectScreen}>
        <div style={styles.characterSelectEmptyBox}>
          Ainda não há personagens com avatar prontos para seleção.
        </div>
      </div>
    )
  }

  const styleTokens = selectedCharacter.playStyle
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
  const totalCharacters = selectableCharacters.length
  const currentPosition = selectedCharacterIndex >= 0 ? selectedCharacterIndex + 1 : 1
  const isSelectedPartner =
    hasSelectedPartnerForVenue && selectedPartnerCharacter?.id === selectedCharacter.id
  const unlockVenue = CAMPAIGN_STAGES.flatMap((stage) => stage.venues).find((venue) =>
    venue.partnerUnlockCharacterIds.includes(selectedCharacter.id)
  )
  const actionLabel = isSelectedPartner
    ? "Parceira atualmente escolhida"
    : `Escolher ${selectedCharacter.name}`
  const unlockStatusText = !isSelectedCharacterUnlocked
    ? unlockVenue
      ? `Vença ${unlockVenue.name} para liberar esta parceria`
      : "Avance na campanha para liberar esta parceria"
    : null

  return (
    <div style={styles.characterSelectScreen}>
      <div style={styles.characterSelectHeader}>
        <div style={styles.characterSelectEyebrow}>Escolha seu parceiro</div>
        <button style={styles.characterSelectBackButton} onClick={onBack}>
          Voltar
        </button>
      </div>

      <div style={styles.characterSelectBoard}>
        <div style={styles.characterSelectLeftColumn}>
          <div style={styles.characterPortraitFrame}>
            <img
              src={selectedCharacter.avatarAsset}
              alt={selectedCharacter.name}
              style={{
                ...styles.characterPortraitImage,
                ...(!isSelectedCharacterUnlocked ? styles.characterPortraitImageLocked : {}),
              }}
            />
            {!isSelectedCharacterUnlocked ? (
              <div style={styles.characterPortraitLockedLayer} />
            ) : null}
            <div style={styles.characterPortraitOverlay}>
              <div
                style={{
                  ...styles.characterPortraitName,
                  ...(!isSelectedCharacterUnlocked ? styles.characterPortraitTextLocked : {}),
                }}
              >
                {selectedCharacter.name}
              </div>
              <div
                style={{
                  ...styles.characterPortraitNickname,
                  ...(!isSelectedCharacterUnlocked ? styles.characterPortraitTextLocked : {}),
                }}
              >
                {selectedCharacter.nickname}
              </div>
            </div>
          </div>

          <div style={styles.characterIdentityPanel}>
            <div style={styles.characterNavigator}>
              <button style={styles.characterNavButton} onClick={onPrevious}>
                ←
              </button>
              <div style={styles.characterNavDots}>
                {selectableCharacters.map((character, index) => {
                  const active = index === selectedCharacterIndex
                  return (
                    <span
                      key={character.id}
                      style={{
                        ...styles.characterNavDot,
                        ...(active ? styles.characterNavDotActive : {}),
                      }}
                    />
                  )
                })}
              </div>
              <button style={styles.characterNavButton} onClick={onNext}>
                →
              </button>
            </div>

            <div style={styles.characterNavCounter}>
              {currentPosition} de {totalCharacters}
            </div>
          </div>
        </div>

        <div style={styles.characterSelectRightColumn}>
          <div style={styles.characterInfoPanel}>
            <div style={styles.characterInfoCard}>
              <div style={styles.characterInfoSection}>
                <div style={styles.characterInfoTitle}>História</div>
                <div style={styles.characterStoryQuote}>“{selectedCharacter.story}”</div>
              </div>
            </div>

            <div style={styles.characterDetailsGrid}>
              <div style={styles.characterInfoCard}>
                <div style={styles.characterInfoSection}>
                  <div style={styles.characterInfoTitle}>Estilo de jogo</div>
                  <div style={styles.characterStyleChips}>
                    {styleTokens.map((token) => (
                      <span key={token} style={styles.characterStyleChip}>
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.characterInfoCard}>
                <div style={styles.characterInfoSection}>
                  <div style={styles.characterInfoTitle}>Atributos</div>
                  <AttributeBar
                    label="Coragem"
                    value={selectedCharacter.attributes.courage}
                    styles={styles}
                  />
                  <AttributeBar
                    label="Paciência"
                    value={selectedCharacter.attributes.patience}
                    styles={styles}
                  />
                  <AttributeBar
                    label="Blefe"
                    value={selectedCharacter.attributes.bluff}
                    styles={styles}
                  />
                </div>
              </div>
            </div>

            <div style={styles.characterActionFooter}>
              {unlockStatusText ? (
                <div style={styles.characterUnlockHint}>{unlockStatusText}</div>
              ) : null}
              <button
                style={{
                  ...styles.characterSelectActionButton,
                  ...(!isSelectedCharacterUnlocked ? styles.disabledButton : {}),
                }}
                onClick={onConfirm}
                disabled={!isSelectedCharacterUnlocked}
              >
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VenueIntroScreen({
  currentCampaignVenue,
  currentVenueWins,
  hasSelectedPartnerForVenue,
  opponentCharacters,
  playerProfile,
  selectedPlayerSkin,
  onOpenCharacterSelect,
  onStart,
  styles,
}: {
  currentCampaignVenue: CampaignVenue | null
  currentVenueWins: number
  hasSelectedPartnerForVenue: boolean
  opponentCharacters: TrucoCharacterProfile[]
  playerProfile: PlayerProfile
  selectedPlayerSkin: PlayerSkinProfile
  onOpenCharacterSelect: () => void
  onStart: () => void
  styles: StyleMap
}) {
  const coverConfig = currentCampaignVenue
    ? VENUE_COVER_CONFIG_BY_ID[currentCampaignVenue.id]
    : undefined
  const ctaLabel = hasSelectedPartnerForVenue ? "ENTRAR NO BAR" : "ESCOLHER PARCEIRA"
  const overallMatches = playerProfile.campaign.wins + playerProfile.campaign.losses
  const overallWinRate = overallMatches > 0
    ? Math.round((playerProfile.campaign.wins / overallMatches) * 100)
    : 0
  const challengeDifficulty = currentCampaignVenue?.difficulty.aiLevel ?? 1

  if (!coverConfig) {
    const fallbackTheme = getTableTheme(currentCampaignVenue?.visualTheme)
    const fallbackIntroStyle: React.CSSProperties = {
      ...styles.venueIntroScreen,
      background:
        `radial-gradient(circle at 24% 18%, ${fallbackTheme.accentColor}42 0%, transparent 34%), ` +
        `radial-gradient(circle at 76% 68%, ${fallbackTheme.railColor}55 0%, transparent 36%), ` +
        `linear-gradient(135deg, ${fallbackTheme.backgroundColor} 0%, #120d0a 100%)`,
      boxShadow: "inset 0 0 90px rgba(0,0,0,0.42)",
    }
    const participants = [
      {
        id: "you",
        role: "Você",
        name: selectedPlayerSkin.name,
        description: selectedPlayerSkin.story,
        avatarAsset: selectedPlayerSkin.avatarAsset,
      },
      ...opponentCharacters.map((character, index) => ({
        id: character.id,
        role: index === 0 ? "Adversário esquerdo" : "Adversário direito",
        name: character.name,
        description: character.story,
        avatarAsset: character.avatarAsset,
      })),
    ]

    return (
      <div style={fallbackIntroStyle}>
        <div style={styles.venueIntroHeader}>
          <div>
            <div style={styles.venueIntroEyebrow}>Chegada no bar</div>
            <h2 style={styles.venueIntroTitle}>{currentCampaignVenue?.name ?? "Próxima mesa"}</h2>
            <div style={styles.venueIntroMeta}>
              {currentCampaignVenue?.districtLabel ?? "Local ainda não definido"}
            </div>
          </div>
          <button style={styles.characterSelectBackButton} onClick={onOpenCharacterSelect}>
            Trocar parceira
          </button>
        </div>

        <div style={styles.venueIntroBoard}>
          <div style={styles.venueIntroMainCard}>
            <div style={styles.venueIntroSectionLabel}>Clima do lugar</div>
            <p style={styles.venueIntroLead}>
              {currentCampaignVenue?.entryNarrative ??
                "A mesa já está armada. Falta só respirar fundo e começar."}
            </p>
            <p style={styles.venueIntroText}>
              {currentCampaignVenue?.atmosphere ??
                "O bar ainda espera uma descrição própria, mas a partida já está pronta para começar."}
            </p>

            <div style={styles.venueIntroFactsGrid}>
              <div style={styles.venueIntroFactCard}>
                <div style={styles.venueIntroFactLabel}>Variante</div>
                <strong style={styles.venueIntroFactValue}>
                  {currentCampaignVenue?.variant === "PAULISTA" ? "Truco Paulista" : "Truco Mineiro"}
                </strong>
              </div>
              <div style={styles.venueIntroFactCard}>
                <div style={styles.venueIntroFactLabel}>Meta do bar</div>
                <strong style={styles.venueIntroFactValue}>
                  {currentCampaignVenue?.matchesToClear ?? 0} vitórias
                </strong>
              </div>
              <div style={styles.venueIntroFactCard}>
                <div style={styles.venueIntroFactLabel}>Dificuldade</div>
                <strong style={styles.venueIntroFactValue}>
                  {challengeDifficulty}/5
                </strong>
              </div>
            </div>
          </div>

          <div style={styles.venueIntroRosterPanel}>
            <div style={styles.venueIntroSectionLabel}>Quem segura a mesa</div>
            <div style={styles.venueIntroParticipants}>
              {participants.map((participant) => (
                <div key={participant.id} style={styles.venueIntroParticipantCard}>
                  <div style={styles.venueIntroParticipantAvatar}>
                    <img
                      src={participant.avatarAsset}
                      alt={participant.name}
                      style={styles.venueIntroParticipantImage}
                    />
                  </div>
                  <div style={styles.venueIntroParticipantBody}>
                    <div style={styles.venueIntroParticipantRole}>{participant.role}</div>
                    <div style={styles.venueIntroParticipantName}>{participant.name}</div>
                    <div style={styles.venueIntroParticipantText}>{participant.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.venueIntroActions}>
          <button style={styles.gameStartLaunchButton} onClick={onStart}>
            {ctaLabel}
          </button>
        </div>
      </div>
    )
  }

  const coverTheme = getTableTheme(currentCampaignVenue?.visualTheme)

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateRows: "minmax(0, 1fr)",
        padding: 8,
        color: "#f6e7c4",
        boxSizing: "border-box",
        backgroundColor: coverTheme.backgroundColor,
        backgroundImage: coverConfig.backgroundAsset
          ? `linear-gradient(180deg, rgba(11, 7, 4, 0.34) 0%, rgba(11, 7, 4, 0.72) 100%), url(${coverConfig.backgroundAsset})`
          : `radial-gradient(circle at 24% 18%, ${coverTheme.accentColor}40 0%, transparent 34%), radial-gradient(circle at 76% 68%, ${coverTheme.railColor}55 0%, transparent 36%), linear-gradient(135deg, ${coverTheme.backgroundColor} 0%, #120d0a 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(340px, 386px) minmax(302px, 1fr)",
          gap: 12,
          height: "100%",
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "minmax(190px, 1fr) 128px auto",
            gap: 8,
            alignItems: "end",
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 10,
              background: "linear-gradient(180deg, rgba(32,19,12,0.62) 0%, rgba(11,7,5,0.78) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(231,188,103,0.18)",
            }}
          >
            <img
              src={coverConfig.hostPortraitAsset}
              alt={coverConfig.hostName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center bottom",
                filter: "contrast(1.04) saturate(0.96) drop-shadow(0 22px 26px rgba(0,0,0,0.42))",
                opacity: 1,
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              minHeight: 128,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "16px 18px",
              boxSizing: "border-box",
            }}
          >
            <img
              src={coverConfig.quoteBoardAsset}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                mixBlendMode: "screen",
              }}
            />
            <div
              style={{
                position: "relative",
                maxWidth: "66%",
                color: "#efe0be",
                fontFamily: "\"Georgia\", serif",
                fontSize: 13,
                lineHeight: 1.12,
                fontStyle: "italic",
                overflowWrap: "break-word",
                textShadow: "0 2px 14px rgba(0,0,0,0.5)",
                transform: "translateY(4px)",
              }}
            >
              “{coverConfig.hostQuote}”
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "\"Georgia\", serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.03em",
              }}
            >
              {coverConfig.hostName}
            </div>
            <div
            style={{
              marginTop: 4,
              color: "rgba(245, 219, 165, 0.9)",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
            >
              {coverConfig.hostRole}
            </div>
          </div>
        </div>

        <div
          style={{
            minHeight: 0,
            padding: "10px 16px 12px",
            display: "grid",
            gridTemplateRows: "auto auto auto auto auto",
            alignContent: "start",
            gap: 5,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, rgba(19,11,8,0.92) 0%, rgba(10,6,4,0.94) 100%)",
            border: "1px solid rgba(155, 110, 54, 0.56)",
            boxShadow: "0 16px 28px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(100,65,31,0.28)",
            borderRadius: 22,
          }}
        >
          <div style={{ position: "relative", textAlign: "center" }}>
            <img
              src={coverConfig.dividerAsset}
              alt=""
              aria-hidden="true"
              style={{
                width: "62%",
                maxWidth: 280,
                height: 10,
                objectFit: "contain",
                mixBlendMode: "screen",
                opacity: 0.88,
              }}
            />
            <h2
              style={{
                margin: "3px 0 5px",
                fontFamily: "\"Georgia\", serif",
                fontSize: 32,
                lineHeight: 0.98,
                color: "#e0b25d",
                textShadow: "0 2px 16px rgba(0,0,0,0.28)",
              }}
            >
              {currentCampaignVenue?.name ?? "Próximo bar"}
            </h2>
            <div
              style={{
                color: "#f2d9a7",
                fontSize: 13,
                lineHeight: 1.15,
              }}
            >
              {currentCampaignVenue?.districtLabel ?? "Local ainda não definido"}
            </div>
          </div>

          <div style={{ position: "relative", textAlign: "center" }}>
            <img
              src={coverConfig.dividerAsset}
              alt=""
              aria-hidden="true"
              style={{
                width: "70%",
                maxWidth: 320,
                height: 8,
                objectFit: "contain",
                mixBlendMode: "screen",
                opacity: 0.84,
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 8px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "\"Georgia\", serif",
                fontSize: 15,
                lineHeight: 1.08,
                color: "#f0d7a0",
              }}
            >
              {coverConfig.leadText}
            </p>
            <p
              style={{
                margin: "5px 0 0",
                fontFamily: "\"Georgia\", serif",
                fontSize: 13,
                lineHeight: 1.08,
                color: "rgba(238, 220, 180, 0.9)",
              }}
            >
              {coverConfig.description}
            </p>
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              gap: 5,
              alignContent: "start",
              minHeight: 132,
            }}
          >
            <div
              style={{
                color: "#d6aa57",
                letterSpacing: "0.18em",
                fontSize: 10,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Adversários
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {opponentCharacters.map((character) => (
                <div
                  key={character.id}
                  style={{
                    display: "grid",
                    gap: 3,
                    justifyItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 86,
                      aspectRatio: "0.84",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "2px solid rgba(173, 123, 55, 0.78)",
                      boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
                      background: "linear-gradient(180deg, rgba(100,72,43,0.26) 0%, rgba(34,21,12,0.46) 100%)",
                    }}
                  >
                    <img
                      src={character.avatarAsset ?? selectedPlayerSkin.avatarAsset}
                      alt={character.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: "#f0dcc0",
                      fontFamily: "\"Georgia\", serif",
                      fontWeight: 700,
                      fontSize: 12,
                      lineHeight: 1.1,
                    }}
                  >
                    <div>
                      {character.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              gap: 2,
              justifyItems: "center",
              alignContent: "start",
              minHeight: 92,
            }}
          >
            <div
              style={{
                color: "#c69643",
                letterSpacing: "0.18em",
                fontSize: 12,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Dificuldade do desafio
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <img
                  key={`difficulty-${index}`}
                  src={coverConfig.difficultyBottleAsset}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: 32,
                    height: 52,
                    objectFit: "contain",
                    mixBlendMode: "screen",
                    opacity: index < challengeDifficulty ? 0.98 : 0.3,
                    filter: index < challengeDifficulty
                      ? "drop-shadow(0 6px 14px rgba(237,178,72,0.34))"
                      : "grayscale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto 100px",
            alignContent: "center",
            justifyItems: "center",
            gap: 14,
            height: "100%",
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(96%, 302px)",
              aspectRatio: "1 / 1.08",
              color: "#2b1608",
              filter: "drop-shadow(0 20px 28px rgba(0,0,0,0.32))",
              minWidth: 0,
            }}
          >
            <img
              src={coverConfig.statsPlaqueAsset}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "fill",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "12%",
                right: "12%",
                textAlign: "center",
                fontFamily: "\"Georgia\", serif",
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 0.95,
                color: "#2a1307",
                whiteSpace: "nowrap",
                textShadow: "0 1px 0 rgba(248,218,151,0.32)",
              }}
            >
              Seu histórico aqui
            </div>

            <div
              style={{
                position: "absolute",
                top: "28%",
                left: "14%",
                right: "14%",
                bottom: "18%",
                display: "grid",
                gridTemplateRows: "repeat(3, minmax(0, 1fr))",
                gap: 3,
              }}
            >
              {[
                {
                  label: "VITÓRIAS",
                  value: String(playerProfile.campaign.wins),
                  accent: "#75480f",
                },
                {
                  label: "DERROTAS",
                  value: String(playerProfile.campaign.losses),
                  accent: "#762218",
                },
                {
                  label: "APROVEITAMENTO",
                  value: `${overallWinRate}%`,
                  accent: "#704611",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(48px, auto)",
                    alignItems: "center",
                    gap: 10,
                    minHeight: 0,
                    padding: "0 12px",
                    borderBottom: item.label === "APROVEITAMENTO"
                      ? "none"
                      : "1px solid rgba(83, 45, 15, 0.22)",
                  }}
                >
                  <div
                    style={{
                      fontSize: item.label === "APROVEITAMENTO" ? 11 : 16,
                      fontWeight: 700,
                      fontFamily: "\"Georgia\", serif",
                      lineHeight: 1,
                      letterSpacing: item.label === "APROVEITAMENTO" ? 0 : "0.02em",
                      color: "#2a1307",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      textShadow: "0 1px 0 rgba(251,225,169,0.32)",
                    }}
                    >
                    {item.label}
                  </div>
                  <div
                    style={{
                      minWidth: 0,
                      textAlign: "right",
                      fontSize: item.value.length >= 3 ? 26 : 34,
                      fontWeight: 700,
                      lineHeight: 0.95,
                      color: item.accent,
                      fontFamily: "\"Georgia\", serif",
                      textShadow: "0 1px 0 rgba(251,225,169,0.25)",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                position: "absolute",
                left: "13%",
                right: "13%",
                bottom: "7.6%",
                fontSize: 12,
                lineHeight: 1,
                color: "rgba(47, 24, 9, 0.72)",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              Neste bar: {currentVenueWins}/{currentCampaignVenue?.matchesToClear ?? 0} vitórias
            </div>
          </div>

          <button
            onClick={onStart}
            style={{
              position: "relative",
              width: "min(96%, 302px)",
              minHeight: 100,
              padding: "10px 12px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#f3d08a",
              fontFamily: "\"Georgia\", serif",
              fontWeight: 700,
              fontSize: 15,
              lineHeight: 0.98,
              letterSpacing: "0.03em",
              textShadow: "0 3px 10px rgba(0,0,0,0.4)",
              alignSelf: "start",
              display: "grid",
              placeItems: "center",
              boxSizing: "border-box",
            }}
          >
            <img
              src={coverConfig.ctaPlaqueAsset}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                mixBlendMode: "screen",
              }}
            />
            <span
              style={{
                position: "relative",
                display: "inline-block",
                width: 132,
                maxWidth: "58%",
                textAlign: "center",
                whiteSpace: "normal",
                overflowWrap: "break-word",
              }}
            >
              {ctaLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function AttributeBar({
  label,
  value,
  styles,
}: {
  label: string
  value: 1 | 2 | 3 | 4 | 5
  styles: StyleMap
}) {
  return (
    <div style={styles.characterAttributeRow}>
      <div style={styles.characterAttributeLabel}>{label}</div>
      <div style={styles.characterAttributeTrack}>
        <div
          style={{
            ...styles.characterAttributeFill,
            width: `${(value / 5) * 100}%`,
          }}
        />
      </div>
      <div style={styles.characterAttributeValue}>{value}/5</div>
    </div>
  )
}

interface LogsPanelProps {
  logs: string
  onCopyLogs: () => void
  styles: StyleMap
}

export function LogsPanel({ logs, onCopyLogs, styles }: LogsPanelProps) {
  return (
    <section style={styles.logsCard}>
      <div style={styles.logsHeader}>
        <h2 style={styles.sectionTitle}>Logs</h2>
        <button
          style={{
            ...styles.secondaryButton,
            ...(!logs ? styles.disabledButton : {}),
          }}
          onClick={onCopyLogs}
          disabled={!logs}
        >
          Copiar log
        </button>
      </div>

      <textarea readOnly value={logs} style={styles.logsArea} />
    </section>
  )
}

function HumanCardsPanel({
  inGameContextMenuOpen,
  player1,
  canPlayHumanCard,
  canPlayCoveredCard,
  gameplayIntroActive,
  onCloseInGameContextMenu,
  onAddEightPointsFromContextMenu,
  onExitMatchFromContextMenu,
  onLoseMatchFromContextMenu,
  onOpenInGameContextMenu,
  onPlayCard,
  onResetProgressFromContextMenu,
  onSwapPartnerFromContextMenu,
  onWinMatchFromContextMenu,
  styles,
}: {
  inGameContextMenuOpen: boolean
  player1: Player | null
  canPlayHumanCard: boolean
  canPlayCoveredCard: boolean
  gameplayIntroActive: boolean
  onCloseInGameContextMenu: () => void
  onAddEightPointsFromContextMenu: () => void
  onExitMatchFromContextMenu: () => void
  onLoseMatchFromContextMenu: () => void
  onOpenInGameContextMenu: () => void
  onPlayCard: (card: Card, options?: { covered?: boolean }) => void
  onResetProgressFromContextMenu: () => void
  onSwapPartnerFromContextMenu: () => void
  onWinMatchFromContextMenu: () => void
  styles: StyleMap
}) {
  const [playCovered, setPlayCovered] = useState(false)
  const [coveredHintDismissed, setCoveredHintDismissed] = useState(false)
  const coveredModeActive = canPlayCoveredCard && playCovered
  const showCoveredHint = canPlayCoveredCard && !coveredModeActive && !coveredHintDismissed

  useEffect(() => {
    if (!canPlayCoveredCard) {
      setPlayCovered(false)
    }
  }, [canPlayCoveredCard])

  const handleToggleCovered = () => {
    setCoveredHintDismissed(true)
    setPlayCovered((current) => !current)
  }

  return (
    <div style={styles.mobileHandPanel}>
      <div style={{ ...styles.mobileHandHeader, ...styles.mobileHandHeaderControlsOnly }}>
        <div style={styles.coveredCardToggleWrap}>
          {showCoveredHint ? (
            <div style={styles.coveredCardHint}>
              <strong style={styles.coveredCardHintTitle}>Nova jogada</strong>
              <span style={styles.coveredCardHintText}>toque para jogar coberta</span>
            </div>
          ) : null}
          <button
            type="button"
            style={{
              ...styles.coveredCardToggle,
              ...(showCoveredHint ? styles.coveredCardToggleHighlighted : {}),
              ...(coveredModeActive ? styles.coveredCardToggleActive : {}),
              ...(!canPlayCoveredCard ? styles.coveredCardToggleDisabled : {}),
            }}
            onClick={handleToggleCovered}
            disabled={!canPlayCoveredCard}
            aria-pressed={coveredModeActive}
            title={
              canPlayCoveredCard
                ? "Jogar a próxima carta coberta"
                : "Carta coberta libera a partir da segunda vaza"
            }
          >
            <span style={styles.coveredCardToggleSwitch}>
              <span
                style={{
                  ...styles.coveredCardToggleKnob,
                  ...(coveredModeActive ? styles.coveredCardToggleKnobActive : {}),
                }}
              />
            </span>
            Coberta
          </button>
        </div>
      </div>

      <div style={styles.mobileHandRowWrap}>
        {!player1 || player1.hand.length === 0 ? (
          <div style={styles.emptyHandBox}>Você não tem mais cartas.</div>
        ) : (
          <div style={styles.mobileHandRow}>
            {player1.hand.map((card, index) => (
              <button
                key={`${card.rank}-${card.suit}-${index}`}
                style={{
                  ...styles.mobileCardButton,
                  ...(canPlayHumanCard ? styles.cardButtonActive : styles.cardButtonDisabled),
                  ...(coveredModeActive ? styles.mobileCardButtonCoveredPreview : {}),
                }}
                onClick={() => onPlayCard(card, { covered: coveredModeActive })}
                disabled={!canPlayHumanCard}
                title={coveredModeActive ? `Jogar ${formatCard(card)} coberta` : formatCard(card)}
              >
                {coveredModeActive ? (
                  <div style={styles.coveredCardPreviewBadge}>Coberta</div>
                ) : null}
                <div style={styles.mobileCardCornerTop}>
                  <div style={{ ...styles.mobileCardRank, color: getSuitColor(card.suit) }}>
                    {card.rank}
                  </div>
                  <div style={{ ...styles.mobileCardSuit, color: getSuitColor(card.suit) }}>
                    {getSuitSymbol(card.suit)}
                  </div>
                </div>
                <div style={{ ...styles.mobileCardCenterSuit, color: getSuitColor(card.suit) }}>
                  {getSuitSymbol(card.suit)}
                </div>
                <div style={styles.mobileCardCornerBottom}>
                  <div style={{ ...styles.mobileCardRank, color: getSuitColor(card.suit) }}>
                    {card.rank}
                  </div>
                  <div style={{ ...styles.mobileCardSuit, color: getSuitColor(card.suit) }}>
                    {getSuitSymbol(card.suit)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={styles.mobileHandMenuDock}>
          <div style={styles.inGameContextMenuWrap}>
            <button
              style={{
                ...styles.inGameContextMenuButton,
                ...styles.inGameContextMenuButtonHand,
              }}
              onClick={onOpenInGameContextMenu}
              disabled={gameplayIntroActive}
            >
              MENU
            </button>

            {inGameContextMenuOpen ? (
              <div style={styles.inGameContextMenuPanelHand}>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onSwapPartnerFromContextMenu}
                >
                  Trocar de parceira
                </button>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onWinMatchFromContextMenu}
                >
                  Vencer esta partida
                </button>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onAddEightPointsFromContextMenu}
                >
                  Ganhar 8 pontos
                </button>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onLoseMatchFromContextMenu}
                >
                  Perder esta partida
                </button>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onExitMatchFromContextMenu}
                >
                  Sair
                </button>
                <button
                  style={styles.inGameContextMenuAction}
                  onClick={onResetProgressFromContextMenu}
                >
                  Resetar progresso
                </button>
                <button
                  style={styles.inGameContextMenuActionSecondary}
                  onClick={onCloseInGameContextMenu}
                >
                  Voltar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


function InfoBox({
  label,
  value,
  styles,
}: {
  label: string
  value: string
  styles: StyleMap
}) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoBoxLabel}>{label}</div>
      <div style={styles.infoBoxValue}>{value}</div>
    </div>
  )
}

function CampaignStageCard({
  stage,
  active,
  completed,
  styles,
}: {
  stage: CampaignStage
  active?: boolean
  completed?: boolean
  styles: StyleMap
}) {
  const totalMatches = stage.venues.reduce(
    (sum, venue) => sum + venue.matchesToClear,
    0
  )

  return (
    <div
      style={{
        ...styles.stageCard,
        ...(active ? styles.stageCardActive : {}),
        ...(completed ? styles.stageCardCompleted : {}),
      }}
    >
      <div style={styles.stageCardTopRow}>
        <div>
          <div style={styles.stageCardTitle}>{stage.name}</div>
          <div style={styles.stageCardTier}>{getCampaignTierLabel(stage.tier)}</div>
        </div>

        <div style={styles.stageCardMapLabel}>{stage.mapLabel}</div>
      </div>

      <div style={styles.stageCardText}>{stage.shortDescription}</div>

      <div style={styles.stageCardMetaRow}>
        <span>{stage.venues.length} locais</span>
        <span>{totalMatches} partidas base</span>
      </div>
    </div>
  )
}
