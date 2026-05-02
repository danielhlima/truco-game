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

- a gameplay screen esta considerada pronta por enquanto
- a escolha de parceira por bar ja funciona
- a tela de campanha ja existe antes da entrada no bar
- a capa do `Bar do Ze Catinga` ja existe em primeira versao
- o foco imediato recomendado agora e continuar a capa do bar

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
- a capa usa fundo, dono do bar, lousa, HUD de estatisticas, adversarios e placa `ENTRAR NO BAR`
- coluna esquerda esta aceitavel por enquanto
- coluna central ja mostra informacoes do bar e adversarios
- coluna direita ja mostra estatisticas e CTA

Pendencias principais:

- refinar o HUD de estatisticas da coluna direita
- fazer `Dificuldade do desafio` aparecer abaixo dos adversarios
- compactar a coluna central sem reduzir demais a leitura
- garantir que o texto da lousa do dono caiba dentro da placa
- garantir que `ENTRAR NO BAR` caiba dentro da placa
- estabilizar o layout interno para variar menos quando a janela do navegador muda

## Proximo foco recomendado

### Opcao principal

- continuar a tela de capa do `Bar do Ze Catinga`

### Itens para atacar primeiro

- HUD de estatisticas do bar:
  - melhorar proporcao
  - ajustar hierarquia dos numeros
  - manter dentro da coluna direita
- dificuldade do desafio:
  - aparecer abaixo dos nomes dos adversarios
  - caber dentro do painel central
  - usar os marcadores de garrafa sem corte
- botao `ENTRAR NO BAR`:
  - texto deve ficar contido na placa
  - permitir quebra em duas linhas quando necessario
- estabilidade da moldura:
  - reduzir uso de `vw` dentro da capa
  - preferir blocos fixos/controlados dentro da viewport da moldura

### Opcao seguinte depois disso

- polir a capa final do Ze Catinga

### Opcao seguinte depois disso

- dar identidade de campanha aos bares:
  - contexto narrativo
  - apresentacao dos oponentes
  - diferencas de estilo e atmosfera

## Pendencias abertas

- continuar a capa do `Bar do Ze Catinga`
- refinar HUD de estatisticas do bar
- fazer a dificuldade do desafio aparecer abaixo dos adversarios
- estabilizar layout da capa contra mudancas de tamanho da janela
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

No proximo chat, comecar por:

- continuar a tela de capa do `Bar do Ze Catinga`

Contexto para o proximo chat:

- a capa ja esta implementada em primeira versao
- arquivos principais:
  - `src/app/AppSections.tsx`
  - `src/app/useGameSession.ts`
  - `src/App.tsx`
  - `src/assets/venues/ze-catinga/`
- a coluna esquerda esta boa o suficiente por enquanto
- o HUD de estatisticas da coluna direita ainda precisa de refinamento
- `Dificuldade do desafio` nao esta aparecendo de forma confiavel abaixo dos adversarios
- o texto de `ENTRAR NO BAR` e a frase da lousa precisam continuar protegidos contra estouro
- o layout interno deve variar menos quando o tamanho da janela do navegador muda

Importante:

- nao recomecar a gameplay do zero
- nao desmontar a arquitetura atual
- usar a documentacao como fonte de verdade
- validar sempre com `npm run build`
