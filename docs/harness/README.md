# Harness multiagente do Truco Raiz

Este diretório registra o contexto persistente do Harness. Ele complementa as
instruções em `AGENTS.md`; não substitui o GitHub como fonte de verdade para o
estado de tarefas quando a integração estiver disponível.

## Leitura para um novo chat

1. `AGENTS.md`
2. `docs/README.md` e os documentos de produto indicados ali
3. Este arquivo
4. `arquitetura.md`, `papeis.md`, `fluxo.md` e `github.md`
5. `github-autonomia.md` quando a demanda usar GitHub
6. `decisoes.md` e `atividades-pendentes.md`
7. Estado atual do Git e, quando disponível, Issues e Pull Requests autorizados

## Estrutura e limites

- `.agents/skills/truco-po/SKILL.md` é a skill local reconhecível para o
  workflow recorrente do PO.
- O ambiente é quem oferece a delegação real; arquivos deste repositório não
  habilitam nem simulam subagentes.
- GitHub é a fonte de verdade de Issues e PRs somente quando houver `gh`,
  autenticação e autorização humana para operações remotas. No Codex, consultas
  GitHub podem precisar de autorização nativa para executar fora do sandbox;
  consulte `github.md`.
- Registros locais guardam decisões, contexto e pendências; não duplicam uma
  fila de trabalho que já esteja no GitHub.

## Como iniciar

Abra um chat neste repositório e escreva, por exemplo:

> PO, analise esta demanda: [necessidade]. Não implemente nada antes de eu aprovar o escopo.

Para uma análise sem alterações:

> PO, peça ao Arquiteto para analisar a estrutura atual do Truco Raiz e ao QA para identificar os testes disponíveis. Consolide os resultados, sem alterar nenhum arquivo.

Consulte `validacao.md` para o resultado das implantações v0.1, v0.2 e v0.2.1.
