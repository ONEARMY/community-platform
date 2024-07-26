import { load } from 'cheerio'
import dotenv from 'dotenv'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'

import { _supportedConfigurationOptions } from '../src/config/constants.ts'

import type { CheerioAPI } from 'cheerio'

main()

function main() {
  const configuration = getConfiguration('../.env')

  const $ = loadWebpage('../build/index.html')

  setupFrontendConfiguration($, configuration)

  setupTheme(process.env.REACT_APP_PLATFORM_THEME)

  console.log('Making SEO changes...')
  const siteName = process.env.SITE_NAME || 'Community Platform'
  console.log('site name: ' + siteName)

  $('title').text(siteName)
  $('meta[property="og:title"]').attr('content', siteName)
  $('meta[name="twitter:title"]').attr('content', siteName)

  const platformTheme = process.env.REACT_APP_PLATFORM_THEME
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

  saveWebpage('../build/index.html', $)
}

function getConfiguration(filepath: string) {
  initializeEnvironmentVariables(filepath)
  return getConfigurationFromEnvironmentVariables()
}

function getConfigurationFromEnvironmentVariables() {
  const configuration = {}
  const skippedOptions = []

  _supportedConfigurationOptions.forEach((option: string) => {
    const value = process.env[option]

    if (value === undefined) {
      skippedOptions.push(option)
    }
    configuration[option] = value || ''
  })

  if (skippedOptions.length !== 0) {
    console.log(
      'The following properties were not found within the current environment:',
    )
    console.log(skippedOptions.join('\n'))
  }

  return configuration
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

function setupFrontendConfiguration(
  webpage: CheerioAPI,
  configuration: { [key: string]: string },
) {
  console.log('Writing configuration into the global window object...')
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

function setupTheme(theme: string) {
  console.log('Applying theme...')
  console.log('theme: ' + theme)
  if (theme === undefined) {
    console.log('No theme found, skipping.')
  }
  console.log('Copying assets.')
  fsExtra.copySync(
    '../src/assets/images/themes/' + theme + '/public',
    '../build',
  )
  console.log('')
}

function saveWebpage(filepath: string, webpage: CheerioAPI): void {
  console.log('Saving...')
  const content = webpage.html()
  fs.writeFileSync(filepath, content, { encoding: 'utf-8' })
  console.log('')
}
