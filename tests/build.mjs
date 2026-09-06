import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import { build } from 'tsdown'
import * as React from 'react'
import * as jsx from 'react/jsx-runtime'
import { clientBundle, PLATFORM_MODULES } from '../scripts/client-bundle.mjs'
import { buildPackage } from '../scripts/build-package.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const seed = {
  react: React,
  'react/jsx-runtime': jsx,
  'react-dom/client': { createRoot() {} },
  '@deepseek-ai/dsh-client-ui-primitives': new Proxy({}, { get: (_, name) => name === '__esModule' ? true : () => null }),
}
const requireSeed = name => {
  assert.ok(Object.hasOwn(seed, name), 'Unexpected loader require: ' + name)
  return seed[name]
}
async function temporary(t) {
  const dir = await mkdtemp(join(tmpdir(), 'workbench-protocol-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  return dir
}
async function compile(root, outDir, manifest) {
  await build({ ...clientBundle(manifest, { root, outDir }), tsconfig: false, config: false, logLevel: 'silent' })
  const code = await readFile(join(outDir, 'client.js'), 'utf8')
  const registrations = []
  runInNewContext(code, { window: { __ModuleLoader__: { load: value => registrations.push(value) } } })
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].id, manifest.name)
  assert.deepEqual((await readdir(outDir)).sort(), ['client.js', 'client.js.map'])
  return registrations[0]
}

test('actual clients register deferred factories and materialize against exact seed keys', async t => {
  const dir = await temporary(t)
  for (const relative of ['', 'examples/design-board']) {
    const packageRoot = join(root, relative)
    const manifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
    const registration = await compile(packageRoot, join(dir, manifest.name), manifest)
    const exports = registration.factory(requireSeed)
    assert.equal(typeof exports.apply, 'function')
    const map = JSON.parse(await readFile(join(dir, manifest.name, 'client.js.map'), 'utf8'))
    assert.ok(map.sourcesContent.some(source => source?.includes('export function apply')))
    if (process.env.DSH_MODULE_SYSTEM) {
      // Optional read-only compatibility run against the real DSH source, not a build dependency.
      const { ClientModuleSystem } = await import(pathToFileURL(resolve(process.env.DSH_MODULE_SYSTEM)).href)
      const loader = new ClientModuleSystem({
        manifest: { modules: [] }, staticModules: seed,
        bootstrapModule: { id: 'test-bootstrap', exports: {} },
        registrationTarget: { mode: 'queue', pendingQueue: [registration] },
      })
      const loaded = await loader.import(manifest.name + '/client')
      assert.equal(typeof loaded.apply, 'function')
      assert.equal(await loader.import(manifest.name), loaded)
    }
  }
})

test('non-shared libraries inline while React identity stays shared', async t => {
  const dir = await temporary(t)
  await mkdir(join(dir, 'src/client'), { recursive: true })
  await mkdir(join(dir, 'node_modules/local-value'), { recursive: true })
  await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'protocol-fixture', type: 'module', dependencies: { 'local-value': '1.0.0' } }))
  await writeFile(join(dir, 'node_modules/local-value/package.json'), JSON.stringify({ name: 'local-value', version: '1.0.0', main: 'index.js' }))
  await writeFile(join(dir, 'node_modules/local-value/index.js'), 'exports.answer = 42')
  await writeFile(join(dir, 'src/client/index.ts'), "import { createElement } from 'react'; import { answer } from 'local-value'; export { createElement, answer }")
  const registration = await compile(dir, join(dir, 'output'), { name: 'protocol-fixture' })
  const exports = registration.factory(requireSeed)
  assert.equal(exports.answer, 42)
  assert.equal(exports.createElement, React.createElement)
})

test('unknown DSH values, Node builtins, CSS and unresolved libraries fail the build', async t => {
  const dir = await temporary(t)
  await mkdir(join(dir, 'src/client'), { recursive: true })
  for (const specifier of ['@deepseek-ai/dsh-unknown', 'node:fs', './style.css', 'uninstalled-fixture']) {
    await writeFile(join(dir, 'src/client/index.ts'), 'export * from ' + JSON.stringify(specifier))
    await assert.rejects(compile(dir, join(dir, 'output'), { name: 'invalid-fixture' }))
  }
})

test('full compiler runner writes only its output and preserves existing lib', async t => {
  const dir = await temporary(t)
  await mkdir(join(dir, 'src/client'), { recursive: true })
  await mkdir(join(dir, 'lib'), { recursive: true })
  await writeFile(join(dir, 'lib/sentinel'), 'user output')
  await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'runner-fixture', type: 'module' }))
  await writeFile(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', types: [], rootDir: 'src', strict: true }, include: ['src'] }))
  await writeFile(join(dir, 'src/index.ts'), 'export function apply(): void {}')
  await writeFile(join(dir, 'src/invariant.ts'), 'export const name = "fixture"')
  await writeFile(join(dir, 'src/client/index.ts'), 'export function apply(): void {}')
  await buildPackage(dir, join(dir, 'output'))
  assert.equal(await readFile(join(dir, 'lib/sentinel'), 'utf8'), 'user output')
  assert.deepEqual(await readdir(join(dir, 'lib')), ['sentinel'])
  assert.deepEqual((await readdir(join(dir, 'output'))).sort(), ['client.js', 'client.js.map', 'index.js', 'invariant.js', 'types'])
  assert.deepEqual((await readdir(join(dir, 'output/types'))).sort(), ['client', 'index.d.ts', 'invariant.d.ts'])
  const workbenchTypes = join(dir, 'current-workbench-types')
  await mkdir(join(workbenchTypes, 'client'), { recursive: true })
  await writeFile(join(workbenchTypes, 'client/index.d.ts'), 'export interface CurrentContract { current: true }')
  await writeFile(join(dir, 'src/client/index.ts'), "import type { CurrentContract } from 'dsh-workbench/client'; export const current: CurrentContract = { current: true }")
  await buildPackage(dir, join(dir, 'example-output'), { workbenchTypes, declarationsOnly: true })
  assert.match(await readFile(join(dir, 'example-output/types/client/index.d.ts'), 'utf8'), /CurrentContract/)
})

test('external requests are exact and inject alone never externalizes a module', () => {
  const config = clientBundle({ name: 'fixture', dsh: { client: { inject: ['another'], external: ['another/client'] } } }, { root })
  assert.equal(config.deps.neverBundle('another/client'), true)
  assert.equal(config.deps.neverBundle('another'), false)
  assert.throws(() => config.plugins[0].resolveId('another'), /Undeclared DSH client module/)
  assert.equal(config.deps.neverBundle('react/unknown'), false)
  assert.deepEqual(PLATFORM_MODULES.slice(0, 5), ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis'])
  assert.throws(() => clientBundle({ name: 'bad', dsh: { client: { external: 'react' } } }, { root }))
  assert.throws(() => clientBundle({ name: 'bad', dsh: { client: { external: ['node:fs'] } } }, { root }))
})

test('dry runs need neither a checkout nor a dependency rewrite', () => {
  for (const script of ['scripts/build.mjs', 'examples/design-board/scripts/build.mjs']) {
    const result = spawnSync(process.execPath, [join(root, script), '--dry-run'], {
      cwd: tmpdir(), encoding: 'utf8', env: { ...process.env, DSH_CHECKOUT: '/not-a-checkout' },
    })
    assert.equal(result.status, 0, result.stderr)
    const plan = JSON.parse(result.stdout)
    assert.equal(plan.checkoutRequired, false)
    assert.equal(plan.modifiesNodeModules, false)
  }
})
