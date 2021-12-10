/**
 * 1. Load all files from src/templates/*.mst
 * 2. Load all env variables
 * 3. Export files to ./public/
 */

 import path from 'path'
 import fs from 'fs'
 import * as Mustache from 'mustache'
 
 const files = ['index.html.mst', 'manifest.json.mst']
 
 // 2. Load all env variables
 require('dotenv').config({
   path: path.resolve('../.env'),
 })
 
 files.map(file => {
   console.log(`Reading file from: ${file}`)
   const newFileName = file.replace('.mst', '')
   const fileContent = fs.readFileSync(path.resolve(`../src/templates/${file}`), {
     encoding: 'utf-8',
   })
 
   // 3. Exporting files to public/ directory
   console.log(`Writing file to public/${newFileName}`)
   fs.writeFileSync(
     path.resolve('../public/' + newFileName),
     Mustache.render(fileContent, {
       SITE_NAME: process.env.SITE_NAME || 'Community Platform',
       SITE_DESCRIPTION: `A series of tools for the Precious Plastic community to collaborate around the world. Connect, share and meet each other to tackle plastic waste.`
     }),
     {
       encoding: 'utf-8',
     },
   )
 })
 