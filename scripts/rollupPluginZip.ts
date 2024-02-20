// rollup-plugin-zip.ts
import fs from 'fs'
import archiver from 'archiver'
import path from 'path'
import { Plugin } from 'rollup'

interface ZipPluginOptions {
  fileName?: string
  outputDir?: string
  targetDir?: string
}

function zipPlugin(options: ZipPluginOptions = {}): Plugin {
  const zipFileName = options.fileName || 'bundle.zip'
  const targetDir = options.targetDir || 'dist'
  const outputDir = options.outputDir || 'dist'

  return {
    name: 'zip-plugin',
    writeBundle() {
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
      const output = fs.createWriteStream(path.join(outputDir, zipFileName))
      const archive = archiver('zip', {
        zlib: { level: 9 }, // 设置压缩级别
      })

      output.on('close', function () {
        console.log(`${zipFileName} has been created. Total size: ${archive.pointer()} bytes`)
      })

      archive.on('error', function (err) {
        throw err
      })

      archive.pipe(output)
      archive.directory(targetDir, false)
      return archive.finalize()
    },
  }
}

export default zipPlugin
