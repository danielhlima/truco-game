# Day 03 — Truco Completo (Engine + Interação)

## Objetivo

Implementar o sistema completo de truco, incluindo:

* pedidos de truco pela IA
* resposta humana ao truco
* escalada de apostas (3, 6, 9, 12)
* alternância correta entre os times
* integração completa com o fluxo da mão

---

## Implementações

### Engine — Truco Completo

#### Estado de Truco expandido

Adição de novos campos em `HandState`:

* `phase` — controle de fluxo (idle / awaiting-response)
* `requestedByTeam`
* `awaitingResponseFromTeam`
* `proposedBet`
* `nextRaiseByTeam` ✅ **(novo no dia 03)**

Esse último campo foi essencial para controlar corretamente quem pode aumentar a aposta.

---

#### Pedido de Truco

Implementação da função:

* `requestTruco`

Responsável por:

* iniciar pedido de truco
* definir time solicitante
* definir time que precisa responder
* calcular próxima aposta

---

#### Resposta ao Truco

Implementação da função:

* `respondToTruco`

Agora suporta três respostas:

* `"accept"` → aceita aposta
* `"run"` → corre (encerra mão)
* `"raise"` → aceita e já pede aumento

---

#### Novo fluxo: resposta com aumento

Exemplo implementado:

* adversário pede 3
* jogador responde `"raise"`
* resultado:

  * aposta sobe para 3 (aceita)
  * novo pedido automático de 6

---

#### Alternância correta da escalada

Regra implementada:

* quem aceita ganha o direito de aumentar
* apenas esse time pode pedir o próximo valor

Controle feito via:

```ts
nextRaiseByTeam
```

---

#### Validações adicionadas

* impedir aumento fora de turno do time
* impedir múltiplos aumentos consecutivos pelo mesmo time
* impedir aumento além de 12

---

### IA — Integração com Truco

Atualizações em `stepHand`:

* IA pode decidir pedir truco (`shouldRaiseBet`)
* IA responde automaticamente ao truco
* IA respeita regra de alternância (`nextRaiseByTeam`)

---

### UI — Evolução do Truco

#### Pedido de Truco pelo jogador

* botão "Pedir truco" integrado à engine

---

#### Resposta ao Truco (novo)

Adição de três opções:

* **Aceitar**
* **Pedir X (6, 9, 12)** ✅
* **Correr**

---

#### Botão dinâmico de aumento

* texto passa a refletir o próximo valor:

  * "Pedir truco"
  * "Pedir 6"
  * "Pedir 9"
  * "Pedir 12"

---

#### Bloqueio de ações

* cartas ficam bloqueadas durante decisão de truco
* botão de continuar desabilitado quando resposta humana é necessária

---

#### Mensagens aprimoradas

* "Você aceitou e pediu 6"
* "Nosso time pediu 9"
* "Aguardando resposta deles"
* "Time adversário correu do truco"

---

#### Painel de estado do truco (novo)

Adição de informações visuais:

* quem pediu
* quem precisa responder
* próximo valor proposto

---

## Correções importantes

### 1. Escalada incorreta de truco

Problema:

* mesmo time podia aumentar várias vezes seguidas

Solução:

* introdução de `nextRaiseByTeam`
* validação na engine e na UI

---

### 2. Falta de resposta com aumento

Problema:

* jogador só podia aceitar ou correr

Solução:

* adição de `"raise"` no tipo `TrucoResponse`
* atualização da engine e UI

---

### 3. UI pouco clara durante escalada

Problema:

* difícil entender sequência de aumentos

Solução:

* mensagens mais explícitas
* painel de estado do truco

---

## Testes realizados

* múltiplos cenários de truco:

  * humano pede → IA responde
  * IA pede → humano responde
  * escalada completa até 12
  * corrida em diferentes níveis
* validação de alternância de aumentos
* validação de encerramento correto da mão

---

## Estado atual

* sistema de truco funcional de ponta a ponta
* engine consistente com regras reais
* UI suficientemente clara para testes
* fluxo da mão pausando corretamente para decisões

---

## Próximos passos

Possíveis evoluções:

1. Melhorar ainda mais a UI do truco (histórico de ações)
2. Refinar heurística da IA para pedidos de aumento
3. Balancear agressividade da IA
4. Começar camada de progressão (campeonatos)
5. Evoluir visual (Three.js / mobile)

---

## Conclusão

O projeto evoluiu de:

→ jogo de cartas com regras básicas

Para:

→ **simulação completa de truco com blefe, escalada e decisão estratégica**

Este foi um dos marcos mais importantes do desenvolvimento.
