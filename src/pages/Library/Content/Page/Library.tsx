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

import { LibraryDescription } from './LibraryDescription'
import { LibraryDiscussion } from './LibraryDiscussion'
import Step from './LibraryStep'

import type { ILibrary, IUser } from 'oa-shared'

interface IProps {
  item: ILibrary.DB
}

export const Library = observer(({ item }: IProps) => {
  const {
    _createdBy,
    _id,
    creatorCountry,
    moderation,
    slug,
    steps,
    votedUsefulBy,
  } = item
  const { LibraryStore, userStore, aggregationsStore } =
    useCommonStores().stores
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0)
  const [voted, setVoted] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(
    votedUsefulBy?.length || 0,
  )
  const loggedInUser = userStore.activeUser
  const isVerified = aggregationsStore.isVerified(_createdBy)

  useEffect(() => {
    // This could be improved if we can load the user profile server-side
    if (
      LibraryStore?.activeUser &&
      votedUsefulBy?.includes(LibraryStore.activeUser._id)
    ) {
      setVoted(true)
    }
  }, [LibraryStore?.activeUser])

  const onUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory: string,
  ) => {
    const loggedInUser = LibraryStore.activeUser
    if (!loggedInUser?.userName) {
      return
    }

    await LibraryStore.toggleUsefulByUser(item, loggedInUser?.userName)
    setVoted((prev) => !prev)

    setUsefulCount((prev) => {
      return vote === 'add' ? prev + 1 : prev - 1
    })

    trackEvent({
      category: eventCategory,
      action: vote === 'add' ? 'LibraryUseful' : 'LibraryUsefulRemoved',
      label: slug,
    })
  }

  return (
    <>
      <Breadcrumbs content={item} variant="library" />
      <LibraryDescription
        item={item}
        key={_id}
        loggedInUser={loggedInUser as IUser}
        commentsCount={totalCommentsCount}
        votedUsefulCount={usefulCount}
        hasUserVotedUseful={voted}
        onUsefulClick={() =>
          onUsefulClick(voted ? 'delete' : 'add', 'LibraryDescription')
        }
      />
      <Box sx={{ mt: 9 }}>
        {steps.map((step: ILibrary.StepInput, index: number) => (
          <Step step={step as ILibrary.Step} key={index} stepindex={index} />
        ))}
      </Box>
      <ClientOnly fallback={<></>}>
        {() => (
          <UserEngagementWrapper>
            <ArticleCallToAction
              author={{
                userName: _createdBy,
                countryCode: creatorCountry,
                isVerified,
              }}
            >
              <Button
                type="button"
                sx={{ fontSize: 2 }}
                onClick={() => {
                  trackEvent({
                    category: 'ArticleCallToAction',
                    action: 'ScrollLibraryComment',
                    label: slug,
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
              {moderation === IModerationStatus.ACCEPTED && (
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
            <LibraryDiscussion
              docId={_id}
              setTotalCommentsCount={setTotalCommentsCount}
            />
          </UserEngagementWrapper>
        )}
      </ClientOnly>
    </>
  )
})
