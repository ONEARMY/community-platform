import { Text, Flex } from 'theme-ui'
import { Icon } from '..'

export interface IProps {
  viewsCount: number
}

export const ViewsCounter = (props: IProps) => (
  <Flex
    data-cy={'ViewsCounter'}
    px={2}
    py={1}
    mb={1}
    sx={{
      alignItems: 'center',
      background: 'softyellow',
      borderRadius: 1,
      fontSize: 2,
      border: '1px solid',
      borderColor: 'rgba(0,0,0,0)',
    }}
  >
    <Icon glyph={'view'} mr={2} size={'md'} />
    <Text>
      {props.viewsCount}
      {props.viewsCount !== 1 ? ' views' : ' view'}
    </Text>
  </Flex>
)
