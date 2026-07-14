# Tutorial Jogavel

## Objetivo

Criar um tutorial jogavel antes da etapa Capacitor/Android Studio/Xcode, para garantir que a primeira experiencia em celular ensine o jogador a entender a mesa, tocar nas cartas e tomar decisoes de truco sem depender de manual externo.

## Direcao escolhida

- O tutorial acontece dentro da gameplay real, com visual de bar e mesa do jogo.
- Nao usar video.
- Usar baloes guiados sobre a tela, com tom de mesa.
- O jogo deve liberar apenas a acao ensinada naquele passo.
- O jogador aprende fazendo: tocar carta, ver vaza resolver, pedir truco, aceitar/correr, jogar coberta e entender a vira.
- O primeiro esboco usa o `Bar Maneco Banguela` como cenario visual por conversar melhor com a UI atual e ja ter pacote autoral.
- A Aula 1 deve ser uma mesa de Truco Mineiro sem vira e sem manilhas na vaza, para ensinar somente mao, mesa e vaza.

## Estrutura Recomendada

### Aula 1: Mesa, mao e vaza

Objetivo:
- ensinar onde fica a mao do jogador
- ensinar que tocar numa carta joga na mesa
- ensinar que a vaza e decidida pela carta mais forte
- mostrar o placar parcial da mao

Fluxo:
- balao apresenta a mesa
- balao aponta para a mao
- jogador toca numa carta comum baixa destacada
- cartas comuns aparecem na mesa
- balao explica que a parceira venceu a vaza com um 3 comum
- tutorial avanca para a proxima aula

### Aula 2: Ordem das cartas no Mineiro

Objetivo:
- ensinar a ordem basica das cartas comuns
- mostrar que a ordem comum sobe em `4, 5, 6, 7, Q, J, K, A, 2, 3`
- ensinar a usar a menor carta que vence a vaza
- manter manilhas fora da mesa para nao misturar conceitos

Fluxo:
- segunda vaza controlada com `7 de paus`, `6 de espada` e `5 de paus` na mesa
- jogador fica com `5 de ouros` e `Q de copas`
- tutorial destaca a `Q de copas`
- jogador toca na `Q de copas`
- tutorial mostra que a `Q` vence `7`, `6` e `5`, mas ainda perde para `J`, `K`, `A`, `2` e `3`

### Aula 3: Manilhas fixas do Mineiro

Objetivo:
- ensinar as manilhas fixas, do mais forte para o mais fraco: 4 de paus, 7 de copas, A de espada, 7 de ouros
- mostrar que manilha vence carta comum
- mostrar a ordem entre manilhas

Fluxo:
- balao lista as manilhas fixas do Truco Mineiro
- mesa controlada com `3 de paus`, `K de ouros` e `A de copas`
- jogador fica com `4 de paus` e `A de ouros`
- tutorial destaca o `4 de paus`, o zap
- jogador toca no `4 de paus`
- tutorial mostra que o zap vence ate o `3`, a maior carta comum

### Aula 4: Mao, rodada e partida

Objetivo:
- explicar que uma rodada tem ate 3 vazas
- explicar que vence a rodada quem faz 2 vazas
- explicar placar da partida ate 12
- diferenciar placar da mao e placar da partida

Fluxo:
- reaproveitar as duas vazas vencidas nas aulas anteriores
- balao explica que a mao termina quando uma dupla vence duas vazas
- caderno mostra `Nos 1 x 0 Eles` no placar da partida
- placar da mao volta para `0 x 0`, indicando a proxima mao
- balao explica que a partida continua ate 12 pontos

### Aula 5: Pedir truco

Objetivo:
- ensinar o botao `Pedir truco`
- explicar que a rodada passa a valer 3 se aceito
- mostrar que o adversario pode aceitar, correr ou aumentar
- manter o primeiro pedido simples, sem contra-aumento

Fluxo:
- jogador recebe mao forte com `3 de copas`, `2 de espada` e `A de ouros`
- balao explica que pedir truco aumenta o valor da mao se aceito
- botao `Pedir truco` fica destacado
- jogador toca em `Pedir truco`
- tutorial simula aceite dos adversarios
- painel lateral muda para `Valendo 3 pontos`
- balao antecipa que, no jogo real, os adversarios tambem podem correr ou aumentar para seis

### Aula 6: Aceitar, correr e aumentar

Objetivo:
- ensinar resposta a pedido adversario
- diferenciar aceitar, correr e aumentar
- introduzir `SEIS!`, `NOVE!`, `DOZE!`

