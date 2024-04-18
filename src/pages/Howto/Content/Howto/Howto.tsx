import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react'
import {
  ArticleCallToAction,
  Button,
  Loader,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { seoTagsUpdate } from 'src/utils/seo'
import { Box } from 'theme-ui'

import { HowToComments } from './HowToComments/HowToComments'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import Step from './Step/Step'

import type { IUser, UserComment } from 'src/models'

export const Howto = observer(() => {
  const { slug } = useParams()
  const { howtoStore, userStore, aggregationsStore, tagsStore } =
    useCommonStores().stores
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loggedInUser = userStore.activeUser
  const { activeHowto } = howtoStore

  const onUsefulClick = async (
    howtoId: string,
    howToSlug: string,
    eventCategory: string,
  ) => {
    const loggedInUser = howtoStore.activeUser
    if (!loggedInUser?.userName) {
      return null
    }

    howtoStore.toggleUsefulByUser(howtoId, loggedInUser?.userName)
    const hasUserVotedUseful = howtoStore.userVotedActiveHowToUseful

    trackEvent({
      category: eventCategory,
      action: hasUserVotedUseful ? 'HowtoUseful' : 'HowtoUsefulRemoved',
      label: howToSlug,
    })
  }

  useEffect(() => {
    const init = async () => {
      await howtoStore.setActiveHowtoBySlug(slug)

      seoTagsUpdate({
        title: howtoStore.activeHowto?.title,
        description: howtoStore.activeHowto?.description,
        imageUrl: howtoStore.activeHowto?.cover_image?.downloadUrl,
      })
      setIsLoading(false)
    }
    init()

    return () => {
      seoTagsUpdate({})
      howtoStore.removeActiveHowto()
    }
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (!activeHowto) {
    return (
      <Navigate
        to={{
          pathname: `/how-to/`,
          search:
            '?search=' +
            (slug || '').replace(/-/gi, ' ') +
            '&source=how-to-not-found',
        }}
      />
    )
  }

  const activeHowToComments: UserComment[] = howtoStore
    .getActiveHowToComments()
    .map(
      (c): UserComment => ({
        ...c,
        isEditable:
          [loggedInUser?._id, loggedInUser?.userName].includes(c._creatorId) ||
          isAllowedToEditContent(activeHowto, loggedInUser as IUser),
      }),
    )

  const { allTagsByKey } = tagsStore
  const howto = {
    ...activeHowto,
    tagList:
      activeHowto.tags &&
      Object.keys(activeHowto.tags)
        .map((t) => allTagsByKey[t])
        .filter(Boolean),
  }

  const hasUserVotedUseful = howtoStore.userVotedActiveHowToUseful
  const isVerified = isUserVerifiedWithStore(
    howto._createdBy,
    aggregationsStore,
  )
  return (
    <>
      <HowtoDescription
        howto={howto}
        key={activeHowto._id}
        needsModeration={howtoStore.needsModeration(activeHowto)}
        loggedInUser={loggedInUser as IUser}
        commentsCount={howtoStore.commentsCount}
        votedUsefulCount={howtoStore.votedUsefulCount}
        hasUserVotedUseful={hasUserVotedUseful}
        onUsefulClick={() =>
          onUsefulClick(howto._id, howto.slug, 'HowtoDescription')
        }
      />
      <Box mt={9}>
        {activeHowto.steps.map((step: any, index: number) => (
          <Step step={step} key={index} stepindex={index} />
        ))}
      </Box>
      <UserEngagementWrapper>
        <ArticleCallToAction
          author={{
            userName: howto._createdBy,
            countryCode: howto.creatorCountry,
            isVerified,
          }}
        >
          <Button
            sx={{ fontSize: 2 }}
            onClick={() => {
              trackEvent({
                category: 'ArticleCallToAction',
                action: 'ScrollHowtoComment',
                label: howto.slug,
              })
              document
                .querySelector('[data-target="create-comment-container"]')
                ?.scrollIntoView({
                  behavior: 'smooth',
                })
              ;(
                document.querySelector(
                  '[data-cy="comments-form"]',
                ) as HTMLTextAreaElement
              )?.focus()

              return false
            }}
          >
            Leave a comment
          </Button>
          {howto.moderation === IModerationStatus.ACCEPTED && (
            <UsefulStatsButton
              votedUsefulCount={howtoStore.votedUsefulCount}
              hasUserVotedUseful={hasUserVotedUseful}
              isLoggedIn={!!loggedInUser}
              onUsefulClick={() => {
                onUsefulClick(howto._id, howto.slug, 'ArticleCallToAction')
              }}
            />
          )}
        </ArticleCallToAction>
        <HowToComments comments={activeHowToComments} />
      </UserEngagementWrapper>
    </>
  )
})
