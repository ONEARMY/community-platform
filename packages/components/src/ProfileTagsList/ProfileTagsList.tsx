import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'

import type { IProfileTag } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  tags: IProfileTag[]
  sx?: ThemeUIStyleObject | undefined
}

const DEFAULT_COLOR = '#999999'

export const ProfileTagsList = ({ sx, tags }: IProps) => {
  return (
    <Flex data-cy="ProfileTagsList" sx={{ gap: 2, flexWrap: 'wrap', ...sx }}>
      {tags.map(
        (tag, index) =>
          tag?.label && (
            <Category
              key={index}
              category={{ label: tag.label }}
              sx={{
                borderRadius: 99,
                border: '1px solid',
                borderColor: tag.color ? tag.color : DEFAULT_COLOR,
                backgroundColor: tag.color
                  ? `${tag.color}20`
                  : `${DEFAULT_COLOR}20`,
                color: tag.color ? tag.color : DEFAULT_COLOR,
              }}
            />
          ),
      )}
    </Flex>
  )
}
