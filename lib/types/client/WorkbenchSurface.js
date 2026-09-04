import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSyncExternalStore } from 'react';
import { Button } from '@deepseek-ai/dsh-client-ui-primitives';
import { WorkbenchHome } from "./WorkbenchHome.js";
import { resolveActivePresentation } from "./presentation.js";
function useWorkbenchSnapshot(service) {
    return useSyncExternalStore(listener => service.subscribe(listener), () => service.getSnapshot(), () => service.getSnapshot());
}
/** Compatibility surface; a future DSH center-page Slot can host this component unchanged. */
export function WorkbenchSurface({ service }) {
    const snapshot = useWorkbenchSnapshot(service);
    const route = snapshot.route;
    const open = route.kind !== 'conversation';
    const presentation = resolveActivePresentation(snapshot, service);
    if (route.kind === 'conversation') {
        return _jsx("div", { className: "dsh-workbench-center", "data-open": "false", "aria-hidden": "true" });
    }
    if (route.kind === 'workbench-home') {
        return (_jsx("div", { className: "dsh-workbench-center", "data-open": "true", "data-kind": "page", children: _jsx(WorkbenchHome, { service: service, snapshot: snapshot }) }));
    }
    const instance = snapshot.instances.find(item => item.instanceId === route.instanceId);
    const app = instance === undefined ? undefined : service.getApp(instance.appId);
    const effectivePresentation = presentation ?? { kind: 'page', conversation: 'exclusive' };
    const renderProps = instance === undefined ? undefined : {
        instance,
        presentation: effectivePresentation,
        updateConfig: patch => { service.updateInstanceConfig(instance.instanceId, patch); },
        close: () => { service.openConversation(); },
        openHome: () => { service.openHome(); },
        openConversation: () => { service.openConversation(); },
    };
    const unavailable = (_jsxs("div", { className: "dsh-workbench-unavailable", children: [_jsx("strong", { children: "\u5DE5\u4F5C\u53F0\u5E94\u7528\u6682\u4E0D\u53EF\u7528" }), _jsx("span", { children: instance === undefined ? '实例不存在' : `应用标识：${instance.appId}` }), _jsx(Button, { variant: "primary", size: "sm", onClick: () => { service.openHome(); }, children: "\u8FD4\u56DE\u9996\u9875" })] }));
    if (effectivePresentation.kind === 'panel') {
        const Panel = app?.renderPanel;
        return (_jsx("div", { className: "dsh-workbench-center", "data-open": open, "data-kind": "panel", "data-placement": effectivePresentation.placement, "data-behavior": effectivePresentation.behavior, children: _jsx("aside", { className: "dsh-workbench-panel", "aria-label": instance?.title ?? '工作台面板', children: Panel !== undefined && renderProps !== undefined ? _jsx(Panel, { ...renderProps }) : unavailable }) }));
    }
    if (effectivePresentation.kind === 'capsule') {
        const Capsule = app?.renderCapsule;
        return (_jsx("div", { className: "dsh-workbench-center", "data-open": open, "data-kind": "capsule", "data-placement": effectivePresentation.placement, children: _jsx("aside", { className: "dsh-workbench-capsule", "aria-label": instance?.title ?? '工作台胶囊', children: Capsule !== undefined && renderProps !== undefined ? _jsx(Capsule, { ...renderProps }) : unavailable }) }));
    }
    const Main = app?.renderMain;
    const Secondary = app?.renderSecondary;
    return (_jsx("div", { className: "dsh-workbench-center", "data-open": open, "data-kind": "page", children: _jsxs("div", { className: "dsh-workbench-center-body", children: [Secondary !== undefined && renderProps !== undefined && (_jsx("aside", { className: "dsh-workbench-center-secondary", children: _jsx(Secondary, { ...renderProps }) })), _jsx("main", { className: "dsh-workbench-center-main", children: Main !== undefined && renderProps !== undefined ? _jsx(Main, { ...renderProps }) : unavailable })] }) }));
}
