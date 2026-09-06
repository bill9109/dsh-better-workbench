import assert from 'node:assert/strict'
import test from 'node:test'
import { WorkbenchController, cloneConfig } from '../src/client/service.ts'
import { MemoryRepository } from '../src/client/storage.ts'

const Main = () => null
const app = (overrides = {}) => ({
  protocolVersion: 1, appId: 'board', title: 'Board', allowMultiple: true,
  config: { version: 1, defaults: () => ({ count: 0 }), validate(config) {
    if (typeof config.count !== 'number') throw new Error('count must be numeric')
  } },
  presentations: [{ kind: 'page', conversation: 'exclusive' }], defaultPresentation: 'page',
  renderMain: Main, ...overrides,
})
const stored = (overrides = {}) => ({
  instanceId: 'saved', appId: 'board', title: 'Saved', config: { count: 1 }, configVersion: 1,
  revision: 1, order: 0, createdAt: 1, updatedAt: 1, lastOpenedAt: 0, ...overrides,
})
const seed = (...instances) => ({ instances, dismissedDefaultAppIds: [], backups: [] })
const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const flush = () => new Promise(resolve => setImmediate(resolve))
const controller = (t, repository = new MemoryRepository(), options = {}) => {
  const service = new WorkbenchController({ repository, navigationStorage: null, ...options })
  t.after(() => service.dispose())
  return service
}
const waitFor = async predicate => {
  for (let count = 0; count < 100; count++) { if (predicate()) return; await flush() }
  assert.fail('Condition did not settle')
}

// A test timeout converts a blocked migration into a bounded regression failure.
test('ready failure recovers through retry and subsequent creation', { timeout: 2000 }, async t => {
  const repository = new MemoryRepository()
  const read = repository.read.bind(repository)
  let fail = true
  repository.read = () => fail ? Promise.reject(new Error('storage offline')) : read()
  const service = controller(t, repository)
  service.registerApp(app())
  await assert.rejects(service.ready, /storage offline/)
  assert.match(service.getSnapshot().error, /storage offline/)
  fail = false
  await service.retry()
  await service.ready
  assert.equal((await service.createInstance('board')).status, 'ready')
  assert.equal(service.getSnapshot().error, null)
  assert.equal(service.getSnapshot().loading, false)
})

test('reentrant prepare subscribers and migration refresh do not deadlock', { timeout: 2000 }, async t => {
  const repository = new MemoryRepository(seed(stored()))
  const service = controller(t, repository)
  await service.ready
  let calls = 0
  service.registerApp(app({ config: { version: 2, defaults: () => ({ count: 0 }), validate() {},
    async migrate(config) { calls++; return { ...config, migrated: true } },
  } }))
  let reentries = 0
  const unsubscribe = service.subscribe(() => {
    if (service.getSnapshot().instances[0]?.status === 'preparing' && reentries++ < 20) void service.prepareInstance('saved')
  })
  service.open('saved')
  await service.prepareInstance('saved')
  unsubscribe()
  assert.equal(calls, 1)
  assert.equal(service.getSnapshot().instances[0].status, 'ready')
  const state = await repository.read()
  assert.equal(state.instances[0].configVersion, 2)
  assert.equal(state.instances[0].revision, 2)
  assert.deepEqual(state.backups[0].config, { count: 1 })
})

test('failed migration retains old config and can retry without reinstalling app', { timeout: 2000 }, async t => {
  const repository = new MemoryRepository(seed(stored()))
  const service = controller(t, repository)
  await service.ready
  let failure = true
  service.registerApp(app({ config: { version: 2, defaults: () => ({ count: 0 }), validate() {},
    migrate(config) { if (failure) throw new Error('migration offline'); return { ...config, upgraded: true } },
  } }))
  service.open('saved')
  await service.prepareInstance('saved')
  assert.equal(service.getSnapshot().instances[0].status, 'migration-error')
  assert.equal((await repository.read()).instances[0].configVersion, 1)
  failure = false
  await service.retry()
  assert.equal(service.getSnapshot().instances[0].status, 'ready')
  assert.equal((await repository.read()).instances[0].configVersion, 2)
})

