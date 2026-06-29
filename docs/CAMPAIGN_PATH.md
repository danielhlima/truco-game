# Caminho Principal da Campanha

## Regra de Expansao Vertical

Cada bar deve entrar primeiro como pacote jogavel minimo:

- dados completos em `src/career/campaign/campaignData.ts`
- dupla adversaria fixa e exclusiva daquele bar
- nenhum adversario deve se repetir em outro bar
- variante, dificuldade e numero de vitorias definidos
- campanha, capa e resultado genericos aceitos como fallback
- tema de mesa reaproveitado quando ainda nao houver arte propria

O caminho principal ja esta integrado com pacotes visuais autorais ate o `Cassino Mé Maior`. As vitorias definitivas de bar e circuito usam `src/assets/campaign-victories/`; se o ultimo bar de um circuito for concluido, o fluxo mostra primeiro a conquista definitiva do bar e depois a conquista definitiva do circuito.

## Proximo Plano de Execucao

1. gerar prompts para o nivel bonus `Circuito Intergaláctico` / `Órbita da Lua`
2. manter a etapa de prompts antes de implementar assets
3. para o bonus, gerar os 8 assets de costume e tambem imagens pequenas dos adversarios
4. manter a dupla bonus `Mane Banguela` + `Cosme Orbita`
5. evitar qualquer direcao assustadora: sem ETs ameaçadores, monstros, horror, gore ou criaturas grotescas
6. preferir um humor cosmico brasileiro, retrofuturista, colorido e truqueiro, com adversarios humanos/caricatos e simpaticamente estranhos
7. depois do pacote bonus aprovado, retomar as pendencias de regras e tutorial descritas em `docs/NEXT_STEPS.md`

Nota visual: o caminho principal evoluiu de botecos populares para eventos oficiais, arenas, torneios internacionais e cassino de luxo. O bonus deve parecer uma virada de tom intencional, divertida e especial, sem reciclar simplesmente a estetica dos ultimos campeonatos.

## Progressao de Parceiros

- `4` parceiros iniciais ficam disponiveis antes da primeira conquista:
  - `nega-catimbo`
  - `leninha-lambreta`
  - `rita-gambiarra`
  - `joca-busao`
- nenhum parceiro inicial aparece como adversario em bar futuro
- ao conquistar um bar, os dois adversarios daquele local sao persistidos como novas opcoes de parceria
- o catalogo completo permanece navegavel na tela de selecao, mas personagens ainda nao derrotados aparecem bloqueados

## Tabela do Caminho Principal

