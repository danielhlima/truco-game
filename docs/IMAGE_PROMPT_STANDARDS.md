# Padroes de Prompts de Imagem

Este arquivo registra o padrao de prompts que funcionou melhor para os assets autorais do `truco-game`.

Use este documento antes de gerar prompts para novos bares, circuitos ou telas definitivas. Os primeiros prompts muito soltos deram resultados inconsistentes; daqui em diante, cada prompt deve ser estruturado, especifico e com restricoes claras.

## Estrutura Obrigatoria

Todo prompt de asset deve seguir esta estrutura:

1. frase inicial com formato, dimensao e finalidade do asset
2. `Scene` ou `Subject`
3. `Visual direction`
4. requisitos de gameplay ou composicao
5. `Restrictions`

Nao gerar prompts curtos demais. O gerador precisa receber contexto de uso no jogo, identidade do local, composicao esperada e o que nao deve aparecer.

## Dimensoes Padrao

- mesa de gameplay: `780 x 780`
- background/ambiente: `1672 x 941`
- tela de campanha: `1672 x 941`
- host/dono/personagem: quadrado, idealmente `1024 x 1024` ou maior
- resultado de partida, vitoria/derrota: `1672 x 941`
- vitoria definitiva de bar/circuito: `1672 x 941`

## Regras Gerais

- manter leitura clara para jogo
- preservar centro livre nas mesas para cartas animadas
- nao colocar pessoas, cartas ou maos na area central da mesa
- objetos de mesa devem ficar apenas nas bordas
- nao cortar texto, placas, trofeus, personagens ou objetos principais
- nao usar logos reais, marcas registradas ou rotulos reconheciveis
- evitar estetica generica de bar gringo
- evitar visual moderno demais, limpo demais ou corporativo demais
- em telas com texto, pedir texto grande, legivel, inteiro e nao cortado
- em telas de resultado, manter a placa `VOLTAR AO FLUXO DE BARES`
- telas autorais devem parecer imagem full-screen, nao UI moderna

## Prompts Bons Como Referencia

### Mesa de Gameplay

```text
Create a 780 x 780 PNG image for a Brazilian truco game table asset, analogous in purpose to `table-top-trem-jaca.png`.

Subject:
A top-down / slightly angled tabletop for the venue “[NOME DO LOCAL]”.

Visual direction:
- [Material principal da mesa], worn but readable.
- Surface should feel like [identidade do local]: [detalhes fisicos do ambiente].
- Include subtle props around the edges only: [lista de objetos coerentes].
- Center of the table must remain mostly clear for cards.
- Dirty, lived-in, Brazilian, semi-photographic, textured, not cartoon.

Gameplay requirements:
- No people.
- No text in the central playable area.
- No cards already on the center of the table.
- No visible background behind the tabletop.
- Must work as a table texture under animated playing cards.
- Keep the center readable and not too busy.
- Avoid very dark lighting, casino look, stadium look, fantasy look, or modern app UI.
```

Observacao: mesa nao e background. O prompt precisa dizer explicitamente que nao deve haver fundo/cenario, apenas o tampo da mesa.

### Ambiente / Background

```text
Create a 1672 x 941 PNG background image for a Brazilian truco game venue called “[NOME DO LOCAL]”.

Scene:
[Descricao curta do tipo de lugar], brighter than a dark dive bar but still old, dirty and full of character.

Visual direction:
- [Tipo de ambiente brasileiro].
- Include [lista de elementos cenograficos especificos].
- Warm daylight mixed with fluorescent ceiling light.
- More illuminated and breathable than the first two bars, but still worn, greasy, scratched and authentic.
- No luxury, no clean supermarket, no modern cafe.
- Should feel like a place where people [uso cotidiano do local] and play truco near [ponto focal].
- Color palette: [cores principais].
- Leave enough visual depth and negative space so the game table and HUD can sit over it.

Restrictions:
- No people in the foreground.
- No readable brand logos.
- No UI panels, no buttons, no cards floating in the air.
- No gloomy horror lighting.
- No casino, no stadium, no futuristic elements.
```

