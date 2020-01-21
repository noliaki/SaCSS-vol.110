import path from 'path'
import fg from 'fast-glob'
import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import chalk from 'chalk'
import config from '../config'
import { distDir, docRoot, imageMinimatch } from './util'

function optimizeImage(srcFileName: string, dest: string): void {
  imagemin([srcFileName], {
    destination: dest,
    plugins: [
      imageminJpegtran(config.imagemin.jpegtran),
      imageminPngquant(config.imagemin.pngquant),
      imageminSvgo(config.imagemin.svgo)
    ]
  }).then((results: imagemin.Result[]): void => {
    results.forEach((result: imagemin.Result): void => {
      console.log(`${chalk.cyan('[imagemin]')} ${result.destinationPath}`)
    })
  })
}

export function compress(fileName: string): void {
  const relPath: string = path.relative(docRoot, fileName)
  const distPath: string = path.join(distDir, relPath)

  optimizeImage(fileName, path.dirname(distPath))
}

export function compressAll(): void {
  const files: string[] = fg
    .sync([`${docRoot}/**/${imageMinimatch}`, `${docRoot}/${imageMinimatch}`])
    .map((filename: string): string => path.dirname(filename))
    .filter(
      (dirname: string, index: number, filesArr: string[]): boolean =>
        filesArr.indexOf(dirname) === index
    )

  files.forEach((file: string): void =>
    compress(path.resolve(file, imageMinimatch))
  )
}
