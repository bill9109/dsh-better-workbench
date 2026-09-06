import { Component, createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { WorkbenchController } from './service.ts'
import { WorkbenchSidebar } from './WorkbenchSidebar.tsx'
import { WorkbenchSurface } from './WorkbenchSurface.tsx'
import { mountWorkbenchDom } from './dom-adapter.ts'
import { WORKBENCH_STYLE } from './styles.ts'
import type { WorkbenchService } from './types.ts'

export type * from './types.ts'
export { resolveActivePresentation, resolvePresentationLayout } from './presentation.ts'
export type { WorkbenchPresentationLayout } from './presentation.ts'

/** Client service supplied to all workbench application plugins. */
declare module '@deepseek-ai/cordis' {
  interface Context {
    workbench: WorkbenchService
  }
}

interface MountBoundaryProps {
  children: ReactNode
  ready: (ready: boolean) => void
}

class MountBoundary extends Component<MountBoundaryProps, { failed: boolean }> {
  override state = { failed: false }

  static getDerivedStateFromError(): { failed: boolean } { return { failed: true } }

  override componentDidMount(): void { this.props.ready(!this.state.failed) }

  override componentDidCatch(error: unknown): void {
    this.props.ready(false)
    console.error('Workbench surface failed:', error)
  }

  override render(): ReactNode { return this.state.failed ? null : this.props.children }
}

function renderSurface(host: HTMLElement, content: ReactNode, ready: (ready: boolean) => void): () => void {
  const root = createRoot(host)
  try {
    root.render(createElement(MountBoundary, { ready, children: content }))
  } catch (error) {
    root.unmount()
    throw error
  }
  return () => root.unmount()
}

/** Mount the service and reversible compatibility surfaces in this Cordis lifetime. */
export function apply(ctx: ClientContext): void {
  const service = new WorkbenchController()
  ctx.effect(() => () => service.dispose(), 'dsh-workbench: controller lifetime')
  ctx.effect(() => {
    const beforeUnload = (event: BeforeUnloadEvent): void => {
      if (service.getSnapshot().dirtyInstanceIds.length === 0) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => { window.removeEventListener('beforeunload', beforeUnload) }
  }, 'dsh-workbench: unsaved changes warning')
  ctx.effect(() => ctx.reflect.provide('workbench', service), 'dsh-workbench: service')
  ctx.effect(() => mountWorkbenchDom(service, {
    style: WORKBENCH_STYLE,
    getSessions: () => ctx.get('sessions'),
    renderSidebar: (host, ready) => renderSurface(host, createElement(WorkbenchSidebar, { service }), ready),
    renderCenter: (host, ready) => renderSurface(host, createElement(WorkbenchSurface, { service }), ready),
  }), 'dsh-workbench: DOM surfaces')
}
