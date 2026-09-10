import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { WorkbenchController } from '../src/client/service.ts'
import { MemoryRepository } from '../src/client/storage.ts'

const require = createRequire(import.meta.url)
const sources = new Map()
for (const name of ['WorkbenchSurface', 'WorkbenchHome', 'WorkbenchSidebar', 'WorkbenchIcon', 'WorkbenchErrorBoundary', 'presentation']) {
  const extension = name === 'presentation' ? 'ts' : 'tsx'
  sources.set(name, ts.transpileModule(await readFile(new URL(`../src/client/${name}.${extension}`, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText)
}

// Temporary CommonJS modules and a deterministic hook runner avoid build artifacts or a browser server.
function createRuntime() {
  const host = { clientWidth: 900, clientHeight: 800 }
  const mountElement = { clientWidth: 0, clientHeight: 0, hasAttribute: () => true, parentElement: host }
  let current
  const realReact = require('react')
  const react = {
    ...realReact,
    useMemo(fn, dependencies) {
      const owner = current
      const index = owner.cursor++
      const previous = owner.slots[index]
      if (previous && dependencies.every((value, i) => Object.is(value, previous.dependencies[i]))) return previous.value
      const value = fn()
      owner.slots[index] = { dependencies, value }
      return value
    },
    useSyncExternalStore: (_, getSnapshot) => getSnapshot(),
    useRef(value) {
      const owner = current
      const index = owner.cursor++
      return owner.slots[index] ??= { current: value }
    },
    useState(value) {
      const owner = current
      const index = owner.cursor++
      if (!(index in owner.slots)) owner.slots[index] = value
      return [owner.slots[index], next => {
        if (!owner.active) owner.invalidWrites++
        owner.slots[index] = typeof next === 'function' ? next(owner.slots[index]) : next
      }]
    },
    useEffect(effect, dependencies) {
      const owner = current
      const index = owner.cursor++
      const previous = owner.slots[index]
      if (previous && dependencies?.every((value, i) => Object.is(value, previous.dependencies[i]))) return
      owner.effects.push(() => {
        previous?.cleanup?.()
        owner.slots[index] = { dependencies, cleanup: effect() }
      })
    },
  }
  const modules = new Map()
  function load(name) {
    if (modules.has(name)) return modules.get(name)
    const exports = {}
    modules.set(name, exports)
    vm.runInNewContext(sources.get(name), {
      exports, Error, console, URL, Blob, setTimeout, clearTimeout,
      document: { addEventListener() {}, removeEventListener() {} },
      ResizeObserver: class { observe() {} disconnect() {} },
      require(id) {
        if (id === 'react') return react
        if (id === '@deepseek-ai/dsh-client-ui-primitives') return new Proxy({}, { get: (_, key) => key })
        if (id.startsWith('./')) return load(id.slice(2).replace(/\.tsx?$/, ''))
        return require(id)
      },
    }, { filename: name })
    return exports
  }
  function mount(Component, props) {
    const owner = { slots: [], cursor: 0, effects: [], active: true, invalidWrites: 0 }
    return {
      render(nextProps = props) {
        props = nextProps
        current = owner
        owner.cursor = 0
        const tree = Component(props)
        if (tree?.ref && typeof tree.ref === 'object') tree.ref.current = { parentElement: mountElement }
        owner.effects.splice(0).forEach(effect => effect())
        return tree
      },
      unmount() {
        owner.slots.forEach(slot => slot?.cleanup?.())
        owner.active = false
      },
      get invalidWrites() { return owner.invalidWrites },
    }
  }
  return { load, mount, host }
}

function findAll(tree, predicate) {
  if (!tree || typeof tree !== 'object') return []
  if (Array.isArray(tree)) return tree.flatMap(child => findAll(child, predicate))
  return [...(predicate(tree) ? [tree] : []), ...findAll(tree.props?.children, predicate)]
}
const named = (tree, name) => findAll(tree, item => item.type?.name === name)[0]
const role = (tree, name) => findAll(tree, item => item.props?.role === name)
const tick = () => new Promise(setImmediate)
const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const runtime = createRuntime()
const Main = () => null
const page = { kind: 'page', conversation: 'exclusive' }
const panel = { kind: 'panel', placement: 'right', behavior: 'push', conversation: 'resident' }
const capsule = { kind: 'capsule', placement: 'floating', conversation: 'resident' }
const AppIcon = () => null
const app = { appId: 'board', title: 'Board', allowMultiple: false, presentations: [page, panel, capsule], defaultPresentation: 'page', renderIcon: AppIcon, renderMain: Main, renderPanel: Main, renderCapsule: Main }
const instance = { instanceId: 'one', appId: 'board', title: 'One', config: {}, status: 'ready', available: true, revision: 7, order: 0 }
const snapshot = { loading: false, error: null, creation: { status: 'idle' }, apps: [{ ...app, generation: 3 }], instances: [instance, { ...instance, instanceId: 'two', title: 'Two', order: 1 }], templates: [], route: { kind: 'workbench-instance', instanceId: 'one', presentation: 'page' } }
const calls = []
let write = deferred()
const service = {
  getSnapshot: () => snapshot, subscribe: () => () => {}, getApp: () => app,
  updateInstanceConfig: (...args) => { calls.push(['save', ...args]); return write.promise },
  open: (...args) => calls.push(['open', ...args]), openHome: (...args) => calls.push(['home', ...args]),
  openConversation: () => calls.push(['conversation']), close: () => calls.push(['close']),
  setDirty: (...args) => calls.push(['dirty', ...args]), prepareInstance: async () => {},
}
const surface = runtime.mount(runtime.load('WorkbenchSurface').WorkbenchSurface, { service })
let tree = surface.render()
const first = named(tree, 'InstanceFrame')
snapshot.route = { ...snapshot.route, instanceId: 'two' }
assert.notEqual(named(surface.render(), 'InstanceFrame').key, first.key, 'same-app instances need separate state')
snapshot.route = { ...snapshot.route, instanceId: 'one' }
snapshot.apps[0].generation++
assert.notEqual(named(surface.render(), 'InstanceFrame').key, first.key, 'replacement app needs a fresh state boundary')
snapshot.apps[0].generation = 3
const frame = runtime.mount(first.type, first.props)
tree = frame.render()
const renderer = findAll(tree, item => item.type === Main)[0]
const renderProps = renderer.props
const save = renderProps.updateConfig({ value: 1 })
assert.deepEqual(calls.at(-1), ['save', 'one', { value: 1 }, 7, 3])
assert.ok(role(frame.render(), 'status').some(item => item.props.children.includes('保存')))
const pendingSaveStatus = role(frame.render(), 'status').find(item => item.props.children.includes('保存'))
assert.equal(pendingSaveStatus.props.className, 'dsh-better-workbench-save-status', 'background saves must use an out-of-flow live region')
assert.equal(pendingSaveStatus.props['aria-live'], 'polite')
assert.equal(findAll(frame.render(), item => item.props.className === 'dsh-better-workbench-frame-status').length, 0, 'navigation saves must not insert a status band')
const frameStyles = await readFile(new URL('../src/client/styles.ts', import.meta.url), 'utf8')
assert.ok(frameStyles.includes('.dsh-better-workbench-save-status { position: absolute;'))
assert.ok(frameStyles.includes('scrollbar-gutter: stable;'))
write.reject(new Error('save rejected'))
await assert.rejects(save, /save rejected/)
assert.ok(role(frame.render(), 'alert').some(item => item.props.children === 'save rejected'))
renderProps.setDirty(true)
assert.deepEqual(calls.at(-1), ['dirty', 'one', true])
renderProps.reportError('app error')
assert.equal(role(frame.render(), 'alert')[0].props.children, 'app error')
renderProps.setPresentation('panel')
assert.deepEqual(calls.at(-1), ['open', 'one', 'panel'])
assert.equal(named(tree, 'SurfaceToolbar'), undefined, 'page instances must remain full-bleed')
const sourcedPage = runtime.mount(first.type, { ...first.props, app: { ...app, source: { packageName: 'example', version: '1' } } })
assert.equal(findAll(sourcedPage.render(), item => item.type === 'details').length, 0, 'source metadata must not add page chrome')
sourcedPage.unmount()
const panelFrame = runtime.mount(first.type, { ...first.props, presentation: panel })
const toolbarElement = named(panelFrame.render(), 'SurfaceToolbar')
const toolbar = runtime.mount(toolbarElement.type, toolbarElement.props).render()
const buttons = findAll(toolbar, item => item.type === 'button')
buttons.find(item => item.props['aria-label'] === '工作台首页').props.onClick()
assert.deepEqual(calls.at(-1), ['home'])
buttons.find(item => item.props['aria-label'] === '关闭工作台').props.onClick()
assert.deepEqual(calls.at(-1), ['close'])
assert.equal(buttons.filter(item => 'aria-pressed' in item.props).length, 3)
panelFrame.unmount()
const capsuleFrame = runtime.mount(first.type, { ...first.props, presentation: capsule })
assert.ok(named(capsuleFrame.render(), 'SurfaceToolbar'), 'floating capsules retain dismissal controls')
capsuleFrame.unmount()
const boundaryElement = named(tree, 'WorkbenchErrorBoundary')
const Boundary = boundaryElement.type
const boundary = new Boundary(boundaryElement.props)
boundary.state = Boundary.getDerivedStateFromError(new Error('render failed'))
assert.equal(boundary.render().props.role, 'alert')
findAll(boundary.render(), item => item.type === 'Button')[0].props.onClick()
assert.notEqual(named(frame.render(), 'WorkbenchErrorBoundary').key, boundaryElement.key, 'retry resets failed application tree')
const beforeStaleCall = calls.length
renderProps.setPresentation('capsule')
renderProps.setDirty(false)
await assert.rejects(renderProps.updateConfig({ stale: true }), /已失效/)
assert.equal(calls.length, beforeStaleCall, 'old render callbacks are invalid after retry')
write = deferred()
const lateSave = findAll(frame.render(), item => item.type === Main)[0].props.updateConfig({ late: true })
frame.unmount()
write.reject(new Error('late failure'))
await assert.rejects(lateSave, /late failure/)
assert.equal(frame.invalidWrites, 0)

const layout = runtime.load('presentation').resolvePresentationLayout
assert.equal(layout(panel, 600, 800).presentation.behavior, 'overlay')
assert.equal(layout(panel, 900, 800).rightInset, 360)
assert.equal(layout({ ...panel, placement: 'bottom' }, 900, 400).presentation.behavior, 'overlay')

snapshot.route = { ...snapshot.route, presentation: 'panel' }
const measured = surface.render()
assert.equal(measured.props.style['--workbench-panel-size'], '360px', 'zero-sized mount must use actual parent container')
assert.equal(measured.props['data-behavior'], 'push')
snapshot.route = { kind: 'workbench-home', creating: true }
assert.equal(named(surface.render(), 'SurfaceToolbar'), undefined, 'home must not gain a duplicate header')
snapshot.instances = []
let creation = deferred(), count = 0
service.createInstance = () => { count++; return creation.promise }
const home = runtime.mount(runtime.load('WorkbenchHome').WorkbenchHome, { service, snapshot })
const card = named(home.render(), 'AppCard')
card.props.onCreate(); card.props.onCreate()
assert.equal(count, 1)
assert.equal(named(home.render(), 'AppCard').props.disabled, true)
snapshot.instances = [instance]
creation.resolve(instance)
await tick()
assert.equal(named(home.render(), 'AppCard').props.existing, true)
named(home.render(), 'AppCard').props.onCreate()
assert.equal(count, 1)
home.unmount()
snapshot.templates = [{ templateId: 'agent', title: 'Agent', kind: 'agent', available: true }]
const oldCreation = deferred()
const newCreation = deferred()
let templateCalls = 0
service.startCreation = () => { snapshot.creation = { status: 'creating', templateId: 'agent' }; return ++templateCalls === 1 ? oldCreation.promise : newCreation.promise }
service.cancelCreation = () => { snapshot.creation = { status: 'cancelled' } }
const cancellable = runtime.mount(runtime.load('WorkbenchHome').WorkbenchHome, { service, snapshot })
named(cancellable.render(), 'TemplateCard').props.onCreate()
findAll(cancellable.render(), item => item.type === 'Button' && item.props.children === '取消等待')[0].props.onClick()
named(cancellable.render(), 'TemplateCard').props.onCreate()
assert.equal(templateCalls, 2, 'cancelled wait does not block a new request')
oldCreation.resolve({ sessionId: 'obsolete-session' })
await tick()
assert.equal(named(cancellable.render(), 'TemplateCard').props.disabled, true, 'late old result cannot clear new pending state')
snapshot.creation = { status: 'complete', result: { sessionId: 'new-session' } }
newCreation.resolve({ sessionId: 'new-session' })
await tick()
assert.ok(findAll(cancellable.render(), item => item.type === 'code' && item.props.children === 'new-session').length)
cancellable.unmount()
snapshot.templates = []
snapshot.creation = { status: 'idle' }
const failedFrame = runtime.mount(first.type, { ...first.props, presentation: panel, instance: { ...instance, status: 'migration-error', error: 'migration failed' } })
failedFrame.render()
await tick()
let retried = 0
service.retry = async () => { retried++ }
findAll(failedFrame.render(), item => item.type === 'Button' && item.props.children === '重试')[0].props.onClick()
await tick()
assert.equal(retried, 1, 'migration recovery must clear service preparation cache')
failedFrame.render()
await tick()
service.exportInstance = async () => { throw new Error('export failed') }
named(failedFrame.render(), 'SurfaceToolbar').props.onExport()
await tick()
assert.ok(role(failedFrame.render(), 'alert').some(item => item.props.children === 'export failed'))
failedFrame.unmount()

snapshot.instances.push({ ...instance, instanceId: 'two', title: 'Two', order: 1 })
let sorted
service.reorderInstances = async ids => { sorted = ids }
const sidebar = runtime.mount(runtime.load('WorkbenchSidebar').WorkbenchSidebar, { service })
tree = sidebar.render()
named(tree, 'WorkbenchRow').props.onMove(1)
await tick()
assert.equal(sorted.join(','), 'two,one')
tree = sidebar.render()
findAll(tree, item => item.type === 'input' && item.props.placeholder)[0].props.onChange({ target: { value: 'One' } })
const filtered = named(sidebar.render(), 'WorkbenchRow')
assert.equal(filtered.props.appIcon, AppIcon, 'sidebar resolves runtime icon through getApp')
const rowTree = runtime.mount(filtered.type, { ...filtered.props }).render()
const iconSlot = findAll(rowTree, item => item.props?.className === 'dsh-better-workbench-sidebar-app-icon')[0]
assert.ok(iconSlot, 'expanded rows always reserve the icon slot')
assert.equal(iconSlot.props.className, 'dsh-better-workbench-sidebar-app-icon')
assert.equal(filtered.props.draggable, false)
assert.equal(filtered.props.canMoveDown, false)
let opened = 0
const row = runtime.mount(filtered.type, { ...filtered.props, onOpen: () => { opened++ } }).render()
const parent = {}
row.props.onKeyDown({ target: {}, currentTarget: parent, key: 'Enter', preventDefault() {} })
assert.equal(opened, 0)
row.props.onKeyDown({ target: parent, currentTarget: parent, key: 'Enter', preventDefault() {} })
assert.equal(opened, 1)
sidebar.unmount()
surface.unmount()
// Exercise actual React reconciliation and error recovery, not only handler contracts.
const { JSDOM } = require('jsdom')
const React = require('react')
const { createRoot } = require('react-dom/client')
const { act } = require('react-dom/test-utils')
const dom = new JSDOM('<!doctype html><div id="root" data-dsh-better-workbench-center></div>', { url: 'http://localhost/' })
const savedGlobals = new Map()
for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true })) {
  savedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value })
}
const rootElement = dom.window.document.getElementById('root')
Object.defineProperty(rootElement.parentElement, 'clientWidth', { value: 900 })
Object.defineProperty(rootElement.parentElement, 'clientHeight', { value: 800 })
const primitives = {
  Button: ({ children, onClick, disabled }) => React.createElement('button', { onClick, disabled }, children),
  Tooltip: ({ children }) => children,
  Menu: () => null,
}
const actualModules = new Map()
function actualLoad(name) {
  if (actualModules.has(name)) return actualModules.get(name)
  const exports = {}
  actualModules.set(name, exports)
  vm.runInNewContext(sources.get(name), {
    exports, Error, console, URL, Blob, setTimeout, clearTimeout,
    document: dom.window.document,
    ResizeObserver: class { observe() {} disconnect() {} },
    require(id) {
      if (id === '@deepseek-ai/dsh-client-ui-primitives') return new Proxy(primitives, { get: (target, key) => target[key] ?? (() => null) })
      if (id.startsWith('./')) return actualLoad(id.slice(2).replace(/\.tsx?$/, ''))
      return require(id)
    },
  })
  return exports
}
let shouldThrow = false
let currentProps
function StatefulApp(props) {
  const [initialId] = React.useState(props.instance.instanceId)
  currentProps = props
  if (shouldThrow) throw new Error('intentional render crash')
  return React.createElement('output', null, initialId)
}
const actualApp = { ...app, renderMain: StatefulApp }
let actualSnapshot = { ...snapshot, instances: [instance, { ...instance, instanceId: 'two' }], route: { kind: 'workbench-instance', instanceId: 'one', presentation: 'page' } }
const actualService = { ...service, getSnapshot: () => actualSnapshot, getApp: () => actualApp, updateInstanceConfig: async () => {}, exportInstance: async () => ({ instance }) }
const actualSurface = actualLoad('WorkbenchSurface').WorkbenchSurface
const actualRoot = createRoot(rootElement)
const renderActual = async () => { await act(async () => { actualRoot.render(React.createElement(actualSurface, { service: actualService })) }) }
try {
  const actualIcon = actualLoad('WorkbenchIcon').WorkbenchAppIcon
  const GoodIcon = ({ size, className }) => React.createElement('svg', { width: size, height: size, className, focusable: 'false' })
  let brokenIconCalls = 0
  const BrokenIcon = () => { brokenIconCalls++; throw new Error('intentional icon crash') }
  const renderIcon = async renderer => {
    await act(async () => { actualRoot.render(React.createElement('div', null,
      React.createElement(actualIcon, { renderer, className: 'icon-slot' }),
      React.createElement('button', null, 'Still usable'))) })
  }
  await renderIcon(undefined)
  assert.equal(rootElement.querySelector('.icon-slot').getAttribute('aria-hidden'), 'true')
  assert.equal(rootElement.querySelector('.icon-slot').childElementCount, 0)
  await renderIcon(GoodIcon)
  assert.equal(rootElement.querySelector('svg').getAttribute('width'), '16')
  assert.equal(rootElement.querySelector('svg').getAttribute('height'), '16')
  const originalIconError = console.error
  console.error = () => {}
  try {
    await renderIcon(BrokenIcon)
    assert.equal(rootElement.querySelector('.icon-slot').childElementCount, 0)
    assert.equal(rootElement.querySelector('button').textContent, 'Still usable')
    const attempts = brokenIconCalls
    await renderIcon(BrokenIcon)
    assert.equal(brokenIconCalls, attempts, 'unrelated re-renders do not retry a broken icon')
  } finally { console.error = originalIconError }
  await renderIcon(GoodIcon)
  assert.ok(rootElement.querySelector('svg'), 'changing the contributed renderer recovers the icon')
  await renderActual()
  assert.equal(rootElement.querySelector('output').textContent, 'one')
  actualSnapshot = { ...actualSnapshot, route: { ...actualSnapshot.route, instanceId: 'two' } }
  await renderActual()
  assert.equal(rootElement.querySelector('output').textContent, 'two', 'actual React local state resets across same-app instances')
  const beforeCrash = currentProps
  shouldThrow = true
  const originalError = console.error
  console.error = () => {}
  try { await renderActual() } finally { console.error = originalError }
  assert.ok(rootElement.querySelector('[role="alert"]').textContent.includes('intentional render crash'))
  assert.equal(rootElement.querySelector('.dsh-better-workbench-frame-toolbar'), null, 'renderer failures must not reintroduce page chrome')
  assert.equal(rootElement.querySelector('button[aria-label="关闭工作台"]'), null)
  shouldThrow = false
  const retryButton = [...rootElement.querySelectorAll('button')].find(button => button.textContent === '重新加载视图')
  await act(async () => { retryButton.click() })
  assert.equal(rootElement.querySelector('output').textContent, 'two')
  await assert.rejects(beforeCrash.updateConfig({ obsolete: true }), /已失效/, 'retry rejects old render callbacks')
  const callCount = calls.length
  beforeCrash.openHome()
  assert.equal(calls.length, callCount)
  await act(async () => { currentProps.setDirty(true) })
  assert.deepEqual(calls.at(-1), ['dirty', 'two', true])
  // Exercise the real controller underneath the React host.
  const repository = new MemoryRepository()
  let prompts = 0
  const controller = new WorkbenchController({ repository, navigationStorage: null, confirmDiscard: () => { prompts++; return false } })
  await controller.ready
  controller.registerApp({ protocolVersion: 1, appId: 'editing', title: 'Editing', allowMultiple: true,
    config: { version: 1, defaults: () => ({ text: 'initial' }), validate() {} },
    presentations: [{ kind: 'page', conversation: 'exclusive' }], defaultPresentation: 'page', renderIcon: AppIcon, renderMain: StatefulApp })
  assert.equal('renderIcon' in controller.getSnapshot().apps[0], false, 'runtime icon is absent from snapshot')
  const editable = await controller.createInstance('editing')
  assert.equal('renderIcon' in (await repository.read()).instances[0], false, 'runtime icon is not persisted')
  controller.open(editable.instanceId)
  try {
    await act(async () => { actualRoot.render(React.createElement(actualSurface, { service: controller })) })
    await act(async () => { currentProps.setDirty(true) })
    const transaction = repository.transact.bind(repository)
    let release
    const gate = new Promise(resolve => { release = resolve })
    repository.transact = async update => { await gate; return transaction(update) }
    let saving
    await act(async () => { saving = currentProps.updateConfig({ text: 'first' }) })
    await act(async () => { currentProps.setDirty(true) })
    await act(async () => { release(); await saving })
    assert.deepEqual(controller.getSnapshot().dirtyInstanceIds, [editable.instanceId], 'older save cannot clear a newer draft')
    await act(async () => { currentProps.close() })
    assert.equal(prompts, 1)
    assert.equal(controller.getSnapshot().route.kind, 'workbench-instance')
    repository.transact = transaction
    await act(async () => {
      await repository.transact(state => { state.instances[0].config = { text: 'remote' }; state.instances[0].revision++ })
      await new Promise(resolve => setImmediate(resolve))
    })
    await act(async () => { await assert.rejects(currentProps.updateConfig({ text: 'stale draft' }), /conflict/) })
    assert.equal((await repository.read()).instances[0].config.text, 'remote')
    await act(async () => { currentProps.setDirty(false); currentProps.setDirty(true) })
    await act(async () => { await currentProps.updateConfig({ text: 'rebased draft' }) })
    assert.equal((await repository.read()).instances[0].config.text, 'rebased draft')
  } finally {
    await act(async () => { actualRoot.render(null) })
    controller.dispose()
    repository.dispose()
  }
} finally {
  await act(async () => { actualRoot.unmount() })
  dom.window.close()
  for (const [name, descriptor] of savedGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else delete globalThis[name]
  }
}
console.log('Workbench UI tests passed: actual React instance isolation and boundary retry; frame actions, async saves, layout, creation, sidebar sorting and keyboard isolation')
