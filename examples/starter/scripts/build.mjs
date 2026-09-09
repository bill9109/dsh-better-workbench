import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
if (args.some(arg => !['--verify', '--dry-run'].includes(arg))) throw new Error('Usage: build [--verify | --dry-run]')
if (args.includes('--dry-run')) {
  console.log('Typecheck and build host ESM/client factory using installed dsh-better-workbench/build/client-bundle; no checkout required.')
} else {
  const temporary = args.includes('--verify') ? await mkdtemp(join(tmpdir(), 'workbench-starter-')) : undefined
  try {
    const outDir = temporary ?? join(root, 'lib')
    const require = createRequire(import.meta.url)
    const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', join(root, 'tsconfig.json'), '--outDir', join(outDir, 'types')], { cwd: root, stdio: 'inherit' })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error('TypeScript failed')
    const { build } = await import('tsdown')
    const { packageBundles } = await import('dsh-better-workbench/build/client-bundle')
    const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
    for (const config of packageBundles(manifest, { root, outDir })) await build({ ...config, config: false })
    console.log(temporary ? 'Verified in temporary directory; lib unchanged.' : 'Built ' + outDir)
  } finally {
    if (temporary) await rm(temporary, { recursive: true, force: true })
  }
}
