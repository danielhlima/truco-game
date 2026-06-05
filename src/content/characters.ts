import type { AiTrucoPersonalityId } from "../ai/trucoPersonalities"
import zecaViramaoAsset from "../assets/characters/zeca-viramao.png"
import negaCatimboAsset from "../assets/characters/nega-catimbo.png"
import tiaoCascaGrossaAsset from "../assets/characters/tiao-casca-grossa.png"
import maneBanguelaAsset from "../assets/characters/mane-banguela.png"
import jocaBusaoAsset from "../assets/characters/joca-busao.png"
import ritaGambiarraAsset from "../assets/characters/rita-gambiarra.png"
import tonhaoRasgaLataAsset from "../assets/characters/tonhao-rasga-lata.png"
import cidaFumacaAsset from "../assets/characters/cida-fumaca.png"
import ditoMarruaAsset from "../assets/characters/dito-marrua.png"
import patriciaMoniqueAsset from "../assets/characters/patricia-monique.png"
import naldoTramelaAsset from "../assets/characters/naldo-tramela.png"
import dalvaSeringaAsset from "../assets/characters/dalva-seringa.png"
import biuCaolhoAsset from "../assets/characters/biu-caolho.png"
import aninhaPassarelaAsset from "../assets/characters/aninha-passarela.png"
import celsinhoBrequeAsset from "../assets/characters/celsinho-breque.png"
import quiteriaMaoTortaAsset from "../assets/characters/quiteria-mao-torta.png"
import norbertoFubaAsset from "../assets/characters/norberto-fuba.png"
import rosinhaCatracaAsset from "../assets/characters/rosinha-catraca.png"
import damiaoCoroteAsset from "../assets/characters/damiao-corote.png"
import leninhaLambretaAsset from "../assets/characters/leninha-lambreta.png"
import juraPancadaAsset from "../assets/characters/jura-pancada.png"
import marlenePimentaAsset from "../assets/characters/marlene-pimenta.png"
import zitoParafusoAsset from "../assets/characters/zito-parafuso.png"
import creusaRabugentaAsset from "../assets/characters/creusa-rabugenta.png"
import ivoneVernizAsset from "../assets/characters/ivone-verniz.png"
import osmarAlfineteAsset from "../assets/characters/osmar-alfinete.png"
import geraldoMedalhaAsset from "../assets/characters/geraldo-medalha.png"
import sueliEstopimAsset from "../assets/characters/sueli-estopim.png"
import ramiroBoleroAsset from "../assets/characters/ramiro-bolero.png"
import lunaCandelaAsset from "../assets/characters/luna-candela.png"
import minaCompassoAsset from "../assets/characters/mina-compasso.png"
import viktorMuralhaAsset from "../assets/characters/viktor-muralha.png"
import madameVioletaAsset from "../assets/characters/madame-violeta.png"
import augustoCrupieAsset from "../assets/characters/augusto-crupie.png"
import cosmeOrbitaAsset from "../assets/characters/cosme-orbita.png"

export type TrucoCharacterId =
  | "zeca-viramao"
  | "nega-catimbo"
  | "tiao-casca-grossa"
  | "mane-banguela"
  | "joca-busao"
  | "rita-gambiarra"
  | "tonhao-rasga-lata"
  | "cida-fumaca"
  | "dito-marrua"
  | "patricia-monique"
  | "naldo-tramela"
  | "dalva-seringa"
  | "biu-caolho"
  | "aninha-passarela"
  | "celsinho-breque"
  | "quiteria-mao-torta"
  | "norberto-fuba"
  | "rosinha-catraca"
  | "damiao-corote"
  | "leninha-lambreta"
  | "jura-pancada"
  | "marlene-pimenta"
  | "zito-parafuso"
  | "creusa-rabugenta"
  | "ivone-verniz"
  | "osmar-alfinete"
  | "geraldo-medalha"
  | "sueli-estopim"
  | "ramiro-bolero"
  | "luna-candela"
  | "mina-compasso"
  | "viktor-muralha"
  | "madame-violeta"
  | "augusto-crupie"
  | "cosme-orbita"

