import assert from 'node:assert/strict'
import { WorkbenchController } from '../lib/types/client/service.js'

class MemoryStorage {
  values = new Map()
  getItem(key) { return this.values.get(key) ?? null }
  setItem(key, value) { this.values.set(key, value) }
}

const Main = () => null
const Capsule = () => null
const appDefinition = {
  protocolVersion: 1,
  appId: 'test-board',
  title: 'Test board',
  allowMultiple: true,
  presentations: [
    { kind: 'page', conversation: 'exclusive' },
    { kind: 'capsule', placement: 'floating', conversation: 'resident' },
  ],
  defaultPresentation: 'page',
  defaultInstance: {
    instanceId: 'test-board-default',
    title: 'First board',
    config: { section: 'overview' },
  },
  renderMain: Main,
  renderCapsule: Capsule,
}

const storage = new MemoryStorage()
const service = new WorkbenchController(storage)
let notices = 0
const unsubscribe = service.subscribe(() => { notices += 1 })
const disposeApp = service.registerApp(appDefinition)
const disposeTemplate = service.registerTemplate({
  templateId: 'test-board:blank',
  title: 'Blank board',
  kind: 'instance',
  appId: 'test-board',
  defaultTitle: 'From template',
  defaultConfig: { section: 'template' },
})
const disposeAgentTemplate = service.registerTemplate({
  templateId: 'test-board:agent',
  title: 'Agent board',
  kind: 'agent',
  creatorId: 'test-agent-creator',
  brief: 'Create a test workbench application.',
})

assert.equal(service.getSnapshot().route.kind, 'conversation')
assert.equal(service.getSnapshot().apps.length, 1)
assert.equal(service.getSnapshot().instances.length, 1)
assert.equal(service.getSnapshot().instances[0].available, true)
assert.equal(service.getSnapshot().templates[0].available, true)
assert.equal(service.getSnapshot().templates[1].available, false)
service.openHome()
assert.deepEqual(service.getSnapshot().route, { kind: 'workbench-home' })
service.open('test-board-default', 'capsule')
assert.deepEqual(service.getSnapshot().route, {
  kind: 'workbench-instance',
  instanceId: 'test-board-default',
  presentation: 'capsule',
})
assert.equal(service.getSnapshot().currentInstanceId, 'test-board-default')
service.renameInstance('test-board-default', 'Renamed board')
service.updateInstanceConfig('test-board-default', { section: 'components' })
assert.equal(service.getSnapshot().instances[0].title, 'Renamed board')
assert.equal(service.getSnapshot().instances[0].config.section, 'components')
const second = service.startCreation('test-board:blank')
assert.ok(second)
assert.equal(second.title, 'From template')
assert.equal(second.config.section, 'template')
assert.equal(service.getSnapshot().instances.length, 2)
service.reorderInstances([second.instanceId, 'test-board-default'])
assert.equal(service.getSnapshot().instances[0].instanceId, second.instanceId)
assert.throws(() => service.open('test-board-default', 'panel'), /Unsupported workbench presentation/)
assert.throws(() => service.startCreation('test-board:agent'), /creator is unavailable/)
let createdBrief = null
const disposeCreator = service.registerCreator({
  creatorId: 'test-agent-creator',
  start(template) { createdBrief = template.brief },
})
assert.equal(service.getSnapshot().templates[1].available, true)
assert.equal(service.startCreation('test-board:agent'), undefined)
assert.equal(createdBrief, 'Create a test workbench application.')
disposeCreator()
assert.equal(service.getSnapshot().templates[1].available, false)
assert.throws(() => service.updateInstanceConfig('test-board-default', { invalid: () => null }), /JSON values only/)

disposeApp()
assert.equal(service.getSnapshot().apps.length, 0)
assert.equal(service.getSnapshot().instances[0].available, false)
assert.equal(service.getSnapshot().route.kind, 'workbench-instance')
const disposeReloadedApp = service.registerApp(appDefinition)
assert.equal(service.getSnapshot().apps.length, 1)
assert.equal(service.getSnapshot().instances.length, 2)
assert.equal(service.getSnapshot().instances[0].available, true)
disposeReloadedApp()
disposeTemplate()
disposeTemplate()
disposeAgentTemplate()
unsubscribe()
assert.ok(notices >= 12)

const restored = new WorkbenchController(storage)
assert.equal(restored.getSnapshot().instances.length, 2)
assert.deepEqual(restored.getSnapshot().route, {
  kind: 'workbench-instance',
  instanceId: 'test-board-default',
  presentation: 'capsule',
})
restored.openConversation()
assert.deepEqual(restored.getSnapshot().route, { kind: 'conversation' })
assert.equal(restored.getSnapshot().currentInstanceId, null)
assert.equal(restored.getSnapshot().instances.length, 2)

const legacyStorage = new MemoryStorage()
legacyStorage.setItem('dsh-workbench.instances.v1', JSON.stringify({
  version: 1,
  currentInstanceId: 'legacy-board',
  instances: [{
    instanceId: 'legacy-board',
    appId: 'legacy-app',
    title: 'Legacy board',
    config: { section: 'legacy' },
    order: 0,
    updatedAt: 1,
  }],
}))
const migrated = new WorkbenchController(legacyStorage)
assert.deepEqual(migrated.getSnapshot().route, {
  kind: 'workbench-instance',
  instanceId: 'legacy-board',
  presentation: 'page',
})
assert.equal(migrated.getSnapshot().instances[0].config.section, 'legacy')

assert.throws(() => service.registerApp({ ...appDefinition, appId: 'bad app id' }), /Invalid workbench appId/)
assert.throws(() => service.registerApp({ ...appDefinition, protocolVersion: 2 }), /Unsupported workbench protocol/)
assert.throws(() => service.registerApp({ ...appDefinition, presentations: [] }), /no presentations/)
console.log('workbench service lifecycle: ok')
