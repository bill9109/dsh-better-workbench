import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Button, IconCloseFill14, IconEditOutline16, IconEllipsisOutline16, IconPersonalizationOutline16, IconProjectAddOutline16, IconSearchOutline16, IconTrashOutline16, Menu, Modal, Tooltip, } from '@deepseek-ai/dsh-client-ui-primitives';
function useWorkbenchSnapshot(service) {
    return useSyncExternalStore(listener => service.subscribe(listener), () => service.getSnapshot(), () => service.getSnapshot());
}
function normalize(value) {
    return value.trim().toLocaleLowerCase();
}
function requestSidebarExpand() {
    const button = [...document.querySelectorAll('button')].find(item => item.getAttribute('aria-label') === '展开侧边栏');
    if (button instanceof HTMLButtonElement)
        button.click();
}
function WorkbenchHomeIcon({ className }) {
    return (_jsxs("svg", { width: "16", height: "16", className: className, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: [_jsx("path", { d: "M1.5 7.25 8 1.75l6.5 5.5" }), _jsx("path", { d: "M2.75 6.5v8h10.5v-8" }), _jsx("path", { d: "M6 14.5V9.25h4v5.25" })] }));
}
function WorkbenchHomeRow({ active, onOpen }) {
    return (_jsxs("button", { type: "button", className: "dsh-workbench-sidebar-row dsh-workbench-sidebar-home", "data-active": active, onClick: onOpen, children: [_jsx(WorkbenchHomeIcon, { className: "dsh-workbench-sidebar-home-icon" }), _jsx("span", { className: "dsh-workbench-sidebar-row-label", children: "\u9996\u9875" })] }));
}
function ViewOptionsMenu({ orderBy, onOrderPick }) {
    const [open, setOpen] = useState(false);
    return (_jsx(Menu, { open: open, onClose: () => { setOpen(false); }, items: [
            { type: 'label', id: 'order-by', text: '排序方式' },
            { id: 'manual', label: '手动排序' },
            { id: 'updated', label: '最近使用' },
        ], selectedId: orderBy, onSelect: id => {
            if (id === 'manual' || id === 'updated')
                onOrderPick(id);
            setOpen(false);
        }, align: "end", dense: true, portal: true, anchor: (_jsx(Tooltip, { label: "\u89C6\u56FE\u9009\u9879", side: "bottom", delayMs: 500, children: _jsx("button", { type: "button", className: "dsh-workbench-sidebar-icon-button dsh-workbench-sidebar-wide-only", "aria-label": "\u89C6\u56FE\u9009\u9879", onClick: () => { setOpen(value => !value); }, children: _jsx(IconPersonalizationOutline16, {}) }) })) }));
}
function WorkbenchRow({ instance, compact, active, draggable, dropPosition, onOpen, onRename, onDelete, onDragStart, onDragOver, onDrop, onDragEnd, }) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (_jsxs("div", { className: "dsh-workbench-sidebar-row", "data-active": active, "data-menu-open": menuOpen, "data-drop-position": dropPosition ?? undefined, role: "button", tabIndex: compact ? -1 : 0, draggable: draggable, onClick: onOpen, onKeyDown: event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen();
            }
        }, onDragStart: onDragStart, onDragOver: onDragOver, onDrop: onDrop, onDragEnd: onDragEnd, children: [compact && _jsx(IconPersonalizationOutline16, { className: "dsh-workbench-sidebar-rail-icon" }), _jsx("span", { className: "dsh-workbench-sidebar-row-label", children: instance.title }), !compact && (_jsx("span", { className: "dsh-workbench-sidebar-row-actions", children: _jsx(Menu, { open: menuOpen, onClose: () => { setMenuOpen(false); }, items: [
                        { id: 'rename', label: '重命名', icon: _jsx(IconEditOutline16, {}) },
                        { id: 'delete', label: '删除', icon: _jsx(IconTrashOutline16, {}), danger: true },
                    ], onSelect: id => {
                        setMenuOpen(false);
                        if (id === 'rename')
                            onRename();
                        if (id === 'delete')
                            onDelete();
                    }, dense: true, portal: true, closeOnPointerLeave: true, anchor: (_jsx("button", { type: "button", className: "dsh-workbench-sidebar-row-action", "aria-label": `工作台“${instance.title}”的操作`, title: "\u66F4\u591A\u64CD\u4F5C", onClick: event => { event.stopPropagation(); setMenuOpen(value => !value); }, children: _jsx(IconEllipsisOutline16, {}) })) }) }))] }));
}
/** Launcher inserted above DSH's workspace/session browser. */
export function WorkbenchSidebar({ service }) {
    const snapshot = useWorkbenchSnapshot(service);
    const section = useRef(null);
    const searchRoot = useRef(null);
    const searchInput = useRef(null);
    const composingRef = useRef(false);
    const [compact, setCompact] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [query, setQuery] = useState('');
    const [orderBy, setOrderBy] = useState('manual');
    const [draggedId, setDraggedId] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [renameTarget, setRenameTarget] = useState(null);
    const [renameDraft, setRenameDraft] = useState('');
    const [renaming, setRenaming] = useState(false);
    const [renameError, setRenameError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const renameTrimmed = renameDraft.trim();
    const renameBlocked = renaming || renameTrimmed === '' || renameTarget === null;
    const normalizedQuery = normalize(query);
    useEffect(() => {
        const element = section.current;
        if (element === null)
            return;
        const update = () => { setCompact(element.clientWidth <= 170); };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => { observer.disconnect(); };
    }, []);
    useEffect(() => {
        if (!compact && searchExpanded)
            searchInput.current?.focus({ preventScroll: true });
    }, [compact, searchExpanded]);
    useEffect(() => {
        if (compact || !searchExpanded)
            return;
        const onClick = (event) => {
            if (!(event.target instanceof Node) || searchRoot.current?.contains(event.target) === true)
                return;
            searchInput.current?.blur();
            if (normalizedQuery === '')
                setSearchExpanded(false);
        };
        document.addEventListener('click', onClick);
        return () => { document.removeEventListener('click', onClick); };
    }, [compact, normalizedQuery, searchExpanded]);
    const instances = useMemo(() => {
        const filtered = snapshot.instances.filter(instance => normalizedQuery === '' || normalize(instance.title).includes(normalizedQuery));
        return [...filtered].sort((a, b) => orderBy === 'updated' ? b.updatedAt - a.updatedAt : a.order - b.order);
    }, [normalizedQuery, orderBy, snapshot.instances]);
    const handleDrop = (targetId, event) => {
        event.preventDefault();
        const sourceId = draggedId ?? event.dataTransfer.getData('text/plain');
        if (sourceId === '' || sourceId === targetId) {
            setDropTarget(null);
            return;
        }
        const target = instances.findIndex(instance => instance.instanceId === targetId);
        const source = instances.findIndex(instance => instance.instanceId === sourceId);
        if (target < 0 || source < 0)
            return;
        const position = event.clientY < event.currentTarget.getBoundingClientRect().top + event.currentTarget.getBoundingClientRect().height / 2 ? 'before' : 'after';
        const nextVisible = instances.map(instance => instance.instanceId).filter(id => id !== sourceId);
        const insertAt = nextVisible.indexOf(targetId) + (position === 'after' ? 1 : 0);
        nextVisible.splice(insertAt, 0, sourceId);
        const hidden = snapshot.instances.map(instance => instance.instanceId).filter(id => !nextVisible.includes(id));
        service.reorderInstances([...nextVisible, ...hidden]);
        setDraggedId(null);
        setDropTarget(null);
    };
    const closeRename = () => {
        if (renaming)
            return;
        setRenameTarget(null);
        setRenameError(null);
    };
    const confirmRename = () => {
        if (renameBlocked || renameTarget === null)
            return;
        setRenaming(true);
        setRenameError(null);
        try {
            service.renameInstance(renameTarget.instanceId, renameTrimmed);
            setRenaming(false);
            setRenameTarget(null);
        }
        catch (reason) {
            setRenaming(false);
            setRenameError(reason instanceof Error ? reason.message : String(reason));
        }
    };
    const requestRename = (instance) => {
        setRenameTarget({ instanceId: instance.instanceId, currentTitle: instance.title });
        setRenameDraft(instance.title);
        setRenameError(null);
    };
    const closeDelete = () => {
        if (deleting)
            return;
        setDeleteTarget(null);
        setDeleteError(null);
    };
    const confirmDelete = () => {
        if (deleting || deleteTarget === null)
            return;
        setDeleting(true);
        setDeleteError(null);
        try {
            service.deleteInstance(deleteTarget.instanceId);
            setDeleting(false);
            setDeleteTarget(null);
        }
        catch (reason) {
            setDeleting(false);
            setDeleteError(reason instanceof Error ? reason.message : String(reason));
        }
    };
    const requestDelete = (instance) => {
        setDeleteTarget({ instanceId: instance.instanceId, title: instance.title });
        setDeleteError(null);
    };
    const renameDialog = (_jsxs(Modal, { open: renameTarget !== null, onClose: closeRename, closeLabel: "\u5173\u95ED", title: "\u91CD\u547D\u540D\u5DE5\u4F5C\u53F0", footer: (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", disabled: renaming, onClick: closeRename, children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", disabled: renameBlocked, onClick: confirmRename, children: "\u91CD\u547D\u540D" })] })), children: [_jsx("input", { className: "dsh-workbench-rename-input", value: renameDraft, "aria-label": "\u5DE5\u4F5C\u53F0\u540D\u79F0", autoFocus: true, disabled: renaming, onFocus: event => { event.target.select(); }, onChange: event => { setRenameDraft(event.target.value); setRenameError(null); }, onCompositionStart: () => { composingRef.current = true; }, onCompositionEnd: () => { composingRef.current = false; }, onKeyDown: event => {
                    if (event.key === 'Enter' && !composingRef.current) {
                        event.preventDefault();
                        event.stopPropagation();
                        confirmRename();
                    }
                } }), renameError !== null && _jsx("div", { className: "dsh-workbench-rename-error", role: "alert", children: renameError })] }));
    const deleteDialog = (_jsx(Modal, { open: deleteTarget !== null, onClose: closeDelete, closeLabel: "\u5173\u95ED", title: "\u5220\u9664\u5DE5\u4F5C\u53F0\uFF1F", ...deleteTarget === null
            ? {}
            : { description: '删除“' + deleteTarget.title + '”？只移除工作台入口和配置，不会删除应用源码或项目文件。' }, footer: (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", disabled: deleting, onClick: closeDelete, children: "\u53D6\u6D88" }), _jsxs(Button, { variant: "outline", className: "dsh-workbench-delete-action", disabled: deleting, onClick: confirmDelete, children: [_jsx(IconTrashOutline16, { size: 16 }), "\u5220\u9664"] })] })), children: deleteError !== null && _jsx("div", { className: "dsh-workbench-delete-error", role: "alert", children: deleteError }) }));
    if (compact) {
        return (_jsxs("section", { ref: section, className: "dsh-workbench-sidebar-section", "aria-label": "\u5DE5\u4F5C\u53F0", "data-compact": "true", children: [renameDialog, deleteDialog] }));
    }
    return (_jsxs("section", { ref: section, className: "dsh-workbench-sidebar-section", "aria-label": "\u5DE5\u4F5C\u53F0", children: [_jsxs("div", { className: "dsh-workbench-sidebar-heading", children: [_jsx("span", { className: `dsh-workbench-sidebar-heading-label${searchExpanded && !compact ? ' is-hidden' : ''}`, children: "\u5DE5\u4F5C\u53F0" }), _jsx("div", { ref: searchRoot, className: `dsh-workbench-sidebar-search-slot${searchExpanded ? ' is-expanded' : ''}`, children: _jsxs("div", { className: "dsh-workbench-sidebar-search", children: [_jsx(Tooltip, { label: "\u641C\u7D22\u5DE5\u4F5C\u53F0", side: "bottom", delayMs: 500, disabled: searchExpanded, children: _jsx("button", { type: "button", className: "dsh-workbench-sidebar-search-button", "aria-label": "\u641C\u7D22\u5DE5\u4F5C\u53F0", "aria-expanded": searchExpanded, onClick: () => {
                                            setSearchExpanded(true);
                                            if (compact)
                                                requestSidebarExpand();
                                        }, children: _jsx(IconSearchOutline16, { size: searchExpanded ? 11 : 14 }) }) }), _jsx("input", { ref: searchInput, className: "dsh-workbench-sidebar-search-input", type: "text", placeholder: "\u641C\u7D22\u5DE5\u4F5C\u53F0\u2026", value: query, tabIndex: searchExpanded && !compact ? 0 : -1, onChange: event => { setQuery(event.target.value); }, onKeyDown: event => {
                                        if (event.key === 'Escape') {
                                            setQuery('');
                                            setSearchExpanded(false);
                                        }
                                    } }), searchExpanded && (_jsx("button", { type: "button", className: "dsh-workbench-sidebar-search-clear", "aria-label": "\u6E05\u9664\u641C\u7D22", onClick: event => {
                                        event.stopPropagation();
                                        setQuery('');
                                        setSearchExpanded(false);
                                    }, children: _jsx(IconCloseFill14, {}) }))] }) }), _jsxs("div", { className: `dsh-workbench-sidebar-heading-actions${searchExpanded && !compact ? ' is-hidden' : ''}`, children: [_jsx(ViewOptionsMenu, { orderBy: orderBy, onOrderPick: setOrderBy }), _jsx(Tooltip, { label: "\u521B\u5EFA\u5DE5\u4F5C\u53F0", side: "bottom", delayMs: 500, children: _jsx("button", { type: "button", className: "dsh-workbench-sidebar-icon-button dsh-workbench-sidebar-add", "aria-label": "\u521B\u5EFA\u5DE5\u4F5C\u53F0", onClick: () => {
                                        setSearchExpanded(false);
                                        service.openHome();
                                    }, children: _jsx(IconProjectAddOutline16, { size: 16 }) }) })] })] }), compact && (_jsx("div", { className: "dsh-workbench-sidebar-rail-search", children: _jsx(Tooltip, { label: "\u641C\u7D22\u5DE5\u4F5C\u53F0", side: "right", delayMs: 500, children: _jsx("button", { type: "button", className: "dsh-workbench-sidebar-search-button", "aria-label": "\u641C\u7D22\u5DE5\u4F5C\u53F0", "aria-expanded": searchExpanded, onClick: () => {
                            setSearchExpanded(true);
                            requestSidebarExpand();
                        }, children: _jsx(IconSearchOutline16, { size: 18 }) }) }) })), _jsxs("div", { className: "dsh-workbench-sidebar-list", "aria-label": "\u5DE5\u4F5C\u53F0\u5217\u8868", children: [_jsx(WorkbenchHomeRow, { active: snapshot.route.kind === 'workbench-home', onOpen: () => { service.openHome(); } }), instances.map(instance => (_jsx(WorkbenchRow, { instance: instance, compact: compact, active: snapshot.route.kind === 'workbench-instance' && snapshot.route.instanceId === instance.instanceId, draggable: orderBy === 'manual', dropPosition: dropTarget?.id === instance.instanceId ? dropTarget.position : null, onOpen: () => { service.open(instance.instanceId); }, onRename: () => { requestRename(instance); }, onDelete: () => { requestDelete(instance); }, onDragStart: event => {
                            setDraggedId(instance.instanceId);
                            event.dataTransfer.effectAllowed = 'move';
                            event.dataTransfer.setData('text/plain', instance.instanceId);
                        }, onDragOver: event => {
                            if (draggedId === null || draggedId === instance.instanceId)
                                return;
                            event.preventDefault();
                            const rect = event.currentTarget.getBoundingClientRect();
                            setDropTarget({ id: instance.instanceId, position: event.clientY < rect.top + rect.height / 2 ? 'before' : 'after' });
                        }, onDrop: event => { handleDrop(instance.instanceId, event); }, onDragEnd: () => { setDraggedId(null); setDropTarget(null); } }, instance.instanceId)))] }), instances.length === 0 && (_jsx("div", { className: "dsh-workbench-sidebar-empty", children: normalizedQuery === '' ? '从首页创建实例。' : '无匹配工作台' })), renameDialog, deleteDialog] }));
}
