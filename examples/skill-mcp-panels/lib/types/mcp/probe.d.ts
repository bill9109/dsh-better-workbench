export interface McpProbeTool {
    name: string;
    description?: string;
}
export interface McpProbeResult {
    ok: boolean;
    tools: McpProbeTool[];
    error?: string;
}
export declare function probeMcpServer(raw: unknown, timeoutMs?: number): Promise<McpProbeResult>;
