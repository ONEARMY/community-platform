#!/usr/bin/env node

/**
 * Usage
 *   $ yarn new-component ComponentName
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import Mustache from 'mustache'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const basePath: string = resolve(__dirname, '../src') as string

const [inputName] = process.argv.slice(2)

if (!inputName) {
  console.error(
    '⚠️ Component name is required. Example usage:\n$ yarn new-component ComponentName',
  )
  process.exit(1)
}

const componentName = toPascalCase(inputName)
const componentPath = resolve(basePath, componentName)

// Ensure the component does not already exist
if (existsSync(componentPath)) {
  console.error(`Error: Component ${componentName} already exists.`)
  process.exit(1)
}

try {
  mkdirSync(componentPath)
  console.log(`Created a new component: ${componentName}`)
} catch (error: any) {
  console.error(
    `Failed to create directory for ${componentName}: ${error.message}`,
  )
  process.exit(1)
}

const templates = [
  '{componentName}.tsx.mst',
  '{componentName}.stories.tsx.mst',
  '{componentName}.test.tsx.mst',
]

templates.forEach((templateName) =>
  createComponentFileFromTemplate(templateName, componentPath, componentName),
)

// Append export to index.ts
appendToIndexFile(basePath, componentName)

function createComponentFileFromTemplate(
  templateName: string,
  componentPath: string,
  componentName: string,
) {
  const templateFilePath = resolve(__dirname, './templates', templateName)
  if (!existsSync(templateFilePath)) {
    console.error(`Template file ${templateFilePath} does not exist.`)
    return
  }

  const fileTemplate = readFileSync(templateFilePath, { encoding: 'utf8' })
  const newFileName = templateName
    .replace('{componentName}', componentName)
    .replace('.mst', '')
  const newFilePath = resolve(componentPath, newFileName)

  console.log(`Writing: ${newFilePath}`)
  writeFileSync(
    newFilePath,
    Mustache.render(fileTemplate, { ComponentName: componentName }),
  )
}

function appendToIndexFile(basePath: string, componentName: string) {
  const indexPath = resolve(basePath, 'index.ts')
  const exportLine = `export { ${componentName} } from './${componentName}/${componentName}'\n`

  console.log(`Appending to ${indexPath}`)
  writeFileSync(indexPath, exportLine, { encoding: 'utf8', flag: 'a+' })
}

/** from: https://quickref.me/convert-a-string-to-pascal-case */
function toPascalCase(str: string) {
  return (str.match(/[a-zA-Z0-9]+/g) || [])
    .map((word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join('')
}
