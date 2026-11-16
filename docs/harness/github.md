# Fluxo GitHub do Truco Raiz

GitHub é a fonte de verdade para Issues e Pull Requests quando estiver
acessível. O Harness Core mantém o papel de PO e os gates gerais; este documento
registra apenas as convenções operacionais do repositório.

## Branches, rastreabilidade e QA

- Crie branches de trabalho como `feature/<issue>-<resumo>` ou
  `fix/<issue>-<resumo>`; branches legadas em revisão podem ser concluídas sem
  renomeação.
- PRs comuns apontam para `develop`. PRs para `main` são reservadas à promoção
  de release autorizada.
- Use `Refs #N` em commits/PRs relacionados. Use `Closes #N` somente quando a PR
  resolver integralmente a Issue e o fechamento fizer parte do escopo aprovado.
- Antes do merge, o QA configurado pelo Core valida os critérios e reporta
  evidências. Merge em `develop`, promoção para `main`, deploy e publicação
  continuam sujeitos a aprovação humana explícita.

## Issues

- Antes de propor uma Issue, pesquise duplicidade e reutilize uma Issue
  equivalente quando existir. Criação ou edição remota exige autorização
  humana específica.
- Use os formulários em `.github/ISSUE_TEMPLATE/`. Tarefas técnicas devem
  informar a Issue-pai e manter rastreabilidade recíproca.
- Labels de status permitidos: `triage`, `ready`, `in-progress`, `blocked`,
  `qa` e `done`. Transições: `triage → ready`, `ready → in-progress`,
  `in-progress → qa`, `qa → done` e qualquer status para `blocked`.
- Prepare mudanças com `node scripts/harness/update-issue-status.mjs --issue N
  --from STATUS --status STATUS --dry-run`. O padrão não chama a API.
- `--apply --approved` não substitui a autorização humana explícita para aquela
  edição. O script confere o status remoto atual; `done` também exige uma PR
  integrada indicada por `--merged-pr`. Não feche Issues nem marque `done` por
  inferência a partir de um merge ou publicação.

## Acesso ao GitHub

- No sandbox, `gh` pode falhar por falta de rede ou acesso ao Keychain. Isso não
  prova, por si só, falha de autenticação.
- Nunca use `GH_TOKEN`, `GITHUB_TOKEN`, `gh auth token` ou cópia de credenciais
  para contornar o sandbox. Não imprima nem armazene segredos.
- Se uma operação necessária falhar no sandbox, classifique o erro e solicite
  execução nativa fora do sandbox para o comando exato. Não peça nem use uma
  permissão genérica para `gh`.
- Antes de qualquer escrita, confirme repositório, recurso, escopo autorizado,
  duplicidade quando aplicável e gates humanos. Uma autorização para uma Issue,
  PR ou comando não se estende a outro recurso.

Os templates de Issue/PR e o script são auxiliares locais; não criam recursos
remotos nem executam publicação automaticamente.
