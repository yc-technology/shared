import { defineConfig } from 'rollup'
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import zipPlugin from './scripts/rollupPluginZip'
import json from '@rollup/plugin-json'

export default defineConfig({
  input: 'src/index.ts',
  plugins: [json(), typescript(), terser(), zipPlugin({ outputDir: 'zipDist' })],
  external: ['clsx', 'uuid', 'bignumber.js', 'crypto-js', 'tailwind-merge', 'zod'],
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      esModule: false,
      sourcemap: true,
    },
    {
      format: 'es',
      file: pkg.module,
      sourcemap: true,
    },
    {
      format: 'iife',
      file: pkg.jsdelivr,
      name: 'Test',
      extend: true,
      globals: {},
    },
  ],
})
