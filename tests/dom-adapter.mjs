import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import { mountWorkbenchDom } from '../src/client/dom-adapter.ts'
import { resolvePresentationLayout } from '../src/client/presentation.ts'

const page = { kind: 'page', conversation: 'exclusive' }
const panel = (placement = 'right') => ({ kind: 'panel', placement, behavior: 'push', conversation: 'resident' })
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve() }

function fixture(t, { html, presentation = page, ready = true, failCenter = false, failSidebar = false } = {}) {
  const dom = new JSDOM(html ?? '<aside><div data-slot="sidebar.workspaces"></div></aside><main><div data-slot="conversation"><article style="visibility: visible !important; pointer-events: auto; margin-right: 9px; margin-bottom: 3px">Chat</article></div></main>')
  const { window } = dom
  const doc = window.document
  const intervals = new Map()
  let timer = 0
  window.setInterval = callback => { intervals.set(++timer, callback); return timer }
  window.clearInterval = id => { intervals.delete(id) }
  const resizes = new Set()
  window.ResizeObserver = class {
    constructor(callback) { this.callback = callback }
    observe() { resizes.add(this.callback) }
    disconnect() { resizes.delete(this.callback) }
  }
  const main = doc.querySelector('main')
  let width = 1000
  let height = 800
  if (main) {
    Object.defineProperty(main, 'clientWidth', { get: () => width })
    Object.defineProperty(main, 'clientHeight', { get: () => height })
    main.style.setProperty('position', 'absolute', 'important')
    main.style.setProperty('--workbench-panel-size', '17px', 'important')
  }
  const listeners = new Set()
  let route = { kind: 'workbench-instance', instanceId: 'one', presentation: presentation.kind }
  let activePresentation = presentation
  let closeCalls = 0
  const service = {
    getSnapshot: () => ({ route, instances: [{ instanceId: 'one', appId: 'app' }] }),
    getApp: () => ({ defaultPresentation: activePresentation.kind, presentations: [activePresentation] }),
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    close: () => { closeCalls++; route = { kind: 'conversation' }; for (const listener of listeners) listener() },
  }
  const navigationListeners = new Set()
  let selected = 'initial'
  let sessions = { list: {
    getSnapshot: () => ({ current: selected }),
    subscribe: listener => { navigationListeners.add(listener); return () => navigationListeners.delete(listener) },
  } }
  const renders = { sidebar: 0, center: 0 }
  const unmounts = { sidebar: 0, center: 0 }
  const readyCallbacks = {}
  const failures = { center: failCenter, sidebar: failSidebar }
  const render = kind => (host, committed) => {
    renders[kind]++
    if (failures[kind]) throw new Error('test mount failure')
    readyCallbacks[kind] = committed
    host.appendChild(doc.createElement('section'))
    if (ready) committed(true)
    return () => { unmounts[kind]++ }
  }
  const errors = []
  const dispose = mountWorkbenchDom(service, {
    document: doc, style: ':root { --test: 1; }', renderSidebar: render('sidebar'), renderCenter: render('center'),
    getSessions: () => sessions, onError: error => errors.push(error),
  })
  t.after(() => { dispose(); window.close() })
  return {
    doc, window, main, service, dispose, renders, unmounts, errors, readyCallbacks, failures, listeners, intervals, resizes,
    get closeCalls() { return closeCalls },
    get navigationListeners() { return navigationListeners },
    tick: () => { for (const callback of intervals.values()) callback() },
    resize: (w, h) => { width = w; height = h; for (const callback of resizes) callback() },
    emit: () => { for (const listener of listeners) listener() },
    select: current => { selected = current; for (const listener of navigationListeners) listener() },
    removeSessions: () => { sessions = undefined },
    show: next => { activePresentation = next; route = { kind: 'workbench-instance', instanceId: 'one', presentation: next.kind }; for (const listener of listeners) listener() },
  }
}

