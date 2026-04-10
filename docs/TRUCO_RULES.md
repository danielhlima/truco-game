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
  - só pode ser falado por quem recebeu o `TRUCO!` inicial e aceitou sem subir.

- `TOMA!`
  - é falado por quem abriu o `TRUCO!` original.
  - quem falou `TRUCO!` nunca fala `DESCE!`.

### Corrida

- `TÔ FORA!`
  - é falado por quem correu.

## Regras de Ouro

### Regra de ouro 1

- quem fala `TRUCO!` nunca fala `DESCE!`

### Regra de ouro 2

- quem falou `TRUCO!` fala `TOMA!` ao final dos aceites da sequência

## Regras do Ping-pong do Truco

- No fluxo de `truco + raise`, só falam os dois jogadores envolvidos no lance formal.
- Parceiro pode aconselhar, mas não entra no ping-pong principal de `DESCE!/TOMA!/SEIS!/NOVE!/DOZE!`.

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
