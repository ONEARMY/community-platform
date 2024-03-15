import { Flex } from 'theme-ui'

import { Tag } from '../'

import type { ITag } from '../'

export interface TagListProps {}

export interface IProps {
  tags: ITag[]
}

export const TagList = ({ tags }: IProps) => {
  return (
    <Flex sx={{ gap: 1 }}>
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </Flex>
  )
}
