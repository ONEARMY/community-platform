import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import {
  ArticleCallToActionSupabase,
  Button,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { CommentSectionSupabase } from 'src/pages/common/CommentsSupabase/CommentSectionSupabase'
import { usefulService } from 'src/services/usefulService'
import { useProfileStore } from 'src/stores/User/profile.store'
import { Card, Flex } from 'theme-ui'

import { LibraryDescription } from './LibraryDescription'
import Step from './LibraryStep'

import type { Project, ProjectStep } from 'oa-shared'

type ProjectPageProps = {
  item: Project
}

export const ProjectPage = observer(({ item }: ProjectPageProps) => {
  const [subscribersCount, setSubscribersCount] = useState<number>(
    item.subscriberCount,
  )
  const [voted, setVoted] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(item.usefulCount)
  const { profile: activeUser } = useProfileStore()

  useEffect(() => {
    const getVoted = async () => {
      const voted = await usefulService.hasVoted('projects', item.id)
      setVoted(voted)
    }

    if (activeUser) {
      getVoted()
    }
  }, [activeUser, item])

  const onUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory = 'Library',
  ) => {
    if (!activeUser) {
      return
    }

    // Trigger update without waiting
    if (vote === 'add') {
      await usefulService.add('projects', item.id)
    } else {
      await usefulService.remove('projects', item.id)
    }

    setVoted((prev) => !prev)

    setUsefulCount((prev) => {
      return vote === 'add' ? prev + 1 : prev - 1
    })

    trackEvent({
      category: eventCategory,
      action: vote === 'add' ? 'ProjectUseful' : 'ProjectUsefulRemoved',
      label: item.slug,
    })
  }

  return (
    <>
      <Breadcrumbs content={item} variant="library" />
      <LibraryDescription
        item={item}
        loggedInUser={activeUser}
        commentsCount={item.commentCount}
        votedUsefulCount={usefulCount}
        hasUserVotedUseful={voted}
        onUsefulClick={() =>
          onUsefulClick(voted ? 'delete' : 'add', 'LibraryDescription')
        }
        subscribersCount={subscribersCount}
      />
      <Flex sx={{ flexDirection: 'column', marginTop: [3, 4], gap: 4 }}>
        {item.steps
          .sort((a, b) => a.order - b.order)
          .map((step: ProjectStep, index: number) => (
            <Step step={step} key={index} stepindex={index} />
          ))}
      </Flex>
      <ClientOnly fallback={<></>}>
        {() => (
          <UserEngagementWrapper>
            <ArticleCallToActionSupabase author={item.author!}>
              <Button
                type="button"
                sx={{ fontSize: 2 }}
                onClick={() => {
                  trackEvent({
                    category: 'ArticleCallToAction',
                    action: 'ScrollLibraryComment',
                    label: item.slug,
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
              {item.moderation === IModerationStatus.ACCEPTED && (
                <UsefulStatsButton
                  votedUsefulCount={usefulCount}
                  hasUserVotedUseful={voted}
                  isLoggedIn={!!activeUser}
                  onUsefulClick={() =>
                    onUsefulClick(
                      voted ? 'delete' : 'add',
                      'ArticleCallToAction',
                    )
                  }
                />
              )}
            </ArticleCallToActionSupabase>
            <Card
              sx={{
                background: 'softblue',
                gap: 2,
                padding: 3,
                width: ['100%', '100%', `90%`, `${(2 / 3) * 100}%`],
                margin: '0 auto',
                mt: 5,
              }}
            >
              <CommentSectionSupabase
                authors={item.author?.id ? [item.author?.id] : []}
                setSubscribersCount={setSubscribersCount}
                sourceId={item.id}
                sourceType="projects"
              />
            </Card>
          </UserEngagementWrapper>
        )}
      </ClientOnly>
    </>
  )
})
