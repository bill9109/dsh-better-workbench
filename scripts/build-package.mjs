import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { packageBundles } from './client-bundle.mjs'

// Build tooling follows tsdown's Node requirement (currently ^22.18 || >=24.11).
// Published runtime artifacts keep the package's separate Node compatibility range.
const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export async function buildPackage(root, outDir, { workbenchTypes, declarationsOnly = false } = {}) {
  const ts = (await import('typescript')).default
  const file = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile)
  if (file.error) throw new Error(ts.flattenDiagnosticMessageText(file.error.messageText, '\n'))
  const config = ts.parseJsonConfigFileContent(file.config, ts.sys, root, {
    outDir: join(outDir, 'types'),
    declaration: true,
    emitDeclarationOnly: true,
    incremental: false,
  })
  const host = ts.createCompilerHost(config.options)
  if (workbenchTypes) {
    host.resolveModuleNames = (names, containingFile) => names.map(name => {
      if (name === 'dsh-workbench/client') {
        return { resolvedFileName: join(workbenchTypes, 'client/index.d.ts'), extension: ts.Extension.Dts }
      }
      // Temporary declarations must resolve peer types from the real package install.
      const from = containingFile.startsWith(workbenchTypes + '/') && !name.startsWith('.')
        ? join(repository, 'src/index.ts') : containingFile
      return ts.resolveModuleName(name, from, config.options, host).resolvedModule
    })
  }
  const program = ts.createProgram(config.fileNames, config.options, host)
  const diagnostics = [...config.errors, ...ts.getPreEmitDiagnostics(program)]
  if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }))
  const emitted = program.emit()
  if (emitted.emitSkipped) throw new Error('TypeScript declaration emit failed')
  if (declarationsOnly) return
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  const { build } = await import('tsdown')
  for (const config of packageBundles(manifest, { root, outDir })) {
    await build({ ...config, config: false })
  }
}

/** --dry-run has no writes; --check/--verify use an owned temporary directory. */
export async function runBuild(root, args = process.argv.slice(2)) {
  if (args.some(arg => !['--verify', '--dry-run', '--check'].includes(arg))) throw new Error('Usage: build [--dry-run | --verify | --check]')
  const isolated = args.includes('--verify') || args.includes('--check')
  const example = resolve(root) !== repository
  if (args.includes('--dry-run')) {
    console.log(JSON.stringify({
      root, output: isolated ? '<temporary directory>' : join(root, 'lib'),
      steps: [...(example ? ['Compile current workbench declarations in a temporary directory'] : []), 'Typecheck and emit declarations', 'Bundle host ESM entries', 'Bundle DSH client closure factory'],
      checkoutRequired: false, modifiesNodeModules: false,
    }, null, 2))
    return
  }
  const temporary = await mkdtemp(join(tmpdir(), 'dsh-workbench-build-'))
  try {
    let workbenchTypes
    if (example) {
      const dependencyOutput = join(temporary, 'workbench')
      await buildPackage(repository, dependencyOutput, { declarationsOnly: true })
      workbenchTypes = join(dependencyOutput, 'types')
    }
    const outDir = isolated ? join(temporary, 'output') : join(root, 'lib')
    await buildPackage(root, outDir, { workbenchTypes, declarationsOnly: args.includes('--check') })
    console.log(isolated ? 'Verified in temporary directory; existing lib unchanged.' : 'Built ' + outDir)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
