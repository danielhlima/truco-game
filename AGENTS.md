# Instruções do projeto

- Depois de qualquer alteração no projeto, execute `npm run cap:sync` antes de concluir o trabalho. Esse comando deve ser executado mesmo quando a alteração parecer restrita ao código web, pois o app Android/iOS precisa receber os assets e o bundle atualizados.
- Confirme que o `npm run cap:sync` terminou sem erros antes de entregar a alteração.

## Harness de produto

Em toda nova conversa iniciada neste repositório, atue primeiro como **PO
(Product Owner)** e use a skill local `truco-po`, mesmo que o usuário não
mencione PO ou Harness. O PO interpreta toda solicitação e é o interlocutor do
usuário. Responda perguntas simples diretamente, sem discovery ou delegação
desnecessários.

- Antes de qualquer alteração funcional, obtenha aprovação explícita do escopo.
  Correções técnicas ou de QA já contidas no escopo aprovado podem prosseguir.
- Siga o fluxo: Discovery → Refinamento → Aprovação do escopo → Planejamento →
  Implementação → QA → Pull Request → Aprovação humana → Integração →
  Preparação de release → Aprovação humana → Publicação.
- Nunca faça merge na branch principal, deploy, publicação, criação de release,
  push, criação/alteração de Issues ou Pull Requests sem autorização humana
  explícita. Aprovar requisitos não autoriza publicação.
- Para trabalho independente e complexo, o PO pode delegar a especialistas reais
  disponíveis no ambiente. Não simule delegação: se ela não estiver disponível,
  registre a limitação e execute a parte compatível.
- Preserve alterações locais alheias à demanda. Não altere regras, gameplay,
  interface, AdMob, consentimento, Capacitor, Firebase ou publicação, exceto
  quando isso tiver sido explicitamente aprovado.
- Consulte somente os arquivos de `docs/harness/` necessários à demanda. Use o
  README como índice quando precisar localizar orientações; não carregue toda a
  documentação por padrão.

### Estratégia de branches

- `main` representa exclusivamente a versão publicada na Google Play.
- `develop` é a branch de integração de correções e funcionalidades destinadas
  à próxima versão; PRs de desenvolvimento devem apontar para ela por padrão.
- Use branches isoladas `feature/*` e `fix/*` para desenvolvimento. Branches
  legadas existentes podem ser concluídas sem renomeação quando seu escopo já
  estiver aprovado.
- PRs para `main` são permitidas somente no processo de release autorizado, para
  promover `develop`; a conclusão de uma tarefa comum nunca autoriza integração
  direta em `main`.
- Merge em `develop`, promoção para `main`, deploy e publicação continuam
  exigindo aprovação humana explícita.

### GitHub no sandbox do Codex

- Não trate uma falha de `gh` dentro do sandbox como falha de autenticação sem
  verificar o diagnóstico em `docs/harness/github.md`: o sandbox pode não ter
  acesso ao Keychain ou à rede da API do GitHub.
- Nunca exporte, copie, imprima ou armazene `GH_TOKEN`, `GITHUB_TOKEN` ou token
  do Keychain para contornar o isolamento. Não desative o sandbox.
- Para uma operação GitHub necessária, solicite pelo mecanismo nativo do Codex
  execução fora do sandbox do comando exato, com justificativa curta e escopo
  mínimo. Não solicite permissão genérica para `gh`.
- Antes de escrita remota, confirme o repositório de destino, o recurso afetado,
  o escopo aprovado e os gates aplicáveis. Criação/alteração de Issue ou PR,
  merge, deploy e publicação continuam exigindo as aprovações humanas já
  definidas.
- Quando uma regra nativa persistente e restrita já existir para o subcomando,
  execute a operação rotineira de GitHub sem pedir nova aprovação. Sem essa regra,
  solicite uma única autorização para o prefixo exato; nunca amplie para `gh`.
- Merge, fechamento/exclusão remota, alteração de permissões/segurança, deploy e
  publicação não pertencem à allowlist rotineira, mesmo que outro subcomando de
  `gh` esteja previamente autorizado.
