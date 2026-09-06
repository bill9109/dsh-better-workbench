export interface StoredInstance {
    instanceId: string;
    appId: string;
    title: string;
    config: Record<string, unknown>;
    configVersion: number;
    revision: number;
    order: number;
    createdAt: number;
    updatedAt: number;
    lastOpenedAt: number;
}
export interface StoredConfigBackup {
    instanceId: string;
    config: Record<string, unknown>;
    configVersion: number;
    revision: number;
    createdAt: number;
}
export interface RepositoryState {
    instances: StoredInstance[];
    dismissedDefaultAppIds: string[];
    backups: StoredConfigBackup[];
    recovery?: {
        sources: Array<{
            key: string;
            raw: string;
        }>;
        errors: string[];
    };
}
export interface WorkbenchRepository {
    read(): Promise<RepositoryState>;
    /** The callback must be synchronous. Revision checks belong inside it. */
    transact<T>(update: (state: RepositoryState) => T): Promise<T>;
    subscribe(listener: () => void): () => void;
    dispose(): void;
}
export interface IndexedDbRepositoryOptions {
    dbName?: string;
    indexedDB?: IDBFactory | null;
    localStorage?: Pick<Storage, 'getItem'> | null;
    broadcastChannel?: typeof BroadcastChannel | null;
}
export declare class IndexedDbRepository implements WorkbenchRepository {
    private readonly options;
    private readonly dbName;
    private readonly listeners;
    private database?;
    private factory?;
    private channel?;
    private disposed;
    private readonly transactions;
    constructor(options?: IndexedDbRepositoryOptions);
    private open;
    private invalidate;
    private execute;
    read(): Promise<RepositoryState>;
    transact<T>(update: (state: RepositoryState) => T): Promise<T>;
    subscribe(listener: () => void): () => void;
    dispose(): void;
}
export declare class MemoryRepository implements WorkbenchRepository {
    private readonly store;
    private readonly listeners;
    private disposed;
    /** Pass another MemoryRepository to share its durable state and notifications. */
    constructor(initial?: RepositoryState | MemoryRepository);
    private enqueue;
    read(): Promise<RepositoryState>;
    transact<T>(update: (state: RepositoryState) => T): Promise<T>;
    subscribe(listener: () => void): () => void;
    dispose(): void;
}
