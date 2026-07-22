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
- se o humano responder `BORA!`, a parceira nao pode correr; ela deve aceitar ou aumentar
- se o humano responder `CÊ QUE SABE!` ou `MELHOR CORRER!`, a parceira pode decidir correr conforme a leitura da dupla
- `CÊ QUE SABE!` significa que o humano sinaliza provavelmente uma unica carta util ou mediana, como figura, `A`, `2` ou `3`
- `MELHOR CORRER!` significa que o humano sinaliza nao ter ajuda relevante na mao
- a parceira interpreta esses sinais com um nivel de leitura progressivo:
  - parceiras iniciais usam leitura basica
  - parceiros desbloqueados herdam o nivel de leitura da dificuldade do bar onde foram derrotados
  - parceiras mais avancadas dao mais peso ao sinal `CÊ QUE SABE!`
  - `MELHOR CORRER!` zera a contribuicao da mao do humano na consulta; a parceira so continua por forca propria

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

## Log de Debug da IA de Truco

O fluxo automatico de truco registra linhas `DEBUG IA Truco` quando a IA:

- pede truco/aumento na propria vez
- responde a um pedido adversario com `accept`, `run` ou `raise`

Formato atual:

- pedido: `DEBUG IA Truco: acao pedido, jogador 2, time B, perfil balanced, forcas [7], aposta atual 1, decisao pedir`
- resposta: `DEBUG IA Truco: acao resposta, time B, perfil balanced, forcas [7, 0], aposta proposta 3, decisao raise`

Observacao:

- em pedido, `forcas` mostra a forca da mao do jogador que pediu
- em resposta, `forcas` mostra as forcas dos jogadores do time que responde
- o log foi criado para diagnosticar balanceamento de IA em testes reais; ele nao altera regra, threshold ou resultado da decisao

## Cortes Atuais do Perfil `balanced`

Pedido ou aumento, por valor atual da rodada:

- valendo `1`, pedir `TRUCO!` -> corte `4`
- valendo `3`, pedir `SEIS!` -> corte `5`
- valendo `6`, pedir `NOVE!` -> corte `6`
- valendo `9`, pedir `DOZE!` -> corte `7`

Aceite, por valor proposto:

- truco (`3`) -> corte `2`
- seis (`6`) -> corte `3`
- nove (`9`) -> corte `4`
- doze (`12`) -> corte `5`

Observacao:

- perfis agressivos, malandros e imprevisiveis possuem cortes proprios
- blefes continuam existindo, mas com probabilidades menores e margem controlada
- dificuldade alta com disciplina alta passa a usar perfil `trickster`, nao `reckless`
- adversarios de campanha usam a personalidade derivada da dificuldade do bar, nao a personalidade isolada do primeiro personagem da dupla
- re-aumentos de dupla exigem mao individual muito forte ou soma real da parceria; uma unica mao media nao deve puxar escalada automatica

## Observação Importante

- A primeira rodada de rebalanceamento reduziu a tendencia da IA de `trucar com pouco`.
- A segunda rodada vinculou adversarios a curva de dificuldade dos bares e deixou os re-aumentos mais raros.
- O perfil `balanced` agora exige mao boa para pedir e mao muito forte ou parceria forte para contra-aumentar.
- Quando nao consegue ganhar uma vaza, a IA descarta a menor carta disponivel em vez de queimar carta alta.
- Quando consegue ganhar a vaza, a IA usa a menor carta vencedora.
- A IA considera carta coberta como sinal tatico: pode puxar coberta na segunda vaza depois de vencer a primeira quando ainda guarda carta forte, mas evita isso se a mao atual pode fechar a partida.
- Este arquivo registra a logica atual apos a segunda rodada, nao um equilibrio final definitivo.
- Qualquer ajuste em thresholds, blefes, aceite, corrida ou raise deve ser acompanhado por testes.

## Variante Global

