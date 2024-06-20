import * as functions from 'firebase-functions'
import { IMapPin } from '../models'
import { IModerationStatus } from 'oa-shared'
import { sendDiscordNotification } from '../Integrations/firebase-discord'
import { CONFIG } from '../config/config'

const SITE_URL = CONFIG.deployment.site_url

export const mapPinUpdate = functions
  .runWith({ memory: '512MB', secrets: ["DISCORD_WEBHOOK_URL", "DISCORD_CHANNEL_ID", "DISCORD_BOT_TOKEN"] })
  .firestore.document('v3_mappins/{pinId}')
  .onUpdate(async (change, context) => {
    const currentState = (change.after.data() as IMapPin) || null
    const previousState = (change.before.data() as IMapPin) || null

    if (shouldNotify(currentState, previousState)) {
      const { _id, type } = currentState
      const content = `📍 *New ${type}* pin from ${_id}. \n Location here <${SITE_URL}/map/#${_id}>`
      await sendDiscordNotification({ content })
    }
  })

const shouldNotify = (currentState: IMapPin, previousState: IMapPin) => {
  const previouslyAccepted =
    previousState?.moderation === IModerationStatus.ACCEPTED
  return (
    currentState.moderation === IModerationStatus.ACCEPTED &&
    !previouslyAccepted
  )
}
