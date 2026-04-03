# Day 01 — Setup e Engine Inicial

## Objetivo

Configurar ambiente e implementar base do motor do jogo.

---

## Setup Realizado

* Instalação do Node.js
* Setup do projeto com Vite
* Configuração de React + TypeScript
* Instalação do Three.js
* Configuração do VS Code

---

## Problemas Encontrados

### 1. Erro de tipagem com Three.js

* Solução: instalação de tipos + restart TS

### 2. Erro com `verbatimModuleSyntax`

* Solução: uso de `import type`

---

## Implementações

### Modelagem de cartas

* `Suit` (union type)
* `Rank` (union type)
* `Card` (interface)

### Baralho

* Criação (`createDeck`)
* Embaralhamento (`shuffle`)

### Regras

* Implementação do Truco Mineiro (manilhas fixas)

### Comparação de cartas

* Função `compareCards`
* Considera manilha e hierarquia

---

## Testes

* Simulação de comparação entre duas cartas
* Resultado validado corretamente

---

## Estado atual

* Engine básica funcional
* Execução via console no browser

---

## Próximos passos

* Distribuição de cartas (4 jogadores)
* Implementação de rodada (vaza)
* Estrutura de GameState

---

## Observações técnicas

* Uso de TypeScript com tipagem forte
* Separação clara entre lógica e render
* Projeto estruturado para escalar