| Fase / circuito | Bar / fase | Tema visual | Ambiente | Variante | Dificuldade | Dupla adversaria | Vitorias | Estado visual minimo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Botecos da Rua | Bar do Ze Catinga | Boteco raiz fotografico | Paredes gastas, piso engordurado e TV velha | Mineiro | 1/5 | Tiao Casca Grossa + Cida Fumaca | 3 | Campanha, capa, background e resultado autorais |
| Botecos da Rua | Bar Maneco Banguela | Boteco raiz claro | Metal, copos batendo e domino | Paulista | 1/5 | Tonhao Rasga-Lata + Patricia Monique | 4 | Campanha, capa, background e resultado autorais |
| Campeonato da Vila Naná | Trem do Jaça | Madeira suja | Trem de vila com provocacao antiga | Mineiro | 2/5 | Naldo Tramela + Dalva Seringa | 5 | Campanha, capa, background, mesa e resultado autorais |
| Campeonato da Vila Naná | Adega do Juca Bigode | Metal de patio | Luz improvisada, balcão de metal e plateia apertada | Paulista | 2/5 | Biu Caolho + Aninha Passarela | 6 | Campanha, capa, background, mesa e resultado autorais |
| Conquista das Zonas | Garagem Norte | Industrial | Ferro, concreto e fumaca | Mineiro | 3/5 | Dito Marrua + Celsinho Breque | 4 | Campanha, capa, background, mesa e resultado autorais |
| Conquista das Zonas | Quintal da Leste | Festival de rua | Partida cheia e conversa alta | Paulista | 3/5 | Rosinha Catraca + Damiao Corote | 5 | Campanha, capa, background, mesa e resultado autorais |
| Conquista das Zonas | Subsolo do Centro | Underground | Bar escondido e calculista | Mineiro | 3/5 | Norberto Fuba + Quiteria Mao-Torta | 6 | Campanha, capa, background, mesa e resultado autorais |
| Conquista das Zonas | Salao da Sul | Premium de esquina | Boteco arrumado com malandragem local | Paulista | 3/5 | Ivone Verniz + Marlene Pimenta | 5 | Campanha, capa, background, mesa e resultado autorais |
| Campeonato Municipal | Centro de Convenções da Prefeitura | Evento urbano | Publico maior e rivais conhecidos | Paulista | 4/5 | Jura Pancada + Osmar Alfinete | 6 | Campanha, capa, background, mesa e resultado autorais |
| Campeonato Estadual | Ginásio Estadual Maneco Filé | Classico regional | Evento organizado e narrador local | Paulista | 4/5 | Geraldo Medalha + Zito Parafuso | 6 | Campanha, capa, background, mesa e resultado autorais |
| Campeonato Nacional | Arena Nacional | Arena com transmissao | Plateia grande e pressao publica | Paulista | 4/5 | Sueli Estopim + Creusa Rabugenta | 7 | Campanha, capa, background, mesa e resultado autorais |
| Circuito Panamericano | Centro Americano Truqueiro de Medelin. | Show continental | Producao moderna e estilos diferentes | Mineiro | 4/5 | Ramiro Bolero + Luna Candela | 5 | Campanha, capa, background, mesa e resultado autorais |
| Jogos Mundiais | Hotel Truco de Segóvia, Espanha | Esportivo cerimonial | Bandeiras, delegacoes e tensao maxima | Paulista | 5/5 | Mina Compasso + Viktor Muralha | 4 | Campanha, capa, background, mesa e resultado autorais |
| Mundial | Cassino Mé Maior | Cassino de luxo | Veludo, lustres e silencio tenso | Paulista | 5/5 | Madame Violeta + Augusto Crupie | 5 | Campanha, capa, background, mesa e resultado autorais |

## Pos-Campanha Reservado

O `Circuito Intergaláctico` agora e a proxima frente apos a conclusao visual do caminho principal. Ele deve ser tratado como nivel bonus especial, nao como continuacao literal dos campeonatos oficiais.

Assets esperados para `Órbita da Lua`:

- mesa de truco
- ambiente/background
- tela de campanha
- host/organizador do local
- vitoria normal da partida
- derrota normal da partida
- vitoria definitiva do local
- vitoria definitiva do circuito bonus
- imagens pequenas dos adversarios para a gameplay/roster

Dupla reservada para `Órbita da Lua`:

- `Mane Banguela`
- `Cosme Orbita`

Direcao criativa obrigatoria:

- nada assustador
- nada de ET monstruoso, criatura grotesca, terror, horror corporal ou ameaça alienigena
- os adversarios podem ser humanos excentricos, cosplayers cosmicos, operadores de evento lunar, artistas de truco espacial ou figuras retrofuturistas simpaticamente estranhas
- o humor deve ser brasileiro, truqueiro e visualmente encantador
- a mesa deve continuar legivel para gameplay e com centro livre para cartas

## Estado do Roster

- quatro avatares de perfis ja cadastrados foram concluidos:
  - `jura-pancada`
  - `marlene-pimenta`
  - `zito-parafuso`
  - `creusa-rabugenta`
- `11` novos personagens foram adicionados para eliminar repeticoes no caminho principal e no bonus
- cada bar agora possui dupla adversaria exclusiva
- a dupla de cada bar agora e liberada como parceria depois da conquista daquele local
- desbloqueios de parceria ficam persistidos no perfil

Proxima frente:

- gerar prompts do pacote visual bonus
- depois implementar apenas as imagens aprovadas pelo usuario
- na sequencia, retomar regras pendentes e tutorial
