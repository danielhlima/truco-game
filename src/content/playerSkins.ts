import zecaViramaoAsset from "../assets/characters/zeca-viramao.png"
import liaViradaAsset from "../assets/characters/lia-virada.png"
import bentoSecaMesaAsset from "../assets/characters/bento-seca-mesa.png"
import naraCerteiraAsset from "../assets/characters/nara-certeira.png"
import guiMeiaLuaAsset from "../assets/characters/gui-meia-lua.png"
import solangeViracaoAsset from "../assets/characters/solange-viracao.png"
import claraViraFolhaAsset from "../assets/characters/clara-vira-folha.png"
import darioSeteCopasAsset from "../assets/characters/dario-sete-copas.png"
import akemiCorteCertoAsset from "../assets/characters/akemi-corte-certo.png"
import kenjiMeiaNoiteAsset from "../assets/characters/kenji-meia-noite.png"
import meiLinContaFriaAsset from "../assets/characters/mei-lin-conta-fria.png"

export type PlayerSkinId =
  | "zeca-viramao"
  | "lia-virada"
  | "bento-seca-mesa"
  | "nara-certeira"
  | "gui-meia-lua"
  | "solange-viracao"
  | "clara-vira-folha"
  | "dario-sete-copas"
  | "akemi-corte-certo"
  | "kenji-meia-noite"
  | "mei-lin-conta-fria"

export interface PlayerSkinProfile {
  id: PlayerSkinId
  name: string
  nickname: string
  avatarAsset: string
  story: string
  visualNote: string
}

export const DEFAULT_PLAYER_SKIN_ID: PlayerSkinId = "zeca-viramao"

export const PLAYER_SKINS: PlayerSkinProfile[] = [
  {
    id: "zeca-viramao",
    name: "Zeca Viramao",
    nickname: "O Mao Leve",
    avatarAsset: zecaViramaoAsset,
    story:
      "Zeca chega com cara de quem conhece todo boteco da rota, manga pronta e olhar de quem ja ouviu muita historia de mesa.",
    visualNote:
      "Visual classico do jogador raiz: discreto, urbano e pronto para atravessar a campanha inteira sem parecer preso a um unico bar.",
  },
  {
    id: "lia-virada",
    name: "Lia Virada",
    nickname: "A Calma da Mesa",
    avatarAsset: liaViradaAsset,
    story:
      "Lia tem presenca tranquila, jaqueta jeans e um jeito de protagonista que parece caber tanto no boteco quanto no campeonato.",
    visualNote:
      "Retrato caloroso, com jaqueta jeans e olhar seguro. Funciona bem como protagonista de boteco, bairro e campeonato maior.",
  },
  {
    id: "bento-seca-mesa",
    name: "Bento Seca-Mesa",
    nickname: "O Passo Curto",
    avatarAsset: bentoSecaMesaAsset,
    story:
      "Bento aparece simples e firme, com roupa escura e sorriso curto de quem prefere deixar a mesa falar primeiro.",
    visualNote:
      "Presenca simples e firme, com roupa casual escura. Passa a sensacao de jogador experiente sem virar figura de chefe.",
  },
  {
    id: "nara-certeira",
    name: "Nara Certeira",
    nickname: "A Mao Firme",
    avatarAsset: naraCerteiraAsset,
    story:
      "Nara tem retrato maduro, direto, com contraste forte e presenca de quem nao precisa disputar espaco para ser notada.",
    visualNote:
      "Visual maduro e direto, com contraste forte entre jaqueta escura e blusa vinho. Boa escolha para uma protagonista mais experiente.",
  },
  {
    id: "gui-meia-lua",
    name: "Gui Meia-Lua",
    nickname: "O Sorriso de Canto",
    avatarAsset: guiMeiaLuaAsset,
    story:
      "Gui entra com um sorriso de canto e roupa casual, trazendo um protagonista mais jovem para a rota dos bares.",
    visualNote:
      "Aparencia jovem, relaxada e urbana. Traz leveza para o protagonista sem transformar a skin em vantagem de jogo.",
  },
  {
    id: "solange-viracao",
    name: "Solange Viracao",
    nickname: "A Sem Pressa",
    avatarAsset: solangeViracaoAsset,
    story:
      "Solange tem visual sereno, tons quentes e uma postura de quem atravessa a campanha sem pressa de provar nada.",
    visualNote:
      "Retrato sereno, jaqueta jeans e tons quentes. Tem presenca de protagonista de longa jornada, sem parecer adversaria fixa.",
  },
  {
    id: "clara-vira-folha",
    name: "Clara Vira-Folha",
    nickname: "A Leitura Fria",
    avatarAsset: claraViraFolhaAsset,
    story:
      "Clara traz um visual claro e contido, daqueles que combinam com mesa de bairro e conversa baixa no canto do bar.",
    visualNote:
      "Visual claro e contido, com tons de verde e creme. Mantem uma identidade elegante sem fugir do clima de mesa popular.",
  },
  {
    id: "dario-sete-copas",
    name: "Dario Sete-Copas",
    nickname: "O Olho Antigo",
    avatarAsset: darioSeteCopasAsset,
    story:
      "Dario carrega barba grisalha, jaqueta marrom e um ar de jogador antigo que parece ter vindo de muitas mesas diferentes.",
    visualNote:
      "Presenca veterana, barba grisalha e jaqueta marrom. Passa tradicao e estrada sem sugerir qualquer bonus mecanico.",
  },
  {
    id: "akemi-corte-certo",
    name: "Akemi Corte-Certo",
    nickname: "A Linha Certa",
    avatarAsset: akemiCorteCertoAsset,
    story:
      "Akemi aparece com retrato limpo, roupa sobria e uma composicao moderna que destaca o rosto sem roubar a cena.",
    visualNote:
      "Retrato limpo, reservado e moderno. Funciona como skin de jogador porque comunica identidade, nao comportamento automatico.",
  },
  {
    id: "kenji-meia-noite",
    name: "Kenji Meia-Noite",
    nickname: "O Silencio na Mesa",
    avatarAsset: kenjiMeiaNoiteAsset,
    story:
      "Kenji tem visual escuro e reservado, com expressao baixa e presenca discreta para quem prefere um protagonista sobrio.",
    visualNote:
      "Visual escuro, sobrio e discreto. Boa alternativa para quem quer um protagonista mais reservado na mesa.",
  },
  {
    id: "mei-lin-conta-fria",
    name: "Mei Lin Conta-Fria",
    nickname: "A Conta Certa",
    avatarAsset: meiLinContaFriaAsset,
    story:
      "Mei Lin combina oculos finos, tons escuros e uma elegancia fria que funciona bem em qualquer etapa da campanha.",
    visualNote:
      "Aparencia elegante, oculos finos e tons escuros. Mantem a skin adulta e marcante sem prometer influencia nas cartas.",
  },
]

export const PLAYER_SKIN_BY_ID = Object.fromEntries(
  PLAYER_SKINS.map((skin) => [skin.id, skin])
) as Record<PlayerSkinId, PlayerSkinProfile>

export function getPlayerSkinById(skinId: string | null | undefined): PlayerSkinProfile {
  return skinId && skinId in PLAYER_SKIN_BY_ID
    ? PLAYER_SKIN_BY_ID[skinId as PlayerSkinId]
    : PLAYER_SKIN_BY_ID[DEFAULT_PLAYER_SKIN_ID]
}
