import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { FollowButton } from 'oa-components'
import { subscribersService } from 'src/services/subscribersService'

import { useCommonStores } from './hooks/useCommonStores'
import { trackEvent } from './Analytics'

import type { OptionalFollowButtonProps } from 'oa-components'
import type {
  Comment,
  News,
  Question,
  ResearchUpdate,
  SubscribableContentTypes,
} from 'oa-shared'

interface IProps extends OptionalFollowButtonProps {
  contentType: SubscribableContentTypes
  item: Comment | News | Question | ResearchUpdate
  setSubscribersCount?: Dispatch<SetStateAction<number>>
  hideSubscribeIcon?: boolean
  tooltipContent?: string
}

export const FollowButtonAction = (props: IProps) => {
  const { contentType, hideSubscribeIcon, item, setSubscribersCount } = props
  const [subscribed, setSubscribed] = useState<boolean>(false)

  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser

  useEffect(() => {
    const getSubscribed = async () => {
      const subscribed = await subscribersService.isSubscribed(
        contentType,
        item.id,
      )
      setSubscribed(subscribed)
    }

    if (activeUser) {
      getSubscribed()
    }
  }, [activeUser, item])

  const onFollowClick = async () => {
    if (!activeUser?._id) {
      return
    }

    if (!subscribed) {
      const response = await subscribersService.add(contentType, item.id)

      if (response.ok) {
        setSubscribed(true)
        setSubscribersCount &&
          setSubscribersCount((prev: number) => prev + 1 || 1)
      }
    } else {
      const response = await subscribersService.remove(contentType, item.id)

      if (response.ok) {
        setSubscribed(false)
        setSubscribersCount && setSubscribersCount((prev) => prev - 1 || 0)
      }
    }
    const action = subscribed ? 'Unsubscribed' : 'Subscribed'

    trackEvent({
      category: contentType,
      action,
      label: `${item.id}`,
    })
  }

  if (!subscribed && hideSubscribeIcon) {
    return
  }

  return (
    <FollowButton
      {...props}
      hasUserSubscribed={subscribed}
      isLoggedIn={!!activeUser}
      onFollowClick={onFollowClick}
    />
  )
}
