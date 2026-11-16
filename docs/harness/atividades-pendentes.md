# Atividades pendentes do Harness

## Estado inicial

Não há tarefas de produto registradas localmente. Quando GitHub estiver
conectado e autorizado, Issues e PRs serão a fonte de verdade.

## Pendências de ambiente

- Para consultas GitHub necessárias no Codex, solicitar autorização nativa para
  executar fora do sandbox apenas o comando de leitura específico.
- Antes de qualquer escrita autorizada, validar fora do sandbox o repositório de
  destino, o recurso afetado, labels, duplicidade e gates aplicáveis.

## Dívida técnica registrada (fora do escopo v0.2)

- `npm run lint` falha por dois acessos a `ref.current` durante render em
  `src/app/useGameSession.ts` (linhas 258 e 261) e emite um aviso de dependência
  de `useMemo` em `src/App.tsx`. Não criar Issue remota nem corrigir sem escopo e
  autorização específicos.
