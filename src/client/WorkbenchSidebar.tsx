import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type DragEvent } from 'react'
import {
  IconCloseFill14,
  IconEditOutline16,
  IconEllipsisOutline16,
  IconPersonalizationOutline16,
  IconProjectAddOutline16,
  IconSearchOutline16,
  Menu,
  Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { WorkbenchInstance, WorkbenchService } from './types.ts'

export interface WorkbenchSidebarProps {
  service: WorkbenchService
}

type OrderBy = 'manual' | 'updated'

function useWorkbenchSnapshot(service: WorkbenchService) {
  return useSyncExternalStore(
    listener => service.subscribe(listener),
    () => service.getSnapshot(),
    () => service.getSnapshot(),
  )
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function requestSidebarExpand(): void {
  const button = [...document.querySelectorAll('button')].find(item => item.getAttribute('aria-label') === '展开侧边栏')
  if (button instanceof HTMLButtonElement) button.click()
}

function WorkbenchHomeIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.5 7.25 8 1.75l6.5 5.5" />
      <path d="M2.75 6.5v8h10.5v-8" />
      <path d="M6 14.5V9.25h4v5.25" />
    </svg>
  )
}

function WorkbenchHomeRow({ active, onOpen }: { active: boolean; onOpen: () => void }): JSX.Element {
  return (
    <button
      type="button"
      className="dsh-workbench-sidebar-row dsh-workbench-sidebar-home"
      data-active={active}
      onClick={onOpen}
    >
      <WorkbenchHomeIcon className="dsh-workbench-sidebar-home-icon" />
      <span className="dsh-workbench-sidebar-row-label">首页</span>
    </button>
  )
}

function ViewOptionsMenu({ orderBy, onOrderPick }: {
  orderBy: OrderBy
  onOrderPick: (value: OrderBy) => void
}): JSX.Element {
  const [open, setOpen] = useState(false)
  return (
    <Menu
      open={open}
      onClose={() => { setOpen(false) }}
      items={[
        { type: 'label', id: 'order-by', text: '排序方式' },
        { id: 'manual', label: '手动排序' },
        { id: 'updated', label: '最近使用' },
      ]}
      selectedId={orderBy}
      onSelect={id => {
        if (id === 'manual' || id === 'updated') onOrderPick(id)
        setOpen(false)
      }}
      align="end"
      dense
      portal
      anchor={(
        <Tooltip label="视图选项" side="bottom" delayMs={500}>
          <button
            type="button"
            className="dsh-workbench-sidebar-icon-button dsh-workbench-sidebar-wide-only"
            aria-label="视图选项"
            onClick={() => { setOpen(value => !value) }}
          >
            <IconPersonalizationOutline16 />
          </button>
        </Tooltip>
      )}
    />
  )
}

function WorkbenchRow({
  instance,
  compact,
  active,
  draggable,
  dropPosition,
  onOpen,
  onRename,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  instance: WorkbenchInstance
  compact: boolean
  active: boolean
  draggable: boolean
  dropPosition: 'before' | 'after' | null
  onOpen: () => void
  onRename: (title: string) => void
  onDragStart: (event: DragEvent<HTMLDivElement>) => void
  onDragOver: (event: DragEvent<HTMLDivElement>) => void
  onDrop: (event: DragEvent<HTMLDivElement>) => void
  onDragEnd: () => void
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameDraft, setRenameDraft] = useState(instance.title)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (renaming) input.current?.focus()
  }, [renaming])

  const commitRename = (): void => {
    const next = renameDraft.trim()
    if (next !== '' && next !== instance.title) onRename(next)
    setRenaming(false)
  }

  return (
    <div
      className="dsh-workbench-sidebar-row"
      data-active={active}
      data-menu-open={menuOpen}
      data-drop-position={dropPosition ?? undefined}
      role="button"
      tabIndex={compact ? -1 : 0}
      draggable={draggable && !renaming}
      onClick={onOpen}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {compact && <IconPersonalizationOutline16 className="dsh-workbench-sidebar-rail-icon" />}
      {renaming ? (
        <input
          ref={input}
          className="dsh-workbench-sidebar-rename"
          value={renameDraft}
          aria-label="工作台名称"
          onChange={event => { setRenameDraft(event.target.value) }}
          onClick={event => { event.stopPropagation() }}
          onBlur={commitRename}
          onKeyDown={event => {
            if (event.key === 'Enter') commitRename()
            if (event.key === 'Escape') setRenaming(false)
          }}
        />
      ) : (
        <span className="dsh-workbench-sidebar-row-label">{instance.title}</span>
      )}
      {!compact && !renaming && (
        <span className="dsh-workbench-sidebar-row-actions">
          <Menu
            open={menuOpen}
            onClose={() => { setMenuOpen(false) }}
            items={[{ id: 'rename', label: '重命名', icon: <IconEditOutline16 /> }]}
            onSelect={id => {
              setMenuOpen(false)
              if (id === 'rename') {
                setRenameDraft(instance.title)
                setRenaming(true)
              }
            }}
            dense
            portal
            closeOnPointerLeave
            anchor={(
              <button
                type="button"
                className="dsh-workbench-sidebar-row-action"
                aria-label={`工作台“${instance.title}”的操作`}
                title="更多操作"
                onClick={event => { event.stopPropagation(); setMenuOpen(value => !value) }}
              >
                <IconEllipsisOutline16 />
              </button>
            )}
          />
        </span>
      )}
    </div>
  )
}

