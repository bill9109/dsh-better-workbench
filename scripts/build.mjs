#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageName = 'dsh-workbench'
const peers = ['@deepseek-ai/dsh-client-ui-primitives']

function resolveCheckout() {
  if (process.env.DSH_CHECKOUT !== undefined && process.env.DSH_CHECKOUT !== '') return resolve(process.env.DSH_CHECKOUT)
  const which = spawnSync('command', ['-v', 'dsh'], { shell: true, encoding: 'utf8' }).stdout.trim()
  if (which === '') throw new Error('Cannot find DSH; set DSH_CHECKOUT=/path/to/dsh')
  let directory = dirname(realpathSync(which))
  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(join(directory, 'packages', 'client', 'tsdown.client.ts'))) return directory
    directory = dirname(directory)
  }
  throw new Error('No DSH checkout found; set DSH_CHECKOUT')
}

function findWorkspacePackage(checkout, name) {
  const packages = join(checkout, 'packages')
  for (const group of readdirSync(packages, { withFileTypes: true })) {
    if (!group.isDirectory()) continue
    const groupDirectory = join(packages, group.name)
    for (const entry of readdirSync(groupDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const packageFile = join(groupDirectory, entry.name, 'package.json')
      if (!existsSync(packageFile)) continue
      try {
        if (JSON.parse(readFileSync(packageFile, 'utf8')).name === name) return join(groupDirectory, entry.name)
      } catch { /* malformed workspace manifests are not candidates */ }
    }
  }
  return undefined
}

function linkPnpmPackage(checkout, nodeModules, pkgDirGlob, relTarget) {
  const target = join(nodeModules, relTarget)
  if (existsSync(target)) return
  const pnpm = join(checkout, 'node_modules', '.pnpm')
  const directory = readdirSync(pnpm, { withFileTypes: true }).map(entry => entry.name).find(name => name.startsWith(pkgDirGlob))
  if (directory === undefined) throw new Error(`pnpm package not found: ${pkgDirGlob}`)
  const source = join(pnpm, directory, 'node_modules', relTarget)
  if (!existsSync(source)) throw new Error(`pnpm package missing module: ${source}`)
  const parent = join(nodeModules, relTarget.split('/').slice(0, -1).join('/'))
  if (parent !== nodeModules) mkdirSync(parent, { recursive: true })
  symlinkSync(source, target, 'dir')
}

const checkout = resolveCheckout()
const stagedDirectory = join(checkout, 'packages', 'external-plugins', basename(root))
const stagedManifest = join(stagedDirectory, 'package.json')
const nodeModules = join(root, 'node_modules')
rmSync(stagedDirectory, { recursive: true, force: true })
mkdirSync(stagedDirectory, { recursive: true })
symlinkSync(join(root, 'package.json'), stagedManifest, 'file')
rmSync(nodeModules, { recursive: true, force: true })
symlinkSync(join(checkout, 'node_modules'), nodeModules, 'dir')

try {
  const scope = join(nodeModules, '@deepseek-ai')
  mkdirSync(scope, { recursive: true })
  const cordisTarget = join(scope, 'cordis')
  if (!existsSync(cordisTarget)) symlinkSync(join(checkout, 'vendor', 'cordis'), cordisTarget, 'dir')
  for (const name of peers) {
    const target = join(scope, name.slice(name.lastIndexOf('/') + 1))
    if (existsSync(target)) continue
    const source = findWorkspacePackage(checkout, name)
    if (source === undefined) throw new Error(`DSH workspace package not found: ${name}`)
    symlinkSync(source, target, 'dir')
  }
  linkPnpmPackage(checkout, nodeModules, 'react@', 'react')
  linkPnpmPackage(checkout, nodeModules, 'react-dom@', 'react-dom')
  linkPnpmPackage(checkout, nodeModules, '@types+react@', '@types/react')
  linkPnpmPackage(checkout, nodeModules, '@types+react-dom@', '@types/react-dom')

  const bin = join(checkout, 'node_modules', '.bin')
  const run = (name, args) => {
    const result = spawnSync(join(bin, name), args, {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, DSH_CHECKOUT: checkout },
    })
    if (result.status !== 0) throw new Error(`${name} exited with status ${result.status ?? 1}`)
  }
  run('tsc', ['-p', 'tsconfig.json'])
  run('tsdown', ['-c', 'tsdown.config.mjs'])
} finally {
  rmSync(stagedDirectory, { recursive: true, force: true })
  rmSync(nodeModules, { recursive: true, force: true })
}
