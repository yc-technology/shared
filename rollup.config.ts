import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { RollupOptions, defineConfig } from 'rollup'

function getConfig(input: string, file: string): RollupOptions {
  return {
    input: input,
    plugins: [
      json(),
      typescript(),
      terser(),
      resolve(), // 解析node_modules中的模块
      commonjs()
    ],
    external: ['clsx', 'bignumber.js', 'crypto-js', 'zod', 'moment', 'moment-timezone'],
    output: [
      {
        format: 'cjs',
        file: `dist/cjs/${file}.js`,
        esModule: false,
        sourcemap: true
      },
      {
        format: 'es',
        file: `dist/esm/${file}.js`,
        sourcemap: true
      },
      {
        format: 'iife',
        file: `dist/iife/${file}.js`,
        name: 'YcShared',
        extend: true,
        globals: {
          'bignumber.js': 'BigNumber',
          'crypto-js': 'CryptoJS',
          clsx: 'clsx',
          zod: 'Zod',
          moment: 'moment'
        }
      },
      {
        file: `dist/umd/${file}.js`, // 输出文件
        format: 'umd', // UMD格式支持CommonJS和浏览器环境
        name: 'YcShared', // 全局变量名，你的库在浏览器环境中的名称
        globals: {
          'bignumber.js': 'BigNumber',
          'crypto-js': 'CryptoJS',
          clsx: 'clsx',
          zod: 'Zod',
          moment: 'moment'
        }
      }
    ]
  }
}

export default defineConfig([
  getConfig('src/index.ts', 'index'),
  getConfig('src/moment.ts', 'moment')
])
