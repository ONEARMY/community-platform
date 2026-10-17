import { Link } from 'react-router';
import { Box, Flex, Text } from 'theme-ui';

import { Button } from '../Button/Button';

export interface BlockedRouteProps {
  children: React.ReactNode;
  redirectUrl?: string;
  redirectLabel?: string;
}

export const BlockedRoute = (props: BlockedRouteProps) => {
  const redirectLabel = props.redirectLabel || 'Back to home';
  const redirectUrl = props.redirectUrl || '/';
  return (
    <Flex sx={{ justifyContent: 'center', flexDirection: 'column', mt: 8 }} data-cy="BlockedRoute">
      <Text sx={{ width: '100%', textAlign: 'center' }}>{props.children}</Text>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link to={redirectUrl}>
          <Button type="button" variant="subtle" small>
            {redirectLabel}
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};
