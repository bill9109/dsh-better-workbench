#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import { runBuild } from '../../../scripts/build-package.mjs'

await runBuild(fileURLToPath(new URL('..', import.meta.url)))
