import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { WorkbenchController } from '../src/client/service.ts'
import { MemoryRepository } from '../src/client/storage.ts'
import { normalizeWebsiteUrl, websiteName, validateWebsiteConfig, validateWebsiteCreation, WEBSITE_APP_ID, WEBSITE_TEMPLATE_ID } from '../src/client/website.ts'

const definition = () => ({ protocolVersion: 1, appId: WEBSITE_APP_ID, title: '网页', allowMultiple: true,
  config: { version: 1, defaults: () => ({ url: '', openMode: 'embedded' }), validate: validateWebsiteConfig, validateCreation: validateWebsiteCreation },
  presentations: [{ kind: 'page', conversation: 'exclusive' }], defaultPresentation: 'page', renderMain: () => null })

test('creation dialog matches native settings corner geometry', async () => {
  const css = await readFile(new URL('../src/client/creation-styles.ts', import.meta.url), 'utf8')
  const dialog = css.match(/\.dsh-better-workbench-create-dialog\s*\{([^}]+)\}/)[1]
  assert.match(dialog, /border-radius: 32px;/)
  assert.match(dialog, /corner-shape: superellipse\(1\.5\);/)
})

test('template chooser retains its styling while decorative icons are centered', async () => {
  const css = await readFile(new URL('../src/client/creation-styles.ts', import.meta.url), 'utf8')
  const choice = css.match(/\.dsh-better-workbench-create-choice\s*\{([^}]+)\}/)[1]
  assert.match(choice, /min-height: 52px;/)
  assert.match(choice, /border-radius: 6px;/)
  const icon = css.match(/\.dsh-better-workbench-create-choice-icon\s*\{([^}]+)\}/)[1]
  assert.match(icon, /display: inline-flex;/)
  assert.match(icon, /align-items: center;/)
  assert.match(icon, /line-height: 0;/)
})

test('website URLs normalize HTTP(S), host:port, IDN and paths without credentials or loopback', () => {
  assert.equal(normalizeWebsiteUrl(' http://dshfind.com/ '), 'http://dshfind.com/')
  assert.equal(normalizeWebsiteUrl('example.com:8080/a?q=1#part'), 'https://example.com:8080/a?q=1#part')
  assert.equal(websiteName('https://www.example.com/a'), 'example.com')
  assert.equal(normalizeWebsiteUrl('https://例子.中国/'), 'https://xn--fsqu00a.xn--fiqs8s/')
  for (const value of ['', 'invalid', 'https://', 'javascript:alert(1)', 'data:text/html,hi', 'file:///etc/passwd', '//example.com', 'https://user:pass@example.com', 'https://exa mple.com', 'https://example.com/\nfoo', 'http://127.1', 'http://2130706433', 'http://[::1]', 'http://localhost:3080', 'http://localhost.:3080', 'http://x.localhost.:3080', 'http://[::ffff:127.0.0.1]:3080']) {
    assert.throws(() => normalizeWebsiteUrl(value), undefined, value)
  }
})

test('website creation commits name and URL together, survives remount and retains missing application state', async () => {
  const repository = new MemoryRepository()
  const controller = new WorkbenchController({ repository, navigationStorage: null })
  await controller.ready
  const remove = controller.registerApp(definition())
  controller.registerTemplate({ kind: 'instance', templateId: WEBSITE_TEMPLATE_ID, appId: WEBSITE_APP_ID, title: '从网页地址创建' })
  await assert.rejects(controller.startCreation(WEBSITE_TEMPLATE_ID), /网页地址/)
  assert.equal((await repository.read()).instances.length, 0)
  const config = { url: 'http://dshfind.com/', openMode: 'embedded' }
  const result = await controller.startCreation(WEBSITE_TEMPLATE_ID, { title: 'dshfind', config })
  config.url = 'https://changed.example/'
  const saved = (await repository.read()).instances[0]
  assert.equal(saved.title, 'dshfind')
  assert.equal(saved.config.url, 'http://dshfind.com/')
  assert.equal(saved.revision, 1, 'one atomic creation, not create then rename')
  await remove()
  assert.equal(controller.getSnapshot().instances[0].available, false)
  await controller.dispose()
  const restored = new WorkbenchController({ repository, navigationStorage: null })
  await restored.ready
  restored.registerApp(definition())
  assert.equal(restored.getSnapshot().instances[0].instanceId, result.instanceId)
  assert.equal(restored.getSnapshot().instances[0].available, true)
  await restored.dispose()
})

