import { Select } from 'oa-components';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { Flex } from 'theme-ui';

import { CommentSortOptions } from './CommentSortOptions';

import type { CommentSortOption } from './CommentSortOptions';

interface IProps {
  sortBy: CommentSortOption;
  onSortChange: (sortBy: CommentSortOption) => void;
}

export const CommentSort = ({ sortBy, onSortChange }: IProps) => {
  return (
    <Flex sx={{ width: ['100%', '100%', 'auto'], minWidth: ['100%', '100%', '160px'] }}>
      <FieldContainer>
        <div data-cy="comment-sort-select">
          <Select
            options={CommentSortOptions.getOptions()}
            value={{
              label: CommentSortOptions.get(sortBy),
              value: sortBy,
            }}
            onChange={(option) => onSortChange(option.value)}
            useAlternateBackground
          />
        </div>
      </FieldContainer>
    </Flex>
  );
};
