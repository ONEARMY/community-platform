import { Flex, Text } from 'theme-ui'

import type { Category as CategoryType } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

type OldICategory = { label: string }
export interface Props {
  category: CategoryType | OldICategory
  sx?: ThemeUIStyleObject | undefined
}

export const Category = (props: Props) => {
  const { category, sx } = props

  const name =
    (category as CategoryType).name || (category as OldICategory).label

  return (
    <Flex sx={{ alignItems: 'start' }}>
      <Text
        data-cy="category"
        sx={{
          fontSize: 1,
          color: '#555555',
          backgroundColor: '#cccccc',
          paddingX: '7.5px',
          paddingY: '5px',
          borderRadius: 1,
          ...sx,
        }}
      >
        {name}
      </Text>
    </Flex>
  )
}
