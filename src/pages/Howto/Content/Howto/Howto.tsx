import { useState } from 'react'
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

  const loggedInUser = userStore.activeUser

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

  const hasUserVotedUseful = howtoStore.userVotedActiveHowToUseful
  const isVerified = aggregationsStore.isVerified(howto._createdBy)

  return (
    <>
      <Breadcrumbs content={howto} variant="howto" />
      <HowtoDescription
        howto={howto}
        key={howto._id}
        needsModeration={howtoStore.needsModeration(howto)}
        loggedInUser={loggedInUser as IUser}
        commentsCount={totalCommentsCount}
        votedUsefulCount={howtoStore.votedUsefulCount}
        hasUserVotedUseful={hasUserVotedUseful}
        onUsefulClick={async () =>
          await onUsefulClick(howto._id, howto.slug, 'HowtoDescription')
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
        )}
      </ClientOnly>
    </>
  )
})
