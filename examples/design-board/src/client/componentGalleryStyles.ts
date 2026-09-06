export const COMPONENT_GALLERY_STYLE = `

.dsh-cg { width: min(100%, 1120px); margin: 0 auto; padding: 32px 36px 64px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-xs-13); letter-spacing: 0; }
.dsh-cg *, .dsh-cg *::before, .dsh-cg *::after { box-sizing: border-box; }
.dsh-cg-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-bottom: 24px; }
.dsh-cg-heading > div { min-width: 0; }
.dsh-cg-eyebrow { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-strong-11); }
.dsh-cg-heading h1 { margin: 7px 0 8px; font: var(--dsw-font-xl-24); }
.dsh-cg-heading > div > code { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-cg-heading > span { flex: none; }
.dsh-cg-scope { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-cg-families { display: flex; flex-wrap: wrap; gap: 0 20px; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-cg-families button { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 6px 0; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); cursor: pointer; }
.dsh-cg-families button small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-11); }
.dsh-cg-families button[aria-pressed=true] { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-state-business-primary); font-weight: 600; }
.dsh-cg-families button:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-cg-result-count { flex: 1; font: var(--dsw-font-xxs-12); color: var(--dsw-alias-label-tertiary); }
.dsh-native-label { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; margin-bottom: 12px; }
.dsh-native-label strong { font: var(--dsw-font-xs-strong-13); }
.dsh-native-label span, .dsh-native-state-grid small, .dsh-native-card-states small { font: var(--dsw-font-xxs-12); color: var(--dsw-alias-label-tertiary); }
.dsh-native-provider-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.dsh-native-provider-actions > button { flex: 1 1 0; min-width: min(180px, 100%); }
.dsh-native-state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 24px; margin-top: 22px; }
.dsh-native-state-grid > div { display: flex; align-items: flex-start; flex-direction: column; gap: 10px; min-width: 0; }
.dsh-native-state-grid > div:last-child { grid-column: 1 / -1; }
.dsh-native-state-grid button { max-width: 100%; }
.dsh-native-contract { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 24px; margin: 24px 0 0; padding: 16px 0 0; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-native-contract > div { min-width: 0; }
.dsh-native-contract dt { font: var(--dsw-font-xxxs-11); color: var(--dsw-alias-label-tertiary); }
.dsh-native-contract dd { margin: 4px 0 0; font: var(--dsw-font-xxs-12); overflow-wrap: anywhere; }
.dsh-native-inline-form { display: grid; gap: 10px; max-width: 420px; margin: 16px 0; padding: 12px 0; }
.dsh-native-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: 16px; align-items: stretch; }
.dsh-native-card-states { margin-top: 24px; }
.dsh-native-card-states > div { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dsh-native-card-states > div > div { flex: 1; }
.dsh-native-owner-error { display: block; padding: 10px 16px; color: var(--dsw-alias-state-error-primary); font: var(--dsw-font-xxs-12); }
.dsh-cg-unavailable { padding: 16px 0; color: var(--dsw-alias-label-tertiary); }
@container (max-width: 520px) { .dsh-native-contract, .dsh-native-state-grid { grid-template-columns: minmax(0, 1fr); } .dsh-cg-families { gap: 0 16px; } }

.dsh-cg-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-cg-search { width: 192px; min-width: 0; }
.dsh-cg-toolbar > .dsh-cg-options { flex: 1; }
.dsh-cg-options, .dsh-cg-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; }
.dsh-cg-icon-anchor { display: inline-flex; flex: none; align-items: center; justify-content: center; }
.dsh-cg-section { min-width: 0; padding: 26px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-cg-section-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; }
.dsh-cg-section-head > div:first-child { min-width: 0; }
.dsh-cg-section-head > .dsh-cg-actions { flex: none; flex-wrap: nowrap; }
.dsh-cg-section-head h2 { display: flex; flex-wrap: wrap; align-items: baseline; gap: 5px 12px; margin: 0; font: var(--dsw-font-base-strong-16); }
.dsh-cg-section-head h2 code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-cg-metrics { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 7px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-cg-table-scroll { max-width: 100%; overflow-x: auto; overscroll-behavior-inline: contain; }
.dsh-cg-matrix { width: 100%; min-width: 660px; table-layout: fixed; border-collapse: collapse; }
.dsh-cg-matrix th, .dsh-cg-matrix td { height: 62px; padding: 8px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1); text-align: left; vertical-align: middle; }
.dsh-cg-matrix thead th { height: 32px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-strong-11); }
.dsh-cg-matrix th:first-child { width: 108px; }
.dsh-cg-matrix tbody th { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-cg-matrix button { white-space: nowrap; }
.dsh-cg-inline-samples { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 24px 36px; padding: 8px 0; }
.dsh-cg-table-scroll + .dsh-cg-inline-samples { margin-top: 16px; }
.dsh-cg-inline-samples > div { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; min-width: 0; }
.dsh-cg-inline-samples > div > small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-cg-fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px 20px; }
.dsh-cg-field { display: flex; flex-direction: column; gap: 7px; min-width: 0; color: var(--dsw-alias-label-primary); font: var(--dsw-font-xs-13); }
.dsh-cg-field > span:first-child { font: var(--dsw-font-xs-strong-13); }
.dsh-cg-field > span { min-width: 0; }
.dsh-cg-field > small { display: flex; align-items: flex-start; gap: 4px; min-height: 18px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-cg-field > small > svg { flex: none; }
.dsh-cg-field > small.dsh-cg-error { color: var(--dsw-alias-state-error-primary); }
.dsh-cg-field > small.dsh-cg-success { color: var(--dsw-alias-state-success-primary); }
.dsh-cg-result { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; min-height: 32px; margin-top: 16px; padding-top: 12px; color: var(--dsw-alias-label-tertiary); border-top: 1px solid var(--dsw-alias-border-l1); font: var(--dsw-font-xxs-12); }
.dsh-cg-result code, .dsh-cg-result strong { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }
.dsh-cg-hover-content { display: grid; gap: 7px; min-width: 0; color: var(--dsw-alias-label-primary-foreground); }
body[data-ds-dark-theme] .dsh-cg-hover-content { color: var(--dsw-alias-label-primary); }
.dsh-cg-hover-content code { overflow-wrap: anywhere; color: inherit; }
.dsh-cg-status-matrix { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); margin-bottom: 24px; }
.dsh-cg-status-matrix > div { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 46px; padding: 8px; }
.dsh-cg-status-matrix code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-cg-two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.dsh-cg-subsection { display: flex; flex-direction: column; align-items: stretch; gap: 12px; min-width: 0; }
.dsh-cg-subsection h3 { margin: 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-strong-13); }
.dsh-cg-disclosure { padding: 4px 0; }
.dsh-cg-disclosure-body { display: flex; align-items: flex-start; gap: 8px; padding: 12px 0 10px 24px; overflow-wrap: anywhere; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-cg-disclosure-body > :first-child { flex: none; margin-top: 4px; }
.dsh-cg-muted { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-cg-connection { display: flex; align-items: center; min-height: 36px; }
.dsh-cg-content-grid { row-gap: 28px; }
.dsh-cg-code { margin-top: 18px; min-width: 0; }
.dsh-cg-empty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 64px 20px; color: var(--dsw-alias-label-tertiary); }
.dsh-cg-spin { animation: dsh-cg-spin 1s linear infinite; }
@keyframes dsh-cg-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .dsh-cg-spin { animation: none; } }
@container (max-width: 900px) {
  .dsh-cg { padding: 24px; }
  .dsh-cg-toolbar > .dsh-cg-options { order: 3; flex-basis: 100%; }
  .dsh-cg-search { flex: 1; }
  .dsh-cg-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh-cg-status-matrix { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container (max-width: 600px) {
  .dsh-cg { padding: 20px 16px 40px; }
  .dsh-cg-heading { align-items: flex-start; flex-direction: column; gap: 12px; }
  .dsh-cg-heading h1 { font: var(--dsw-font-l-20, 600 20px/28px sans-serif); }
  .dsh-cg-section-head { gap: 8px; }
  .dsh-cg-section-head h2 { flex-direction: column; align-items: flex-start; font: var(--dsw-font-s-strong-14); }
  .dsh-cg-two-col, .dsh-cg-fields { grid-template-columns: minmax(0, 1fr); }
  .dsh-cg-inline-samples { gap: 22px 24px; }
  .dsh-cg-section { padding: 22px 0; }
  .dsh-cg-metrics { gap: 3px 10px; }
}

`
