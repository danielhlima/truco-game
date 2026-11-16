# Fluxo GitHub do Truco Raiz

GitHub é a fonte de verdade para Issues e Pull Requests quando estiver
acessível. O Harness Core mantém o papel de PO e os gates gerais; as regras
específicas do consumidor ficam versionadas em
[`project-instructions.md`](project-instructions.md) e são copiadas para o
`AGENTS.md` local durante o bootstrap.

## Bootstrap de um clone novo com Harness Core persistent

Execute este procedimento depois que a migração dos caminhos operacionais tiver
sido integrada em `develop`. O `AGENTS.md`, `.codex/`, `.agents/skills/` e o
estado persistent são locais a cada clone; eles não são distribuídos pelo Git.

### 1. Preparar branches compatíveis

Atualize as refs e trabalhe em `develop`. Se o clone ainda não tiver uma branch
local `develop`, crie-a acompanhando `origin/develop`:

```sh
git fetch origin
git switch --track origin/develop
```

Se `develop` já existir localmente, atualize-a pelo fluxo normal do projeto e
use a troca protegida:

```sh
git checkout --no-overwrite-ignore develop
```

A branch local `main` também precisa existir. Em um clone criado diretamente
em `develop`, crie a ref local a partir da remota antes de instalar:

```sh
git branch --track main origin/main
```

Antes de instalar, confirme que nenhuma das bases ativas rastreia caminhos
reservados do Harness:

```sh
git branch --list main develop
git ls-tree -r --name-only main -- AGENTS.md .codex/config.toml .codex/harness-core .agents/skills/harness-core .harness-core
git ls-tree -r --name-only develop -- AGENTS.md .codex/config.toml .codex/harness-core .agents/skills/harness-core .harness-core
```

Ambos os comandos `ls-tree` devem produzir saída vazia. Se houver colisão, não
instale persistent; encaminhe a ref para revisão. Refs históricas conflitantes
podem continuar existindo como recovery-only e devem aparecer nessa categoria
no plano do distribuidor.

### 2. Preparar o AGENTS local a partir da fonte versionada

O bootstrap inicial requer ausência de `AGENTS.md` local. Se já existir, não o
sobrescreva: preserve-o e revise manualmente a origem do conteúdo antes de
prosseguir. Em um clone novo, copie as regras específicas da versão integrada
em `develop`. O bloco abaixo encerra o procedimento se o arquivo já existir:

```sh
if [ -e AGENTS.md ]; then
  echo 'AGENTS.md já existe; preserve e revise antes do bootstrap.' >&2
  exit 1
fi
git show develop:docs/harness/project-instructions.md > AGENTS.md
```

Não adicione esse arquivo ao índice Git. A instalação persistent irá acrescentar
o bloco PO gerenciado ao final e registrará o snapshot completo para integridade
e rollback. Por isso, não edite manualmente `AGENTS.md` depois da instalação;
`verify`, update e rollback recusam alterações locais nesse arquivo.

### 3. Preparar o pacote v0.4.0

Use o distribuidor oficial de uma cópia aprovada do Harness Core v0.4.0 e um
pacote v0.4.0 previamente verificado. Defina `CORE_ROOT` para o diretório desse
Core. Se precisar gerar um pacote, escolha um caminho de saída novo e vazio; o
distribuidor não sobrescreve pacotes existentes:

```sh
CORE_ROOT='/caminho/para/Harness Core'
PACKAGE="$CORE_ROOT/dist/harness-core-0.4.0-new-clone"
python3 "$CORE_ROOT/scripts/distribute.py" package --mode persistent --package "$PACKAGE"
python3 "$CORE_ROOT/scripts/distribute.py" package --mode persistent --package "$PACKAGE" --apply
```

Inspecione o manifesto e use somente o pin `0.4.0`. O pacote e o distribuidor
permanecem no repositório Harness Core; não copie regras específicas do Truco
para o Core nem para configurações globais do Codex.

### 4. Instalar e verificar

Com `develop` ativa e as branches locais `main` e `develop` presentes, execute o
dry-run e revise `activeBranches`, `supportedRefs` e `recoveryOnlyRefs`:

```sh
TARGET="$(pwd -P)"
python3 "$CORE_ROOT/scripts/distribute.py" install --mode persistent --target "$TARGET" --package "$PACKAGE" --version 0.4.0 --active-branch main --active-branch develop
```

Somente após confirmar ausência de conflitos, aplique a instalação:

```sh
python3 "$CORE_ROOT/scripts/distribute.py" install --mode persistent --target "$TARGET" --package "$PACKAGE" --version 0.4.0 --active-branch main --active-branch develop --apply
python3 "$CORE_ROOT/scripts/distribute.py" verify --mode persistent --target "$TARGET"
```

Confirme também que `AGENTS.md` contém o bloco PO gerenciado e mantém as regras
específicas do Truco; que `.codex/config.toml` habilita agentes e declara os
perfis `arquiteto`, `desenvolvedor` e `qa`; que
`.agents/skills/harness-core/SKILL.md` existe; e que o `git status` não mostra
arquivos operacionais. O instalador
protege os caminhos com `.git/info/exclude`, apenas nesse clone. Não altere
`.gitignore` versionado nem use `git add -f` nos arquivos locais.

### 5. Confirmar carregamento no Codex Desktop

Abra uma nova conversa do Codex Desktop no projeto e confirme o PO, os três
perfis nativos e a skill. Depois, valide cada branch ativa com troca protegida,
verify e nova conversa:

```sh
git checkout --no-overwrite-ignore main
python3 "$CORE_ROOT/scripts/distribute.py" verify --mode persistent --target "$TARGET"
# Inicie uma nova conversa do Codex Desktop e valide o contexto de main.

git checkout --no-overwrite-ignore develop
python3 "$CORE_ROOT/scripts/distribute.py" verify --mode persistent --target "$TARGET"
# Inicie uma nova conversa do Codex Desktop e valide o contexto de develop.
```

Não use `git checkout -f`, `git clean -x` ou ferramentas que sobrescrevam
arquivos ignorados. O distribuidor não consegue impedir esses comandos. A
instalação e `.git/info/exclude` são por clone; outro computador precisa repetir
o bootstrap.

Se uma etapa falhar, pare e preserve pacote, arquivos locais e estado. Use
somente `verify`, `recover` ou `rollback` oficiais conforme o estado encontrado;
nunca edite `state.json`, snapshots ou journal manualmente.

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