test('newer saved config is incompatible and never downgraded', async t => {
  const repository = new MemoryRepository(seed(stored({ configVersion: 3 })))
  const service = controller(t, repository)
  await service.ready
  service.registerApp(app())
  await service.prepareInstance('saved')
  assert.equal(service.getSnapshot().instances[0].status, 'incompatible')
  await assert.rejects(service.updateInstanceConfig('saved', { count: 2 }), /migrated/)
  assert.equal((await repository.read()).instances[0].configVersion, 3)
})

test('stale migration cannot commit across application generations', { timeout: 2000 }, async t => {
  const repository = new MemoryRepository(seed(stored()))
  const service = controller(t, repository)
  await service.ready
  const gate = deferred()
  const started = deferred()
  const remove = service.registerApp(app({ config: { version: 2, defaults: () => ({ count: 0 }), validate() {},
    migrate() { started.resolve(); return gate.promise },
  } }))
  const work = service.prepareInstance('saved')
  await started.promise
  remove()
  service.registerApp(app())
  await service.prepareInstance('saved')
  gate.resolve({ count: 999 })
  await work
  assert.equal((await repository.read()).instances[0].config.count, 1)
  assert.equal(service.getSnapshot().instances[0].status, 'ready')
})

test('migration CAS does not overwrite an externally updated revision', { timeout: 2000 }, async t => {
  const repository = new MemoryRepository(seed(stored()))
  const service = controller(t, repository)
  await service.ready
  const gate = deferred()
  const started = deferred()
  service.registerApp(app({ config: { version: 2, defaults: () => ({ count: 0 }), validate(config) {
    if (config.count < 0) throw new Error('invalid current config')
  }, migrate() { started.resolve(); return gate.promise } } }))
  const work = service.prepareInstance('saved')
  await started.promise
  await repository.transact(state => {
    state.instances[0].config = { count: -1 }
    state.instances[0].configVersion = 2
    state.instances[0].revision++
  })
  await flush()
  gate.resolve({ count: 999 })
  await work
  assert.equal((await repository.read()).instances[0].config.count, -1)
  assert.equal(service.getSnapshot().instances[0].status, 'migration-error')
})

test('defaults deduplicate across controllers and deletion persists across remount', { timeout: 2000 }, async t => {
  const repository = new MemoryRepository()
  const first = controller(t, repository)
  const second = controller(t, repository)
  const definition = app({ defaultInstance: { instanceId: 'default', title: 'Default' } })
  first.registerApp(definition)
  second.registerApp(definition)
  await Promise.all([first.ready, second.ready])
  await waitFor(() => first.getSnapshot().instances.length === 1 && second.getSnapshot().instances.length === 1)
  assert.equal((await repository.read()).instances.length, 1)
  await first.deleteInstance('default')
  await waitFor(() => second.getSnapshot().instances.length === 0)
  first.dispose()
  const third = controller(t, repository)
  third.registerApp(definition)
  await third.ready
  await flush()
  assert.deepEqual((await repository.read()).dismissedDefaultAppIds, ['board'])
  assert.equal(third.getSnapshot().instances.length, 0)
  await second.createInstance('board')
  assert.equal((await repository.read()).instances.length, 1)
})

test('queued default creation is invalidated by unregister', async t => {
  const repository = new MemoryRepository()
  const gate = deferred()
  const read = repository.read.bind(repository)
  repository.read = async () => { await gate.promise; return read() }
  const service = controller(t, repository)
  const remove = service.registerApp(app({ defaultInstance: { instanceId: 'default' } }))
  remove()
  gate.resolve()
  await service.ready
  await flush()
  assert.equal((await read()).instances.length, 0)
})

