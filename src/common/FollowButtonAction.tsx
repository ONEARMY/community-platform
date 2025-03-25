import { FollowButton } from 'oa-components'
import { subscribersService } from 'src/services/subscribersService'

import { trackEvent } from './Analytics'

import type { ContentType, IUserDB, News } from 'oa-shared'
import type { Dispatch, SetStateAction } from 'react'

interface IProps {
  activeUser: IUserDB | null | undefined
  contentType: ContentType
  item: News
  setSubscribed: Dispatch<SetStateAction<boolean>>
  setSubscribersCount: Dispatch<SetStateAction<number>>
  subscribed: boolean
}

export const FollowButtonAction = (props: IProps) => {
  const {
    activeUser,
    contentType,
    item,
    setSubscribed,
    setSubscribersCount,
    subscribed,
  } = props

  const onFollowClick = async () => {
    if (!activeUser?._id) {
      return
    }

    if (!subscribed) {
      const response = await subscribersService.add(contentType, item.id)

      if (response.ok) {
        setSubscribed(true)
        setSubscribersCount((prev: number) => prev + 1 || 1)
      }
    } else {
      const response = await subscribersService.remove(contentType, item.id)

      if (response.ok) {
        setSubscribed(false)
        setSubscribersCount((prev) => prev - 1 || 0)
      }
    }
    const action = subscribed ? 'Unsubscribed' : 'Subscribed'

    trackEvent({
      category: contentType,
      action,
      label: item.slug,
    })
  }

  return (
    <FollowButton
      hasUserSubscribed={subscribed}
      isLoggedIn={!!activeUser}
      onFollowClick={onFollowClick}
      sx={{ alignSelf: '' }}
    />
  )
}