/** Launcher inserted above DSH's workspace/session browser. */
export function WorkbenchSidebar({ service }: WorkbenchSidebarProps): JSX.Element {
  const snapshot = useWorkbenchSnapshot(service)
  const section = useRef<HTMLElement>(null)
  const searchRoot = useRef<HTMLDivElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const [compact, setCompact] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [orderBy, setOrderBy] = useState<OrderBy>('manual')
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ id: string; position: 'before' | 'after' } | null>(null)
  const normalizedQuery = normalize(query)

  useEffect(() => {
    const element = section.current
    if (element === null) return
    const update = (): void => { setCompact(element.clientWidth <= 170) }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => { observer.disconnect() }
  }, [])

  useEffect(() => {
    if (!compact && searchExpanded) searchInput.current?.focus({ preventScroll: true })
  }, [compact, searchExpanded])

  useEffect(() => {
    if (compact || !searchExpanded) return
    const onClick = (event: MouseEvent): void => {
      if (!(event.target instanceof Node) || searchRoot.current?.contains(event.target) === true) return
      searchInput.current?.blur()
      if (normalizedQuery === '') setSearchExpanded(false)
    }
    document.addEventListener('click', onClick)
    return () => { document.removeEventListener('click', onClick) }
  }, [compact, normalizedQuery, searchExpanded])

  const instances = useMemo(() => {
    const filtered = snapshot.instances.filter(instance => normalizedQuery === '' || normalize(instance.title).includes(normalizedQuery))
    return [...filtered].sort((a, b) => orderBy === 'updated' ? b.updatedAt - a.updatedAt : a.order - b.order)
  }, [normalizedQuery, orderBy, snapshot.instances])

  const handleDrop = (targetId: string, event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    const sourceId = draggedId ?? event.dataTransfer.getData('text/plain')
    if (sourceId === '' || sourceId === targetId) {
      setDropTarget(null)
      return
    }
    const target = instances.findIndex(instance => instance.instanceId === targetId)
    const source = instances.findIndex(instance => instance.instanceId === sourceId)
    if (target < 0 || source < 0) return
    const position = event.clientY < event.currentTarget.getBoundingClientRect().top + event.currentTarget.getBoundingClientRect().height / 2 ? 'before' : 'after'
    const nextVisible = instances.map(instance => instance.instanceId).filter(id => id !== sourceId)
    const insertAt = nextVisible.indexOf(targetId) + (position === 'after' ? 1 : 0)
    nextVisible.splice(insertAt, 0, sourceId)
    const hidden = snapshot.instances.map(instance => instance.instanceId).filter(id => !nextVisible.includes(id))
    service.reorderInstances([...nextVisible, ...hidden])
    setDraggedId(null)
    setDropTarget(null)
  }

  if (compact) {
    return (
      <section ref={section} className="dsh-workbench-sidebar-section" aria-label="工作台" data-compact="true">
      </section>
    )
  }

  return (
    <section ref={section} className="dsh-workbench-sidebar-section" aria-label="工作台">
      <div className="dsh-workbench-sidebar-heading">
        <span className={`dsh-workbench-sidebar-heading-label${searchExpanded && !compact ? ' is-hidden' : ''}`}>工作台</span>
        <div ref={searchRoot} className={`dsh-workbench-sidebar-search-slot${searchExpanded ? ' is-expanded' : ''}`}>
          <div className="dsh-workbench-sidebar-search">
            <Tooltip label="搜索工作台" side="bottom" delayMs={500} disabled={searchExpanded}>
              <button
                type="button"
                className="dsh-workbench-sidebar-search-button"
                aria-label="搜索工作台"
                aria-expanded={searchExpanded}
                onClick={() => {
                  setSearchExpanded(true)
                  if (compact) requestSidebarExpand()
                }}
              >
                <IconSearchOutline16 size={searchExpanded ? 11 : 14} />
              </button>
            </Tooltip>
            <input
              ref={searchInput}
              className="dsh-workbench-sidebar-search-input"
              type="text"
              placeholder="搜索工作台…"
              value={query}
              tabIndex={searchExpanded && !compact ? 0 : -1}
              onChange={event => { setQuery(event.target.value) }}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  setQuery('')
                  setSearchExpanded(false)
                }
              }}
            />
            {searchExpanded && (
              <button
                type="button"
                className="dsh-workbench-sidebar-search-clear"
                aria-label="清除搜索"
                onClick={event => {
                  event.stopPropagation()
                  setQuery('')
                  setSearchExpanded(false)
                }}
              >
                <IconCloseFill14 />
              </button>
            )}
          </div>
        </div>
        <div className={`dsh-workbench-sidebar-heading-actions${searchExpanded && !compact ? ' is-hidden' : ''}`}>
          <ViewOptionsMenu orderBy={orderBy} onOrderPick={setOrderBy} />
          <Tooltip label="创建工作台" side="bottom" delayMs={500}>
            <button
              type="button"
              className="dsh-workbench-sidebar-icon-button dsh-workbench-sidebar-add"
              aria-label="创建工作台"
              onClick={() => {
                setSearchExpanded(false)
                service.openHome()
              }}
            >
              <IconProjectAddOutline16 size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      {compact && (
        <div className="dsh-workbench-sidebar-rail-search">
          <Tooltip label="搜索工作台" side="right" delayMs={500}>
            <button
              type="button"
              className="dsh-workbench-sidebar-search-button"
              aria-label="搜索工作台"
              aria-expanded={searchExpanded}
              onClick={() => {
                setSearchExpanded(true)
                requestSidebarExpand()
              }}
            >
              <IconSearchOutline16 size={18} />
            </button>
          </Tooltip>
        </div>
      )}

      <div className="dsh-workbench-sidebar-list" aria-label="工作台列表">
        <WorkbenchHomeRow active={snapshot.route.kind === 'workbench-home'} onOpen={() => { service.openHome() }} />
        {instances.map(instance => (
          <WorkbenchRow
            key={instance.instanceId}
            instance={instance}
            compact={compact}
            active={snapshot.route.kind === 'workbench-instance' && snapshot.route.instanceId === instance.instanceId}
            draggable={orderBy === 'manual'}
            dropPosition={dropTarget?.id === instance.instanceId ? dropTarget.position : null}
            onOpen={() => { service.open(instance.instanceId) }}
            onRename={title => { service.renameInstance(instance.instanceId, title) }}
            onDragStart={event => {
              setDraggedId(instance.instanceId)
              event.dataTransfer.effectAllowed = 'move'
              event.dataTransfer.setData('text/plain', instance.instanceId)
            }}
            onDragOver={event => {
              if (draggedId === null || draggedId === instance.instanceId) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              setDropTarget({ id: instance.instanceId, position: event.clientY < rect.top + rect.height / 2 ? 'before' : 'after' })
            }}
            onDrop={event => { handleDrop(instance.instanceId, event) }}
            onDragEnd={() => { setDraggedId(null); setDropTarget(null) }}
          />
        ))}
      </div>
      {instances.length === 0 && (
        <div className="dsh-workbench-sidebar-empty">{normalizedQuery === '' ? '从首页创建实例。' : '无匹配工作台'}</div>
      )}
    </section>
  )
}
