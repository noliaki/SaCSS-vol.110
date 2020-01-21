import autoprefixer from 'autoprefixer'
import imageminJpegTran from 'imagemin-jpegtran'
import { Options as imageminPngQuantOptions } from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import browsersync from 'browser-sync'

export interface WebSiteConfig {
  PROTOCOL?: 'http' | 'https'
  DOMAIN_NAME?: string
  TITLE?: string
  DESCRIPTION?: string
}

export interface Config {
  webSiteConfig?: WebSiteConfig
  htmlBeautifyOptions?: HTMLBeautifyOptions
  src?: string
  dist?: string
  docroot?: string
  stylus?: {
    compress?: boolean
  }
  autoprefixerOption?: autoprefixer.Options
  imagemin?: {
    jpegtran?: imageminJpegTran.Options
    pngquant?: imageminPngQuantOptions
    svgo?: imageminSvgo.Options
  }
  browsersync?: browsersync.Options
}
