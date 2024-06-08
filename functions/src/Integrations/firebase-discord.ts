import axios, { AxiosResponse, AxiosError } from 'axios'
import { DiscordWebhookPayload } from '../models'
import { CONFIG } from '../config/config'

const DISCORD_WEBHOOK_URL = CONFIG.integrations.discord_webhook

export const sendDiscordNotification = async (
  payload: DiscordWebhookPayload,
) => {
  await axios
    .post(DISCORD_WEBHOOK_URL, payload)
    .then(handleResponse, handleErr)
    .catch(handleErr)
}

const handleResponse = (res: AxiosResponse) => {
  console.log('post success')
  return res
}

const handleErr = (err: AxiosError) => {
  console.error('error')
  throw err
}