Fluxo:
- balao explica que agora os adversarios pediram truco
- cenario 1: jogador recebe mao jogavel, botao `Aceitar` fica destacado, e a mao passa a valer 3
- cenario 2: jogador recebe mao fraca, botao `Correr` fica destacado, a mao encerra e os adversarios ganham 1
- cenario 3: jogador recebe mao muito forte, botao `Aumentar` fica destacado, e o tutorial mostra a escalada para 6
- os valores `NOVE!` e `DOZE!` ficam para uma etapa posterior depois que o jogador dominar a primeira resposta

### Aula 7: Parceira

Objetivo:
- ensinar conselho da parceira
- ensinar consulta quando a parceira e alvo do pedido
- reforcar que o humano decide

Fluxo:
- balao introduz que a parceira tambem le a mesa e aconselha em pedidos de truco
- Nega Catimbo fala `BORA!` em balao na mesa
- botao `Aceitar` fica destacado
- jogador toca em `Aceitar`
- tutorial mostra a mao passando a valer 3 e reforca que o conselho ajuda, mas o humano decide
- segundo balao exemplifica consulta da parceira com `E AI, PARCEIRO?`
- resumo apresenta os tres tons principais: `BORA!`, `CE QUE SABE!` e `MELHOR CORRER!`

### Aula 8: Carta coberta

Objetivo:
- ensinar que carta coberta so aparece a partir da segunda vaza
- explicar que carta coberta nao disputa a vaza
- ensinar uso como descarte

Fluxo:
- primeira tela reforca que a primeira vaza e sempre aberta
- segunda vaza controlada mostra mesa desfavoravel
- balao aponta para o toggle `Coberta`
- jogador toca no toggle
- carta do jogador ganha preview com selo `Coberta`
- jogador toca no `6 de ouros`
- mesa mostra verso e resolve a vaza sem contar aquela carta

### Aula 9: Truco Paulista

Objetivo:
- ensinar a vira
- explicar que a proxima carta da vira vira manilha
- mostrar a vira no inicio da rodada
- diferenciar manilha fixa do Mineiro e manilha dinamica do Paulista

Fluxo:
- aula troca o estado controlado para `Truco Paulista`
- vira `5 de ouros` aparece na mesa
- balao explica que a proxima carta na ordem, `6`, vira manilha
- mesa mostra cartas comuns fortes dos adversarios
- jogador toca no `6 de copas`
- tutorial mostra que a manilha dinamica vence as cartas comuns

### Aula 10: Mao de 9

Objetivo:
- ensinar que ao chegar em 9, 10 ou 11 pontos ha decisao especial
- mostrar cartas da parceira
- explicar `Jogar` e `Correr`
- reforcar que truco fica bloqueado nessa mao

Fluxo:
- placar controlado em `Nos 9 x 7 Eles`
- painel lateral troca os botoes normais por decisao de `Mao de 9`
- tutorial mostra cartas da parceira
- balao explica que `Correr` entrega 1 ponto e `Jogar` arrisca 3
- botao `Jogar` fica destacado
- jogador toca em `Jogar`
- painel indica que a mao segue valendo 3 e o tutorial reforca que truco fica bloqueado

### Fechamento

Objetivo:
- amarrar os conceitos essenciais antes de o jogador entrar na campanha

Fluxo:
- balao final lista os conceitos ensinados: vaza, ordem das cartas, manilhas, truco, parceira, carta coberta, Paulista e mao de 9
- botao final fecha o tutorial e retorna para a tela inicial

## Implementacao Incremental

1. Criar a Aula 1 como fatia vertical real.
2. Isolar estado de tutorial em arquivos proprios depois que o fluxo estiver aprovado.
3. Evitar acoplar tutorial ao progresso de campanha.
4. Reaproveitar componentes reais da gameplay sempre que possivel.
5. Rodar `npm test` e `npm run build` a cada etapa.

## Estado Atual

- Botao `Tutorial` existe na tela inicial.
- O tutorial usa a tela do `Bar Maneco Banguela` como cenario.
- Aulas 1 a 10 estao implementadas no tutorial jogavel:
  - mesa, mao e vaza
  - ordem comum do Mineiro
  - manilhas fixas do Mineiro
  - mao/rodada e partida ate 12
  - pedir truco
  - aceitar, correr e aumentar
  - conselho/consulta da parceira
  - carta coberta a partir da segunda vaza
  - vira e manilha dinamica do Truco Paulista
  - mao de 9 com cartas da parceira e decisao `Jogar`
- O tutorial foi testado pelo usuario e esta aprovado no estado atual.
- O tutorial ainda esta integrado em `src/app/AppSections.tsx`; uma futura limpeza pode extrair o roteiro para arquivo proprio apenas se isso melhorar manutencao.
- Proxima frente do projeto: `Capacitor + Android Studio + Xcode`.
