# Layout Rules

## Objetivo

Este arquivo documenta as regras já consolidadas do layout principal do jogo para reduzir retrabalho e manter consistência visual entre iterações.

## Estrutura Geral

- A tela principal é uma `tela de celular em landscape`.
- O layout deve se resolver `dentro da tela do celular`.
- Elementos externos podem existir temporariamente para debug, mas não fazem parte da experiência final.
- A gameplay deve se comportar como um `stage de jogo`:
  - composicao interna previsivel
  - proporcao controlada
  - escala aplicada no conjunto quando o viewport externo muda
  - sem reflow livre dos blocos principais a cada mudanca de tamanho da janela

## Composição Atual

### Coluna Esquerda

- Bloco superior com os 4 jogadores da mesa.
- O jogador humano aparece como `Você`.
- A parceira aparece como `Parceira`.
- Oponentes aparecem como `Adversário esquerdo` e `Adversário direito`.
- Abaixo fica o `Score Pad`.

### Centro

- A mesa é o centro absoluto da experiência.
- As cartas jogadas ficam na mesa.
- A mão do jogador humano fica integrada abaixo da mesa.
- Não manter pilhas viradas permanentes visíveis na gameplay normal.
- Animações de distribuição entre rodadas podem usar cartas viradas para baixo.

### Coluna Direita

- Bloco superior `Valendo`.
- Bloco central com contexto da partida.
- Bloco inferior com ações de truco.
- O fundo estrutural da coluna deve deixar o cenário aparente.
- Os widgets da coluna podem usar madeira/couro como objetos da cena.

## Regras Visuais

- A UI deve parecer `cena`, não painel genérico de app.
- Materiais preferidos:
  - couro envelhecido
  - madeira escura
  - metal gasto
  - papel amarelado
- A mesa precisa continuar dominante.
- Elementos de HUD devem ser encaixados como objetos do ambiente.

## Regras da Coluna Direita

- `Valendo` usa placa clara.
- O bloco central usa placa de madeira/moldura.
- O bloco central hoje mostra apenas:
  - `Etapa`
  - `Endereço`
- Os botões de ação usam asset de madeira.
- A label `Ações` foi removida.

## Regras da Coluna Esquerda

- O bloco de jogadores deve continuar compacto.
- O placar atual usa scorepad em formato de caderno.
- O scorepad está funcional e relativamente consolidado.
- As labels do scorepad (`Nos`, `Eles`, `Mao`, `Mao`) nao podem se sobrepor aos numeros nem entre si.
- Ajustes no scorepad devem priorizar grid interno previsivel, alturas fixas/controladas e separacao clara entre placar da partida e placar da mao.
- Evitar mexer nele junto com mudanças grandes de layout.
- Estado atual:
  - sobreposicao das labels com os numeros foi corrigida
  - placar da partida e placar da mao estao separados por grid interno
  - asset `src/assets/ui-left/scorepad-notebook-clean-cut.png` preservado

## Regras da Área do Jogador

- As cartas da mão do humano devem exibir cor correta por naipe:
  - copas e ouros em vermelho
  - espadas e paus em escuro
- A mão precisa permanecer visível mesmo em telas mais apertadas.

## Regras de Encaixe

- O layout master deve ser fechado antes do polimento responsivo final.
- Ajustes devem priorizar:
  - proporção
  - legibilidade
  - hierarquia visual
- Evitar solução por remendo visual quando o problema for asset ruim ou recorte ruim.

## Regras de Responsividade da Gameplay

- A gameplay consolidada usa stage logico `1080x500` dentro da moldura.
- A tela interna deve manter resolucao logica fixa ou fortemente controlada.
- O navegador pode mudar de tamanho, mas a composicao interna da moldura deve manter proporcao e hierarquia.
- Preferir escalar a gameplay inteira como unidade.
- Aceitar letterbox/pillarbox quando a proporcao do device for diferente.
- Evitar medidas baseadas diretamente em `vw` e `dvh` dentro dos elementos internos da gameplay.
- `vw`, `dvh` e calculos similares podem existir no wrapper externo que encaixa a moldura na janela.
- Dentro da gameplay, preferir:
  - grid com trilhas previsiveis
  - dimensoes relativas ao stage/container
  - areas com proporcao fixa
  - poucos modos controlados (`regular`, `compact`, `tiny`)
- A faixa da mao deve manter cartas e botao `MENU` visiveis dentro da moldura.
- O popover do `MENU` pode sair da faixa da mao, mas deve ficar acima da mesa.
- Menus de contexto devem fechar antes de abrir modal de confirmacao.
- O menu de contexto da partida pode conter as acoes `Vencer esta partida` e `Perder esta partida` como atalhos de validacao de resultado/progressao.
- O menu de contexto da partida pode conter a acao `Resetar progresso`, mas ela sempre deve abrir confirmacao antes de apagar dados salvos.
- Nao resolver responsividade movendo elementos isolados com transforms compensatorios quando o problema for escala global da tela.

## Regras da Intro de Gameplay

- Antes de cada partida, existe uma intro visual curta dentro da moldura.
- A intro exibe apenas o background do bar por cerca de 1 segundo.
- Em seguida, mesa, HUDs, oponentes e cartas entram com fade curto.
- A interacao com cartas, truco e `MENU` fica bloqueada ate a intro terminar.
- A intro reutiliza o background do local atual quando houver asset proprio.
- A intro nao altera regras de truco, estado da partida, placares ou progressao da campanha.
- Evitar animacoes longas; a experiencia deve dar atmosfera sem atrasar o jogador.
- Nao reabrir a responsividade estrutural da gameplay para ajustar essa intro sem regressao real.

