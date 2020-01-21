import fs from 'fs'
import fg from 'fast-glob'
import path from 'path'
import chalk from 'chalk'
import { shouldCopy, distDir, docRoot } from './util'

export function copyFile(fileName: string): void {
  if (!shouldCopy(fileName)) return

  const distFile: string = path.resolve(
    distDir,
    path.relative(docRoot, fileName)
  )

  fs.mkdirSync(path.dirname(distFile), {
    recursive: true
  })

  const readStream: fs.ReadStream = fs.createReadStream(fileName)
  const writeStream: fs.WriteStream = fs.createWriteStream(distFile)

  readStream.on('end', (): void => {
    writeStream.end()
    console.log(`${chalk.blueBright('[copy]')} ${distFile}`)
  })
  readStream.pipe(writeStream)
}

export function copyAll(): void {
  const files: string[] = fg
    .sync([`${docRoot}/**/*`, `${docRoot}/*`])
    .filter((file: string): boolean => shouldCopy(file))

  files.forEach((file: string): void => copyFile(file))
}
