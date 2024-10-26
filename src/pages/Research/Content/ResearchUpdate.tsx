import { Link } from '@remix-run/react'
import {
  Button,
  DisplayDate,
  ImageGallery,
  LinkifyText,
  Tooltip,
  Username,
  VideoPlayer,
} from 'oa-components'
import { DownloadWrapper } from 'src/common/DownloadWrapper'
import { useContributorsData } from 'src/common/hooks/contributorsData'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { useResearchStore } from 'src/stores/Research/research.store'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { ResearchLinkToUpdate } from './ResearchLinkToUpdate'
import { ResearchUpdateDiscussion } from './ResearchUpdateDiscussion'

import type { IResearch, IResearchDB } from 'oa-shared'

interface IProps {
  research: IResearchDB
  update: IResearch.Update
  updateIndex: number
  isEditable: boolean
  slug: string
  showComments: boolean
}

const ResearchUpdate = (props: IProps) => {
  const { update, updateIndex, isEditable, slug, showComments } = props
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
  const loggedInUser = useCommonStores().stores.userStore.activeUser

  const contributors = useContributorsData(collaborators || [])

  const handleDownloadClick = async () => {
    researchStore.incrementDownloadCount(props.research, _id)
  }

  const displayNumber = updateIndex + 1
  const isDraft = status == 'draft'

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
          <Card sx={{ padding: [3, 4] }}>
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
          <Card>
            <Flex sx={{ flexDirection: 'column' }} py={4} px={4}>
              <Flex sx={{ flexDirection: ['column', 'row', 'row'] }}>
                <Box sx={{ width: ['100%', '75%', '75%'] }}>
                  {contributors.length > 0 ? (
                    <Box sx={{ mb: 2 }} data-testid="collaborator/creator">
                      <Username user={contributors[0]} />
                    </Box>
                  ) : null}

                  <Heading as="h2" sx={{ mb: 2 }}>
                    {title}
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
                    <Text
                      variant="auxiliary"
                      sx={{
                        textAlign: ['left', 'right', 'right'],
                      }}
                    >
                      created <DisplayDate date={_created} />
                    </Text>

                    {_created !== _modified && (
                      <Text
                        variant="auxiliary"
                        sx={{
                          textAlign: ['left', 'right', 'right'],
                        }}
                      >
                        edited <DisplayDate date={_modified} />
                      </Text>
                    )}
                  </Flex>
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
                <VideoPlayer videoUrl={videoUrl} />
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
                isLoggedIn={!!loggedInUser}
                files={files}
                fileDownloadCount={downloadCount}
              />
            </Flex>
            <ResearchUpdateDiscussion
              update={update}
              research={props.research}
              showComments={showComments}
            />
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ResearchUpdate
