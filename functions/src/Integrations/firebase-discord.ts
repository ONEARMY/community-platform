import axios from 'axios'
import * as functions from 'firebase-functions'
import { Moderation } from 'oa-shared'

import { CONFIG } from '../config/config'

import type { AxiosError, AxiosResponse } from 'axios'
import type { IMapPin } from 'oa-shared/models'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const DISCORD_WEBHOOK_URL = CONFIG.integrations.discord_webhook

export const notifyPinPublished = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_mappins/{pinId}')
  .onUpdate(async (change, context) => {
    const info = (change.after.data() as IMapPin) || null
    const prevInfo = (change.before.data() as IMapPin) || null
    const previouslyAccepted = prevInfo?.moderation === Moderation.ACCEPTED
    const shouldNotify =
      info.moderation === Moderation.ACCEPTED && !previouslyAccepted
    if (!shouldNotify) {
      return null
    }
    const { _id, type } = info
    await axios
      .post(DISCORD_WEBHOOK_URL, {
        content: `📍 *New ${type}* pin from ${_id}. \n Location here <${SITE_URL}/map/#${_id}>`,
      })
      .then(handleResponse, handleErr)
      .catch(handleErr)
  })

export const notifyLibraryItemPublished = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_howtos/{id}')
  .onUpdate(async (change, context) => {
    const info = change.after.exists ? change.after.data() : null
    const prevInfo = change.before.exists ? change.before.data() : null
    const previouslyAccepted = prevInfo?.moderation === Moderation.ACCEPTED
    const shouldNotify =
      info.moderation === Moderation.ACCEPTED && !previouslyAccepted
    if (!shouldNotify) {
      return null
    }
    const { _createdBy, title, slug } = info
    await axios
      .post(DISCORD_WEBHOOK_URL, {
        content: `📓 Yeah! New library project **${title}** by *${_createdBy}*
            check it out: <${SITE_URL}/library/${slug}>`,
      })
      .then(handleResponse, handleErr)
      .catch(handleErr)
  })

function sendDiscordMessage(content: string) {
  return axios.post(DISCORD_WEBHOOK_URL, {
    content: content,
  })
}

const handleResponse = (res: AxiosResponse) => {
  console.log('post success')
  return res
}
const handleErr = (err: AxiosError) => {
  console.error('error')
  console.log(err)
  throw err
}
