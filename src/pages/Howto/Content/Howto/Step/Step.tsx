import styled from '@emotion/styled'
import { ImageGallery, LinkifyText, VideoPlayer } from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import type { IHowtoStep } from 'oa-shared'

interface IProps {
  step: IHowtoStep
  stepindex: number
}

const FlexStepNumber = styled(Flex)`
  height: fit-content;
`

const Step = (props: IProps) => {
  const { stepindex, step } = props

  {
    /* HACK 2021-07-16 - new howtos auto capitalize title but not older */
  }
  const title = step.title && capitalizeFirstLetter(step.title)

  return (
    <Flex
      data-cy={`step_${stepindex + 1}`}
      sx={{ mx: [0, 0, -2], mt: 9, flexDirection: ['column', 'column', 'row'] }}
    >
      <Flex mx={[0, 0, 2]} sx={{ flex: 1, width: '100%' }} mb={[3, 3, 0]}>
        <FlexStepNumber sx={{ justifyContent: 'center', width: '100%' }}>
          <Card sx={{ width: '100%', textAlign: 'center' }} py={3} px={4}>
            <Heading as="p" mb={0}>
              {stepindex + 1}
            </Heading>
          </Card>
        </FlexStepNumber>
      </Flex>
      <Flex
        sx={{
          mx: [0, 0, 2],
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
              sx={{
                py: 4,
                px: 4,
                width: ['100%', '100%', `${(1 / 2) * 100}%`],
                flexDirection: 'column',
              }}
            >
              <Heading as="h2" mb={0} data-cy="step-title">
                {title}
              </Heading>
              <Box>
                <Text
                  mt={3}
                  color="grey"
                  variant="paragraph"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                  }}
                  data-cy="step-text"
                >
                  <LinkifyText>{step.text}</LinkifyText>
                </Text>
              </Box>
            </Flex>
            <Box sx={{ width: ['100%', '100%', `${(1 / 2) * 100}%`] }}>
              {step.videoUrl ? (
                <ClientOnly fallback={<></>}>
                  {() => <VideoPlayer videoUrl={step.videoUrl!} />}
                </ClientOnly>
              ) : step.images ? (
                <ImageGallery
                  images={
                    formatImagesForGallery(
                      step.images,
                      `Step ${stepindex + 1}`,
                    ) as any
                  }
                />
              ) : null}
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  )
}

export default Step
