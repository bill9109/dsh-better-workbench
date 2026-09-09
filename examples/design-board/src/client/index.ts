import type { WorkbenchClientContext } from 'dsh-workbench/client'
import { DesignBoard, DesignBoardSidebar } from './DesignBoard.tsx'
import { DESIGN_BOARD_STYLE } from './styles.ts'
import { COMPONENT_GALLERY_STYLE } from './componentGalleryStyles.js'

export const inject = ['workbench']

/** Registers the reference DSH frontend design board with the workbench host. */
export function apply(ctx: WorkbenchClientContext): void {
  const workbench = ctx.workbench
  ctx.effect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-dsh-workbench-design-board-style', '')
    style.textContent = DESIGN_BOARD_STYLE + COMPONENT_GALLERY_STYLE
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'dsh-workbench-design-board: styles')

  ctx.effect(() => workbench.registerApp({
    protocolVersion: 1,
    appId: 'dsh-design-board',
    source: {
      packageName: 'dsh-workbench-design-board',
      version: '0.2.0',
      repository: 'https://github.com/omdsh-dev/dsh-workbench',
    },
    config: {
      version: 1,
      defaults: () => ({ section: 'primitives' }),
      validate(config) {
        if (typeof config.section !== 'string') throw new Error('Design board section must be a string')
      },
    },
    title: 'DSH UI 样式看板',
    description: '按基础系统与真实产品模块组织的 DSH Web 样式看板',
    allowMultiple: true,
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    defaultInstance: {
      instanceId: 'dsh-design-board-default',
      title: 'DSH UI 样式看板',
      config: { section: 'primitives' },
    },
    renderMain: DesignBoard,
    renderSecondary: DesignBoardSidebar,
  }), 'dsh-workbench-design-board: app registration')

  ctx.effect(() => workbench.registerTemplate({
    templateId: 'dsh-design-board:reference',
    title: 'DSH UI 样式看板',
    description: '创建一份从真实组件陈列开始的 DSH 设计参考实例',
    kind: 'instance',
    appId: 'dsh-design-board',
    defaultTitle: 'DSH UI 样式看板',
    defaultConfig: { section: 'primitives' },
  }), 'dsh-workbench-design-board: template registration')
}
