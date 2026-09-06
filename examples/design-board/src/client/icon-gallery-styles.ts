export const ICON_GALLERY_STYLE = `
.dsh-icon-meta { display:flex; flex-wrap:wrap; gap:8px 20px; font:var(--dsw-font-xxs-12); color:var(--dsw-alias-label-tertiary); }
.dsh-icon-meta code { overflow-wrap:anywhere; }
.dsh-icon-library-toolbar { display:flex; align-items:center; flex-wrap:wrap; gap:12px; padding:20px 0; border-bottom:1px solid var(--dsw-alias-border-l1); }
.dsh-icon-library-toolbar > :first-child { flex:1; min-width:180px; }
.dsh-icon-library-toolbar select { max-width:100%; height:32px; border:1px solid var(--dsw-alias-border-l2); border-radius:8px; background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-primary); padding:0 8px; font:var(--dsw-font-xxs-12); }
.dsh-icon-library-toolbar > span { font:var(--dsw-font-xxs-12); color:var(--dsw-alias-label-tertiary); }
.dsh-icon-library-layout { display:grid; grid-template-columns:minmax(0,1fr) 260px; gap:28px; align-items:start; padding-top:24px; }
.dsh-icon-library-group { margin-bottom:28px; }
.dsh-icon-library-group h2 { display:flex; align-items:center; gap:10px; margin:0 0 14px; font:var(--dsw-font-xs-strong-13); }
.dsh-icon-library-group h2 span { color:var(--dsw-alias-label-tertiary); font:var(--dsw-font-xxxs-11); }
.dsh-icon-library-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(96px,1fr)); gap:8px; }
.dsh-icon-tile { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; min-width:0; height:104px; padding:8px 4px; border:1px solid var(--dsw-alias-border-l1); border-radius:6px; background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-primary); cursor:pointer; }
.dsh-icon-tile:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dsh-icon-tile[aria-pressed=true] { border-color:var(--dsw-alias-state-business-primary); background:var(--dsw-alias-interactive-bg-hover); }
.dsh-icon-tile:focus-visible, .dsh-icon-library-toolbar select:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px; }
.dsh-icon-tile-glyph { display:flex; align-items:center; justify-content:center; height:32px; width:32px; flex:none; }
.dsh-icon-tile strong { font:var(--dsw-font-xxs-12); text-align:center; overflow-wrap:anywhere; }
.dsh-icon-tile small { font:var(--dsw-font-xxxs-11); color:var(--dsw-alias-label-tertiary); }
.dsh-icon-inspector { position:sticky; top:20px; min-width:0; border-left:1px solid var(--dsw-alias-border-l1); padding-left:20px; }
.dsh-icon-inspector h2 { font:var(--dsw-font-base-strong-16); margin:0 0 6px; }
.dsh-icon-inspector code { font:var(--dsw-font-markdown-code-block-small); overflow-wrap:anywhere; color:var(--dsw-alias-label-tertiary); }
.dsh-icon-inspector-preview { height:132px; display:flex; align-items:center; justify-content:center; margin-top:16px; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); }
.dsh-icon-specimens { display:grid; grid-template-columns:1fr 1fr; }
.dsh-icon-specimens > div { display:flex; align-items:center; justify-content:center; gap:8px; min-height:48px; font:var(--dsw-font-xxxs-11); }
.dsh-icon-inverse { background:var(--dsw-alias-label-primary); color:var(--dsw-alias-bg-base); }
.dsh-icon-inspector dl { margin:16px 0; font:var(--dsw-font-xxs-12); }
.dsh-icon-inspector dl > div { padding:8px 0; border-bottom:1px solid var(--dsw-alias-border-l1); }
.dsh-icon-inspector dt { color:var(--dsw-alias-label-tertiary); margin-bottom:4px; }
.dsh-icon-inspector dd { margin:0; overflow-wrap:anywhere; }
.dsh-icon-inspector pre { white-space:pre-wrap; overflow-wrap:anywhere; font:var(--dsw-font-markdown-code-block-small); padding:12px; background:var(--dsw-alias-bg-layer-1); }
.dsh-icon-contexts { display:grid; gap:10px; font:var(--dsw-font-xxs-12); }
.dsh-icon-contexts > div { display:flex; align-items:center; flex-wrap:wrap; gap:6px; }
.dsh-icon-contexts small { color:var(--dsw-alias-label-tertiary); }
.dsh-icon-copy-status { display:block; min-height:22px; margin-top:6px; font:var(--dsw-font-xxs-12); color:var(--dsw-alias-label-secondary); }
.dsh-icon-empty { display:flex; align-items:center; flex-direction:column; gap:16px; padding:60px 12px; font:var(--dsw-font-xs-13); }
@container (max-width:760px) { .dsh-icon-library-layout { grid-template-columns:minmax(0,1fr); } .dsh-icon-inspector { position:static; border-left:0; border-top:1px solid var(--dsw-alias-border-l1); padding:20px 0 0; } .dsh-icon-inspector-preview { height:100px; } }
`
