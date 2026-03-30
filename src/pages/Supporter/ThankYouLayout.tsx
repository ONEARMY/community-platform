import { Icon } from 'oa-components';
import type { ReactNode } from 'react';
import { Box, Flex, Heading, Image } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';

const BigSparkle = ({ size, sx }: { size: number; sx: object }) => (
  <Box sx={{ position: 'absolute', ...sx }}>
    <Icon glyph="star" size={size} />
  </Box>
);

const SmallSparkle = ({ size, sx }: { size: number; sx: object }) => (
  <Box sx={{ position: 'absolute', ...sx }}>
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 0L8.9 5.5L14.4 2.3L10.5 6.8L16 8L10.5 9.2L14.4 13.7L8.9 10.5L8 16L7.1 10.5L1.6 13.7L5.5 9.2L0 8L5.5 6.8L1.6 2.3L7.1 5.5Z"
        fill="currentColor"
      />
    </svg>
  </Box>
);

export const ThankYouLayout = ({ children }: { children: ReactNode }) => {
  const { siteImage } = useSupporterContext();

  return (
    <Flex
      sx={{
        maxWidth: 960,
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
        flexDirection: ['column', 'column', 'row'],
        gap: [4, 6],
        alignItems: ['center', 'center', 'flex-start'],
      }}
    >
      <Flex
        sx={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          py: [4, 5],
          px: [3, 4],
          minHeight: [300, 400],
          justifyContent: 'center',
        }}
      >
        <BigSparkle size={24} sx={{ top: '0%', left: '0%' }} />
        <BigSparkle size={20} sx={{ top: '2%', right: '5%' }} />
        <BigSparkle size={16} sx={{ bottom: '25%', left: '0%' }} />
        <BigSparkle size={20} sx={{ bottom: '5%', right: '0%' }} />
        <SmallSparkle size={14} sx={{ top: '28%', left: '12%' }} />
        <SmallSparkle size={10} sx={{ top: '15%', right: '15%' }} />
        <SmallSparkle size={12} sx={{ bottom: '12%', left: '20%' }} />

        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            position: 'relative',
          }}
        >
          <Icon glyph="supporter" size={100} />
          {siteImage && (
            <Image
              src={siteImage}
              sx={{
                width: 80,
                height: 80,
                ml: '-20px',
                position: 'relative',
                zIndex: 1,
              }}
              alt="Site logo"
            />
          )}
        </Flex>

        <Heading
          as="h1"
          sx={{
            fontSize: ['28px', '36px'],
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            lineHeight: 1.2,
            maxWidth: 350,
          }}
        >
          Thank you for your support!
        </Heading>
      </Flex>

      <Flex
        sx={{
          flexDirection: 'column',
          width: ['100%', '100%', 420],
          flexShrink: 0,
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};
