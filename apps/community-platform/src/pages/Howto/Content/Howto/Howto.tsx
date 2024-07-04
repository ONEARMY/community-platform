import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  ArticleCallToAction,
  Button,
  Loader,
  UsefulStatsButton,
  UserEngagementWrapper,
} from '@onearmy.apps/components'
import { IModerationStatus } from '@onearmy.apps/shared'
import { observer } from 'mobx-react'
import { Box } from 'theme-ui'

import { trackEvent } from '../../../../common/Analytics'
import { useCommonStores } from '../../../../common/hooks/useCommonStores'
import { Breadcrumbs } from '../../../../pages/common/Breadcrumbs/Breadcrumbs'
import { seoTagsUpdate } from '../../../../utils/seo'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import { HowtoDiscussion } from './HowToDiscussion/HowToDiscussion'
import Step from './Step/Step'

import type { IUser } from '../../../../models'

export const Howto = observer(() => {
  const { slug } = useParams()
  const { howtoStore, userStore, aggregationsStore } = useCommonStores().stores
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0)

  const loggedInUser = userStore.activeUser
  const { activeHowto } = howtoStore

  const onUsefulClick = async (
    howtoId: string,
    howToSlug: string,
    eventCategory: string,
  ) => {
    const loggedInUser = howtoStore.activeUser
    if (!loggedInUser?.userName) {
      return
    }

    await howtoStore.toggleUsefulByUser(howtoId, loggedInUser?.userName)
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
        title: `${howtoStore.activeHowto?.title} - How-to`,
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

  const howto = activeHowto
  const hasUserVotedUseful = howtoStore.userVotedActiveHowToUseful
  const isVerified = aggregationsStore.isVerified(howto._createdBy)

  return (
    <>
      <Breadcrumbs content={howto} variant="howto" />
      <HowtoDescription
        howto={howto}
        key={activeHowto._id}
        needsModeration={howtoStore.needsModeration(activeHowto)}
        loggedInUser={loggedInUser as IUser}
        commentsCount={totalCommentsCount}
        votedUsefulCount={howtoStore.votedUsefulCount}
        hasUserVotedUseful={hasUserVotedUseful}
        onUsefulClick={async () =>
          await onUsefulClick(howto._id, howto.slug, 'HowtoDescription')
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
              onUsefulClick={() =>
                onUsefulClick(howto._id, howto.slug, 'ArticleCallToAction')
              }
            />
          )}
        </ArticleCallToAction>
        <HowtoDiscussion
          howtoDocId={howto._id}
          setTotalCommentsCount={setTotalCommentsCount}
        />
      </UserEngagementWrapper>
    </>
  )
})
