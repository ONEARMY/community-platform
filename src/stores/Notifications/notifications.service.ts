/*
    Sometimes it may be useful to pass information between unrelated components
    (e.g. side-wide notice, confirmation of event etc.)
    These could be handled via other mobx stores and creating subscription objects
    (e.g. rxjs behaviorSubjects), however additional, simple methods are given here
    to allow for pubsub exchanges wihtout use of mobx. We keep all the methods here
    to make it easier to see what topics are in use
*/

import PubSub from 'pubsub-js'

// topics can be subscribed to during componentDidMountMethods
const notificationSubscribe = (
  topic: PubSubTopics,
  callback: (data: PubSubData) => void,
) => {
  return PubSub.subscribe(topic, (t, data) => {
    callback(data)
  })
}
// subscriptions should be removed on componentWillUnmount to avoid memory leaks
const notificationUnsubscribe = (topic: PubSubTopics) => {
  return PubSub.unsubscribe(topic)
}
const notificationUnsubscribeAll = () => {
  return PubSub.clearAllSubscriptions()
}
const notificationPublish = (topic: PubSubTopics, data?: any) => {
  return PubSub.publish(topic, data)
}

export {
  notificationSubscribe,
  notificationUnsubscribe,
  notificationUnsubscribeAll,
  notificationPublish,
}

// Note, this meta provides strict typings for topic names however loses the
// coupling for specfic topic-data pairs. This could likely be improved on in the
// future:  https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/
type PubSubMeta =
  | {
      topic: 'Profile.Avatar.Updated'
      data: never
    }
  | {
      topic: 'Example.With.Data'
      data: {
        prop1: string
      }
    }
type PubSubTopics = PubSubMeta['topic']
type PubSubData = PubSubMeta['data']
