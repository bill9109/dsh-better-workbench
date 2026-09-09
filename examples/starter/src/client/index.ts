import { createElement, useEffect, useRef, useState } from 'react'
import type { WorkbenchClientContext, WorkbenchRenderProps } from 'dsh-better-workbench/client'

export const inject = ['workbench']

function Notes({ instance, updateConfig, setDirty, reportError }: WorkbenchRenderProps) {
  const [draft, setDraft] = useState(String(instance.config.text ?? ''))
  const [dirty, setLocalDirty] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const edited = useRef(0)
  const dirtyRef = useRef(false)
  const baseRevision = useRef(instance.revision)
  const saving = useRef(false)
  const request = useRef(0)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; request.current += 1 }
  }, [])

  useEffect(() => {
    if (!dirtyRef.current) {
      setDraft(String(instance.config.text ?? ''))
      baseRevision.current = instance.revision
    }
  }, [instance.instanceId, instance.revision, instance.config.text])

  const save = async () => {
    if (saving.current || !dirtyRef.current) return
    const token = ++request.current
    const edit = edited.current
    saving.current = true
    setPending(true)
    setError(null)
    reportError(null)
    try {
      const revision = await updateConfig({ text: draft }, baseRevision.current)
      if (!mounted.current || request.current !== token) return
      baseRevision.current = revision
      // A successful older save must not clear edits entered while it was pending.
      if (edited.current === edit) {
        dirtyRef.current = false
        setLocalDirty(false)
        setDirty(false)
      }
    } catch (cause) {
      if (!mounted.current || request.current !== token) return
      const message = cause instanceof Error ? cause.message : String(cause)
      setError(message)
      reportError(message)
    } finally {
      if (mounted.current && request.current === token) {
        saving.current = false
        setPending(false)
      }
    }
  }

  return createElement('form', {
    onSubmit: (event: { preventDefault(): void }) => { event.preventDefault(); void save() },
  },
  createElement('textarea', {
    'aria-label': 'Notes',
    value: draft,
    onChange: (event: { currentTarget: HTMLTextAreaElement }) => {
      edited.current += 1
      if (!dirtyRef.current) baseRevision.current = instance.revision
      dirtyRef.current = true
      setDraft(event.currentTarget.value)
      setLocalDirty(true)
      setDirty(true)
      setError(null)
      reportError(null)
    },
    style: { width: '100%', minHeight: '240px', boxSizing: 'border-box' },
  }),
  createElement('button', { type: 'submit', disabled: pending || !dirty }, pending ? 'Saving...' : 'Save'),
  dirty && !pending ? createElement('button', { type: 'button', onClick: () => {
    if (!window.confirm('Discard unsaved notes and load the saved version?')) return
    baseRevision.current = instance.revision
    dirtyRef.current = false
    setDraft(String(instance.config.text ?? ''))
    setLocalDirty(false)
    setDirty(false)
    setError(null)
    reportError(null)
  } }, 'Discard changes') : null,
  error === null ? null : createElement('p', { role: 'alert' }, error))
}

export function apply(ctx: WorkbenchClientContext): void {
  ctx.effect(() => ctx.workbench.registerApp({
    protocolVersion: 1,
    appId: 'starter-notes',
    title: 'Notes',
    source: { packageName: 'dsh-better-workbench-starter', version: '0.1.0' },
    config: {
      version: 1,
      defaults: () => ({ text: '' }),
      validate(config) {
        if (typeof config.text !== 'string') throw new Error('Notes text must be a string')
      },
    },
    allowMultiple: true,
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderMain: Notes,
  }), 'starter: app registration')
}
