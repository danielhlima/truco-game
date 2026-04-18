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

### 4. Construir a tela de selecao de parceiro IA

- transformar o roster em experiencia navegavel
- ligar retrato, historia, estilo de jogo e atributos
- preparar o fluxo para futura escolha real da parceira

Status:

- iniciado
- estrutura base ja implementada

## Estado Atual Real

### Marco de foco

- a gameplay screen esta considerada pronta por enquanto
- o foco principal agora e a tela de selecao de personagens/parceira IA

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

### Selecao de personagens

Ja existe uma primeira implementacao:

- acessivel por um botao generico no canto superior direito da tela inicial
- renderizada dentro do `gameViewport`
- usa o roster de `src/content/characters.ts`
- mostra:
  - retrato
  - nome
  - alcunha
  - historia
  - estilo de jogo
  - atributos

Estado:

- funcional como base
- ainda precisa de polimento visual e definicao de fluxo final
- a amarracao funcional definida para a proxima etapa e:
  - parceiro escolhido fica mantido enquanto o jogador permanecer no mesmo bar
  - ao concluir ou trocar de bar, a tela de escolha de parceira volta a ser oferecida
  - no inicio da campanha, apenas 5 parceiras ficam liberadas

## Proximo foco recomendado

### Opcao principal

- continuar a tela de selecao de parceiro IA
- aproximar a implementacao da arte de referencia
- transformar a selecao em fluxo real do jogo

### Detalhamento do proximo passo recomendado

- refinar o layout em duas colunas da tela de selecao
- melhorar o enquadramento do retrato principal
- lapidar tipografia de:
  - nome
  - alcunha
  - historia
  - atributos
- consolidar no codigo a organizacao inicial do roster:
  - mover os 4 avatars antigos do gameplay para `src/assets/characters`
  - atualizar o roster para usar todos os 20 personagens visuais na mesma pasta
  - separar explicitamente:
    - `starter partners`
    - `unlockable partners`
    - `bar rosters`
- decidir se o CTA `Jogar com este parceiro` ja deve alterar estado real ou continuar apenas visual por enquanto
- pensar a integracao com:
  - tela inicial
  - campanha
  - futura loja / personagens pagos

### Separacao inicial definida

- `starter partners`:
  - `nega-catimbo`
  - `leninha-lambreta`
  - `rosinha-catraca`
  - `rita-gambiarra`
  - `ze-catinga`
- `unlockable partners`:
  - `aninha-passarela`
  - `dalva-seringa`
  - `naldo-tramela`
  - `quiteria-mao-torta`
  - `dito-marrua`
- `bar rosters` iniciais:
  - bar 1:
    - `tiao-casca-grossa`
    - `cida-fumaca`
    - `celsinho-breque`
  - bar 2:
    - `tonhao-rasga-lata`
    - `patricia-monique`
    - `mane-banguela`

### Opcao seguinte

- depois da tela de selecao, avançar para:
  - escolha real da parceira IA
  - cutscenes
  - apresentacao narrativa da campanha

### Frente estrutural ja resolvida o suficiente para seguir

- a blindagem estrutural do gameplay layout funcionou bem o bastante
- nao e mais a prioridade numero 1 neste momento
- so revisitar se aparecer regressao real no gameplay

### Opcao visual apos a blindagem

- calibrar mesas/ambiencia por bar
- encaixar novos assets fotograficos
- continuar pequenos refinamentos da cena central quando fizer sentido

### Opcao secundaria
- seguir expandindo o roster e os perfis de IA conforme novos personagens chegarem

## Pendencias abertas

- otimizar mais os assets fotograficos grandes
- converter fundos maiores para formatos mais leves se necessario
- fechar visual da tela de selecao de personagens
- ligar a escolha de parceira ao estado real do jogo
- decidir como parceiros gratuitos/pagos vao entrar no fluxo
- revisar responsividade da nova tela de selecao em tamanhos diferentes
- revisar scorepad apenas se houver necessidade real

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
