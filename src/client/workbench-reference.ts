import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { InputTriggerSource } from '@deepseek-ai/dsh-client-ui-input-trigger/client'
import type { WorkbenchInstance, WorkbenchService } from './types.ts'

export const WORKBENCH_REFERENCE_SOURCE = 'workbench'

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character]!)
}

function findInstance(service: WorkbenchService, ref: string): WorkbenchInstance {
  const instance = service.getSnapshot().instances.find(item => item.instanceId === ref)
  if (!instance) throw new Error('引用的工作台已删除，请重新选择')
  if (!instance.available) throw new Error('引用的工作台应用暂不可用')
  return instance
}

/** One unified source for every application; no app-specific serializers or config export. */
export function createWorkbenchReferenceSource(service: WorkbenchService): InputTriggerSource {
  return {
    trigger: '@',
    name: WORKBENCH_REFERENCE_SOURCE,
    order: 10,
    showGroupTitle: false,
    async candidates(_session, request) {
      if (request.signal.aborted || request.quoted) return []
      await service.ready
      if (request.signal.aborted) return []
      const query = request.query.trim().toLocaleLowerCase()
      const snapshot = service.getSnapshot()
      return snapshot.instances
        .filter(instance => instance.available && (query === '' || instance.title.toLocaleLowerCase().includes(query)))
        .slice(0, 50)
        .map(instance => ({
          name: instance.title,
          description: (snapshot.apps.find(app => app.appId === instance.appId)?.title ?? instance.appId) + ' · ' + instance.instanceId,
          section: '工作台',
          value: instance.instanceId,
        }))
    },
    onPick({ candidate }) {
      const instance = findInstance(service, candidate.value ?? '')
      return { insert: {
        source: WORKBENCH_REFERENCE_SOURCE,
        ref: instance.instanceId,
        label: instance.title,
        clipboardText: '@' + instance.title,
      } }
    },
    codec: {
      clipboardText: ref => '@' + findInstance(service, ref).title,
      async serialize(ref, signal) {
        signal.throwIfAborted()
        const instance = findInstance(service, ref)
        return '<workbench instance_id="' + escapeXml(instance.instanceId)
          + '" app_id="' + escapeXml(instance.appId)
          + '" title="' + escapeXml(instance.title) + '" />'
      },
    },
  }
}

/** The caller owns the returned disposer in the inputTriggers injection scope. */
export function registerWorkbenchReference(ctx: ClientContext, service: WorkbenchService): () => void {
  const inputTriggers = ctx.get('inputTriggers')
  if (!inputTriggers) throw new Error('Workbench references require inputTriggers')
  const source = createWorkbenchReferenceSource(service)
  const lifetime = new AbortController()
  const unregister = inputTriggers.registerSource({
    ...source,
    async candidates(session, request) {
      if (lifetime.signal.aborted) return []
      const result = await source.candidates(session, request)
      return lifetime.signal.aborted ? [] : result
    },
    onPick(pick) {
      lifetime.signal.throwIfAborted()
      return source.onPick(pick)
    },
    codec: {
      clipboardText(ref) {
        lifetime.signal.throwIfAborted()
        return source.codec!.clipboardText(ref)
      },
      async serialize(ref, signal) {
        lifetime.signal.throwIfAborted()
        return source.codec!.serialize(ref, signal)
      },
    },
  })
  return () => {
    if (lifetime.signal.aborted) return
    lifetime.abort()
    unregister()
  }
}
