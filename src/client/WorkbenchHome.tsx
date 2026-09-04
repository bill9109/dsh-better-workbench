import { useMemo, useState } from 'react'
import {
  Button,
  IconPlusOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { WorkbenchAppSummary, WorkbenchService, WorkbenchSnapshot, WorkbenchTemplateSummary } from './types.ts'

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

function AppCard({ app, onCreate }: { app: WorkbenchAppSummary; onCreate: () => void }): JSX.Element {
  return (
    <WorkbenchCard
      badge="应用"
      description={app.description ?? '从默认配置创建新的工作台实例'}
      id={app.appId}
      onOpen={onCreate}
      title={app.title}
      footer="创建实例"
    />
  )
}

function TemplateCard({ template, onCreate }: { template: WorkbenchTemplateSummary; onCreate: () => void }): JSX.Element {
  const unavailableReason = template.kind === 'agent' ? '需要 Agent Creator' : '对应应用暂不可用'
  return (
    <WorkbenchCard
      badge={template.available ? '模板' : unavailableReason}
      description={template.description ?? '从预设配置创建新的工作台实例'}
      disabled={!template.available}
      id={template.templateId}
      onOpen={onCreate}
      title={template.title}
      footer="使用模板"
    />
  )
}

function InstanceCard({
  appTitle,
  available,
  instanceId,
  title,
  onOpen,
}: {
  appTitle: string
  available: boolean
  instanceId: string
  title: string
  onOpen: () => void
}): JSX.Element {
  return (
    <WorkbenchCard
      badge={available ? '可用' : '不可用'}
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
  const [creating, setCreating] = useState(false)
  const availableInstances = useMemo(() => snapshot.instances.filter(instance => instance.available), [snapshot.instances])
  const unavailableInstances = useMemo(() => snapshot.instances.filter(instance => !instance.available), [snapshot.instances])
  const templatedAppIds = useMemo(() => new Set(snapshot.templates.flatMap(template => template.kind === 'instance' ? [template.appId] : [])), [snapshot.templates])
  const appsWithoutTemplates = useMemo(() => snapshot.apps.filter(app => !templatedAppIds.has(app.appId)), [snapshot.apps, templatedAppIds])

  const createApp = (app: WorkbenchAppSummary): void => {
    const instance = service.createInstance(app.appId)
    service.open(instance.instanceId, app.defaultPresentation)
  }

  const createTemplate = (template: WorkbenchTemplateSummary): void => {
    const instance = service.startCreation(template.templateId)
    if (instance === undefined) return
    const app = snapshot.apps.find(item => item.appId === instance.appId)
    service.open(instance.instanceId, app?.defaultPresentation)
  }

  return (
    <main className="dsh-workbench-home">
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
            onClick={() => { setCreating(value => !value) }}
          >
            <IconPlusOutline16 size={14} />
            <span>创建工作台</span>
          </button>
        </div>
      </header>

      {creating && (
        <section className="dsh-workbench-home-section" aria-label="创建工作台">
          <div className="dsh-workbench-home-section-heading">
            <h2>创建工作台</h2>
            <span>从已安装应用或模板开始</span>
          </div>
          {snapshot.templates.length > 0 && (
            <div className="dsh-workbench-home-grid">
              {snapshot.templates.map(template => (
                <TemplateCard key={template.templateId} template={template} onCreate={() => { createTemplate(template) }} />
              ))}
            </div>
          )}
          {appsWithoutTemplates.length > 0 ? (
            <div className="dsh-workbench-home-grid">
              {appsWithoutTemplates.map(app => <AppCard key={app.appId} app={app} onCreate={() => { createApp(app) }} />)}
            </div>
          ) : snapshot.templates.length === 0 ? (
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
        {snapshot.instances.length === 0 ? (
          <div className="dsh-workbench-home-empty">
            <strong>还没有工作台</strong>
            <span>从已安装应用或模板创建第一个实例。</span>
            <Button variant="outline" size="sm" icon={<IconPlusOutline16 />} onClick={() => { setCreating(true) }}>创建第一个工作台</Button>
          </div>
        ) : (
          <div className="dsh-workbench-home-grid dsh-workbench-home-instance-grid">
            {availableInstances.map(instance => (
              <InstanceCard
                key={instance.instanceId}
                instanceId={instance.instanceId}
                title={instance.title}
                available
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
