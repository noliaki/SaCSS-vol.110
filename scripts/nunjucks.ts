import nunjucks from 'nunjucks'
import http from 'http'
import path from 'path'
import fs from 'fs'
import fg from 'fast-glob'
import { html as htmlBeautify } from 'js-beautify'
import config from '../config'
import {
  docRoot,
  srcDir,
  distDir,
  nunjucksExtension,
  writeFilePromise,
  nunjucksReg
} from './util'
import chalk from 'chalk'
import { WebSiteConfig } from '../types/config'

const htmlBeautifyOption: HTMLBeautifyOptions = Object.assign(
  {},
  {
    indent_size: 2,
    preserve_newlines: false,
    max_preserve_newlines: 0,
    wrap_line_length: 0,
    wrap_attributes_indent_size: 0,
    extra_liners: [],
    unformatted: ['b', 'em']
  },
  config.htmlBeautifyOptions
)
const BASE_URL: string = `${config.webSiteConfig.PROTOCOL}://${config.webSiteConfig.DOMAIN_NAME}`

nunjucks.configure(srcDir, {
  noCache: true
})

function createOption(
  pathName: string = '/'
): WebSiteConfig & { [key: string]: string } {
  const url: URL = new URL(pathName, BASE_URL)

  return Object.assign({}, config.webSiteConfig, {
    URL: url.href,
    CANONICAL_URL: url.href.replace(/\/index.html$/, '/'),
    PATH: url.pathname,
    BASE_URL
  })
}

function renderNunjucks(njkFilePath: string, options: any = {}): string {
  console.log(`${chalk.green('[nunjucks]')} ${njkFilePath}`)
  const htmlSource: string = nunjucks.render(njkFilePath, options)

  return htmlBeautify(htmlSource, htmlBeautifyOption)
}

function writeFile(fileName: string, htmlString: string): Promise<void> {
  const distPath = path.resolve(distDir, path.relative(docRoot, fileName))
  const htmlFileName = distPath.replace(nunjucksReg, '.html')

  fs.mkdirSync(path.dirname(distPath), {
    recursive: true
  })

  return writeFilePromise(htmlFileName, htmlString)
}

export function middleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
): Promise<void> {
  const url: URL = new URL(req.url, BASE_URL)
  const requestPath: string = url.pathname
  const filePath: string = path.join(
    docRoot,
    requestPath.replace(/\.html$/i, `.${nunjucksExtension}`)
  )

  if (!/\.html$/i.test(requestPath) || !fs.existsSync(filePath)) {
    next()
    return
  }

  const html: string = renderNunjucks(filePath, createOption(requestPath))

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

export function renderAll(): void {
  const nunjucksFiles: string[] = fg.sync([
    `${docRoot}/*.${nunjucksExtension}`,
    `${docRoot}/**/*.${nunjucksExtension}`
  ])

  Promise.all(
    nunjucksFiles.map(
      (fileName: string): Promise<void> => {
        const htmlFileName: string = fileName.replace(nunjucksReg, '.html')
        const htmlSource: string = renderNunjucks(
          fileName,
          createOption(path.relative(docRoot, htmlFileName))
        )

        return writeFile(fileName, htmlSource)
      }
    )
  )
}
