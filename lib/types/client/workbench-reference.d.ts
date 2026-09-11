import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { InputTriggerSource } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { WorkbenchService } from './types.ts';
export declare const WORKBENCH_REFERENCE_SOURCE = "workbench";
/** One unified source for every application; no app-specific serializers or config export. */
export declare function createWorkbenchReferenceSource(service: WorkbenchService): InputTriggerSource;
/** The caller owns the returned disposer in the inputTriggers injection scope. */
export declare function registerWorkbenchReference(ctx: ClientContext, service: WorkbenchService): () => void;