test('single-instance applications deduplicate concurrent manual creation', async t => {
  const repository = new MemoryRepository()
  const first = controller(t, repository)
  const second = controller(t, repository)
  first.registerApp(app({ allowMultiple: false }))
  second.registerApp(app({ allowMultiple: false }))
  const [one, two] = await Promise.all([first.createInstance('board'), second.createInstance('board')])
  assert.equal(one.instanceId, two.instanceId)
  assert.equal((await repository.read()).instances.length, 1)
})

test('config saves reject stale revisions and stale activation generations', async t => {
  const repository = new MemoryRepository(seed(stored()))
  const first = controller(t, repository)
  const second = controller(t, repository)
  await Promise.all([first.ready, second.ready])
  const remove = first.registerApp(app())
  second.registerApp(app())
  await first.prepareInstance('saved')
  const generation = first.getSnapshot().apps[0].generation
  await first.updateInstanceConfig('saved', { count: 2 }, 1, generation)
  await assert.rejects(second.updateInstanceConfig('saved', { count: 3 }, 1), /conflict/)
  remove()
  first.registerApp(app())
  await assert.rejects(first.updateInstanceConfig('saved', { count: 4 }, 2, generation), /activation changed/)
  assert.equal((await repository.read()).instances[0].config.count, 2)
})

test('validated config updates and renames do not publish a transient preparing state', async t => {
  const service = controller(t, new MemoryRepository(seed(stored())))
  await service.ready
  service.registerApp(app())
  await service.prepareInstance('saved')
  const statuses = []
  service.subscribe(() => statuses.push(service.getSnapshot().instances[0].status))
  await service.updateInstanceConfig('saved', { count: 8 })
  await service.renameInstance('saved', 'Changed')
  assert.ok(statuses.length > 0)
  assert.ok(statuses.every(status => status === 'ready'), statuses.join(','))
})

test('cloneConfig rejects non-JSON and cycles, preserves prototype-named keys and isolates copies', () => {
  const source = JSON.parse('{"__proto__":{"safe":true},"nested":{"list":[1,null,true]}}')
  const copy = cloneConfig(source)
  copy.nested.list.push(2)
  assert.equal(source.nested.list.length, 3)
  assert.ok(Object.hasOwn(copy, '__proto__'))
  assert.equal(Object.getPrototypeOf(copy), Object.prototype)
  const cycle = {}; cycle.self = cycle
  for (const value of [null, [], new Date(), { a: undefined }, { a: NaN }, { a: Infinity }, { a: 1n }, { a() {} }, cycle]) {
    assert.throws(() => cloneConfig(value))
  }
  const shared = { value: 1 }
  assert.deepEqual(cloneConfig({ one: shared, two: shared }), { one: { value: 1 }, two: { value: 1 } })
})

test('config validator failure leaves durable config and revision unchanged', async t => {
  const repository = new MemoryRepository(seed(stored()))
  const service = controller(t, repository)
  await service.ready
  service.registerApp(app())
  await assert.rejects(service.updateInstanceConfig('saved', { count: 'invalid' }), /numeric/)
  assert.equal((await repository.read()).instances[0].revision, 1)
  assert.equal((await repository.read()).instances[0].config.count, 1)
})

test('local template cancelled while ready is pending cannot create an instance', async t => {
  const repository = new MemoryRepository()
  const gate = deferred()
  const read = repository.read.bind(repository)
  repository.read = async () => { await gate.promise; return read() }
  const service = controller(t, repository)
  service.registerApp(app())
  service.registerTemplate({ kind: 'instance', templateId: 'local', title: 'Local', appId: 'board' })
  const creating = service.startCreation('local')
  service.cancelCreation()
  gate.resolve()
  await assert.rejects(creating, /cancelled/)
  assert.equal((await read()).instances.length, 0)
  assert.equal(service.getSnapshot().creation.status, 'cancelled')
})

