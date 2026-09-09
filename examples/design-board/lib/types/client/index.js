import { DesignBoard, DesignBoardSidebar } from "./DesignBoard.js";
import { DESIGN_BOARD_STYLE } from "./styles.js";
export const inject = ['workbench'];
/** Registers the reference DSH frontend design board with the workbench host. */
export function apply(ctx) {
    const workbench = ctx.workbench;
    ctx.effect(() => {
        const style = document.createElement('style');
        style.setAttribute('data-dsh-better-workbench-design-board-style', '');
        style.textContent = DESIGN_BOARD_STYLE;
        document.head.appendChild(style);
        return () => { style.remove(); };
    }, 'dsh-better-workbench-design-board: styles');
    const legacyDefault = workbench.getSnapshot().instances.find(instance => instance.instanceId === 'dsh-design-board-default');
    if (legacyDefault?.title === 'DSH 设计看板')
        workbench.renameInstance(legacyDefault.instanceId, 'DSH UI 样式看板');
    ctx.effect(() => workbench.registerApp({
        protocolVersion: 1,
        appId: 'dsh-design-board',
        title: 'DSH UI 样式看板',
        description: '按基础系统与真实产品模块组织的 DSH Web 样式看板',
        allowMultiple: true,
        presentations: [{ kind: 'page', conversation: 'exclusive' }],
        defaultPresentation: 'page',
        defaultInstance: {
            instanceId: 'dsh-design-board-default',
            title: 'DSH UI 样式看板',
            config: { section: 'overview' },
        },
        renderMain: DesignBoard,
        renderSecondary: DesignBoardSidebar,
    }), 'dsh-better-workbench-design-board: app registration');
    ctx.effect(() => workbench.registerTemplate({
        templateId: 'dsh-design-board:reference',
        title: 'DSH UI 样式看板',
        description: '创建一份从系统总览开始的 DSH 设计规范参考实例',
        kind: 'instance',
        appId: 'dsh-design-board',
        defaultTitle: 'DSH UI 样式看板',
        defaultConfig: { section: 'overview' },
    }), 'dsh-better-workbench-design-board: template registration');
}
