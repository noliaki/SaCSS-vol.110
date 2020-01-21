import fs from 'fs'
import path from 'path'
import bs from 'browser-sync'
import { middleware as stylusMiddleware } from './stylus'
import { middleware as nunjucksMiddleware } from './nunjucks'
import { compress, compressAll } from './imagemin'
import { copyFile, copyAll } from './copy'
import {
  srcDir,
  nunjucksReg,
  stylusReg,
  imageReg,
  tsReg,
  docRoot
} from './util'
import config from '../config'

compressAll()
copyAll()

bs.init(
  Object.assign(config.browsersync, {
    middleware: [nunjucksMiddleware, stylusMiddleware]
  })
)

fs.watch(
  srcDir,
  { recursive: true },
  (event: string, filename: string): void => {
    console.log(event, filename)

    // ignore
    if (ignoreFile(filename)) {
      console.log('ignore this file')
      return
    }

    const absolutePath = path.resolve(srcDir, filename)

    if (!fs.existsSync(absolutePath)) {
      console.log('not exist')
      return
    }

    // nunjucks
    if (nunjucksReg.test(filename) || /\.html$/i.test(filename)) {
      console.log(path.relative(docRoot, filename))
      bs.reload('*.html')
      return
    }

    // stylus
    if (stylusReg.test(filename)) {
      console.log(path.relative(docRoot, filename))
      bs.reload('*.css')
      return
    }

    // image file
    if (imageReg.test(filename)) {
      compress(absolutePath)
      return
    }

    const stats: fs.Stats = fs.statSync(absolutePath)

    if (absolutePath.includes(docRoot) && stats.isFile()) {
      copyFile(absolutePath)
    }
  }
)

function ignoreFile(filename: string): boolean {
  return tsReg.test(filename) || /\/\./.test(filename)
}
