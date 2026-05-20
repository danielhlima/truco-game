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

- O proximo ajuste estrutural deve estabilizar a moldura da gameplay antes de novos polimentos visuais.
- A tela interna deve ter uma resolucao logica fixa ou fortemente controlada.
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
- Nao resolver responsividade movendo elementos isolados com transforms compensatorios quando o problema for escala global da tela.

## Regras da Capa do Bar

- A capa do bar acontece dentro da mesma moldura de celular em landscape.
- A capa deve ser uma tela propria, nao uma variacao da gameplay screen.
- O conteudo interno da capa deve se comportar como composicao fixa dentro da moldura.
- Evitar fontes e espaçamentos baseados em `vw`, porque isso faz a arte mudar quando a janela do navegador muda.
- Preferir medidas previsiveis, grid com colunas controladas e blocos com altura definida.
- A capa do bar fala apenas do bar selecionado, nao da campanha inteira.
- A tela de campanha e a capa do bar sao etapas diferentes do fluxo.

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

- Estabilizar responsividade da gameplay quando a janela do navegador muda de tamanho.
- Refinar a mesa central conforme novos assets chegarem.
- Fazer polimento responsivo final depois do layout aprovado.
- Expandir o modelo da capa do `Bar do Ze Catinga` para outros bares quando a gameplay estiver estabilizada.
