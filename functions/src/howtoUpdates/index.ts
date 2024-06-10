import * as functions from 'firebase-functions'
import { IHowtoDB } from '../models'
import { IModerationStatus } from 'oa-shared'
import { sendDiscordNotification } from '../Integrations/firebase-discord'
import { CONFIG } from '../config/config'

const SITE_URL = CONFIG.deployment.site_url

export const howtoUpdate = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_howtos/{id}')
  .onUpdate(async (change, context) => {
    const currentState = (change.after.data() as IHowtoDB) || null
    const previousState = (change.before.data() as IHowtoDB) || null

    if (shouldNotify(currentState, previousState)) {
      const { _createdBy, title, slug } = currentState
      const content = `📓 Yeah! New How To **${title}** by *${_createdBy}* \n check it out: <${SITE_URL}/how-to/${slug}>`
      await sendDiscordNotification({ content })
    }
  })

const shouldNotify = (currentState: IHowtoDB, previousState: IHowtoDB) => {
  const previouslyAccepted =
    previousState?.moderation === IModerationStatus.ACCEPTED
  return (
    currentState.moderation === IModerationStatus.ACCEPTED &&
    !previouslyAccepted
  )
}
