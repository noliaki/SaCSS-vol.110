import { Config } from './types/config'

const config: Config = {
  webSiteConfig: {
    PROTOCOL: 'https',
    DOMAIN_NAME: 'example.com',
    TITLE: 'This is TITLE',
    DESCRIPTION: 'This is DESCRIPTION'
  },
  htmlBeautifyOptions: {
    // https://github.com/beautify-web/js-beautify#css--html
    //
    // default:
    //
    // indent_size: 2,
    // preserve_newlines: false,
    // max_preserve_newlines: 0,
    // wrap_line_length: 0,
    // wrap_attributes_indent_size: 0,
    // extra_liners: [],
    // unformatted: ['b', 'em']
  },
  src: 'src',
  dist: 'dist',
  docroot: 'src/docroot',
  stylus: {},
  autoprefixerOption: {
    grid: 'autoplace'
  },
  imagemin: {
    jpegtran: {},
    pngquant: {},
    svgo: {
      plugins: [
        {
          removeViewBox: false
        }
      ]
    }
  },
  browsersync: {
    server: {
      baseDir: 'dist',
      directory: true
    },
    startPath: '/index.html',
    files: 'dist',
    ghostMode: false,
    logLevel: 'debug',
    reloadDebounce: 500,
    ui: false,
    open: false
  }
}

export default config
