import { Component, type ReactNode } from 'react'
import type { WorkbenchAppDefinition } from './types.ts'

interface Props { renderer: WorkbenchAppDefinition['renderIcon']; className?: string }

class IconBoundary extends Component<{ children: ReactNode; renderer: Props['renderer'] }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError(): { failed: boolean } { return { failed: true } }
  override componentDidUpdate(previousProps: { renderer: Props['renderer'] }): void {
    if (this.state.failed && previousProps.renderer !== this.props.renderer) this.setState({ failed: false })
  }
  override componentDidCatch(error: unknown): void { console.error('Workbench app icon failed:', error) }
  override render(): ReactNode { return this.state.failed ? null : this.props.children }
}

/** Fixed, decorative application icon slot. A bad contribution only blanks this icon. */
export function WorkbenchAppIcon({ renderer: Renderer, className }: Props): JSX.Element {
  if (!Renderer) return <span className={className} aria-hidden="true" />
  return (
    <span className={className} aria-hidden="true">
      <IconBoundary renderer={Renderer}><Renderer size={16} className="dsh-better-workbench-rendered-icon" /></IconBoundary>
    </span>
  )
}
