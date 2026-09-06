export interface StoredInstance {
  instanceId: string
  appId: string
  title: string
  config: Record<string, unknown>
  configVersion: number
  revision: number
  order: number
  createdAt: number
  updatedAt: number
  lastOpenedAt: number
}

export interface StoredConfigBackup {
  instanceId: string
  config: Record<string, unknown>
  configVersion: number
  revision: number
  createdAt: number
}

export interface RepositoryState {
  instances: StoredInstance[]
  dismissedDefaultAppIds: string[]
  backups: StoredConfigBackup[]
  recovery?: { sources: Array<{ key: string; raw: string }>; errors: string[] }
}

export interface WorkbenchRepository {
  read(): Promise<RepositoryState>
  /** The callback must be synchronous. Revision checks belong inside it. */
  transact<T>(update: (state: RepositoryState) => T): Promise<T>
  subscribe(listener: () => void): () => void
  dispose(): void
}

export interface IndexedDbRepositoryOptions {
  dbName?: string
  indexedDB?: IDBFactory | null
  localStorage?: Pick<Storage, 'getItem'> | null
  broadcastChannel?: typeof BroadcastChannel | null
}

const LEGACY_KEYS = ['dsh-workbench.state.v3', 'dsh-workbench.state.v2', 'dsh-workbench.instances.v1']
const peers = new Set<IndexedDbRepository>()
const origin = Math.random().toString(36).slice(2)

