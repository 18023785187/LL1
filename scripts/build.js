import { nodeResolve } from '@rollup/plugin-node-resolve' // 支持第三方模块导入
import babel from '@rollup/plugin-babel' // 支持 babel
import terser from "@rollup/plugin-terser"; // 压缩代码
import { resolve } from './utils.js'

const input = resolve('../', './src/index.js')

export default [
  // 打包正常的代码
  {
    input,
    output: [
      // cjs 格式打包
      { file: resolve('../', "./dist/ll1.cjs"), format: "cjs" },
      // es 格式打包
      { file: resolve('../', "./dist/ll1.esm.js"), format: "es" },
      // umd 格式打包
      {
        name: 'll1',
        file: resolve('../', "./dist/ll1.umd.js"),
        format: 'umd'
      },
      // cjs 格式打包
      { file: resolve('../', "./dist/ll1.min.cjs"), format: "cjs", plugins: [terser()] },
      // es 格式打包
      { file: resolve('../', "./dist/ll1.esm.min.js"), format: "es", plugins: [terser()] },
      // umd 格式打包
      {
        name: 'll1',
        file: resolve('../', "./dist/ll1.umd.min.js"),
        format: 'umd', plugins: [terser()]
      }
    ],
    plugins: [
      nodeResolve({
        extensions: ['.js']
      }),
      babel({
        exclude: ["node_modules/**"],
        babelHelpers: "runtime",
        extensions: ['.js'],
      })
    ],
  },
]
