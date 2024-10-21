import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'

import type { ITag } from 'oa-shared'

export interface IProps {
  tags: ITag[]
}

export const ProfileTagsList = ({ tags }: IProps) => {
  return (
    <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
      {tags.map(
        (tag, index) =>
          tag?.label && (
            <Category key={index} category={{ label: tag.label }} />
          ),
      )}
    </Flex>
  )
}
