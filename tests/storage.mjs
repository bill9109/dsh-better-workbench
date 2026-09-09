import assert from 'node:assert/strict'
import test from 'node:test'
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb'
import { IndexedDbRepository, MemoryRepository } from '../src/client/storage.ts'

const empty = () => ({ instances: [], dismissedDefaultAppIds: [], backups: [] })
const instance = (instanceId = 'one') => ({
  instanceId, appId: 'app', title: instanceId, config: { count: 0 },
  configVersion: 1, revision: 1, order: 0, createdAt: 10, updatedAt: 10, lastOpenedAt: 0,
})
const storage = entries => ({ getItem: key => entries[key] ?? null })
const create = (t, options = {}) => {
  const repository = new IndexedDbRepository({ indexedDB: new IDBFactory(), localStorage: null, broadcastChannel: null, ...options })
  t.after(() => repository.dispose())
  return repository
}
const rawRecord = async (factory, key, dbName = 'dsh-better-workbench') => {
  const db = await new Promise((resolve, reject) => {
    const request = factory.open(dbName, 1)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('state').objectStore('state').get(key)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } finally { db.close() }
}

for (const backend of ['memory', 'indexeddb']) {
  const pair = t => {
    if (backend === 'indexeddb') {
      const indexedDB = new IDBFactory()
      return [create(t, { indexedDB }), create(t, { indexedDB })]
    }
    const first = new MemoryRepository()
    const second = new MemoryRepository(first)
    t.after(() => { first.dispose(); second.dispose() })
    return [first, second]
  }

  test(backend + ': state and callback results are isolated, backups persist', async t => {
    const [repository, other] = pair(t)
    assert.deepEqual(await repository.read(), empty())
    const returned = await repository.transact(state => {
      state.instances.push(instance())
      state.backups.push({ instanceId: 'one', config: { old: true }, configVersion: 1, revision: 1, createdAt: 9 })
      return state.instances[0]
    })
    returned.config.count = 100
    const read = await other.read()
    assert.equal(read.instances[0].config.count, 0)
    assert.equal(read.backups[0].config.old, true)
    read.instances[0].config.count = 200
    assert.equal((await repository.read()).instances[0].config.count, 0)
  })

  test(backend + ': concurrent repositories preserve every update and perform CAS', async t => {
    const [first, second] = pair(t)
    await first.transact(state => state.instances.push(instance()))
    await Promise.all(Array.from({ length: 30 }, (_, index) => (index % 2 ? first : second).transact(state => {
      state.instances[0].config.count += 1
      state.instances[0].revision += 1
    })))
    assert.equal((await first.read()).instances[0].config.count, 30)
    const cas = repository => repository.transact(state => {
      if (state.instances[0].revision !== 31) throw new Error('revision conflict')
      state.instances[0].revision++
      return state.instances[0].revision
    })
    const outcomes = await Promise.allSettled([cas(first), cas(second)])
    assert.equal(outcomes.filter(result => result.status === 'fulfilled').length, 1)
    assert.match(outcomes.find(result => result.status === 'rejected').reason.message, /revision conflict/)
    assert.equal((await second.read()).instances[0].revision, 32)
  })

  test(backend + ': thrown, async and uncloneable updates reject without mutation', async t => {
    const [repository] = pair(t)
    await repository.transact(state => state.instances.push(instance()))
    const original = await repository.read()
    await assert.rejects(repository.transact(state => {
      state.instances.length = 0
      throw new Error('callback failed')
    }), /callback failed/)
    await assert.rejects(repository.transact(async state => {
      state.instances.length = 0
      await Promise.resolve()
      throw new Error('late failure')
    }), /must be synchronous/)
    await assert.rejects(repository.transact(state => {
      state.instances[0].config.bad = () => {}
    }), { name: 'DataCloneError' })
    assert.deepEqual(await repository.read(), original)
    assert.equal(await repository.transact(() => 42), 42)
  })

  test(backend + ': same-tab subscriptions fire only after commit and dispose', async t => {
    const [first, second] = pair(t)
    await first.read()
    await second.read()
    let firstCount = 0
    let secondCount = 0
    first.subscribe(() => { throw new Error('broken observer') })
    first.subscribe(() => { firstCount++ })
    const unsubscribe = second.subscribe(() => { secondCount++ })
    await first.transact(state => state.dismissedDefaultAppIds.push('app'))
    assert.equal(firstCount, 1)
    assert.equal(secondCount, 1)
    await assert.rejects(first.transact(() => { throw new Error('abort') }))
    assert.equal(firstCount, 1)
    unsubscribe()
    await first.transact(() => {})
    assert.equal(secondCount, 1)
    second.dispose()
    await assert.rejects(second.read(), /disposed/)
    await assert.rejects(second.transact(() => {}), /disposed/)
    assert.throws(() => second.subscribe(() => {}), /disposed/)
    await first.transact(() => {})
  })
}

for (const version of [1, 2, 3]) {
  test('indexeddb: imports v' + version + ' once, preserving raw JSON and config backups', async t => {
    const indexedDB = new IDBFactory()
    const key = version === 1 ? 'dsh-better-workbench.instances.v1' : 'dsh-better-workbench.state.v' + version
    const old = { instanceId: 'legacy', appId: 'app', title: 'Legacy', config: { text: 'saved' }, order: 2, updatedAt: 123 }
    const raw = JSON.stringify({ version, instances: [old], dismissedDefaultAppIds: ['hidden'], route: { kind: 'conversation' } })
    const entries = { [key]: raw }
    const repository = create(t, { indexedDB, localStorage: storage(entries) })
    const state = await repository.read()
    assert.equal(state.instances.length, 1)
    assert.deepEqual(state.instances[0], { ...old, configVersion: 1, revision: 1, createdAt: 123, lastOpenedAt: 0 })
    assert.equal(state.backups[0].config.text, 'saved')
    assert.equal(state.backups[0].configVersion, 1)
    assert.deepEqual(state.dismissedDefaultAppIds, ['hidden'])
    assert.equal(entries[key], raw)
    assert.deepEqual((await rawRecord(indexedDB, 'legacy-backup')).sources, [{ key, raw }])
    assert.deepEqual((await rawRecord(indexedDB, 'legacy-import')).sourceKeys, [key])
    await repository.transact(state => { state.instances.length = 0 })
    const reopened = create(t, { indexedDB, localStorage: { getItem() { throw new Error('must not reimport') } } })
    assert.deepEqual((await reopened.read()).instances, [])
  })
}

test('indexeddb: most recent legacy key wins, all originals are retained', async t => {
  const indexedDB = new IDBFactory()
  const entries = {
    'dsh-better-workbench.state.v3': JSON.stringify({ version: 3, instances: [instance('new')] }),
    'dsh-better-workbench.state.v2': JSON.stringify({ version: 2, instances: [instance('old')] }),
  }
  const repository = create(t, { indexedDB, localStorage: storage(entries) })
  assert.equal((await repository.read()).instances[0].instanceId, 'new')
  assert.equal((await rawRecord(indexedDB, 'legacy-backup')).sources.length, 2)
})

test('indexeddb: malformed legacy data is quarantined without falling back to stale data', async t => {
  const indexedDB = new IDBFactory()
  const entries = {
    'dsh-better-workbench.state.v3': '{corrupt',
    'dsh-better-workbench.state.v2': JSON.stringify({ version: 2, instances: [instance('older')] }),
  }
  const repository = create(t, { indexedDB, localStorage: storage(entries) })
  const state = await repository.read()
  assert.equal(state.instances.length, 0)
  assert.match(state.recovery.errors[0], /Invalid JSON/)
  assert.equal(state.recovery.sources.length, 2)
  assert.equal((await rawRecord(indexedDB, 'legacy-backup')).sources[0].raw, '{corrupt')
  assert.equal(entries['dsh-better-workbench.state.v3'], '{corrupt')
  entries['dsh-better-workbench.state.v3'] = JSON.stringify({ version: 3, instances: [instance('fixed')] })
  assert.equal((await repository.read()).recovery.sources[0].raw, '{corrupt', 'original backup survives later changes to localStorage')
})

test('indexeddb: invalid instance does not silently disappear or clear its config', async t => {
  const repository = create(t, { localStorage: storage({
    'dsh-better-workbench.state.v3': JSON.stringify({ version: 3, instances: [{ ...instance(), config: null }, instance('valid')] }),
  }) })
  const state = await repository.read()
  assert.equal(state.instances[0].instanceId, 'valid')
  assert.match(state.recovery.errors[0], /Invalid workbench repository instance/)
  assert.equal(JSON.parse(state.recovery.sources[0].raw).instances[0].config, null)
  await repository.transact(draft => { draft.instances[0].title = 'Updated' })
  assert.deepEqual((await repository.read()).recovery, state.recovery)
})

test('indexeddb: unavailable database and legacy storage access errors reject', async t => {
  const absent = create(t, { indexedDB: null })
  await assert.rejects(absent.read(), /IndexedDB is unavailable/)
  await assert.rejects(absent.transact(() => {}), /IndexedDB is unavailable/)
  const denied = create(t, { indexedDB: { open() { throw new Error('open denied') } } })
  await assert.rejects(denied.read(), /open denied/)
  const inaccessible = create(t, { localStorage: { getItem() { throw new Error('storage denied') } } })
  await assert.rejects(inaccessible.read(), /storage denied/)
})

test('indexeddb: read and write request failures reject without replacing committed state', async t => {
  const repository = create(t)
  await repository.transact(state => state.instances.push(instance()))
  const originalGet = IDBObjectStore.prototype.get
  IDBObjectStore.prototype.get = function () { throw new DOMException('read denied', 'UnknownError') }
  try { await assert.rejects(repository.read(), /read denied/) }
  finally { IDBObjectStore.prototype.get = originalGet }
  const originalPut = IDBObjectStore.prototype.put
  IDBObjectStore.prototype.put = function () { throw new DOMException('quota exhausted', 'QuotaExceededError') }
  try {
    await assert.rejects(repository.transact(state => { state.instances.length = 0 }), /quota exhausted/)
  } finally { IDBObjectStore.prototype.put = originalPut }
  assert.equal((await repository.read()).instances.length, 1)
})

test('indexeddb: asynchronous request errors preserve their cause and committed state', async t => {
  const repository = create(t)
  await repository.transact(state => state.instances.push(instance()))
  const originalPut = IDBObjectStore.prototype.put
  IDBObjectStore.prototype.put = function (value, key) { return this.add(value, key) }
  try {
    await assert.rejects(repository.transact(state => { state.instances.length = 0 }), { name: 'ConstraintError' })
  } finally { IDBObjectStore.prototype.put = originalPut }
  assert.equal((await repository.read()).instances.length, 1)
})

test('indexeddb: failed initial import rolls back backup, marker and state together', async t => {
  const indexedDB = new IDBFactory()
  const raw = JSON.stringify({ version: 3, instances: [instance()] })
  const entries = { 'dsh-better-workbench.state.v3': raw }
  const repository = create(t, { indexedDB, localStorage: storage(entries) })
  const originalPut = IDBObjectStore.prototype.put
  IDBObjectStore.prototype.put = function (value, key) {
    if (key === 'main') throw new DOMException('quota exhausted', 'QuotaExceededError')
    return originalPut.call(this, value, key)
  }
  try { await assert.rejects(repository.read(), { name: 'QuotaExceededError' }) }
  finally { IDBObjectStore.prototype.put = originalPut }
  for (const key of ['main', 'legacy-import', 'legacy-backup']) assert.equal(await rawRecord(indexedDB, key), undefined)
  assert.equal(entries['dsh-better-workbench.state.v3'], raw)
  assert.equal((await repository.read()).instances.length, 1)
})

test('indexeddb: externally aborted read rejects instead of returning an empty state', async t => {
  const repository = create(t)
  await repository.transact(state => state.instances.push(instance()))
  const originalGet = IDBObjectStore.prototype.get
  IDBObjectStore.prototype.get = function (key) {
    const request = originalGet.call(this, key)
    request.addEventListener('success', () => this.transaction.abort())
    return request
  }
  try { await assert.rejects(repository.read(), /aborted/) }
  finally { IDBObjectStore.prototype.get = originalGet }
  assert.equal((await repository.read()).instances.length, 1)
})

test('indexeddb: BroadcastChannel carries invalidation only and never trusts remote state', async t => {
  const channels = []
  class Channel {
    messages = []
    onmessage = null
    closed = false
    constructor(name) { this.name = name; channels.push(this) }
    postMessage(message) { this.messages.push(message) }
    close() { this.closed = true }
  }
  const repository = create(t, { broadcastChannel: Channel })
  await repository.read()
  let notifications = 0
  repository.subscribe(() => { notifications++ })
  await repository.transact(state => state.instances.push(instance()))
  const channel = channels[0]
  assert.deepEqual(Object.keys(channel.messages.at(-1)).sort(), ['origin', 'type'])
  channel.onmessage({ data: { type: 'invalidate', origin: 'another-tab', state: { instances: [] } } })
  assert.equal(notifications, 2)
  assert.equal((await repository.read()).instances.length, 1)
  channel.onmessage({ data: channel.messages.at(-1) })
  assert.equal(notifications, 2)
  repository.dispose()
  assert.equal(channel.closed, true)
})
