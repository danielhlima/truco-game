# Next Steps

## Pre-plano Consolidado

### 1. Consolidar a gameplay screen

- fazer a tela principal se resolver dentro da tela do celular
- eliminar dependencia de controles externos
- fechar nomenclatura e HUD essencial

Status:

- amplamente concluido

### 2. Fechar o fluxo completo de truco dentro da tela

- decisao em dupla
- consultas da parceira
- baloes consistentes
- fluxo de aceite, raise e corrida estabilizado

Status:

- funcional
- blindagem por testes reforcada
- regra de consulta da parceira ajustada para nao consultar de novo quando ela iniciou ou ja recebeu respaldo no fluxo

### 3. Preparar a arquitetura/layout da tela final

- coluna esquerda
- mesa central
- coluna direita
- HUD integrada ao cenario

Status:

- em bom estado para seguir
- revisitar so se houver regressao real

### 4. Construir a tela de selecao de parceira IA

- transformar o roster em experiencia navegavel
- ligar retrato, historia, estilo de jogo e atributos
- preparar o fluxo para escolha real da parceira

Status:

- fluxo base funcional concluido
- segue aberto para UX, narrativa e acabamento

## Estado Atual Real

### Marco de foco

- a gameplay screen esta em bom estado, e o scorepad da coluna esquerda ja teve a sobreposicao corrigida
- a escolha de parceira por bar ja funciona
- a tela de campanha ja existe antes da entrada no bar
- a capa do `Bar do Ze Catinga` foi refinada, limpa e salva no Git
- o ajuste do scorepad:
  - preservou `src/assets/ui-left/scorepad-notebook-clean-cut.png`
  - ficou restrito ao layout interno em `src/App.tsx`
  - separou placar da partida e placar da mao
  - foi validado visualmente no fluxo real ate a gameplay
  - passou em `npm run build`
- o foco imediato recomendado agora e estabilizar a responsividade da gameplay screen quando o navegador ou device muda de tamanho

### Truco e dialogos

Estado atual:

- consultas da parceira ja existem
- conselho da parceira ao humano ja existe
- a leitura do humano pesa na decisao final da parceira
- a regra da `escalada vigente` para `DESCE!/TOMA!` foi consolidada
- a parceira nao consulta novamente o humano quando ela iniciou a escalada ou ja recebeu respaldo antes

Ponto critico:

- manter a cobertura de testes antes de mexer de novo no fluxo de dialogo
- qualquer ajuste novo em `truco + raise` deve vir com teste

### Selecao de parceira

Estado atual:

- apenas as 5 starter partners aparecem
- a escolha fica salva por bar
- ao entrar em bar sem escolha salva, a tela reaparece
- os dois primeiros bares ja tem adversarios fixos

Pendencia principal:

- UX e narrativa da escolha ainda estao simples demais

### Capa do Bar do Ze Catinga

