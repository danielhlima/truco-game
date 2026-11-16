#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const statuses = new Set(['triage', 'ready', 'in-progress', 'blocked', 'qa', 'done'])
const statusLabels = [...statuses].map((status) => `status:${status}`)
const transitions = new Set(['triage:ready', 'ready:in-progress', 'in-progress:qa', 'qa:done'])
const args = process.argv.slice(2)
const valueFor = (flag) => args[args.indexOf(flag) + 1]
const has = (flag) => args.includes(flag)

if (has('--help') || args.length === 0) {
  console.log('Uso: node scripts/harness/update-issue-status.mjs --issue <numero> --from <status> --status <status> [--merged-pr <numero>] [--dry-run | --apply --approved]')
  console.log(`Status aceitos: ${[...statuses].join(', ')}`)
  console.log('Transições: triage→ready, ready→in-progress, in-progress→qa, qa→done e qualquer status→blocked.')
  console.log('Sem --apply, o comando apenas mostra a alteração. --apply exige --approved, autorização humana prévia e valida o status remoto atual.')
  process.exit(0)
}

const issue = valueFor('--issue')
const from = valueFor('--from')
const status = valueFor('--status')
const mergedPr = valueFor('--merged-pr')
const apply = has('--apply')

if (!/^\d+$/.test(issue ?? '') || !statuses.has(from) || !statuses.has(status)) {
  console.error('Informe --issue <número>, --from <status válido> e --status <status válido>. Use --help para detalhes.')
  process.exit(2)
}

if (from === status || (status !== 'blocked' && !transitions.has(`${from}:${status}`))) {
  console.error(`Transição recusada: status:${from} → status:${status} não é permitida.`)
  process.exit(2)
}

if (status === 'done' && !/^\d+$/.test(mergedPr ?? '')) {
  console.error('Transição para status:done exige --merged-pr <número> de uma PR já integrada.')
  process.exit(2)
}

const command = [
  'issue',
  'edit',
  issue,
  ...statusLabels.flatMap((label) => ['--remove-label', label]),
  '--add-label',
  `status:${status}`,
]
console.log(`Issue #${issue}: status:${from} → status:${status}`)
console.log(`Comando remoto: gh ${command.join(' ')}`)

if (!apply) {
  console.log('Dry-run: nenhuma alteração remota foi feita.')
  process.exit(0)
}

if (!has('--approved')) {
  console.error('Recusado: --apply requer --approved após autorização humana explícita para esta alteração remota.')
  process.exit(2)
}

const issueState = spawnSync('gh', ['issue', 'view', issue, '--json', 'labels'], { encoding: 'utf8' })
if (issueState.status !== 0) {
  process.stderr.write(issueState.stderr || 'Não foi possível consultar a Issue antes da atualização.\n')
  process.exit(issueState.status ?? 1)
}

let currentStatus
try {
  const labels = JSON.parse(issueState.stdout).labels ?? []
  currentStatus = labels.map((label) => label.name).find((label) => statusLabels.includes(label))
} catch {
  console.error('Não foi possível interpretar os labels da Issue.')
  process.exit(1)
}

if (currentStatus !== `status:${from}`) {
  console.error(`Recusado: estado remoto atual é ${currentStatus ?? 'ausente'}, esperado status:${from}.`)
  process.exit(2)
}

if (status === 'done') {
  const prState = spawnSync('gh', ['pr', 'view', mergedPr, '--json', 'state,mergedAt'], { encoding: 'utf8' })
  if (prState.status !== 0) {
    process.stderr.write(prState.stderr || 'Não foi possível consultar a PR informada.\n')
    process.exit(prState.status ?? 1)
  }

  try {
    const pr = JSON.parse(prState.stdout)
    if (pr.state !== 'MERGED' || !pr.mergedAt) {
      console.error(`Recusado: a PR #${mergedPr} não está integrada.`)
      process.exit(2)
    }
  } catch {
    console.error('Não foi possível interpretar o estado da PR informada.')
    process.exit(1)
  }
}

const result = spawnSync('gh', command, { stdio: 'inherit' })
process.exit(result.status ?? 1)
