import { Flex } from 'theme-ui';

export const ProfileSection = ({ children, ...rest }) => (
  <Flex sx={{ flexDirection: 'column', gap: [3, 4] }} {...rest}>
    {children}
  </Flex>
);
