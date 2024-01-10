import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { IMapPin } from '../models'
import { IModerationStatus } from 'oa-shared'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const DISCORD_WEBHOOK_URL = CONFIG.integrations.discord_webhook

export const notifyPinAccepted = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_mappins/{pinId}')
  .onUpdate(async (change, context) => {
    const info = (change.after.data() as IMapPin) || null
    const prevInfo = (change.before.data() as IMapPin) || null
    const previouslyAccepted =
      prevInfo?.moderation === IModerationStatus.ACCEPTED
    const shouldNotify =
      info.moderation === IModerationStatus.ACCEPTED && !previouslyAccepted
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

export const notifyHowToAccepted = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_howtos/{id}')
  .onUpdate(async (change, context) => {
    const info = change.after.exists ? change.after.data() : null
    const prevInfo = change.before.exists ? change.before.data() : null
    const previouslyAccepted =
      prevInfo?.moderation === IModerationStatus.ACCEPTED
    const shouldNotify =
      info.moderation === IModerationStatus.ACCEPTED && !previouslyAccepted
    if (!shouldNotify) {
      return null
    }
    const { _createdBy, title, slug } = info
    await axios
      .post(DISCORD_WEBHOOK_URL, {
        content: `📓 Yeah! New How To **${title}** by *${_createdBy}*
            check it out: <${SITE_URL}/how-to/${slug}>`,
      })
      .then(handleResponse, handleErr)
      .catch(handleErr)
  })

const handleResponse = (res: AxiosResponse) => {
  console.log('post success')
  return res
}
const handleErr = (err: AxiosError) => {
  console.error('error')
  throw err
}
