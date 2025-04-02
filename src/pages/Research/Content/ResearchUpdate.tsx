import { useMemo } from 'react'
import { Link, useLocation } from '@remix-run/react'
import {
  Button,
  DisplayDate,
  ImageGallery,
  LinkifyText,
  Tooltip,
  Username,
  VideoPlayer,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { DownloadWrapper } from 'src/common/DownloadWrapper'
import { useContributorsData } from 'src/common/hooks/contributorsData'
import { useResearchStore } from 'src/stores/Research/research.store'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { getResearchUpdateId } from './helper'
import { ResearchLinkToUpdate } from './ResearchLinkToUpdate'
import { ResearchUpdateDiscussion } from './ResearchUpdateDiscussion'

import type { IResearch, IResearchDB } from 'oa-shared'

interface IProps {
  research: IResearchDB
  update: IResearch.Update
  updateIndex: number
  isEditable: boolean
  slug: string
}

const ResearchUpdate = (props: IProps) => {
  const location = useLocation()
  const { update, updateIndex, isEditable, slug } = props
  const {
    _id,
    _created,
    _modified,
    collaborators,
    description,
    downloadCount,
    files,
    fileLink,
    images,
    status,
    title,
    videoUrl,
  } = update
  const researchStore = useResearchStore()

  const contributors = useContributorsData(collaborators || [])

  const handleDownloadClick = async () => {
    researchStore.incrementDownloadCount(props.research, _id)
  }

  const displayNumber = updateIndex + 1
  const isDraft = status == 'draft'

  const showComments = useMemo(
    () => update._id === getResearchUpdateId(location.hash),
    [location.hash],
  )

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        border: isDraft ? '2px dashed grey' : '',
        borderRadius: 2,
        padding: isDraft ? 2 : 0,
        gap: 2,
      }}
    >
      {isDraft && (
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
        data-testid={`ResearchUpdate: ${_id}`}
        data-cy={`ResearchUpdate: ${_id}`}
        id={`update_${_id}`}
        sx={{
          flexDirection: ['column', 'column', 'row'],
          gap: [2, 4],
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

          <ResearchLinkToUpdate research={props.research} update={update} />
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
            <Flex sx={{ flexDirection: 'column', padding: [2, 3, 4], gap: 2 }}>
              <Flex
                sx={{
                  flexDirection: ['column', 'row', 'row'],
                  gap: 2,
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  {contributors.length > 0 && (
                    <Box sx={{ mb: 2 }} data-testid="collaborator/creator">
                      <Username user={contributors[0]} />
                    </Box>
                  )}

                  <Heading as="h2">{title}</Heading>
                </Box>

                <Flex
                  sx={{
                    flexDirection: 'column',
                    alignItems: ['flex-start', 'flex-end'],
                    gap: 1,
                  }}
                >
                  <Text variant="auxiliary">
                    <DisplayDate action="Created" createdAt={_created} />
                  </Text>
                  {_modified && (
                    <Text variant="auxiliary">
                      <DisplayDate
                        createdAt={_created}
                        modifiedAt={_modified}
                      />
                    </Text>
                  )}

                  {/* Show edit button for the creator of the research OR a super-admin */}
                  {isEditable && (
                    <Link to={'/research/' + slug + '/edit-update/' + _id}>
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
                  <LinkifyText>{description}</LinkifyText>
                </Text>
              </Box>
            </Flex>
            <Box sx={{ width: '100%' }}>
              {videoUrl ? (
                <ClientOnly fallback={<></>}>
                  {() => <VideoPlayer videoUrl={videoUrl} />}
                </ClientOnly>
              ) : (
                <ImageGallery
                  images={formatImagesForGallery(images) as any}
                  allowPortrait={true}
                />
              )}
            </Box>
            <Flex
              className="file-container"
              mt={3}
              sx={{ flexDirection: 'column', px: 4 }}
            >
              <DownloadWrapper
                handleClick={handleDownloadClick}
                fileLink={fileLink}
                files={files}
                fileDownloadCount={downloadCount}
              />
            </Flex>
            <ClientOnly fallback={<></>}>
              {() => (
                <ResearchUpdateDiscussion
                  update={update}
                  research={props.research}
                  showComments={showComments}
                />
              )}
            </ClientOnly>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ResearchUpdate
