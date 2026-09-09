import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@deepseek-ai/dsh-client-ui-primitives'

interface Props {
  children: ReactNode
  onRetry: () => void
}

/** Keep application failures below the host navigation and recovery controls. */
export class WorkbenchErrorBoundary extends Component<Props, { error: string | null }> {
  state: { error: string | null } = { error: null }

  static getDerivedStateFromError(error: unknown): { error: string } {
    return { error: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[dsh-better-workbench] application render failed', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.error !== null) {
      return (
        <div className="dsh-better-workbench-unavailable" role="alert">
          <strong>工作台显示失败</strong>
          <span>{this.state.error}</span>
          <Button variant="outline" size="sm" onClick={this.props.onRetry}>重新加载视图</Button>
        </div>
      )
    }
    return this.props.children
  }
}
