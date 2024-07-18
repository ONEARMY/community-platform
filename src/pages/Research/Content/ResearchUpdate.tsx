import { Link, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
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

import { ResearchUpdateDiscussion } from './ResearchUpdateDiscussion'

import type { IResearch } from 'src/models/research.models'

interface IProps {
  update: IResearch.Update
  updateIndex: number
  isEditable: boolean
  slug: string
  showComments: boolean
}

const FlexStepNumber = styled(Flex)`
  height: fit-content;
`

const ResearchUpdate = ({
  update,
  updateIndex,
  isEditable,
  slug,
  showComments,
}: IProps) => {
  const researchStore = useResearchStore()
  const navigate = useNavigate()
  const loggedInUser = useCommonStores().stores.userStore.activeUser

  const contributors = useContributorsData(update.collaborators || [])
  const formattedCreateDatestamp = formatDate(new Date(update._created))
  const formattedModifiedDatestamp = formatDate(new Date(update._modified))
  const research = researchStore.activeResearchItem

  const handleDownloadClick = async () => {
    researchStore.incrementDownloadCount(update._id)
  }

  const redirectToSignIn = async () => {
    navigate('/sign-in')
  }

  const displayId = updateIndex + 1

  return (
    <>
      <Flex
        data-testid={`ResearchUpdate: ${displayId}`}
        data-cy={`ResearchUpdate: ${displayId}`}
        id={`update_${displayId}`}
        mx={[0, 0, -2]}
        mt={9}
        sx={{ flexDirection: ['column', 'column', 'row'] }}
      >
        <Flex mx={[0, 0, 2]} sx={{ width: '100%', flex: 1 }} mb={[3, 3, 0]}>
          <FlexStepNumber sx={{ height: 'fit-content' }}>
            <Card py={3} px={4} sx={{ width: '100%', textAlign: 'center' }}>
              <Heading as="p" mb={0}>
                {displayId}
              </Heading>
            </Card>
          </FlexStepNumber>
        </Flex>

        <Flex
          sx={{
            width: '100%',
            flexDirection: 'column',
            flex: 9,
            overflow: 'hidden',
          }}
        >
          <Card mx={[0, 0, 2]}>
            <Flex sx={{ width: '100%', flexDirection: 'column' }} py={4} px={4}>
              <Flex
                sx={{ width: '100%', flexDirection: ['column', 'row', 'row'] }}
              >
                <Box sx={{ width: ['100%', '75%', '75%'] }}>
                  {contributors.length > 0 ? (
                    <Box sx={{ mb: 2 }} data-testid="collaborator/creator">
                      <Username user={contributors[0]} />
                    </Box>
                  ) : null}

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
                    <Text
                      variant="auxiliary"
                      sx={{
                        textAlign: ['left', 'right', 'right'],
                      }}
                    >
                      {'created ' + formattedCreateDatestamp}
                    </Text>

                    {formattedCreateDatestamp !==
                      formattedModifiedDatestamp && (
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
                    <Link
                      to={'/research/' + slug + '/edit-update/' + update._id}
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
              {update.videoUrl ? (
                <VideoPlayer videoUrl={update.videoUrl} />
              ) : (
                <ImageGallery
                  images={formatImagesForGallery(update.images) as any}
                  allowPortrait={true}
                />
              )}
            </Box>
            {((update.files && update.files.length > 0) || update.fileLink) && (
              <Flex
                className="file-container"
                mt={3}
                sx={{ flexDirection: 'column', px: 4 }}
              >
                {update.fileLink && (
                  <DownloadFileFromLink
                    handleClick={handleDownloadClick}
                    link={update.fileLink}
                    redirectToSignIn={
                      !loggedInUser ? redirectToSignIn : undefined
                    }
                  />
                )}
                {update.files &&
                  update.files
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
                <DownloadCounter total={update.downloadCount} />
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
    </>
  )
}

export default ResearchUpdate