test('template overrides are owned before asynchronous creation and reject malformed inputs', async () => {
  const repository = new MemoryRepository()
  const controller = new WorkbenchController({ repository, navigationStorage: null })
  await controller.ready
  controller.registerApp(definition())
  controller.registerTemplate({ kind: 'instance', templateId: WEBSITE_TEMPLATE_ID, appId: WEBSITE_APP_ID, title: 'URL' })
  const config = { url: 'https://example.com/', openMode: 'embedded' }
  const request = controller.startCreation(WEBSITE_TEMPLATE_ID, { title: 'Example', config })
  config.url = 'javascript:bad'
  await request
  assert.equal((await repository.read()).instances[0].config.url, 'https://example.com/')
  await assert.rejects(controller.createInstance(WEBSITE_APP_ID, 'Bad', { url: 'javascript:bad', openMode: 'embedded' }))
  assert.equal((await repository.read()).instances.length, 1)
  await controller.dispose()
})

test('real favicon and webpage view preserve strict defaults and explicit external fallback', async t => {
  const require = createRequire(import.meta.url), React = require('react')
  const { JSDOM } = require('jsdom')
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost:3080/' })
  const saved = new Map()
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true })) {
    saved.set(key, Object.getOwnPropertyDescriptor(globalThis, key))
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true })
  }
  const { createRoot } = require('react-dom/client'), { act, Simulate } = require('react-dom/test-utils')
  const sources = new Map(), modules = new Map()
  for (const name of ['WebsiteIcon','WebsiteView','WebsiteSettings','WebsiteCreate','website']) sources.set(name, ts.transpileModule(await readFile(new URL('../src/client/'+name+(name === 'website' ? '.ts' : '.tsx'),import.meta.url),'utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText)
  const primitives = {
    Tooltip: ({children}) => children,
    Modal: ({open,children,footer}) => open ? React.createElement('section',null,children,footer) : null,
    Button: ({children,variant,size,icon,...props}) => React.createElement('button',props,icon,children),
    Input: ({icon,className,...props}) => React.createElement('span',{className},icon,React.createElement('input',props)),
    Switch: ({checked,onChange,label,disabled,title}) => React.createElement('button',{type:'button',role:'switch','aria-label':label,'aria-checked':checked,disabled,title,onClick:()=>onChange(!checked)}),
    Menu: ({open,anchor,items,onSelect}) => React.createElement(React.Fragment,null,anchor,open && React.createElement('div',{role:'menu'},items.map(item=>React.createElement('button',{key:item.id,role:'menuitem','data-value':item.id,onClick:()=>onSelect(item.id)},item.label)))),
  }
  function load(name) {
    if(modules.has(name))return modules.get(name)
    const exports={};modules.set(name,exports)
    vm.runInNewContext(sources.get(name),{exports,URL,console,Error,window:dom.window,setTimeout,clearTimeout,require(id){
      if(id==='@deepseek-ai/dsh-client-ui-primitives')return new Proxy(primitives,{get:(target,key)=>target[key]??(()=>React.createElement('svg',{'data-icon':key}))})
      if(id.startsWith('./'))return load(id.slice(2).replace(/\.tsx?$/,''))
      return require(id)
    }})
    return exports
  }
  const element=dom.window.document.getElementById('root'),root=createRoot(element)
  try {
    await t.test('creation offers explicit origin-bound trust before committing the instance', async () => {
      const Create = load('WebsiteCreate').WebsiteCreate
      let draft
      function CreateHarness() {
        const [config, setConfig] = React.useState({ url: '', openMode: 'embedded' })
        draft = config
        return React.createElement(Create, { config, disabled: false, onChange: setConfig })
      }
      await act(async () => root.render(React.createElement(CreateHarness)))
      const urlField = () => element.querySelector('input[aria-label="网页地址"]')
      const trust = () => element.querySelector('[role="switch"]')
      const isTrusted = () => trust()?.getAttribute('aria-checked') === 'true'
      const chooseMode = async mode => {
        await act(async () => element.querySelector('button[aria-label="打开方式"]').click())
        await act(async () => element.querySelector('[role="menuitem"][data-value="' + mode + '"]').click())
      }
      const changeUrl = async value => { await act(async () => Simulate.change(urlField(), { target: { value } })) }
      assert.equal(isTrusted(), false)
      assert.equal(trust().disabled, true)
      assert.match(element.querySelector('p').textContent, /字体、样式和交互异常/)
      assert.equal(trust().getAttribute('aria-label'), '信任此站点并启用兼容模式')
      assert.ok(urlField().previousSibling, 'favicon shares the native input instead of a separate preview row')
      await changeUrl('http://dshfind.com/')
      assert.equal(trust().disabled, false)
      assert.equal(isTrusted(), false)
      await act(async () => trust().click())
      assert.equal(draft.trustedOrigin, 'http://dshfind.com')
      await changeUrl('http://dshfind.com/zh')
      assert.equal(isTrusted(), true, 'same-origin path edits retain consent')
      const repository = new MemoryRepository()
      const controller = new WorkbenchController({ repository, navigationStorage: null })
      try {
        await controller.ready
        controller.registerApp(definition())
        assert.equal((await repository.read()).instances.length, 0, 'form editing does not persist')
        const created = await controller.createInstance(WEBSITE_APP_ID, 'dshfind', structuredClone(draft))
        assert.equal(created.config.trustedOrigin, 'http://dshfind.com')
        assert.equal(created.revision, 1, 'trust is part of the initial atomic creation')
      } finally { await controller.dispose(); repository.dispose() }
      await changeUrl('https://other.example/')
      assert.equal(isTrusted(), false, 'another origin never inherits trust')
      await act(async () => trust().click())
      await changeUrl('https://other.example:8443/')
      assert.equal(isTrusted(), false, 'another port also requires new consent')
      await act(async () => trust().click())
      await changeUrl('javascript:bad')
      assert.equal(trust().disabled, true)
      assert.equal(draft.trustedOrigin, '')
      await changeUrl('https://other.example/')
      await act(async () => trust().click())
      await chooseMode('external')
      assert.equal(draft.trustedOrigin, '', 'external mode clears unnecessary trust')
      assert.equal(trust(), null)
      await chooseMode('embedded')
      assert.equal(isTrusted(), false)
    })
    const Icon=load('WebsiteIcon').WebsiteIcon
    await act(async()=>root.render(React.createElement(Icon,{url:'http://dshfind.com/'})))
    const img=element.querySelector('img')
    assert.equal(img.src,'http://dshfind.com/favicon.ico')
    assert.ok(img.style.filter.includes('dsh-website-favicon'))
    await act(async()=>img.dispatchEvent(new dom.window.Event('error')))
    assert.equal(element.querySelector('img'),null)
    assert.ok(element.querySelector('[data-icon="IconGlobeOutline14"]'))
    const View=load('WebsiteView').WebsiteView
    const instance={instanceId:'web',title:'dshfind',revision:1,config:{url:'http://dshfind.com/',openMode:'embedded'}}
    const props={instance,openHome(){},close(){},updateConfig:async()=>{}}
    await act(async()=>root.render(React.createElement(View,props)))
    assert.equal(element.querySelector('iframe').getAttribute('src'),'http://dshfind.com/')
    assert.ok(!element.querySelector('iframe').getAttribute('sandbox').includes('allow-same-origin'))
    assert.equal(element.querySelector('header'), null, 'embedded webpage has no host toolbar')
    assert.equal(element.querySelector('button'), null, 'webpage controls live in the sidebar')
    assert.equal(element.querySelector('.dsh-better-workbench-website').children.length, 1, 'iframe is the whole webpage surface')
    await act(async()=>root.render(React.createElement(View,{...props,instance:{...instance,config:{...instance.config,trustedOrigin:'http://dshfind.com'}}})))
    assert.ok(element.querySelector('iframe').getAttribute('sandbox').includes('allow-same-origin'))
    await act(async()=>root.render(React.createElement(View,{...props,instance:{...instance,config:{...instance.config,url:'http://localhost:3080/',trustedOrigin:'http://localhost:3080'}}})))
    assert.equal(element.querySelector('iframe'),null)
    await act(async()=>root.render(React.createElement(View,{...props,instance:{...instance,config:{...instance.config,openMode:'external'}}})))
    assert.equal(element.querySelector('iframe'),null)

    await act(async()=>root.render(React.createElement(View,{...props,instance:{...instance,config:{...instance.config,openMode:'embedded',embedBlocked:true}}})))
    assert.ok(element.querySelector('a[rel="noopener noreferrer"]'), 'external fallback remains actionable')
    const Settings=load('WebsiteSettings').WebsiteSettings
    function SettingsHarness(settingsArgs){
      const [open,setOpen]=React.useState(false)
      return React.createElement(React.Fragment,null,React.createElement('button',{'aria-label':'网页设置',onClick:()=>setOpen(true)}),React.createElement(Settings,{...settingsArgs,open,onClose:()=>setOpen(false)}))
    }
    for (const scenario of [
      { name: 'origin and revision change', url: 'https://b.example/', revision: 2 },
      { name: 'origin change', url: 'https://b.example/', revision: 1 },
      { name: 'revision change', url: 'https://a.example/', revision: 2 },
    ]) {
      await t.test('trust settings reject stale consent after ' + scenario.name, async () => {
        const updates = []
        const original = { ...instance, revision: 1, config: { url: 'https://a.example/', openMode: 'embedded' } }
        const settingsProps = { ...props, key: scenario.name, instance: original,
          updateConfig: async (patch, revision) => { updates.push({ patch, revision }); return revision + 1 } }
        const button = label => [...element.querySelectorAll('button')].find(item => item.textContent === label)
        const openSettings = async () => {
          await act(async () => element.querySelector('button[aria-label="网页设置"]').click())
          await act(async () => element.querySelectorAll('input[type="checkbox"]')[1].click())
          assert.equal(element.querySelectorAll('input[type="checkbox"]')[1].checked, true)
        }
        await act(async () => root.render(React.createElement(SettingsHarness, settingsProps)))
        await openSettings()
        const changed = { ...original, revision: scenario.revision, config: { ...original.config, url: scenario.url } }
        await act(async () => root.render(React.createElement(SettingsHarness, { ...settingsProps, instance: changed })))
        await act(async () => button('保存').click())
        assert.equal(updates.length, 0, 'stale consent must not write either permissions or open mode')
        assert.match(element.querySelector('[role="alert"]').textContent, /网页配置已更新/)
        assert.equal(element.querySelector('iframe'), null, 'sidebar settings never render a webpage')

        await act(async () => button('取消').click())
        await openSettings()
        await act(async () => button('保存').click())
        assert.equal(updates.length, 1, 'reopening settings permits explicit consent to the current configuration')
        assert.equal(updates[0].patch.trustedOrigin, new URL(scenario.url).origin)
        assert.equal(updates[0].revision, scenario.revision)
        assert.equal(element.querySelector('input[type="checkbox"]'), null)
      })
    }
  } finally {
    await act(async()=>root.unmount());dom.window.close()
    for(const [key,descriptor] of saved){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key]}
  }
})
