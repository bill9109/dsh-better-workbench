export const DESIGN_BOARD_STYLE = `
.dsh-specimen-board { min-height: 100%; container-type: inline-size; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); }
.dsh-specimen-board *, .dsh-specimen-board *::before, .dsh-specimen-board *::after { box-sizing: border-box; }
.dsh-specimen-sidebar { display: flex; flex-direction: column; min-height: 100%; padding: 18px 12px 12px; background: var(--dsw-specific-sidebar-fill); color: var(--dsw-alias-label-primary); }
.dsh-specimen-sidebar-title { padding: 0 8px; font: var(--dsw-font-s-strong-14); }
.dsh-specimen-sidebar > p { margin: 4px 8px 18px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-sidebar-nav { display: grid; gap: 14px; }
.dsh-specimen-sidebar-group { display: grid; gap: 2px; min-width: 0; }
.dsh-specimen-sidebar-group-label { padding: 0 8px 4px; color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); text-transform: uppercase; }
.dsh-specimen-sidebar-link { display: flex; align-items: center; gap: 8px; width: 100%; height: 32px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; cursor: pointer; text-align: left; font: var(--dsw-font-xs-13); }
.dsh-specimen-sidebar-link > svg { flex: none; width: 16px; color: var(--dsw-alias-label-tertiary); }
.dsh-specimen-sidebar-link:hover, .dsh-specimen-sidebar-link[data-active="true"] { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-specimen-sidebar-link[data-active="true"] { font: var(--dsw-font-xs-strong-13); }
.dsh-specimen-sidebar-footer { display: flex; justify-content: space-between; gap: 8px; margin-top: auto; padding: 14px 8px 0; border-top: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-11); }
.dsh-specimen-sidebar-footer strong { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxxs-strong-11); }
.dsh-specimen-content { width: min(100%, 1080px); margin: 0 auto; padding: 40px 48px 64px; }
.dsh-specimen-intro { padding-bottom: 28px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-intro > span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-strong-11); letter-spacing: .08em; }
.dsh-specimen-intro h1 { margin: 8px 0; color: var(--dsw-alias-label-primary); font: var(--dsw-font-xl-24); }
.dsh-specimen-intro p { max-width: 760px; margin: 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-specimen-band { padding: 28px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.dsh-specimen-heading h2 { margin: 0; font: var(--dsw-font-base-strong-16); }
.dsh-specimen-heading p { max-width: 660px; margin: 4px 0 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-specimen-source { flex: none; max-width: 42%; overflow: hidden; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-layer-table, .dsh-foundation-theme-table, .dsh-foundation-font-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-layer-table > div { display: grid; grid-template-columns: 150px 220px minmax(0, 1fr); grid-template-rows: auto auto; gap: 4px 16px; align-items: center; min-height: 68px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-layer-table strong { grid-row: span 2; font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-layer-table code, .dsh-foundation-theme-table code, .dsh-foundation-font-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-layer-table span, .dsh-foundation-layer-table small, .dsh-foundation-font-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-foundation-layer-table small { grid-column: 3; color: var(--dsw-alias-label-tertiary); }
.dsh-foundation-rule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-foundation-rule-grid > div { display: grid; gap: 6px; min-height: 92px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-foundation-rule-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-rule-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-foundation-theme-table > div, .dsh-foundation-font-table > div { display: grid; grid-template-columns: 150px minmax(280px, 1fr) minmax(0, 1fr); gap: 16px; align-items: center; min-height: 62px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-theme-table strong, .dsh-foundation-font-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-theme-table code, .dsh-foundation-font-table code { min-width: 0; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-theme-table span, .dsh-foundation-font-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-static-family-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; }
.dsh-static-family { min-width: 0; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-static-family-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; min-height: 42px; padding-top: 12px; }
.dsh-static-family-heading strong { font: var(--dsw-font-xs-strong-13); }
.dsh-static-family-heading span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-static-token-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: var(--dsw-alias-border-l1); }
.dsh-static-token { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: center; min-height: 38px; padding: 6px 8px; background: var(--dsw-alias-bg-base); }
.dsh-static-token .dsh-specimen-swatch { width: 22px; height: 22px; border-radius: 4px; }
.dsh-static-token code { min-width: 0; overflow-wrap: anywhere; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-static-token small { grid-column: 2; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-xxxs-11); }
.dsh-specimen-token-table, .dsh-specimen-type-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-token-row { display: grid; grid-template-columns: 28px minmax(180px, 1fr) minmax(130px, .7fr); align-items: center; gap: 12px; min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-swatch { width: 28px; height: 28px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; }
.dsh-specimen-token-copy { display: grid; gap: 2px; min-width: 0; }
.dsh-specimen-token-copy strong { font: var(--dsw-font-xs-strong-13); }
.dsh-specimen-token-copy code, .dsh-specimen-token-row > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-type-head, .dsh-specimen-type-row { display: grid; grid-template-columns: 150px minmax(0, 1fr) 130px 250px 58px; align-items: center; gap: 12px; }
.dsh-specimen-type-head { min-height: 34px; border-bottom: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); }
.dsh-specimen-type-row { min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-type-row > span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-specimen-type-row strong, .dsh-specimen-type-row code { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-specimen-type-row strong { color: var(--dsw-alias-label-primary); }
.dsh-specimen-type-row small { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-type-row code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-specimen-type-row em { color: var(--dsw-alias-label-caption); font: normal var(--dsw-font-xxxs-11); }
.dsh-specimen-type-row em[data-status="已消费"] { color: var(--dsw-alias-state-success-primary); }
.dsh-specimen-type-row em[data-status="仅声明"] { color: var(--dsw-alias-label-tertiary); }
.dsh-foundation-metric-table, .dsh-foundation-motion-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-metric-table > div, .dsh-foundation-motion-table > div { display: grid; grid-template-columns: 180px 340px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-metric-table strong, .dsh-foundation-motion-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-metric-table code, .dsh-foundation-motion-table code { min-width: 0; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-metric-table span, .dsh-foundation-motion-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-board-layer-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-layer-strip > div { display: grid; grid-template-columns: 32px 1fr; grid-template-rows: auto auto; column-gap: 10px; min-height: 82px; padding: 16px 14px; border-right: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-layer-strip > div:last-child { border-right: 0; }
.dsh-board-layer-strip span { grid-row: span 2; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-s-strong-14); }
.dsh-board-layer-strip strong { font: var(--dsw-font-s-strong-14); }
.dsh-board-layer-strip small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-board-module-table, .dsh-traceability-table { border-top: 1px solid var(--dsw-alias-border-l1); overflow: hidden; }
.dsh-board-table-head, .dsh-board-table-row { display: grid; grid-template-columns: 110px minmax(150px, 1fr) minmax(150px, 1.1fr) minmax(125px, .9fr) minmax(150px, 1fr); gap: 12px; align-items: start; padding: 12px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-table-head { color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); }
.dsh-board-table-row { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-board-table-row strong { color: var(--dsw-alias-label-primary); font: var(--dsw-font-xs-strong-13); }
.dsh-board-table-row code, .dsh-board-geometry-table code, .dsh-settings-recipe-grid code, .dsh-traceability-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-board-geometry-table > div { display: grid; grid-template-columns: minmax(160px, 1fr) 210px minmax(180px, 1.2fr); gap: 16px; align-items: center; min-height: 48px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-geometry-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-board-geometry-table span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-board-callouts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.dsh-board-callouts > div, .dsh-board-note { display: grid; grid-template-columns: 16px minmax(0, 1fr); column-gap: 8px; row-gap: 3px; color: var(--dsw-alias-label-secondary); }
.dsh-board-callouts svg, .dsh-board-note svg { grid-row: span 2; color: var(--dsw-alias-state-business-primary); }
.dsh-board-callouts strong { font: var(--dsw-font-xs-strong-13); }
.dsh-board-callouts span, .dsh-board-note span { font: var(--dsw-font-xs-13); }
.dsh-settings-recipe-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-recipe-grid > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 3px; min-height: 86px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-recipe-grid > div:nth-child(odd) { padding-right: 18px; }
.dsh-settings-recipe-grid > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-recipe-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-settings-recipe-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-settings-recipe-grid code { grid-column: 2; }
.dsh-icon-rule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-icon-rule-grid > div { display: grid; gap: 5px; min-height: 94px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-icon-rule-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-icon-rule-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-icon-rule-grid small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-icon-geometry-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-icon-geometry-grid > div { display: grid; grid-template-columns: 42px minmax(0, 1fr); grid-template-rows: auto auto; gap: 3px 10px; align-items: center; min-height: 86px; padding: 16px; background: var(--dsw-alias-bg-layer-1); }
.dsh-icon-geometry-grid > div > button, .dsh-icon-status-14 { grid-row: span 2; display: inline-flex; align-items: center; justify-content: center; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-icon-button-28 { width: 28px; height: 28px; border: 0; border-radius: 50%; }
.dsh-icon-button-36 { width: 36px; height: 36px; border: 0; border-radius: 50%; }
.dsh-icon-button-28:hover, .dsh-icon-button-36:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-icon-button-28:focus-visible, .dsh-icon-button-36:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-icon-status-14 { width: 28px; height: 28px; color: var(--dsw-alias-state-business-primary); }
.dsh-icon-geometry-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-icon-geometry-grid code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-specimen-icon-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-icon-item { display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: 10px; align-items: center; min-height: 70px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-icon-item:nth-child(odd) { padding-right: 18px; }
.dsh-specimen-icon-item:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-icon-box { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border-radius: 8px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-specimen-icon-item > div { display: grid; min-width: 0; gap: 1px; }
.dsh-specimen-icon-item strong { font: var(--dsw-font-xs-strong-13); }
.dsh-specimen-icon-item code, .dsh-specimen-icon-item span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-icon-states { display: flex; flex-wrap: wrap; gap: 8px; }
.dsh-specimen-icon-states button { display: inline-flex; align-items: center; gap: 6px; height: 28px; border: 0; border-radius: 14px; padding: 0 10px; color: var(--dsw-alias-label-secondary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-specimen-icon-states button[data-state="hover"], .dsh-specimen-icon-states button[data-state="selected"] { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-specimen-icon-states button[data-state="selected"] { background: var(--dsw-alias-interactive-bg-active); }
.dsh-specimen-icon-states button:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-specimen-icon-states button:disabled { cursor: not-allowed; opacity: .4; }
.dsh-primitive-rule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-primitive-rule-grid > div { display: grid; gap: 5px; min-height: 94px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-primitive-rule-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-primitive-rule-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-primitive-rule-grid small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-primitive-button-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.dsh-primitive-button { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 36px; border: 0; border-radius: 18px; padding: 0 14px; color: var(--dsw-alias-label-primary); background: transparent; cursor: pointer; font: var(--dsw-font-s-14); }
.dsh-primitive-button:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-primitive-button:disabled { cursor: not-allowed; opacity: .4; }
.dsh-primitive-button.is-primary { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-primary-fill); }
.dsh-primitive-button.is-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
.dsh-primitive-button.is-outline { border: 1px solid var(--dsw-alias-border-l2); }
.dsh-primitive-button.is-toolbar { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-tool-bar-fill); }
.dsh-primitive-button.is-small { height: 28px; border-radius: 14px; padding: 0 10px; font: var(--dsw-font-xxs-12); }
.dsh-board-spec-grid { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 16px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-primitive-input-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.dsh-primitive-input-row label, .dsh-module-settings-options label { display: grid; gap: 6px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-primitive-input { width: 100%; }
.dsh-primitive-input-row .dsh-primitive-input input { min-width: 0; }
.dsh-board-note { margin-top: 18px; padding: 10px 12px; border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-note svg { color: var(--dsw-alias-state-error-primary); }
.dsh-primitive-disclosure { display: grid; gap: 2px; }
.dsh-primitive-disclosure > div { display: flex; align-items: center; min-width: 0; height: 24px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-primitive-disclosure > div > span:not(.dsh-primitive-leading):not(.dsh-primitive-separator) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-primitive-disclosure > div > svg { flex: none; margin-left: auto; color: var(--dsw-alias-label-tertiary); }
.dsh-primitive-leading { display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; margin-right: 6px; color: var(--dsw-alias-label-tertiary); }
.dsh-primitive-separator { width: 3px; height: 3px; margin: 0 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary); }
.dsh-primitive-catalog { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-primitive-catalog > div { display: grid; gap: 5px; min-height: 82px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-primitive-catalog > div:nth-child(odd) { padding-right: 18px; }
.dsh-primitive-catalog > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-primitive-catalog strong { font: var(--dsw-font-xs-strong-13); }
.dsh-primitive-catalog span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-shell-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-shell-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-shell-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-shell-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-shell-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-shell-diagram { position: relative; display: grid; grid-template-columns: 180px minmax(0, 1fr) 8px 138px; min-height: 248px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; overflow: hidden; background: var(--dsw-alias-bg-layer-1); }
.dsh-shell-diagram > aside { display: grid; align-content: start; gap: 6px; padding: 18px 16px; background: var(--dsw-specific-sidebar-fill); color: var(--dsw-alias-label-primary); }
.dsh-shell-diagram > aside strong, .dsh-shell-diagram > aside small { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-shell-diagram > aside small { color: var(--dsw-alias-label-tertiary); }
.dsh-shell-diagram > main { display: grid; grid-template-rows: 42px 1fr 52px; min-width: 0; background: var(--dsw-alias-bg-base); }
.dsh-shell-diagram header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 18px; border-bottom: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-shell-chat-lines { display: grid; align-content: center; gap: 10px; padding: 22px 14%; }
.dsh-shell-chat-lines span { display: block; height: 10px; border-radius: 5px; background: var(--dsw-alias-interactive-bg-hover); }
.dsh-shell-chat-lines span:nth-child(2) { width: 75%; }
.dsh-shell-chat-lines span:nth-child(3) { width: 58%; }
.dsh-shell-composer-line { width: 74%; height: 32px; align-self: center; justify-self: center; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; background: var(--dsw-specific-input-major); }
.dsh-shell-resize-handle { position: relative; z-index: 1; cursor: col-resize; background: transparent; }
.dsh-shell-resize-handle::after { position: absolute; inset-block: 0; left: 3px; width: 1px; content: ''; background: var(--dsw-alias-border-l2); }
.dsh-shell-resize-handle:hover::after { background: var(--dsw-alias-state-business-primary); }
.dsh-shell-details { background: var(--dsw-alias-bg-layer-2) !important; color: var(--dsw-alias-label-primary) !important; }
.dsh-shell-details strong { color: var(--dsw-alias-label-secondary) !important; }
.dsh-shell-overlay { position: absolute; right: 18px; bottom: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px dashed var(--dsw-alias-border-l3); border-radius: 8px; color: var(--dsw-alias-label-tertiary); background: var(--dsw-alias-bg-layer-2); font: var(--dsw-font-xxs-12); }
.dsh-shell-state-grid, .dsh-settings-recipe-grid, .dsh-state-matrix { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-shell-state-grid > div, .dsh-state-matrix > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 3px; min-height: 82px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-shell-state-grid svg { grid-row: span 2; color: var(--dsw-alias-label-tertiary); }
.dsh-shell-state-grid strong, .dsh-state-matrix strong { font: var(--dsw-font-xs-strong-13); }
.dsh-shell-state-grid span, .dsh-state-matrix span, .dsh-state-matrix small { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
@keyframes dsh-board-thinking-sweep { 0% { left: -300px; } 90%, 100% { left: 100%; } }
.dsh-module-message-actions { display: flex; gap: 12px; margin-top: 16px; }
.dsh-module-message-actions button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-module-message-actions button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-responsive-table > div { display: grid; grid-template-columns: 120px minmax(0, 1fr) 190px; gap: 14px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-responsive-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-responsive-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overlay-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-overlay-rule-table > div { display: grid; grid-template-columns: 190px 330px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-overlay-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overlay-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-overlay-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overlay-menu-specimen { display: flex; align-items: flex-start; gap: 28px; }
.dsh-overlay-menu-card { width: min(280px, 100%); padding: 4px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; box-shadow: var(--dsw-shadow-lv3); background: var(--dsw-specific-menu); }
.dsh-overlay-menu-label { padding: 8px 12px 6px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-overlay-menu-card button { display: flex; align-items: center; gap: 8px; width: 100%; height: 40px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; text-align: left; font: var(--dsw-font-s-14); }
.dsh-overlay-menu-card button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-overlay-menu-card button.is-danger { color: var(--dsw-alias-state-error-primary); }
.dsh-overlay-menu-separator { height: 1px; margin: 4px 8px; background: var(--dsw-alias-border-l1); }
.dsh-overlay-facts { display: grid; align-content: center; gap: 8px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-overlay-feedback-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 16px; }
.dsh-overlay-feedback-strip > div { display: grid; gap: 6px; min-height: 78px; padding: 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-base); }
.dsh-overlay-feedback-strip strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overlay-feedback-strip span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-overlay-feedback-strip code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-overlay-feedback-strip .is-toast { margin-top: 10px; border-radius: 14px; color: var(--dsw-alias-label-primary-inverted); background: var(--dsw-alias-button-contrast-fill); }
.dsh-overlay-feedback-strip .is-banner { border-top: 3px solid var(--dsw-alias-state-error-primary); }
.dsh-overlay-feedback-strip .is-onboarding { border-radius: 0; background: var(--dsw-alias-bg-layer-1); }
.dsh-overlay-duo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.dsh-overlay-modal, .dsh-overlay-hovercard { position: relative; min-height: 210px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; overflow: hidden; background: var(--dsw-alias-bg-layer-1); }
.dsh-overlay-modal-mask { position: absolute; inset: 0; background: var(--dsw-alias-bg-mask-1); }
.dsh-overlay-modal-card { position: absolute; inset: 28px 24px; display: grid; align-content: center; gap: 10px; padding: 24px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 24px; box-shadow: var(--dsw-shadow-lv3); background: var(--dsw-alias-bg-layer-2); }
.dsh-overlay-modal-card strong, .dsh-overlay-hovercard strong { font: var(--dsw-font-s-strong-14); }
.dsh-overlay-modal-card p { margin: 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overlay-modal-card > div { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.dsh-overlay-hovercard { display: grid; align-content: start; gap: 6px; padding: 18px; background: var(--dsw-alias-tooltip-bg); color: var(--dsw-alias-label-primary-foreground); }
.dsh-overlay-hovercard strong, .dsh-overlay-hovercard span, .dsh-overlay-hovercard small { color: var(--dsw-alias-label-primary-foreground); }
.dsh-overlay-hovercard span, .dsh-overlay-hovercard small { font: var(--dsw-font-xxs-12); overflow-wrap: anywhere; }
.dsh-overlay-hovercard button { display: inline-flex; width: fit-content; align-items: center; gap: 6px; margin-top: 8px; border: 0; border-radius: 14px; padding: 0 8px; height: 28px; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-tool-bar-fill); font: var(--dsw-font-xxs-12); }
.dsh-settings-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-settings-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-settings-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-module-settings-panel { display: grid; grid-template-columns: 188px minmax(0, 1fr); width: min(800px, 100%); min-height: 420px; overflow: hidden; border-radius: 24px; box-shadow: var(--dsw-shadow-lv3); background: var(--dsw-alias-bg-layer-2); }
.dsh-module-settings-nav { display: grid; align-content: start; gap: 2px; padding: 20px 12px; background: var(--dsw-specific-sidebar-fill); }
.dsh-module-settings-nav > strong { padding: 0 12px 12px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-module-settings-nav button { display: flex; align-items: center; gap: 8px; height: 40px; border: 0; border-radius: 12px; padding: 9px 16px 9px 12px; color: var(--dsw-alias-label-secondary); background: transparent; cursor: pointer; text-align: left; font-size: 14px; line-height: 22px; }
.dsh-module-settings-nav button[data-active="true"], .dsh-module-settings-nav button:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-specific-sidebar-nav-item-active); }
.dsh-module-settings-content { display: grid; grid-template-rows: 54px minmax(0, 1fr); min-width: 0; }
.dsh-module-settings-content > header { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid var(--dsw-alias-border-l1); font: var(--dsw-font-s-strong-14); }
.dsh-module-settings-content > header button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-module-settings-options { display: grid; align-content: start; gap: 18px; overflow: auto; padding: 24px; }
.dsh-module-settings-input { width: 100%; }
.dsh-module-settings-input input { min-width: 0; }
.dsh-module-settings-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 4px; }
.dsh-module-settings-row > div { display: grid; gap: 3px; }
.dsh-module-settings-row strong { font: var(--dsw-font-xs-strong-13); }
.dsh-module-settings-row span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-module-switch { position: relative; width: 36px; height: 22px; flex: none; border: 0; border-radius: 11px; padding: 0; background: var(--dsw-alias-border-l3); }
.dsh-module-switch span { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--dsw-alias-bg-layer-1); }
.dsh-module-switch[data-on="true"] { background: var(--dsw-alias-state-business-primary); }
.dsh-module-switch[data-on="true"] span { left: 17px; }
.dsh-settings-recipe-grid { border: 0; background: transparent; }
.dsh-settings-recipe-grid > div { min-height: 92px; padding: 16px 0; background: transparent; }
.dsh-settings-comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-comparison > div { display: grid; gap: 6px; min-height: 110px; padding: 18px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-comparison > div + div { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-comparison strong { font: var(--dsw-font-s-strong-14); }
.dsh-settings-comparison span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-settings-comparison code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-primitive-button.is-danger { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-state-error-primary); }
.dsh-a11y-keyboard-list { display: grid; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-keyboard-list > div { display: grid; grid-template-columns: 74px 120px minmax(0, 1fr); gap: 14px; align-items: center; min-height: 52px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-keyboard-list kbd, .dsh-a11y-role { display: inline-flex; width: fit-content; min-width: 40px; height: 24px; align-items: center; justify-content: center; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; padding: 0 7px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); font: var(--dsw-font-markdown-code-block-small); }
.dsh-a11y-keyboard-list strong { font: var(--dsw-font-xs-strong-13); }
.dsh-a11y-keyboard-list span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-a11y-role-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-a11y-role-grid > div { display: grid; grid-template-columns: 90px minmax(0, 1fr); grid-template-rows: auto auto; gap: 3px 12px; align-items: center; min-height: 72px; padding: 12px 14px; background: var(--dsw-alias-bg-layer-1); }
.dsh-a11y-role-grid .dsh-a11y-role { grid-row: span 2; color: var(--dsw-alias-state-business-primary); border-color: var(--dsw-alias-state-business-primary); background: transparent; }
.dsh-a11y-role-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-a11y-role-grid small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-a11y-focus-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 16px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
.dsh-a11y-focus-demo button { display: inline-flex; align-items: center; gap: 6px; height: 32px; border: 0; border-radius: 16px; padding: 0 12px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); font: var(--dsw-font-xs-13); }
.dsh-a11y-focus-demo button[data-focus-demo="true"] { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-a11y-focus-demo label { display: inline-flex; align-items: center; gap: 6px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-a11y-focus-demo > span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-running-state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-running-state-grid > div { display: grid; grid-template-columns: 20px minmax(0, 1fr); grid-template-rows: auto auto; column-gap: 10px; row-gap: 3px; align-items: center; min-height: 84px; padding: 16px; background: var(--dsw-alias-bg-layer-1); }
.dsh-running-state-grid > div > svg { grid-row: span 2; color: var(--dsw-alias-state-business-primary); }
.dsh-running-state-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-running-state-grid span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-running-reasoning { position: relative; overflow: hidden; }
.dsh-running-reasoning::after { content: ''; position: absolute; inset-block: 0; left: 0; width: 300px; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent), transparent); animation: dsh-board-thinking-sweep 2.6s ease-out infinite; pointer-events: none; }
.dsh-running-shimmer { color: var(--dsw-alias-state-business-primary); background: linear-gradient(90deg, var(--dsw-alias-state-business-primary) 0%, var(--dsw-alias-label-primary-foreground) 48%, var(--dsw-alias-state-business-primary) 100%); background-size: 220% 100%; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: dsh-board-text-shimmer 1.8s linear infinite; }
@keyframes dsh-board-text-shimmer { from { background-position: 200% 0; } to { background-position: -20% 0; } }
.dsh-running-button button { display: inline-flex; grid-row: span 2; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-info-fill); }
.dsh-state-matrix { border: 0; background: transparent; }
.dsh-state-matrix > div { min-height: 88px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); background: transparent; }
.dsh-state-matrix > div:nth-child(odd) { padding-right: 18px; }
.dsh-state-matrix > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-state-matrix small { grid-column: 2; color: var(--dsw-alias-label-tertiary); }
.dsh-responsive-table > div { grid-template-columns: 150px minmax(0, 1fr) 190px; }
.dsh-responsive-table code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-checklist { border: 0; background: transparent; }
.dsh-checklist > div { min-height: 50px; padding: 12px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); background: transparent; }
.dsh-checklist svg { color: var(--dsw-alias-state-business-primary); }
.dsh-a11y-checklist { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-checklist > div { display: grid; grid-template-columns: 18px 130px minmax(0, 1fr) 260px; gap: 12px; align-items: center; min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-checklist svg { color: var(--dsw-alias-state-business-primary); }
.dsh-a11y-checklist strong { font: var(--dsw-font-xs-strong-13); }
.dsh-a11y-checklist span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-a11y-checklist small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-exception-list > div {  display: grid; grid-template-columns: 18px 150px minmax(0, 1fr) 250px; gap: 12px; align-items: center; min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-exception-list svg { color: var(--dsw-alias-state-error-primary); }
.dsh-exception-list strong { font: var(--dsw-font-xs-strong-13); }
.dsh-exception-list span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-exception-list code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-chat-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-chat-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-chat-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-chat-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-chat-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-chat-flow-specimen { position: relative; min-height: 560px; padding: 16px calc(var(--dsw-board-gutter, 32px) + 16px); overflow: hidden; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); }
.dsh-chat-flow-column { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 748px; margin: 0 auto; }
.dsh-chat-load-older { display: flex; justify-content: center; }
.dsh-chat-load-older button { border: 0; border-radius: 14px; padding: 4px 12px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover-solid); font: var(--dsw-font-xxs-12); }
.dsh-chat-context-row { display: flex; align-items: center; min-width: 0; height: 24px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-s-14); }
.dsh-chat-context-row svg { flex: none; margin-right: 6px; color: var(--dsw-alias-label-secondary); }
.dsh-chat-context-row i, .dsh-chat-stats i { flex: none; width: 2px; height: 2px; margin: 0 8px; border-radius: 1px; background: var(--dsw-alias-label-caption); }
.dsh-chat-context-row span { flex: none; color: var(--dsw-alias-label-primary-dimmed); }
.dsh-chat-context-row small { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); font: inherit; text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-user-row { display: flex; justify-content: flex-end; }
.dsh-chat-user-bubble { max-width: min(525px, 82%); border-radius: 22px; padding: 10px 16px; color: var(--dsw-alias-label-primary); background: var(--dsw-specific-bubble); font: var(--dsw-font-base-16); }
.dsh-chat-assistant { max-width: 748px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-markdown-base); }
.dsh-chat-assistant p { margin: 0; }
.dsh-chat-reasoning { position: relative; display: flex; align-items: center; min-width: 0; height: 24px; overflow: hidden; gap: 6px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-chat-reasoning[data-running="true"]::after { position: absolute; inset-block: 0; left: 0; width: 300px; content: ''; background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent) 55%, transparent 100%); animation: dsh-board-chat-reasoning-sweep 2.6s ease-out infinite; pointer-events: none; }
.dsh-chat-reasoning > svg:first-child { flex: none; color: var(--dsw-alias-state-business-primary); }
.dsh-chat-reasoning strong { font: var(--dsw-font-s-14); }
.dsh-chat-reasoning i { flex: none; width: 2px; height: 2px; margin: 0 2px; border-radius: 1px; background: var(--dsw-alias-label-caption); }
.dsh-chat-reasoning span { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-reasoning > svg:last-child { flex: none; color: var(--dsw-alias-label-secondary); }
@keyframes dsh-board-chat-reasoning-sweep { 0% { left: -300px; } 90%, 100% { left: 100%; } }
.dsh-chat-tool { display: grid; grid-template-columns: 18px auto 2px minmax(0, 1fr) 14px; gap: 8px; align-items: center; min-height: 24px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-chat-tool > svg { color: var(--dsw-alias-label-secondary); }
.dsh-chat-tool strong { font: var(--dsw-font-s-14); }
.dsh-chat-tool i { width: 2px; height: 2px; border-radius: 1px; background: var(--dsw-alias-label-caption); }
.dsh-chat-tool span { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-error { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: 8px; align-items: start; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-chat-error > span { width: 8px; height: 8px; margin-top: 6px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); }
.dsh-chat-error > div { display: flex; flex-wrap: wrap; gap: 0 6px; min-width: 0; }
.dsh-chat-error strong { color: var(--dsw-alias-state-error-primary); font: var(--dsw-font-xs-strong-13); }
.dsh-chat-error code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-chat-error button { height: 28px; border: 0; border-radius: 14px; padding: 0 10px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); font: var(--dsw-font-xxs-12); }
.dsh-chat-turn-status { display: inline-flex; align-self: flex-start; align-items: center; height: 26px; color: transparent; background: linear-gradient(90deg, var(--dsw-static-deepseek-500) 0%, var(--dsw-static-deepseek-500) 40%, var(--dsw-static-deepseek-200) 50%, var(--dsw-static-deepseek-500) 60%, var(--dsw-static-deepseek-500) 100%); background-position: 100% 0; background-size: 250% 100%; background-clip: text; font: var(--dsw-font-s-strong-14); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: dsh-board-chat-shimmer 1.8s linear infinite; }
.dsh-chat-turn-status span { margin-left: 8px; color: var(--dsw-alias-label-caption); font: var(--dsw-font-xs-13); font-weight: 400; -webkit-text-fill-color: var(--dsw-alias-label-caption); }
@keyframes dsh-board-chat-shimmer { to { background-position: 0 0; } }
.dsh-chat-pending { align-self: flex-end; max-width: min(525px, 82%); border-radius: 22px; padding: 10px 16px; color: var(--dsw-alias-label-primary); background: var(--dsw-specific-bubble); font: var(--dsw-font-base-16); }
.dsh-chat-stats { display: block; width: 100%; overflow: hidden; padding-top: 4px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); line-height: 20px; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-stats i { display: inline-block; vertical-align: middle; }
.dsh-chat-to-bottom { position: absolute; right: max(16px, calc((100% - 748px) / 2)); bottom: 16px; display: flex; width: 34px; height: 34px; align-items: center; justify-content: center; border: 1px solid var(--dsw-alias-border-l2); border-radius: 50%; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-button-floating-fill); box-shadow: var(--dsw-shadow-lv2); }
.dsh-chat-dock-order { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-chat-dock-order > div { display: grid; gap: 5px; min-height: 92px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-chat-dock-order strong { font: var(--dsw-font-xs-strong-13); }
.dsh-chat-dock-order code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-chat-dock-order span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-sidebar-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-sidebar-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-sidebar-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-sidebar-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-specimen { display: grid; align-content: start; gap: 4px; width: min(320px, 100%); min-height: 468px; padding: 10px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; overflow: hidden; background: var(--dsw-specific-sidebar-fill); }
.dsh-sidebar-specimen > * { min-width: 0; }
.dsh-sidebar-brand { display: flex; align-items: center; gap: 6px; height: 42px; padding: 0 10px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-sidebar-brand span { color: var(--dsw-alias-label-tertiary); font-weight: 400; }
.dsh-sidebar-brand button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; margin-left: auto; border: 0; border-radius: 50%; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-sidebar-new { display: flex; align-items: center; justify-content: center; gap: 6px; height: 38px; margin: 0 2px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; padding: 0 16px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-button-elevated-fill); text-align: left; font: var(--dsw-font-s-14); }
.dsh-sidebar-new:hover { background: var(--dsw-alias-button-floating-hover); }
.dsh-sidebar-section-title { display: flex; align-items: center; justify-content: space-between; height: 36px; padding: 0 4px; margin-top: 6px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-section-title > div { display: flex; gap: 2px; }
.dsh-sidebar-section-title button, .dsh-sidebar-workbench > svg:last-child, .dsh-sidebar-project > svg:last-child { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-sidebar-section-title button:hover, .dsh-sidebar-workbench:hover, .dsh-sidebar-project:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-sidebar-workbench, .dsh-sidebar-project { display: flex; align-items: center; gap: 7px; min-width: 0; min-height: 34px; padding: 0 8px; border-radius: 8px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-workbench > strong, .dsh-sidebar-project > strong { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xs-strong-13); }
.dsh-sidebar-rename { width: 218px; margin: 0 0 4px 20px; padding: 4px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-specific-menu); box-shadow: var(--dsw-shadow-lv3); }
.dsh-sidebar-rename button { display: flex; align-items: center; gap: 8px; width: 100%; height: 40px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; text-align: left; font: var(--dsw-font-s-14); }
.dsh-sidebar-rename button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-sidebar-rename .is-danger { color: var(--dsw-alias-state-error-primary); }
.dsh-sidebar-rename hr { height: 1px; margin: 4px 8px; border: 0; background: var(--dsw-alias-border-l1); }
.dsh-sidebar-session { display: flex; align-items: center; gap: 6px; min-width: 0; height: 32px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; text-align: left; font: var(--dsw-font-xs-13); }
.dsh-sidebar-session[data-selected="true"], .dsh-sidebar-session:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-sidebar-session > span:nth-child(2) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-sidebar-session time { margin-left: auto; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-sidebar-session-empty { width: 6px; height: 6px; margin: 0 5px; border-radius: 50%; background: var(--dsw-alias-label-caption); }
.dsh-sidebar-state-grid, .dsh-session-action-grid, .dsh-composer-state-grid, .dsh-trajectory-state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-sidebar-state-grid > div, .dsh-session-action-grid > div, .dsh-composer-state-grid > div, .dsh-trajectory-state-grid > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 4px; min-height: 84px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-sidebar-state-grid svg, .dsh-session-action-grid svg { grid-row: span 2; color: var(--dsw-alias-label-tertiary); }
.dsh-sidebar-state-grid strong, .dsh-session-action-grid strong, .dsh-composer-state-grid strong, .dsh-trajectory-state-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-sidebar-state-grid span, .dsh-session-action-grid span, .dsh-composer-state-grid span, .dsh-trajectory-state-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-session-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-session-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-session-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-session-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-session-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-session-header-specimen { border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); }
.dsh-session-title-row { display: flex; align-items: center; gap: 0; min-height: 32px; padding: 12px 28px 0 20px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-session-title-row > nav { display: flex; align-items: center; gap: 5px; min-width: 0; margin-right: auto; white-space: nowrap; font: var(--dsw-font-xs-13); }
.dsh-session-title-row nav button { max-width: 160px; overflow: hidden; border: 0; border-radius: 12px; padding: 4px 8px; color: var(--dsw-alias-label-tertiary); background: transparent; text-overflow: ellipsis; white-space: nowrap; font: inherit; }
.dsh-session-title-row nav strong { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-primary); text-overflow: ellipsis; font: var(--dsw-font-xs-strong-13); }
.dsh-session-header-actions, .dsh-session-header-tools { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsh-session-header-tools { margin-left: 20px; }
.dsh-session-preset, .dsh-session-subagents, .dsh-session-jobs { display: inline-flex; align-items: center; gap: 3px; min-height: 28px; max-width: 190px; overflow: hidden; border: 0; border-radius: 6px; padding: 3px 2px; color: var(--dsw-alias-label-tertiary); background: transparent; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xxs-12); }
.dsh-session-subagents span:not(.dsh-session-running-dot), .dsh-session-jobs span:not(.dsh-session-running-dot) { margin: 0 5px; }
.dsh-session-subagents:hover, .dsh-session-jobs:hover { color: var(--dsw-alias-label-secondary); }
.dsh-session-preset svg, .dsh-session-subagents svg, .dsh-session-jobs svg { flex: none; }
.dsh-session-log { display: inline-flex; align-items: center; gap: 6px; height: 32px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; padding: 0 10px; color: var(--dsw-alias-label-secondary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-session-tabs { position: relative; display: flex; gap: 36px; min-height: 35px; margin-top: 4px; padding-left: 8px; }
.dsh-session-tabs button { position: relative; border: 0; padding: 0 0 11px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); line-height: 16px; font-weight: 500; }
.dsh-session-tabs button[aria-selected="true"] { color: var(--dsw-alias-label-primary); }
.dsh-session-tabs button[aria-selected="true"]::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 2px; border-radius: 2px 2px 0 0; background: var(--dsw-alias-label-primary); }
.dsh-composer-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-composer-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-composer-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-composer-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-composer-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-composer-surface { width: min(780px, 100%); margin: 0 auto; }
.dsh-composer-dock-stack { display: grid; gap: 4px; margin: 0 16px 4px; }
.dsh-composer-dock-stack > div { display: grid; grid-template-columns: 18px auto minmax(0, 1fr) auto; gap: 7px; align-items: center; min-height: 36px; padding: 0 10px; border-radius: 12px; color: var(--dsw-alias-label-secondary); background: var(--dsh-board-specific-tip, var(--dsw-specific-tip)); font: var(--dsw-font-xs-13); }
.dsh-composer-dock-stack > div > span { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); text-overflow: ellipsis; white-space: nowrap; }
.dsh-composer-dock-stack > div > svg { color: var(--dsw-alias-label-tertiary); }
.dsh-composer-dock-stack button { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-composer-notice { width: calc(100% - 32px); margin: 0 16px 6px; padding: 4px 8px; border-radius: 8px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); font: var(--dsw-font-xxs-12); }
.dsh-composer-real-card { overflow: hidden; border: 1px solid var(--dsw-alias-border-l2-darkmode-thin); border-radius: 22px; box-shadow: var(--dsw-shadow-lv2); background: var(--dsw-specific-input-major); }
.dsh-composer-real-attachments { display: flex; align-items: center; gap: 10px; min-height: 76px; padding: 10px 16px 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-composer-real-attachments > div { position: relative; display: inline-flex; width: 64px; height: 64px; align-items: center; justify-content: center; border-radius: 16px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); }
.dsh-composer-real-attachments button { position: absolute; top: -4px; right: -4px; display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-state-error-primary); }
.dsh-composer-real-text { position: relative; min-height: 104px; padding: 12px 16px 0; }
.dsh-composer-real-text textarea, .dsh-composer-real-text > div { display: block; width: 100%; min-height: 78px; margin: 0; border: 0; outline: 0; resize: none; color: var(--dsw-alias-label-primary); background: transparent; font: var(--dsw-font-base-16); line-height: 24px; }
.dsh-composer-real-text > div { position: absolute; inset: 12px 16px 0; color: transparent; pointer-events: none; }
.dsh-composer-real-text mark { color: transparent; border-radius: 6px; background: rgba(97, 135, 216, 0.22); }
.dsh-composer-real-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0; padding: 2px 8px 6px; }
.dsh-composer-real-tools, .dsh-composer-real-trailing { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dsh-composer-real-tools { gap: 16px; }
.dsh-composer-real-row select { max-width: 180px; height: 28px; min-width: 0; overflow: hidden; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; font: var(--dsw-font-xs-13); }
.dsh-composer-real-row select:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-composer-real-add, .dsh-composer-real-send { display: inline-flex; flex: none; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; padding: 0; color: var(--dsw-alias-label-secondary); }
.dsh-composer-real-add { background: var(--dsw-specific-selector); }
.dsh-composer-real-meter { height: 28px; border: 0; border-radius: 14px; padding: 0 8px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-composer-real-send { width: 34px; height: 34px; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-info-fill); transform: translateY(-2px); }
.dsh-composer-real-stats { overflow: hidden; padding: 4px 16px 0; color: var(--dsw-alias-label-tertiary); text-align: center; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xxs-12); }
.dsh-composer-real-stats i { display: inline-block; width: 2px; height: 2px; margin: 0 8px; border-radius: 1px; background: var(--dsw-alias-label-caption); vertical-align: middle; }
.dsh-composer-state-grid > div { grid-template-columns: minmax(0, 1fr); min-height: 76px; }
.dsh-trajectory-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-trajectory-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-trajectory-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-trajectory-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-trajectory-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-trajectory-frame { min-width: 0; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); }
.dsh-trajectory-toolbar { display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 6px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-trajectory-toolbar > button { display: inline-flex; align-items: center; gap: 4px; height: 20px; border: 0; border-radius: 3px; padding: 0 7px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-trajectory-toolbar > button[data-active="true"], .dsh-trajectory-toolbar > button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-trajectory-toolbar label { display: flex; align-items: center; gap: 5px; width: 164px; min-width: 84px; height: 20px; margin-left: auto; padding: 0 8px; border-radius: 3px; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-trajectory-toolbar input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--dsw-alias-label-primary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-trajectory-timeline { display: grid; grid-template-columns: 44px minmax(0, 1fr); height: 50px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-trajectory-lanes { display: grid; grid-template-rows: repeat(3, 1fr); padding: 8px 4px; color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); }
.dsh-trajectory-lanes span { display: flex; align-items: center; }
.dsh-trajectory-bars { position: relative; display: grid; grid-template-rows: repeat(3, 1fr); gap: 3px; padding: 8px 12px; overflow: hidden; }
.dsh-trajectory-bars i { display: block; height: 12px; border-radius: 3px; background: var(--dsw-alias-state-business-tertiary); }
.dsh-trajectory-bars .is-input { width: 35%; }
.dsh-trajectory-bars .is-model { width: 68%; background: var(--dsw-alias-state-business-primary); }
.dsh-trajectory-bars .is-tool { width: 48%; background: var(--dsw-alias-label-caption); }
.dsh-trajectory-bars .is-error { position: absolute; top: 37px; left: 51%; width: 12%; height: 12px; background: var(--dsw-alias-state-error-primary); }
.dsh-trajectory-bars small { position: absolute; right: 12px; bottom: 2px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-11); }
.dsh-trajectory-body { display: grid; grid-template-columns: minmax(0, 1fr) 280px; min-height: 330px; }
.dsh-trajectory-ledger { min-width: 0; padding: 8px 0 12px; overflow: hidden; }
.dsh-trajectory-load-earlier { height: 30px; padding: 7px 12px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-row { display: grid; grid-template-columns: 122px minmax(0, 1fr) 46px; gap: 8px; align-items: center; min-height: 30px; padding: 0 10px; border-left: 3px solid transparent; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-row:hover, .dsh-trajectory-row.is-selected { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-trajectory-row.is-selected { border-left-color: var(--dsw-alias-state-business-primary); }
.dsh-trajectory-event { display: flex; align-items: center; gap: 7px; min-width: 0; }
.dsh-trajectory-event b { color: var(--dsw-alias-label-caption); font: var(--dsw-font-markdown-code-block-small); }
.dsh-trajectory-event em { min-width: 0; overflow: hidden; color: var(--dsw-alias-state-business-primary); font-style: normal; font: var(--dsw-font-xxxs-strong-11); text-overflow: ellipsis; }
.dsh-trajectory-content { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-trajectory-row time { color: var(--dsw-alias-label-tertiary); text-align: right; font: var(--dsw-font-xxxs-11); }
.dsh-trajectory-row.kind-tool .dsh-trajectory-event em, .dsh-trajectory-row.kind-subtool .dsh-trajectory-event em { color: var(--dsw-alias-label-secondary); }
.dsh-trajectory-row.kind-compacted .dsh-trajectory-event em, .dsh-trajectory-row.kind-context .dsh-trajectory-event em { color: var(--dsw-alias-label-tertiary); }
.dsh-trajectory-turn-break { display: flex; align-items: center; gap: 8px; min-height: 28px; padding: 8px 12px 4px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-turn-break i { flex: 1; height: 2px; background: var(--dsw-alias-border-l2); }
.dsh-trajectory-turn-break small { font: var(--dsw-font-xxxs-11); }
.dsh-trajectory-inspector { min-width: 0; border-left: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); }
.dsh-trajectory-inspector header { display: flex; align-items: center; justify-content: space-between; height: 42px; padding: 0 10px 0 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); font: var(--dsw-font-xs-strong-13); }
.dsh-trajectory-inspector header button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-trajectory-inspector nav { display: flex; gap: 14px; height: 34px; overflow: auto; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-trajectory-inspector nav button { flex: none; height: 34px; border: 0; padding: 0 5px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-trajectory-inspector nav button[data-active="true"] { color: var(--dsw-alias-label-primary); border-bottom: 2px solid var(--dsw-alias-state-business-primary); }
.dsh-trajectory-inspector-body { display: grid; gap: 12px; padding: 14px; overflow: auto; }
.dsh-trajectory-inspector-body dl { display: grid; gap: 7px; margin: 0; }
.dsh-trajectory-inspector-body dl > div { display: flex; justify-content: space-between; gap: 10px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-inspector-body dd { margin: 0; color: var(--dsw-alias-label-secondary); text-align: right; }
.dsh-trajectory-inspector-body .is-success { color: var(--dsw-alias-state-success-primary); }
.dsh-trajectory-inspector-body h4 { margin: 0; font: var(--dsw-font-xs-strong-13); }
.dsh-trajectory-inspector-body pre { max-height: 132px; margin: 0; overflow: auto; padding: 10px; border-radius: 8px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-markdown-code-block); font: var(--dsw-font-markdown-code-block-small); white-space: pre-wrap; }
.dsh-overview-page-map { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-overview-page-map > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 4px; min-height: 98px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-overview-page-map > div:nth-child(odd) { padding-right: 18px; }
.dsh-overview-page-map > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-overview-page-map svg { grid-row: span 2; color: var(--dsw-alias-label-tertiary); }
.dsh-overview-page-map strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overview-page-map span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overview-workflow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 20px; padding-top: 4px; }
.dsh-overview-workflow > div { display: grid; grid-template-columns: 24px minmax(0, 1fr); column-gap: 10px; row-gap: 5px; min-width: 0; }
.dsh-overview-workflow b { display: inline-flex; grid-row: span 2; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 50%; color: var(--dsw-alias-state-business-primary); background: var(--dsw-alias-state-business-tertiary); font: var(--dsw-font-xxs-strong-12); }
.dsh-overview-workflow strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overview-workflow span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-session-running-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-business-primary); }
@container (max-width: 900px) {
  .dsh-specimen-content { padding: 32px 28px 52px; }
  .dsh-board-table-head, .dsh-board-table-row { grid-template-columns: 100px minmax(130px, 1fr) minmax(130px, 1fr); }
  .dsh-board-table-head span:nth-child(n+4), .dsh-board-table-row > :nth-child(n+4) { display: none; }
  .dsh-exception-list > div { grid-template-columns: 18px 120px minmax(0, 1fr); }
  .dsh-exception-list code { grid-column: 3; }
}
@container (max-width: 720px) {
  .dsh-specimen-content { padding: 24px 18px 42px; }
  .dsh-foundation-layer-table > div, .dsh-foundation-theme-table > div, .dsh-foundation-font-table > div, .dsh-chat-rule-table > div, .dsh-composer-rule-table > div, .dsh-trajectory-rule-table > div, .dsh-overlay-rule-table > div, .dsh-settings-rule-table > div, .dsh-sidebar-rule-table > div, .dsh-session-rule-table > div, .dsh-shell-rule-table > div, .dsh-board-table-head, .dsh-board-table-row { grid-template-columns: 1fr; gap: 4px; align-items: start; min-height: 0; padding: 12px 0; }
  .dsh-foundation-layer-table small { grid-column: auto; }
  .dsh-foundation-layer-table strong { grid-row: auto; }
  .dsh-foundation-layer-table code, .dsh-foundation-theme-table code, .dsh-foundation-font-table code, .dsh-chat-rule-table code, .dsh-composer-rule-table code, .dsh-trajectory-rule-table code, .dsh-overlay-rule-table code, .dsh-settings-rule-table code, .dsh-sidebar-rule-table code, .dsh-session-rule-table code, .dsh-shell-rule-table code, .dsh-a11y-checklist > div { white-space: normal; overflow-wrap: anywhere; }
  .dsh-a11y-checklist > div { grid-template-columns: 18px minmax(0, 1fr); gap: 4px; align-items: start; min-height: 0; padding: 12px 0; }
  .dsh-a11y-checklist strong, .dsh-a11y-checklist span, .dsh-a11y-checklist small { grid-column: 2; }
  .dsh-chat-reasoning, .dsh-chat-tool, .dsh-chat-error, .dsh-chat-turn-status, .dsh-chat-stats { min-width: 0; max-width: 100%; }
  .dsh-chat-reasoning span, .dsh-chat-tool span, .dsh-chat-error span, .dsh-chat-turn-status span, .dsh-chat-stats span, .dsh-chat-rule-table span { min-width: 0; overflow-wrap: anywhere; white-space: normal; }
  .dsh-chat-reasoning i { flex: 0 1 24px; min-width: 8px; }
  .dsh-specimen-heading { display: block; }
  .dsh-specimen-source { display: block; max-width: 100%; margin-top: 8px; }
  .dsh-board-layer-strip, .dsh-board-callouts, .dsh-specimen-icon-grid, .dsh-primitive-input-row, .dsh-shell-state-grid, .dsh-overlay-duo, .dsh-settings-comparison, .dsh-state-matrix, .dsh-a11y-role-grid, .dsh-running-state-grid, .dsh-sidebar-state-grid, .dsh-session-action-grid, .dsh-composer-state-grid, .dsh-trajectory-state-grid, .dsh-foundation-rule-grid { grid-template-columns: 1fr; }
  .dsh-overview-page-map, .dsh-overview-workflow { grid-template-columns: 1fr; }
  .dsh-overview-page-map > div:nth-child(odd), .dsh-overview-page-map > div:nth-child(even) { padding-right: 0; padding-left: 0; border-left: 0; }
  .dsh-sidebar-specimen { grid-template-columns: 1fr; }
  .dsh-sidebar-specimen > div:last-child { min-height: 120px; }
  .dsh-session-title-row { align-items: flex-start; flex-wrap: wrap; gap: 8px; }
  .dsh-session-title-row > nav { flex-basis: 100%; }
  .dsh-session-header-tools { margin-left: auto; }
  .dsh-trajectory-body { grid-template-columns: 1fr; }
  .dsh-trajectory-inspector { border-top: 1px solid var(--dsw-alias-border-l2); border-left: 0; }
  .dsh-trajectory-row { grid-template-columns: 50px minmax(0, 1fr) 40px; }
  .dsh-trajectory-event em { font-size: 0; }
  .dsh-trajectory-event em::first-letter { font-size: 10px; }
  .dsh-board-layer-strip > div { border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
  .dsh-board-layer-strip > div:last-child { border-bottom: 0; }
  .dsh-board-callouts { gap: 14px; }
  .dsh-specimen-token-row { grid-template-columns: 28px minmax(0, 1fr); padding: 10px 0; }
  .dsh-specimen-token-row > span:last-child { grid-column: 2; white-space: normal; }
  .dsh-specimen-type-head { display: none; }
  .dsh-specimen-type-row { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
  .dsh-specimen-type-row code { white-space: normal; }
  .dsh-foundation-metric-table > div, .dsh-foundation-motion-table > div { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
  .dsh-specimen-icon-item:nth-child(even), .dsh-settings-recipe-grid > div:nth-child(even), .dsh-state-matrix > div:nth-child(even), .dsh-primitive-catalog > div:nth-child(even) { padding-left: 0; border-left: 0; }
  .dsh-specimen-icon-item:nth-child(odd), .dsh-settings-recipe-grid > div:nth-child(odd), .dsh-state-matrix > div:nth-child(odd), .dsh-primitive-catalog > div:nth-child(odd) { padding-right: 0; }
  .dsh-settings-recipe-grid, .dsh-primitive-catalog { grid-template-columns: 1fr; }
  .dsh-board-table-head, .dsh-board-table-row { grid-template-columns: 1fr; gap: 4px; }
  .dsh-board-table-head span, .dsh-board-table-row > * { display: block; }
  .dsh-board-geometry-table > div { grid-template-columns: 1fr; gap: 3px; padding: 12px 0; }
  .dsh-shell-diagram { grid-template-columns: 1fr; }
  .dsh-shell-details { min-height: 110px; }
  .dsh-responsive-table > div { grid-template-columns: 1fr; gap: 4px; align-items: start; padding: 12px 0; }
  .dsh-overlay-menu-specimen { display: grid; grid-template-columns: 1fr; }
  .dsh-overlay-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh-overlay-modal-card { inset: 18px 12px; padding: 16px; }
  .dsh-module-settings-panel { grid-template-columns: 1fr; min-height: 0; border-radius: 16px; }
  .dsh-module-settings-nav { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 12px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
  .dsh-module-settings-nav > strong { grid-column: 1 / -1; margin-bottom: 4px; padding: 0; }
  .dsh-module-settings-nav button { justify-content: center; padding: 8px; font-size: 0; }
  .dsh-module-settings-nav button svg { width: 16px; height: 16px; }
  .dsh-module-settings-options { padding: 18px; }
  .dsh-running-state-grid > div { min-height: 72px; padding: 12px 0; }
  .dsh-a11y-keyboard-list > div { grid-template-columns: 60px 1fr; gap: 8px; padding: 10px 0; }
  .dsh-a11y-keyboard-list span { grid-column: 2; }
  .dsh-a11y-role-grid > div { grid-template-columns: 78px minmax(0, 1fr); }
  .dsh-exception-list > div { grid-template-columns: 18px minmax(0, 1fr); gap: 8px; padding: 10px 0; }
  .dsh-exception-list strong, .dsh-exception-list span, .dsh-exception-list code { grid-column: 2; }
  .dsh-exception-list svg { grid-row: span 3; }
}
@container (max-width: 260px) {
  .dsh-specimen-content { padding-inline: 12px; }
  .dsh-icon-geometry-grid { grid-template-columns: 1fr; }
  .dsh-icon-geometry-grid > div { grid-template-columns: 42px minmax(0, 1fr); padding: 12px; }
  .dsh-specimen-icon-item code, .dsh-specimen-icon-item span { text-overflow: clip; white-space: normal; overflow-wrap: anywhere; }
  .dsh-primitive-input-row label, .dsh-primitive-input-row .dsh-primitive-input { width: 100%; min-width: 0; }
  .dsh-primitive-input-row .dsh-primitive-input input { width: 100%; }
  .dsh-trajectory-toolbar { height: auto; min-height: 32px; flex-wrap: wrap; padding-block: 6px; }
  .dsh-trajectory-toolbar label { flex-basis: 100%; width: 100%; min-width: 0; margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-specimen-board *, .dsh-specimen-board *::before, .dsh-specimen-board *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
}
`;
