import { PureComponent } from 'react'
import Linkify from 'react-linkify'
import ReactPlayer from 'react-player'
import { Box } from 'rebass'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import ImageGallery from 'src/components/ImageGallery'
import Text from 'src/components/Text'
import { IHowtoStep } from 'src/models/howto.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import styled from '@emotion/styled'

interface IProps {
  step: IHowtoStep
  stepindex: number
}

const FlexStepNumber = styled(Flex)`
  height: fit-content;
`

export default class Step extends PureComponent<IProps> {
  render() {
    const { stepindex, step } = this.props
    return (
      <>
        <Flex
          data-cy={`step_${stepindex}`}
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
                {stepindex + 1}
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
            flexDirection={['column', 'column', 'row']}
            overflow={'hidden'}
          >
            <Flex width={[1, 1, 4 / 9]} py={4} px={4} flexDirection={'column'}>
              <Heading medium mb={0}>
                {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
                {capitalizeFirstLetter(step.title)}
              </Heading>
              <Box>
                <Text preLine paragraph mt={3} color={'grey'}>
                  <Linkify>
                    {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
                    {capitalizeFirstLetter(step.text)}
                  </Linkify>
                </Text>
              </Box>
            </Flex>
            <Box width={[1, 1, 5 / 9]}>
              {step.videoUrl ? (
                <ReactPlayer
                  width="auto"
                  data-cy="video-embed"
                  controls
                  url={step.videoUrl}
                />
              ) : (
                <ImageGallery images={step.images as IUploadedFileMeta[]} />
              )}
            </Box>
          </Flex>
        </Flex>
      </>
    )
  }
}
