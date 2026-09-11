import { useId, useState } from 'react'
import { IconGlobeOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'

export interface WebsiteIconProps {
  url?: string
  faviconUrl?: string
  size?: number
  className?: string
}

function imageUrl(value: string | undefined): URL | undefined {
  if (!value) return undefined
  try {
    const parsed = new URL(value)
    if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && !parsed.username && !parsed.password) return parsed
  } catch {
    return undefined
  }
  return undefined
}

function Favicon({ src, size }: { src: string; size: number }): JSX.Element {
  const filterId = `dsh-website-favicon-${useId()}`
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  return (
    <>
      {state !== 'ready' && <IconGlobeOutline14 size={size} />}
      {state !== 'error' && (
        <>
          <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', pointerEvents: 'none' }}>
            <defs>
              <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="gray" />
                {/* Keep luminance detail, including inside opaque favicons, instead of tinting their alpha alone. */}
                <feColorMatrix in="gray" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.65 0 0 0 1" result="tone" />
                <feComposite in="tone" in2="SourceAlpha" operator="in" result="mask" />
                <feFlood floodColor="currentColor" result="ink" />
                <feComposite in="ink" in2="mask" operator="in" />
              </filter>
            </defs>
          </svg>
          <img
            src={src}
            alt=""
            width={size}
            height={size}
            draggable={false}
            referrerPolicy="no-referrer"
            onLoad={() => { setState('ready') }}
            onError={() => { setState('error') }}
            style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'contain', filter: `url("#${filterId}")`, opacity: state === 'ready' ? 1 : 0 }}
          />
        </>
      )}
    </>
  )
}

export function WebsiteIcon({ url, faviconUrl, size = 16, className }: WebsiteIconProps): JSX.Element {
  const website = imageUrl(url)
  const src = imageUrl(faviconUrl)?.href ?? (website ? new URL('/favicon.ico', website.origin).href : undefined)
  const edge = Number.isFinite(size) && size > 0 ? size : 16
  return (
    <span
      className={className}
      aria-hidden="true"
      data-dsh-website-icon=""
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', width: edge, height: edge, lineHeight: 0, verticalAlign: 'middle' }}
    >
      {src ? <Favicon key={src} src={src} size={edge} /> : <IconGlobeOutline14 size={edge} />}
    </span>
  )
}
