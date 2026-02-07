import { Flex } from 'theme-ui';
import type { ITag } from '../Tag/Tag';
import { Tag } from '../Tag/Tag';

export interface TagListProps {}

export interface IProps {
  tags: ITag[];
}

export const TagList = ({ tags }: IProps) => {
  return (
    <Flex sx={{ gap: 1 }} data-cy="tag-list">
      {tags
        .filter((tag) => !!tag)
        .map((tag) => (
          <Tag key={tag.label} tag={tag} />
        ))}
    </Flex>
  );
};
