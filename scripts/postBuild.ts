import { load } from 'cheerio'
import dotenv from 'dotenv'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'

import { _supportedConfigurationOptions } from '../src/config/constants.ts'

import type { CheerioAPI } from 'cheerio'

const filepathWebpage = '../build/index.html'
const filepathConfiguration = '../.env'

main()

function main() {
  const configuration = loadConfiguration(filepathConfiguration)

  const webpage = loadWebpage(filepathWebpage)
  const modifiedWebpage = modifyWebpage(webpage, configuration)
  saveWebpage(filepathWebpage, modifiedWebpage)

  applyTheme(configuration.style.theme)
}

export function modifyWebpage(
  webpage: CheerioAPI,
  configuration: Configuration,
): CheerioAPI {
  const webpageWithConfiguration = addConfiguration(
    webpage,
    configuration.options,
  )
  const webpageWithCustomizations = addCustomizations(
    webpageWithConfiguration,
    configuration.style,
  )
  return webpageWithCustomizations
}

function addConfiguration(
  webpage: CheerioAPI,
  configuration: OptionsConfiguration,
) {
  console.log('Writing configuration into the global window object...')
  webpage('script#CommunityPlatform').html(
    'window.__OA_COMMUNITY_PLATFORM_CONFIGURATION=' +
      JSON.stringify(configuration) +
      ';',
  )
  console.log('')
  return webpage
}

function addCustomizations(
  webpage: CheerioAPI,
  configuration: StyleConfiguration,
) {
  console.log('Making SEO changes...')

  webpage('title').text(configuration.name)

  const nameMetaSelectors = [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
  ]
  nameMetaSelectors.forEach((selector) => {
    webpage(selector).attr('content', configuration.name)
  })

  const descriptionMetaSelectors = [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]',
  ]
  descriptionMetaSelectors.forEach((selector) => {
    webpage(selector).attr('content', configuration.description)
  })

  console.log('')
  return webpage
}

function applyTheme(theme: string) {
  console.log('Applying theme...')
  if (theme === '') {
    return
  }
  console.log('Copying assets.')
  fsExtra.copySync(
    '../src/assets/images/themes/' + theme + '/public',
    '../build',
  )
  console.log('')
}

interface Configuration {
  style: StyleConfiguration
  options: OptionsConfiguration
}

interface StyleConfiguration {
  theme: string
  name: string
  description: string
}

interface OptionsConfiguration {
  [key: string]: string
}

function loadConfiguration(filepath: string): Configuration {
  initializeEnvironmentVariables(filepath)
  return getConfigurationFromEnvironmentVariables()
}

function initializeEnvironmentVariables(filepath: string): void {
  dotenv.config({ path: path.resolve(filepath), debug: true })
}

function getConfigurationFromEnvironmentVariables(): Configuration {
  return {
    style: getStyleConfigurationFromEnvironmentVariables(),
    options: getOptionsConfigurationFromEnvironmentVariables(),
  }
}

function getStyleConfigurationFromEnvironmentVariables(): StyleConfiguration {
  console.log('Loading site details...')
  const theme = process.env.REACT_APP_PLATFORM_THEME || ''
  const name = process.env.SITE_NAME || 'Community Platform'
  const description = getSiteDescription(theme)

  console.log('theme: ' + theme)
  console.log('name: ' + name)
  console.log('description: ' + description)
  console.log('')

  return {
    theme: theme,
    description: description,
    name: name,
  }
}

function getSiteDescription(theme: string | undefined): string {
  if (theme === 'precious-plastic') {
    return 'A series of tools for the Precious Plastic community to collaborate around the world. Connect, share and meet each other to tackle plastic waste.'
  }
  if (theme === 'project-kamp') {
    return 'A platform for the Project Kamp community to collaborate around the world. Connect, share and meet each other to figure out how to live more sustainably.'
  }
  if (theme === 'fixing-fashion') {
    return 'A platform for doing cool things with clothes.'
  }
  return ''
}

function getOptionsConfigurationFromEnvironmentVariables(): OptionsConfiguration {
  console.log('Loading site options...')
  const configuration: OptionsConfiguration = {}
  const skippedOptions = []

  _supportedConfigurationOptions.forEach((option: string) => {
    const value = process.env[option]

    if (value === undefined) {
      skippedOptions.push(option)
    }
    configuration[option] = value || ''
  })

  if (skippedOptions.length !== 0) {
    console.log('The following properties were not found:')
    console.log(skippedOptions.join('\n'))
  }
  console.log('')
  return configuration
}

function loadWebpage(filepath: string) {
  const builtHTML = fs.readFileSync(filepath, {
    encoding: 'utf-8',
  })
  return load(builtHTML, { recognizeSelfClosing: true })
}

function saveWebpage(filepath: string, webpage: CheerioAPI): void {
  console.log('Saving webpage...')
  const content = webpage.html()
  fs.writeFileSync(filepath, content, { encoding: 'utf-8' })
  console.log('')
}
