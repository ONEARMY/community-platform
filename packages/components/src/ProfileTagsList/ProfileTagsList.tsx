import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'

import type { ITag } from 'oa-shared'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  tags: ITag[]
  sx?: ThemeUIStyleObject | undefined
}

export const ProfileTagsList = ({ sx, tags }: IProps) => {
  return (
    <Flex data-cy="ProfileTagsList" sx={{ gap: 2, flexWrap: 'wrap', ...sx }}>
      {tags.map(
        (tag, index) =>
          tag?.label && (
            <Category key={index} category={{ label: tag.label }} />
          ),
      )}
    </Flex>
  )
}
