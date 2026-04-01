import { useContext } from 'react';
import { Link } from 'react-router';
import { TenantContext } from 'src/pages/common/TenantContext';
import { Box, Image, Text } from 'theme-ui';

const Logo = () => {
  const tenantContext = useContext(TenantContext);
  const name = tenantContext?.siteName;
  const logo = tenantContext?.siteImage;

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Link to="/">
        <Image
          loading="lazy"
          src={logo}
          sx={{
            // 831px and below
            width: 60,
            height: 60,
            marginBottom: '-20px',
            '@media screen and (min-width: 832px)': {
              width: 80,
              height: 80,
              marginBottom: '-30px',
              marginLeft: '20px',
            },
            '@media screen and (min-width: 1200px)': {
              width: 100,
              height: 100,
              marginBottom: '-40px',
              marginLeft: '20px',
            },
          }}
          alt={`${name} logo`}
          title={`${name} logo`}
        />
        <Text className="sr-only" ml={2} sx={{ display: ['none', 'none', 'block'] }} color="black">
          {name}
        </Text>
      </Link>
    </Box>
  );
};

export default Logo;
