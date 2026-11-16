# Truco Raiz — regras locais

Após sua instalação, o Harness Core v0.3.1 será responsável pelo PO, pela
orquestração, pelos especialistas configurados e pelo QA independente. Este
arquivo mantém somente as regras do consumidor; consulte
`docs/harness/github.md` para o fluxo operacional de GitHub.

## Produto e validação

- Não altere regras ou comportamento de gameplay, anúncios, consentimento,
  Firebase ou configuração Android fora do escopo aprovado.
- Após mudanças no projeto, execute `npm run cap:sync` e confirme o resultado.
  Avalie os arquivos nativos gerados; não inclua configurações locais ou
  artefatos gerados fora do escopo aprovado.

## Branches e aprovações

- `main` representa exclusivamente a versão publicada na loja.
- `develop` recebe correções e funcionalidades destinadas à próxima versão;
  PRs de desenvolvimento usam `develop` como base.
- A promoção de `develop` para `main` ocorre somente em release autorizado.
- Merge em `develop`, promoção para `main`, deploy e publicação exigem
  aprovação humana explícita. A aprovação de escopo, por si só, não autoriza
  essas ações.

## GitHub

- Quando acessível, GitHub é a fonte de verdade de Issues e Pull Requests.
- Nunca exponha nem copie credenciais. Se o sandbox bloquear rede ou Keychain,
  siga o procedimento de acesso restrito em `docs/harness/github.md`.
