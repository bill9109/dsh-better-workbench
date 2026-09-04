import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Button, IconPlusOutline16, } from '@deepseek-ai/dsh-client-ui-primitives';
function WorkbenchCard({ badge, description, disabled = false, id, onOpen, title, footer, }) {
    return (_jsxs("article", { className: "dsh-workbench-home-card", "data-disabled": disabled, children: [_jsxs("button", { type: "button", className: "dsh-workbench-home-card-main", "aria-label": disabled ? `${title}：${badge}` : title, disabled: disabled, onClick: onOpen, children: [_jsxs("span", { className: "dsh-workbench-home-card-head", children: [_jsx("span", { className: "dsh-workbench-home-card-name", children: title }), _jsx("span", { className: "dsh-workbench-home-card-badge", children: badge })] }), _jsx("span", { className: "dsh-workbench-home-card-description", children: description }), _jsx("code", { className: "dsh-workbench-home-card-id", children: id })] }), _jsx("div", { className: "dsh-workbench-home-card-foot", children: _jsx("span", { children: footer }) })] }));
}
function AppCard({ app, onCreate }) {
    return (_jsx(WorkbenchCard, { badge: "\u5E94\u7528", description: app.description ?? '从默认配置创建新的工作台实例', id: app.appId, onOpen: onCreate, title: app.title, footer: "\u521B\u5EFA\u5B9E\u4F8B" }));
}
function TemplateCard({ template, onCreate }) {
    const unavailableReason = template.kind === 'agent' ? '需要 Agent Creator' : '对应应用暂不可用';
    return (_jsx(WorkbenchCard, { badge: template.available ? '模板' : unavailableReason, description: template.description ?? '从预设配置创建新的工作台实例', disabled: !template.available, id: template.templateId, onOpen: onCreate, title: template.title, footer: "\u4F7F\u7528\u6A21\u677F" }));
}
function InstanceCard({ appTitle, available, instanceId, title, onOpen, }) {
    return (_jsx(WorkbenchCard, { badge: available ? '可用' : '不可用', description: available ? appTitle : `应用暂不可用 · ${appTitle}`, id: instanceId, onOpen: onOpen, title: title, footer: available ? '打开工作台' : '查看状态' }));
}
/** Built-in hub page that remains available without third-party applications. */
export function WorkbenchHome({ service, snapshot }) {
    const [creating, setCreating] = useState(false);
    const availableInstances = useMemo(() => snapshot.instances.filter(instance => instance.available), [snapshot.instances]);
    const unavailableInstances = useMemo(() => snapshot.instances.filter(instance => !instance.available), [snapshot.instances]);
    const templatedAppIds = useMemo(() => new Set(snapshot.templates.flatMap(template => template.kind === 'instance' ? [template.appId] : [])), [snapshot.templates]);
    const appsWithoutTemplates = useMemo(() => snapshot.apps.filter(app => !templatedAppIds.has(app.appId)), [snapshot.apps, templatedAppIds]);
    const createApp = (app) => {
        const instance = service.createInstance(app.appId);
        service.open(instance.instanceId, app.defaultPresentation);
    };
    const createTemplate = (template) => {
        const instance = service.startCreation(template.templateId);
        if (instance === undefined)
            return;
        const app = snapshot.apps.find(item => item.appId === instance.appId);
        service.open(instance.instanceId, app?.defaultPresentation);
    };
    return (_jsxs("main", { className: "dsh-workbench-home", children: [_jsxs("header", { className: "dsh-workbench-home-header", children: [_jsxs("div", { children: [_jsx("span", { children: "Workbench" }), _jsx("h1", { children: "\u5DE5\u4F5C\u53F0" })] }), _jsx("div", { className: "dsh-workbench-home-actions", children: _jsxs("button", { type: "button", className: "dsh-workbench-home-add-button", "aria-expanded": creating, onClick: () => { setCreating(value => !value); }, children: [_jsx(IconPlusOutline16, { size: 14 }), _jsx("span", { children: "\u521B\u5EFA\u5DE5\u4F5C\u53F0" })] }) })] }), creating && (_jsxs("section", { className: "dsh-workbench-home-section", "aria-label": "\u521B\u5EFA\u5DE5\u4F5C\u53F0", children: [_jsxs("div", { className: "dsh-workbench-home-section-heading", children: [_jsx("h2", { children: "\u521B\u5EFA\u5DE5\u4F5C\u53F0" }), _jsx("span", { children: "\u4ECE\u5DF2\u5B89\u88C5\u5E94\u7528\u6216\u6A21\u677F\u5F00\u59CB" })] }), snapshot.templates.length > 0 && (_jsx("div", { className: "dsh-workbench-home-grid", children: snapshot.templates.map(template => (_jsx(TemplateCard, { template: template, onCreate: () => { createTemplate(template); } }, template.templateId))) })), appsWithoutTemplates.length > 0 ? (_jsx("div", { className: "dsh-workbench-home-grid", children: appsWithoutTemplates.map(app => _jsx(AppCard, { app: app, onCreate: () => { createApp(app); } }, app.appId)) })) : snapshot.templates.length === 0 ? (_jsxs("div", { className: "dsh-workbench-home-empty", children: [_jsx("strong", { children: "\u6682\u65E0\u53EF\u7528\u7684\u5DE5\u4F5C\u53F0\u5E94\u7528" }), _jsx("span", { children: "\u5B89\u88C5\u5DE5\u4F5C\u53F0\u5E94\u7528\u540E\uFF0C\u53EF\u5728\u8FD9\u91CC\u521B\u5EFA\u5B9E\u4F8B\u3002" })] })) : null] })), _jsxs("section", { className: "dsh-workbench-home-section", "aria-label": "\u5DF2\u6709\u5DE5\u4F5C\u53F0", children: [_jsxs("div", { className: "dsh-workbench-home-section-heading", children: [_jsx("h2", { children: "\u5DF2\u6709\u5DE5\u4F5C\u53F0" }), _jsxs("span", { children: [snapshot.instances.length, " \u4E2A\u5B9E\u4F8B"] })] }), snapshot.instances.length === 0 ? (_jsxs("div", { className: "dsh-workbench-home-empty", children: [_jsx("strong", { children: "\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u53F0" }), _jsx("span", { children: "\u4ECE\u5DF2\u5B89\u88C5\u5E94\u7528\u6216\u6A21\u677F\u521B\u5EFA\u7B2C\u4E00\u4E2A\u5B9E\u4F8B\u3002" }), _jsx(Button, { variant: "outline", size: "sm", icon: _jsx(IconPlusOutline16, {}), onClick: () => { setCreating(true); }, children: "\u521B\u5EFA\u7B2C\u4E00\u4E2A\u5DE5\u4F5C\u53F0" })] })) : (_jsxs("div", { className: "dsh-workbench-home-grid dsh-workbench-home-instance-grid", children: [availableInstances.map(instance => (_jsx(InstanceCard, { instanceId: instance.instanceId, title: instance.title, available: true, appTitle: snapshot.apps.find(app => app.appId === instance.appId)?.title ?? instance.appId, onOpen: () => { service.open(instance.instanceId); } }, instance.instanceId))), unavailableInstances.map(instance => (_jsx(InstanceCard, { instanceId: instance.instanceId, title: instance.title, available: false, appTitle: instance.appId, onOpen: () => { service.open(instance.instanceId); } }, instance.instanceId)))] }))] })] }));
}
