import { load } from 'cheerio'
import dotenv from 'dotenv'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'

import { _supportedConfigurationOptions } from '../src/config/constants.ts'

import type { CheerioAPI } from 'cheerio'

main()

function main() {
  dotenv.config({ path: path.resolve('../.env'), debug: true })

  const builtHTML = fs.readFileSync('../build/index.html', {
    encoding: 'utf-8',
  })

  const $ = load(builtHTML, { recognizeSelfClosing: true })

  console.log('Step 1) Writing configuration into the global window object...')
  const configuration = getWindowVariableObject()
  setFrontendConfiguration($, configuration)
  console.log('')

  console.log('Step 2) Applying theme...')
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

  console.log('Step 3) Making SEO changes...')
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
    $('meta[property="twitter:description"]').attr('content', siteDescription)
    $('meta[name="description"]').attr('content', siteDescription)
  }
  console.log('')

  console.log('Step 4) Saving...')
  const output = $.html()
  fs.writeFileSync('../build/index.html', output, { encoding: 'utf-8' })
  console.log('')
}

function setFrontendConfiguration(webpage: CheerioAPI, configuration) {
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
