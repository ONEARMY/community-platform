#!/usr/bin/env node

/**
  Usage 
    $ new-component ComponentName
 */

import { fstat, mkdirSync, readFile, readFileSync, writeFileSync } from "fs";
import { basename, extname, resolve } from "path";

const [componentName] = process.argv.slice(2);

if (!componentName) {
    console.log(`⚠️ Component name is required. Example usage:
$ yarn new-component ComponentName`)
    process.exit(1)
}

try {
    mkdirSync(resolve(__dirname, `../src/${componentName}`))
} catch (e) {
    console.log(`${componentName} already exists`)
    process.exit(1);
}

console.log(`Created a new component: ${componentName}`);

// Load template files
function createComponentFile(filename: string) {
    const componentPath = resolve(__dirname, './templates/' + filename);
    // Transform to include `componentName`
    const componentNameCode = readFileSync(componentPath, { encoding: 'utf8' }).replace(/ComponentName/g, componentName);

    // Write files to directory
    writeFileSync(resolve(__dirname, `../src/${componentName}/`, filename.replace('{componentName}', componentName)), componentNameCode);

}

['{componentName}.tsx', '{componentName}.stories.mdx'].map(createComponentFile)