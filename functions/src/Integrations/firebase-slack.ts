import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import axios from 'axios'
import { IModerationStatus } from 'oa-shared'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const SLACK_WEBHOOK_URL = CONFIG.integrations.slack_webhook

export const notifyPinAwaitingModeration = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_mappins/{pinId}')
  .onCreate(async (snapshot) => {
    const info = snapshot.data()
    const id = info._id
    const type = info.type
    const moderation = info.moderation

    if (moderation !== IModerationStatus.AWAITING_MODERATION) return

    return await axios
      .post(SLACK_WEBHOOK_URL, {
        text: `📍 *New ${type}* pin from _${id}_ awaiting moderation. \n Location here ${SITE_URL}/map/#${id}`,
      })
      .catch((err) => {
        console.error(err)
      })
  })

export const notifyNewHowTo = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_howtos/{id}')
  .onCreate(async (snapshot) => {
    const info = snapshot.data()
    const user = info._createdBy
    const title = info.title
    const slug = info.slug

    return await axios
      .post(SLACK_WEBHOOK_URL, {
        text: `📓 Yeah! New How To *${title}* by _${user}_ awaiting moderation,
            check it out: ${SITE_URL}/how-to/${slug}`,
      })
      .catch((err) => {
        console.error(err)
      })
  })
