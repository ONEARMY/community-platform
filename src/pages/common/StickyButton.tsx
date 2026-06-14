import { Button, ExternalLink } from 'oa-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { MOBILE_NAV_HEIGHT } from 'src/pages/common/Header/navLayout';
import { Box, Text } from 'theme-ui';

export const StickyButton = () => {
  const location = useLocation();
  const [page, setPage] = useState<string>('');

  useEffect(() => {
    setPage(window.location.href);
  }, [location]);

  const href = `/feedback/#page=${page}`;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: [`${MOBILE_NAV_HEIGHT + 8}px`, `${MOBILE_NAV_HEIGHT + 8}px`, 5],
        right: [2, 2, 5],
        display: 'block',
        zIndex: 3000,
      }}
    >
      <ExternalLink href={href} data-cy="feedback">
        <Button type="button" sx={{ display: ['none', 'inherit'] }} variant="primary" icon="update">
          <Text>Report a Problem</Text>
        </Button>

        <Button
          type="button"
          sx={{ display: ['inherit', 'none'] }}
          variant="primary"
          icon="update"
          small
        >
          <Text>Problem?</Text>
        </Button>
      </ExternalLink>
    </Box>
  );
};
