import { useSyncExternalStore } from 'react'
import { Button } from '@deepseek-ai/dsh-client-ui-primitives'
import { WorkbenchHome } from './WorkbenchHome.tsx'
import { resolveActivePresentation } from './presentation.ts'
import type { WorkbenchRenderProps, WorkbenchService } from './types.ts'

export interface WorkbenchSurfaceProps {
  service: WorkbenchService
}

function useWorkbenchSnapshot(service: WorkbenchService) {
  return useSyncExternalStore(
    listener => service.subscribe(listener),
    () => service.getSnapshot(),
    () => service.getSnapshot(),
  )
}

/** Compatibility surface; a future DSH center-page Slot can host this component unchanged. */
export function WorkbenchSurface({ service }: WorkbenchSurfaceProps): JSX.Element {
  const snapshot = useWorkbenchSnapshot(service)
  const route = snapshot.route
  const open = route.kind !== 'conversation'
  const presentation = resolveActivePresentation(snapshot, service)

  if (route.kind === 'conversation') {
    return <div className="dsh-workbench-center" data-open="false" aria-hidden="true" />
  }

  if (route.kind === 'workbench-home') {
    return (
      <div className="dsh-workbench-center" data-open="true" data-kind="page">
        <WorkbenchHome service={service} snapshot={snapshot} />
      </div>
    )
  }

  const instance = snapshot.instances.find(item => item.instanceId === route.instanceId)
  const app = instance === undefined ? undefined : service.getApp(instance.appId)
  const effectivePresentation = presentation ?? { kind: 'page', conversation: 'exclusive' as const }
  const renderProps: WorkbenchRenderProps | undefined = instance === undefined ? undefined : {
    instance,
    presentation: effectivePresentation,
    updateConfig: patch => { service.updateInstanceConfig(instance.instanceId, patch) },
    close: () => { service.openConversation() },
    openHome: () => { service.openHome() },
    openConversation: () => { service.openConversation() },
  }
  const unavailable = (
    <div className="dsh-workbench-unavailable">
      <strong>工作台应用暂不可用</strong>
      <span>{instance === undefined ? '实例不存在' : `应用标识：${instance.appId}`}</span>
      <Button variant="primary" size="sm" onClick={() => { service.openHome() }}>返回首页</Button>
    </div>
  )

  if (effectivePresentation.kind === 'panel') {
    const Panel = app?.renderPanel
    return (
      <div
        className="dsh-workbench-center"
        data-open={open}
        data-kind="panel"
        data-placement={effectivePresentation.placement}
        data-behavior={effectivePresentation.behavior}
      >
        <aside className="dsh-workbench-panel" aria-label={instance?.title ?? '工作台面板'}>
          {Panel !== undefined && renderProps !== undefined ? <Panel {...renderProps} /> : unavailable}
        </aside>
      </div>
    )
  }

  if (effectivePresentation.kind === 'capsule') {
    const Capsule = app?.renderCapsule
    return (
      <div
        className="dsh-workbench-center"
        data-open={open}
        data-kind="capsule"
        data-placement={effectivePresentation.placement}
      >
        <aside className="dsh-workbench-capsule" aria-label={instance?.title ?? '工作台胶囊'}>
          {Capsule !== undefined && renderProps !== undefined ? <Capsule {...renderProps} /> : unavailable}
        </aside>
      </div>
    )
  }

  const Main = app?.renderMain
  const Secondary = app?.renderSecondary
  return (
    <div className="dsh-workbench-center" data-open={open} data-kind="page">
      <div className="dsh-workbench-center-body">
        {Secondary !== undefined && renderProps !== undefined && (
          <aside className="dsh-workbench-center-secondary"><Secondary {...renderProps} /></aside>
        )}
        <main className="dsh-workbench-center-main">
          {Main !== undefined && renderProps !== undefined ? <Main {...renderProps} /> : unavailable}
        </main>
      </div>
    </div>
  )
}
