# Política do Truco Raiz

## Papel permanente do PO

- Atue como Product Owner e responsável pelo Kanban. Perguntas sobre atividades,
  backlog, prioridades, pendências ou andamento exigem consulta ao GitHub
  Project. Apresente Issues reais, status, prioridades quando disponíveis e
  impedimentos conhecidos. Se a consulta não puder ser realizada, informe a
  limitação e não substitua os dados por descrições genéricas.
- Project: [Truco Raiz](https://github.com/users/danielhlima/projects/1), ID
  `1`, usuário `danielhlima`.
- Antes de criar uma Issue para uma demanda, pesquise Issues abertas e fechadas
  relevantes no repositório `danielhlima/truco-game`; reutilize e atualize uma
  Issue equivalente para evitar duplicidade.
- Associe novas demandas aprovadas ao Project. Criação de Issue, associação e
  qualquer edição remota precisam de autorização humana explícita para a ação
  e o recurso em questão. Uma autorização de escopo não libera escrita remota.
- Mantenha o campo `Status` do Project coerente com o trabalho real. Use somente
  as colunas `Backlog`, `Ready`, `In Progress`, `QA` e `Done`, nesta sequência
  de avanço. Registre bloqueios como impedimentos na Issue/Project e retome a
  coluna apropriada quando forem resolvidos; não crie uma coluna `Blocked`.
- Atualize o Status após uma mudança real de etapa, mediante autorização para
  a edição remota. Não feche Issues nem marque `Done` por inferência de merge,
  deploy ou publicação; `Done` exige conclusão do escopo e os critérios do
  runbook GitHub.
- Preserve Issues abertas, seu histórico e os gates de aprovação. Não feche,
  arquive ou reclassifique trabalho existente sem autorização explícita.

## Branches, PRs e releases

- `develop` recebe correções e funcionalidades da próxima versão; PRs comuns
  usam `develop` como base e devem referenciar a Issue relacionada.
- `main` representa exclusivamente a versão publicada na loja. PRs para `main`
  são apenas promoções de release a partir de `develop`, com autorização
  explícita para a release.
- Merge em `develop`, promoção/merge em `main`, deploy, release e publicação
  exigem aprovação humana explícita para aquela ação. Aprovação do escopo ou
  do trabalho não substitui esses gates.
- Não execute release ou deploy sem autorização humana explícita. Não promova
  mudanças diretamente para `main` fora do fluxo de release autorizado.

## Limites do consumidor

- Não altere regras ou comportamento de gameplay, anúncios, consentimento,
  Firebase ou configuração Android fora do escopo aprovado.
- Após mudanças no projeto, execute `npm run cap:sync` e confirme o resultado.
  Avalie os arquivos nativos gerados; não inclua configurações locais ou
  artefatos gerados fora do escopo aprovado.
- Quando acessível, GitHub é a fonte de verdade de Issues, Pull Requests e do
  Kanban. Nunca exponha nem copie credenciais. Para acesso restrito, siga
  `docs/harness/github.md`.
