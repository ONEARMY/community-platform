import { Link, useNavigate } from '@remix-run/react'
import {
  Button,
  DownloadCounter,
  DownloadFileFromLink,
  DownloadStaticFile,
  ImageGallery,
  LinkifyText,
  Username,
  VideoPlayer,
} from 'oa-components'
import { useContributorsData } from 'src/common/hooks/contributorsData'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { useResearchStore } from 'src/stores/Research/research.store'
import { formatDate } from 'src/utils/date'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { ResearchLinkToUpdate } from './ResearchLinkToUpdate'
import { ResearchUpdateDiscussion } from './ResearchUpdateDiscussion'

import type { IResearch } from 'src/models/research.models'

interface IProps {
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
    title,
    videoUrl,
  } = update
  const researchStore = useResearchStore()
  const navigate = useNavigate()
  const loggedInUser = useCommonStores().stores.userStore.activeUser

  const contributors = useContributorsData(collaborators || [])
  const formattedCreateDatestamp = formatDate(new Date(_created))
  const formattedModifiedDatestamp = formatDate(new Date(_modified))
  const research = researchStore.activeResearchItem

  const handleDownloadClick = async () => {
    researchStore.incrementDownloadCount(_id)
  }

  const redirectToSignIn = async () => {
    navigate('/sign-in')
  }

  const displayNumber = updateIndex + 1

  return (
    <Flex
      data-testid={`ResearchUpdate: ${_id}`}
      data-cy={`ResearchUpdate: ${_id}`}
      id={`update_${_id}`}
      sx={{
        flexDirection: ['column', 'column', 'row'],
        gap: [3, 6],
        marginBottom: [6, 8],
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

        {research && (
          <ResearchLinkToUpdate research={research} update={update} />
        )}
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
                    {'created ' + formattedCreateDatestamp}
                  </Text>

                  {formattedCreateDatestamp !== formattedModifiedDatestamp && (
                    <Text
                      variant="auxiliary"
                      sx={{
                        textAlign: ['left', 'right', 'right'],
                      }}
                    >
                      {'edited ' + formattedModifiedDatestamp}
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
          {((files && files.length > 0) || fileLink) && (
            <Flex
              className="file-container"
              mt={3}
              sx={{ flexDirection: 'column', px: 4 }}
            >
              {fileLink && (
                <DownloadFileFromLink
                  handleClick={handleDownloadClick}
                  link={fileLink}
                  redirectToSignIn={
                    !loggedInUser ? redirectToSignIn : undefined
                  }
                />
              )}
              {files &&
                files
                  .filter(Boolean)
                  .map(
                    (file, index) =>
                      file && (
                        <DownloadStaticFile
                          allowDownload
                          file={file}
                          key={file ? file.name : `file-${index}`}
                          handleClick={handleDownloadClick}
                          redirectToSignIn={
                            !loggedInUser ? redirectToSignIn : undefined
                          }
                        />
                      ),
                  )}
              <DownloadCounter total={downloadCount} />
            </Flex>
          )}
          <ResearchUpdateDiscussion
            update={update}
            research={research}
            showComments={showComments}
          />
        </Card>
      </Flex>
    </Flex>
  )
}

export default ResearchUpdate
