import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Text } from 'theme-ui';

export interface LoaderProps {
  label?: string;
  sx?: ThemeUIStyleObject | undefined;
}

export const Loader = ({ label, sx }: LoaderProps) => {
  return (
    <Flex sx={{ flexWrap: 'wrap', justifyContent: 'center', ...sx }}>
      <Text sx={{ width: '100%', textAlign: 'center' }}>{label || 'Loading...'}</Text>
    </Flex>
  );
};
