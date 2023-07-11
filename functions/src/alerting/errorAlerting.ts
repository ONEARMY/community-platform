import axios from 'axios'
import { CONFIG } from '../config/config'
import { EventContext } from 'firebase-functions/v1'

const DISCORD_ALERT_CHANNEL_WEBHOOK_URL =
  CONFIG.integrations.discord_alert_channel_webhook

const sendErrorAlert = async (functionName: string, error: Error) => {
  console.error(`Error in ${functionName}`, error)
  await axios
    .post(DISCORD_ALERT_CHANNEL_WEBHOOK_URL, {
      content: `Caught error in ${functionName}: ${JSON.stringify(error)}`,
    })
    .catch((error) => console.error(`Error sending discord alert`, error))
}

export const withErrorAlerting = async (
  context: EventContext,
  fn: () => any,
) => {
  try {
    fn()
  } catch (error) {
    sendErrorAlert(context.eventId, error)
  }
}
