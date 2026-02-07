import type { Category as CategoryType } from 'oa-shared';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Text } from 'theme-ui';

export interface Props {
  category: CategoryType;
  sx?: ThemeUIStyleObject | undefined;
}

export const Category = (props: Props) => {
  const { category, sx } = props;

  return (
    <Flex sx={{ alignItems: 'start' }}>
      <Text
        data-cy="category"
        sx={{
          fontSize: 1,
          backgroundColor: 'lightGrey',
          paddingX: 2,
          paddingY: 1,
          borderRadius: 1,
          ...sx,
        }}
      >
        {category.name}
      </Text>
    </Flex>
  );
};