Estado atual:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo` ja esta implementado
- assets do Ze Catinga estao em `src/assets/venues/ze-catinga/`
- a capa usa fundo, dono do bar, lousa, HUD de estatisticas, adversarios, dificuldade e placa `ENTRAR NO BAR`
- coluna esquerda esta aceitavel por enquanto
- coluna central mostra informacoes do bar, adversarios e dificuldade ampliada
- coluna direita mostra estatisticas e CTA centralizados
- assets antigos da capa foram limpos
- commit salvo e enviado:
  - `0f90926 Refine Ze Catinga venue cover`

Pendencias principais da capa:

- nao ha pendencia imediata bloqueante na capa
- manter o layout atual preservado enquanto o foco volta para a gameplay

## Proximo foco recomendado

### Opcao principal

- estabilizar a escala da gameplay screen dentro da moldura de celular em landscape

### Itens para atacar primeiro

- Responsividade da gameplay:
  1. fixar uma resolucao logica da gameplay
  2. escalar a tela inteira como uma unidade
  3. usar letterbox/pillarbox quando a proporcao do device for diferente
  4. evitar `vw`/`dvh` dentro da gameplay, deixando essas medidas no wrapper externo
  5. manter apenas 2 ou 3 modos internos controlados, como `regular`, `compact` e `tiny`
- Validacao:
  - abrir a gameplay screen no navegador
  - redimensionar a janela como no video enviado pelo usuario
  - testar em pelo menos alguns tamanhos representativos de desktop e mobile landscape
  - confirmar que mesa, coluna esquerda, coluna direita e mao do jogador escalam juntas sem baguncar
  - rodar `npm run build`

### Opcao seguinte depois disso

- polir a gameplay screen conforme novas capturas, sem reabrir fluxo de jogo

### Opcao seguinte depois disso

- dar identidade de campanha aos bares:
  - contexto narrativo
  - apresentacao dos oponentes
  - diferencas de estilo e atmosfera

## Pendencias abertas

- estabilizar responsividade da gameplay dentro da moldura de celular
- fechar visual da tela de selecao de parceira
- deixar o fluxo de campeonatos mais claro e solido:
  - cards por etapa com status visual
  - destaque forte para o bar atual
  - labels claras para `Concluido`, `Atual` e `Bloqueado`
  - CTA distinto para bar atual versus bares anteriores
  - contador simples de progresso no topo
- dar mais contexto narrativo aos bares
- decidir como parceiros gratuitos/pagos entram no fluxo
- revisar responsividade final da tela de selecao
- otimizar mais os assets fotograficos grandes, se necessario

## O que nao deve virar prioridade agora

- refatoracao total da engine
- troca da arquitetura de estado
- backend, ranking online ou empacotamento mobile
- reabrir grandes retrabalhos na gameplay screen sem motivo real

## Regra de trabalho

Antes de iniciar qualquer nova frente em um chat novo:

1. ler `docs/CONTENT.md`
2. ler `docs/LAYOUT_RULES.md`
3. ler `docs/TRUCO_RULES.md`
4. ler `docs/NEXT_STEPS.md`
5. validar no codigo os arquivos realmente afetados

## Prompt operacional para o proximo chat

Copie e cole no proximo chat:

```text
Estamos continuando o projeto truco-game.

Antes de agir, leia nesta ordem:
1. docs/README.md
2. docs/CONTENT.md
3. docs/LAYOUT_RULES.md
4. docs/TRUCO_RULES.md
5. docs/NEXT_STEPS.md

Use esses arquivos como fonte de verdade.

Estado atual:
- a capa do Bar do Ze Catinga foi refinada, limpa, commitada e enviada para origin/main
- commit salvo: 0f90926 Refine Ze Catinga venue cover
- o fluxo atual deve ser preservado: COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo
- o scorepad da coluna esquerda ja foi corrigido:
  - labels `Nos`, `Eles`, `Mao` e `Mao` nao se sobrepoem mais aos numeros
  - placar da partida e placar da mao foram separados
  - asset `src/assets/ui-left/scorepad-notebook-clean-cut.png` preservado
  - validacao visual feita no fluxo real ate a gameplay
  - `npm run build` passou
- agora o problema principal e responsividade:
  - ao redimensionar a janela do navegador, os elementos dentro da moldura que simula o celular ficam baguncados
  - a gameplay ainda parece reflowar como pagina web, em vez de escalar como stage de jogo

Objetivo deste chat:
1. estabilizar a gameplay screen dentro da moldura de celular em landscape
2. fixar uma resolucao logica ou fortemente controlada para a gameplay
3. escalar a tela inteira como uma unidade quando o viewport externo muda
4. aceitar letterbox/pillarbox quando a proporcao do device for diferente
5. reduzir ou remover dependencia de `vw`/`dvh` dentro da gameplay, mantendo essas medidas no wrapper externo
6. manter no maximo 2 ou 3 modos internos controlados (`regular`, `compact`, `tiny`)
7. preservar o fluxo de jogo, a capa do bar, a selecao de parceira e as regras de truco

Arquivos provaveis:
- src/App.tsx
- src/app/AppSections.tsx
- src/index.css
- possivelmente nenhum asset

Importante:
- nao recomecar a gameplay do zero
- nao desmontar a arquitetura atual
- fazer mudancas incrementais
- validar visualmente no navegador redimensionando a janela como no video
- validar com `npm run build`
```