function emptyState(): RepositoryState {
  return { instances: [], dismissedDefaultAppIds: [], backups: [] }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertSynchronous(value: unknown): void {
  if ((typeof value === 'object' && value !== null || typeof value === 'function')
    && typeof (value as { then?: unknown }).then === 'function') {
    // Consume an async callback rejection without allowing its draft to commit.
    void Promise.resolve(value).catch(() => {})
    throw new TypeError('Repository transaction callbacks must be synchronous')
  }
}

function assertState(value: unknown): asserts value is RepositoryState {
  if (!isRecord(value) || !Array.isArray(value.instances) || !Array.isArray(value.dismissedDefaultAppIds)
    || !Array.isArray(value.backups) || !value.dismissedDefaultAppIds.every(id => typeof id === 'string')) {
    throw new Error('Invalid workbench repository state')
  }
  const ids = new Set<string>()
  for (const item of value.instances) {
    if (!isRecord(item) || typeof item.instanceId !== 'string' || !item.instanceId.trim()
      || typeof item.appId !== 'string' || !item.appId.trim() || typeof item.title !== 'string'
      || !isRecord(item.config) || !Number.isSafeInteger(item.configVersion) || Number(item.configVersion) < 1
      || !Number.isSafeInteger(item.revision) || Number(item.revision) < 0
      || !['order', 'createdAt', 'updatedAt', 'lastOpenedAt'].every(key => typeof item[key] === 'number' && Number.isFinite(item[key]))
      || ids.has(item.instanceId)) throw new Error('Invalid workbench repository instance')
    ids.add(item.instanceId)
  }
  for (const item of value.backups) {
    if (!isRecord(item) || typeof item.instanceId !== 'string' || !isRecord(item.config)
      || !Number.isSafeInteger(item.configVersion) || Number(item.configVersion) < 1
      || !Number.isSafeInteger(item.revision) || Number(item.revision) < 0
      || typeof item.createdAt !== 'number' || !Number.isFinite(item.createdAt)) {
      throw new Error('Invalid workbench configuration backup')
    }
  }
}

function notify(listeners: Set<() => void>): void {
  for (const listener of [...listeners]) {
    // An observer cannot undo a committed write or prevent other invalidations.
    try { listener() } catch { /* Observer errors are independent of persistence. */ }
  }
}

function importLegacy(storage: Pick<Storage, 'getItem'> | null | undefined): {
  state: RepositoryState
  sources: Array<{ key: string; raw: string }>
} {
  const sources: Array<{ key: string; raw: string }> = []
  for (const key of LEGACY_KEYS) {
    const raw = storage?.getItem(key)
    if (raw !== null && raw !== undefined) sources.push({ key, raw })
  }
  if (!sources.length) return { state: emptyState(), sources }
  const source = sources[0]
  let parsed: unknown
  try { parsed = JSON.parse(source.raw) } catch {
    return { state: { ...emptyState(), recovery: { sources, errors: ['Invalid JSON in ' + source.key] } }, sources }
  }
  const expectedVersion = source.key === LEGACY_KEYS[0] ? 3 : source.key === LEGACY_KEYS[1] ? 2 : 1
  // Some v1 writers persisted the instance array directly.
  const legacy = Array.isArray(parsed) && expectedVersion === 1 ? { instances: parsed, version: 1 } : parsed
  if (!isRecord(legacy) || legacy.version !== expectedVersion || !Array.isArray(legacy.instances)) {
    return { state: { ...emptyState(), recovery: { sources, errors: ['Invalid legacy workbench state: ' + source.key] } }, sources }
  }
  const now = Date.now()
  const errors: string[] = []
  const instances: StoredInstance[] = []
  for (const [index, item] of legacy.instances.entries()) {
    try {
    if (!isRecord(item)) throw new Error('Invalid legacy workbench instance')
    const updatedAt = item.updatedAt ?? now
    const candidate: StoredInstance = {
      instanceId: item.instanceId as string,
      appId: item.appId as string,
      title: item.title as string,
      config: structuredClone(item.config) as Record<string, unknown>,
      configVersion: (item.configVersion ?? 1) as number,
      revision: (item.revision ?? 1) as number,
      order: (item.order ?? 0) as number,
      createdAt: (item.createdAt ?? updatedAt) as number,
      updatedAt: updatedAt as number,
      lastOpenedAt: (item.lastOpenedAt ?? 0) as number,
    }
    assertState({ ...emptyState(), instances: [...instances, candidate] })
    instances.push(candidate)
    } catch (error) { errors.push('Record ' + (index + 1) + ': ' + (error instanceof Error ? error.message : String(error))) }
  }
  const dismissed = legacy.dismissedDefaultAppIds ?? []
  if (!Array.isArray(dismissed) || !dismissed.every(id => typeof id === 'string')) errors.push('Invalid dismissed default application identifiers')
  const state: RepositoryState = {
    instances,
    dismissedDefaultAppIds: Array.isArray(dismissed) ? dismissed.filter((id): id is string => typeof id === 'string') : [],
    ...(errors.length ? { recovery: { sources, errors } } : {}),
    backups: instances.map(item => ({
      instanceId: item.instanceId,
      config: structuredClone(item.config),
      configVersion: item.configVersion,
      revision: item.revision,
      createdAt: now,
    })),
  }
  assertState(state)
  return { state, sources }
}

export class IndexedDbRepository implements WorkbenchRepository {
  private readonly options: IndexedDbRepositoryOptions
  private readonly dbName: string
  private readonly listeners = new Set<() => void>()
  private database?: Promise<IDBDatabase>
  private factory?: IDBFactory
  private channel?: BroadcastChannel
  private disposed = false
  private readonly transactions = new Set<IDBTransaction>()

  constructor(options: IndexedDbRepositoryOptions = {}) {
    this.options = options
    this.dbName = options.dbName ?? 'dsh-workbench'
    peers.add(this)
  }

  private async open(): Promise<IDBDatabase> {
    if (this.disposed) throw new Error('Workbench repository is disposed')
    if (!this.database) {
      const factory = this.options.indexedDB === undefined ? globalThis.indexedDB : this.options.indexedDB
      if (!factory) throw new Error('IndexedDB is unavailable')
      this.factory = factory
      this.database = new Promise((resolve, reject) => {
        const request = factory.open(this.dbName, 1)
        let failed = false
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains('state')) request.result.createObjectStore('state')
        }
        request.onerror = () => { failed = true; reject(request.error ?? new Error('IndexedDB open failed')) }
        request.onblocked = () => { failed = true; reject(new Error('IndexedDB open is blocked')) }
        request.onsuccess = () => {
          const db = request.result
          if (failed || this.disposed) {
            db.close()
            reject(new Error('Workbench repository is disposed or database opening failed'))
            return
          }
          db.onversionchange = () => { db.close(); this.database = undefined }
          resolve(db)
        }
      })
      try {
        await this.database
        const Channel = this.options.broadcastChannel === undefined ? globalThis.BroadcastChannel : this.options.broadcastChannel
        if (Channel && !this.disposed && !this.channel) {
          this.channel = new Channel('dsh-workbench:' + this.dbName)
          this.channel.onmessage = event => {
            if (isRecord(event.data) && event.data.type === 'invalidate' && event.data.origin !== origin) notify(this.listeners)
          }
        }
      } catch (error) {
        const database = this.database
        this.database = undefined
        void database?.then(db => db.close(), () => {})
        throw error
      }
    }
    if (this.disposed) throw new Error('Workbench repository is disposed')
    return this.database!
  }

  private invalidate(): void {
    for (const peer of peers) {
      if (peer.dbName === this.dbName && !peer.disposed
        && (peer.factory ?? peer.options.indexedDB ?? globalThis.indexedDB) === this.factory) notify(peer.listeners)
    }
    // Notifications carry no state; the next read always obtains committed IDB data.
    try { this.channel?.postMessage({ type: 'invalidate', origin }) } catch { /* Commit already succeeded. */ }
  }

  private async execute<T>(update?: (state: RepositoryState) => T): Promise<T | RepositoryState> {
    const db = await this.open()
    if (this.disposed) throw new Error('Workbench repository is disposed')
    return new Promise((resolve, reject) => {
      // A single readwrite record serializes initialization and updates across tabs.
      const transaction = db.transaction('state', 'readwrite')
      this.transactions.add(transaction)
      const store = transaction.objectStore('state')
      let result: T | RepositoryState
      let failure: unknown
      let changed = false
      transaction.oncomplete = () => {
        this.transactions.delete(transaction)
        if (changed) this.invalidate()
        resolve(result)
      }
      transaction.onabort = () => {
        this.transactions.delete(transaction)
        reject(failure ?? transaction.error ?? new Error('IndexedDB transaction aborted'))
      }
      transaction.onerror = event => {
        failure ??= (event.target as IDBRequest | null)?.error ?? transaction.error ?? new Error('IndexedDB transaction failed')
      }
      const request = store.get('main')
      request.onerror = () => { failure = request.error ?? new Error('IndexedDB read failed') }
      request.onsuccess = () => {
        try {
          let state: unknown = request.result
          if (state === undefined) {
            const storage = this.options.localStorage === undefined ? globalThis.localStorage : this.options.localStorage
            const imported = importLegacy(storage)
            state = imported.state
            store.put({ sources: imported.sources, createdAt: Date.now() }, 'legacy-backup')
            store.put({ completedAt: Date.now(), sourceKeys: imported.sources.map(source => source.key) }, 'legacy-import')
            changed = true
          }
          assertState(state)
          if (update) {
            result = update(state)
            assertSynchronous(result)
            assertState(state)
            changed = true
          } else result = structuredClone(state)
          if (changed) store.put(state, 'main')
        } catch (error) {
          failure = error
          transaction.abort()
        }
      }
    })
  }

  async read(): Promise<RepositoryState> {
    return await this.execute() as RepositoryState
  }

  async transact<T>(update: (state: RepositoryState) => T): Promise<T> {
    return await this.execute(update) as T
  }

  subscribe(listener: () => void): () => void {
    if (this.disposed) throw new Error('Workbench repository is disposed')
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    peers.delete(this)
    this.listeners.clear()
    this.channel?.close()
    for (const transaction of this.transactions) {
      try { transaction.abort() } catch { /* The transaction may already be committed. */ }
    }
    void this.database?.then(db => db.close(), () => {})
  }
}

