import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { packageBundles } from 'dsh-better-workbench/build/client-bundle'

const root = fileURLToPath(new URL('.', import.meta.url))
export default packageBundles(JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')), { root })