test('layout uses shared bounded geometry and effective push behavior', () => {
  assert.deepEqual(resolvePresentationLayout(undefined, 1000, 800), { presentation: undefined, panelSize: 0, rightInset: 0, bottomInset: 0 })
  assert.equal(resolvePresentationLayout(page, 1000, 800).presentation, page)
  for (const [width, size, behavior, inset] of [[1000, 360, 'push', 360], [720, 360, 'push', 360], [719, 360, 'overlay', 0], [240, 240, 'overlay', 0], [0, 0, 'overlay', 0], [-1, 0, 'overlay', 0], [NaN, 0, 'overlay', 0]]) {
    const result = resolvePresentationLayout(panel(), width, 800)
    assert.equal(result.panelSize, size)
    assert.equal(result.presentation.behavior, behavior)
    assert.equal(result.rightInset, inset)
    assert.equal(result.bottomInset, 0)
  }
  for (const [height, size, behavior] of [[800, 280, 'push'], [560, 280, 'push'], [559, 280, 'overlay'], [400, 220.00000000000003, 'overlay'], [0, 0, 'overlay']]) {
    const result = resolvePresentationLayout(panel('bottom'), 1000, height)
    assert.equal(result.panelSize, size)
    assert.equal(result.presentation.behavior, behavior)
    assert.equal(result.bottomInset, behavior === 'push' ? size : 0)
    assert.equal(result.rightInset, 0)
  }
})

test('waits for React commit and restores original styles and all owned resources', async t => {
  const f = fixture(t, { ready: false })
  const chat = f.doc.querySelector('article')
  assert.equal(chat.style.visibility, 'visible')
  f.readyCallbacks.center(true)
  assert.equal(chat.style.visibility, 'hidden')
  const extra = f.doc.createElement('article')
  f.doc.querySelector('[data-slot="conversation"]').append(extra)
  await flush()
  assert.equal(extra.style.visibility, 'hidden')
  f.dispose()
  f.dispose()
  assert.deepEqual(f.unmounts, { sidebar: 1, center: 1 })
  assert.equal(chat.style.visibility, 'visible')
  assert.equal(chat.style.getPropertyPriority('visibility'), 'important')
  assert.equal(chat.style.pointerEvents, 'auto')
  assert.equal(chat.style.marginRight, '9px')
  assert.equal(chat.style.marginBottom, '3px')
  assert.equal(extra.style.visibility, '')
  assert.equal(f.main.style.position, 'absolute')
  assert.equal(f.main.style.getPropertyPriority('position'), 'important')
  assert.equal(f.main.style.getPropertyValue('--workbench-panel-size'), '17px')
  assert.equal(f.main.style.getPropertyPriority('--workbench-panel-size'), 'important')
  assert.equal(f.doc.querySelector('[data-dsh-better-workbench-style]'), null)
  assert.equal(f.doc.querySelector('[data-dsh-better-workbench-center]'), null)
  assert.equal(f.listeners.size + f.navigationListeners.size + f.intervals.size + f.resizes.size, 0)
  f.doc.body.append(f.doc.createElement('div'))
  await flush()
  assert.deepEqual(f.renders, { sidebar: 1, center: 1 })
})

test('failed center does not hide chat or remove a healthy sidebar and can retry', async t => {
  const f = fixture(t, { failCenter: true })
  assert.equal(f.doc.querySelector('article').style.visibility, 'visible')
  assert.ok(f.doc.querySelector('[data-dsh-better-workbench-sidebar]'))
  assert.equal(f.doc.querySelector('[data-dsh-better-workbench-center]'), null)
  assert.equal(f.main.style.position, 'absolute')
  await flush()
  assert.equal(f.renders.center, 1, 'failed insertion must not trigger its own observer retry loop')
  f.failures.center = false
  f.tick()
  assert.deepEqual(f.renders, { sidebar: 1, center: 2 })
  assert.equal(f.doc.querySelector('article').style.visibility, 'hidden')
})

test('sidebar failure retries independently while healthy center stays mounted', t => {
  const f = fixture(t, { failSidebar: true })
  assert.ok(f.doc.querySelector('[data-dsh-better-workbench-center]'))
  assert.equal(f.doc.querySelector('[data-dsh-better-workbench-sidebar]'), null)
  f.failures.sidebar = false
  f.tick()
  assert.deepEqual(f.renders, { sidebar: 2, center: 1 })
})

test('late anchors mount independently and removed hosts are replaced', async t => {
  const f = fixture(t, { html: '<aside></aside><main></main>' })
  const slot = f.doc.createElement('div')
  slot.dataset.slot = 'conversation'
  f.main.append(slot)
  await flush()
  assert.deepEqual(f.renders, { sidebar: 0, center: 1 })
  const sidebar = f.doc.createElement('div')
  sidebar.dataset.slot = 'sidebar.workspaces'
  f.doc.querySelector('aside').append(sidebar)
  await flush()
  assert.deepEqual(f.renders, { sidebar: 1, center: 1 })
  f.doc.querySelector('[data-dsh-better-workbench-center]').remove()
  await flush()
  assert.deepEqual(f.renders, { sidebar: 1, center: 2 })
  assert.deepEqual(f.unmounts, { sidebar: 0, center: 1 })
})

