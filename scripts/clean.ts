import rimraf from 'rimraf'
import chalk from 'chalk'
import { distDir } from './util'

rimraf(distDir, (err: Error): void => {
  if (err) throw new Error(err.message)

  console.log(`${chalk.red('[Removed]')} ${chalk.cyan(distDir)}`)
})
