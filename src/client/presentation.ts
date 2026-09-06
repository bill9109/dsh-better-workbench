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

export interface WorkbenchPresentationLayout {
  presentation: WorkbenchPresentation | undefined
  panelSize: number
  rightInset: number
  bottomInset: number
}

/** Resolve geometry once for both the conversation inset and the app surface. */
export function resolvePresentationLayout(
  presentation: WorkbenchPresentation | undefined,
  width: number,
  height: number,
): WorkbenchPresentationLayout {
  const availableWidth = Number.isFinite(width) ? Math.max(0, width) : 0
  const availableHeight = Number.isFinite(height) ? Math.max(0, height) : 0
  if (presentation?.kind !== 'panel') {
    return { presentation, panelSize: 0, rightInset: 0, bottomInset: 0 }
  }
  const right = presentation.placement === 'right'
  const panelSize = right ? Math.min(360, availableWidth) : Math.min(280, availableHeight * 0.55)
  const canPush = right ? availableWidth >= 720 : availableHeight >= 560
  const effective = presentation.behavior === 'push' && !canPush
    ? { ...presentation, behavior: 'overlay' as const }
    : presentation
  const push = effective.behavior === 'push'
  return {
    presentation: effective,
    panelSize,
    rightInset: push && right ? panelSize : 0,
    bottomInset: push && !right ? panelSize : 0,
  }
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
