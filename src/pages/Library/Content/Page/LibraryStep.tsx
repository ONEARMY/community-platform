import { ImageGallery, LinkifyText, VideoPlayer } from 'oa-components';
import type { ProjectStep } from 'oa-shared';
import { ClientOnly } from 'remix-utils/client-only';
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery';
import { Box, Card, Flex, Heading, Text } from 'theme-ui';

interface IProps {
  step: ProjectStep;
  stepindex: number;
}

const Step = (props: IProps) => {
  const { stepindex, step } = props;

  const displayNumber = stepindex + 1;

  return (
    <Flex
      data-cy={`step_${displayNumber}`}
      sx={{
        flexDirection: ['column', 'column', 'row'],
        gap: 2,
        paddingX: [2, 0],
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          flexDirection: ['row', 'row', 'column'],
        }}
      >
        <Card sx={{ padding: [2, 3, 4] }}>
          <Heading sx={{ textAlign: 'center' }}>{displayNumber}</Heading>
        </Card>
      </Flex>

      <Flex
        sx={{
          flex: 1,
          flexDirection: ['column', 'column', 'row'],
          overflow: 'hidden',
        }}
      >
        <Card sx={{ flex: 1 }}>
          <Flex
            sx={{
              flexDirection: ['column-reverse', 'column-reverse', 'row'],
            }}
          >
            <Flex
              sx={{
                padding: 4,
                width: ['100%', '100%', `${(1 / 2) * 100}%`],
                flexDirection: 'column',
              }}
            >
              <Heading as="h2" mb={0} data-cy="step-title">
                {step.title}
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
                  <LinkifyText>{step.description}</LinkifyText>
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
                  images={formatImagesForGallery(step.images, `Step ${displayNumber}`) as any}
                />
              ) : null}
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default Step;
