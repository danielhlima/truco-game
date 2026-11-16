# Validação das implantações v0.1 e v0.2

## Estrutura e sintaxe

- Skill local criada em `.agents/skills/truco-po/SKILL.md` com front matter
  `name` e `description`.
- Templates de Issue validados pelo parser YAML do Ruby: `feature.yml`,
  `bug.yml` e `technical-task.yml`.
- `git diff --check` concluído sem saída (sem erro de espaços ou patch).

## Testes do projeto

- `npm test`: concluído com sucesso — 119 testes aprovados, 0 falhas.
- `npm run lint`: falhou por 2 erros pré-existentes em
  `src/app/useGameSession.ts` (regra `react-hooks/refs`, linhas 258 e 261) e
  apresentou 1 aviso em `src/App.tsx` (dependência de `useMemo`). O Harness não
  alterou esses arquivos nem corrige comportamento do jogo nesta implantação.
- `npm run cap:sync`: concluído sem erros em 2026-11-12; build TypeScript/Vite e
  sincronização Android, iOS e web foram finalizados.

## Reconhecimento do PO e delegação real

- As instruções do PO estão em `AGENTS.md`; a skill repo-local `truco-po` é o
  ponto de entrada para pedidos de PO, planejamento, QA, Issue, PR e release.
- Delegação real foi executada nesta sessão, em tarefa exclusivamente de leitura:
  um subagente analisou arquitetura e testes e devolveu a consolidação ao PO.
- Resultado consolidado: React 19, TypeScript 5.9, Vite 8 e Capacitor 8; 15
  arquivos de testes unitários. Lacunas observáveis: não há CI, cobertura mínima,
  testes de UI/E2E, acessibilidade, WebView ou integração nativa configurados.

## GitHub e aprovações

- O remoto `origin` foi identificado, mas `gh` não está instalado; autenticação
  e operações remotas não foram executadas.
- Nenhuma Issue, PR, label, commit, push, merge, release, deploy ou publicação
  foi criado ou alterado.
- As regras de aprovação humana estão em `AGENTS.md`, na skill e em `fluxo.md`.

## v0.2 — Integração GitHub e orquestração

- `gh auth status` encontrou o CLI instalado, porém retornou token inválido para
  a conta ativa `danielhlima`. `gh repo view`, labels, Issues e PRs não puderam
  consultar a API; nenhuma operação remota foi efetuada.
- O remoto local `origin` foi confirmado como
  `git@github.com:danielhlima/truco-game.git`. A confirmação pela API do projeto
  remoto depende de reautenticação bem-sucedida.
- Templates YAML foram novamente validados, `git diff --check` passou e o script
  de status foi exercitado em `--help` e *dry-run*. O *dry-run* exibiu a troca
  proposta para `status:qa` sem chamar a API.
- `npm test` foi executado: 119 testes aprovados, 0 falhas. O lint não foi
  corrigido nem reexecutado nesta etapa; sua dívida pré-existente continua
  registrada em `atividades-pendentes.md`.
- Coordenação real validada: PO delegou revisão ao Desenvolvedor e ao QA em
  paralelo; QA relatou lacunas, o PO encaminhou o retorno ao Desenvolvedor,
  aplicou as correções documentais e solicitou reteste independente de QA.
- Reteste final de QA aprovado: uma transição permitida foi exercitada somente
  em *dry-run*; salto de status, ausência de `--from` e conclusão sem
  `--merged-pr` foram recusados. A inspeção confirmou que `--apply` consulta o
  status remoto e que `done` exige PR com `state: MERGED` e `mergedAt`.

## v0.2.1 — GitHub fora do sandbox

- Diagnóstico confirmado: no sandbox, `gh` usa o mesmo executável e diretório de
  configuração do macOS, mas não acessa o item Keychain e não conecta à API do
  GitHub. Fora do sandbox, a credencial do Keychain funciona.
- `GH_TOKEN` e `GITHUB_TOKEN` estavam ausentes nos dois ambientes; nenhum token
  foi lido, impresso, exportado ou gravado.
- Teste externo autorizado pelo mecanismo nativo do Codex:
  `gh api user --jq .login` retornou `danielhlima`.
- Nenhuma Issue, PR, branch remota, label, merge, deploy ou publicação foi
  criada ou modificada. A documentação exige autorização específica por comando
  e preserva o sandbox como padrão.

## v0.2.2 — Autonomia por prefixo

- A leitura `gh api user --jq .login` foi executada fora do sandbox por uma
  regra de prefixo persistente já aprovada e retornou `danielhlima`, sem uma nova
  aprovação individual.
- A allowlist proposta restringe-se a prefixos de leitura e rotinas de Issue/PR;
  ela exclui merge, fechamento/exclusão, configurações de repositório, segurança,
  deploy e publicação.
- Limitação registrada: a permissão nativa disponível não valida o escopo de
  produto ou os argumentos completos de uma escrita. Por segurança, não foi
  criada uma regra irrestrita para `gh` nem uma automação de escrita de teste.
