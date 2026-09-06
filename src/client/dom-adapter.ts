import { resolveActivePresentation, resolvePresentationLayout } from './presentation.ts'
import type { WorkbenchService } from './types.ts'

const SIDEBAR_SLOT = '[data-slot="sidebar.workspaces"]'
const CONVERSATION_SLOT = '[data-slot="conversation"]'
const OWNED = '[data-dsh-workbench-sidebar], [data-dsh-workbench-center]'
const PANEL_SIZE = '--workbench-panel-size'
const CONVERSATION_PROPERTIES = ['visibility', 'pointer-events', 'margin-right', 'margin-bottom'] as const

type SavedStyle = Map<string, { value: string; priority: string }>

export interface WorkbenchDomOptions {
  document?: Document
  style: string
  renderSidebar(host: HTMLElement, ready: (ready: boolean) => void): () => void
  renderCenter(host: HTMLElement, ready: (ready: boolean) => void): () => void
  /** Optional sessions service, read through the verified sessions.list contract only. */
  getSessions?: () => unknown
  onError?: (error: unknown) => void
}

interface Surface {
  host: HTMLElement
  anchor: HTMLElement
  parent: HTMLElement
  dispose: () => void
  ready: boolean
  failed: boolean
  originals: Map<HTMLElement, SavedStyle>
  parentStyle: SavedStyle
  resize?: ResizeObserver
  children?: MutationObserver
}

function saveStyle(element: HTMLElement, properties: readonly string[]): SavedStyle {
  return new Map(properties.map(property => [property, {
    value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property),
  }]))
}

function setStyle(element: HTMLElement, property: string, value: string, priority = ''): void {
  if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === priority) return
  if (value === '') element.style.removeProperty(property)
  else element.style.setProperty(property, value, priority)
}

function restoreStyle(element: HTMLElement, saved: SavedStyle): void {
  for (const [property, { value, priority }] of saved) setStyle(element, property, value, priority)
}

/** Narrow fallback for reselecting a leaf Session. No localized labels or CSS-module names. */
export function isSessionNavigationClick(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  const target = event.target as Element | null
  if (target === null || typeof target.closest !== 'function' || target.closest(OWNED)) return false
  const row = target.closest(SIDEBAR_SLOT + ' [role="treeitem"][aria-selected]')
  if (row === null || row.hasAttribute('aria-expanded')) return false
  const control = target.closest('button, a, input, textarea, select, [role="button"], [role="menu"], [role="menuitem"], [contenteditable="true"]')
  return control === null || control === row
}

interface SessionList {
  getSnapshot(): { current?: string }
  subscribe(listener: () => void): () => void
}

function sessionList(value: unknown): SessionList | undefined {
  if (typeof value !== 'object' || value === null || !('list' in value)) return undefined
  const list = value.list
  if (typeof list !== 'object' || list === null || !('getSnapshot' in list) || !('subscribe' in list)) return undefined
  if (typeof list.getSnapshot !== 'function' || typeof list.subscribe !== 'function') return undefined
  return list as SessionList
}

