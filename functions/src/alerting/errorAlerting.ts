import axios from 'axios'
import { CONFIG } from '../config/config'
import { EventContext } from 'firebase-functions/v1'

const DISCORD_ALERT_CHANNEL_WEBHOOK_URL =
  CONFIG?.integrations?.discord_alert_channel_webhook

export const sendErrorAlert = async (functionName: string, error: Error) => {
  console.error(`Error in ${functionName}`, error)
  if (!DISCORD_ALERT_CHANNEL_WEBHOOK_URL) {
    console.error(
      `No DISCORD_ALERT_CHANNEL_WEBHOOK_URL set, skipping sending alert`,
    )
    return
  }
  await axios
    .post(DISCORD_ALERT_CHANNEL_WEBHOOK_URL, {
      content: `Caught error in ${functionName}: ${JSON.stringify(error)}`,
    })
    .catch((error) => console.error(`Error sending discord alert`, error))
}

export const withErrorAlerting = async (
  context: EventContext,
  fn: (...params: any) => any,
  params: any[] = [],
) => {
  try {
    fn(...params)
  } catch (error) {
    sendErrorAlert(context.eventId, error)
  }
}
