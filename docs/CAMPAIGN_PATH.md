# Caminho Principal da Campanha

## Regra de Expansao Vertical

Cada bar deve entrar primeiro como pacote jogavel minimo:

- dados completos em `src/career/campaign/campaignData.ts`
- dupla adversaria fixa e exclusiva daquele bar
- nenhum adversario deve se repetir em outro bar
- variante, dificuldade e numero de vitorias definidos
- campanha, capa e resultado genericos aceitos como fallback
- tema de mesa reaproveitado quando ainda nao houver arte propria

O caminho principal ja esta integrado com pacotes visuais autorais ate o `Cassino Mé Maior`, e o bonus pos-campanha `Circuito Intergaláctico` / `Órbita da Lua` tambem esta integrado como ultima etapa do jogo. As vitorias definitivas de bar e circuito usam `src/assets/campaign-victories/`; se o ultimo bar de um circuito for concluido e houver vitoria definitiva de bar cadastrada, o fluxo mostra primeiro a conquista definitiva do bar e depois a conquista definitiva do circuito.

## Estado Pos-Campanha

- o caminho principal termina no `Cassino Mé Maior`
- depois do mundial, o bonus `Circuito Intergaláctico` libera a `Órbita da Lua`
- a tela de campanha da `Órbita da Lua` e a ultima etapa do jogo e nao tem `next venue`
- a dupla bonus e `Mané Banguela` + `Cosme Órbita`
- o bonus usa campanha, background, host, mesa, vitoria/derrota normal e vitorias definitivas de local/circuito autorais
- ao concluir a `Órbita da Lua`, o fluxo mostra primeiro a conquista do local e depois a conquista do circuito
- depois da campanha concluida, `COMEÇAR` abre o `Modo Livre`
- o `Modo Livre` usa `src/assets/campaign/free-play-circuit-hub.png`
- cada circuito no hub e um hotspot invisivel
- clicar em um circuito inicia uma run temporaria daquele circuito
- a run temporaria começa no primeiro bar e avanca para o proximo bar ao cumprir as vitorias do local
- concluir o ultimo bar do circuito livre retorna ao hub do `Modo Livre`
- o `Voltar` da tela autoral retorna ao hub do `Modo Livre` e encerra a run temporaria
- a run temporaria nao altera progresso, recompensas ou desbloqueios da campanha principal ja concluida
- `Recomeçar campanha` usa confirmacao interna do jogo
- a proxima frente deve ser balanceamento de IA com testes, conforme `docs/NEXT_STEPS.md`

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
| Circuito Intergaláctico | Órbita da Lua | Bonus lunar retrofuturista | Clube orbital improvisado, neon, bandeirolas e transmissao ao vivo | Mineiro | 5/5 | Mané Banguela + Cosme Órbita | 7 | Campanha, capa, background, mesa, resultado e vitoria de circuito autorais |

## Bonus Pos-Campanha Integrado

O `Circuito Intergaláctico` e o nivel bonus especial depois da conclusao visual do caminho principal. Ele deve ser tratado como recompensa pos-campanha, nao como continuacao literal dos campeonatos oficiais.

Assets integrados para `Órbita da Lua`:

- campanha: `src/assets/campaign/circuito-intergalactico-orbita-da-lua.png`
- background: `src/assets/venues/orbita-da-lua/background.png`
- host/organizador: `src/assets/venues/orbita-da-lua/host-orbita-da-lua.png`
- mesa de truco: `src/assets/boteco/table-top-orbita-da-lua.png`
- vitoria normal da partida: `src/assets/venues/orbita-da-lua/match-result-win.png`
- derrota normal da partida: `src/assets/venues/orbita-da-lua/match-result-loss.png`
- vitoria definitiva do local: `src/assets/campaign-victories/venue-orbita-da-lua.png`
- vitoria definitiva do circuito bonus: `src/assets/campaign-victories/stage-intergalactico.png`
- adversarios: `src/assets/characters/mane-banguela.png` e `src/assets/characters/cosme-orbita.png`

Dupla da `Órbita da Lua`:

- `Mané Banguela`
- `Cosme Órbita`

Observacoes:

- a campanha do bonus nao deve sugerir etapa seguinte
- a `Órbita da Lua` esta cadastrada como vitoria definitiva de local

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

- rebalancear IA com testes
- depois da primeira rodada de IA, retomar regras pendentes e tutorial
