import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import {
  ArticleCallToAction,
  Button,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { Box } from 'theme-ui'

import HowtoDescription from './HowtoDescription/HowtoDescription'
import { HowtoDiscussion } from './HowToDiscussion/HowToDiscussion'
import Step from './Step/Step'

import type {
  IHowtoDB,
  IHowtoStep,
  IHowToStepFormInput,
  IUser,
} from 'oa-shared'

type HowtoParams = {
  howto: IHowtoDB
}

export const Howto = observer(({ howto }: HowtoParams) => {
  const { howtoStore, userStore, aggregationsStore } = useCommonStores().stores
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0)
  const [voted, setVoted] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(
    howto.votedUsefulBy?.length || 0,
  )
  const loggedInUser = userStore.activeUser
  const isVerified = aggregationsStore.isVerified(howto._createdBy)

  useEffect(() => {
    // This could be improved if we can load the user profile server-side
    if (
      howtoStore?.activeUser &&
      howto.votedUsefulBy?.includes(howtoStore.activeUser._id)
    ) {
      setVoted(true)
    }
  }, [howtoStore?.activeUser])

  const onUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory: string,
  ) => {
    const loggedInUser = howtoStore.activeUser
    if (!loggedInUser?.userName) {
      return
    }

    await howtoStore.toggleUsefulByUser(howto, loggedInUser?.userName)
    setVoted((prev) => !prev)

    setUsefulCount((prev) => {
      return vote === 'add' ? prev + 1 : prev - 1
    })

    trackEvent({
      category: eventCategory,
      action: vote === 'add' ? 'HowtoUseful' : 'HowtoUsefulRemoved',
      label: howto.slug,
    })
  }

  return (
    <>
      <Breadcrumbs content={howto} variant="howto" />
      <HowtoDescription
        howto={howto}
        key={howto._id}
        loggedInUser={loggedInUser as IUser}
        commentsCount={totalCommentsCount}
        votedUsefulCount={usefulCount}
        hasUserVotedUseful={voted}
        onUsefulClick={() =>
          onUsefulClick(voted ? 'delete' : 'add', 'HowtoDescription')
        }
      />
      <Box sx={{ mt: 9 }}>
        {howto.steps.map((step: IHowToStepFormInput, index: number) => (
          <Step step={step as IHowtoStep} key={index} stepindex={index} />
        ))}
      </Box>
      <ClientOnly fallback={<></>}>
        {() => (
          <UserEngagementWrapper>
            <ArticleCallToAction
              author={{
                userName: howto._createdBy,
                countryCode: howto.creatorCountry,
                isVerified,
              }}
            >
              <Button
                type="button"
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
                  votedUsefulCount={usefulCount}
                  hasUserVotedUseful={voted}
                  isLoggedIn={!!loggedInUser}
                  onUsefulClick={() =>
                    onUsefulClick(
                      voted ? 'delete' : 'add',
                      'ArticleCallToAction',
                    )
                  }
                />
              )}
            </ArticleCallToAction>
            <HowtoDiscussion
              howtoDocId={howto._id}
              setTotalCommentsCount={setTotalCommentsCount}
            />
          </UserEngagementWrapper>
        )}
      </ClientOnly>
    </>
  )
})
