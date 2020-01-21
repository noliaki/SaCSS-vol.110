import fs from 'fs'
import util from 'util'
import path from 'path'

import config from '../config'

export const srcDir: string = path.resolve(__dirname, '..', config.src)
export const distDir: string = path.resolve(__dirname, '..', config.dist)
export const docRoot: string = path.resolve(__dirname, '..', config.docroot)

export const nunjucksExtension: string = 'njk.html'
export const imageExtension: string[] = ['jpg', 'jpeg', 'gif', 'png', 'svg']
export const stylusExtension: string = 'styl'
export const typescriptExtension: string = 'ts'

export const nunjucksReg: RegExp = new RegExp(`\\.${nunjucksExtension}$`, 'i')
export const imageReg: RegExp = new RegExp(
  `\\.(${imageExtension.join('|')})$`,
  'i'
)
export const stylusReg: RegExp = new RegExp(`\\.${stylusExtension}$`, 'i')
export const tsReg: RegExp = new RegExp(`\\.${typescriptExtension}$`, 'i')

export const imageMinimatch: string = `*.{${imageExtension.join(
  ','
)},${imageExtension
  .map((extension: string): string => extension.toUpperCase())
  .join(',')}}`

export function shouldCopy(filename: string): boolean {
  return !(
    nunjucksReg.test(filename) ||
    stylusReg.test(filename) ||
    imageReg.test(filename) ||
    tsReg.test(filename)
  )
}

export const writeFilePromise: (
  path: string | number | Buffer | URL,
  data: any,
  options?: fs.WriteFileOptions
) => Promise<void> = util.promisify(fs.writeFile)
