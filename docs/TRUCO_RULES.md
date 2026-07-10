# Truco Rules

## Terminologia do Projeto

- `Rodada`: o ciclo completo antes de começar a próxima distribuição.
- `Mão`: as disputas internas da rodada.
- `Vaza`: resolução parcial dentro da rodada.

Observação:
- Houve confusão histórica entre `mão`, `rodada` e `vaza`.
- Este arquivo deve ser a referência oficial de nomenclatura.

## Regras de Falas

### Pedidos e aumentos

- `TRUCO!`, `SEIS!`, `NOVE!`, `DOZE!`
  - fala quem está propondo aquele valor.

### Aceite

- `DESCE!`
  - é falado por quem aceita a aposta atual sem ter sido quem iniciou a escalada vigente.

- `TOMA!`
  - é falado por quem iniciou a escalada vigente e depois aceita um aumento dentro dessa mesma escalada.
  - quem iniciou a escalada vigente nunca fala `DESCE!`.

### Corrida

- `TÔ FORA!`
  - é falado por quem correu.

## Regras de Ouro

### Regra de ouro 1

- quem iniciou a escalada vigente nunca fala `DESCE!`

### Regra de ouro 2

- quem iniciou a escalada vigente fala `TOMA!` quando aceita um aumento dentro dessa mesma escalada

### Regra de ouro 3

- quando a jogada de cartas retoma, a escalada vigente e resetada
- se houver um novo `TRUCO!` ou novo aumento depois disso, nasce uma nova escalada com novo iniciador

## Regras do Ping-pong do Truco

- No fluxo de `truco + raise`, só falam os dois jogadores envolvidos no lance formal.
- Parceiro pode aconselhar, mas não entra no ping-pong principal de `DESCE!/TOMA!/SEIS!/NOVE!/DOZE!`.
- o dono da fala `DESCE!/TOMA!` depende de quem iniciou a escalada vigente, nao apenas de quem abriu o `TRUCO!` original da mao inteira.

## Decisão em Dupla

### Conselho da parceira para o humano

Quando o nosso time recebe um `pedido inicial` do adversário e o humano é o alvo:

- `BORA!`
- `CÊ QUE SABE!`
- `MELHOR CORRER!`

### Consulta da parceira ao humano

Quando a parceira IA é o alvo de um `pedido inicial` adversário:

- ela pode consultar o humano
- o humano responde com:
  - `BORA!`
  - `CÊ QUE SABE!`
  - `MELHOR CORRER!`

### Limite de conselho

- no máximo `1 conselho da parceira` por sequência de `truco + raises`

### Autonomia do humano

- o humano pode ignorar o conselho da parceira

## Regras de Escalada

- a escalada vai até `12`
- o fluxo aceito hoje é:
  - truco
  - seis
  - nove
  - doze

### Escalada vigente

- a escalada vigente começa quando alguem propoe o valor atual da sequencia (`TRUCO!`, `SEIS!`, `NOVE!`, `DOZE!`)
- enquanto a sequencia formal ainda nao voltou para a jogada normal de cartas, esse iniciador continua sendo o dono da escalada vigente
- se esse mesmo lado aceitar um aumento posterior dentro dessa mesma sequencia, a fala correta e `TOMA!`
- o outro lado, quando aceita sem ser o iniciador da escalada vigente, fala `DESCE!`

## Lógica de Força Atual da IA

Hoje a força da mão é calculada assim:

- manilha = `3`
- `3` = `2`
- `2` = `2`
- `A` = `1`
- `K` = `1`

## Cortes Atuais do Perfil `balanced`

Pedido ou aumento, por valor atual da rodada:

- valendo `1`, pedir `TRUCO!` -> corte `3`
- valendo `3`, pedir `SEIS!` -> corte `4`
- valendo `6`, pedir `NOVE!` -> corte `4`
- valendo `9`, pedir `DOZE!` -> corte `5`

Aceite, por valor proposto:

- truco (`3`) -> corte `2`
- seis (`6`) -> corte `3`
- nove (`9`) -> corte `4`
- doze (`12`) -> corte `5`

Observacao:

- perfis agressivos, malandros e imprevisiveis possuem cortes proprios
- blefes continuam existindo, mas com probabilidades menores e margem controlada
- dificuldade alta com disciplina alta passa a usar perfil `trickster`, nao `reckless`

