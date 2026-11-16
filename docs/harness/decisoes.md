# Registro de decisões

## ADR-001 — Harness v0.1 usa skill repo-local e instruções versionadas

- **Data:** 2026-11-12
- **Contexto:** o Harness precisa sobreviver a novos chats sem inventar formato
  de configuração de agentes não exposto na sessão.
- **Decisão:** usar `AGENTS.md`, a skill repo-local
  `.agents/skills/truco-po/SKILL.md`, documentação em `docs/harness/` e
  templates nativos de GitHub.
- **Consequência:** a delegação continua sendo uma capacidade do ambiente Codex,
  validada por execução real quando disponível; o repositório não a simula.

## ADR-002 — Progresso de Issues é orquestrado, não automatizado no remoto

- **Data:** 2026-11-12
- **Contexto:** o fluxo v0.2 exige atualização de progresso, mas a governança
  proíbe alterações remotas sem autorização humana.
- **Decisão:** o PO usa um script local em modo *dry-run* para preparar a troca
  de status; a escrita só ocorre com parâmetros explícitos e autorização humana
  para a ação. GitHub Actions de escrita não serão adicionadas.
- **Consequência:** o fluxo é reproduzível e rastreável sem burlar os gates de
  aprovação; mudanças remotas continuam bloqueadas quando `gh` não autentica.

## ADR-003 — GitHub externo ao sandbox usa autorização por comando

- **Data:** 2026-11-12
- **Contexto:** `gh` autenticado pelo Keychain do macOS funciona fora do sandbox,
  mas o sandbox não acessa o Keychain nem a API do GitHub.
- **Decisão:** manter o sandbox; para uma operação necessária, solicitar a
  autorização nativa do Codex para o comando exato fora do sandbox. Não injetar
  tokens em variáveis, arquivos ou logs e não conceder autorização genérica para
  `gh`.
- **Consequência:** consultas e ações remotas podem usar a credencial existente
  sem expô-la, enquanto as aprovações de escopo, merge e publicação permanecem
  independentes e obrigatórias.

## ADR-004 — Autonomia GitHub usa prefixos mínimos, não uma regra `gh` ampla

- **Data:** 2026-11-12
- **Contexto:** o usuário autorizou rotinas GitHub, mas a interface nativa
  persiste permissões por prefixo e não interpreta o escopo de produto de cada
  argumento do CLI.
- **Decisão:** validar e usar prefixos específicos para operações rotineiras;
  manter merge, exclusão, segurança, deploy e publicação fora da allowlist.
- **Consequência:** leituras e operações futuras explicitamente incluídas em
  prefixos podem não pedir confirmação repetida. Não há garantia técnica para
  tornar todas as escritas autônomas sem ampliar privilégios além do aceitável.
