import { Text } from 'theme-ui'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface ITag {
  label: string
}

export interface Props {
  tag: ITag
  sx?: ThemeUIStyleObject | undefined
}

export const Tag = (props: Props) => {
  const { tag, sx } = props
  return (
    <Text
      sx={{
        fontSize: 1,
        color: 'blue',
        ...sx,
        '::before': {
          content: '"#"',
        },
      }}
    >
      {tag.label}
    </Text>
  )
}
