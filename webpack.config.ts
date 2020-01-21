import path from 'path'
import fg from 'fast-glob'
import TerserPlugin from 'terser-webpack-plugin'
import * as webpack from 'webpack'
import config from './config'

import { srcDir, docRoot, distDir } from './scripts/util'

const plugins: webpack.Plugin[] = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]

const webpackConfig: webpack.Configuration = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  context: docRoot,
  entry: entries(),
  output: {
    path: distDir,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@': srcDir,
      '~': srcDir,
      vue: 'vue/dist/vue'
    },
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins,
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /node_modules/,
    //       name: `${vendorEntry()}/vendor.bundle`,
    //       chunks: 'initial',
    //       enforce: true
    //     },
    //     modules: {
    //       test: new RegExp(`${srcDir}/modules/`),
    //       name: `${vendorEntry()}/module.bundle`,
    //       chunks: 'initial',
    //       enforce: true
    //     }
    //   }
    // },
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production'
          }
        }
      })
    ]
  }
}

function entries(): { [key: string]: string } {
  const files: string[] = fg.sync([
    `${config.docroot}/**/*.ts`,
    `${config.docroot}/*.ts`
  ])
  const entriesObj: { [key: string]: string } = {}

  files.forEach((file: string): void => {
    const filePath = `./${path.relative(config.docroot, file)}`
    const key = filePath.replace(/\/ts\//g, '/js/').replace(/\.ts$/, '')
    entriesObj[key] = filePath
  })

  return entriesObj
}

// function vendorEntry(): string {
//   const files: string[] = fg.sync([`${docRoot}/**/*.ts`, `${docRoot}/*.ts`])

//   const results: string[] = files
//     .map((filePath: string): string =>
//       path.dirname(path.relative(docRoot, filePath))
//     )
//     .filter(
//       (dirname: string, index: number, arr: string[]): boolean =>
//         index === arr.indexOf(dirname)
//     )
//     .sort((a: string, b: string): number => a.length - b.length)

//   return `./${results[0]}`
// }

if (process.env.NODE_ENV === 'development') {
  webpackConfig.watch = true
  webpackConfig.cache = true
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  )
}

export default webpackConfig
