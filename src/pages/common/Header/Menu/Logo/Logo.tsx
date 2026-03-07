import { useContext } from 'react';
import { Link } from 'react-router';
import { TenantContext } from 'src/pages/common/TenantContext';
import { Box, Flex, Image, Text } from 'theme-ui';

const Logo = () => {
  const tenantContext = useContext(TenantContext);
  const name = tenantContext?.siteName;
  const logo = tenantContext?.siteImage;

  const logoSize = [50, 50, 100];

  return (
    <Box
      sx={{
        py: [2, 2, 0], // padding on y axes ( top & bottom )
        marginBottom: [0, 0, '-50px'],
        position: 'relative',
      }}
    >
      <Link to="/">
        <Flex
          ml={[0, 4]}
          sx={{
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            width: logoSize,
            height: logoSize,
          }}
        >
          <Image
            loading="lazy"
            src={logo}
            style={{ maxWidth: 100, maxHeight: 100 }}
            sx={{
              width: logoSize,
              height: logoSize,
            }}
            alt={`${name} logo`}
            title={`${name} logo`}
          />
        </Flex>
        <Text className="sr-only" ml={2} sx={{ display: ['none', 'none', 'block'] }} color="black">
          {name}
        </Text>
      </Link>
    </Box>
  );
};

export default Logo;
