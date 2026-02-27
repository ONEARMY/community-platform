import { commonStyles } from 'oa-themes';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Spinner, Text } from 'theme-ui';

export interface LoaderProps {
  label?: string;
  sx?: ThemeUIStyleObject | undefined;
}

export const Loader = ({ label, sx }: LoaderProps) => {
  return (
    <Flex sx={{ flexWrap: 'wrap', justifyContent: 'center', ...sx }}>
      <Spinner aria-label="Loading..." sx={{ color: commonStyles.colors.darkGrey }} />
      {label && <Text sx={{ width: '100%', textAlign: 'center' }}>{label}</Text>}
    </Flex>
  );
};
