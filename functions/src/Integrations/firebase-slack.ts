import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import * as request from 'request'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const SLACK_WEBHOOK_URL = CONFIG.integrations.slack_webhook

export const notifyNewPin = functions.firestore
  .document('v3_mappins/{pinId}')
  .onWrite((change, context) => {
    const info = change.after.exists ? change.after.data() : null
    const prevInfo = change.before.exists ? change.before.data() : null
    const prevModeration = (prevInfo !== null) ? prevInfo.moderation : null;
    if (prevModeration === info.moderation){ // Avoid infinite loop
      return null
    }
    if (prevModeration === 'accepted' && info.moderation === 'awaiting-moderation'){ // If edited after being accepted keep it accepted and avoid message #1008
      return change.after.ref.set({
        previouslyAccepted: true,
        moderation: 'accepted'
      }, {merge: true});
    }
    if (info === null || info.moderation !== 'awaiting-moderation' || prevModeration === 'awaiting-moderation') {
      return null
    }

    const id = info._id
    const type = info.type
    const loc = info.location
    //  console.log(info);
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
export const notifyNewHowTo = functions.firestore
  .document('v3_howtos/{id}')
  .onWrite((change, context) => {
    const info = change.after.exists ? change.after.data() : null
    const prevInfo = change.before.exists ? change.before.data() : null
    const prevModeration = (prevInfo !== null) ? prevInfo.moderation : null;
    if (prevModeration === info.moderation){ // Avoid infinite loop
      return null
    }
    if (prevModeration === 'accepted' && info.moderation === 'awaiting-moderation'){ // If edited after being accepted keep it accepted and avoid message #1008
      return change.after.ref.set({
        previouslyAccepted: true,
        moderation: 'accepted'
      }, {merge: true});
    }
    if (info === null || info.moderation !== 'awaiting-moderation') {
      return null
    }

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
export const notifyNewEvent = functions.firestore
  .document('v3_events/{id}')
  .onWrite((change, context) => {
    const info = change.after.exists ? change.after.data() : null
    if (info === null || info.moderation !== 'awaiting-moderation') {
      return null
    }

    const user = info._createdBy
    const url = info.url
    const location = info.location.country
    console.info(info)
    request.post(
      SLACK_WEBHOOK_URL,
      {
        json: {
          text: `📅 Jeej new event in *${location}* by _${user}_ awaiting moderation, posted here:
            ${url}`,
        },
      },
      (err, res) => {
        if (err) {
          console.error(err)
        } else {
          console.log('post success')
          return res
        }
      },
    )
  })
