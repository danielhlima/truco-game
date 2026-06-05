# Caminho Principal da Campanha

## Regra de Expansao Vertical

Cada bar deve entrar primeiro como pacote jogavel minimo:

- dados completos em `src/career/campaign/campaignData.ts`
- dupla adversaria fixa e exclusiva daquele bar
- nenhum adversario deve se repetir em outro bar
- variante, dificuldade e numero de vitorias definidos
- campanha, capa e resultado genericos aceitos como fallback
- tema de mesa reaproveitado quando ainda nao houver arte propria

O `Bar Maneco Banguela` e o primeiro bar-modelo depois do `Bar do Ze Catinga`: ele ja possui campanha, capa e background autorais, mas continua usando fallback generico para resultado.

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
| Botecos da Rua | Bar Maneco Banguela | Boteco raiz claro | Metal, copos batendo e domino | Paulista | 1/5 | Tonhao Rasga-Lata + Patricia Monique | 4 | Campanha, capa e background autorais; resultado em fallback |
| Circuito do Bairro | Mercearia Central | Madeira suja | Mercearia organizada com provocacao antiga | Mineiro | 2/5 | Naldo Tramela + Dalva Seringa | 5 | Fallback com mesa tematica de madeira |
| Circuito do Bairro | Arena do Largo | Metal de patio | Luz improvisada, musica e plateia apertada | Paulista | 2/5 | Biu Caolho + Aninha Passarela | 6 | Fallback com mesa tematica de patio |
| Conquista das Zonas | Garage Norte | Industrial | Ferro, concreto e fumaca | Mineiro | 3/5 | Dito Marrua + Celsinho Breque | 4 | Fallback industrial |
| Conquista das Zonas | Quintal da Leste | Festival de rua | Partida cheia e conversa alta | Paulista | 3/5 | Rosinha Catraca + Damiao Corote | 5 | Fallback noturno de festival |
| Conquista das Zonas | Subsolo do Centro | Underground | Bar escondido e calculista | Mineiro | 3/5 | Norberto Fuba + Quiteria Mao-Torta | 6 | Fallback underground |
| Conquista das Zonas | Salao da Sul | Premium de esquina | Boteco arrumado com malandragem local | Paulista | 3/5 | Ivone Verniz + Marlene Pimenta | 5 | Fallback premium |
| Campeonato da Cidade | Centro de Convencoes Urbano | Evento urbano | Publico maior e rivais conhecidos | Paulista | 4/5 | Jura Pancada + Osmar Alfinete | 6 | Fallback de evento urbano |
| Campeonato Estadual | Ginasio Estadual | Classico regional | Evento organizado e narrador local | Paulista | 4/5 | Geraldo Medalha + Zito Parafuso | 6 | Fallback classico de campeonato |
| Campeonato Nacional | Arena Nacional | Arena com transmissao | Plateia grande e pressao publica | Paulista | 4/5 | Sueli Estopim + Creusa Rabugenta | 7 | Fallback de arena com transmissao |
| Circuito Panamericano | Centro Panamericano | Show continental | Producao moderna e estilos diferentes | Mineiro | 4/5 | Ramiro Bolero + Luna Candela | 5 | Fallback de evento continental |
| Jogos Mundiais | Arena das Delegacoes | Esportivo cerimonial | Bandeiras, delegacoes e tensao maxima | Paulista | 5/5 | Mina Compasso + Viktor Muralha | 4 | Fallback cerimonial esportivo |
| Mundial do Cassino | Mesa Principal | Cassino de luxo | Veludo, lustres e silencio tenso | Paulista | 5/5 | Madame Violeta + Augusto Crupie | 5 | Fallback de cassino |

## Pos-Campanha Reservado

O `Circuito Intergalactico` continua no codigo como conteudo bonus posterior. Ele nao deve orientar o polimento do caminho principal antes de os 14 locais acima estarem jogaveis e validados.

Dupla reservada para `Orbita da Lua`:

- `Mane Banguela`
- `Cosme Orbita`

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

- implementar depois a escolha da skin visual do jogador