### Host / Dono Do Local

```text
Create a square 1:1 PNG character portrait for the host of the venue “[NOME DO LOCAL]”.

Character:
[Descricao do personagem], around [idade], [temperamento]. Looks like someone who [relacao com o local e com truco].

Visual direction:
- Semi-realistic mobile game portrait, matching the Truco Raiz character roster.
- Bust portrait, head and shoulders, facing forward.
- Clothing and details should match [identidade do local].
- Friendly but intimidating in a local, believable way.
- Lighting should match the venue identity.
- Background should be simple and muted, suggesting [elementos do local] without too much detail.

Restrictions:
- No text, no logo, no watermark.
- No playing cards in hand.
- No exaggerated cartoon style.
- No luxury clothing.
```

### Tela De Campanha

```text
Create a 1672 x 941 PNG campaign map screen for the current campaign venue “[NOME DO LOCAL]”, in the circuit “[NOME DO CIRCUITO]”.

Use the existing campaign screens as structural reference:
- Full-screen authored image.
- Designed for invisible HTML hotspots over the art.
- Must clearly show the current venue and progression route.

Content to include in the art:
- Circuit title: “[NOME DO CIRCUITO]”
- Current venue: “[NOME DO LOCAL]”
- Previous area reference: “[LOCAL ANTERIOR]”
- Next venue hint: “[PROXIMO LOCAL]”
- Main action plaque: “ENTRAR NO BAR”
- Secondary action plaque: “TROCAR PARCEIRA”
- Back control: “VOLTAR”

Visual direction:
- [Identidade visual do circuito].
- Motifs: [objetos, arquitetura, sinais, placas].
- Still dirty, worn and popular, but readable.
- Use [tipo de luz e paleta].
- The screen should feel like a playable campaign board, not a marketing poster.

Restrictions:
- No modern UI buttons.
- No clean corporate design.
- No fantasy map.
- Text must be large, readable, and not cropped.
```

### Resultado De Partida

```text
Create a 1672 x 941 PNG match result victory screen for the Truco Raiz venue “[NOME DO LOCAL]”.

Use the authored result screens from previous venues as composition reference:
- Full-screen illustrated/photographic scene.
- Central handmade sign/plaque with result text.
- Large bottom plaque for the return action.

Text to include:
- “VITÓRIA NA MESA”
- “VOCÊS LEVARAM ESSA”
- “[NOME DO LOCAL]”
- Host quote: “[FALA DO HOST]”
- Bottom plaque: “VOLTAR AO FLUXO DE BARES”

Visual direction:
- [Identidade do local] result screen.
- Include [objetos cenograficos coerentes].
- Dirty and authentic, but not dark or scary.
- Central sign should look hand-painted, aged, and integrated into the scene.
- Victory tone should feel local, cheeky and earned.

Restrictions:
- No numeric score.
- No UI button style.
- No modern blue button.
- No people in foreground.
- Text must be correct, large and readable.
```

Para derrota, manter a mesma estrutura e trocar:

- “VITÓRIA NA MESA” por “DERROTA NA MESA”
- frase principal por uma piada/derrota local
- paleta ligeiramente mais vermelha ou pesada, sem ficar escura demais

## Referencia Ja Consolidada: Campeonato Municipal

O `Campeonato Municipal` marcou a mudanca de escala da campanha: a identidade visual deixou de parecer bar pequeno e passou para ambientes publicos, oficiais e populares.

Direcao geral:

- ambiente maior, mais claro e mais institucional
- ginásio municipal, centro de convenções, quadra coberta, salão de evento público ou arena comunitária
- ainda popular, gasto, sujo e brasileiro
- nao luxuoso, nao corporativo, nao moderno demais
- iluminacao mais clara que os bares e mais ampla que a `Conquista das Zonas`
- pode ter arquibancadas, piso de quadra gasto, faixas, cadeiras plasticas, mesa de jurados, placar manual, trofeus, banners municipais ficticios, ventiladores, fluorescentes, portas abertas, publico ao fundo sem destaque
- a sujeira deve vir de uso intenso, tinta descascada, fita crepe, cartazes velhos, marcas no piso e estrutura cansada, nao de boteco escuro

