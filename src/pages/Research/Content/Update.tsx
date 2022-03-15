import { format } from 'date-fns'
import * as React from 'react'
import Linkify from 'react-linkify'
import ReactPlayer from 'react-player'
import { Box } from 'rebass'
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
        flexDirection={['column', 'column', 'row']}
      >
        <Flex flex={1} mx={[0, 0, 2]} width={1} mb={[3, 3, 0]}>
          <FlexStepNumber
            card
            mediumRadius
            justifyContent={'center'}
            py={3}
            px={4}
            bg={'white'}
            width={1}
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
          flex={9}
          width={1}
          flexDirection={'column'}
          overflow={'hidden'}
        >
          <Flex width={1} py={4} px={4} flexDirection={'column'}>
            <Flex width={1} flexDirection={['column', 'row', 'row']}>
              <Heading width={[1, 3 / 4, 3 / 4]} medium mb={[2, 0, 0]}>
                {update.title}
              </Heading>
              <Flex
                flexDirection={['row', 'column', 'column']}
                width={[1, 1 / 4, 1 / 4]}
                justifyContent="space-between"
              >
                <Flex flexDirection={['column']}>
                  <Text auxiliary textAlign={['left', 'right', 'right']}>
                    {'created ' +
                      format(new Date(update._created), 'DD-MM-YYYY')}
                  </Text>
                  {update._created !== update._modified && (
                    <Text auxiliary textAlign={['left', 'right', 'right']}>
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
                    <Button
                      size="sm"
                      variant={'primary'}
                      data-cy={'edit-update'}
                    >
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
          <Box width={1}>
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
