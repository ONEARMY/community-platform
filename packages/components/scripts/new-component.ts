#!/usr/bin/env node

/**
  Usage 
    $ new-component ComponentName
 */

import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import * as Mustache from 'mustache'

const [inputName] = process.argv.slice(2)

if (!inputName) {
  console.log(`⚠️ Component name is required. Example usage:
$ yarn new-component ComponentName`)
  process.exit(1)
}

const componentName = toPascalCase(inputName)

try {
  mkdirSync(resolve(__dirname, `../src/${componentName}`))
} catch (e) {
  console.log(`${componentName} already exists`)
  process.exit(1)
}

console.log(`Created a new component: ${componentName}`)

// Load template files
function createComponentFile(filename: string) {
  const componentPath = resolve(__dirname, './templates/' + filename)
  // Transform to include `componentName`
  const fileTemplate = readFileSync(componentPath, {
    encoding: 'utf8',
  })

  // Write files to directory
  const newFilePath = resolve(
    __dirname,
    `../src/${componentName}/`,
    filename.replace('{componentName}', componentName).replace('.mst', ''),
  )
  console.log(`Writing:`, newFilePath)
  writeFileSync(
    newFilePath,
    Mustache.render(fileTemplate, { ComponentName: componentName }),
  )
}

;['{componentName}.tsx.mst', '{componentName}.stories.mdx.mst'].map(
  createComponentFile,
)

/** from: https://quickref.me/convert-a-string-to-pascal-case */
function toPascalCase(str: string) {
  return (str.match(/[a-zA-Z0-9]+/g) || [])
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join('')
}