for (const cancellation of ['cancel', 'creator-unload', 'template-unload', 'dispose']) {
  test('creator late result cannot revive creation after ' + cancellation, async t => {
    const service = controller(t)
    await service.ready
    const gate = deferred()
    let context
    const removeTemplate = service.registerTemplate({ kind: 'agent', templateId: 'agent', title: 'Agent', creatorId: 'creator' })
    const removeCreator = service.registerCreator({ creatorId: 'creator', start(_template, value) { context = value; return gate.promise } })
    const creating = service.startCreation('agent')
    assert.ok(context.requestId)
    if (cancellation === 'cancel') service.cancelCreation()
    if (cancellation === 'creator-unload') removeCreator()
    if (cancellation === 'template-unload') removeTemplate()
    if (cancellation === 'dispose') service.dispose()
    assert.equal(context.signal.aborted, true)
    gate.resolve({ sessionId: 'late-session' })
    await assert.rejects(creating, /cancelled|changed|disposed/)
    assert.notEqual(service.getSnapshot().creation.status, 'complete')
  })
}

test('creator cancellation during final repository refresh remains cancelled', async t => {
  const repository = new MemoryRepository()
  const service = controller(t, repository)
  await service.ready
  const read = repository.read.bind(repository)
  const gate = deferred()
  const started = deferred()
  repository.read = async () => { started.resolve(); await gate.promise; return read() }
  service.registerTemplate({ kind: 'agent', templateId: 'agent', title: 'Agent', creatorId: 'creator' })
  service.registerCreator({ creatorId: 'creator', async start() { return { sessionId: 'session' } } })
  const creating = service.startCreation('agent')
  await started.promise
  service.cancelCreation()
  gate.resolve()
  await assert.rejects(creating, /cancelled/)
  assert.equal(service.getSnapshot().creation.status, 'cancelled')
})

test('creator success, duplicate work, and invalid result states are explicit', async t => {
  const service = controller(t)
  await service.ready
  const gate = deferred()
  service.registerTemplate({ kind: 'agent', templateId: 'agent', title: 'Agent', creatorId: 'creator' })
  const remove = service.registerCreator({ creatorId: 'creator', start: () => gate.promise })
  const creating = service.startCreation('agent')
  await assert.rejects(service.startCreation('agent'), /already in progress/)
  gate.resolve({ sessionId: 'created-session' })
  assert.deepEqual(await creating, { sessionId: 'created-session' })
  assert.equal(service.getSnapshot().creation.status, 'complete')
  remove()
  service.registerCreator({ creatorId: 'creator', async start() { return {} } })
  await assert.rejects(service.startCreation('agent'), /invalid result/)
  assert.equal(service.getSnapshot().creation.status, 'failed')
})

test('dirty navigation guards remain local and external deletion redirects', async t => {
  const repository = new MemoryRepository(seed(stored()))
  let allow = false
  const first = controller(t, repository, { confirmDiscard: () => allow })
  const second = controller(t, repository)
  await Promise.all([first.ready, second.ready])
  first.registerApp(app())
  first.open('saved')
  first.setDirty('saved', true)
  first.openConversation()
  assert.equal(first.getSnapshot().route.kind, 'workbench-instance')
  assert.equal(second.getSnapshot().route.kind, 'conversation')
  allow = true
  first.openConversation()
  assert.equal(first.getSnapshot().route.kind, 'conversation')
  first.open('saved')
  await second.deleteInstance('saved')
  await waitFor(() => first.getSnapshot().route.kind === 'workbench-home')
})

test('export and explicit backup restore preserve copies and enforce revision/version checks', async t => {
  const initial = seed(stored({ config: { count: 8 }, revision: 3 }))
  initial.backups.push({ instanceId: 'saved', config: { count: 2 }, configVersion: 1, revision: 2, createdAt: 1 })
  initial.backups.push({ instanceId: 'saved', config: { count: 1 }, configVersion: 2, revision: 1, createdAt: 0 })
  const repository = new MemoryRepository(initial)
  const service = controller(t, repository)
  await service.ready
  service.registerApp(app())
  const exported = await service.exportInstance('saved')
  assert.equal(exported.backups.length, 2)
  assert.equal(Object.hasOwn(exported.instance, 'status'), false)
  exported.instance.config.count = 100
  exported.backups[0].config.count = 100
  await assert.rejects(service.restoreBackup('saved', 2, 1), /conflict/)
  await assert.rejects(service.restoreBackup('saved', 1, 3), /matching application/)
  await assert.rejects(service.restoreBackup('saved', 999, 3), /not found/)
  await service.restoreBackup('saved', 2, 3)
  const state = await repository.read()
  assert.equal(state.instances[0].config.count, 2)
  assert.equal(state.instances[0].revision, 4)
  assert.equal(state.backups.at(-1).revision, 3)
  assert.deepEqual(state.backups.at(-1).config, { count: 8 })
  assert.equal(service.getSnapshot().instances[0].status, 'ready')
})

