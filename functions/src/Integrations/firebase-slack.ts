import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import * as request from 'request'
import { IModerationStatus } from 'oa-shared'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const SLACK_WEBHOOK_URL = CONFIG.integrations.slack_webhook

export const notifyNewPin = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_mappins/{pinId}')
  .onCreate((snapshot) => {
    const info = snapshot.data()
    const id = info._id
    const type = info.type
    const moderation = info.moderation

    if (moderation !== IModerationStatus.AWAITING_MODERATION) return

    request.post(
      SLACK_WEBHOOK_URL,
      {
        json: {
          text: `📍 *New ${type}* pin from _${id}_ awaiting moderation. \n Location here ${SITE_URL}/map/#${id}`,
        },
      },
      (err, res) => {
        if (err) {
          console.error(err)
          return
        } else {
          return res
        }
      },
    )
  })

export const notifyNewHowTo = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_howtos/{id}')
  .onCreate((snapshot) => {
    const info = snapshot.data()
    const user = info._createdBy
    const title = info.title
    const slug = info.slug
    //  console.log(info);
    request.post(
      SLACK_WEBHOOK_URL,
      {
        json: {
          text: `📓 Yeah! New How To *${title}* by _${user}_ awaiting moderation,
            check it out: ${SITE_URL}/how-to/${slug}`,
        },
      },
      (err, res) => {
        if (err) {
          console.error(err)
          return
        } else {
          return res
        }
      },
    )
  })
