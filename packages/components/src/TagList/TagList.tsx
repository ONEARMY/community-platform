import { Flex } from 'theme-ui'

import { Tag } from '../Tag/Tag'

import type { ITag } from '../Tag/Tag'

export interface TagListProps {}

export interface IProps {
  tags: ITag[]
}

export const TagList = ({ tags }: IProps) => {
  return (
    <Flex sx={{ gap: 1 }}>
      {tags
        .filter((tag) => tag !== undefined)
        .map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
    </Flex>
  )
}
