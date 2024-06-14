import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import * as request from 'request'
import { IModerationStatus } from 'oa-shared'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const SLACK_WEBHOOK_URL = CONFIG.integrations.slack_webhook
const DISCORD_WEBHOOK_URL = CONFIG.integrations.discord_webhook

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

export const notifyAcceptedQuestion = functions
  .runWith({ memory: '512MB' })
  .firestore.document('questions_rev20230926/{id}')
  // currently, questions are immediately posted with no review.
  // if that changes, this code will need to change.
  .onCreate((snapshot) => {
    const info = snapshot.data()
    console.log(info)

    const username = info._createdBy
    const title = info.title
    const slug = info.slug

    request.post(
      DISCORD_WEBHOOK_URL,
      {
        json: {
          text: `❓ ${username} has a new question: ${title}\n Help them out and answer here: ${SITE_URL}/questions/${slug}`,
        },
      },
      (error, response) => {
        if (error) {
          console.error(error)
          return
        } else {
          return response
        }
      },
    )
  })
