# Day 02 — Engine + UI Jogável

## Objetivo

Consolidar o fluxo interativo do jogo baseado em estado (`HandState`) e evoluir a interface para uma mesa jogável clara.

---

## Implementações

### Engine

* Implementação do `HandState` como núcleo do jogo
* Criação de `createHandState`
* Implementação do fluxo de jogadas:

  * `playHumanCard`
  * `playAiTurn`
  * `stepHand`
* Implementação da resolução de vaza (`resolveTrick`)
* Controle de rodada e vitória da mão
* Integração completa com RuleSet (Mineiro e Paulista)

---

### UI (Evolução significativa)

#### Estrutura da mesa

* Organização visual em visão de cima:

  * jogador humano (baixo)
  * parceira IA (topo)
  * adversários (esquerda e direita)
* Cartas da mesa exibidas por posição
* Separação clara entre jogadores e mesa

---

#### Feedback visual

* Destaque do jogador da vez
* Destaque da última carta jogada
* Mensagens de estado da mão:

  * vez do jogador
  * vaza completa
  * fim da mão
* Mensagens de eventos:

  * jogada do jogador
  * resultado da rodada
  * início de nova rodada

---

#### Painel de status

* Variante (Mineiro / Paulista)
* Vira
* **Manilha (calculada na UI)**
* Rodada atual
* Placar (Nós vs Eles)
* Jogador da vez
* Valor da mão (truco)

---

#### Controle de fluxo

* Botão contextual:

  * "Continuar"
  * "Resolver vaza"
  * "Mão encerrada"
* UI controla o ritmo do jogo (não automático)

---

#### Mão do jogador

* Cartas renderizadas visualmente
* Clique para jogar carta
* Bloqueio de jogada quando não é a vez

---

### Truco (Preparação)

* Criação de área dedicada ao truco na UI
* Botão "Pedir truco"
* Botões "Aceitar" e "Correr" (desativados)
* Exibição do valor da mão ("Valendo X")
* Mensagem de estado do truco (placeholder)

⚠️ Importante:

* O truco ainda **não está integrado à engine**
* Nenhuma alteração no `HandState` ocorre ao pedir truco
* Fluxo do jogo permanece normal

---

## Testes

* Execução completa de múltiplas mãos
* Validação visual do fluxo:

  * jogadas
  * resolução de vaza
  * troca de rodada
  * fim da mão
* Validação das duas variantes:

  * Mineiro
  * Paulista (com vira e manilha dinâmica)
* Conferência via logs e UI

---

## Estado atual

* Engine completa e estável
* UI jogável e compreensível sem depender de logs
* Fluxo passo a passo funcionando corretamente
* Base preparada para implementação do truco interativo

---

## Próximo passo

* Implementar truco real na engine:

  * estado de pedido de truco
  * pausa do fluxo da mão
  * resposta (aceitar / correr)
  * atualização de `currentBet`
  * integração com logs e UI

---

## Observações técnicas

* Arquitetura baseada em estado (HandState) validada
* Separação entre engine e UI mantida
* Evolução feita sem refatoração estrutural
* UI evoluiu sem impactar lógica existente
* Logs continuam sendo ferramenta de auditoria

---

## Conclusão

O projeto saiu de:

→ protótipo técnico com logs

Para:

→ **jogo jogável com interface clara e fluxo controlado**

A próxima evolução é adicionar profundidade ao gameplay com truco interativo.
