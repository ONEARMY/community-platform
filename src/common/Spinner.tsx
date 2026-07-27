import { Icon } from 'oa-components';
import { Box } from 'theme-ui';

const Spinner = () => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      <Icon glyph="loading" />
    </Box>
  );
};

export default Spinner;
