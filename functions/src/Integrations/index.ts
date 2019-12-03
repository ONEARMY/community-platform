import { SERVICE_ACCOUNT_CONFIG } from '../config/config'

const functions = require('firebase-functions')
const request = require('request')

const project = SERVICE_ACCOUNT_CONFIG.project_id
console.log('project', project)
// add prefix to dev site
const prefix = project === 'precious-plastics-v4-dev' ? '[DEV] ' : ''

export const notifyNewPin = functions.firestore
  .document('v2_mappins/{pinId}')
  .onCreate((snapshot, context) => {
    const info = snapshot.data()
    const id = info._id
    const type = info.type
    const subType = info.subType
    const loc = info.location
    //  console.log(info);
    return request.post(
      'https://hooks.slack.com/services/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',
      {
        json: {
          text: `${prefix}New ${subType} ${type} from ${id},
           You can find it on google maps (yeh yeh i know its coming soon straight to the Precious Plastic Map) 
           https://google.com/maps/@${loc.lat},${loc.lng},14z`,
        },
      },
    )
  })
export const notifyNewHowTo = functions.firestore
  .document('v2_howtos/{id}')
  .onCreate((snapshot, context) => {
    const info = snapshot.data()
    const user = info._createdBy
    const title = info.title
    const slug = info.slug
    //  console.log(info);
    return request.post(
      'https://hooks.slack.com/services/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',
      {
        json: {
          text: `${prefix}Fuck Ya!! New How To ${title} by ${user}
            check it out @ https://community.preciousplastic.com/how-to/${slug}`,
        },
      },
    )
  })
export const notifyNewEvent = functions.firestore
  .document('v2_events/{id}')
  .onCreate((snapshot, context) => {
    const info = snapshot.data()
    const user = info._createdBy
    const url = info.url
    const location = info.location.country
    //  console.log(info);
    return request.post(
      'https://hooks.slack.com/services/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',
      {
        json: {
          text: `${prefix}Jeej new event in ${location} by ${user} posted here:
            ${url}`,
        },
      },
    )
  })
