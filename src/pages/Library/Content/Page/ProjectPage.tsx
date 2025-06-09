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
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { CommentSectionSupabase } from 'src/pages/common/CommentsSupabase/CommentSectionSupabase'
import { usefulService } from 'src/services/usefulService'
import { Card, Flex } from 'theme-ui'

import { LibraryDescription } from './LibraryDescription'
import Step from './LibraryStep'

import type { IUser, Project, ProjectStep } from 'oa-shared'

type ProjectPageProps = {
  item: Project
}

export const ProjectPage = observer(({ item }: ProjectPageProps) => {
  const { userStore } = useCommonStores().stores
  const [voted, setVoted] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(item.usefulCount)
  const loggedInUser = userStore.activeUser

  useEffect(() => {
    const getVoted = async () => {
      const voted = await usefulService.hasVoted('projects', item.id)
      setVoted(voted)
    }

    if (loggedInUser) {
      getVoted()
    }
  }, [loggedInUser, item])

  const onUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory = 'Library',
  ) => {
    if (!loggedInUser?.userName) {
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
        loggedInUser={loggedInUser as IUser}
        commentsCount={item.commentCount}
        votedUsefulCount={usefulCount}
        hasUserVotedUseful={voted}
        onUsefulClick={() =>
          onUsefulClick(voted ? 'delete' : 'add', 'LibraryDescription')
        }
      />
      <Flex sx={{ flexDirection: 'column', marginTop: [3, 4], gap: 4 }}>
        {item.steps.map((step: ProjectStep, index: number) => (
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
                  isLoggedIn={!!loggedInUser}
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
                sourceId={item.id}
                sourceType="projects"
                authors={item.author?.id ? [item.author?.id] : []}
              />
            </Card>
          </UserEngagementWrapper>
        )}
      </ClientOnly>
    </>
  )
})
