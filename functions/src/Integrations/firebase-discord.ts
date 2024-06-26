import { CONFIG } from '../config/config'
import * as functions from 'firebase-functions'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { IMapPin, IResearchDB } from '../models'
import { IModerationStatus } from 'oa-shared'

const SITE_URL = CONFIG.deployment.site_url
// e.g. https://dev.onearmy.world or https://community.preciousplastic.com

const DISCORD_WEBHOOK_URL = CONFIG.integrations.discord_webhook

export const notifyPinPublished = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_mappins/{pinId}')
  .onUpdate(async (change, context) => {
    const info = (change.after.data() as IMapPin) || null
    const prevInfo = (change.before.data() as IMapPin) || null
    const previouslyAccepted =
      prevInfo?.moderation === IModerationStatus.ACCEPTED
    const shouldNotify =
      info.moderation === IModerationStatus.ACCEPTED && !previouslyAccepted
    if (!shouldNotify) {
      return null
    }
    const { _id, type } = info
    await axios
      .post(DISCORD_WEBHOOK_URL, {
        content: `📍 *New ${type}* pin from ${_id}. \n Location here <${SITE_URL}/map/#${_id}>`,
      })
      .then(handleResponse, handleErr)
      .catch(handleErr)
  })

export const notifyHowtoPublished = functions
  .runWith({ memory: '512MB' })
  .firestore.document('v3_howtos/{id}')
  .onUpdate(async (change, context) => {
    const info = change.after.exists ? change.after.data() : null
    const prevInfo = change.before.exists ? change.before.data() : null
    const previouslyAccepted =
      prevInfo?.moderation === IModerationStatus.ACCEPTED
    const shouldNotify =
      info.moderation === IModerationStatus.ACCEPTED && !previouslyAccepted
    if (!shouldNotify) {
      return null
    }
    const { _createdBy, title, slug } = info
    await axios
      .post(DISCORD_WEBHOOK_URL, {
        content: `📓 Yeah! New How To **${title}** by *${_createdBy}*
            check it out: <${SITE_URL}/how-to/${slug}>`,
      })
      .then(handleResponse, handleErr)
      .catch(handleErr)
  })

export const notifyResearchUpdatePublished = functions
  .runWith({ memory: '512MB' })
  .firestore.document('research_rev20201020/{id}')
  .onUpdate(async (change) => {
    if (
      DISCORD_WEBHOOK_URL === '' ||
      DISCORD_WEBHOOK_URL === undefined ||
      DISCORD_WEBHOOK_URL === null
    ) {
      console.log('No webhook URL configured')
      return
    }

    const previousContent = change.before.data() as IResearchDB
    const updatedContent = change.after.data() as IResearchDB

    if (previousContent.updates.length >= updatedContent.updates.length) {
      console.log('There is no new update')
      return
    }

    const newUpdateIndex = updatedContent.updates.length - 1
    const newUpdate = updatedContent.updates[newUpdateIndex]

    // On Research Updates, we actually expect the collaborators to be a single person
    // but it is a list.
    // source:
    // https://github.com/ONEARMY/community-platform/issues/3533#issuecomment-2171799601
    const collaborators = newUpdate.collaborators || []
    const author = collaborators[0] || 'unknown'

    const title = newUpdate.title

    // There is no way to "deep link" to an individual section
    // so we link to the whole article
    const slug = updatedContent.slug

    try {
      const response = await axios.post(DISCORD_WEBHOOK_URL, {
        content:
          `📝 New update from ${author} in their research: ${title}\n` +
          `Learn about it here: ${SITE_URL}/research/${slug}`,
      })
      handleResponse(response)
    } catch (error) {
      handleErr(error)
    }
  })

export const notifyQuestionPublished = functions
  .runWith({ memory: '512MB' })
  .firestore.document('questions_rev20230926/{id}')
  // currently, questions are immediately posted with no review.
  // if that changes, this code will need to be updated.
  .onCreate(async (snapshot) => {
    const info = snapshot.data()
    console.log(info)

    const username = info._createdBy
    const title = info.title
    const slug = info.slug

    try {
      const response = await axios.post(DISCORD_WEBHOOK_URL, {
        content: `❓ ${username} has a new question: ${title}\nHelp them out and answer here: <${SITE_URL}/questions/${slug}>`,
      })
      handleResponse(response)
    } catch (error) {
      handleErr(error)
    }
  })

const handleResponse = (res: AxiosResponse) => {
  console.log('post success')
  return res
}
const handleErr = (err: AxiosError) => {
  console.error('error')
  console.log(err)
  throw err
}
