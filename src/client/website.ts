import type { WorkbenchConfig } from './types.ts'

export const WEBSITE_APP_ID = 'workbench.website'
export const WEBSITE_TEMPLATE_ID = 'workbench.website:from-url'

export function normalizeWebsiteUrl(value: string): string {
  const input = value.trim()
  if (!input || input.startsWith('//') || /[\s\u0000-\u001f\u007f]/u.test(input)) throw new Error('请输入有效的网页地址')
  // A bare domain:port is an authority, not a URI scheme.
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(input) && !/^[^/:]+:\d+(?:[/?#]|$)/.test(input)
  let url: URL
  try { url = new URL(hasScheme ? input : 'https://' + input) }
  catch { throw new Error('请输入有效的网页地址') }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('仅支持 HTTP 或 HTTPS 网页地址')
  if (url.username || url.password) throw new Error('网页地址不能包含用户名或密码')
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  if (host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' || host === '[::]' || host.startsWith('[::ffff:') || host === '0.0.0.0' || /^127\.\d+\.\d+\.\d+$/.test(host)) throw new Error('网页工作台暂不支持本机地址')
  if (!url.hostname || (!url.hostname.includes('.') && !url.hostname.includes(':') && url.hostname !== 'localhost')) throw new Error('请输入完整域名')
  return url.href
}

export function websiteName(url: string): string {
  return new URL(normalizeWebsiteUrl(url)).hostname.replace(/^www\./, '')
}

export function validateWebsiteConfig(config: WorkbenchConfig): void {
  if (typeof config.url !== 'string') throw new Error('网页地址必须是文本')
  if (config.url !== '' && normalizeWebsiteUrl(config.url) !== config.url) throw new Error('请输入规范的完整网页地址')
  if (config.openMode !== 'embedded' && config.openMode !== 'external') throw new Error('无效的网页打开方式')
  if (config.trustedOrigin !== undefined && (typeof config.trustedOrigin !== 'string' || (config.trustedOrigin !== '' && config.trustedOrigin !== new URL(normalizeWebsiteUrl(config.url as string)).origin))) throw new Error('可信站点必须与当前网址来源一致')
  if (config.faviconUrl !== undefined && (typeof config.faviconUrl !== 'string' || normalizeWebsiteUrl(config.faviconUrl) !== config.faviconUrl)) throw new Error('无效的网页图标地址')
}

export function validateWebsiteCreation(config: WorkbenchConfig): void {
  validateWebsiteConfig(config)
  normalizeWebsiteUrl(config.url as string)
}
