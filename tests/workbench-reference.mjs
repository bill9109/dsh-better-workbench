import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import { createWorkbenchReferenceSource, registerWorkbenchReference } from '../src/client/workbench-reference.ts'

const instance = { instanceId: 'website-1', appId: 'workbench.website', title: 'dshfind', config: { url: 'http://dshfind.com/', secret: 'never serialize' }, available: true, status: 'ready', revision: 1, order: 0, createdAt: 1, updatedAt: 1, lastOpenedAt: 1, configVersion: 1 }
const service = { ready: Promise.resolve(), getSnapshot: () => ({ apps: [{appId:'workbench.website',title:'网页'}], instances: [instance] }) }
const request = (query, signal = new AbortController().signal) => ({ query, position: 'leading', drilled: false, signal })
const pick = value => ({ candidate: { name: 'dshfind', value }, session: { sessionId: 's' }, position: 'leading', via: 'menu', action: 'pick', span: { start: 0, end: 7, draftRev: 1 } })

test('source groups workbenches without replacing native sources and filters names', async () => {
  const source = createWorkbenchReferenceSource(service)
  const expected = [{ name: 'dshfind', description: '网页 · website-1', section: '工作台', value: 'website-1' }]
  assert.deepEqual(await source.candidates({ sessionId: 's' }, request('')), expected)
  assert.deepEqual(await source.candidates({ sessionId: 's' }, request('DSH')), expected)
  assert.deepEqual(await source.candidates({ sessionId: 's' }, request('missing')), [])
  assert.deepEqual(await source.candidates({ sessionId: 's' }, {...request('dsh'),quoted:true}), [])
  assert.equal(source.trigger, '@')
  assert.equal(source.name, 'workbench')
})

test('selection pins instance identity and serializes metadata only with XML escaping', async () => {
  let title = instance.title
  const source = createWorkbenchReferenceSource({...service,getSnapshot:()=>({...service.getSnapshot(),instances:[{...instance,title}]})})
  const outcome = source.onPick(pick('website-1'))
  assert.equal(outcome.insert.source, 'workbench')
  assert.equal(outcome.insert.ref, 'website-1')
  assert.equal(outcome.insert.clipboardText, '@dshfind')
  assert.equal(source.codec.clipboardText('website-1'), '@dshfind')
  assert.equal(await source.codec.serialize('website-1', new AbortController().signal), '<workbench instance_id="website-1" app_id="workbench.website" title="dshfind" />')
  title = 'New & <"title">'
  const text = await source.codec.serialize(outcome.insert.ref, new AbortController().signal)
  assert.match(text, /New &amp; &lt;&quot;title&quot;&gt;/)
  assert.ok(!text.includes('never serialize'))
  assert.ok(!text.includes('http://dshfind.com/'))
})

test('deleted or unavailable references fail rather than silently sending stale context', async () => {
  let instances = [instance]
  const source = createWorkbenchReferenceSource({...service,getSnapshot:()=>({...service.getSnapshot(),instances})})
  instances = []
  await assert.rejects(source.codec.serialize('website-1', new AbortController().signal), /已删除/)
  assert.throws(()=>source.onPick(pick('website-1')), /已删除/)
  instances = [{...instance,available:false}]
  assert.deepEqual(await source.candidates({sessionId:'s'},request('')),[])
  await assert.rejects(source.codec.serialize('website-1',new AbortController().signal),/暂不可用/)
})

test('readiness and cancellation suppress stale candidates and cancelled serialization', async () => {
  let release
  const ready = new Promise(resolve=>{release=resolve})
  const source = createWorkbenchReferenceSource({...service,ready})
  const abort = new AbortController()
  const pending = source.candidates({sessionId:'s'},request('',abort.signal))
  abort.abort();release()
  assert.deepEqual(await pending,[])
  await assert.rejects(source.codec.serialize('website-1',abort.signal),{name:'AbortError'})
})

test('duplicate titles retain distinct instance ids and listing has a bounded size', async () => {
  const instances = Array.from({length:70},(_,i)=>({...instance,instanceId:'web-'+i}))
  const source = createWorkbenchReferenceSource({...service,getSnapshot:()=>({...service.getSnapshot(),instances})})
  const candidates = await source.candidates({sessionId:'s'},request(''))
  assert.equal(candidates.length,50)
  assert.equal(new Set(candidates.map(c=>c.value)).size,50)
  assert.equal(source.onPick(pick('web-1')).insert.ref,'web-1')
})

test('Cordis effect disposal unregisters references and remounts without stale callbacks', async () => {
  const ctx = new Context()
  const sources = new Map()
  let removals=0
  ctx.reflect.provide('inputTriggers',{registerSource(source){
    assert.equal(sources.has(source.name),false)
    sources.set(source.name,source)
    return ()=>{removals++;sources.delete(source.name)}
  }})
  const plugin = scope => { scope.effect(()=>registerWorkbenchReference(scope,service)) }
  const fiber = ctx.plugin(plugin)
  await fiber
  const old = sources.get('workbench')
  assert.ok(old)
  assert.equal((await old.candidates({sessionId:'s'},request(''))).length,1)
  await fiber.dispose()
  assert.equal(sources.size,0)
  assert.equal(removals,1)
  assert.deepEqual(await old.candidates({sessionId:'s'},request('')),[])
  await assert.rejects(old.codec.serialize('website-1',new AbortController().signal),{name:'AbortError'})
  const fresh = ctx.plugin(plugin)
  await fresh
  assert.ok(sources.get('workbench'))
  await fresh.dispose()
})
