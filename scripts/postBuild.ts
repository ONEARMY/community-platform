import { load } from 'cheerio'
import dotenv from 'dotenv'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'

import { _supportedConfigurationOptions } from '../src/config/constants.ts'

import type { CheerioAPI } from 'cheerio'

main()

function main() {
  initializeEnvironmentVariables('../.env')

  const $ = loadWebpage('../build/index.html')

  setupFrontendConfiguration($)

  console.log('Applying theme...')
  const platformTheme = process.env.REACT_APP_PLATFORM_THEME
  if (platformTheme) {
    console.log('theme: ' + platformTheme)
    console.log('Copying assets.')
    fsExtra.copySync(
      '../src/assets/images/themes/' + platformTheme + '/public',
      '../build',
    )
  } else {
    console.log('No theme found, skipping.')
  }
  console.log('')

  console.log('Making SEO changes...')
  const siteName = process.env.SITE_NAME || 'Community Platform'
  console.log('site name: ' + siteName)

  $('title').text(siteName)
  $('meta[property="og:title"]').attr('content', siteName)
  $('meta[name="twitter:title"]').attr('content', siteName)

  if (platformTheme) {
    const siteDescription =
      platformTheme === 'precious-plastic'
        ? 'A series of tools for the Precious Plastic community to collaborate around the world. Connect, share and meet each other to tackle plastic waste.'
        : 'A platform for the Project Kamp community to collaborate around the world. Connect, share and meet each other to figure out how to live more sustainably'

    console.log('site description: ' + siteDescription)

    $('meta[property="og:description"]').attr('content', siteDescription)
    $('meta[name="twitter:description"]').attr('content', siteDescription)
    $('meta[name="description"]').attr('content', siteDescription)
  }
  console.log('')

  if (process.env.REACT_APP_BRANCH !== 'production') {
    $('head').append('<meta name="robots" content="noindex, nofollow">')
  }

  console.log('Saving...')
  const output = $.html()
  fs.writeFileSync('../build/index.html', output, { encoding: 'utf-8' })
  console.log('')
}

function initializeEnvironmentVariables(filepath: string) {
  dotenv.config({ path: path.resolve(filepath), debug: true })
}

function loadWebpage(filepath: string) {
  const builtHTML = fs.readFileSync(filepath, {
    encoding: 'utf-8',
  })
  return load(builtHTML, { recognizeSelfClosing: true })
}

function setupFrontendConfiguration(webpage: CheerioAPI) {
  console.log('Writing configuration into the global window object...')
  const configuration = getWindowVariableObject()
  setupScriptTagWithConfiguration(webpage, configuration)
  console.log('')
}

function setupScriptTagWithConfiguration(webpage: CheerioAPI, configuration) {
  webpage('script#CommunityPlatform').html(
    'window.__OA_COMMUNITY_PLATFORM_CONFIGURATION=' +
      JSON.stringify(configuration) +
      ';',
  )
}

function getWindowVariableObject() {
  const configurationObject = {}

  _supportedConfigurationOptions.forEach((variable: string) => {
    configurationObject[variable] = process.env[variable] || ''
  })

  if (_supportedConfigurationOptions.filter((v) => !process.env[v]).length) {
    console.log(
      'The following properties were not found within the current environment:',
    )
    console.log(
      _supportedConfigurationOptions.filter((v) => !process.env[v]).join('\n'),
    )
  }

  return configurationObject
}
