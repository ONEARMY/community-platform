import { PubSub } from '@google-cloud/pubsub'

interface ITriggerOptions {
  trigger: 'topic' | 'schedule'
  name: string
  payload: any
}
const defaultOptions: ITriggerOptions = {
  trigger: 'topic',
  name: 'test-topic',
  payload: {},
}

/**
 * Trigger a pubsub message
 * @param options.trigger - specify as 'schedule' if trying to call a scheduled function.
 * Default 'topic'
 * @param options.name - name of the topic to be scheduled. This will either be the name of the
 * scheduled function, or the name of the pubsub topic to trigger. Default "test-topic"
 * @param options.payload - optional payload passed to function. Default {}
 * @returns confirmation messageID of triggered pubsub
 */
export const triggerPubsub = async (options: ITriggerOptions) => {
  let { name, payload, trigger } = { ...defaultOptions, ...options }
  const pubsub = new PubSub()
  if (trigger === 'schedule') {
    // scheduled functions can be triggered by adding prefix to topic name
    // https://github.com/firebase/firebase-tools/pull/2011/files
    name = `firebase-schedule-${name}`
  }

  const [topics] = await pubsub.getTopics()
  if (!topics.find((t) => t.name.includes(name))) {
    await pubsub.createTopic(name)
  }

  const messageID = await pubsub.topic(name).publishMessage({ json: payload })
  return messageID
}
