import { isBuiltin } from 'node:module'
import { resolve } from 'node:path'

/**
 * Local adapter for DSH's classic-script closure-factory protocol, audited against
 * packages/client/tsdown.client.ts and modules/src/client/system.ts in DSH
 * staging-20260904T144504Z (0.1.2-rc.1). That preset is not a package export.
 * The shell seeds these exact specifiers; inject controls activation, NOT require.
 * Other dynamic rows must be declared in dsh.client.external and supplied by DSH.
 * This deliberately supports JS/TS and TS-owned styles only, not DSH's CSS pipeline.
 * Runtime compatibility still requires a DSH Web shell with this module protocol.
 */
export const PLATFORM_MODULES = Object.freeze([
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
  '@deepseek-ai/cordis', '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots', '@deepseek-ai/dsh-client-ui-primitives',
])

export function clientBundle(manifest, { root, outDir = resolve(root, 'lib') }) {
  const requested = manifest.dsh?.client?.external ?? []
  if (!Array.isArray(requested) || requested.some(value => typeof value !== 'string' || !value)) {
    throw new Error('dsh.client.external must be an array of nonempty module specifiers')
  }
  const external = new Set([...PLATFORM_MODULES, ...requested])
  for (const specifier of external) {
    if (isBuiltin(specifier) || specifier.startsWith('.') || specifier.startsWith('/')) {
      throw new Error('Invalid client external: ' + specifier)
    }
  }
  const mode = process.env.NODE_ENV ?? 'production'
  return {
    name: manifest.name + '/client',
    entry: { client: resolve(root, 'src/client/index.ts') },
    tsconfig: resolve(root, 'tsconfig.json'),
    outDir,
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    dts: false,
    clean: false,
    sourcemap: true,
    failOnWarn: true,
    deps: {
      neverBundle: specifier => external.has(specifier),
      alwaysBundle: specifier => !external.has(specifier),
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env': JSON.stringify({ MODE: mode }),
    },
    inputOptions: {
      resolve: { conditionNames: [mode === 'development' ? 'development' : 'production', 'browser', 'import', 'module', 'default'] },
    },
    plugins: [{
      name: 'workbench-client-protocol',
      resolveId(source) {
        if (isBuiltin(source)) throw new Error('Node builtin cannot enter a client bundle: ' + source)
        if (/\.css(?:[?].*)?$/.test(source)) throw new Error('CSS imports need an explicit lifecycle-aware compiler: ' + source)
        const injected = manifest.dsh?.client?.inject ?? []
        const isPlugin = source.startsWith('@deepseek-ai/') || injected.some(name => source === name || source.startsWith(name + '/'))
        if (isPlugin && !external.has(source)) {
          throw new Error('Undeclared DSH client module: ' + source)
        }
        return null
      },
      generateBundle(_options, bundle) {
        const chunks = Object.values(bundle).filter(item => item.type === 'chunk')
        if (chunks.length !== 1 || chunks[0].fileName !== 'client.js') {
          throw new Error('DSH clients must emit exactly one client.js factory')
        }
        for (const specifier of [...chunks[0].imports, ...chunks[0].dynamicImports]) {
          if (!external.has(specifier)) throw new Error('Client import missed the module table: ' + specifier)
        }
      },
    }],
    outputOptions: {
      entryFileNames: 'client.js',
      codeSplitting: false,
      sourcemapExcludeSources: false,
      banner: 'window.__ModuleLoader__.load({ id: ' + JSON.stringify(manifest.name) + ', factory: (require) => {',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  }
}

export function packageBundles(manifest, options) {
  const { root, outDir = resolve(root, 'lib') } = options
  const production = Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.optionalDependencies })
  const isProduction = id => production.some(name => id === name || id.startsWith(name + '/'))
  // Separate entries avoid hidden shared chunks outside the published files list.
  const host = ['index', 'invariant'].map(name => ({
    name: manifest.name + '/' + name,
    entry: { [name]: resolve(root, 'src', name + '.ts') },
    tsconfig: resolve(root, 'tsconfig.json'),
    outDir,
    format: 'esm',
    platform: 'node',
    target: 'es2022',
    fixedExtension: false,
    dts: false,
    clean: false,
    failOnWarn: true,
    deps: {
      neverBundle: isProduction,
      alwaysBundle: id => !isBuiltin(id) && !isProduction(id),
    },
  }))
  return [...host, clientBundle(manifest, { root, outDir })]
}