test('owned DOM changes and conversation descendants never cause global scans', async t => {
  const f = fixture(t)
  await flush()
  let scans = 0
  const original = f.doc.querySelector.bind(f.doc)
  f.doc.querySelector = (...args) => { scans++; return original(...args) }
  const surface = original('[data-dsh-better-workbench-center]')
  const chat = original('article')
  for (let i = 0; i < 20; i++) {
    surface.replaceChildren(f.doc.createElement('div'))
    chat.append(f.doc.createElement('span'))
    f.emit()
    await flush()
  }
  assert.equal(scans, 0)
  assert.deepEqual(f.renders, { sidebar: 1, center: 1 })
})

test('resize applies identical effective behavior and inset to host and conversation', t => {
  const f = fixture(t, { presentation: panel() })
  const host = f.doc.querySelector('[data-dsh-better-workbench-center]')
  const chat = f.doc.querySelector('article')
  assert.equal(host.dataset.workbenchBehavior, 'push')
  assert.equal(chat.style.marginRight, '360px')
  assert.equal(host.style.getPropertyValue('--workbench-panel-size'), '360px')
  f.resize(300, 800)
  assert.equal(host.dataset.workbenchBehavior, 'overlay')
  assert.equal(chat.style.marginRight, '9px')
  assert.equal(host.style.getPropertyValue('--workbench-panel-size'), '300px')
  f.show(panel('bottom'))
  f.resize(1000, 800)
  assert.equal(chat.style.marginBottom, '280px')
  f.resize(1000, 400)
  assert.equal(host.dataset.workbenchBehavior, 'overlay')
  assert.equal(chat.style.marginBottom, '3px')
  assert.equal(Number.parseFloat(host.style.getPropertyValue('--workbench-panel-size')), resolvePresentationLayout(panel('bottom'), 1000, 400).panelSize)
})

test('session menu, nested controls, groups and prevented clicks do not close the workbench', t => {
  const f = fixture(t)
  const slot = f.doc.querySelector('[data-slot="sidebar.workspaces"]')
  slot.innerHTML = '<div role="treeitem" aria-selected="true"><span id="title">Session</span><button id="menu"><svg></svg></button><input id="rename"></div><div role="treeitem" aria-expanded="false" aria-selected="false" id="group">Workspace</div>'
  const click = (id, options = {}) => f.doc.getElementById(id).dispatchEvent(new f.window.MouseEvent('click', { bubbles: true, cancelable: true, ...options }))
  f.doc.getElementById('menu').addEventListener('click', event => event.stopPropagation())
  click('menu')
  click('rename')
  click('group')
  click('title', { ctrlKey: true })
  f.doc.getElementById('title').addEventListener('click', event => event.preventDefault(), { once: true })
  click('title')
  assert.equal(f.closeCalls, 0)
  click('title')
  assert.equal(f.closeCalls, 1)
})

test('verified session state handles locale-independent navigation but not same-session intent', t => {
  const f = fixture(t)
  f.select('initial')
  assert.equal(f.closeCalls, 0)
  f.select('new-session')
  assert.equal(f.closeCalls, 1)
  f.show(page)
  f.select(undefined)
  assert.equal(f.closeCalls, 1, 'masked gaps do not count as navigation')
  f.select('new-session')
  assert.equal(f.closeCalls, 1, 'restoring the same selected session after a masked gap is not navigation')
  f.select('another-session')
  assert.equal(f.closeCalls, 2)
  f.removeSessions()
  f.tick()
  assert.equal(f.navigationListeners.size, 0)
})

test('an async failed render immediately restores chat and retry remains bounded', async t => {
  const f = fixture(t)
  f.readyCallbacks.center(false)
  assert.equal(f.doc.querySelector('article').style.visibility, 'visible')
  f.doc.querySelector('[data-dsh-better-workbench-center]').replaceChildren()
  await flush()
  assert.equal(f.renders.center, 1)
  f.tick()
  assert.equal(f.renders.center, 2)
  assert.equal(f.doc.querySelector('article').style.visibility, 'hidden')
})
