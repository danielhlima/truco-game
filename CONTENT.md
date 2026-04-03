# CONTEXT.md

## Objetivo deste arquivo

Este arquivo existe para dar contexto exato do projeto a um novo chat, evitando refatorações desnecessárias e respostas que ignorem o estado real do código.

---

## Estado atual do projeto

Este projeto é um jogo de truco em TypeScript.

Ele já possui:

* engine funcional para Truco Mineiro
* engine funcional para Truco Paulista
* suporte a RuleSet
* suporte a vira no paulista
* IA básica para jogar cartas
* IA básica para decisões de truco
* UI React funcional e interativa
* logs detalhados para validação da lógica

---

## Arquitetura atual

### Separação de responsabilidades

* `/game` → regras, estado e fluxo do jogo
* `/ai` → decisões automatizadas
* `App.tsx` → interface React e interação do jogador
* `utils/logger.ts` → logs para auditoria

---

## Regra crítica

O projeto NÃO está mais em modo de simulação automática pura.

Hoje a arquitetura correta é:

* a UI cria um estado de mão
* o humano joga clicando em carta
* a IA joga passo a passo
* a vaza é resolvida explicitamente
* a UI controla o ritmo

### Portanto:

Não reescrever o projeto para um fluxo monolítico tipo:

* `playHand()` fazendo tudo sozinho
* `playMatch()` controlando toda a UI
* autoplay total como fluxo principal

Esse fluxo automático ainda existe em partes históricas do projeto, mas não é mais o centro da experiência atual.

---

## Modelo central atual

O centro da arquitetura atual é o `HandState`.

Ele representa:

* variante
* vira
* jogadores
* mesa
* jogador da vez
* placar da mão
* rodada atual
* vencedor
* status da mão

Arquivos importantes:

* `game/handState.ts`
* `game/createHandState.ts`
* `game/playHumanCard.ts`
* `game/playAiTurn.ts`
* `game/resolveTrick.ts`
* `game/stepHand.ts`

---

## Fluxo correto hoje

1. iniciar mão com `createHandState`
2. se for vez do humano, ele escolhe uma carta
3. se for vez da IA, a UI chama `stepHand`
4. quando houver 4 cartas na mesa, a UI chama `stepHand` para resolver a vaza
5. o vencedor da vaza inicia a próxima

---

## O que já foi validado

Já foi validado via logs que:

* vencedor da vaza começa a próxima
* empate está funcionando
* mineiro está funcionando
* paulista está funcionando
* vira está funcionando
* o fluxo passo a passo está funcionando
* a mesa não deve acumular cartas indefinidamente
* a UI atual consegue simular uma mão até o fim

---

## Problema atual principal

O problema principal do projeto NÃO é mais a engine.

O problema atual é UX / interface:

* legibilidade da mesa
* clareza visual das cartas jogadas
* destaque da vira
* controle do fluxo na UI
* interação de truco pela interface

---

## O que NÃO fazer

* Não refatorar tudo do zero
* Não substituir a arquitetura atual por Redux, MobX ou outra camada pesada
* Não remover logs
* Não voltar para um fluxo somente automático
* Não propor backend ou mobile agora como prioridade
* Não quebrar o `HandState` como centro do fluxo interativo

---

## O que fazer

* Evoluir incrementalmente
* Preservar a arquitetura atual
* Melhorar a UI
* Implementar truco interativo
* Integrar múltiplas mãos depois
* Manter logs para double check

---

## Prioridade atual

A prioridade atual do projeto é:

1. melhorar a UI jogável
2. permitir truco interativo
3. depois integrar partida completa na interface

---

## Instrução para um novo ChatGPT

Se você estiver lendo este arquivo em outro chat:

Leia este arquivo antes de sugerir mudanças.

Assuma que:

* a engine já funciona
* o RuleSet já existe
* mineiro e paulista já estão implementados
* o projeto já tem UI interativa
* o objetivo agora é EVOLUIR, não recomeçar

A resposta ideal é incremental, respeitando o estado atual do projeto.