- O jogador escolhe em `CONFIGURAÇÕES` se quer jogar `Truco Paulista` ou `Truco Mineiro`.
- `Truco Paulista` e o padrao do perfil novo e dos bares/circuitos.
- A escolha global vale para todos os bares da campanha principal, bonus pos-campanha e Modo Livre.
- A criacao de partida usa a variante salva no perfil do jogador; o valor declarado no bar fica apenas como fallback tecnico.
- A proxima mao de uma partida preserva a variante da propria partida.
- Existem testes unitarios cobrindo o padrao Paulista, o override global Mineiro e a proxima mao Paulista mantendo vira.
- O log de inicio de mao registra a regra ativa; em Paulista, registra tambem vira e manilha.
- Se a implementacao visual da vira/manilha do Paulista for alterada, validar novamente no fluxo real e em testes.

## Regras Especiais Implementadas

### Mao de nove

- gatilho confirmado em `9`, `10` ou `11` pontos
- quando uma dupla chega a `9` ou passa direto para `10`/`11`, a proxima mao nasce como `mao de 9`
- a mao de 9 fica pausada antes da primeira jogada para a dupla em ponto de mao decidir
- os parceiros dessa dupla podem ver as cartas um do outro antes de decidir
- se a dupla optar por nao jogar, a dupla adversaria recebe `1 ponto`
- se a dupla optar por jogar, a mao segue valendo `3 pontos`
- se a dupla jogar e perder, a dupla adversaria recebe `3 pontos`
- nao e permitido pedir truco/aumentar durante a mao de 9
- quando a mao de 9 e nossa, a UI mostra as cartas da parceira e os botoes `Jogar` e `Correr`
- quando a mao de 9 e deles, a IA decide automaticamente se joga ou entrega `1 ponto`
- cobertura atual:
  - `tests/game/nine-hand.test.ts`
  - `tests/game/gameSessionHelpers.test.ts`

### Carta virada para baixo / carta coberta

- uma rodada continua composta por ate `3 vazas`
- na primeira vaza, todas as cartas continuam abertas
- na segunda e na terceira vaza da rodada, qualquer jogador pode jogar uma carta virada para baixo
- a carta virada para baixo tambem pode ser chamada de `carta coberta`
- a carta coberta nao disputa a vaza e funciona como descarte sem forca, equivalente a uma carta sem valor para vencer
- a identidade real da carta coberta nao deve ser revelada nem aos adversarios nem ao parceiro durante a partida
- a mesa e os logs registram que uma carta coberta foi jogada, mas nao revelam a carta real
- a IA considera carta coberta como opcao quando quer descartar sem disputar a vaza
- se so adversarios jogaram coberto e nao ha carta aberta vencendo a vaza, a IA abre carta baixa para disputar barato
- se a parceira jogou coberto e nao ha urgencia de ganhar a vaza, a IA pode acompanhar coberta para perder/empatar sem revelar carta
- se a dupla pode ganhar a mao, evitar derrota critica ou fechar a partida, a IA abre carta mesmo apos uma coberta da parceira
- se a IA ganhou a primeira vaza e ainda tem reserva forte para a terceira, ela pode puxar coberta na segunda vaza para nao assustar a mesa e preservar poder de resposta a truco
- a IA nao deve puxar coberta nessa situacao quando a mao atual ja pode fechar a partida no placar
- cobertura atual:
  - `tests/game/resolve-trick.test.ts`
  - `tests/ai/chooseCard.test.ts`

## Pendencias de Regras para Implementar

As regras abaixo foram confirmadas como desejadas, mas ainda nao devem ser tratadas como implementadas:

### Ponto acima

- existe uma decisao de produto pendente para permitir escolher se a partida usa ou nao a versao `ponto acima`
- antes de implementar, definir onde essa escolha vive:
  - configuracao global antes da campanha
  - configuracao por bar/circuito
  - opcao avancada fora da primeira tela visivel
- a escolha precisa ser persistida e refletida claramente na tela de campanha ou na entrada da partida

## Nota de Continuidade

- O ajuste recente do scorepad e a tela autoral de campanha nao mudam regras de truco.
- A tela de resultado deve aparecer apenas depois da ultima carta da vaza decisiva estar visivel na mesa.
- Depois disso, esperar 1 segundo antes de exibir a arte de vitoria ou derrota.
- Se a mao termina por corrida em pedido de truco, nao gerar cartas artificiais para completar a mesa.
- Se qualquer refinamento visual tocar fluxo de botoes, falas ou estados de truco, validar novamente as regras deste arquivo e rodar testes antes de concluir.