## Observação Importante

- A primeira rodada de rebalanceamento reduziu a tendencia da IA de `trucar com pouco`.
- O perfil `balanced` agora exige mao mais firme para pedir, aceitar e contra-aumentar.
- Quando nao consegue ganhar uma vaza, a IA descarta a menor carta disponivel em vez de queimar carta alta.
- Quando consegue ganhar a vaza, a IA usa a menor carta vencedora.
- Este arquivo registra a logica atual apos essa primeira rodada, nao um equilibrio final definitivo.
- Qualquer ajuste em thresholds, blefes, aceite, corrida ou raise deve ser acompanhado por testes.

## Variantes Por Bar

- A campanha declara bares de `Truco Mineiro` e `Truco Paulista`.
- A criacao de partida agora usa a variante declarada pelo bar.
- A proxima mao de uma partida preserva a variante da propria partida.
- Existem testes unitarios cobrindo criacao de partida por local Mineiro/Paulista e proxima mao Paulista mantendo vira.
- `Jogos Mundiais` e `Mundial` usam `Truco Mineiro`.
- O log de inicio de mao registra a regra ativa; em Paulista, registra tambem vira e manilha.
- Se a implementacao visual da vira/manilha do Paulista for alterada, validar novamente no fluxo real e em testes.

## Pendencias de Regras para Implementar

As regras abaixo foram confirmadas como desejadas, mas ainda nao devem ser tratadas como implementadas:

### Mao de nove / mao de dez pontos

- a documentacao historica registra esta regra como `mao de nove`, com gatilho em `9 pontos`
- em conversa posterior, a pendencia foi citada como "ver cartas na mao de dez pontos"
- antes de implementar, confirmar a nomenclatura e o gatilho desejado: manter `9 pontos`, trocar para `10 pontos`, ou oferecer isso como variante configuravel
- a partir da rodada especial confirmada, os dois parceiros dessa dupla podem ver as cartas um do outro
- depois de ver as cartas, essa dupla pode optar por nao jogar a rodada
- se a dupla optar por nao jogar, a dupla adversaria recebe `1 ponto`
- se a dupla optar por jogar e perder, a dupla adversaria recebe `3 pontos`
- a interface precisa deixar claro quando uma dupla esta nessa mao especial e, por isso, nao pode pedir truco/aumentar como numa mao comum
- a indicacao visual deve explicar o bloqueio do botao de aumento para evitar parecer erro de input do jogador

### Ponto acima

- existe uma decisao de produto pendente para permitir escolher se a partida usa ou nao a versao `ponto acima`
- antes de implementar, definir onde essa escolha vive:
  - configuracao global antes da campanha
  - configuracao por bar/circuito
  - opcao avancada fora da primeira tela visivel
- a escolha precisa ser persistida e refletida claramente na tela de campanha ou na entrada da partida

### Carta virada para baixo

- uma rodada continua composta por ate `3 vazas`
- na primeira vaza, todas as cartas continuam abertas
- na segunda e na terceira vaza da rodada, qualquer jogador pode jogar uma carta virada para baixo
- a carta virada para baixo tambem pode ser chamada de `carta coberta`
- a carta coberta nao disputa a vaza e deve funcionar como descarte sem forca, equivalente a uma carta sem valor para vencer
- a identidade real da carta coberta nao deve ser revelada nem aos adversarios nem ao parceiro durante a partida
- a mesa e os logs devem registrar que uma carta coberta foi jogada, mas nao revelar a carta real
- a IA deve considerar carta coberta como opcao quando quiser descartar sem disputar a vaza
- a implementacao precisa ser coberta por testes antes de alterar a UI

## Nota de Continuidade

- O ajuste recente do scorepad e a tela autoral de campanha nao mudam regras de truco.
- A tela de resultado deve aparecer apenas depois da ultima carta da vaza decisiva estar visivel na mesa.
- Depois disso, esperar 1 segundo antes de exibir a arte de vitoria ou derrota.
- Se a mao termina por corrida em pedido de truco, nao gerar cartas artificiais para completar a mesa.
- Se qualquer refinamento visual tocar fluxo de botoes, falas ou estados de truco, validar novamente as regras deste arquivo e rodar testes antes de concluir.
