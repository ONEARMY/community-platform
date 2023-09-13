import { Text, Flex } from 'theme-ui'
import { Icon } from '..'

export interface IProps {
  viewCount: number
  usefulCount: number
  commentCount: number
  stepCount: number
}

const ICON_OPACITY = '0.5'
const FONT_SIZE = '1'

export const HowToStatistics = (props: IProps) => (
  <Flex
    data-cy={'HowToStatistics'}
    py={1}
    sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}
  >
    <Flex
      data-cy={'ViewStatsCounter'}
      px={2}
      py={1}
      mb={1}
      sx={{
        alignItems: 'center',
        fontSize: FONT_SIZE,
      }}
    >
      <Icon glyph={'view'} mr={1} size={'sm'} opacity={ICON_OPACITY} />
      <Text>
        {props.viewCount}
        {props.viewCount > 1 ? ' views' : ' view'}
      </Text>
    </Flex>

    <Flex
      data-cy={'UsefulStatsCounter'}
      px={2}
      py={1}
      mb={1}
      sx={{
        alignItems: 'center',
        fontSize: FONT_SIZE,
      }}
    >
      <Icon glyph={'star'} mr={1} size={'sm'} opacity={ICON_OPACITY} />
      <Text>
        {props.usefulCount}
        {'  useful'}
      </Text>
    </Flex>

    <Flex
      data-cy={'CommentStatsCount'}
      px={2}
      py={1}
      mb={1}
      sx={{
        alignItems: 'center',
        fontSize: FONT_SIZE,
      }}
    >
      <Icon glyph={'comment'} mr={1} size={'sm'} opacity={ICON_OPACITY} />
      <Text>
        {props.commentCount}
        {props.commentCount > 1 ? ' comments' : ' comment'}
      </Text>
    </Flex>

    <Flex
      data-cy={'StepStatsCounter'}
      px={2}
      py={1}
      mb={1}
      sx={{
        alignItems: 'center',
        fontSize: FONT_SIZE,
      }}
    >
      <Icon glyph={'update'} mr={1} size={'sm'} opacity={ICON_OPACITY} />
      <Text>
        {props.stepCount}
        {props.stepCount > 1 ? ' steps' : ' step'}
      </Text>
    </Flex>
  </Flex>
)
