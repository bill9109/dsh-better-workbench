import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cp, mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { buildPackage } from '../scripts/build-package.mjs'

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..')

test('starter edits survive pending saves, failures, external updates and unmount', async () => {
  const slots = []
  let cursor = 0
  let active = true
  const effects = []
  const react = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
    useState(initial) {
      const index = cursor++
      if (!(index in slots)) slots[index] = initial
      return [slots[index], value => { assert.ok(active, 'setState after unmount'); slots[index] = value }]
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial } },
    useEffect(fn, dependencies) {
      const index = cursor++
      if (slots[index] && dependencies.every((value, i) => Object.is(value, slots[index].dependencies[i]))) return
      effects.push(() => {
        slots[index]?.cleanup?.()
        slots[index] = { dependencies, cleanup: fn() }
      })
    },
  }
  const exports = {}
  const source = await readFile(join(repository, 'examples/starter/src/client/index.ts'), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  runInNewContext(code, { exports, require: id => { assert.equal(id, 'react'); return react } })
  let Notes
  exports.apply({ effect: fn => fn(), workbench: { registerApp: app => { Notes = app.renderMain; return () => {} } } })
  const dirty = []
  const errors = []
  const saves = []
  const props = {
    instance: { instanceId: 'one', revision: 1, config: { text: 'initial' } },
    setDirty: value => dirty.push(value), reportError: value => errors.push(value),
    updateConfig: (patch, revision) => new Promise((resolve, reject) => saves.push({ patch, revision, resolve, reject })),
  }
  const render = () => { cursor = 0; const tree = Notes(props); effects.splice(0).forEach(fn => fn()); return tree }
  const change = text => render().children[0].props.onChange({ currentTarget: { value: text } })
  const submit = () => render().props.onSubmit({ preventDefault() {} })
  const settle = async () => { await Promise.resolve(); await Promise.resolve() }
  render()
  assert.equal(render().children[0].props.onBlur, undefined)
  props.instance = { ...props.instance, revision: 2, config: { text: 'external' } }
  render()
  assert.equal(render().children[0].props.value, 'external')
  change('first')
  assert.equal(dirty.at(-1), true)
  submit()
  submit()
  assert.equal(saves.length, 1)
  assert.equal(saves[0].patch.text, 'first')
  change('newer')
  props.instance = { ...props.instance, revision: 3, config: { text: 'remote' } }
  render()
  assert.equal(render().children[0].props.value, 'newer')
  assert.equal(saves[0].revision, 2)
  saves[0].resolve(3)
  await settle()
  assert.equal(dirty.at(-1), true)
  assert.equal(render().children[1].props.disabled, false)
  submit()
  assert.equal(saves[1].revision, 3)
  saves[1].reject('write failed')
  await settle()
  assert.equal(dirty.at(-1), true)
  assert.equal(errors.at(-1), 'write failed')
  assert.equal(render().children[0].props.value, 'newer')
  change('retry')
  assert.equal(errors.at(-1), null)
  submit()
  saves[2].resolve(4)
  await settle()
  assert.equal(dirty.at(-1), false)
  assert.equal(render().children[1].props.disabled, true)
  props.instance = { ...props.instance, revision: 4, config: { text: 'fresh' } }
  render()
  assert.equal(render().children[0].props.value, 'fresh')
  change('unmount edit')
  submit()
  const dirtyCount = dirty.length
  const errorCount = errors.length
  for (const slot of slots) slot?.cleanup?.()
  active = false
  saves[3].reject('late failure')
  await settle()
  assert.equal(dirty.length, dirtyCount)
  assert.equal(errors.length, errorCount)
})

test('copied starter builds with an installed workbench package and no parent helpers', async t => {
  const temporary = await mkdtemp(join(tmpdir(), 'workbench-independent-starter-'))
  t.after(() => rm(temporary, { recursive: true, force: true }))
  const root = join(temporary, 'starter')
  await cp(join(repository, 'examples/starter'), root, { recursive: true, filter: path => !path.includes('/node_modules') && !path.includes('/lib/') })
  await mkdir(join(root, 'lib'), { recursive: true })
  await writeFile(join(root, 'lib/sentinel'), 'existing starter output')
  const installed = join(root, 'node_modules/dsh-better-workbench')
  await mkdir(join(installed, 'scripts'), { recursive: true })
  const workbench = JSON.parse(await readFile(join(repository, 'package.json'), 'utf8'))
  await writeFile(join(installed, 'package.json'), JSON.stringify(workbench))
  await cp(join(repository, 'scripts/client-bundle.mjs'), join(installed, 'scripts/client-bundle.mjs'))
  await buildPackage(repository, join(installed, 'lib'))
  const starter = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  for (const name of Object.keys(starter.devDependencies)) {
    if (name === 'dsh-better-workbench') continue
    const target = join(root, 'node_modules', name)
    await mkdir(dirname(target), { recursive: true })
    await symlink(await realpath(join(repository, 'node_modules', name)), target, 'dir')
  }
  for (const file of ['scripts/build.mjs', 'tsdown.config.mjs']) {
    const source = await readFile(join(root, file), 'utf8')
    assert.ok(!source.includes('../../../scripts') && !source.includes('../../scripts'))
  }
  assert.equal(starter.devDependencies['dsh-better-workbench'], '^0.2.0')
  const result = spawnSync(process.execPath, ['scripts/build.mjs', '--verify'], {
    cwd: root, encoding: 'utf8', env: { ...process.env, DSH_CHECKOUT: '/not-a-checkout' },
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /lib unchanged/)
  assert.equal(await readFile(join(root, 'lib/sentinel'), 'utf8'), 'existing starter output')
})
