import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'

import type { Category as CategoryType, IProfileTag } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  tags: IProfileTag[]
  sx?: ThemeUIStyleObject | undefined
}

const DEFAULT_COLOR = '#999999'

export const ProfileTagsList = ({ sx, tags }: IProps) => {
  return (
    <Flex data-cy="ProfileTagsList" sx={{ gap: 1, flexWrap: 'wrap', ...sx }}>
      {tags.map(
        ({ color, label }, index) =>
          <Category
            key={index}
            category={{ name: label } as CategoryType}
            sx={{
              borderRadius: 99,
              border: '1px solid',
              borderColor: color || DEFAULT_COLOR,
              backgroundColor: color ? `${color}20` : `${DEFAULT_COLOR}20`,
              color: color || DEFAULT_COLOR,
              fontSize: '11px',
            }}
          />
      )}
    </Flex>
  )
}
