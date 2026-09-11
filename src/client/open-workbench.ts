import type { WorkbenchPresentationKind, WorkbenchService } from './types.ts'
import { normalizeWebsiteUrl, WEBSITE_APP_ID } from './website.ts'

export function openWorkbench(service: WorkbenchService, id: string, presentation?: WorkbenchPresentationKind): void {
  const instance = service.getSnapshot().instances.find(item => item.instanceId === id)
  if (instance?.available && instance.appId === WEBSITE_APP_ID && instance.config.openMode === 'external' && typeof window !== 'undefined') {
    let url: string | undefined
    try { url = normalizeWebsiteUrl(String(instance.config.url)) } catch {}
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }
  // Keep a usable external-open link when a browser blocks the asynchronous popup after creation.
  service.open(id, presentation)
}
