import { Text, Flex } from 'theme-ui'
import { Icon } from '..'
import { useTheme } from '@emotion/react'

export interface IProps {
  viewsCount: number
}

export const ViewsCounter = (props: IProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useTheme()

  return (
    <Flex
      paddingX={2}
      paddingY={1}
      mb={1}
      sx={{
        alignItems: 'center',
        background: theme.colors.softyellow,
        borderRadius: '5px',
        fontSize: theme.fontSizes[2],
      }}
    >
      <Icon glyph={'view'} mr={2} size={'md'} />
      <Text>
        {props.viewsCount}
        {props.viewsCount !== 1 ? ' views' : ' view'}
      </Text>
    </Flex>
  )
}
