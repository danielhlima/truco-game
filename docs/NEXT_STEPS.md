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

- base concluida
- segue aberta para ajustes finos de comportamento e UX

### 3. Preparar a arquitetura/layout da tela final

- coluna esquerda
- mesa central
- coluna direita
- HUD integrada ao cenario

Status:

- em andamento
- ja bem avancado

## Estado Atual Real

### Coluna esquerda

- bloco dos jogadores em bom estado
- scorepad funcional e visualmente coerente
- scorepad considerado sensivel e sujeito a retrabalho se mexer sem cuidado

### Mesa central

- mesa quadrada e dominante
- gameplay evoluindo para visual mais fotorealista
- cartas com verso fotografico envelhecido
- frente das cartas com papel envelhecido
- animacao de carta entrando de fora da mesa
- animacao de limpeza entre maos recolhendo cartas para fora do quadro
- animacao de distribuicao entre rodadas mantida

### Coluna direita

- `Valendo` consolidado com `tento/tentos`
- card central com `Etapa` e `Endereco`
- botoes de truco visiveis e sem label `Acoes`
- fundo estrutural removido para deixar o cenario aparente

### Tela inicial

- possui debug selector de bar
- permite testar qualquer venue sem depender da progressao salva

### IA

- base de personalidades criada
- adversarios usam `balanced`
- parceira usa `conservative`

## Proximo foco recomendado

### Opcao principal

- polir a coluna direita
- refinar hierarquia visual
- melhorar respiro interno do card de contexto
- fazer acabamento fino dos botoes de truco

### Opcao secundaria

- continuar polindo a mesa central conforme novos assets fotograficos chegarem
- revisar mesa por venue
- revisar sensacao de profundidade e cena

### Opcao de sistema

- expandir o sistema de personalidades da IA
- preparar futura escolha de parceira IA pelo jogador

## Pendencias abertas

- otimizar mais os assets fotograficos grandes
- converter fundos maiores para formatos mais leves se necessario
- revisar responsividade final em telas diferentes
- revisar scorepad apenas se houver necessidade real

## O que nao deve virar prioridade agora

- refatoracao total da engine
- troca da arquitetura de estado
- polimento fino de micro-responsividade antes do layout final fechar
- backend, ranking online ou empacotamento mobile

## Regra de trabalho

Antes de iniciar qualquer nova frente em um chat novo:

1. ler `docs/CONTENT.md`
2. ler `docs/LAYOUT_RULES.md`
3. ler `docs/TRUCO_RULES.md`
4. ler `docs/NEXT_STEPS.md`
5. validar no codigo os arquivos realmente afetados