export type TrucoCharacterRole = "player" | "partner" | "opponent" | "npc"

export interface TrucoCharacterAttributes {
  courage: 1 | 2 | 3 | 4 | 5
  patience: 1 | 2 | 3 | 4 | 5
  bluff: 1 | 2 | 3 | 4 | 5
}

export interface TrucoCharacterProfile {
  id: TrucoCharacterId
  name: string
  nickname: string
  personalityId: AiTrucoPersonalityId
  role: TrucoCharacterRole
  playStyle: string
  attributes: TrucoCharacterAttributes
  avatarAsset?: string
  story: string
}

export const TRUCO_CHARACTER_ROSTER: TrucoCharacterProfile[] = [
  {
    id: "zeca-viramao",
    name: "Zeca Viramao",
    nickname: "O Mao Leve",
    personalityId: "balanced",
    role: "player",
    playStyle: "Frio, observador, cresce no momento certo",
    attributes: {
      courage: 3,
      patience: 4,
      bluff: 3,
    },
    avatarAsset: zecaViramaoAsset,
    story:
      "Ninguem sabe como, mas Zeca ja ganhou uma partida com tanta calma que o adversario pediu desculpa por ter sentado na mesa. Desde entao corre o boato de que, quando ele vem com carta ruim, e justamente quando esta mais perigoso.",
  },
  {
    id: "nega-catimbo",
    name: "Nega Catimbo",
    nickname: "A Que Sente a Mesa",
    personalityId: "conservative",
    role: "partner",
    playStyle: "Calculista, fiel ao jogo, dificil de emocionar",
    attributes: {
      courage: 3,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: negaCatimboAsset,
    story:
      "Ela ja expulsou um blefador da mesa usando so um 'aham' tao carregado de desprezo que o sujeito foi embora repensar a propria infancia. Dizem que ela descobre a forca da mao alheia pelo jeito que a pessoa segura o copo.",
  },
  {
    id: "tiao-casca-grossa",
    name: "Tiao Casca Grossa",
    nickname: "O Sobrancelha de Aco",
    personalityId: "balanced",
    role: "opponent",
    playStyle: "Seco, intimidador, gosta de castigar erro",
    attributes: {
      courage: 4,
      patience: 3,
      bluff: 3,
    },
    avatarAsset: tiaoCascaGrossaAsset,
    story:
      "Ele fala pouco porque afirma que desperdiçar palavra enfraquece o truco. Certa vez passou tres horas em silencio, pediu doze com uma sobrancelha e saiu com dinheiro, amendoim e respeito involuntario de todo o bairro.",
  },
  {
    id: "mane-banguela",
    name: "Mane Banguela",
    nickname: "O Bigode Nervoso",
    personalityId: "reckless",
    role: "opponent",
    playStyle: "Explosivo, impulsivo, sobe aposta no susto",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: maneBanguelaAsset,
    story:
      "Reza a lenda que ele ja ficou tao bravo com um parceiro ruim que ganhou a mao so no odio. No bairro, contam que o bigode dele se move um milimetro para cima sempre que alguem esta prestes a cometer uma burrice historica.",
  },
  {
    id: "joca-busao",
    name: "Joca do Busão",
    nickname: "O Nariz da Vitoria",
    personalityId: "ultra_conservative",
    role: "npc",
    playStyle: "Travado, economico, so entra com mao muito boa",
    attributes: {
      courage: 1,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: jocaBusaoAsset,
    story:
      "Dizem que ele aprendeu a jogar truco com um papagaio aposentado de feira. O papagaio morreu invicto, e desde entao Joca jura ouvir dicas taticas vindas do cinzeiro.",
  },
  {
    id: "rita-gambiarra",
    name: "Rita Gambiarra",
    nickname: "A Remendada Fatal",
    personalityId: "trickster",
    role: "npc",
    playStyle: "Criativa, torta, vive de blefe e improviso",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 5,
    },
    avatarAsset: ritaGambiarraAsset,
    story:
      "Ela foi banida de tres bares depois de ganhar uma partida usando apenas expressoes faciais e um guardanapo dobrado em formato de ameaca. Ate hoje ninguem sabe se ela blefa ou preve o futuro.",
  },
  {
    id: "tonhao-rasga-lata",
    name: "Tonhao Rasga-Lata",
    nickname: "O Arranca Tampa",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Barulhento, atacante, pressiona a mesa cedo",
    attributes: {
      courage: 5,
      patience: 2,
      bluff: 3,
    },
    avatarAsset: tonhaoRasgaLataAsset,
    story:
      "Ele afirma que ja ficou 11 dias seguidos na mesma mesa esperando 'a mao certa'. Quando finalmente jogou, pediu truco antes mesmo de receber as cartas.",
  },
  {
    id: "cida-fumaca",
    name: "Cida Fumaca",
    nickname: "A Neblina",
    personalityId: "balanced",
    role: "npc",
    playStyle: "Solta, carismatica, alterna calma e ousadia",
    attributes: {
      courage: 3,
      patience: 3,
      bluff: 3,
    },
    avatarAsset: cidaFumacaAsset,
    story:
      "Reza a lenda que ela certa vez venceu um campeonato inteiro enquanto discutia preco de sabao em po no celular. No trofeu mandou gravar: 'joguei mal e ainda assim ganhei'.",
  },
  {
    id: "dito-marrua",
    name: "Dito Marrua",
    nickname: "O Touro de Mesa",
    personalityId: "reckless",
    role: "npc",
    playStyle: "Ameacador, seco, atropela o ritmo da rodada",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: ditoMarruaAsset,
    story:
      "Ele aparece calado, senta, pede cafe frio e encara a parede por sete minutos. Quando finalmente olha para a mesa, sempre tem alguem correndo do truco sem saber por que.",
  },
  {
    id: "patricia-monique",
    name: "Patricia Monique",
    nickname: "A Auto-Bela",
    personalityId: "trickster",
    role: "npc",
    playStyle: "Explosiva, impulsiva, blefa facil",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: patriciaMoniqueAsset,
    story:
      "Frequenta mesa de truco como se estivesse entrando num ensaio fotografico clandestino em pleno boteco. Diz que ja ganhou um seis porque o adversario ficou nervoso tentando entender se estava sendo blefado ou avaliado esteticamente.",
  },
  {
    id: "naldo-tramela",
    name: "Naldo Tramela",
    nickname: "O Fecha Porta",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Convicto, encrenqueiro, acelera qualquer sequencia",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 3,
    },
    avatarAsset: naldoTramelaAsset,
    story:
      "Ele ficou famoso no bairro por pedir truco com tanta conviccao que uma vez o garcom largou a bandeja e correu. Desde entao, joga com a autoestima de quem ja assustou inocentes por acidente.",
  },
  {
    id: "dalva-seringa",
    name: "Dalva Seringa",
    nickname: "A Herdeira do Truco",
    personalityId: "conservative",
    role: "npc",
    playStyle: "Tradicional, fria, prefere o seguro ao brilhante",
    attributes: {
      courage: 2,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: dalvaSeringaAsset,
    story:
      "Ela afirma ser descendente de uma linhagem sagrada de jogadores que resolviam conflito familiar no truco e heranca no par ou impar. Ninguem acredita, mas ninguem ousa rir na frente dela.",
  },
  {
    id: "biu-caolho",
    name: "Biu Caolho",
    nickname: "O Fiscal",
    personalityId: "reckless",
    role: "npc",
    playStyle: "Rabugento, agressivo, aposta no grito e na marra",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 3,
    },
    avatarAsset: biuCaolhoAsset,
    story:
      "Depois de se aposentar, ele transformou a mesa do bar na sua nova reparticao publica. Chega cedo, reclama de tudo, carimba o baralho com o olhar e trata cada truco como processo disciplinar.",
  },
  {
    id: "aninha-passarela",
    name: "Aninha Passarela",
    nickname: "A Desfilante",
    personalityId: "balanced",
    role: "npc",
    playStyle: "Elegante, segura, joga no tempo da propria pose",
    attributes: {
      courage: 3,
      patience: 4,
      bluff: 3,
    },
    avatarAsset: aninhaPassarelaAsset,
    story:
      "Jura que aprendeu a contar carta observando desfile de loja de bairro em piso encerado. Ate hoje entra na mesa como se estivesse cruzando uma passarela invisivel e, por algum motivo, isso sempre faz alguem jogar pior.",
  },
  {
    id: "celsinho-breque",
    name: "Celsinho Breque",
    nickname: "O Freio de Mao",
    personalityId: "conservative",
    role: "npc",
    playStyle: "Metodico, prudente, corta excesso de euforia",
    attributes: {
      courage: 2,
      patience: 4,
      bluff: 2,
    },
    avatarAsset: celsinhoBrequeAsset,
    story:
      "Ele trabalha o dia inteiro e joga como quem faz auditoria moral da mesa. Ja chamou de 'erro estrategico grave' um sujeito que descartou um sete com tranquilidade demais.",
  },
  {
    id: "quiteria-mao-torta",
    name: "Quiteria Mao-Torta",
    nickname: "A Dossiê",
    personalityId: "trickster",
    role: "npc",
    playStyle: "Sinuosa, venenosa, blefa com informacao e teatrinho",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 5,
    },
    avatarAsset: quiteriaMaoTortaAsset,
    story:
      "Ela conhece a vida de todo mundo no bairro, inclusive de gente que ainda nem se mudou para la. Quando pede truco, o problema nao e a carta: e o tanto de informacao comprometedora que pode acompanhar o lance.",
  },
  {
    id: "norberto-fuba",
    name: "Norberto Fuba",
    nickname: "O Fantasma do Bairro",
    personalityId: "ultra_conservative",
    role: "npc",
    playStyle: "Sumido, silencioso, entra pouco e pune muito",
    attributes: {
      courage: 2,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: norbertoFubaAsset,
    story:
      "Ele apareceu do nada, ganhou quatro mesas seguidas e foi embora sem dizer de onde veio. Ha quem diga que ele nem mora no bairro, so surge quando detecta arrogancia no ambiente.",
  },
  {
    id: "rosinha-catraca",
    name: "Rosinha Catraca",
    nickname: "A Canceladora",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Mandona, dura, sobe aposta para tomar controle",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 3,
    },
    avatarAsset: rosinhaCatracaAsset,
    story:
      "Ela parece uma senhora tranquila ate alguem embaralhar errado. Nessa hora, assume a postura de juiza suprema do boteco e comeca a aplicar pena moral em todo mundo da mesa.",
  },
  {
    id: "damiao-corote",
    name: "Damiao Corote",
    nickname: "O Relicario",
    personalityId: "reckless",
    role: "npc",
    playStyle: "Caotico, nostalgico, joga no impulso e na lenda",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: damiaoCoroteAsset,
    story:
      "Ele passou tantos anos jogando truco que ja confunde lembranca real com partida antiga. Toda semana conta que ganhou um doze valendo uma geladeira e ninguem tem coragem de contestar.",
  },
  {
    id: "leninha-lambreta",
    name: "Leninha Lambreta",
    nickname: "A Pilota Dupla",
    personalityId: "balanced",
    role: "npc",
    playStyle: "Parceira, viva, empurra a dupla sem perder a cabeca",
    attributes: {
      courage: 3,
      patience: 3,
      bluff: 3,
    },
    avatarAsset: leninhaLambretaAsset,
    story:
      "Ela diz que joga 'na amizade', mas a amizade dela inclui pressionar a propria dupla ate ela transcender. Ja levou tres parceiros ao desespero e cinco a gloria.",
  },
  {
    id: "jura-pancada",
    name: "Jura Pancada",
    nickname: "O Estouro",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Rasga turno, nao pensa duas vezes, pressiona seco",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 3,
    },
    avatarAsset: juraPancadaAsset,
    story:
      "Ele nao tem paciencia nem para o proprio pensamento, entao imagina para o erro dos outros. Uma vez pediu truco tao rapido que o parceiro ainda estava sentando e o adversario ja estava ofendido.",
  },
  {
    id: "marlene-pimenta",
    name: "Marlene Pimenta",
    nickname: "A Cochichada",
    personalityId: "conservative",
    role: "npc",
    playStyle: "Precisa, venenosa, prefere minar em vez de explodir",
    attributes: {
      courage: 2,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: marlenePimentaAsset,
    story:
      "Ela fala baixo, mas sempre no momento exato em que alguem esta prestes a errar feio. Por isso no bairro existe a expressao 'se Marlene cochichou, ja era'.",
  },
  {
    id: "zito-parafuso",
    name: "Zito Parafuso",
    nickname: "O Troca-Tudo",
    personalityId: "trickster",
    role: "npc",
    playStyle: "Maluco, falante, blefador profissional de esquina",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 5,
    },
    avatarAsset: zitoParafusoAsset,
    story:
      "Ele ja trocou uma bicicleta, um radio e um ventilador de teto por informacao de mesa. Ninguem sabe de onde ele tira tanta historia, mas metade deve ser mentira e a outra metade e pior.",
  },
  {
    id: "creusa-rabugenta",
    name: "Creusa Rabugenta",
    nickname: "A Ultima Prudencia",
    personalityId: "ultra_conservative",
    role: "npc",
    playStyle: "Seca, economica, so vai quando a mesa ja esta perdida para os outros",
    attributes: {
      courage: 1,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: creusaRabugentaAsset,
    story:
      "Ela jamais corre de um insulto, mas corre de aposta ruim com a serenidade de quem ja viu quinze gerações perderem por afobacao. Diz que prudencia e a unica fofoca que nunca envelhece.",
  },
  {
    id: "ivone-verniz",
    name: "Ivone Verniz",
    nickname: "A Dama do Verniz",
    personalityId: "disciplined",
    role: "npc",
    playStyle: "Elegante, firme, nao se deixa empurrar pela mesa",
    attributes: {
      courage: 3,
      patience: 4,
      bluff: 3,
    },
    avatarAsset: ivoneVernizAsset,
    story:
      "Ivone chega arrumada ate em mesa de plastico e trata provocacao como poeira no ombro. Dizem que ela nunca levanta a voz porque prefere deixar o adversario perceber sozinho que perdeu o controle.",
  },
  {
    id: "osmar-alfinete",
    name: "Osmar Alfinete",
    nickname: "O Corte Seco",
    personalityId: "assertive",
    role: "npc",
    playStyle: "Preciso, severo, desmonta erro sem desperdiçar fala",
    attributes: {
      courage: 4,
      patience: 3,
      bluff: 2,
    },
    avatarAsset: osmarAlfineteAsset,
    story:
      "Osmar ganhou o apelido porque cada comentario dele parece espetar exatamente onde doi. Ele nao discute por muito tempo: espera a brecha, joga a carta e deixa o silencio terminar o servico.",
  },
  {
    id: "geraldo-medalha",
    name: "Geraldo Medalha",
    nickname: "O Veterano",
    personalityId: "disciplined",
    role: "npc",
    playStyle: "Tradicional, paciente, quase nunca entrega o ritmo",
    attributes: {
      courage: 3,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: geraldoMedalhaAsset,
    story:
      "Geraldo garante que ja jogou final em ginasio com goteira, narrador rouco e luz caindo. Ninguem sabe quantas historias sao verdade, mas todo mundo respeita quando ele encosta na cadeira e começa a contar carta.",
  },
  {
    id: "sueli-estopim",
    name: "Sueli Estopim",
    nickname: "A Faisca",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Eletrica, provocadora, transforma mao morna em pressao",
    attributes: {
      courage: 5,
      patience: 2,
      bluff: 3,
    },
    avatarAsset: sueliEstopimAsset,
    story:
      "Sueli aprendeu cedo que a plateia gosta de barulho e usa isso como ferramenta. Quando percebe hesitacao do outro lado, acelera tanto a mesa que ate o parceiro precisa respirar fundo para acompanhar.",
  },
  {
    id: "ramiro-bolero",
    name: "Ramiro Bolero",
    nickname: "El Sereno",
    personalityId: "crafty",
    role: "npc",
    playStyle: "Calmo, charmoso, blefa sem alterar o pulso",
    attributes: {
      courage: 3,
      patience: 5,
      bluff: 4,
    },
    avatarAsset: ramiroBoleroAsset,
    story:
      "Ramiro conversa como se a partida fosse apenas mais uma noite tranquila. O perigo e que ele mantém o mesmo sorriso com carta boa, carta ruim e truco pedido no momento exato.",
  },
  {
    id: "luna-candela",
    name: "Luna Candela",
    nickname: "La Chispa",
    personalityId: "opportunistic",
    role: "npc",
    playStyle: "Rapida, ousada, muda o ritmo quando encontra abertura",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 4,
    },
    avatarAsset: lunaCandelaAsset,
    story:
      "Luna entra na mesa como quem ja ouviu a musica antes de todo mundo. Ela adora uma janela curta para pressionar e costuma sorrir justamente quando o adversario percebe que demorou demais para reagir.",
  },
  {
    id: "mina-compasso",
    name: "Mina Compasso",
    nickname: "A Cirurgica",
    personalityId: "disciplined",
    role: "npc",
    playStyle: "Analitica, exata, pune cada desperdicio de carta",
    attributes: {
      courage: 3,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: minaCompassoAsset,
    story:
      "Mina observa a mesa com a calma de quem mede distancia antes de cada passo. Dizem que ela lembra de descarte antigo melhor que o proprio jogador que colocou a carta na mesa.",
  },
  {
    id: "viktor-muralha",
    name: "Viktor Muralha",
    nickname: "O Imovel",
    personalityId: "conservative",
    role: "npc",
    playStyle: "Solido, intimidador, dificil de arrancar do plano",
    attributes: {
      courage: 4,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: viktorMuralhaAsset,
    story:
      "Viktor fala pouco e ocupa a cadeira como se tivesse sido construida ao redor dele. A mesa inteira sabe que empurrar aposta contra sua paciencia costuma terminar em arrependimento.",
  },
  {
    id: "madame-violeta",
    name: "Madame Violeta",
    nickname: "A Leitura Fria",
    personalityId: "ultra_conservative",
    role: "npc",
    playStyle: "Refinada, gelada, entra apenas quando a conta fecha",
    attributes: {
      courage: 2,
      patience: 5,
      bluff: 3,
    },
    avatarAsset: madameVioletaAsset,
    story:
      "Madame Violeta trata cada lance como uma informacao valiosa demais para ser desperdicada. Ela espera, observa e faz a mesa parecer silenciosa mesmo quando o cassino inteiro esta acordado.",
  },
  {
    id: "augusto-crupie",
    name: "Augusto Crupie",
    nickname: "O Ultimo Lance",
    personalityId: "crafty",
    role: "npc",
    playStyle: "Experiente, frio, esconde a pressao atras de boas maneiras",
    attributes: {
      courage: 4,
      patience: 4,
      bluff: 4,
    },
    avatarAsset: augustoCrupieAsset,
    story:
      "Augusto parece educado demais para uma mesa decisiva, e talvez esse seja o truque. Ele oferece um aceno discreto antes de cada partida e guarda a crueldade para o instante em que a aposta ja nao tem volta.",
  },
  {
    id: "cosme-orbita",
    name: "Cosme Orbita",
    nickname: "O Sem Gravidade",
    personalityId: "volatile",
    role: "npc",
    playStyle: "Imprevisivel, acelerado, joga como se a mesa flutuasse",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 5,
    },
    avatarAsset: cosmeOrbitaAsset,
    story:
      "Cosme afirma que aprendeu truco durante uma pane de energia que durou pouco demais para ser comprovada. Desde entao, muda de ideia no meio da frase e considera isso uma qualidade estrategica.",
  },
]

export const TRUCO_CHARACTER_BY_ID: Record<TrucoCharacterId, TrucoCharacterProfile> =
  Object.fromEntries(
    TRUCO_CHARACTER_ROSTER.map((character) => [character.id, character])
  ) as Record<TrucoCharacterId, TrucoCharacterProfile>
