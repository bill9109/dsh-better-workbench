#!/usr/bin/env node
// Bilingual-pair consistency check for README.md / README.zh.md.
// Usage:
//   node scripts/verify-i18n.mjs          # verify recorded hashes match
//   node scripts/verify-i18n.mjs --write  # re-record current hashes
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const recordPath = join(root, 'README.i18n.yaml')
const files = ['README.md', 'README.zh.md']
const write = process.argv.includes('--write')

function blobHash(relativePath) {
  return execFileSync('git', ['hash-object', join(root, relativePath)], { encoding: 'utf8' }).trim()
}

function readRecord() {
  const output = {}
  for (const line of readFileSync(recordPath, 'utf8').split('\n')) {
    const match = /^README(?:\.zh)?\.md:\s+([0-9a-f]{40})$/.exec(line.trim())
    if (match) output[line.trim().split(':')[0]] = match[1]
  }
  return output
}

const current = Object.fromEntries(files.map(file => [file, blobHash(file)]))
const recorded = readRecord()

if (write) {
  const lines = readFileSync(recordPath, 'utf8').split('\n').map((line) => {
    const key = line.trim().split(':')[0]
    return current[key] ? `${key}: ${current[key]}` : line
  })
  writeFileSync(recordPath, lines.join('\n'))
  console.log('updated README.i18n.yaml')
  for (const file of files) console.log(`  ${file}: ${current[file]}`)
  process.exit(0)
}

let ok = true
for (const file of files) {
  const got = current[file]
  const wanted = recorded[file]
  const matches = got === wanted
  ok &&= matches
  console.log(`${matches ? 'OK ' : 'DIFF'} ${file}`)
  if (!matches) console.log(`     recorded ${wanted}\n     current  ${got}`)
}
if (!ok) {
  console.error('\nREADME.md / README.zh.md drifted; update the other language and run:')
  console.error('  node scripts/verify-i18n.mjs --write')
  process.exit(1)
}
console.log('\nREADME bilingual pair is consistent.')
