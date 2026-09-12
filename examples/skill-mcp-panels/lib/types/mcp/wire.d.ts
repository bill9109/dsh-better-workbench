/**
 * dsh-skill-mcp-panel —— mcpManager Typert wire manifest。
 */
import { z } from "zod";
export declare const mcpServerViewSchema: z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodEnum<{
        unknown: "unknown";
        stdio: "stdio";
        "streamable-http": "streamable-http";
    }>;
    enabled: z.ZodBoolean;
    entryId: z.ZodOptional<z.ZodString>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    envKeys: z.ZodArray<z.ZodString>;
    cwd: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    headerKeys: z.ZodArray<z.ZodString>;
    toolCallTimeoutMs: z.ZodNumber;
    failOnStartupError: z.ZodBoolean;
    reconnect: z.ZodObject<{
        enabled: z.ZodBoolean;
        initialDelayMs: z.ZodNumber;
        maxDelayMs: z.ZodNumber;
        maxAttempts: z.ZodNumber;
    }, z.core.$strip>;
    managed: z.ZodDefault<z.ZodBoolean>;
    fiberPhase: z.ZodNullable<z.ZodEnum<{
        pending: "pending";
        loading: "loading";
        active: "active";
        failed: "failed";
        unloading: "unloading";
    }>>;
    toolCount: z.ZodNumber;
}, z.core.$strip>;
export declare const mcpListResultSchema: z.ZodObject<{
    servers: z.ZodArray<z.ZodObject<{
        serverName: z.ZodString;
        transport: z.ZodEnum<{
            unknown: "unknown";
            stdio: "stdio";
            "streamable-http": "streamable-http";
        }>;
        enabled: z.ZodBoolean;
        entryId: z.ZodOptional<z.ZodString>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        envKeys: z.ZodArray<z.ZodString>;
        cwd: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        headerKeys: z.ZodArray<z.ZodString>;
        toolCallTimeoutMs: z.ZodNumber;
        failOnStartupError: z.ZodBoolean;
        reconnect: z.ZodObject<{
            enabled: z.ZodBoolean;
            initialDelayMs: z.ZodNumber;
            maxDelayMs: z.ZodNumber;
            maxAttempts: z.ZodNumber;
        }, z.core.$strip>;
        managed: z.ZodDefault<z.ZodBoolean>;
        fiberPhase: z.ZodNullable<z.ZodEnum<{
            pending: "pending";
            loading: "loading";
            active: "active";
            failed: "failed";
            unloading: "unloading";
        }>>;
        toolCount: z.ZodNumber;
    }, z.core.$strip>>;
    externalServers: z.ZodArray<z.ZodObject<{
        serverName: z.ZodString;
        transport: z.ZodEnum<{
            unknown: "unknown";
            stdio: "stdio";
            "streamable-http": "streamable-http";
        }>;
        enabled: z.ZodBoolean;
        entryId: z.ZodOptional<z.ZodString>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        envKeys: z.ZodArray<z.ZodString>;
        cwd: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        headerKeys: z.ZodArray<z.ZodString>;
        toolCallTimeoutMs: z.ZodNumber;
        failOnStartupError: z.ZodBoolean;
        reconnect: z.ZodObject<{
            enabled: z.ZodBoolean;
            initialDelayMs: z.ZodNumber;
            maxDelayMs: z.ZodNumber;
            maxAttempts: z.ZodNumber;
        }, z.core.$strip>;
        managed: z.ZodDefault<z.ZodBoolean>;
        fiberPhase: z.ZodNullable<z.ZodEnum<{
            pending: "pending";
            loading: "loading";
            active: "active";
            failed: "failed";
            unloading: "unloading";
        }>>;
        toolCount: z.ZodNumber;
    }, z.core.$strip>>;
    patch: z.ZodObject<{
        path: z.ZodString;
        ok: z.ZodBoolean;
        error: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const mcpSavePayloadSchema: z.ZodObject<{
    input: z.ZodDiscriminatedUnion<[z.ZodObject<{
        serverName: z.ZodString;
        transport: z.ZodLiteral<"stdio">;
        command: z.ZodString;
        args: z.ZodDefault<z.ZodArray<z.ZodString>>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
        cwd: z.ZodDefault<z.ZodString>;
        toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
        failOnStartupError: z.ZodDefault<z.ZodBoolean>;
        reconnect: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            initialDelayMs: z.ZodDefault<z.ZodNumber>;
            maxDelayMs: z.ZodDefault<z.ZodNumber>;
            maxAttempts: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        serverName: z.ZodString;
        transport: z.ZodLiteral<"streamable-http">;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
        toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
        failOnStartupError: z.ZodDefault<z.ZodBoolean>;
        reconnect: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            initialDelayMs: z.ZodDefault<z.ZodNumber>;
            maxDelayMs: z.ZodDefault<z.ZodNumber>;
            maxAttempts: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>], "transport">;
    previousServerName: z.ZodOptional<z.ZodString>;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const mcpSaveResultSchema: z.ZodObject<{
    server: z.ZodObject<{
        serverName: z.ZodString;
        transport: z.ZodEnum<{
            unknown: "unknown";
            stdio: "stdio";
            "streamable-http": "streamable-http";
        }>;
        enabled: z.ZodBoolean;
        entryId: z.ZodOptional<z.ZodString>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        envKeys: z.ZodArray<z.ZodString>;
        cwd: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        headerKeys: z.ZodArray<z.ZodString>;
        toolCallTimeoutMs: z.ZodNumber;
        failOnStartupError: z.ZodBoolean;
        reconnect: z.ZodObject<{
            enabled: z.ZodBoolean;
            initialDelayMs: z.ZodNumber;
            maxDelayMs: z.ZodNumber;
            maxAttempts: z.ZodNumber;
        }, z.core.$strip>;
        managed: z.ZodDefault<z.ZodBoolean>;
        fiberPhase: z.ZodNullable<z.ZodEnum<{
            pending: "pending";
            loading: "loading";
            active: "active";
            failed: "failed";
            unloading: "unloading";
        }>>;
        toolCount: z.ZodNumber;
    }, z.core.$strip>;
    reconciled: z.ZodBoolean;
}, z.core.$strip>;
export declare const mcpRemovePayloadSchema: z.ZodObject<{
    serverName: z.ZodString;
}, z.core.$strip>;
export declare const mcpRemoveResultSchema: z.ZodObject<{
    ok: z.ZodBoolean;
}, z.core.$strip>;
export declare const mcpSetEnabledPayloadSchema: z.ZodObject<{
    serverName: z.ZodString;
    enabled: z.ZodBoolean;
}, z.core.$strip>;
export declare const mcpTestPayloadSchema: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodLiteral<"stdio">;
    command: z.ZodString;
    args: z.ZodDefault<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    cwd: z.ZodDefault<z.ZodString>;
    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
    reconnect: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodLiteral<"streamable-http">;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
    reconnect: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>], "transport">, z.ZodObject<{
    serverName: z.ZodString;
}, z.core.$strip>]>;
export declare const mcpTestResultSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const MCP_MANIFEST: {
    package: string;
    face: string;
    schemas: never[];
    invocations: ({
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: never[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                servers: z.ZodArray<z.ZodObject<{
                    serverName: z.ZodString;
                    transport: z.ZodEnum<{
                        unknown: "unknown";
                        stdio: "stdio";
                        "streamable-http": "streamable-http";
                    }>;
                    enabled: z.ZodBoolean;
                    entryId: z.ZodOptional<z.ZodString>;
                    command: z.ZodOptional<z.ZodString>;
                    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    envKeys: z.ZodArray<z.ZodString>;
                    cwd: z.ZodOptional<z.ZodString>;
                    url: z.ZodOptional<z.ZodString>;
                    headerKeys: z.ZodArray<z.ZodString>;
                    toolCallTimeoutMs: z.ZodNumber;
                    failOnStartupError: z.ZodBoolean;
                    reconnect: z.ZodObject<{
                        enabled: z.ZodBoolean;
                        initialDelayMs: z.ZodNumber;
                        maxDelayMs: z.ZodNumber;
                        maxAttempts: z.ZodNumber;
                    }, z.core.$strip>;
                    managed: z.ZodDefault<z.ZodBoolean>;
                    fiberPhase: z.ZodNullable<z.ZodEnum<{
                        pending: "pending";
                        loading: "loading";
                        active: "active";
                        failed: "failed";
                        unloading: "unloading";
                    }>>;
                    toolCount: z.ZodNumber;
                }, z.core.$strip>>;
                externalServers: z.ZodArray<z.ZodObject<{
                    serverName: z.ZodString;
                    transport: z.ZodEnum<{
                        unknown: "unknown";
                        stdio: "stdio";
                        "streamable-http": "streamable-http";
                    }>;
                    enabled: z.ZodBoolean;
                    entryId: z.ZodOptional<z.ZodString>;
                    command: z.ZodOptional<z.ZodString>;
                    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    envKeys: z.ZodArray<z.ZodString>;
                    cwd: z.ZodOptional<z.ZodString>;
                    url: z.ZodOptional<z.ZodString>;
                    headerKeys: z.ZodArray<z.ZodString>;
                    toolCallTimeoutMs: z.ZodNumber;
                    failOnStartupError: z.ZodBoolean;
                    reconnect: z.ZodObject<{
                        enabled: z.ZodBoolean;
                        initialDelayMs: z.ZodNumber;
                        maxDelayMs: z.ZodNumber;
                        maxAttempts: z.ZodNumber;
                    }, z.core.$strip>;
                    managed: z.ZodDefault<z.ZodBoolean>;
                    fiberPhase: z.ZodNullable<z.ZodEnum<{
                        pending: "pending";
                        loading: "loading";
                        active: "active";
                        failed: "failed";
                        unloading: "unloading";
                    }>>;
                    toolCount: z.ZodNumber;
                }, z.core.$strip>>;
                patch: z.ZodObject<{
                    path: z.ZodString;
                    ok: z.ZodBoolean;
                    error: z.ZodNullable<z.ZodString>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: {
            name: string;
            wire: string;
            source: string;
            codec: {
                mode: string;
                typeSymbol: string;
                schema: z.ZodObject<{
                    input: z.ZodDiscriminatedUnion<[z.ZodObject<{
                        serverName: z.ZodString;
                        transport: z.ZodLiteral<"stdio">;
                        command: z.ZodString;
                        args: z.ZodDefault<z.ZodArray<z.ZodString>>;
                        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
                        cwd: z.ZodDefault<z.ZodString>;
                        toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
                        failOnStartupError: z.ZodDefault<z.ZodBoolean>;
                        reconnect: z.ZodDefault<z.ZodObject<{
                            enabled: z.ZodDefault<z.ZodBoolean>;
                            initialDelayMs: z.ZodDefault<z.ZodNumber>;
                            maxDelayMs: z.ZodDefault<z.ZodNumber>;
                            maxAttempts: z.ZodDefault<z.ZodNumber>;
                        }, z.core.$strip>>;
                    }, z.core.$strip>, z.ZodObject<{
                        serverName: z.ZodString;
                        transport: z.ZodLiteral<"streamable-http">;
                        url: z.ZodString;
                        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
                        toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
                        failOnStartupError: z.ZodDefault<z.ZodBoolean>;
                        reconnect: z.ZodDefault<z.ZodObject<{
                            enabled: z.ZodDefault<z.ZodBoolean>;
                            initialDelayMs: z.ZodDefault<z.ZodNumber>;
                            maxDelayMs: z.ZodDefault<z.ZodNumber>;
                            maxAttempts: z.ZodDefault<z.ZodNumber>;
                        }, z.core.$strip>>;
                    }, z.core.$strip>], "transport">;
                    previousServerName: z.ZodOptional<z.ZodString>;
                    enabled: z.ZodDefault<z.ZodBoolean>;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                server: z.ZodObject<{
                    serverName: z.ZodString;
                    transport: z.ZodEnum<{
                        unknown: "unknown";
                        stdio: "stdio";
                        "streamable-http": "streamable-http";
                    }>;
                    enabled: z.ZodBoolean;
                    entryId: z.ZodOptional<z.ZodString>;
                    command: z.ZodOptional<z.ZodString>;
                    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    envKeys: z.ZodArray<z.ZodString>;
                    cwd: z.ZodOptional<z.ZodString>;
                    url: z.ZodOptional<z.ZodString>;
                    headerKeys: z.ZodArray<z.ZodString>;
                    toolCallTimeoutMs: z.ZodNumber;
                    failOnStartupError: z.ZodBoolean;
                    reconnect: z.ZodObject<{
                        enabled: z.ZodBoolean;
                        initialDelayMs: z.ZodNumber;
                        maxDelayMs: z.ZodNumber;
                        maxAttempts: z.ZodNumber;
                    }, z.core.$strip>;
                    managed: z.ZodDefault<z.ZodBoolean>;
                    fiberPhase: z.ZodNullable<z.ZodEnum<{
                        pending: "pending";
                        loading: "loading";
                        active: "active";
                        failed: "failed";
                        unloading: "unloading";
                    }>>;
                    toolCount: z.ZodNumber;
                }, z.core.$strip>;
                reconciled: z.ZodBoolean;
            }, z.core.$strip>;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: {
            name: string;
            wire: string;
            source: string;
            codec: {
                mode: string;
                typeSymbol: string;
                schema: z.ZodObject<{
                    serverName: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                ok: z.ZodBoolean;
            }, z.core.$strip>;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: {
            name: string;
            wire: string;
            source: string;
            codec: {
                mode: string;
                typeSymbol: string;
                schema: z.ZodObject<{
                    serverName: z.ZodString;
                    enabled: z.ZodBoolean;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                server: z.ZodObject<{
                    serverName: z.ZodString;
                    transport: z.ZodEnum<{
                        unknown: "unknown";
                        stdio: "stdio";
                        "streamable-http": "streamable-http";
                    }>;
                    enabled: z.ZodBoolean;
                    entryId: z.ZodOptional<z.ZodString>;
                    command: z.ZodOptional<z.ZodString>;
                    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    envKeys: z.ZodArray<z.ZodString>;
                    cwd: z.ZodOptional<z.ZodString>;
                    url: z.ZodOptional<z.ZodString>;
                    headerKeys: z.ZodArray<z.ZodString>;
                    toolCallTimeoutMs: z.ZodNumber;
                    failOnStartupError: z.ZodBoolean;
                    reconnect: z.ZodObject<{
                        enabled: z.ZodBoolean;
                        initialDelayMs: z.ZodNumber;
                        maxDelayMs: z.ZodNumber;
                        maxAttempts: z.ZodNumber;
                    }, z.core.$strip>;
                    managed: z.ZodDefault<z.ZodBoolean>;
                    fiberPhase: z.ZodNullable<z.ZodEnum<{
                        pending: "pending";
                        loading: "loading";
                        active: "active";
                        failed: "failed";
                        unloading: "unloading";
                    }>>;
                    toolCount: z.ZodNumber;
                }, z.core.$strip>;
                reconciled: z.ZodBoolean;
            }, z.core.$strip>;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: {
            name: string;
            wire: string;
            source: string;
            codec: {
                mode: string;
                typeSymbol: string;
                schema: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
                    serverName: z.ZodString;
                    transport: z.ZodLiteral<"stdio">;
                    command: z.ZodString;
                    args: z.ZodDefault<z.ZodArray<z.ZodString>>;
                    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
                    cwd: z.ZodDefault<z.ZodString>;
                    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
                    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
                    reconnect: z.ZodDefault<z.ZodObject<{
                        enabled: z.ZodDefault<z.ZodBoolean>;
                        initialDelayMs: z.ZodDefault<z.ZodNumber>;
                        maxDelayMs: z.ZodDefault<z.ZodNumber>;
                        maxAttempts: z.ZodDefault<z.ZodNumber>;
                    }, z.core.$strip>>;
                }, z.core.$strip>, z.ZodObject<{
                    serverName: z.ZodString;
                    transport: z.ZodLiteral<"streamable-http">;
                    url: z.ZodString;
                    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
                    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
                    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
                    reconnect: z.ZodDefault<z.ZodObject<{
                        enabled: z.ZodDefault<z.ZodBoolean>;
                        initialDelayMs: z.ZodDefault<z.ZodNumber>;
                        maxDelayMs: z.ZodDefault<z.ZodNumber>;
                        maxAttempts: z.ZodDefault<z.ZodNumber>;
                    }, z.core.$strip>>;
                }, z.core.$strip>], "transport">, z.ZodObject<{
                    serverName: z.ZodString;
                }, z.core.$strip>]>;
            };
        }[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                ok: z.ZodBoolean;
                tools: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                error: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        };
    })[];
    model: {
        services: never[];
        events: never[];
        objects: never[];
    };
};
