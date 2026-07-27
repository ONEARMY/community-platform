import { Icon } from 'oa-components';
import { IGlyphs } from 'oa-components/Icon/types';
import type { ReactNode } from 'react';
import { Box, Flex, Text } from 'theme-ui';

interface IProps {
  glyph: keyof IGlyphs;
  name: string;
  description: string;
  control: ReactNode;
  subContent?: ReactNode;
  index: number;
}

export const NotificationRow = ({
  glyph,
  name,
  description,
  control,
  subContent,
  index,
}: IProps) => {
  return (
    <Flex
      sx={{
        borderRadius: 1,
        background: index % 2 === 0 ? 'white' : 'softblue',
        flexDirection: 'column',
        padding: 4,
        gap: 4,
      }}
    >
      <Flex sx={{ gap: 2, width: '100%', justifyContent: 'space-between' }}>
        <Flex sx={{ gap: 2, maxWidth: '80%' }}>
          <Icon glyph={glyph} size={20} />
          <Box>
            <Text as="h4">{name}</Text>
            <Text sx={{ color: 'GrayText', fontSize: 2 }}>{description}</Text>
          </Box>
        </Flex>
        <Flex
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {control}
        </Flex>
      </Flex>

      {subContent}
    </Flex>
  );
};
