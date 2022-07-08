import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import * as functions from 'firebase-functions'
import * as fs from 'fs'
import { IncomingHttpHeaders } from 'http'

export interface RequestHandlerDeps {
  httpClient: (url: string, opts: AxiosRequestConfig) => Promise<AxiosResponse>
  syncFileReader: (
    path: string,
    opts: {
      encoding?: string
    },
  ) => string | Buffer
  deploymentUrl: string
  prerenderApiKey: string
  logger: {
    info: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
  }
}

export const requestHandler =
  (dependencyOverrides: Partial<RequestHandlerDeps>) =>
  async (request: functions.https.Request, res: any) => {
    const pathName = request.path
    const dependencies: RequestHandlerDeps = {
      httpClient: axios.get,
      syncFileReader: fs.readFileSync,
      logger: functions.logger,
      prerenderApiKey: '',
      deploymentUrl: '',
      ...dependencyOverrides,
    }
    const { logger } = dependencies
    // Handle bot request
    if (dependencies.prerenderApiKey) {
      if (isBotRequest(request.headers)) {
        const prerenderUrl = `https://service.prerender.io/${dependencies.deploymentUrl}${pathName}`
        logger.info('[SeoRender] bot request', {
          pathName,
          userAgent: request.headers['user-agent'],
        })
        try {
          const { data, status } = await dependencies.httpClient(prerenderUrl, {
            headers: {
              'X-Prerender-Token': dependencies.prerenderApiKey,
            },
            responseType: 'text',
          })
          res.status = status
          return res.send(data)
        } catch (error) {
          // Bot request error, will proceed as regular user after logging
          if (
            (error as AxiosError)?.response?.status === 401 ||
            error?.message?.includes('401')
          ) {
            logger.error('Prerender access denied, check configured token')
          }
          logger.error(`Error fetching response from prerender:`, {
            error,
            prerenderUrl,
          })
        }
      }
    } else {
      logger.warn('No prerender key supplied, seo-render will not function')
    }
    // Handle user request - serve index file uploaded with functions
    // NOTE - CC 2022-07-05 - This is difficult to keep updated when developing/debugging
    // Should ideally add a better system that ensures platform built before functions (e.g. turborepo/nx)
    try {
      const response = dependencies.syncFileReader('./index.html', {
        encoding: 'utf-8',
      })
      return res.status(200).send(response)
    } catch (error) {
      logger.error(`Unable to load index.html from filesystem`, {
        error,
      })
    }
    // Fallback - request index file from deployment url
    try {
      const { status, data } = await dependencies.httpClient(
        `${dependencies.deploymentUrl}/index.html`,
        { responseType: 'text' },
      )
      return res.status(status).send(data)
    } catch (err) {
      logger.error('Unable to fetch index.html over HTTP')
    }
    // End of the line
    logger.error('Unable to return any content to the user request')
    res.status = 500
    return res.send('error')
  }

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

export function isBotRequest(requestHeaders: IncomingHttpHeaders) {
  const requestUserAgent = (requestHeaders['user-agent'] || '').toLowerCase()
  const xPrerender = requestHeaders['x-prerender']
  return !xPrerender && containsOneOfThem(BOT_AGENTS, requestUserAgent)
}
