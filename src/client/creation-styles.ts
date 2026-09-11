export const CREATION_STYLE = /* css */ `
.dsh-better-workbench-create-dialog { width: min(560px, calc(100vw - 32px)); max-height: calc(100dvh - 32px); border-radius: 32px; corner-shape: superellipse(1.5); }
.dsh-better-workbench-create-content { overflow-y: auto; min-height: 0; }
.dsh-better-workbench-create-dialog *, .dsh-better-workbench-website-create * { box-sizing: border-box; }
.dsh-better-workbench-create-dialog input { font: var(--dsw-font-s-14); color: var(--dsw-alias-label-primary); }
.dsh-better-workbench-create-search { display: block; width: 100%; min-width: 0; height: 38px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; background: var(--dsw-alias-bg-base); }
.dsh-better-workbench-create-search:focus { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 1px; }
.dsh-better-workbench-create-input { width: 100%; min-width: 0; }
.dsh-better-workbench-create-input:has(input[aria-invalid="true"]) { border-color: var(--dsw-alias-state-error-primary); }
.dsh-better-workbench-create-input:has(input:disabled) { opacity: .6; }
.dsh-better-workbench-create-choices { display: flex; flex-direction: column; margin-top: 12px; gap: 4px; }
.dsh-better-workbench-create-choice { display: flex; align-items: center; width: 100%; min-height: 52px; gap: 12px; padding: 10px; background: transparent; color: var(--dsw-alias-label-primary); border: 1px solid transparent; border-radius: 6px; cursor: pointer; text-align: left; font: var(--dsw-font-s-14); }
.dsh-better-workbench-create-choice:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-better-workbench-create-choice:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: -2px; }
.dsh-better-workbench-create-choice:disabled { opacity: .5; cursor: default; }
.dsh-better-workbench-create-choice > svg, .dsh-better-workbench-create-choice-icon { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 16px; height: 16px; line-height: 0; color: var(--dsw-alias-label-secondary); }
.dsh-better-workbench-create-choice-icon svg { display: block; }
.dsh-better-workbench-create-choice-label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.dsh-better-workbench-create-choice-kind { flex: none; font: var(--dsw-font-xs-13); color: var(--dsw-alias-label-tertiary); }
.dsh-better-workbench-create-spacer { flex: 1; }
.dsh-better-workbench-create-form, .dsh-better-workbench-website-create { display: flex; flex-direction: column; gap: 20px; }
.dsh-better-workbench-create-step { margin-bottom: 18px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-better-workbench-create-field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 18px; font: var(--dsw-font-s-14); }
.dsh-better-workbench-create-field > input { display: block; width: 100%; min-width: 0; height: 38px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; background: var(--dsw-alias-bg-base); }
.dsh-better-workbench-create-field > input:focus { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 1px; }
.dsh-better-workbench-create-form .dsh-better-workbench-create-field, .dsh-better-workbench-website-create .dsh-better-workbench-create-field { margin: 0; }
.dsh-better-workbench-create-form .dsh-better-workbench-create-field > span:first-child { color: var(--dsw-alias-label-secondary); }
.dsh-better-workbench-create-error { color: var(--dsw-alias-state-error-primary); font: var(--dsw-font-xs-13); margin: 8px 0 12px; overflow-wrap: anywhere; }
.dsh-better-workbench-create-form .dsh-better-workbench-create-error { margin: 0; }
.dsh-better-workbench-create-empty { padding: 28px 0; text-align: center; color: var(--dsw-alias-label-tertiary); }
.dsh-better-workbench-create-options { border-top: .5px solid var(--dsw-alias-border-l2); }
.dsh-better-workbench-create-setting-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 56px; padding: 14px 0; }
.dsh-better-workbench-create-setting-row + .dsh-better-workbench-create-setting-row { border-top: .5px solid var(--dsw-alias-border-l2); }
.dsh-better-workbench-create-setting-label { font: var(--dsw-font-s-14); color: var(--dsw-alias-label-primary); }
.dsh-better-workbench-create-setting-copy { display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; }
.dsh-better-workbench-create-select { gap: 8px; max-width: 100%; }
.dsh-better-workbench-create-select > svg { display: block; flex: none; }
.dsh-better-workbench-home-card { border-radius: 8px; min-height: 150px; }
.dsh-better-workbench-home-card-main { border-radius: 8px 8px 0 0; }
.dsh-better-workbench-home-card-foot { border: 0; border-top: 1px solid var(--dsw-alias-border-l2); background: transparent; cursor: pointer; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-better-workbench-home-card-foot:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-better-workbench-home-instance-icon { display: flex; flex: none; width: 16px; height: 16px; color: var(--dsw-alias-label-secondary); }
.dsh-better-workbench-home-card-name { white-space: normal; overflow-wrap: anywhere; }
.dsh-better-workbench-home-grid { grid-template-columns: repeat(auto-fill, minmax(min(268px, 100%), 1fr)); }
.dsh-better-workbench-website-setting { display: flex; align-items: center; gap: 8px; margin: 0 0 16px; font: var(--dsw-font-s-14); }
.dsh-better-workbench-create-trust { align-items: flex-start; padding-bottom: 0; }
.dsh-better-workbench-create-trust > button { margin-top: 1px; }
.dsh-better-workbench-create-trust .dsh-better-workbench-website-permission { margin: 0; line-height: 20px; }
.dsh-better-workbench-website-permission { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); line-height: 1.6; overflow-wrap: anywhere; }
.dsh-better-workbench-home-header { flex-wrap: wrap; }
.dsh-better-workbench-home-header h1 { white-space: nowrap; }
@container (max-width: 420px) {
  .dsh-better-workbench-home { padding: 20px 12px; }
  .dsh-better-workbench-home-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 600px) {
  .dsh-better-workbench-create-dialog { width: calc(100vw - 24px); max-height: calc(100dvh - 24px); }
  .dsh-better-workbench-home-header { gap: 12px; }
  .dsh-better-workbench-create-choice { gap: 8px; padding-inline: 6px; }
}
`
