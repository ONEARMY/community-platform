import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import * as request from 'request'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const DISCORD_WEBHOOK_URL = CONFIG.integrations.discord_webhook

export const notifyPinAccepted = functions.firestore
  .document('v2_mappins/{pinId}')
  .onWrite((change, context) => {
    const info = change.after.exists ? change.after.data() : null;
    if(info === null || info.moderation !== 'accepted'){
      return
    }

    const id = info._id
    const type = info.type
    const loc = info.location
    //  console.log(info);
    request.post(
      DISCORD_WEBHOOK_URL,
      {
        json: {
          content: `📍 *New ${type}* pin from ${id}. \n Location here ${SITE_URL}/map/#${id}`,
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
export const notifyHowToAccepted = functions.firestore
  .document('v2_howtos/{id}')
  .onWrite((change, context) => {
    const info = change.after.exists ? change.after.data() : null;
    if(info === null || info.moderation !== 'accepted'){
      return
    }

    const user = info._createdBy
    const title = info.title
    const slug = info.slug
    //  console.log(info);
    request.post(
      DISCORD_WEBHOOK_URL,
      {
        json: {
          content: `📓 Yeah! New How To "* ${title} *" by ${user}
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
export const notifyEventAccepted = functions.firestore
  .document('v2_events/{id}')
  .onWrite((change, context) => {
    const info = change.after.exists ? change.after.data() : null;
    if(info === null || info.moderation !== 'accepted'){
      return
    }

    const user = info._createdBy
    const url = info.url
    const location = info.location.country
    console.info(info)
    request.post(
      DISCORD_WEBHOOK_URL,
      {
        json: {
          content: `📅 Jeej new event in *${location}* by ${user} posted here:
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
