import { tmpdir } from 'os'
import { join } from 'path'
import { ensureFile, writeFile, readFile, readJSON, pathExists } from 'fs-extra'

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
