import { useEffect, useRef, useState } from 'react'
import { Button, IconPlusOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import { WorkbenchCreateDialog } from './WorkbenchCreateDialog.tsx'
import { WorkbenchAppIcon } from './WorkbenchIcon.tsx'
import { openWorkbench } from './open-workbench.ts'
import { WEBSITE_APP_ID } from './website.ts'
import type { WorkbenchInstance, WorkbenchService, WorkbenchSnapshot } from './types.ts'

export interface WorkbenchHomeProps { service: WorkbenchService; snapshot: WorkbenchSnapshot }

const statusLabel = (instance: WorkbenchInstance): string => instance.status === 'preparing' ? '准备中' : instance.status === 'migration-error' ? '升级失败' : instance.status === 'incompatible' ? '版本不兼容' : instance.available && instance.status === 'ready' ? '可用' : '不可用'

/** Existing instances stay in place while creation owns a separate transient dialog. */
export function WorkbenchHome({ service, snapshot }: WorkbenchHomeProps): JSX.Element {
  const creating = snapshot.route.kind === 'workbench-home' && snapshot.route.creating === true
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const owner = useRef({ active: true })
  useEffect(() => {
    const current = { active: true }
    owner.current = current
    return () => { current.active = false }
  }, [service])
  const retry = async (): Promise<void> => {
    if (retrying) return
    const current = owner.current
    setRetrying(true)
    setError(null)
    try { await service.retry() }
    catch (reason) { if (current.active) setError(reason instanceof Error ? reason.message : String(reason)) }
    finally { if (current.active) setRetrying(false) }
  }
  return <main className="dsh-better-workbench-home" aria-busy={snapshot.loading || retrying}>
    <header className="dsh-better-workbench-home-header">
      <div><span>Workbench</span><h1>工作台</h1></div>
      <div className="dsh-better-workbench-home-actions">
        <button type="button" className="dsh-better-workbench-home-add-button" aria-haspopup="dialog" aria-expanded={creating}
          disabled={snapshot.loading} onClick={() => service.openHome(true)}>
          <IconPlusOutline16 size={14} />
          <span>创建工作台</span>
        </button>
      </div>
    </header>
    {snapshot.recovery && <section role="alert" className="dsh-better-workbench-frame-error">
      <strong>部分旧数据无法导入，原始内容已保留</strong>
      <ul>{snapshot.recovery.errors.map((message, index) => <li key={index}>{message}</li>)}</ul>
      <a download="workbench-legacy-backup.json" href={'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot.recovery, null, 2))}>导出原始备份</a>
    </section>}
    {snapshot.loading && <div role="status">正在加载工作台...</div>}
    {(error ?? snapshot.error) && <div role="alert" className="dsh-better-workbench-create-error">{error ?? snapshot.error}</div>}
    {snapshot.error && <Button variant="outline" disabled={retrying} onClick={() => { void retry() }}>{retrying ? '正在重新加载...' : '重新加载'}</Button>}
    <section className="dsh-better-workbench-home-section" aria-label="已有工作台">
      <div className="dsh-better-workbench-home-section-heading"><h2>已有工作台</h2><span>{snapshot.instances.length} 个工作台</span></div>
      {!snapshot.loading && snapshot.instances.length === 0 ? <div className="dsh-better-workbench-home-empty">
        <strong>还没有工作台</strong>
        <Button variant="outline" icon={<IconPlusOutline16 />} onClick={() => service.openHome(true)}>创建工作台</Button>
      </div> : <div className="dsh-better-workbench-home-grid dsh-better-workbench-home-instance-grid">
        {snapshot.instances.map(instance => {
          const app = service.getApp(instance.appId)
          const url = typeof instance.config.url === 'string' ? instance.config.url : undefined
          return <article key={instance.instanceId} className="dsh-better-workbench-home-card">
            <button type="button" className="dsh-better-workbench-home-card-main" aria-label={instance.title} onClick={() => openWorkbench(service, instance.instanceId)}>
              <span className="dsh-better-workbench-home-card-head">
                <WorkbenchAppIcon renderer={app?.renderIcon} instance={instance} className="dsh-better-workbench-home-instance-icon" />
                <span className="dsh-better-workbench-home-card-name">{instance.title}</span>
                <span className="dsh-better-workbench-home-card-badge">{statusLabel(instance)}</span>
              </span>
              <span className="dsh-better-workbench-home-card-description">{url || app?.title || instance.appId}</span>
            </button>
            <button type="button" className="dsh-better-workbench-home-card-foot" onClick={() => openWorkbench(service, instance.instanceId)}>{!instance.available ? '查看状态' : instance.appId === WEBSITE_APP_ID && instance.config.openMode === 'external' ? '在浏览器打开' : '打开工作台'}</button>
          </article>
        })}
      </div>}
    </section>
    {creating && <WorkbenchCreateDialog service={service} snapshot={snapshot} />}
  </main>
}
