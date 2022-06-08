import * as functions from 'firebase-functions'
import * as fs from 'fs'
import fetch from 'node-fetch'
import { CONFIG } from '../config/config'

const BOT_AGENTS = [
  'googlebot',
  'yahoo! slurp',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
  'qwantify',
  'pinterestbot',
  'bitrix link preview',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot',
  'metainspector',
]

/*
 * Helper function to check if an array contains an element or not.
 *
 * @param {string[]} array - The array to check.
 * @param {string} element - The element to check if the array contains.
 * @returns {boolean}
 */
function containsOneOfThem(array, element) {
  return array.some((e) => element.indexOf(e) !== -1)
}

export const seoRender = functions.https.onRequest(
  async (request, res: any) => {
    const requestUserAgent = (request.headers['user-agent'] || '').toLowerCase()
    const xPrerender = request.headers['x-prerender']
    const pathName = request.path.replace('/seo', '')

    console.log(`Request:`, { pathName, requestUserAgent })

    let response: any
    if (!xPrerender && containsOneOfThem(BOT_AGENTS, requestUserAgent)) {
      console.log(`Bot user detected.`)
      try {
        response = await fetch(
          `https://service.prerender.io/${CONFIG.deployment.site_url}${pathName}`,
          {
            headers: {
              'X-Prerender-Token': CONFIG.prerender.api_key,
            },
          },
        )
        response = await response.text()

        return res.send(response)
      } catch (error) {
        console.log(`Error fetching response from prerender:`, { error })
      }
    } else {
      console.log(`Non bot user detected.`)
      try {
        response = fs.readFileSync('./index.html').toString()
      } catch (error) {
        console.log(`Unable to load index.html`, { error })
      }
    }
    const body = response
    return res.send(body)
  },
)
