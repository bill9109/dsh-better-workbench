import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  IconPlusOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { WorkbenchAppSummary, WorkbenchCreationResult, WorkbenchInstance, WorkbenchService, WorkbenchSnapshot, WorkbenchTemplateSummary } from './types.ts'

export interface WorkbenchHomeProps {
  service: WorkbenchService
  snapshot: WorkbenchSnapshot
}

function WorkbenchCard({
  badge,
  description,
  disabled = false,
  id,
  onOpen,
  title,
  footer,
}: {
  badge: string
  description: string
  disabled?: boolean
  id: string
  onOpen: () => void
  title: string
  footer: string
}): JSX.Element {
  return (
    <article className="dsh-workbench-home-card" data-disabled={disabled}>
      <button
        type="button"
        className="dsh-workbench-home-card-main"
        aria-label={disabled ? `${title}：${badge}` : title}
        disabled={disabled}
        onClick={onOpen}
      >
        <span className="dsh-workbench-home-card-head">
          <span className="dsh-workbench-home-card-name">{title}</span>
          <span className="dsh-workbench-home-card-badge">{badge}</span>
        </span>
        <span className="dsh-workbench-home-card-description">{description}</span>
        <code className="dsh-workbench-home-card-id">{id}</code>
      </button>
      <div className="dsh-workbench-home-card-foot">
        <span>{footer}</span>
      </div>
    </article>
  )
}

function AppCard({ app, disabled, existing, pending, onCreate }: {
  app: WorkbenchAppSummary
  disabled: boolean
  existing: boolean
  pending: boolean
  onCreate: () => void
}): JSX.Element {
  return (
    <WorkbenchCard
      badge="应用"
      description={app.description ?? '从默认配置创建新的工作台实例'}
      disabled={disabled}
      id={app.appId}
      onOpen={onCreate}
      title={app.title}
      footer={pending ? '正在创建...' : existing ? '打开已有' : '创建实例'}
    />
  )
}

function TemplateCard({ template, disabled, existing, pending, onCreate }: {
  template: WorkbenchTemplateSummary
  disabled: boolean
  existing: boolean
  pending: boolean
  onCreate: () => void
}): JSX.Element {
  const unavailableReason = template.kind === 'agent' ? '需要 Agent Creator' : '对应应用暂不可用'
  return (
    <WorkbenchCard
      badge={template.available ? '模板' : unavailableReason}
      description={template.description ?? '从预设配置创建新的工作台实例'}
      disabled={disabled || !template.available}
      id={template.templateId}
      onOpen={onCreate}
      title={template.title}
      footer={pending ? '正在创建...' : existing ? '打开已有' : '使用模板'}
    />
  )
}

function InstanceCard({
  appTitle,
  available,
  status,
  instanceId,
  title,
  onOpen,
}: {
  appTitle: string
  available: boolean
  status: WorkbenchInstance['status']
  instanceId: string
  title: string
  onOpen: () => void
}): JSX.Element {
  return (
    <WorkbenchCard
      badge={status === 'preparing' ? '准备中' : status === 'migration-error' ? '升级失败' : status === 'incompatible' ? '版本不兼容' : available && status === 'ready' ? '可用' : '不可用'}
      description={available ? appTitle : `应用暂不可用 · ${appTitle}`}
      id={instanceId}
      onOpen={onOpen}
      title={title}
      footer={available ? '打开工作台' : '查看状态'}
    />
  )
}

