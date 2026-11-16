# Autonomia GitHub v0.2.2

## Mecanismo efetivamente disponível

O Codex pode persistir uma aprovação por **prefixo de comando** fora do sandbox.
Uma regra já aprovada para `gh api user` foi validada nesta sessão: a leitura
`gh api user --jq .login` executou fora do sandbox sem nova aprovação individual.

O sandbox permanece ativo para desenvolvimento local. A execução elevada usa a
credencial já armazenada no Keychain do macOS, sem token no repositório, em
variáveis de ambiente ou em logs.

## Allowlist proposta

Cada prefixo abaixo requer uma autorização nativa inicial e independente. Depois
de persistido pelo Codex, ele pode atender operações rotineiras sem repetição de
aprovação por comando.

| Categoria | Prefixo restrito permitido |
| --- | --- |
| Conta (leitura) | `gh api user` |
| Repositório (leitura) | `gh repo view` |
| Issues (leitura) | `gh issue list`, `gh issue view` |
| Issues (rotina aprovada) | `gh issue create`, `gh issue edit`, `gh issue comment` |
| PRs (leitura) | `gh pr list`, `gh pr view` |
| PRs (rotina aprovada) | `gh pr create`, `gh pr comment` |
| Labels (leitura) | `gh label list` |

Esses prefixos só se aplicam após o escopo funcional ter sido aprovado pelo
usuário. Antes de escrita, o PO valida o repositório de destino, o recurso exato,
a ausência de duplicidade quando aplicável e o vínculo com a história aprovada.

## Operações deliberadamente excluídas

Não aprove prefixos para `gh pr merge`, `gh issue close`, `gh repo edit`,
`gh auth`, `gh api` genérico, exclusões remotas, permissões, segurança, deploy ou
publicação. Essas ações exigem revisão humana específica, mesmo quando a rotina
de Issues/PRs estiver automatizada.

## Limitação técnica

Uma regra de prefixo verifica a forma do comando, não o escopo de produto, o
número de Issue/PR, a branch protegida ou o significado de todos os argumentos
do `gh`. Portanto, o Codex não oferece nesta interface uma política persistente
que permita com prova técnica **todas** as escritas rotineiras e, ao mesmo tempo,
comprove que cada uma pertence ao escopo aprovado.

A alternativa de menor privilégio é aprovar somente os prefixos listados, manter
as exclusões acima sem regra persistente e exigir que o PO valide destino e
escopo. Não é seguro substituir essa separação por uma regra `gh` ampla ou por
um script versionado com acesso externo, pois ambos poderiam ampliar os efeitos
autorizados sem uma barreira nativa equivalente.
