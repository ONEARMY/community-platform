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
            display: 'block',
            position: 'relative',
            width: [40, 40, 73],
            height: [40, 40, 73],
            top: [0, 0, '16px'],
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
