import { Box, Flex, Text } from 'theme-ui';
import { TierStarIcon } from './TierStarIcons';
import type { TierConfigEntry } from './tierConfig';

export const TierBanner = ({
  tier,
  tierConfig,
  tierColor,
}: {
  tier: number;
  tierConfig: TierConfigEntry;
  tierColor: string;
}) => (
  <Flex
    sx={{
      bg: `color-mix(in srgb, ${tierColor} 50%, transparent)`,
      borderRadius: '14px',
      px: ['16px', '24px'],
      py: ['16px', '12px'],
      minHeight: '100px',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: ['12px', '18px'],
      alignSelf: 'stretch',
    }}
  >
    <Flex sx={{ flexDirection: 'column', gap: '4px' }}>
      <Text sx={{ fontWeight: 500, fontSize: '22px' }}>{tierConfig.name} Membership</Text>
      <Text sx={{ fontSize: '14px', lineHeight: 1.4, color: 'darkGrey' }}>
        {tierConfig.description}
      </Text>
    </Flex>
    <Box
      sx={{
        flexShrink: 0,
        width: ['40px', '100px'],
        height: ['32px', '77px'],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TierStarIcon tier={tier} />
    </Box>
  </Flex>
);
