import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import * as request from 'request'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const SLACK_WEBHOOK_URL = CONFIG.integrations.slack_webhook

export const notifyNewPin = functions.firestore
  .document('v3_mappins/{pinId}')
  .onCreate((snapshot, context) => {
    const info = snapshot.data()
    const id = info._id
    const type = info.type
    const loc = info.location
    //  console.log(info);
    request.post(
      SLACK_WEBHOOK_URL,
      {
        json: {
          text: `📍 *New ${type}* pin from ${id}. \n Location here (soon our own map) https://google.com/maps/@${loc.lat},${loc.lng},14z`,
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
  .onCreate((snapshot, context) => {
    const info = snapshot.data()
    const user = info._createdBy
    const title = info.title
    const slug = info.slug
    //  console.log(info);
    request.post(
      SLACK_WEBHOOK_URL,
      {
        json: {
          text: `📓 Yeah! New How To *${title}* by ${user}
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
  .onCreate((snapshot, context) => {
    const info = snapshot.data()
    const user = info._createdBy
    const url = info.url
    const location = info.location.country
    console.info(info)
    request.post(
      SLACK_WEBHOOK_URL,
      {
        json: {
          text: `📅 Jeej new event in *${location}* by ${user} posted here:
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
