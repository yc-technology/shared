import { defineConfig } from 'rollup'
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import zipPlugin from './scripts/rollupPluginZip'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  input: 'src/index.ts',
  plugins: [
    json(),
    typescript(),
    terser(),
    resolve(), // 解析node_modules中的模块
    commonjs(),
    zipPlugin({ outputDir: 'zipDist' })
  ],
  external: ['clsx', 'bignumber.js', 'crypto-js', 'zod'],
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      esModule: false,
      sourcemap: true
    },
    {
      format: 'es',
      file: pkg.module,
      sourcemap: true
    },
    {
      format: 'iife',
      file: pkg.iife,
      name: 'YcShared',
      extend: true,
      globals: {
        'bignumber.js': 'BigNumber',
        'crypto-js': 'CryptoJS',
        clsx: 'clsx',
        zod: 'Zod'
      }
    },
    {
      file: pkg.umd, // 输出文件
      format: 'umd', // UMD格式支持CommonJS和浏览器环境
      name: 'YcShared', // 全局变量名，你的库在浏览器环境中的名称
      globals: {
        'bignumber.js': 'BigNumber',
        'crypto-js': 'CryptoJS',
        clsx: 'clsx',
        zod: 'Zod'
      }
    }
  ]
})
