export const WEBSITE_VIEW_STYLE = /* css */ `
.dsh-better-workbench-center-body:has(> .dsh-better-workbench-center-main > .dsh-better-workbench-website) { overflow: hidden; }
.dsh-better-workbench-center-main:has(> .dsh-better-workbench-website) { display: flex; flex: 1; min-height: 0; overflow: hidden; scrollbar-gutter: auto; }
.dsh-better-workbench-website { display: flex; flex: 1; flex-direction: column; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-base); font: var(--dsw-font-s-14); letter-spacing: 0; }
.dsh-better-workbench-website-iframe { display: block; flex: 1; width: 100%; height: 100%; min-width: 0; min-height: 0; border: 0; background: var(--dsw-alias-bg-base); }
.dsh-better-workbench-website-fallback { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 12px; min-width: 0; min-height: 0; padding: 20px; overflow: auto; color: var(--dsw-alias-label-secondary); text-align: center; overflow-wrap: anywhere; }
.dsh-better-workbench-website-fallback p { max-width: 100%; margin: 0; }
.dsh-better-workbench-website-external { display: inline-flex; align-items: center; gap: 4px; min-height: 24px; max-width: 100%; color: var(--dsw-alias-label-primary); text-decoration: none; overflow-wrap: anywhere; }
.dsh-better-workbench-website-external:hover { text-decoration: underline; }
.dsh-better-workbench-website-external:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
`