Para o `Centro de Convenções da Prefeitura`, pensar em:

- evento municipal de truco em um centro de convenções antigo de prefeitura
- palco pequeno ou mesa oficial no fundo
- banners ficticios de campeonato, sem brasao real
- cadeiras plasticas e mesas dobraveis
- luz branca/fluorescente, portas laterais abertas, ambiente amplo e legivel
- trofeu mais presente nas telas definitivas, porque agora o torneio tem cara oficial

Evitar no Campeonato Municipal:

- balcão de bar como elemento principal
- adega, garrafas e engradados como identidade dominante
- clima de boteco apertado
- luxo de cassino
- arena profissional moderna demais
- marcas reais, logos, prefeitura real ou patrocinadores reais

## Proximo Nivel: Bonus Pos-Campanha

O proximo pacote de prompts deve ser para o nivel bonus `Circuito Intergaláctico`, local `Órbita da Lua`.

Este nivel deve parecer uma recompensa especial depois do caminho principal, com mudanca clara de tom. Ele pode ser cosmico, retrofuturista, colorido e teatral, mas ainda precisa parecer `Truco Raiz`: mesa jogavel, humor brasileiro, provocacao de truco e personagens com personalidade.

Assets esperados:

- mesa de truco, `780 x 780`
- ambiente/background, `1672 x 941`
- tela de campanha, `1672 x 941`
- host/organizador do evento, quadrado `1024 x 1024` ou maior
- tela de vitoria normal da partida, `1672 x 941`, com `VOLTAR AO FLUXO DE BARES`
- tela de derrota normal da partida, `1672 x 941`, com `VOLTAR AO FLUXO DE BARES`
- tela de vitoria definitiva de `Órbita da Lua`, `1672 x 941`, com trofeu ou marco visual equivalente
- tela de vitoria definitiva do `Circuito Intergaláctico`, `1672 x 941`, com trofeu ou marco visual equivalente
- imagens pequenas dos adversarios do bonus para gameplay/roster

Direcao obrigatoria:

- nao assustador
- nao usar ETs ameacadores, monstros, terror, gore, body horror ou criaturas grotescas
- se houver figuras cosmicas, elas devem ser humanas, performers, organizadores excentricos, cosplayers espaciais, truqueiros retrofuturistas ou caricaturas simpaticas
- manter legibilidade de gameplay acima do espetaculo visual
- a mesa precisa ter centro livre, sem maos, cartas extras, personagens ou cenario ao fundo
- as telas de resultado devem ser bem diferentes das telas de campeonato/cassino ja feitas, para preservar a vontade do jogador de ver a proxima conquista

Possiveis motivos visuais:

- clube lunar improvisado, base cenografica de baixa gravidade, auditório espacial brasileiro, observatorio popular, transmissao pirata de truco orbital
- luzes neon controladas, paineis analogicos, adesivos ficticios, bandeirolas espaciais, fitas metalicas, estrelas pintadas, capacetes como objeto cenografico sem esconder rostos
- humor de boteco levado ao espaco, sem virar horror ou ficcao cientifica fria

Restricoes negativas para todos os prompts do bonus:

- no scary alien, no monster, no horror, no grotesque creature
- no real space agency logo, no NASA logo, no official mission patch, no real brand
- no astronauts with opaque helmets as main characters
- no text cropped, no trophy cropped, no important object cropped
- no modern app UI, no generic sci-fi interface, no cyberpunk excess
- no extra hands, no extra playing cards in the playable center of the table

## Checklist Antes De Entregar Prompts

- O prompt tem dimensao correta?
- O prompt diz exatamente que tipo de asset sera gerado?
- O prompt cita o local e o circuito corretos?
- O prompt diferencia o novo circuito dos bares anteriores?
- O prompt tem restricoes negativas claras?
- No caso de mesa, o prompt proibe fundo/cenario?
- No caso de campanha/resultado, todos os textos estao listados explicitamente?
- O visual esta mais claro quando o circuito pede isso?
