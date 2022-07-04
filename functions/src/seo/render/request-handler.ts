import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { https } from 'firebase-functions'
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
  (dependencies: RequestHandlerDeps) =>
  async (request: https.Request, res: any) => {
    const pathName = request.path.replace('/seo', '')

    if (!!dependencies.prerenderApiKey && isBotRequest(request.headers)) {
      dependencies.logger.info(`Bot user detected.`)
      try {
        const { data, status } = await dependencies.httpClient(
          `https://service.prerender.io/${dependencies.deploymentUrl}${pathName}`,
          {
            headers: {
              'X-Prerender-Token': dependencies.prerenderApiKey,
            },
            responseType: 'text',
          },
        )

        res.status = status
        return res.send(data)
      } catch (error) {
        dependencies.logger.error(`Error fetching response from prerender:`, {
          error,
        })
      }
    }

    try {
      const response = dependencies.syncFileReader('./index.html', {
        encoding: 'utf-8',
      })

      res.status = 200

      return res.send(response)
    } catch (error) {
      dependencies.logger.error(`Unable to load index.html from filesystem`, {
        error,
      })
    }

    try {
      const { status, data } = await dependencies.httpClient(
        `${dependencies.deploymentUrl}/index.html`,
        {
          responseType: 'text',
        },
      )

      res.status = status

      return res.send(data)
    } catch (err) {
      dependencies.logger.error('Unable to fetch index.html over HTTP')
    }

    dependencies.logger.error(
      'Unable to return any content to the user request',
    )

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