## Regras da Tela Inicial

- A tela inicial atual usa arte autoral definitiva em `src/assets/start/truco-raiz-start.png`.
- A primeira tela preserva a moldura landscape e o clima visual de boteco ja consolidado.
- `COMEÇAR` deve continuar levando ao fluxo `campanha > capa do bar > escolha de parceira se necessario > jogo`.
- A tela inicial nao deve substituir a tela de campanha nem a capa do bar; ela e a porta de entrada anterior ao fluxo.
- O botao `COMEÇAR` deve ser um controle HTML real sobre a placa desenhada na arte.
- A arte deve aparecer inteira no stage; se a proporcao nao bater, usar preenchimento visual sem cortar logo ou botao.
- Debug de bar, reset de progresso e selecao de variante nao devem dominar a primeira tela visivel.
- Evitar reabrir responsividade da gameplay ou selecao de parceira enquanto a tela inicial estiver sendo trabalhada.

## Regras das Telas de Resultado

- Cada bar pode ter arte propria de vitoria e derrota.
- As artes atuais de resultado ocupam a tela inteira de resultado dentro da moldura.
- A acao `VOLTAR AO FLUXO DE BARES` continua sendo um controle real por cima da placa desenhada na arte.
- Resultado autoral nao deve embutir placar numerico especifico no texto ou na composicao principal.
- Rabiscos e marcadores de boteco podem existir como decoracao quando nao forem placar real do resultado.
- Bares sem arte propria continuam usando a tela generica de fallback.

## Regras da Capa do Bar

- A capa do bar acontece dentro da mesma moldura de celular em landscape.
- A capa deve ser uma tela propria, nao uma variacao da gameplay screen.
- O conteudo interno da capa deve se comportar como composicao fixa dentro da moldura.
- Evitar fontes e espaçamentos baseados em `vw`, porque isso faz a arte mudar quando a janela do navegador muda.
- Preferir medidas previsiveis, grid com colunas controladas e blocos com altura definida.
- A capa do bar fala apenas do bar selecionado, nao da campanha inteira.
- A tela de campanha e a capa do bar sao etapas diferentes do fluxo.

## Regras da Tela de Campanha

- A tela de campanha acontece antes da capa do bar.
- Para os estados atuais do caminho principal e do bonus pos-campanha, usar artes autorais em `src/assets/campaign/`.
- A arte autoral pode conter textos, placas e ilustrações ja renderizados.
- Controles de fluxo sobre arte autoral devem ser botoes HTML invisiveis posicionados por percentual.
- Os hotspots atuais sao `VOLTAR`, `ENTRAR NO BAR` e `TROCAR PARCEIRA`.
- A tela de campanha do `Circuito Intergaláctico` / `Órbita da Lua` e a ultima etapa do jogo; nao deve mostrar ou sugerir `next venue`.
- A tela dinamica de campanha continua como fallback para bares ou estados sem arte propria.

## Regras do Modo Livre Pos-Campanha

- O `Modo Livre` aparece depois que a campanha inteira foi concluida.
- A tela usa arte full-screen em `src/assets/campaign/free-play-circuit-hub.png`.
- Os circuitos sao botoes HTML invisiveis posicionados sobre os cards desenhados na arte.
- Nao desenhar borda de selecao, dock inferior ou labels HTML por cima dos cards; os textos ja vivem na imagem.
- Ao clicar em um circuito, abrir a tela autoral de campanha do primeiro bar daquele circuito quando houver arte cadastrada.
- O `Voltar` dessa tela autoral deve retornar ao hub do `Modo Livre`.
- O botao `Recomeçar campanha` deve abrir confirmacao dentro do stage do jogo, nunca `window.confirm` ou alerta nativo do navegador.

### Estrutura da Capa do Ze Catinga

- Coluna esquerda:
  - dono do bar
  - lousa com frase do dono
  - nome/role do dono, se houver espaço
- Coluna central:
  - nome do bar
  - endereco
  - descricao curta
  - adversarios fixos
  - dificuldade do desafio abaixo dos adversarios
- Coluna direita:
  - HUD de estatisticas do bar
  - botao `ENTRAR NO BAR`

### Pendencias da Capa do Ze Catinga

- Capa refinada e salva no Git.
- Manter a coluna direita centralizada.
- Manter `Dificuldade do desafio` ampliada abaixo dos adversarios.
- Manter a lousa do dono e o botao `ENTRAR NO BAR` protegidos contra estouro.

## Decisões Já Tomadas

- O jogo deve se resolver dentro da tela do celular.
- A tela principal final é cenográfica.
- A mesa é protagonista.
- O fluxo de truco e as ações principais ficam dentro da tela.
- A variante Paulista tem representação visual da vira na mesa.

## Pendências Visuais

- A tela de selecao de parceira foi aceita como pronta no estado atual; reabrir apenas com regressao ou nova decisao de produto.
- Os locais do caminho principal e o bonus ja possuem pacote visual autoral no estado atual.
- Refinar a mesa central apenas conforme novos assets aprovados chegarem ou se houver regressao visual.
- Fazer polimento responsivo final apenas se aparecer regressao concreta em viewports reais.
- Novas capas/telas autorais agora sao assunto de expansoes futuras, nao pendencia do caminho principal atual.
