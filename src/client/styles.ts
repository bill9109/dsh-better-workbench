export const WORKBENCH_STYLE = `
[data-dsh-workbench-sidebar] {
  flex: none;
  width: 100%;
  min-height: 0;
  container-type: inline-size;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-s-14);
}
[data-dsh-workbench-sidebar] *, [data-dsh-workbench-center] * { box-sizing: border-box; }
.dsh-workbench-sidebar-section {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding-right: var(--dsh-sidebar-inline-padding);
}
.dsh-workbench-sidebar-heading {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  height: 36px;
  padding-left: 4px;
  margin: 2px -4px 4px 0;
  border-radius: 12px;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-s-14);
  font-weight: 400;
  line-height: 20px;
}
.dsh-workbench-sidebar-heading-label {
  flex: none;
  max-width: 45%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  line-height: 20px;
  opacity: 1;
  visibility: visible;
  transition: max-width 180ms var(--ds-ease-in-out), margin-right 180ms var(--ds-ease-in-out), opacity 120ms var(--ds-ease-in-out), transform 180ms var(--ds-ease-in-out), visibility 0s linear;
}
.dsh-workbench-sidebar-heading-label.is-hidden {
  max-width: 0;
  margin-right: -4px;
  opacity: 0;
  transform: translateX(-4px);
  visibility: hidden;
  transition-delay: 0s, 0s, 0s, 180ms;
}
.dsh-workbench-sidebar-icon-button,
.dsh-workbench-sidebar-search-button,
.dsh-workbench-sidebar-row-action {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}
.dsh-workbench-sidebar-icon-button,
.dsh-workbench-sidebar-search-button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.dsh-workbench-sidebar-icon-button:hover,
.dsh-workbench-sidebar-search-button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-workbench-sidebar-search-slot {
  flex: 1;
  max-width: 28px;
  min-width: 0;
  display: flex;
  align-items: center;
  margin-left: auto;
  transition: max-width 180ms var(--ds-ease-in-out), padding-left 180ms var(--ds-ease-in-out);
}
.dsh-workbench-sidebar-search-slot.is-expanded {
  max-width: 100%;
  padding-left: 0;
}
.dsh-workbench-sidebar-search {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  height: 28px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  cursor: text;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  transition: width 180ms var(--ds-ease-in-out), padding 180ms var(--ds-ease-in-out), border-color 180ms var(--ds-ease-in-out), background-color 180ms var(--ds-ease-in-out);
}
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search {
  width: calc(100% + 4px);
  height: 30px;
  margin-inline: -2px;
  padding: 0 4px 0 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: transparent;
  color: var(--dsw-alias-label-caption);
}
.dsh-workbench-sidebar-search-button { color: inherit; }
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search-button { width: 28px; height: 30px; }
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search-button:hover { background: transparent; }
.dsh-workbench-sidebar-search-input {
  flex: 1;
  width: 0;
  min-width: 0;
  border: none;
  outline: none;
  opacity: 0;
  pointer-events: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  transition: opacity 120ms var(--ds-ease-in-out);
}
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search-input {
  margin-left: -2px;
  opacity: 1;
  pointer-events: auto;
}
.dsh-workbench-sidebar-search-input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-workbench-sidebar-search-clear {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}
.dsh-workbench-sidebar-search-clear:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-workbench-sidebar-heading-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 60px;
  margin-right: 4px;
  opacity: 1;
  overflow: hidden;
  visibility: visible;
  transition: max-width 180ms var(--ds-ease-in-out), opacity 120ms var(--ds-ease-in-out), transform 180ms var(--ds-ease-in-out), visibility 0s linear;
}
.dsh-workbench-sidebar-heading-actions.is-hidden {
  max-width: 0;
  opacity: 0;
  transform: translateX(4px);
  visibility: hidden;
  pointer-events: none;
  transition-delay: 0s, 0s, 0s, 180ms;
}
.dsh-workbench-sidebar-rail-search { display: none; }
.dsh-workbench-sidebar-list {
  display: grid;
  gap: 2px;
  min-height: 0;
}
.dsh-workbench-sidebar-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  height: 32px;
  border-radius: 8px;
  padding: 0 8px;
  cursor: pointer;
  user-select: none;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  text-align: left;
  font: var(--dsw-font-s-14);
  line-height: 20px;
}
.dsh-workbench-sidebar-row:hover,
.dsh-workbench-sidebar-row[data-active="true"],
.dsh-workbench-sidebar-row[data-menu-open="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-workbench-sidebar-row[data-drop-position="before"]::before,
.dsh-workbench-sidebar-row[data-drop-position="after"]::after {
  content: '';
  position: absolute;
  left: 0;
  right: 4px;
  height: 2px;
  background: var(--dsw-alias-state-business-primary);
  pointer-events: none;
}
.dsh-workbench-sidebar-row[data-drop-position="before"]::before { top: -1px; }
.dsh-workbench-sidebar-row[data-drop-position="after"]::after { bottom: -1px; }
.dsh-workbench-sidebar-home {
  width: 100%;
  border: 0;
}
.dsh-workbench-sidebar-home-icon {
  flex: none;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-workbench-sidebar-row-label {
  flex: 1;
  min-width: 0;
  margin: 0 6px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: var(--dsw-font-s-14);
  font-weight: 400;
  line-height: 20px;
}
.dsh-workbench-sidebar-row-actions {
  flex: none;
  display: none;
  align-items: center;
  gap: 12px;
  height: 20px;
}
.dsh-workbench-sidebar-row:focus-within .dsh-workbench-sidebar-row-actions,
.dsh-workbench-sidebar-row:hover .dsh-workbench-sidebar-row-actions,
.dsh-workbench-sidebar-row[data-menu-open="true"] .dsh-workbench-sidebar-row-actions { display: inline-flex; }
.dsh-workbench-sidebar-row-action {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-workbench-sidebar-row-action:hover { color: var(--dsw-alias-label-primary); }
.dsh-workbench-rename-input {
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 7px 14px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 22px;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-s-14);
  line-height: 22px;
}
.dsh-workbench-rename-input:disabled { color: var(--dsw-alias-label-dimmed); }
.dsh-workbench-rename-error {
  margin-top: 8px;
  color: var(--dsw-alias-state-error-primary);
  font: var(--dsw-font-xs-13);
  line-height: 18px;
}
.dsh-workbench-delete-action:not(:disabled) { color: var(--dsw-alias-state-error-primary); }
.dsh-workbench-delete-error {
  margin-top: 8px;
  color: var(--dsw-alias-state-error-primary);
  font: var(--dsw-font-xs-13);
  line-height: 18px;
}
.dsh-workbench-sidebar-empty {
  padding: 10px 12px;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xs-13);
}
.dsh-workbench-center {
  position: absolute;
  inset: 0;
  z-index: 10;
  isolation: isolate;
  display: flex;
  container-type: inline-size;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-base);
}
.dsh-workbench-center[data-open="false"] { display: none; }
.dsh-workbench-frame {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.dsh-workbench-frame-toolbar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}
.dsh-workbench-frame-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font: var(--dsw-font-xs-13);
}
.dsh-workbench-frame-modes { display: flex; flex: none; gap: 2px; }
.dsh-workbench-frame-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 4px;
  padding: 0;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  cursor: pointer;
}
.dsh-workbench-frame-button:hover,
.dsh-workbench-frame-button[aria-pressed="true"] { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-workbench-frame-button:focus-visible,
.dsh-workbench-sidebar-row:focus-visible,
.dsh-workbench-sidebar-row-action:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: -2px;
}
.dsh-workbench-frame-status,
.dsh-workbench-frame-error {
  flex: none;
  padding: 6px 12px;
  font: var(--dsw-font-xs-13);
  overflow-wrap: anywhere;
}
.dsh-workbench-frame-source { flex: none; padding: 6px 12px; font: var(--dsw-font-xs-13); overflow-wrap: anywhere; }
.dsh-workbench-frame-source summary { cursor: pointer; color: var(--dsw-alias-label-tertiary); }
.dsh-workbench-frame-source span, .dsh-workbench-frame-source a { display: block; margin-top: 4px; }
.dsh-workbench-frame-status { color: var(--dsw-alias-label-secondary); }
/* Background config writes must not resize or cover the application surface. */
.dsh-workbench-save-status { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.dsh-workbench-frame-error { color: var(--dsw-alias-state-error-primary); }
.dsh-workbench-frame > .dsh-workbench-home { flex: 1; min-height: 0; }
.dsh-workbench-capsule > .dsh-workbench-frame { max-height: inherit; }
.dsh-workbench-home-add-button:disabled,
.dsh-workbench-sidebar-icon-button:disabled,
.dsh-workbench-sidebar-row-action:disabled { cursor: default; opacity: .5; }
@media (hover: none), (pointer: coarse) {
  .dsh-workbench-sidebar-row-actions { display: inline-flex; }
  .dsh-workbench-sidebar-row-action { width: 28px; height: 28px; }
}

.dsh-workbench-center-body {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-workbench-center-secondary {
  flex: none;
  width: 224px;
  min-height: 0;
  overflow: auto;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-specific-sidebar-fill);
}
.dsh-workbench-center-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
/* Keep both Workbench scroll surfaces usable without permanent visual rails. */
.dsh-workbench-center-secondary,
.dsh-workbench-center-main { scrollbar-width: thin; scrollbar-gutter: stable; scrollbar-color: transparent transparent; }
.dsh-workbench-center-secondary::-webkit-scrollbar,
.dsh-workbench-center-main::-webkit-scrollbar { width: 6px; height: 6px; }
.dsh-workbench-center-secondary::-webkit-scrollbar-thumb,
.dsh-workbench-center-main::-webkit-scrollbar-thumb { background: transparent; }
.dsh-workbench-center-secondary:hover,
.dsh-workbench-center-secondary:focus-within,
.dsh-workbench-center-main:hover,
.dsh-workbench-center-main:focus-within { scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l3) transparent; }
.dsh-workbench-center-secondary:hover::-webkit-scrollbar,
.dsh-workbench-center-secondary:focus-within::-webkit-scrollbar,
.dsh-workbench-center-main:hover::-webkit-scrollbar,
.dsh-workbench-center-main:focus-within::-webkit-scrollbar { width: 6px; height: 6px; }
.dsh-workbench-center-secondary:hover::-webkit-scrollbar-thumb,
.dsh-workbench-center-secondary:focus-within::-webkit-scrollbar-thumb,
.dsh-workbench-center-main:hover::-webkit-scrollbar-thumb,
.dsh-workbench-center-main:focus-within::-webkit-scrollbar-thumb { border-radius: 6px; background: var(--dsw-alias-border-l3); }
.dsh-workbench-center-secondary::-webkit-scrollbar-track,
.dsh-workbench-center-main::-webkit-scrollbar-track { background: transparent; }
.dsh-workbench-unavailable {
  display: grid;
  justify-items: center;
  gap: 8px;
  max-width: 430px;
  margin: auto;
  padding: 28px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
}
.dsh-workbench-unavailable strong { color: var(--dsw-alias-label-primary); }
.dsh-workbench-unavailable > button { margin-top: 8px; }
.dsh-workbench-home {
  width: 100%;
  min-height: 100%;
  overflow: auto;
  padding: 40px clamp(24px, 6cqw, 72px) 64px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-base);
}
.dsh-workbench-home-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  max-width: 1040px;
  margin: 0 auto 36px;
}
.dsh-workbench-home-header > div:first-child { min-width: 0; }
.dsh-workbench-home-header span:first-child {
  display: block;
  margin-bottom: 4px;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xs-13);
}
.dsh-workbench-home-header h1 {
  margin: 0;
  font-size: 28px;
  line-height: 36px;
  font-weight: 650;
  letter-spacing: 0;
}
.dsh-workbench-home-actions { flex: none; display: flex; align-items: center; }
.dsh-workbench-home-add-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  border: 1px dashed var(--dsw-alias-border-l3);
  border-radius: 12px;
  padding: 0 14px;
  cursor: pointer;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  font: var(--dsw-font-s-14);
}
.dsh-workbench-home-add-button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-workbench-home-add-button:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}
.dsh-workbench-home-add-button[aria-expanded="true"] { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-workbench-home-section {
  max-width: 1040px;
  margin: 0 auto 36px;
}
.dsh-workbench-home-section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.dsh-workbench-home-section-heading h2 {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 0;
}
.dsh-workbench-home-section-heading span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-workbench-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
}
.dsh-workbench-home-grid + .dsh-workbench-home-grid { margin-top: 12px; }
.dsh-workbench-home-card {
  display: flex;
  min-width: 0;
  min-height: 184px;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  overflow: hidden;
  background: var(--dsw-alias-bg-layer-3);
  transition: border-color .16s, background .16s;
}
.dsh-workbench-home-card:hover:not([data-disabled="true"]) {
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh-workbench-home-card[data-disabled="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-workbench-home-card-main {
  flex: 1;
  appearance: none;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  border: 0;
  border-radius: 12px 12px 0 0;
  padding: 14px 16px 12px;
  color: inherit;
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.dsh-workbench-home-card-main:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.dsh-workbench-home-card-main:disabled { cursor: default; }
.dsh-workbench-home-card-main:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}
.dsh-workbench-home-card-head {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}
.dsh-workbench-home-card-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.dsh-workbench-home-card-badge {
  flex: none;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  padding: 1px 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-weight: 500;
  line-height: 17px;
  white-space: nowrap;
}
.dsh-workbench-home-card-description {
  display: -webkit-box;
  min-height: 42px;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.dsh-workbench-home-card-id {
  min-width: 0;
  margin-top: auto;
  overflow: hidden;
  color: var(--dsw-alias-label-dimmed);
  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-workbench-home-card-foot {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: flex-end;
  padding: 6px 12px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-workbench-home-card[data-disabled="true"] .dsh-workbench-home-card-foot { color: var(--dsw-alias-state-error-primary); }
.dsh-workbench-home-empty {
  display: grid;
  justify-items: start;
  gap: 6px;
  width: 100%;
  min-height: 136px;
  align-content: center;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  padding: 16px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-base);
  text-align: left;
}
.dsh-workbench-home-empty strong { color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-workbench-home-empty span { font: var(--dsw-font-xs-13); }
.dsh-workbench-home-empty > button { margin-top: 4px; }
.dsh-workbench-center[data-kind="panel"],
.dsh-workbench-center[data-kind="capsule"] {
  pointer-events: none;
  background: transparent;
}
.dsh-workbench-panel,
.dsh-workbench-capsule {
  position: absolute;
  pointer-events: auto;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-shadow-lv3);
}
.dsh-workbench-center[data-kind="panel"][data-placement="right"] .dsh-workbench-panel {
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--workbench-panel-size, min(360px, 100%));
  border-left: 1px solid var(--dsw-alias-border-l2);
  overflow: auto;
}
.dsh-workbench-center[data-kind="panel"][data-placement="bottom"] .dsh-workbench-panel {
  right: 0;
  bottom: 0;
  left: 0;
  height: var(--workbench-panel-size, min(280px, 55%));
  border-top: 1px solid var(--dsw-alias-border-l2);
  overflow: auto;
}
.dsh-workbench-capsule {
  right: 16px;
  bottom: 16px;
  max-width: min(420px, calc(100% - 32px));
  max-height: min(320px, calc(100% - 32px));
  overflow: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
}
@container (max-width: 170px) {
  .dsh-workbench-sidebar-section { padding-right: 0; }
  .dsh-workbench-sidebar-heading { justify-content: flex-start; gap: 0; padding-left: 0; margin-right: 0; margin-bottom: 12px; }
  .dsh-workbench-sidebar-heading-label,
  .dsh-workbench-sidebar-search-slot,
  .dsh-workbench-sidebar-wide-only,
  .dsh-workbench-sidebar-empty { display: none; }
  .dsh-workbench-sidebar-heading-actions { max-width: none; }
  .dsh-workbench-sidebar-add { width: 36px; height: 36px; }
  .dsh-workbench-sidebar-rail-search { display: block; width: 36px; height: 36px; margin-bottom: 12px; }
  .dsh-workbench-sidebar-rail-search .dsh-workbench-sidebar-search-button { width: 36px; height: 36px; color: var(--dsw-alias-label-primary); }
  .dsh-workbench-sidebar-list { justify-items: center; }
  .dsh-workbench-sidebar-row { width: 36px; justify-content: center; padding: 0; }
  .dsh-workbench-sidebar-row-label,
  .dsh-workbench-sidebar-row-actions { display: none; }
  .dsh-workbench-sidebar-rail-icon { display: block; color: var(--dsw-alias-label-primary); }
}
@container (max-width: 720px) {
  .dsh-workbench-home { padding: 24px 16px 48px; }
  .dsh-workbench-home-header { align-items: center; margin-bottom: 28px; }
  .dsh-workbench-home-header h1 { font-size: 22px; line-height: 30px; }
  .dsh-workbench-home-section-heading { align-items: flex-start; flex-direction: column; gap: 2px; }
  .dsh-workbench-home-grid { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .dsh-workbench-home-card { min-height: 128px; }
  .dsh-workbench-center-body { flex-direction: column; overflow: auto; scrollbar-width: none; }
  .dsh-workbench-center-body::-webkit-scrollbar { width: 0; height: 0; }
  .dsh-workbench-center-secondary { width: 100%; min-height: auto; overflow: visible; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l2); }
  .dsh-workbench-center-main { flex: none; overflow: visible; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-workbench-sidebar-heading-label,
  .dsh-workbench-sidebar-search-slot,
  .dsh-workbench-sidebar-search,
  .dsh-workbench-sidebar-search-input,
  .dsh-workbench-sidebar-heading-actions { transition: none; }
}
`
