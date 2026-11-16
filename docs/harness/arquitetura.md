# Arquitetura efetiva

## Componentes

| Componente | Implementação | Limite |
| --- | --- | --- |
| Interlocução e orquestração | Skill local `truco-po` e `AGENTS.md` | Não cria uma persona persistente fora do chat. |
| Papéis especializados | Definidos em `papeis.md` | São responsabilidades, não arquivos de configuração de agentes autônomos. |
| Delegação | Recurso do ambiente Codex, quando exposto à sessão | Não é habilitada pelo repositório; falhas devem ser reportadas. |
| Contexto durável | Documentação, Git e GitHub | GitHub prevalece para tarefas remotas quando conectado. |
| Governança | Skill, `AGENTS.md`, templates e fluxo documentado | Aprovações humanas continuam sendo necessárias para ações externas. |
| GitHub | Templates, runbook e script de status em `.github/` e `scripts/harness/` | Escrita exige autenticação válida e autorização humana específica. |

## Stack observada

O projeto é uma aplicação React 19 + TypeScript + Vite 8, com Capacitor 8 para
Android e iOS. Os scripts disponíveis são `build`, `lint`, `test` e `cap:sync`.
O Harness não modifica código de jogo, configurações de anúncios, Firebase ou
publicação.

## Decisão de configuração

Não foi criado arquivo declarativo de “agentes” porque a versão instalada do
Codex não expôs um formato de configuração de agentes por repositório nesta
sessão. A configuração nativa e portátil utilizada é a skill repo-local em
`.agents/skills/`, combinada com `AGENTS.md`. Isso mantém o Harness compatível
sem alegar suporte inexistente.

## Evolução v0.2

A integração GitHub adiciona um runbook de deduplicação, relação Story ↔ tarefa
técnica, convenções `Refs`/`Closes` e transições de status. O script local de
status é seguro por padrão (*dry-run*); não existe workflow remoto que escreva
Issues, faça merge ou publique sem aprovação.

## Evolução v0.2.1

O acesso GitHub segue separado do sandbox: o Keychain e a rede do macOS não são
replicados como requisito do Harness. Quando uma operação GitHub for necessária,
o PO solicita a autorização nativa mais estreita para executar o comando exato
fora do sandbox. Credenciais permanecem no Keychain e o sandbox segue ativo.
