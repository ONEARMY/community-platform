import { useState } from 'react';
import { Flex, Text } from 'theme-ui';

import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

import type { availableGlyphs } from '../Icon/types';

export interface IProps {
  statistics: {
    icon: availableGlyphs;
    label: string;
  }[];
  alwaysShow?: boolean;
}

export const ContentStatistics = (props: IProps) => {
  const { alwaysShow, statistics } = props;
  const [showStats, setShowStats] = useState(false);

  const handleShowStats = () => {
    setShowStats(!showStats);
  };

  return (
    <Flex
      data-cy={'ContentStatistics'}
      py={1}
      sx={{
        alignItems: ['flex-start', 'center', 'center'],
        justifyContent: 'center',
        gap: 2,
        flexDirection: alwaysShow ? 'row' : ['column', 'row', 'row'],
        pl: alwaysShow ? 0 : [2, 0, 0],
      }}
    >
      <Flex
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          display: alwaysShow ? 'none' : ['flex', 'none', 'none'],
          width: '100%',
        }}
        onClick={handleShowStats}
      >
        <Text
          sx={{
            fontSize: '13px',
          }}
        >
          {showStats ? '' : 'More Information'}
        </Text>
        <Button
          type="button"
          variant="subtle"
          showIconOnly={true}
          icon={showStats ? 'chevron-up' : 'chevron-down'}
          small={true}
          sx={{
            borderWidth: '0px',
            '&:hover': {
              bg: 'white',
            },
            '&:active': {
              bg: 'white',
            },
          }}
        />
      </Flex>
      {statistics.map((statistic, idx) => (
        <Flex
          key={idx}
          px={2}
          py={1}
          mb={1}
          sx={{
            alignItems: 'center',
            fontSize: '1',
            display: [showStats || alwaysShow ? 'flex' : 'none', 'flex', 'flex'],
          }}
        >
          <Icon glyph={statistic.icon} mr={1} size={'sm'} opacity={'0.5'} />
          <Text>{statistic.label}</Text>
        </Flex>
      ))}
    </Flex>
  );
};
