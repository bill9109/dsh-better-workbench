import { useState } from 'react'
import { IconRightUpOutline16, IconWarningOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { WorkbenchRenderProps } from './types.ts'

const FRAME_SANDBOX = 'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads'

function destination(value: unknown): URL | undefined {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    if ((url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password) return url
  } catch {}
  return undefined
}

function ExternalFallback({ label, url }: { label: string; url?: string }): JSX.Element {
  return <div className="dsh-better-workbench-website-fallback">
    <span aria-hidden="true"><IconWarningOutline16 size={24} /></span>
    <p role="status">{label}</p>
    {url && <a className="dsh-better-workbench-website-external" href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><IconRightUpOutline16 /><span>在浏览器打开</span></a>}
  </div>
}

function EmbeddedWebsite({ url, title, trusted }: { url: string; title: string; trusted: boolean }): JSX.Element {
  const [failed, setFailed] = useState(false)
  if (failed) return <ExternalFallback label="网页加载失败" url={url} />
  return <iframe className="dsh-better-workbench-website-iframe" src={url} title={title}
    sandbox={trusted ? FRAME_SANDBOX + ' allow-same-origin' : FRAME_SANDBOX}
    referrerPolicy="no-referrer" onError={() => setFailed(true)} />
}

/** The webpage owns the full center surface; controls live in its sidebar menu. */
export function WebsiteView({ instance }: WorkbenchRenderProps): JSX.Element {
  const url = destination(instance.config.url)
  const sameOrigin = url !== undefined && (typeof window === 'undefined' || url.origin === window.location.origin)
  const externalOnly = instance.config.openMode === 'external'
  const embedBlocked = instance.config.embedBlocked === true
  const trusted = url !== undefined && instance.config.trustedOrigin === url.origin
  const mixedContent = url?.protocol === 'http:' && typeof window !== 'undefined' && window.location.protocol === 'https:'
  const canEmbed = url !== undefined && !sameOrigin && !externalOnly && !embedBlocked && !mixedContent
  const fallback = url === undefined ? '网址无效' : sameOrigin || mixedContent ? '此地址仅可在浏览器打开' : embedBlocked ? '此网站不可嵌入' : '外部打开'
  const title = instance.title || url?.hostname || '网站'
  return <section className="dsh-better-workbench-website" aria-label={title}>
    {canEmbed && url ? <EmbeddedWebsite key={JSON.stringify([instance.instanceId, url.href, trusted])} url={url.href} title={title} trusted={trusted} /> : <ExternalFallback label={fallback} url={url?.href} />}
  </section>
}
