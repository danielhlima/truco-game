# Integração com GitHub

## Estado da implantação v0.2.2

- Remoto local confirmado: `origin` aponta para
  `git@github.com:danielhlima/truco-game.git`.
- O CLI `gh` está instalado e autenticado como `danielhlima` no macOS, com a
  credencial no Keychain. Fora do sandbox, `gh api user --jq .login` retorna
  `danielhlima`.
- No sandbox do Codex, o mesmo executável e diretório `~/.config/gh` são visíveis,
  mas não há acesso ao item do Keychain nem conexão TCP com `api.github.com`.
  Portanto, a mensagem de token inválido no sandbox não representa, por si só,
  uma falha real de autenticação.
- Nenhum recurso remoto foi criado ou alterado nesta implantação.
- A leitura por prefixo persistente `gh api user` foi validada fora do sandbox
  sem nova aprovação individual. Consulte `github-autonomia.md` para a allowlist
  proposta e suas limitações técnicas.

## Diagnóstico antes de agir

| Sinal | Classificação | Conduta do PO |
| --- | --- | --- |
| `gh auth status` falha somente no sandbox e o teste externo funciona | Restrição de Keychain e/ou rede do sandbox | Solicitar autorização nativa para o comando necessário fora do sandbox. |
| DNS funciona, mas TCP/API falha no sandbox | Restrição de rede do sandbox | Não reautenticar nem injetar token; usar comando externo autorizado. |
| O mesmo comando falha fora do sandbox | Falha real de autenticação, rede ou permissão GitHub | Reportar o erro e pedir que o operador trate a conta/rede; não alterar credenciais. |
| O comando externo ainda não foi autorizado | Falta de autorização do Codex | Explicar o comando exato, sua finalidade e pedir a aprovação nativa mínima. |

Não use `GH_TOKEN`, `GITHUB_TOKEN`, `gh auth token`, cópia de Keychain ou arquivos
de configuração para contornar o sandbox. O Harness não desativa o sandbox.

## Acesso externo seguro

1. Primeiro, prefira a inspeção local no sandbox e determine o recurso necessário.
2. Para GitHub, solicite execução fora do sandbox pelo mecanismo nativo do Codex,
   com o comando exato, justificativa curta e sem prefixo genérico para `gh`.
3. Leia e registre apenas o resultado necessário; nunca solicite, imprima ou
   preserve token.
4. Falha ou ausência de aprovação bloqueia a operação; não há fallback por token.

### Exemplos de leitura

| Necessidade | Comando externo mínimo | Efeito |
| --- | --- | --- |
| Confirmar a conta | `gh api user --jq .login` | Somente leitura da identidade autenticada. |
| Confirmar destino | `gh repo view --json nameWithOwner,url,defaultBranchRef` | Somente leitura do repositório atual. |
| Buscar duplicidade | `gh issue list --state open --search "<termos>"` | Somente leitura de Issues abertas. |

### Escrita com gates

Antes de solicitar execução externa de escrita, o PO deve registrar: repositório
de destino validado, Issue/PR/recurso exato, mudança pretendida, escopo aprovado
e gate aplicável. Então peça autorização para um único comando, por exemplo
`gh issue edit <número> --add-label status:qa`. Não execute comandos compostos,
não crie recursos de demonstração e não reutilize a aprovação para outro recurso.

| Operação | Pré-condições adicionais |
| --- | --- |
| Criar/editar Issue ou PR | Escopo aprovado, destino e recurso identificados; checagem de duplicidade. |
| Atualizar status | Transição permitida, Issue identificada e autorização da escrita; use o script local em *dry-run* antes. |
| Merge | PR específica, QA concluído e aprovação humana explícita de merge. |
| Deploy/publicação | Checklist de release e aprovação humana explícita de publicação. |

Os templates locais em `.github/ISSUE_TEMPLATE/` e `.github/pull_request_template.md`
estão prontos para uso. Os rótulos recomendados são documentados abaixo porque
labels são recursos remotos; não existe arquivo GitHub nativo que os crie sem
automação externa. Nenhuma automação remota foi adicionada.

## Rótulos recomendados

