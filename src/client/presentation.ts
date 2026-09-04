import type {
  WorkbenchPresentation,
  WorkbenchPresentationKind,
  WorkbenchService,
  WorkbenchSnapshot,
} from './types.ts'

function fallbackPresentation(kind: WorkbenchPresentationKind): WorkbenchPresentation {
  if (kind === 'panel') return { kind: 'panel', placement: 'right', behavior: 'overlay', conversation: 'resident' }
  if (kind === 'capsule') return { kind: 'capsule', placement: 'floating', conversation: 'resident' }
  return { kind: 'page', conversation: 'exclusive' }
}

/** Resolve a durable route against the currently available runtime definition. */
export function resolveActivePresentation(snapshot: WorkbenchSnapshot, service: WorkbenchService): WorkbenchPresentation | undefined {
  if (snapshot.route.kind === 'conversation') return undefined
  if (snapshot.route.kind === 'workbench-home') return fallbackPresentation('page')
  const route = snapshot.route
  const instance = snapshot.instances.find(item => item.instanceId === route.instanceId)
  const app = instance === undefined ? undefined : service.getApp(instance.appId)
  if (app === undefined) return fallbackPresentation(route.presentation)
  return app.presentations.find(item => item.kind === route.presentation)
    ?? app.presentations.find(item => item.kind === app.defaultPresentation)
    ?? fallbackPresentation('page')
}