test('presentation preference is instance-specific and survives controller remount in the same tab', async t => {
  const values = new Map()
  const navigationStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  const repository = new MemoryRepository(seed(stored(), stored({ instanceId: 'other' })))
  const definition = app({
    renderCapsule: Main,
    presentations: [{ kind: 'page', conversation: 'exclusive' }, { kind: 'capsule', placement: 'floating', conversation: 'resident' }],
  })
  const first = controller(t, repository, { navigationStorage })
  await first.ready
  first.registerApp(definition)
  first.open('saved', 'capsule')
  first.open('other')
  assert.equal(first.getSnapshot().route.presentation, 'page')
  first.open('saved')
  assert.equal(first.getSnapshot().route.presentation, 'capsule')
  await flush()
  first.dispose()
  const second = controller(t, repository, { navigationStorage })
  await second.ready
  second.registerApp(definition)
  second.openConversation()
  second.open('saved')
  assert.equal(second.getSnapshot().route.presentation, 'capsule')
})

test('creation waits for its refresh despite a newer invalidation', { timeout: 2000 }, async t => {
  const base = new MemoryRepository()
  let listener
  let reads = 0
  const gate = deferred()
  const repository = {
    subscribe(fn) { listener = fn; return () => {} }, dispose() {},
    transact: update => base.transact(update),
    async read() {
      reads++
      if (reads === 2) queueMicrotask(() => listener())
      if (reads === 3) await gate.promise
      return base.read()
    },
  }
  const service = controller(t, repository)
  await service.ready
  service.registerApp(app())
  const created = await service.createInstance('board')
  assert.equal(service.getSnapshot().instances[0].instanceId, created.instanceId)
  assert.equal((await base.read()).instances.length, 1)
  gate.resolve()
  await flush()
})

test('registry getters and snapshots cannot mutate validation or template defaults', async t => {
  const service = controller(t)
  await service.ready
  service.registerApp(app({ defaultInstance: { config: { count: 0 } } }))
  service.registerTemplate({ kind: 'instance', templateId: 'local', title: 'Local', appId: 'board', defaultConfig: { count: 2 } })
  const exposed = service.getApp('board')
  assert.throws(() => { exposed.config.validate = () => {} }, TypeError)
  assert.throws(() => { exposed.defaultInstance.config.count = 99 }, TypeError)
  assert.throws(() => { exposed.presentations[0].kind = 'capsule' }, TypeError)
  assert.throws(() => { service.getTemplate('local').defaultConfig.count = 99 }, TypeError)
  assert.throws(() => { service.getSnapshot().templates[0].defaultConfig.count = 99 }, TypeError)
  const created = await service.createInstance('board')
  await assert.rejects(service.updateInstanceConfig(created.instanceId, { count: 'invalid' }), /numeric/)
  assert.equal(service.getTemplate('local').defaultConfig.count, 2)
})

