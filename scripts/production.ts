import { renderAll as nunjucksRenderAll } from './nunjucks'
import { renderAll as stylusRenderAll } from './stylus'
import { compressAll } from './imagemin'
import { copyAll } from './copy'

nunjucksRenderAll()
stylusRenderAll()
compressAll()
copyAll()
