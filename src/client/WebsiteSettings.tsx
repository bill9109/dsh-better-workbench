import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import type { WorkbenchInstance, WorkbenchConfig } from './types.ts'

export function WebsiteSettings({ open, instance, updateConfig, onClose }: {
  open: boolean
  instance: WorkbenchInstance
  updateConfig: (patch: WorkbenchConfig, revision: number) => Promise<unknown>
  onClose: () => void
}): JSX.Element {
  let origin = ''
  try { origin = new URL(String(instance.config.url)).origin } catch {}
  const sameOrigin = !origin || typeof window === 'undefined' || origin === window.location.origin
  const [base, setBase] = useState({ origin, revision: instance.revision })
  const [trusted, setTrusted] = useState(instance.config.trustedOrigin === origin && !!origin)
  const [external, setExternal] = useState(instance.config.openMode === 'external')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inFlight = useRef(false)
  const owner = useRef({ active: true })
  useEffect(() => {
    const current = { active: true }; owner.current = current
    return () => { current.active = false }
  }, [])
  useEffect(() => {
    if (open) {
      setBase({ origin, revision: instance.revision })
      setTrusted(instance.config.trustedOrigin === origin && !!origin)
      setExternal(instance.config.openMode === 'external')
      setError(null)
    }
  }, [open])
  const save = async (): Promise<void> => {
    if (inFlight.current || !origin) return
    if (origin !== base.origin || instance.revision !== base.revision) { setError('网页配置已更新，请关闭后重新打开设置。'); return }
    const current = owner.current
    inFlight.current = true; setSaving(true); setError(null)
    try {
      await updateConfig({ trustedOrigin: trusted ? base.origin : '', openMode: external ? 'external' : 'embedded' }, base.revision)
      if (current.active) onClose()
    } catch (reason) { if (current.active) setError(reason instanceof Error ? reason.message : String(reason)) }
    finally { inFlight.current = false; if (current.active) setSaving(false) }
  }
  return <Modal open={open} title="网页设置" closeLabel="关闭" onClose={() => { if (!saving) onClose() }} className="dsh-better-workbench-create-dialog" footer={<><Button variant="outline" disabled={saving} onClick={onClose}>取消</Button><Button variant="primary" disabled={saving || !origin} onClick={() => { void save() }}>{saving ? '正在保存...' : '保存'}</Button></>}>
    <p className="dsh-better-workbench-website-permission">{base.origin}</p>
    <label className="dsh-better-workbench-website-setting"><input type="checkbox" checked={external} disabled={saving} onChange={event => setExternal(event.target.checked)} />在浏览器新标签页打开</label>
    <label className="dsh-better-workbench-website-setting"><input type="checkbox" checked={trusted} disabled={saving || sameOrigin || external} onChange={event => setTrusted(event.target.checked)} />信任此站点并启用兼容模式</label>
    <p className="dsh-better-workbench-website-permission">兼容模式允许此站点访问自身 Cookie 和存储，降低 iframe 隔离。仅用于可信站点；恶意页面或重定向可能危及 DSH 数据。</p>
    {error && <div role="alert" className="dsh-better-workbench-create-error">{error}</div>}
  </Modal>
}
