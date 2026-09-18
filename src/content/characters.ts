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
    name: "Zeca Viramão",
    nickname: "O Mão Leve",
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
      "Ninguém sabe como, mas Zeca já ganhou uma partida com tanta calma que o adversário pediu desculpa por ter sentado na mesa. Desde então corre o boato de que, quando ele vem com carta ruim, é justamente quando está mais perigoso.",
  },
  {
    id: "nega-catimbo",
    name: "Nega Catimbó",
    nickname: "A Que Sente a Mesa",
    personalityId: "conservative",
    role: "partner",
    playStyle: "Calculista, fiel ao jogo, difícil de emocionar",
    attributes: {
      courage: 3,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: negaCatimboAsset,
    story:
      "Ela já expulsou um blefador da mesa usando só um 'aham' tão carregado de desprezo que o sujeito foi embora repensar a própria infância. Dizem que ela descobre a força da mão alheia pelo jeito que a pessoa segura o copo.",
  },
  {
    id: "tiao-casca-grossa",
    name: "Tião Casca Grossa",
    nickname: "O Sobrancelha de Aço",
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
      "Ele fala pouco porque afirma que desperdiçar palavra enfraquece o truco. Certa vez passou três horas em silêncio, pediu doze com uma sobrancelha e saiu com dinheiro, amendoim e respeito involuntário de todo o bairro.",
  },
  {
    id: "mane-banguela",
    name: "Mané Banguela",
    nickname: "O Sorriso Lunar",
    personalityId: "reckless",
    role: "opponent",
    playStyle: "Espalhafatoso, provocador, sobe aposta sorrindo",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: maneBanguelaAsset,
    story:
      "Mané jura que blefe em gravidade baixa dura mais tempo no ar. Ri antes de pedir truco, ri quando corre e ri mais ainda quando alguém acredita que ele está distraído.",
  },
  {
    id: "joca-busao",
    name: "Joca do Busão",
    nickname: "O Nariz da Vitória",
    personalityId: "ultra_conservative",
    role: "npc",
    playStyle: "Travado, econômico, só entra com mão muito boa",
    attributes: {
      courage: 1,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: jocaBusaoAsset,
    story:
      "Dizem que ele aprendeu a jogar truco com um papagaio aposentado de feira. O papagaio morreu invicto, e desde então Joca jura ouvir dicas táticas vindas do cinzeiro.",
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
      "Ela foi banida de três bares depois de ganhar uma partida usando apenas expressões faciais e um guardanapo dobrado em formato de ameaça. Até hoje ninguém sabe se ela blefa ou prevê o futuro.",
  },
  {
    id: "tonhao-rasga-lata",
    name: "Tonhão Rasga-Lata",
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
      "Ele afirma que já ficou 11 dias seguidos na mesma mesa esperando 'a mão certa'. Quando finalmente jogou, pediu truco antes mesmo de receber as cartas.",
  },
  {
    id: "cida-fumaca",
    name: "Cida Fumaça",
    nickname: "A Neblina",
    personalityId: "balanced",
    role: "npc",
    playStyle: "Solta, carismática, alterna calma e ousadia",
    attributes: {
      courage: 3,
      patience: 3,
      bluff: 3,
    },
    avatarAsset: cidaFumacaAsset,
    story:
      "Reza a lenda que ela certa vez venceu um campeonato inteiro enquanto discutia preço de sabão em pó no celular. No troféu mandou gravar: 'joguei mal e ainda assim ganhei'.",
  },
  {
    id: "dito-marrua",
    name: "Dito Marruá",
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
      "Ele aparece calado, senta, pede café frio e encara a parede por sete minutos. Quando finalmente olha para a mesa, sempre tem alguém correndo do truco sem saber por quê.",
  },
  {
    id: "patricia-monique",
    name: "Patrícia Monique",
    nickname: "A Auto-Bela",
    personalityId: "trickster",
    role: "npc",
    playStyle: "Explosiva, impulsiva, blefa fácil",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: patriciaMoniqueAsset,
    story:
      "Frequenta mesa de truco como se estivesse entrando num ensaio fotográfico clandestino em pleno boteco. Diz que já ganhou um seis porque o adversário ficou nervoso tentando entender se estava sendo blefado ou avaliado esteticamente.",
  },
  {
    id: "naldo-tramela",
    name: "Naldo Tramela",
    nickname: "O Fecha Porta",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Convicto, encrenqueiro, acelera qualquer sequência",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 3,
    },
    avatarAsset: naldoTramelaAsset,
    story:
      "Ele ficou famoso no bairro por pedir truco com tanta convicção que uma vez o garçom largou a bandeja e correu. Desde então, joga com a autoestima de quem já assustou inocentes por acidente.",
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
      "Ela afirma ser descendente de uma linhagem sagrada de jogadores que resolviam conflito familiar no truco e herança no par ou ímpar. Ninguém acredita, mas ninguém ousa rir na frente dela.",
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
      "Depois de se aposentar, ele transformou a mesa do bar na sua nova repartição pública. Chega cedo, reclama de tudo, carimba o baralho com o olhar e trata cada truco como processo disciplinar.",
  },
  {
    id: "aninha-passarela",
    name: "Aninha Passarela",
    nickname: "A Desfilante",
    personalityId: "balanced",
    role: "npc",
    playStyle: "Elegante, segura, joga no tempo da própria pose",
    attributes: {
      courage: 3,
      patience: 4,
      bluff: 3,
    },
    avatarAsset: aninhaPassarelaAsset,
    story:
      "Jura que aprendeu a contar carta observando desfile de loja de bairro em piso encerado. Até hoje entra na mesa como se estivesse cruzando uma passarela invisível e, por algum motivo, isso sempre faz alguém jogar pior.",
  },
  {
    id: "celsinho-breque",
    name: "Celsinho Breque",
    nickname: "O Freio de Mão",
    personalityId: "conservative",
    role: "npc",
    playStyle: "Metódico, prudente, corta excesso de euforia",
    attributes: {
      courage: 2,
      patience: 4,
      bluff: 2,
    },
    avatarAsset: celsinhoBrequeAsset,
    story:
      "Ele trabalha o dia inteiro e joga como quem faz auditoria moral da mesa. Já chamou de 'erro estratégico grave' um sujeito que descartou um sete com tranquilidade demais.",
  },
  {
    id: "quiteria-mao-torta",
    name: "Quitéria Mão-Torta",
    nickname: "A Dossiê",
    personalityId: "trickster",
    role: "npc",
    playStyle: "Sinuosa, venenosa, blefa com informação e teatrinho",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 5,
    },
    avatarAsset: quiteriaMaoTortaAsset,
    story:
      "Ela conhece a vida de todo mundo no bairro, inclusive de gente que ainda nem se mudou para lá. Quando pede truco, o problema não é a carta: é o tanto de informação comprometedora que pode acompanhar o lance.",
  },
  {
    id: "norberto-fuba",
    name: "Norberto Fubá",
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
      "Ele apareceu do nada, ganhou quatro mesas seguidas e foi embora sem dizer de onde veio. Há quem diga que ele nem mora no bairro, só surge quando detecta arrogância no ambiente.",
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
      "Ela parece uma senhora tranquila até alguém embaralhar errado. Nessa hora, assume a postura de juíza suprema do boteco e começa a aplicar pena moral em todo mundo da mesa.",
  },
  {
    id: "damiao-corote",
    name: "Damião Corote",
    nickname: "O Relicário",
    personalityId: "reckless",
    role: "npc",
    playStyle: "Caótico, nostálgico, joga no impulso e na lenda",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 4,
    },
    avatarAsset: damiaoCoroteAsset,
    story:
      "Ele passou tantos anos jogando truco que já confunde lembrança real com partida antiga. Toda semana conta que ganhou um doze valendo uma geladeira e ninguém tem coragem de contestar.",
  },
  {
    id: "leninha-lambreta",
    name: "Leninha Lambreta",
    nickname: "A Pilota Dupla",
    personalityId: "balanced",
    role: "npc",
    playStyle: "Parceira, viva, empurra a dupla sem perder a cabeça",
    attributes: {
      courage: 3,
      patience: 3,
      bluff: 3,
    },
    avatarAsset: leninhaLambretaAsset,
    story:
      "Ela diz que joga 'na amizade', mas a amizade dela inclui pressionar a própria dupla até ela transcender. Já levou três parceiros ao desespero e cinco à glória.",
  },
  {
    id: "jura-pancada",
    name: "Jura Pancada",
    nickname: "O Estouro",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Rasga turno, não pensa duas vezes, pressiona seco",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 3,
    },
    avatarAsset: juraPancadaAsset,
    story:
      "Ele não tem paciência nem para o próprio pensamento, então imagina para o erro dos outros. Uma vez pediu truco tão rápido que o parceiro ainda estava sentando e o adversário já estava ofendido.",
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
      "Ela fala baixo, mas sempre no momento exato em que alguém está prestes a errar feio. Por isso no bairro existe a expressão 'se Marlene cochichou, já era'.",
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
      "Ele já trocou uma bicicleta, um rádio e um ventilador de teto por informação de mesa. Ninguém sabe de onde ele tira tanta história, mas metade deve ser mentira e a outra metade é pior.",
  },
  {
    id: "creusa-rabugenta",
    name: "Creusa Rabugenta",
    nickname: "A Última Prudência",
    personalityId: "ultra_conservative",
    role: "npc",
    playStyle: "Seca, econômica, só vai quando a mesa já está perdida para os outros",
    attributes: {
      courage: 1,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: creusaRabugentaAsset,
    story:
      "Ela jamais corre de um insulto, mas corre de aposta ruim com a serenidade de quem já viu quinze gerações perderem por afobação. Diz que prudência é a única fofoca que nunca envelhece.",
  },
  {
    id: "ivone-verniz",
    name: "Ivone Verniz",
    nickname: "A Dama do Verniz",
    personalityId: "disciplined",
    role: "npc",
    playStyle: "Elegante, firme, não se deixa empurrar pela mesa",
    attributes: {
      courage: 3,
      patience: 4,
      bluff: 3,
    },
    avatarAsset: ivoneVernizAsset,
    story:
      "Ivone chega arrumada até em mesa de plástico e trata provocação como poeira no ombro. Dizem que ela nunca levanta a voz porque prefere deixar o adversário perceber sozinho que perdeu o controle.",
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
      "Osmar ganhou o apelido porque cada comentário dele parece espetar exatamente onde dói. Ele não discute por muito tempo: espera a brecha, joga a carta e deixa o silêncio terminar o serviço.",
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
      "Geraldo garante que já jogou final em ginásio com goteira, narrador rouco e luz caindo. Ninguém sabe quantas histórias são verdade, mas todo mundo respeita quando ele encosta na cadeira e começa a contar carta.",
  },
  {
    id: "sueli-estopim",
    name: "Sueli Estopim",
    nickname: "A Faísca",
    personalityId: "aggressive",
    role: "npc",
    playStyle: "Elétrica, provocadora, transforma mão morna em pressão",
    attributes: {
      courage: 5,
      patience: 2,
      bluff: 3,
    },
    avatarAsset: sueliEstopimAsset,
    story:
      "Sueli aprendeu cedo que a plateia gosta de barulho e usa isso como ferramenta. Quando percebe hesitação do outro lado, acelera tanto a mesa que até o parceiro precisa respirar fundo para acompanhar.",
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
      "Ramiro conversa como se a partida fosse apenas mais uma noite tranquila. O perigo é que ele mantém o mesmo sorriso com carta boa, carta ruim e truco pedido no momento exato.",
  },
  {
    id: "luna-candela",
    name: "Luna Candela",
    nickname: "La Chispa",
    personalityId: "opportunistic",
    role: "npc",
    playStyle: "Rápida, ousada, muda o ritmo quando encontra abertura",
    attributes: {
      courage: 4,
      patience: 2,
      bluff: 4,
    },
    avatarAsset: lunaCandelaAsset,
    story:
      "Luna entra na mesa como quem já ouviu a música antes de todo mundo. Ela adora uma janela curta para pressionar e costuma sorrir justamente quando o adversário percebe que demorou demais para reagir.",
  },
  {
    id: "mina-compasso",
    name: "Mina Compasso",
    nickname: "A Cirúrgica",
    personalityId: "disciplined",
    role: "npc",
    playStyle: "Analítica, exata, pune cada desperdício de carta",
    attributes: {
      courage: 3,
      patience: 5,
      bluff: 2,
    },
    avatarAsset: minaCompassoAsset,
    story:
      "Mina observa a mesa com a calma de quem mede distância antes de cada passo. Dizem que ela lembra de descarte antigo melhor que o próprio jogador que colocou a carta na mesa.",
  },
  {
    id: "viktor-muralha",
    name: "Viktor Muralha",
    nickname: "O Imóvel",
    personalityId: "conservative",
    role: "npc",
    playStyle: "Sólido, intimidador, difícil de arrancar do plano",
    attributes: {
      courage: 4,
      patience: 5,
      bluff: 1,
    },
    avatarAsset: viktorMuralhaAsset,
    story:
      "Viktor fala pouco e ocupa a cadeira como se tivesse sido construída ao redor dele. A mesa inteira sabe que empurrar aposta contra sua paciência costuma terminar em arrependimento.",
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
      "Madame Violeta trata cada lance como uma informação valiosa demais para ser desperdiçada. Ela espera, observa e faz a mesa parecer silenciosa mesmo quando o Cassino Mé Maior inteiro está acordado.",
  },
  {
    id: "augusto-crupie",
    name: "Augusto Crupiê",
    nickname: "O Último Lance",
    personalityId: "crafty",
    role: "npc",
    playStyle: "Experiente, frio, esconde a pressão atrás de boas maneiras",
    attributes: {
      courage: 4,
      patience: 4,
      bluff: 4,
    },
    avatarAsset: augustoCrupieAsset,
    story:
      "Augusto parece educado demais para uma mesa decisiva, e talvez esse seja o truque. Ele oferece um aceno discreto antes de cada partida e guarda a crueldade para o instante em que a aposta já não tem volta.",
  },
  {
    id: "cosme-orbita",
    name: "Cosme Órbita",
    nickname: "O Sem Gravidade",
    personalityId: "volatile",
    role: "npc",
    playStyle: "Imprevisível, acelerado, comenta a própria malícia",
    attributes: {
      courage: 5,
      patience: 1,
      bluff: 5,
    },
    avatarAsset: cosmeOrbitaAsset,
    story:
      "Cosme opera a transmissão orbital e ainda arruma tempo para confundir a mesa. Muda de ideia no meio da frase, chama isso de estratégia e aumenta a aposta antes do microfone esfriar.",
  },
]

export const TRUCO_CHARACTER_BY_ID: Record<TrucoCharacterId, TrucoCharacterProfile> =
  Object.fromEntries(
    TRUCO_CHARACTER_ROSTER.map((character) => [character.id, character])
  ) as Record<TrucoCharacterId, TrucoCharacterProfile>
