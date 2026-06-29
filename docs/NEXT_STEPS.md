# Next Steps

## Estado Atual Real

O caminho principal da campanha esta visualmente integrado ate o `Cassino Mé Maior`.

Estado consolidado:

- fluxo `COMEÇAR > campanha > capa do bar > escolha de parceira se necessario > jogo`
- gameplay dentro de stage logico `1080x500`
- intro curta antes da partida, mostrando primeiro apenas o background do local
- tela de selecao de parceira aceita como pronta no estado atual
- escolha de skin do jogador implementada antes da campanha quando ainda nao existe skin salva
- menu em partida com opcoes de validacao, troca de parceira, saida e reset de progresso
- telas normais de vitoria/derrota por local
- telas definitivas de conquista de local e circuito
- progressao principal com parceiros desbloqueados conforme a dupla adversaria e derrotada
- `npm run build` deve continuar sendo a validacao minima antes de concluir qualquer frente

Locais com pacote visual autoral integrado:

- `Bar do Ze Catinga`
- `Bar Maneco Banguela`
- `Trem do Jaça`
- `Adega do Juca Bigode`
- `Garagem Norte`
- `Quintal da Leste`
- `Subsolo do Centro`
- `Salao da Sul`
- `Centro de Convenções da Prefeitura`
- `Ginásio Estadual Maneco Filé`
- `Arena Nacional`
- `Centro Americano Truqueiro de Medelin`
- `Hotel Truco de Segóvia, Espanha`
- `Cassino Mé Maior`

## Proximo Foco Recomendado

### Nivel bonus

A proxima frente e o pacote visual do bonus pos-campanha:

- circuito: `Circuito Intergaláctico`
- local: `Órbita da Lua`
- dupla adversaria reservada: `Mane Banguela` + `Cosme Orbita`

Antes de implementar assets, gerar prompts seguindo `docs/IMAGE_PROMPT_STANDARDS.md`.

Assets esperados:

1. mesa de truco, `780 x 780`
2. ambiente/background, `1672 x 941`
3. tela de campanha, `1672 x 941`
4. host/organizador, quadrado `1024 x 1024` ou maior
5. vitoria normal da partida, `1672 x 941`, com `VOLTAR AO FLUXO DE BARES`
6. derrota normal da partida, `1672 x 941`, com `VOLTAR AO FLUXO DE BARES`
7. vitoria definitiva da `Órbita da Lua`, `1672 x 941`
8. vitoria definitiva do `Circuito Intergaláctico`, `1672 x 941`
9. imagens pequenas dos adversarios do bonus para gameplay/roster

Direcao criativa obrigatoria:

- nada assustador
- sem ETs ameaçadores, monstros, horror, gore, body horror ou criaturas grotescas
- adversarios podem ser humanos excentricos, truqueiros retrofuturistas, performers cosmicos, organizadores de evento lunar ou cosplayers espaciais
- manter humor brasileiro, provocacao de truco e personalidade autoral
- criar uma experiencia nova, encantadora e diferente das telas de campeonato/cassino ja feitas
- preservar legibilidade de gameplay, principalmente centro livre da mesa

## Pendencias De Produto E Regras

Depois do pacote bonus, retomar estas frentes:

- mao especial de 9/dez pontos:
  - documentacao antiga registra `mao de nove`
  - conversa posterior citou "ver cartas na mao de dez pontos"
  - confirmar nomenclatura e gatilho antes de implementar
  - permitir que parceiros vejam as cartas um do outro nessa mao especial
  - se a dupla optar por nao jogar, adversarios recebem `1 ponto`
  - se a dupla optar por jogar e perder, adversarios recebem `3 pontos`
  - explicar visualmente por que pedir truco/aumentar fica bloqueado
- opcao de usar ou nao a variante `ponto acima`
- tutorial jogavel:
  - ensinar fluxo basico de rodada, mao e vaza
  - ensinar truco, aceite, corrida e aumentos
  - ensinar conselho/consulta da parceira
  - ensinar progressao de campanha e desbloqueio de parceiros
- segunda e terceira vazas:
  - permitir jogar carta virada para baixo
  - definir como a resolucao dessa carta funciona
  - cobrir com testes
- variantes por bar:
  - hoje a campanha declara `Mineiro` e `Paulista`
  - validar e corrigir a aplicacao efetiva da variante configurada por bar
- balanceamento de IA:
  - IA ainda tende a trucar com pouco
  - mexer apenas com cobertura de testes

## Validacao Recomendada

Antes de concluir qualquer implementacao:

- verificar `git status`
- preservar mudancas locais existentes
- abrir o fluxo real desde `COMEÇAR` quando houver mudanca visual ou de progressao
- confirmar que a arte correta carrega para campanha, background, mesa, host e resultados
- testar hotspots invisiveis quando houver tela de campanha nova
- rodar `npm run build`

## O Que Nao Deve Virar Prioridade Agora

- refatoracao total da engine
- troca da arquitetura de estado
- backend, ranking online ou empacotamento mobile
- reabrir a responsividade da gameplay sem regressao real
- reabrir a tela de selecao de parceira sem regressao real
- criar assets do bonus antes dos prompts serem aprovados

## Prompt Para Chat Novo

O prompt pronto para continuar em um chat novo esta em:

- `docs/NEXT_CHAT_PROMPT.md`
