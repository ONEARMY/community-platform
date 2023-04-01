import { format } from 'date-fns'
import { Box, Card, Text, Flex, Heading } from 'theme-ui'
import { Button, ImageGallery, LinkifyText, Username, VideoPlayer } from 'oa-components'
import type { IResearch } from 'src/models/research.models'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { ResearchComments } from './ResearchComments/ResearchComments'
import styled from '@emotion/styled'
import type { IComment } from 'src/models'
import { Link } from 'react-router-dom'
import { useContributorsData } from 'src/common/hooks/contributorsData'

interface IProps {
  update: IResearch.UpdateDB
  updateIndex: number
  isEditable: boolean
  slug: string
  comments: IComment[]
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
  comments,
  showComments,
}: IProps) => {
  const formattedCreateDatestamp = format(
    new Date(update._created),
    'DD-MM-YYYY',
  )
  const formattedModifiedDatestamp = format(
    new Date(update._modified),
    'DD-MM-YYYY',
  )

  const contributors = useContributorsData(update.collaborators || [])

  return (
    <>
      <Flex
        data-testid={`ResearchUpdate: ${updateIndex}`}
        data-cy={`update_${updateIndex}`}
        id={`update_${updateIndex}`}
        mx={[0, 0, -2]}
        mt={9}
        sx={{ flexDirection: ['column', 'column', 'row'] }}
      >
        <Flex mx={[0, 0, 2]} sx={{ width: '100%', flex: 1 }} mb={[3, 3, 0]}>
          <FlexStepNumber sx={{ height: 'fit-content' }}>
            <Card py={3} px={4} sx={{ width: '100%', textAlign: 'center' }}>
              <Heading mb={0}>{updateIndex + 1}</Heading>
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
                  {contributors ? (
                    <Box sx={{ mb: 2 }}>
                      {contributors.map((collab, idx) => (
                        <Username key={idx} user={collab} isVerified={false} />
                      ))}
                    </Box>
                  ) : null}

                  <Heading sx={{ mb: 2 }}>{update.title}</Heading>
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
                        variant={'primary'}
                        data-cy={'edit-update'}
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
                <ImageGallery images={update.images as IUploadedFileMeta[]} />
              )}
            </Box>
            <ResearchComments
              update={update}
              comments={comments as any}
              updateIndex={updateIndex}
              showComments={showComments}
            />
          </Card>
        </Flex>
      </Flex>
    </>
  )
}

export default ResearchUpdate
