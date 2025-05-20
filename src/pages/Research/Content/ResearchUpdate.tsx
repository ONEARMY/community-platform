import { useMemo } from 'react'
import { Link } from '@remix-run/react'
import {
  Button,
  DisplayDate,
  ImageGallery,
  LinkifyText,
  Tooltip,
  VideoPlayer,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { DownloadWrapper } from 'src/common/DownloadWrapper'
import CollapsableCommentSection from 'src/pages/common/CommentsSupabase/CollapsableCommentSection'
import { UserNameTag } from 'src/pages/common/UserNameTag/UserNameTag'
import { formatImagesForGalleryV2 } from 'src/utils/formatImageListForGallery'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { ResearchLinkToUpdate } from './ResearchLinkToUpdate'

import type {
  ResearchItem,
  ResearchUpdate as ResearchUpdateModel,
} from 'oa-shared'

interface IProps {
  research: ResearchItem
  update: ResearchUpdateModel
  updateIndex: number
  isEditable: boolean
  slug: string
}

const ResearchUpdate = (props: IProps) => {
  const { research, update, updateIndex, isEditable, slug } = props

  const displayNumber = updateIndex + 1

  const authorIds = useMemo(() => {
    const ids: number[] = []

    if (research.author) {
      ids.push(research.author.id)
    }

    for (const collaborator of research.collaborators) {
      if (collaborator) {
        ids.push(collaborator.id)
      }
    }
    return ids
  }, [research.author, research.collaborators])

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        border: update.isDraft ? '2px dashed grey' : '',
        borderRadius: 2,
        padding: update.isDraft ? 2 : 0,
        gap: 2,
      }}
    >
      {update.isDraft && (
        <>
          <Button
            data-cy="DraftUpdateLabel"
            data-tooltip-id="visible-tooltip"
            data-tooltip-content="Only visible to you (and other collaborators)"
            sx={{ alignSelf: 'flex-start', backgroundColor: 'softblue' }}
            variant="subtle"
            small
          >
            Draft Update
          </Button>
          <Tooltip id="visible-tooltip" />
        </>
      )}

      <Flex
        data-testid={`ResearchUpdate: ${update.id}`}
        data-cy={`ResearchUpdate: ${update.id}`}
        id={`update_${update.id}`}
        sx={{
          flexDirection: ['column', 'column', 'row'],
          gap: [2, 4],
          scrollMarginTop: 4,
        }}
      >
        <Flex
          sx={{
            alignItems: 'center',
            flexDirection: ['row', 'row', 'column'],
            gap: [2, 4],
          }}
        >
          <Card sx={{ padding: [2, 3, 4], marginLeft: [2, 0] }}>
            <Heading sx={{ textAlign: 'center' }}>{displayNumber}</Heading>
          </Card>

          <ResearchLinkToUpdate research={research} update={update} />
        </Flex>

        <Flex
          sx={{
            width: '100%',
            flexDirection: 'column',
            flex: 9,
            overflow: 'hidden',
          }}
        >
          <Card variant="responsive">
            <Flex sx={{ flexDirection: 'column', padding: [2, 3, 4] }}>
              <Flex sx={{ flexDirection: ['column', 'row', 'row'] }}>
                <Box sx={{ width: ['100%', '75%', '75%'] }}>
                  {update.author && (
                    <Box sx={{ mb: 2 }} data-testid="collaborator/creator">
                      <UserNameTag
                        userName={update.author?.username || ''}
                        countryCode={update.author?.country}
                      />
                    </Box>
                  )}

                  <Heading as="h2" sx={{ mb: 2 }}>
                    {update.title}
                  </Heading>
                </Box>

                <Flex
                  sx={{
                    flexDirection: ['row', 'column', 'column'],
                    width: ['100%', '25%', '25%'],
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <Flex sx={{ flexDirection: ['column'] }}>
                    <Text variant="auxiliary">
                      <DisplayDate
                        createdAt={update.createdAt}
                        action="Created"
                      />
                    </Text>
                    {update.modifiedAt !== update.createdAt && (
                      <Text variant="auxiliary">
                        <DisplayDate
                          createdAt={update.createdAt}
                          modifiedAt={update.modifiedAt}
                          action="Updated"
                        />
                      </Text>
                    )}
                  </Flex>
                  {/* Show edit button for the creator of the research OR a super-admin */}
                  {isEditable && (
                    <Link
                      to={'/research/' + slug + '/edit-update/' + update.id}
                    >
                      <Button
                        type="button"
                        variant="primary"
                        data-cy="edit-update"
                        ml="auto"
                        mt={[0, 2, 2]}
                      >
                        Edit
                      </Button>
                    </Link>
                  )}
                </Flex>
              </Flex>
              <Box>
                <Text
                  mt={3}
                  variant="paragraph"
                  color={'grey'}
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  <LinkifyText>{update.description}</LinkifyText>
                </Text>
              </Box>
            </Flex>
            <Box sx={{ width: '100%' }}>
              {update.videoUrl && (
                <ClientOnly fallback={<></>}>
                  {() => <VideoPlayer videoUrl={update.videoUrl!} />}
                </ClientOnly>
              )}
              {update.images && (
                <ImageGallery
                  images={formatImagesForGalleryV2(update.images) as any}
                  allowPortrait={true}
                />
              )}
            </Box>
            <Flex
              className="file-container"
              sx={{ flexDirection: 'column', px: 4, mt: 3 }}
            >
              <DownloadWrapper
                fileDownloadCount={update.fileDownloadCount}
                fileLink={
                  update.hasFileLink
                    ? `/api/documents/research_update/${update.id}/link`
                    : undefined
                }
                files={update.files?.map((x) => ({
                  id: x.id,
                  name: x.name,
                  size: x.size,
                  url: `/api/documents/research_update/${update.id}/${x.id}`,
                }))}
              />
            </Flex>
            {!update.isDraft && (
              <ClientOnly fallback={<></>}>
                {() => (
                  <CollapsableCommentSection
                    authors={authorIds}
                    open={false}
                    total={update.commentCount}
                    researchUpdate={update}
                  />
                )}
              </ClientOnly>
            )}
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ResearchUpdate
