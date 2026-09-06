import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { packageBundles } from '../../scripts/client-bundle.mjs'

const root = fileURLToPath(new URL('.', import.meta.url))
const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
export default packageBundles(manifest, { root })