interface MemoryStore {
  state: RepositoryState
  tail: Promise<void>
  repositories: Set<MemoryRepository>
}

export class MemoryRepository implements WorkbenchRepository {
  private readonly store: MemoryStore
  private readonly listeners = new Set<() => void>()
  private disposed = false

  /** Pass another MemoryRepository to share its durable state and notifications. */
  constructor(initial?: RepositoryState | MemoryRepository) {
    if (initial instanceof MemoryRepository) this.store = initial.store
    else {
      const state = structuredClone(initial ?? emptyState())
      assertState(state)
      this.store = { state, tail: Promise.resolve(), repositories: new Set() }
    }
    this.store.repositories.add(this)
  }

  private enqueue<T>(operation: () => T): Promise<T> {
    const result = this.store.tail.then(() => {
      if (this.disposed) throw new Error('Workbench repository is disposed')
      return operation()
    })
    this.store.tail = result.then(() => {}, () => {})
    return result
  }

  read(): Promise<RepositoryState> {
    return this.enqueue(() => structuredClone(this.store.state))
  }

  transact<T>(update: (state: RepositoryState) => T): Promise<T> {
    return this.enqueue(() => {
      const draft = structuredClone(this.store.state)
      const result = update(draft)
      assertSynchronous(result)
      assertState(draft)
      this.store.state = structuredClone(draft)
      for (const repository of this.store.repositories) notify(repository.listeners)
      return result
    })
  }

  subscribe(listener: () => void): () => void {
    if (this.disposed) throw new Error('Workbench repository is disposed')
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  dispose(): void {
    this.disposed = true
    this.listeners.clear()
    this.store.repositories.delete(this)
  }
}
