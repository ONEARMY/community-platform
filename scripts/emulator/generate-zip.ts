import * as fs from 'fs-extra'
import * as archiver from 'archiver'
import path from 'path'
import { EMULATOR_IMPORT_PATH, EMULATOR_SEED_PATH } from 'oa-shared/paths'

// Run directly if called from ts-node
if (require.main === module) {
  zipFolder()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

/**
 * Take a folder directory and zip all contents to zip file
 * @returns path to generated zip
 * */
export function zipFolder() {
  const inputFolderPath = EMULATOR_IMPORT_PATH
  const outputFilepath = path.resolve(EMULATOR_SEED_PATH, 'exported.zip')
  if (fs.existsSync(outputFilepath)) {
    fs.removeSync(outputFilepath)
  }
  const stream = fs.createWriteStream(outputFilepath)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  return new Promise<string>((resolve, reject) => {
    stream.on('close', () => {
      console.log('zip generated', outputFilepath)
      resolve(outputFilepath)
    })
    archive
      .directory(inputFolderPath, false)
      .on('error', err => reject(err))
      .pipe(stream)
    archive.finalize()
  })
}