/** Built-in hub page that remains available without third-party applications. */
export function WorkbenchHome({ service, snapshot }: WorkbenchHomeProps): JSX.Element {
  const creating = snapshot.route.kind === 'workbench-home' && snapshot.route.creating === true
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const inFlight = useRef(false)
  const operation = useRef(0)
  const lifecycle = useRef({ active: true })
  useEffect(() => {
    const current = { active: true }
    lifecycle.current = current
    inFlight.current = false
    setPending(null)
    setError(null)
    setSessionId(null)
    return () => { current.active = false }
  }, [service])
  const creationPending = snapshot.creation.status === 'creating'
  const busy = snapshot.loading || pending !== null || creationPending
  const creationError = snapshot.creation.status === 'failed' ? snapshot.creation.error : null
  const visibleError = error ?? creationError ?? snapshot.error
  const creationResult = snapshot.creation.status === 'complete' ? snapshot.creation.result : undefined
  const handedOffSessionId = sessionId ?? (creationResult !== undefined && 'sessionId' in creationResult ? creationResult.sessionId : null)
  const availableInstances = useMemo(() => snapshot.instances.filter(instance => instance.available), [snapshot.instances])
  const unavailableInstances = useMemo(() => snapshot.instances.filter(instance => !instance.available), [snapshot.instances])
  const templatedAppIds = useMemo(() => new Set(snapshot.templates.flatMap(template => template.kind === 'instance' ? [template.appId] : [])), [snapshot.templates])
  const appsWithoutTemplates = useMemo(() => snapshot.apps.filter(app => !templatedAppIds.has(app.appId)), [snapshot.apps, templatedAppIds])

  const existingInstance = (appId: string) => {
    const app = snapshot.apps.find(item => item.appId === appId)
    return app?.allowMultiple === false ? snapshot.instances.find(instance => instance.appId === appId) : undefined
  }

  const runCreation = async (key: string, create: () => Promise<WorkbenchCreationResult>): Promise<void> => {
    if (busy || inFlight.current) return
    const current = lifecycle.current
    const token = ++operation.current
    inFlight.current = true
    setPending(key)
    setError(null)
    setSessionId(null)
    try {
      const result = await create()
      if (!current.active || token !== operation.current) return
      if ('instanceId' in result) {
        const latest = service.getSnapshot()
        const instance = latest.instances.find(item => item.instanceId === result.instanceId)
        const app = latest.apps.find(item => item.appId === instance?.appId)
        service.open(result.instanceId, app?.defaultPresentation)
      } else {
        setSessionId(result.sessionId)
      }
    } catch (reason: unknown) {
      if (current.active && token === operation.current) setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      if (current.active && token === operation.current) {
        inFlight.current = false
        setPending(null)
      }
    }
  }

  const cancelWaiting = (): void => {
    operation.current++
    inFlight.current = false
    setPending(null)
    setError(null)
    setSessionId(null)
    service.cancelCreation()
  }

  const retryLoading = async (): Promise<void> => {
    if (busy || inFlight.current) return
    const current = lifecycle.current
    inFlight.current = true
    setPending('reload')
    setError(null)
    try {
      await service.retry()
    } catch (reason: unknown) {
      if (current.active) setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      if (current.active) { inFlight.current = false; setPending(null) }
    }
  }

  const createApp = (app: WorkbenchAppSummary): void => {
    if (busy || inFlight.current) return
    const existing = existingInstance(app.appId)
    if (existing !== undefined) {
      service.open(existing.instanceId, app.defaultPresentation)
      return
    }
    void runCreation(`app:${app.appId}`, () => service.createInstance(app.appId))
  }

  const createTemplate = (template: WorkbenchTemplateSummary): void => {
    if (busy || inFlight.current || !template.available) return
    const existing = template.kind === 'instance' ? existingInstance(template.appId) : undefined
    if (existing !== undefined) {
      service.open(existing.instanceId, snapshot.apps.find(app => app.appId === existing.appId)?.defaultPresentation)
      return
    }
    void runCreation(`template:${template.templateId}`, () => service.startCreation(template.templateId))
  }

  return (
    <main className="dsh-workbench-home" aria-busy={busy}>
      <header className="dsh-workbench-home-header">
        <div>
          <span>Workbench</span>
          <h1>工作台</h1>
        </div>
        <div className="dsh-workbench-home-actions">
          <button
            type="button"
            className="dsh-workbench-home-add-button"
            aria-expanded={creating}
            disabled={busy}
            onClick={() => { service.openHome(!creating) }}
          >
            <IconPlusOutline16 size={14} />
            <span>创建工作台</span>
          </button>
        </div>
      </header>

      {snapshot.recovery && <section role="alert" className="dsh-workbench-frame-error">
        <strong>部分旧数据无法导入，原始内容已保留</strong>
        <ul>{snapshot.recovery.errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
        <a download="workbench-legacy-backup.json" href={'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot.recovery, null, 2))}>导出原始备份</a>
      </section>}
      {snapshot.loading && <div role="status">正在加载工作台...</div>}
      {pending === 'reload' ? <div role="status">正在重新加载...</div> : (pending !== null || creationPending) && <div role="status">正在创建工作台...</div>}
      {creationPending && <Button variant="outline" size="sm" onClick={cancelWaiting}>取消等待</Button>}
      {visibleError && <div className="dsh-workbench-rename-error" role="alert">{visibleError}</div>}
      {snapshot.error !== null && <Button variant="outline" size="sm" disabled={busy} onClick={() => { void retryLoading() }}>重新加载</Button>}
      {!busy && handedOffSessionId !== null && <div role="status">创建已交接，会话：<code>{handedOffSessionId}</code></div>}

      {creating && (
        <section className="dsh-workbench-home-section" aria-label="创建工作台">
          <div className="dsh-workbench-home-section-heading">
            <h2>创建工作台</h2>
            <span>从已安装应用或模板开始</span>
          </div>
          {snapshot.templates.length > 0 && (
            <div className="dsh-workbench-home-grid">
              {snapshot.templates.map(template => (
                <TemplateCard
                  key={template.templateId}
                  template={template}
                  disabled={busy}
                  existing={template.kind === 'instance' && existingInstance(template.appId) !== undefined}
                  pending={pending === `template:${template.templateId}` || (creationPending && snapshot.creation.templateId === template.templateId)}
                  onCreate={() => { createTemplate(template) }}
                />
              ))}
            </div>
          )}
          {appsWithoutTemplates.length > 0 ? (
            <div className="dsh-workbench-home-grid">
              {appsWithoutTemplates.map(app => (
                <AppCard
                  key={app.appId}
                  app={app}
                  disabled={busy}
                  existing={existingInstance(app.appId) !== undefined}
                  pending={pending === `app:${app.appId}`}
                  onCreate={() => { createApp(app) }}
                />
              ))}
            </div>
          ) : !snapshot.loading && snapshot.templates.length === 0 ? (
            <div className="dsh-workbench-home-empty">
              <strong>暂无可用的工作台应用</strong>
              <span>安装工作台应用后，可在这里创建实例。</span>
            </div>
          ) : null}
        </section>
      )}

      <section className="dsh-workbench-home-section" aria-label="已有工作台">
        <div className="dsh-workbench-home-section-heading">
          <h2>已有工作台</h2>
          <span>{snapshot.instances.length} 个实例</span>
        </div>
        {snapshot.loading ? null : snapshot.instances.length === 0 ? (
          <div className="dsh-workbench-home-empty">
            <strong>还没有工作台</strong>
            <span>从已安装应用或模板创建第一个实例。</span>
            <Button variant="outline" size="sm" disabled={busy} icon={<IconPlusOutline16 />} onClick={() => { service.openHome(true) }}>创建第一个工作台</Button>
          </div>
        ) : (
          <div className="dsh-workbench-home-grid dsh-workbench-home-instance-grid">
            {availableInstances.map(instance => (
              <InstanceCard
                key={instance.instanceId}
                instanceId={instance.instanceId}
                title={instance.title}
                available
                status={instance.status}
                appTitle={snapshot.apps.find(app => app.appId === instance.appId)?.title ?? instance.appId}
                onOpen={() => { service.open(instance.instanceId) }}
              />
            ))}
            {unavailableInstances.map(instance => (
              <InstanceCard
                key={instance.instanceId}
                instanceId={instance.instanceId}
                title={instance.title}
                available={false}
                status={instance.status}
                appTitle={instance.appId}
                onOpen={() => { service.open(instance.instanceId) }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
