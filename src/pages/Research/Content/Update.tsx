import { format } from 'date-fns'
import * as React from 'react'
import Linkify from 'react-linkify'
import ReactPlayer from 'react-player'
import { Box } from 'theme-ui'
import { Button } from 'oa-components'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import ImageGallery from 'src/components/ImageGallery'
import { Link } from 'src/components/Links'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import { ResearchComments } from './ResearchComments/ResearchComments'
import styled from '@emotion/styled'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'

interface IProps {
  update: IResearch.UpdateDB
  updateIndex: number
  isEditable: boolean
  slug: string
}

const FlexStepNumber = styled(Flex)`
  height: fit-content;
`

const Update: React.FC<IProps> = ({
  update,
  updateIndex,
  isEditable,
  slug,
}) => {
  return (
    <>
      <Flex
        data-cy={`update_${updateIndex}`}
        mx={[0, 0, -2]}
        mt={9}
        sx={{ flexDirection: ['column', 'column', 'row'] }}
      >
        <Flex mx={[0, 0, 2]} sx={{ width: '100%', flex: 1 }} mb={[3, 3, 0]}>
          <FlexStepNumber
            card
            mediumRadius
            py={3}
            px={4}
            bg={'white'}
            sx={{ width: '100%', justifyContent: 'center' }}
          >
            <Heading medium mb={0}>
              {updateIndex + 1}
            </Heading>
          </FlexStepNumber>
        </Flex>
        <Flex
          card
          mediumRadius
          mx={[0, 0, 2]}
          bg={'white'}
          sx={{
            width: '100%',
            flexDirection: 'column',
            flex: 9,
            overflow: 'hidden',
          }}
        >
          <Flex sx={{ width: '100%', flexDirection: 'column' }} py={4} px={4}>
            <Flex
              sx={{ width: '100%', flexDirection: ['column', 'row', 'row'] }}
            >
              <Heading
                sx={{ width: ['100%', '75%', '75%'] }}
                medium
                mb={[2, 0, 0]}
              >
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
                    auxiliary
                    sx={{ textAlign: ['left', 'right', 'right'] }}
                  >
                    {'created ' +
                      format(new Date(update._created), 'DD-MM-YYYY')}
                  </Text>
                  {update._created !== update._modified && (
                    <Text
                      auxiliary
                      sx={{ textAlign: ['left', 'right', 'right'] }}
                    >
                      {'edited ' +
                        format(new Date(update._modified), 'DD-MM-YYYY')}
                    </Text>
                  )}
                </Flex>
                {/* Show edit button for the creator of the research OR a super-admin */}
                {isEditable && (
                  <Link
                    ml="auto"
                    mt={[0, 2, 2]}
                    to={'/research/' + slug + '/edit-update/' + update._id}
                  >
                    <Button variant={'primary'} data-cy={'edit-update'}>
                      Edit
                    </Button>
                  </Link>
                )}
              </Flex>
            </Flex>
            <Box>
              <Text preLine paragraph mt={3} color={'grey'}>
                <Linkify>{update.description}</Linkify>
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
          <AuthWrapper roleRequired="beta-tester">
            <ResearchComments update={update} comments={update.comments} />
          </AuthWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default Update