/** Own the compatibility DOM without replacing DSH slots, methods, or React roots. */
export function mountWorkbenchDom(service: WorkbenchService, options: WorkbenchDomOptions): () => void {
  const doc = options.document ?? document
  const view = doc.defaultView
  if (view === null || doc.body === null) return () => {}
  const report = options.onError ?? ((error: unknown) => console.error('Workbench DOM adapter:', error))
  let active = true
  let sidebar: Surface | undefined
  let center: Surface | undefined
  let queued = false
  let navigation: SessionList | undefined
  let unsubscribeNavigation: (() => void) | undefined
  const style = doc.createElement('style')
  style.setAttribute('data-dsh-workbench-style', '')
  style.textContent = options.style
  doc.head.appendChild(style)

  const restoreConversation = (surface: Surface): void => {
    for (const [element, saved] of surface.originals) restoreStyle(element, saved)
    surface.originals.clear()
  }
  const sync = (): void => {
    if (!active || center === undefined) return
    const surface = center
    const presentation = resolveActivePresentation(service.getSnapshot(), service)
    const layout = resolvePresentationLayout(presentation, surface.parent.clientWidth, surface.parent.clientHeight)
    const effective = layout.presentation
    setStyle(surface.host, PANEL_SIZE, layout.panelSize + 'px')
    setStyle(surface.parent, PANEL_SIZE, layout.panelSize + 'px')
    surface.host.dataset.workbenchPresentation = effective?.kind ?? 'conversation'
    surface.host.dataset.workbenchBehavior = effective?.kind === 'panel' ? effective.behavior : ''
    surface.host.dataset.workbenchPlacement = effective !== undefined && 'placement' in effective ? effective.placement : ''
    if (!surface.ready || !surface.host.isConnected) {
      restoreConversation(surface)
      return
    }
    for (const [element, saved] of surface.originals) {
      if (element.parentElement !== surface.anchor) {
        restoreStyle(element, saved)
        surface.originals.delete(element)
      }
    }
    for (const child of Array.from(surface.anchor.children)) {
      if (!(child instanceof view.HTMLElement)) continue
      if (!surface.originals.has(child)) surface.originals.set(child, saveStyle(child, CONVERSATION_PROPERTIES))
      const saved = surface.originals.get(child)!
      const overrides: Record<string, string | undefined> = {
        visibility: effective?.conversation === 'exclusive' ? 'hidden' : undefined,
        'pointer-events': effective?.conversation === 'exclusive' ? 'none' : undefined,
        'margin-right': layout.rightInset > 0 ? layout.rightInset + 'px' : undefined,
        'margin-bottom': layout.bottomInset > 0 ? layout.bottomInset + 'px' : undefined,
      }
      for (const [property, original] of saved) {
        const override = overrides[property]
        setStyle(child, property, override ?? original.value, override === undefined ? original.priority : '')
      }
    }
  }
  const disposeSurface = (surface: Surface): void => {
    surface.resize?.disconnect()
    surface.children?.disconnect()
    restoreConversation(surface)
    try { surface.dispose() } catch (error) { report(error) }
    surface.host.remove()
    restoreStyle(surface.parent, surface.parentStyle)
  }
  const insert = (kind: 'sidebar' | 'center'): Surface | undefined => {
    const anchor = doc.querySelector(kind === 'sidebar' ? SIDEBAR_SLOT : CONVERSATION_SLOT)
    if (!(anchor instanceof view.HTMLElement) || anchor.parentElement === null) return undefined
    const parent = anchor.parentElement
    const host = doc.createElement('div')
    host.setAttribute('data-dsh-workbench-' + kind, '')
    const surface: Surface = {
      host, anchor, parent, dispose: () => {}, ready: false, failed: false, originals: new Map(),
      parentStyle: saveStyle(parent, kind === 'center' ? ['position', PANEL_SIZE] : []),
    }
    try {
      if (kind === 'center') {
        setStyle(parent, 'position', 'relative')
        parent.appendChild(host)
      } else parent.insertBefore(host, anchor)
      const ready = (value: boolean): void => {
        surface.ready = value
        surface.failed = !value
        if (active) sync()
      }
      surface.dispose = (kind === 'center' ? options.renderCenter : options.renderSidebar)(host, ready)
      if (surface.failed) throw new Error('Workbench surface failed to render')
      if (kind === 'center') {
        surface.children = new view.MutationObserver(sync)
        surface.children.observe(anchor, { childList: true })
        if (typeof view.ResizeObserver === 'function') {
          surface.resize = new view.ResizeObserver(sync)
          surface.resize.observe(parent)
        }
      }
      return surface
    } catch (error) {
      disposeSurface(surface)
      report(error)
      return undefined
    }
  }
  const connected = (surface: Surface): boolean => surface.host.isConnected
    && surface.anchor.isConnected && surface.anchor.parentElement === surface.parent
    && surface.host.parentElement === surface.parent
  const valid = (surface: Surface): boolean => !surface.failed && connected(surface)
  const close = (): void => {
    if (active && service.getSnapshot().route.kind !== 'conversation') service.close()
  }
  const bindNavigation = (): void => {
    // DSH sessions.list is state, not a navigation-intent event. Reselecting the
    // same blank Session via New Session cannot be inferred from this contract.
    const next = sessionList(options.getSessions?.())
    if (next === navigation) return
    unsubscribeNavigation?.()
    unsubscribeNavigation = undefined
    navigation = next
    if (next === undefined) return
    let current = next.getSnapshot().current
    unsubscribeNavigation = next.subscribe(() => {
      const selected = next.getSnapshot().current
      if (selected === undefined) return
      const changed = selected !== current
      current = selected
      if (changed) close()
    })
  }
  const reconcile = (): void => {
    if (!active) return
    if (sidebar !== undefined && !valid(sidebar)) { disposeSurface(sidebar); sidebar = undefined }
    if (center !== undefined && !valid(center)) { disposeSurface(center); center = undefined }
    sidebar ??= insert('sidebar')
    center ??= insert('center')
    try { bindNavigation() } catch (error) { report(error) }
    sync()
  }
  const schedule = (): void => {
    if (queued || !active) return
    queued = true
    view.queueMicrotask(() => { queued = false; if (active) reconcile() })
  }
  const bodyObserver = new view.MutationObserver(records => {
    if (!active) return
    if ((sidebar !== undefined && !connected(sidebar)) || (center !== undefined && !connected(center))) { schedule(); return }
    // Only slot topology can require a global lookup. App renders and ordinary
    // conversation descendants never trigger rescanning or a render feedback loop.
    for (const record of records) {
      const target = record.target instanceof view.Element ? record.target : record.target.parentElement
      if (target?.closest(OWNED)) continue
      const nodes = [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)]
      if (nodes.some(node => node instanceof view.Element && !node.matches(OWNED)
        && (node.matches(SIDEBAR_SLOT + ', ' + CONVERSATION_SLOT) || node.querySelector(SIDEBAR_SLOT + ', ' + CONVERSATION_SLOT)))) {
        schedule()
        return
      }
    }
  })
  const click = (event: MouseEvent): void => { if (isSessionNavigationClick(event)) close() }
  const headObserver = new view.MutationObserver(() => { if (active && !style.isConnected) doc.head.appendChild(style) })
  let unsubscribe = (): void => {}
  let retry: number | undefined
  const dispose = (): void => {
    if (!active) return
    active = false
    bodyObserver.disconnect()
    headObserver.disconnect()
    if (retry !== undefined) view.clearInterval(retry)
    view.removeEventListener('resize', sync)
    doc.removeEventListener('click', click)
    unsubscribe()
    unsubscribeNavigation?.()
    if (sidebar !== undefined) disposeSurface(sidebar)
    if (center !== undefined) disposeSurface(center)
    style.remove()
  }
  try {
    bodyObserver.observe(doc.body, { childList: true, subtree: true })
    headObserver.observe(doc.head, { childList: true })
    doc.addEventListener('click', click)
    view.addEventListener('resize', sync)
    unsubscribe = service.subscribe(sync)
    reconcile()
    retry = view.setInterval(() => {
      if (sidebar === undefined || center === undefined || sidebar.failed || center.failed) reconcile()
      else { try { bindNavigation() } catch (error) { report(error) } }
    }, 250)
  } catch (error) {
    dispose()
    throw error
  }
  return dispose
}