test('disposers capture ids and stale creators cannot remove new activations', async t => {
  const service = controller(t)
  await service.ready
  const definition = app()
  const removeApp = service.registerApp(definition)
  definition.appId = 'mutated'
  removeApp()
  assert.equal(service.getApp('board'), undefined)
  const template = { kind: 'agent', templateId: 'agent', title: 'Agent', creatorId: 'creator' }
  const removeTemplate = service.registerTemplate(template)
  template.templateId = 'mutated'
  removeTemplate()
  assert.equal(service.getTemplate('agent'), undefined)
  service.registerTemplate({ kind: 'agent', templateId: 'agent', title: 'Agent', creatorId: 'creator' })
  const creator = { creatorId: 'creator', async start() { return { sessionId: 'created' } } }
  const removeOld = service.registerCreator(creator)
  removeOld()
  const removeCurrent = service.registerCreator(creator)
  removeOld()
  assert.equal(service.getSnapshot().templates[0].available, true)
  creator.creatorId = 'mutated'
  creator.start = async () => ({ sessionId: 'unexpected' })
  assert.deepEqual(await service.startCreation('agent'), { sessionId: 'created' })
  removeCurrent()
  assert.equal(service.getSnapshot().templates[0].available, false)
})

test('committed creation succeeds even when subsequent invalidation reads fail', async t => {
  const repository = new MemoryRepository()
  const service = controller(t, repository)
  service.registerApp(app())
  await service.ready
  await flush()
  repository.read = () => Promise.reject(new Error('read unavailable after commit'))
  const created = await service.createInstance('board')
  assert.ok(created.instanceId)
  assert.equal(service.getSnapshot().instances.length, 1)
  await flush()
  assert.match(service.getSnapshot().error, /read unavailable/)
})

test('commit followed by disposal keeps the committed creation result', async t => {
  const repository = new MemoryRepository()
  const service = controller(t, repository)
  service.registerApp(app())
  await service.ready
  const transact = repository.transact.bind(repository)
  repository.transact = async callback => {
    const result = await transact(callback)
    service.dispose()
    return result
  }
  const created = await service.createInstance('board')
  assert.equal((await repository.read()).instances[0].instanceId, created.instanceId)
})

test('disposed controllers reject registry contributions; invalid sources are rejected', async t => {
  const service = controller(t)
  await service.ready
  assert.throws(() => service.registerApp(app({ source: { packageName: 'pkg', version: '1', repository: 'javascript:alert(1)' } })), /repository URL/)
  service.dispose()
  assert.throws(() => service.registerTemplate({ kind: 'agent', templateId: 'a', title: 'A', creatorId: 'a' }), /disposed/)
  assert.throws(() => service.registerCreator({ creatorId: 'a', async start() { return { sessionId: 'a' } } }), /disposed/)
})

test('application removal aborts migration and waits for its cleanup', async t => {
  const repository = new MemoryRepository(seed(stored()))
  const service = controller(t, repository)
  await service.ready
  const gate = deferred()
  let signal
  const remove = service.registerApp(app({ config: { version: 2, defaults: () => ({ count: 0 }), validate() {},
    async migrate(config, from, context) { signal = context.signal; await gate.promise; return config },
  } }))
  const preparing = service.prepareInstance('saved')
  await waitFor(() => signal !== undefined)
  let done = false
  const unloading = remove().then(() => { done = true })
  assert.equal(signal.aborted, true)
  await flush()
  assert.equal(done, false)
  gate.resolve()
  await unloading
  await preparing
  assert.equal((await repository.read()).instances[0].configVersion, 1)
})

test('controller disposal reports non-cooperative task timeout rather than claiming success', async () => {
  const service = new WorkbenchController({ repository: new MemoryRepository(), navigationStorage: null, teardownTimeoutMs: 10 })
  await service.ready
  const gate = deferred()
  service.registerCreator({ creatorId: 'slow', start: () => gate.promise })
  service.registerTemplate({ kind: 'agent', templateId: 'slow-template', title: 'Slow', creatorId: 'slow' })
  const creation = service.startCreation('slow-template')
  const rejected = assert.rejects(creation, /disposed|cancelled|changed/)
  const original = console.error
  const errors = []
  console.error = (...args) => errors.push(args)
  try {
    const disposal = service.dispose()
    assert.equal(service.dispose(), disposal)
    await assert.rejects(disposal, /teardown timed out/)
    assert.equal(errors.length, 1)
  } finally {
    console.error = original
    gate.resolve({ sessionId: 'late' })
    await rejected
  }
})
