import axios, { AxiosResponse, AxiosError } from 'axios'
import { DiscordWebhookPayload } from '../models'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID
const DISCORD_BOT_TOKEN = Buffer.from(
  process.env.DISCORD_BOT_TOKEN,
  'base64',
).toString('ascii')

/**
 * Sends a Discord notification using the provided payload to the configured webhook URL.
 *
 * @param payload The payload containing the message content, username, avatar, and other optional properties.
 * @returns A promise that resolves when the notification is successfully sent or rejects with an error.
 */
export const sendDiscordNotification = async (
  payload: DiscordWebhookPayload,
) => {
  await axios
    .post(DISCORD_WEBHOOK_URL, payload)
    .then(handleResponse, handleErr)
    .catch(handleErr)
}

/**
 * Retrieves latest Discord messages from a configured channel.
 *
 * @param limit The maximum number of messages to retrieve (default is 50)
 * @returns An array of Discord messages from the specified channel
 * @throws Error if there is an issue with the API request or response
 */
export const getDiscordMessages = async (limit = 50) => {
  const res = await axios
    .get(
      `https://discord.com/api/channels/${DISCORD_CHANNEL_ID}/messages?limit=${limit}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      },
    )
    .then(handleResponse, handleErr)
    .catch(handleErr)
  const messages = res.data ?? []
  return messages
}

const handleResponse = (res: AxiosResponse) => {
  return res
}

const handleErr = (err: AxiosError) => {
  console.error('error')
  console.log(err)
  throw err
}
