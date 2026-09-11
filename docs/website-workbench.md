# Website Workbench

The built-in workbench.website application and workbench.website:from-url template are registered by the Client fiber. No new Host routes or better-sidebar dependency.

## Creation

Selecting an application/template creates a transient draft. Applications may supply renderCreate with controlled config and optional title suggestions. The user confirms a name before committing. Single-instance choices open an existing instance. startCreation accepts optional title/config overrides in one transaction. Changed applications or template definitions invalidate the draft. Closing before submission writes nothing; errors preserve inputs.

The creation dialog uses the same 32px superellipse corner geometry as DSH settings. Embedded website configuration uses native DSH Input, Menu and Switch components. Name and URL fields come first; opening mode and site trust follow as divided settings rows. The favicon stays inside the URL input instead of adding a preview row. The trust/compatibility switch starts off and includes a one-sentence display-impact and isolation warning. The creation launcher and template chooser retain their existing styles; only the decorative icon alignment changes. Trust is saved in the initial creation transaction; changing origin (including protocol or port), entering an invalid URL, or choosing external mode clears that consent.

Website URLs accept HTTP/HTTPS, bare domains (HTTPS default), and domain:port. Credentials, invalid schemes, and loopback aliases are rejected. Persisted URLs are canonical. Empty draft defaults are valid; optional config.validateCreation rejects them at the creation boundary.

## Favicon

The direct same-site /favicon.ico image loads on URL-field blur, and appears in the sidebar and home card. An SVG color filter maps luminance to inherited DSH semantic icon color, retaining detail and transparency. Missing images use the native globe. No third-party favicon service or HTML metadata proxy. This version does not discover alternate icon declarations or website titles: the editable default name is the hostname. Icon renderers receive optional instance props.

## Presentation

An open webpage owns the whole workbench area: the embedded frame is the only child of the website surface, with no host toolbar, address bar or status band above it. Any host control that used to sit there is gone by request. Webpage settings therefore live in the sidebar: open the instance menu (the ellipsis on the dshfind row) and choose 网页设置.

## Website Permissions

Embedding defaults to an opaque sandbox without allow-same-origin or top-navigation, like better-sidebar. A load event is not proof cross-origin content rendered. A blocking failure shows an in-surface fallback whose 在浏览器打开 link stays clickable; that fallback is the only action the surface itself renders. External mode opens a new tab on an explicit open action from the sidebar/home; browsers can block asynchronous popups after creation, so the fallback link remains.

Sites requiring cookies/storage or same-origin script fetching may fail in strict mode. Website settings provide an explicit trusted-site opt-in stored as trustedOrigin, matching the exact configured origin. This adds allow-same-origin and reduces isolation: malicious sites or redirects may threaten DSH data. Only use it for trusted sites. Consent binds to the origin and revision when settings open; changed config requires reopening settings. The GUI origin is never embedded. Trusted mode is never automatic. An HTTPS GUI does not attempt an HTTP iframe.

## Sidebar Reference

Inspected dsh-better-sidebar 0.19.0-alpha.1: its browser normalizes URLs and derives names from hostname. Its private /sidebar/api/browser.probe endpoint supplies response headers for approximate XFO/CSP refusal detection, not HTML/title/favicon metadata. No public probe method exists, so Workbench does not import the private implementation or couple to this endpoint.

## Verification

Run pnpm run check, pnpm test and pnpm run build. Website tests cover URL policy, atomic template overrides, invalid inputs, repository remount and app re-registration, favicon fallback and iframe permission defaults. Real GUI checks are additionally required for cross-origin assets and layout.

Rebuild lib/client.js and refresh the existing GUI unless a matching Client watcher is active. No Host restart is required. Local artifacts are not a published release.
