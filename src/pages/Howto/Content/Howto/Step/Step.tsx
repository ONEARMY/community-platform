import { PureComponent } from 'react'
import Linkify from 'react-linkify'
import ReactPlayer from 'react-player'
import { Box } from 'theme-ui'
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
          sx={{ flexDirection: ['column', 'column', 'row'] }}
        >
          <Flex mx={[0, 0, 2]} sx={{ flex: 1, width: '100%' }} mb={[3, 3, 0]}>
            <FlexStepNumber
              card
              mediumRadius
              py={3}
              px={4}
              bg={'white'}
              sx={{ justifyContent: 'center', width: '100%' }}
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
            sx={{
              flex: 9,
              width: '100%',
              flexDirection: ['column', 'column', 'row'],
              overflow: 'hidden',
            }}
          >
            <Flex
              py={4}
              px={4}
              sx={{
                width: ['100%', '100%', `${(1 / 2) * 100}%`],
                flexDirection: 'column',
              }}
            >
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
            <Box sx={{ width: ['100%', '100%', `${(1 / 2) * 100}%`] }}>
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
