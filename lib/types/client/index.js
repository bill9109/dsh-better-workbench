import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkbenchController } from "./service.js";
import { WorkbenchSidebar } from "./WorkbenchSidebar.js";
import { WorkbenchSurface } from "./WorkbenchSurface.js";
import { resolveActivePresentation } from "./presentation.js";
import { WORKBENCH_STYLE } from "./styles.js";
function asElement(value) {
    return value instanceof Element ? value : null;
}
function workbenchAnchor() {
    return document.querySelector('[data-slot="sidebar.workspaces"]') ?? undefined;
}
function conversationSlot(parent) {
    return parent.querySelector('[data-slot="conversation"]') ?? undefined;
}
function syncConversationPresentation(center, service) {
    const slot = conversationSlot(center.parent);
    if (slot === undefined)
        return;
    const snapshot = service.getSnapshot();
    const presentation = resolveActivePresentation(snapshot, service);
    const hidden = snapshot.route.kind === 'workbench-home' || presentation?.conversation === 'exclusive';
    const pushRight = presentation?.kind === 'panel' && presentation.behavior === 'push' && presentation.placement === 'right';
    const pushBottom = presentation?.kind === 'panel' && presentation.behavior === 'push' && presentation.placement === 'bottom';
    for (const child of [...slot.children]) {
        if (!(child instanceof HTMLElement))
            continue;
        if (!center.originals.has(child)) {
            center.originals.set(child, {
                visibility: child.style.visibility,
                pointerEvents: child.style.pointerEvents,
                marginRight: child.style.marginRight,
                marginBottom: child.style.marginBottom,
            });
        }
        const original = center.originals.get(child);
        child.style.visibility = hidden ? 'hidden' : original?.visibility ?? '';
        child.style.pointerEvents = hidden ? 'none' : original?.pointerEvents ?? '';
        child.style.marginRight = pushRight ? '360px' : original?.marginRight ?? '';
        child.style.marginBottom = pushBottom ? '280px' : original?.marginBottom ?? '';
    }
}
function restoreConversation(center) {
    for (const [element, original] of center.originals) {
        element.style.visibility = original.visibility;
        element.style.pointerEvents = original.pointerEvents;
        element.style.marginRight = original.marginRight;
        element.style.marginBottom = original.marginBottom;
    }
}
function insertSidebar(service) {
    const anchor = workbenchAnchor();
    if (!(anchor instanceof HTMLElement) || !(anchor.parentElement instanceof HTMLElement))
        return undefined;
    const parent = anchor.parentElement;
    const host = document.createElement('div');
    host.setAttribute('data-dsh-workbench-sidebar', '');
    parent.insertBefore(host, anchor);
    const root = createRoot(host);
    root.render(createElement(WorkbenchSidebar, { service }));
    return { host, root, parent, anchor };
}
function insertCenter(service) {
    const slot = document.querySelector('[data-slot="conversation"]');
    const parent = slot?.parentElement instanceof HTMLElement ? slot.parentElement : undefined;
    if (parent === undefined)
        return undefined;
    const previousPosition = parent.style.position;
    parent.style.position = 'relative';
    const host = document.createElement('div');
    host.setAttribute('data-dsh-workbench-center', '');
    parent.appendChild(host);
    const center = {
        host,
        root: createRoot(host),
        parent,
        previousPosition,
        originals: new Map(),
    };
    center.root.render(createElement(WorkbenchSurface, { service }));
    syncConversationPresentation(center, service);
    return center;
}
function disposeSidebar(surface) {
    surface.root.unmount();
    surface.host.remove();
}
function disposeCenter(surface) {
    restoreConversation(surface);
    surface.root.unmount();
    surface.host.remove();
    surface.parent.style.position = surface.previousPosition;
}
function createMount(service) {
    const sidebar = insertSidebar(service);
    const center = insertCenter(service);
    if (sidebar === undefined || center === undefined) {
        if (sidebar !== undefined)
            disposeSidebar(sidebar);
        if (center !== undefined)
            disposeCenter(center);
        return undefined;
    }
    const record = { sidebar, center };
    const clickHandler = (event) => {
        if (service.getSnapshot().route.kind === 'conversation')
            return;
        const target = asElement(event.target);
        if (target === null || target.closest('[data-dsh-workbench-sidebar]') !== null)
            return;
        const sessionRow = target.closest('[data-slot="sidebar.workspaces"] [role="treeitem"]');
        const startsSession = target.closest('[data-slot="sidebar"] button[aria-label="新建会话"]') !== null;
        if (sessionRow !== null && !sessionRow.hasAttribute('aria-expanded'))
            service.close();
        else if (startsSession)
            service.close();
    };
    document.addEventListener('click', clickHandler, true);
    record.clickHandler = clickHandler;
    record.observer = new MutationObserver(() => {
        if (!document.body.contains(record.sidebar.host)) {
            disposeSidebar(record.sidebar);
            const replacement = insertSidebar(service);
            if (replacement !== undefined)
                record.sidebar = replacement;
        }
        if (!document.body.contains(record.center.host)) {
            disposeCenter(record.center);
            const replacement = insertCenter(service);
            if (replacement !== undefined)
                record.center = replacement;
        }
        syncConversationPresentation(record.center, service);
    });
    record.observer.observe(document.body, { childList: true, subtree: true });
    return record;
}
function mount(service) {
    const style = document.createElement('style');
    style.setAttribute('data-dsh-workbench-style', '');
    style.textContent = WORKBENCH_STYLE;
    document.head.appendChild(style);
    let record = createMount(service);
    let active = true;
    const styleObserver = new MutationObserver(() => {
        if (active && !style.isConnected)
            document.head.appendChild(style);
    });
    styleObserver.observe(document.head, { childList: true });
    const unsubscribe = service.subscribe(() => {
        if (record !== undefined)
            syncConversationPresentation(record.center, service);
    });
    const retry = window.setInterval(() => {
        if (record !== undefined || !active)
            return;
        record = createMount(service);
    }, 250);
    return () => {
        if (!active)
            return;
        active = false;
        styleObserver.disconnect();
        window.clearInterval(retry);
        unsubscribe();
        if (record !== undefined) {
            record.observer.disconnect();
            document.removeEventListener('click', record.clickHandler, true);
            disposeSidebar(record.sidebar);
            disposeCenter(record.center);
        }
        style.remove();
    };
}
/** Mounts the base workbench service, launcher, and center surface. */
export function apply(ctx) {
    const service = new WorkbenchController();
    ctx.effect(() => ctx.reflect.provide('workbench', service), 'dsh-workbench: service');
    ctx.effect(() => mount(service), 'dsh-workbench: DOM surfaces');
}
