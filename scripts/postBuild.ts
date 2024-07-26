import { load } from 'cheerio'
import dotenv from 'dotenv'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'

import { _supportedConfigurationOptions } from '../src/config/constants.ts'

import type { CheerioAPI } from 'cheerio'

main()

function main() {
  const configuration = loadConfiguration('../.env')

  const webpage = loadWebpage('../build/index.html')
  const modifiedWebpage = modifyWebpage(webpage, configuration)
  saveWebpage('../build/index.html', modifiedWebpage)

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
  webpage('meta[property="og:title"]').attr('content', configuration.name)
  webpage('meta[name="twitter:title"]').attr('content', configuration.name)

  webpage('meta[property="og:description"]').attr(
    'content',
    configuration.description,
  )
  webpage('meta[name="twitter:description"]').attr(
    'content',
    configuration.description,
  )
  webpage('meta[name="description"]').attr('content', configuration.description)
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

function loadConfiguration(filepath: string) {
  initializeEnvironmentVariables(filepath)
  return getConfigurationFromEnvironmentVariables()
}

function initializeEnvironmentVariables(filepath: string) {
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
