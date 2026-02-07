import { Select } from 'oa-components';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { Flex } from 'theme-ui';
import type { CommentSortOption } from './CommentSortOptions';
import { CommentSortOptions } from './CommentSortOptions';

interface IProps {
  sortBy: CommentSortOption;
  onSortChange: (sortBy: CommentSortOption) => void;
}

export const CommentSort = ({ sortBy, onSortChange }: IProps) => {
  return (
    <Flex
      sx={{
        minWidth: '160px',
        flex: '0 0 auto',
        '@container (max-width: 600px)': {
          flex: '1 1 100%',
          minWidth: '100%',
        },
      }}
    >
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
