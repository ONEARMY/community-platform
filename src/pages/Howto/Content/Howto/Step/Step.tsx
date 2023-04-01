import { PureComponent } from 'react'
import { Box, Card, Text, Flex, Heading } from 'theme-ui'
import { ImageGallery, LinkifyText, VideoPlayer } from 'oa-components'
import type { IHowtoStep } from 'src/models/howto.models'
import type { IUploadedFileMeta } from 'src/stores/storage'
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
            <FlexStepNumber sx={{ justifyContent: 'center', width: '100%' }}>
              <Card sx={{ width: '100%', textAlign: 'center' }} py={3} px={4}>
                <Heading mb={0}>{stepindex + 1}</Heading>
              </Card>
            </FlexStepNumber>
          </Flex>
          <Flex
            mx={[0, 0, 2]}
            sx={{
              flex: 9,
              flexDirection: ['column', 'column', 'row'],
              overflow: 'hidden',
            }}
          >
            <Card sx={{ width: '100%' }}>
              <Flex
                sx={{
                  flexDirection: ['column-reverse', 'column-reverse', 'row'],
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
                  <Heading mb={0}>
                    {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
                    {capitalizeFirstLetter(step.title)}
                  </Heading>
                  <Box>
                    <Text
                      mt={3}
                      color={'grey'}
                      variant="paragraph"
                      sx={{
                        whiteSpace: 'pre-line',
                      }}
                    >
                      <LinkifyText>
                        {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
                        {capitalizeFirstLetter(step.text)}
                      </LinkifyText>
                    </Text>
                  </Box>
                </Flex>
                <Box sx={{ width: ['100%', '100%', `${(1 / 2) * 100}%`] }}>
                  {step.videoUrl ? (
                    <VideoPlayer videoUrl={step.videoUrl} />
                  ) : (
                    <ImageGallery images={step.images as IUploadedFileMeta[]} />
                  )}
                </Box>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </>
    )
  }
}
