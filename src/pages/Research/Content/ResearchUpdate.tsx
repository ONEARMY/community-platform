import { format } from 'date-fns'
import * as React from 'react'
import Linkify from 'react-linkify'
import ReactPlayer from 'react-player'
import { Box, Card, Text, Flex, Heading } from 'theme-ui'
import { Button } from 'oa-components'
import { ImageGallery } from 'src/components/ImageGallery/ImageGallery'
import type { IResearch } from 'src/models/research.models'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { ResearchComments } from './ResearchComments/ResearchComments'
import styled from '@emotion/styled'
import type { IComment } from 'src/models'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'

interface IProps {
  update: IResearch.UpdateDB
  updateIndex: number
  isEditable: boolean
  slug: string
  comments: IComment[]
  commentToScrollTo: string
}

const FlexStepNumber = styled(Flex)`
  height: fit-content;
`

const ResearchUpdate: React.FC<IProps> = ({
  update,
  updateIndex,
  isEditable,
  slug,
  comments,
  commentToScrollTo,
}) => {
  const theme = useTheme()
  return (
    <>
      <Flex
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
                <Heading sx={{ width: ['100%', '75%', '75%'] }} mb={[2, 0, 0]}>
                  {update.title}
                </Heading>
                <Flex
                  sx={{
                    flexDirection: ['row', 'column', 'column'],
                    width: ['100%', '25%', '25%'],
                    justifyContent: 'space-between',
                  }}
                >
                  <Flex sx={{ flexDirection: ['column'] }}>
                    <Text
                      sx={{
                        textAlign: ['left', 'right', 'right'],
                        ...theme.typography.auxiliary,
                      }}
                    >
                      {'created ' +
                        format(new Date(update._created), 'DD-MM-YYYY')}
                    </Text>
                    {update._created !== update._modified && (
                      <Text
                        sx={{
                          textAlign: ['left', 'right', 'right'],
                          ...theme.typography.auxiliary,
                        }}
                      >
                        {'edited ' +
                          format(new Date(update._modified), 'DD-MM-YYYY')}
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
                  color={'grey'}
                  sx={{ whiteSpace: 'pre-line', ...theme.typography.paragraph }}
                >
                  <Linkify properties={{ target: '_blank' }}>
                    {update.description}
                  </Linkify>
                </Text>
              </Box>
            </Flex>
            <Box sx={{ width: '100%' }}>
              {update.videoUrl ? (
                <ReactPlayer
                  width="auto"
                  data-cy="video-embed"
                  controls
                  url={update.videoUrl}
                />
              ) : (
                <ImageGallery images={update.images as IUploadedFileMeta[]} />
              )}
            </Box>
            <ResearchComments
              update={update}
              comments={comments}
              updateIndex={updateIndex}
              commentToScrollTo={commentToScrollTo}
            />
          </Card>
        </Flex>
      </Flex>
    </>
  )
}

export default ResearchUpdate
