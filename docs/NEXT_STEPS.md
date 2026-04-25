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
- ainda fragil em regras finas de dialogo
- precisa de blindagem por testes

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
- o foco imediato recomendado agora e blindar o dialogo de `truco + raise` com testes

### Truco e dialogos

Estado atual:

- consultas da parceira ja existem
- conselho da parceira ao humano ja existe
- a leitura do humano pesa na decisao final da parceira
- a regra da `escalada vigente` para `DESCE!/TOMA!` foi consolidada

Ponto critico:

- esse bloco ainda sofre risco alto de regressao
- o historico recente mostrou varios edge cases em baloes e falas

### Selecao de parceira

Estado atual:

- apenas as 5 starter partners aparecem
- a escolha fica salva por bar
- ao entrar em bar sem escolha salva, a tela reaparece
- os dois primeiros bares ja tem adversarios fixos

Pendencia principal:

- UX e narrativa da escolha ainda estao simples demais

## Proximo foco recomendado

### Opcao principal

- implementar testes unitarios ou reforcar os existentes para os fluxos de `truco + raise`

### Casos que os testes devem cobrir primeiro

- `TRUCO!/SEIS!/NOVE!/DOZE!` sendo falados por quem propoe o valor
- `DESCE!` versus `TOMA!` conforme a regra da escalada vigente
- reset da escalada vigente quando a jogada de cartas retoma
- `TO FORA!` em corrida
- consulta da parceira ao humano
- conselho da parceira para o humano
- peso real das respostas:
  - `BORA!`
  - `CE QUE SABE!`
  - `MELHOR CORRER!`
- ordem e emissor correto dos baloes

### Opcao seguinte, depois dos testes

- fechar a UX da escolha de parceira com mais contexto do bar
- deixar a entrada na partida mais narrativa
- apresentar melhor quem sao os adversarios fixos do bar

### Opcao seguinte depois disso

- estabilizar a UX do truco:
  - mensagem de status
  - clareza visual dos botoes
  - baloes mais intencionais
  - validacao dos edge cases restantes

### Opcao seguinte depois disso

- dar identidade de campanha aos bares:
  - contexto narrativo
  - apresentacao dos oponentes
  - diferencas de estilo e atmosfera

## Pendencias abertas

- blindar o dialogo de truco com testes unitarios
- consolidar de vez os casos de `DESCE!/TOMA!/TO FORA!`
- fechar visual da tela de selecao de parceira
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

- criar ou reforcar testes unitarios para os fluxos de dialogo de `truco + raise`

Depois disso, seguir para:

- UX da escolha de parceira com contexto do bar
- estabilizacao visual/UX do truco
- identidade de campanha dos bares

Importante:

- nao recomecar a gameplay do zero
- nao desmontar a arquitetura atual
- usar a documentacao como fonte de verdade
- validar sempre com `npm run build`
