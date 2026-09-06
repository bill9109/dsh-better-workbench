import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { Button, IconCloseOutline16, IconEllipsisOutline16, IconFullscreenOutline16, IconPanelLeftOutline16, IconPersonalizationOutline16, IconDownloadOutline16, Menu, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import { WorkbenchHome } from './WorkbenchHome.tsx'
import { WorkbenchErrorBoundary } from './WorkbenchErrorBoundary.tsx'
import { resolveActivePresentation, resolvePresentationLayout } from './presentation.ts'
import type { WorkbenchAppDefinition, WorkbenchInstance, WorkbenchPresentation, WorkbenchPresentationKind, WorkbenchRenderProps, WorkbenchService } from './types.ts'

export interface WorkbenchSurfaceProps {
  service: WorkbenchService
}

const modes = {
  page: { label: '页面', Icon: IconFullscreenOutline16 },
  panel: { label: '面板', Icon: IconPanelLeftOutline16 },
  capsule: { label: '胶囊', Icon: IconEllipsisOutline16 },
}

function SurfaceToolbar({ service, title, presentation, app, onMode, exporting, onExport }: {
  service: WorkbenchService
  title: string
  presentation?: WorkbenchPresentation
  app?: WorkbenchAppDefinition
  onMode?: (kind: WorkbenchPresentationKind) => void
  exporting?: boolean
  onExport?: () => void
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="dsh-workbench-frame-toolbar">
      <Tooltip label="工作台首页">
        <button type="button" className="dsh-workbench-frame-button" aria-label="工作台首页" onClick={() => { service.openHome() }}><IconPersonalizationOutline16 /></button>
      </Tooltip>
      <span className="dsh-workbench-frame-title" title={title}>{title}</span>
      <div className="dsh-workbench-frame-modes" role="group" aria-label="显示模式">
        {([...new Set(app?.presentations.map(item => item.kind) ?? [])]).map(kind => {
          const { label, Icon } = modes[kind]
          return (
            <Tooltip key={kind} label={label}>
              <button type="button" className="dsh-workbench-frame-button" aria-label={label} aria-pressed={presentation?.kind === kind} onClick={() => { onMode?.(kind) }}><Icon /></button>
            </Tooltip>
          )
        })}
      </div>
      {onExport !== undefined && (
        <Menu open={menuOpen} onClose={() => { setMenuOpen(false) }} portal dense
          items={[{ id: 'export', label: '导出配置', icon: <IconDownloadOutline16 />, disabled: exporting }]}
          onSelect={() => { setMenuOpen(false); onExport() }}
          anchor={<button type="button" className="dsh-workbench-frame-button" aria-label="工作台操作" title="工作台操作" onClick={() => { setMenuOpen(value => !value) }}><IconEllipsisOutline16 /></button>}
        />
      )}
      <Tooltip label="关闭工作台">
        <button type="button" className="dsh-workbench-frame-button" aria-label="关闭工作台" onClick={() => { service.close() }}><IconCloseOutline16 /></button>
      </Tooltip>
    </header>
  )
}

function repositoryUrl(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch {
    return undefined
  }
}

function InstanceFrame({ service, instance, app, generation, presentation }: {
  service: WorkbenchService
  instance: WorkbenchInstance | undefined
  app: WorkbenchAppDefinition | undefined
  generation: number | undefined
  presentation: WorkbenchPresentation
}): JSX.Element {
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(0)
  const [exporting, setExporting] = useState(false)
  const exportingRef = useRef(false)
  const download = useRef<{ url: string; timer: ReturnType<typeof setTimeout> } | null>(null)
  const clearDownload = (): void => {
    if (download.current === null) return
    clearTimeout(download.current.timer)
    URL.revokeObjectURL(download.current.url)
    download.current = null
  }
  useEffect(() => clearDownload, [])
  const [preparing, setPreparing] = useState(false)
  const [retry, setRetry] = useState(0)
  const owner = useMemo(() => ({ active: true, draftRevision: undefined as number | undefined }), [service, retry])
  useEffect(() => {
    const current = owner
    current.active = true
    setError(null)
    setSaving(0)
    setPreparing(false)
    setExporting(false)
    if (instance !== undefined && app !== undefined && instance.status !== 'ready') {
      setPreparing(true)
      void service.prepareInstance(instance.instanceId).catch((reason: unknown) => {
        if (current.active) setError(reason instanceof Error ? reason.message : String(reason))
      }).finally(() => {
        if (current.active) setPreparing(false)
      })
    }
    return () => { current.active = false }
  }, [service, owner])

  const retryView = (): void => {
    owner.active = false
    setRetry(value => value + 1)
  }
  const retryPreparation = async (): Promise<void> => {
    if (preparing || !owner.active) return
    setPreparing(true)
    setError(null)
    try {
      await service.retry()
      if (owner.active) retryView()
    } catch (reason: unknown) {
      if (owner.active) setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      if (owner.active) setPreparing(false)
    }
  }
  const exportConfig = async (): Promise<void> => {
    if (instance === undefined || !owner.active || exportingRef.current) return
    exportingRef.current = true
    setExporting(true)
    try {
      const data = await service.exportInstance(instance.instanceId)
      if (!owner.active) return
      clearDownload()
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
      download.current = { url, timer: setTimeout(clearDownload, 1000) }
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${instance.instanceId.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`
      anchor.click()
    } catch (reason: unknown) {
      if (owner.active) setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      exportingRef.current = false
      if (owner.active) setExporting(false)
    }
  }
  const setPresentation = (kind: WorkbenchPresentationKind): void => {
    if (owner.active && instance !== undefined) service.open(instance.instanceId, kind)
  }
  const renderProps: WorkbenchRenderProps | undefined = instance === undefined ? undefined : {
    instance,
    presentation,
    updateConfig: async (patch, expectedRevision) => {
      const current = owner
      if (!current.active) throw new Error('工作台视图已失效')
      setSaving(value => value + 1)
      setError(null)
      try {
        const revision = await service.updateInstanceConfig(instance.instanceId, patch, expectedRevision ?? current.draftRevision ?? instance.revision, generation)
        if (current.active && current.draftRevision !== undefined) current.draftRevision = revision
        return revision
      } catch (reason: unknown) {
        if (current.active) setError(reason instanceof Error ? reason.message : String(reason))
        throw reason
      } finally {
        if (current.active) setSaving(value => value - 1)
      }
    },
    setDirty: dirty => {
      if (!owner.active) return
      if (dirty) owner.draftRevision ??= instance.revision
      else owner.draftRevision = undefined
      service.setDirty(instance.instanceId, dirty)
    },
    reportError: reason => { if (owner.active) setError(reason) },
    setPresentation,
    close: () => { if (owner.active) service.close() },
    openHome: () => { if (owner.active) service.openHome() },
    openConversation: () => { if (owner.active) service.openConversation() },
  }
  const ready = instance?.status === 'ready' && instance.available && !preparing
  const Renderer = presentation.kind === 'panel' ? app?.renderPanel : presentation.kind === 'capsule' ? app?.renderCapsule : app?.renderMain
  const Secondary = presentation.kind === 'page' ? app?.renderSecondary : undefined
  let content: ReactNode = (
    <div className="dsh-workbench-unavailable">
      <strong>{preparing || instance?.status === 'preparing' ? '正在准备工作台...' : '工作台应用暂不可用'}</strong>
      <span>{instance === undefined ? '实例不存在' : instance.error ?? `应用标识：${instance.appId}`}</span>
      {app !== undefined && !preparing && <Button variant="outline" size="sm" onClick={() => { void retryPreparation() }}>重试</Button>}
    </div>
  )
  if (ready && Renderer !== undefined && renderProps !== undefined) {
    content = (
      <div className="dsh-workbench-center-body">
        {Secondary !== undefined && <aside className="dsh-workbench-center-secondary"><Secondary {...renderProps} /></aside>}
        <main className="dsh-workbench-center-main"><Renderer {...renderProps} /></main>
      </div>
    )
  }
  return (
    <div className="dsh-workbench-frame">
      {presentation.kind !== 'page' && <SurfaceToolbar service={service} title={instance?.title ?? '工作台'} app={app} presentation={presentation} onMode={setPresentation} exporting={exporting} onExport={instance === undefined ? undefined : () => { void exportConfig() }} />}
      {presentation.kind !== 'page' && app?.source !== undefined && (
        <details className="dsh-workbench-frame-source">
          <summary>开发者声明</summary>
          <span>{app.source.packageName} · {app.source.version}</span>
          {repositoryUrl(app.source.repository) !== undefined && <a href={repositoryUrl(app.source.repository)} target="_blank" rel="noopener noreferrer">项目仓库</a>}
        </details>
      )}
      {exporting && <div className="dsh-workbench-frame-status" role="status">正在导出...</div>}
      <div className="dsh-workbench-save-status" role="status" aria-live="polite" aria-atomic="true">{saving > 0 ? '正在保存...' : ''}</div>
      {(preparing || instance?.status === 'preparing') && <div className="dsh-workbench-frame-status" role="status">正在准备工作台...</div>}
      {(error ?? instance?.error) && <div className="dsh-workbench-frame-error" role="alert">{error ?? instance?.error}</div>}
      <WorkbenchErrorBoundary key={retry} onRetry={retryView}>{content}</WorkbenchErrorBoundary>
    </div>
  )
}

/** Keep host controls outside application failure and instance state boundaries. */
export function WorkbenchSurface({ service }: WorkbenchSurfaceProps): JSX.Element {
  const snapshot = useSyncExternalStore(listener => service.subscribe(listener), () => service.getSnapshot(), () => service.getSnapshot())
  const root = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const mount = root.current?.parentElement
    const host = mount?.hasAttribute('data-dsh-workbench-center') ? mount.parentElement : mount
    if (host === undefined || host === null) return
    const update = (): void => { setSize({ width: host.clientWidth, height: host.clientHeight }) }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(host)
    return () => { observer.disconnect() }
  }, [])
  const route = snapshot.route
  const layout = resolvePresentationLayout(resolveActivePresentation(snapshot, service), size.width, size.height)
  if (route.kind === 'conversation') return <div ref={root} className="dsh-workbench-center" data-open="false" aria-hidden="true" />
  if (route.kind === 'workbench-home') {
    return (
      <div ref={root} className="dsh-workbench-center" data-open="true" data-kind="page">
        <div className="dsh-workbench-frame">
          <WorkbenchHome service={service} snapshot={snapshot} />
        </div>
      </div>
    )
  }
  const instance = snapshot.instances.find(item => item.instanceId === route.instanceId)
  const app = instance === undefined ? undefined : service.getApp(instance.appId)
  const generation = snapshot.apps.find(item => item.appId === instance?.appId)?.generation
  const presentation = layout.presentation ?? { kind: 'page', conversation: 'exclusive' as const }
  const frame = <InstanceFrame key={JSON.stringify([instance?.appId, route.instanceId, generation])} service={service} instance={instance} app={app} generation={generation} presentation={presentation} />
  return (
    <div
      ref={root}
      className="dsh-workbench-center"
      data-open="true"
      data-kind={presentation.kind}
      data-placement={presentation.kind === 'page' ? undefined : presentation.placement}
      data-behavior={presentation.kind === 'panel' ? presentation.behavior : undefined}
      style={{ '--workbench-panel-size': `${layout.panelSize}px` } as CSSProperties}
    >
      {presentation.kind === 'page' ? frame : <aside className={presentation.kind === 'panel' ? 'dsh-workbench-panel' : 'dsh-workbench-capsule'} aria-label={instance?.title ?? '工作台'}>{frame}</aside>}
    </div>
  )
}
