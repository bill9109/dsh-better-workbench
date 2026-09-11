# Workbench References

Workbench contributes a single `@` source named `workbench` using the public `@deepseek-ai/dsh-client-ui-input-trigger/client` contract. No DSH core files or application-specific serializers are required.

## Behavior

- Typing `@` or a workbench name lists available saved instances under the Workbench section of the native suggestion menu. Existing file/session sources remain intact.
- Candidates use the current browser Workbench store, not another browser profile. Up to 50 matching instances are shown. Quoted file-path queries are left to the file source.
- Selection inserts a native reference chip containing the stable instance ID, with a cached human-readable label. Copy text is `@` followed by the instance name; plain-text paste is not guaranteed to reconstruct the chip.
- Sending invokes the Workbench codec through the existing DSH submission pipeline. It serializes an XML-escaped element containing instance_id, app_id and title, using the current metadata for the selected ID. No config, credentials, URLs, page content or business state are exported.
- Deleted or unavailable instances reject serialization. Cancelled sends reject. Unloading the plugin unregisters the source and invalidates retained callbacks.

Example model text:

```xml
<workbench instance_id="website-1" app_id="workbench.website" title="dshfind" />
```

## Boundaries

This is an instance identity reference, not a filesystem path. Instances currently live in browser IndexedDB; no per-instance Host file or model-readable resolver is created by this feature. A model cannot read a page or modify an instance from its ID alone. Exposing an actual readable workbench document or a general Host resolver would be separate plugin work, not an implied capability of this reference.

The provider registers within a Cordis inputTriggers injection scope, so late availability and provider replacement do not depend on plugin load order. Sources are owned by the injection fiber. Application authors need no additional registration.

## Verification

`tests/workbench-reference.mjs` covers candidates, name filtering, duplicate titles, bounds, escaping, metadata-only serialization, readiness/cancellation, stale references, and Cordis fiber disposal/remount. The assembled GUI was checked for the native candidate group and chip insertion without sending a model message.
