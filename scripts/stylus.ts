import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import stylus from 'stylus'
import postcss from 'postcss'
import chalk, { ChalkFunction } from 'chalk'
import autoprefixer from 'autoprefixer'
import http from 'http'
import tailwind from 'tailwindcss'

import {
  stylusReg,
  docRoot,
  distDir,
  srcDir,
  writeFilePromise,
  stylusExtension
} from './util'
import config from '../config'

const chalkColor: ChalkFunction = chalk.magentaBright

async function render(fileName: string): Promise<void> {
  const css: string = await compile(fileName)
  await writeFile(fileName, css)
}

async function compile(fileName: string): Promise<string> {
  const css: string = await stylusToCss(fileName)
  const result: postcss.Result = await addPrefix(css)

  result
    .warnings()
    .forEach((warn: postcss.Warning): void => console.warn(warn.toString()))

  console.log(`${chalkColor('[stylus]')} ${fileName}`)
  return result.css
}

function stylusToCss(fileName: string) {
  const str: string = fs.readFileSync(fileName, {
    encoding: 'utf8'
  })

  return new Promise(
    (
      resolve: (output: string) => void,
      reject: (reason: any) => void
    ): void => {
      const renderer = stylus(str).set(
        'compress',
        process.env.NODE_ENV === 'production'
      )

      renderer.include(srcDir)

      renderer.render((error: Error, output: string): void => {
        if (error) {
          reject(error)
          return
        }

        resolve(output)
      })
    }
  )
}

function addPrefix(css: string): postcss.LazyResult {
  return postcss([autoprefixer(config.autoprefixerOption), tailwind()]).process(
    css,
    {
      from: undefined
    }
  )
}

function writeFile(filename: string, cssString: string): Promise<void> {
  const distPath = path.resolve(distDir, path.relative(docRoot, filename))
  const cssFileName = distPath.replace(stylusReg, '.css')

  fs.mkdirSync(path.dirname(distPath), {
    recursive: true
  })

  return writeFilePromise(cssFileName, cssString)
}

export function renderAll(): void {
  const files: string[] = fg
    .sync([
      `${docRoot}/**/*.${stylusExtension}`,
      `${docRoot}/*.${stylusExtension}`
    ])
    .filter((file: string): boolean => stylusReg.test(file))

  Promise.all(files.map((file: string): Promise<void> => render(file)))
    .then(() => console.log(`${chalkColor('[stylus]')} All Compiled`))
    .catch((reason: any): void => console.error(reason))
}

export async function middleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
): Promise<void> {
  const url: URL = new URL(req.url, `http://${req.headers.host}`)
  const requestPath: string = url.pathname
  const filePath: string = path.join(
    docRoot,
    requestPath.replace(/\.css$/i, `.${stylusExtension}`)
  )

  if (!/\.css$/i.test(requestPath) || !fs.existsSync(filePath)) {
    next()
    return
  }

  const css: string = await compile(filePath)

  res.writeHead(200, { 'Content-Type': 'text/css' })
  res.end(css)
}
