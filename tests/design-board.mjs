import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const root = new URL('../examples/design-board/src/client/', import.meta.url)
const boardText = await readFile(new URL('DesignBoard.tsx', root), 'utf8')
const board = ts.createSourceFile('DesignBoard.tsx', boardText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const declarations = board.statements.filter(ts.isVariableStatement).flatMap(statement => statement.declarationList.declarations)
const icons = declarations.find(declaration => declaration.name.getText(board) === 'ICON_GROUPS').initializer
const seen = new Set()
for (const group of icons.elements) {
  const items = group.properties.find(property => property.name?.getText(board) === 'icons').initializer
  for (const item of items.elements) {
    const fields = Object.fromEntries(item.properties.map(property => [property.name.getText(board), property.initializer]))
    const name = fields.name.text
    const size = Number(fields.size.text)
    assert.equal(seen.has(name), false, 'Duplicate icon: ' + name)
    seen.add(name)
    assert.equal(fields.icon.getText(board), name, 'Export must match rendered icon')
    const nativeHeight = Number(name.match(/(\d+)$/)?.[1])
    assert.equal(size, nativeHeight, name + ' must render at its native height')
  }
}
assert.equal(seen.size, 74)
assert.ok(boardText.includes('<IconGallery groups={ICON_GROUPS}'))
assert.ok(boardText.includes('<ComponentGallery />'))
assert.ok(!boardText.includes('function Primitives(') && !boardText.includes('function Icons('))
assert.ok(boardText.includes('aria-current={active === section.id'))
const gallery = await readFile(new URL('ComponentGallery.tsx', root), 'utf8')
const specimen = await readFile(new URL('GallerySpecimen.tsx', root), 'utf8')
const native = await readFile(new URL('NativeSpecimens.tsx', root), 'utf8')
const source = ts.createSourceFile('ComponentGallery.tsx', gallery, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const imported = source.statements.filter(ts.isImportDeclaration).filter(node => node.moduleSpecifier.text === '@deepseek-ai/dsh-client-ui-primitives').flatMap(node => node.importClause?.namedBindings?.elements?.map(element => element.name.text) ?? [])
for (const name of ['Button', 'Pill', 'Input', 'Menu', 'Modal', 'RiskConfirmation', 'Tooltip', 'HoverCard', 'StateDot', 'DisclosureRow', 'ConnectionIndicator', 'Toast', 'TerminalBlock', 'ReadBlock', 'DiffBlock', 'JsonTree', 'CodeBlock']) {
  assert.ok(imported.includes(name), name + ' must come from production primitives')
  assert.match(gallery + specimen, new RegExp('<' + name + '[ \n/>]'), name + ' must have a rendered specimen')
}
assert.ok(gallery.includes('import * as Primitives from'))
assert.ok(gallery.includes('}).AddButton') && gallery.includes('<AddButton '))
assert.ok(gallery.includes('宿主未提供'), 'old hosts must not silently substitute a clone')
assert.ok(gallery.includes("useState<Group>('actions')"), 'entry view must expose provider-add controls')
assert.ok(gallery.includes('按钮与入口') && gallery.includes('选择与实体'))
for (const name of ['CollectionAddButton', 'SelectableCard']) {
  assert.ok(native.includes('}).' + name), name + ' must resolve the host export')
  assert.ok(native.includes('<' + name + ' '), name + ' must be rendered')
  assert.ok(native.includes('宿主未提供 ' + name), 'missing host export must be explicit')
}
assert.ok(native.includes('ModelsSection') && native.includes('AgentPresetSection'))
assert.ok(!native.includes('WorkbenchHome'), 'third-party pages are not design sources')
console.log('Design board: native component families, real exports, source contracts and discovery verified.')
