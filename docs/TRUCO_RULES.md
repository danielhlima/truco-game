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

## Cortes Atuais de Aceite da IA

- truco (`3`) -> corte `1`
- seis -> corte `2`
- nove -> corte `3`
- doze -> corte `4`

## Observação Importante

- Já foi identificado que a IA atual está `trucando com pouco`.
- Este comportamento ainda será rebalanceado futuramente.
- Por enquanto, este arquivo registra a lógica atual, não a lógica ideal.
