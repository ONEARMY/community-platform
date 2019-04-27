import { tmpdir } from 'os'
import { join } from 'path'
import {
  ensureFile,
  writeFile,
  readFile,
  readJSON,
  pathExists,
  createWriteStream,
} from 'fs-extra'
import axios from 'axios'

export async function writeToFile(filename: string, data: string) {
  const tmpFilePath = join(tmpdir(), filename)
  console.log('writing file', tmpFilePath)
  await ensureFile(tmpFilePath)
  await writeFile(tmpFilePath, data)
  console.log('file written', tmpFilePath)
  return tmpFilePath
}

// if file exists and contains json merges (new overrides old)
// if file does not exist creates
export async function appendJsonToFile(filename: string, json: any) {
  const tmpFilePath = join(tmpdir(), filename)
  const exists = await pathExists(tmpFilePath)
  const oldJson = exists ? await readJSON(tmpFilePath) : {}
  const update = { ...oldJson, ...json }
  await writeFile(tmpFilePath, JSON.stringify(update))
}

// take an external url and download the file to a temp directory
export async function downloadFileToTmp(url: string) {
  // prepare directory
  const filename = url.split('/').pop()
  const tmpFilePath = join(tmpdir(), filename)
  await ensureFile(tmpFilePath)
  console.log('writing file', tmpFilePath)
  const writer = createWriteStream(tmpFilePath)
  // download file
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })
  response.data.pipe(writer)
  // return write complete
  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log('write finished')
      resolve({
        filename: filename,
        filePath: tmpFilePath,
      })
    })
    writer.on('error', reject)
  })
}

export interface IFileWriteMeta {
  filename: string
  filePath: string
}