- Tipo: `type:feature`, `type:bug`, `type:technical`
- Prioridade: `priority:p0`, `priority:p1`, `priority:p2`, `priority:p3`
- Status: `status:triage`, `status:ready`, `status:in-progress`, `status:blocked`, `status:qa`, `status:done`

## Convenções de rastreabilidade

- Issue de produto somente depois de escopo aprovado.
- Branch de desenvolvimento: `feature/<numero-da-issue>-<resumo-curto>` ou
  `fix/<numero-da-issue>-<resumo-curto>`; branches legadas podem ser concluídas
  sem renomeação quando já estiverem em revisão.
- PRs regulares usam `develop` como base. `main` é reservado à promoção de
  release de `develop`, com autorização humana explícita.
- Commits e PRs usam `Refs #<numero>` para cada Issue relacionada.
- Use `Closes #<numero>` somente na PR que cobre integralmente a Issue e cuja
  integração foi aprovada por humano.
- A PR lista Issue-pai e tarefas técnicas relacionadas quando existirem.

## Runbook de Issues

1. Depois da aprovação do escopo, pesquise Issues abertas por termos do título,
   domínio e labels: `gh issue list --state open --search "<termos>"`.
2. Se houver Issue equivalente, reutilize-a ou proponha o vínculo; não crie
   duplicata. A criação excepcional exige registrar a justificativa.
3. Se não houver equivalente e a criação remota tiver sido autorizada, crie a
   história com uma label `type:*`, uma `priority:*` e `status:ready`.
4. Crie tarefa técnica somente quando necessária e com `Parent: #<história>` no
   corpo. A história deve apontar de volta com `- [ ] #<tarefa>`.
5. Antes de cada escrita remota, execute fora do sandbox, com aprovações
   separadas, as leituras necessárias para confirmar destino e labels. Se não
   existirem, reporte o bloqueio; não crie labels sem autorização explícita.

## Progresso e transições

| Transição | Gatilho | Responsável | Condição |
| --- | --- | --- | --- |
| `triage → ready` | Escopo aprovado | PO | Labels tipo e prioridade definidos. |
| `ready → in-progress` | Branch iniciada | PO/Desenvolvedor | Operação remota autorizada. |
| `in-progress → qa` | Entrega com evidências | Desenvolvedor | Critérios de aceite disponíveis para QA. |
| `* → blocked` | Impedimento identificado | PO | Motivo, dependência e próximo passo registrados. |
| `qa → done` | Merge aprovado e realizado | PO | Aprovação humana explícita de merge. |

O script `scripts/harness/update-issue-status.mjs` prepara a atualização de
labels de status. Ele exige `--from` e só aceita as transições da tabela (ou
qualquer status para `blocked`). Em *dry-run* não chama a API; com
`--apply --approved`, consulta o status remoto atual antes de chamar
`gh issue edit`. A transição para `done` exige `--merged-pr` e confirma que a
PR está integrada. Essa confirmação técnica não substitui a autorização humana
exigida para a alteração remota. Não há GitHub Action de escrita.

## Protocolo QA → Desenvolvedor → PO

1. QA registra para o Desenvolvedor a Issue/PR, critério falho, severidade,
   passos de reprodução e evidência.
2. O Desenvolvedor corrige somente dentro do escopo aprovado e devolve evidência
   de validação. Mudança de escopo retorna ao PO.
3. QA repete a verificação e informa aprovação ou novo achado ao PO.
4. O PO consolida o resultado. QA não faz merge, deploy ou publicação.

## Limitações e autorizações necessárias

- O sandbox pode listar a configuração local, mas não substitui o Keychain nem
  recebe acesso de rede à API do GitHub.
- Uma autorização nativa fora do sandbox é necessária para cada classe de
  comando GitHub que realmente precise da credencial/rede. Prefira permissões
  temporárias e específicas; não aprove `gh` de modo irrestrito.
- A autorização do Codex permite executar o comando, mas não substitui a
  aprovação humana de produto, merge, deploy ou publicação.
- A política persistente disponível é baseada em prefixo de comando. Ela não
  permite provar tecnicamente que uma escrita pertence a determinado escopo;
  por isso, a autonomia total de todas as escritas não foi habilitada. Use a
  allowlist de menor privilégio em `github-autonomia.md`.
