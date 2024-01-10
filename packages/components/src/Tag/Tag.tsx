import { Text } from 'theme-ui'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface Props {
  tag: {
    label: string
  }
  sx?: ThemeUIStyleObject | undefined
}

export const Tag = (props: Props) => {
  const { tag, sx } = props
  return (
    <Text
      sx={{
        ...sx,
        fontSize: 1,
        color: 'blue',
        '::before': {
          content: '"#"',
        },
      }}
    >
      {tag.label}
    </Text>
  )
}
