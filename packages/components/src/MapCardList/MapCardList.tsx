import { useEffect, useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';

import { Button } from '../Button/Button';
import { CardListItem } from '../CardListItem/CardListItem';
import { Icon } from '../Icon/Icon';

import type { MapPin } from 'oa-shared';
import type { JSX } from 'react';

export interface IProps {
  list: MapPin[];
  onPinClick: (arg: MapPin) => void;
  selectedPin?: MapPin | null;
  viewport: string;
}

export const EMPTY_LIST = 'Oh nos! Nothing to show!';
const ITEMS_PER_RENDER = 20;

export const MapCardList = (props: IProps) => {
  const [renderCount, setRenderCount] = useState<number>(ITEMS_PER_RENDER);
  const [displayItems, setDisplayItems] = useState<JSX.Element[]>([]);
  const { list, onPinClick, selectedPin, viewport } = props;

  useEffect(() => {
    setRenderCount(ITEMS_PER_RENDER);
  }, [list]);

  useEffect(() => {
    const toRender = list.slice(0, renderCount).map((item) => {
      const isSelectedPin = item.id === selectedPin?.id;

      return (
        <CardListItem
          item={item}
          key={item.id}
          isSelectedPin={isSelectedPin}
          onPinClick={onPinClick}
          viewport={viewport}
        />
      );
    });

    setDisplayItems(toRender);
  }, [renderCount, list]);

  const addRenderItems = () => setRenderCount((count) => count + ITEMS_PER_RENDER);

  const hasMore = !(displayItems.length === list.length);

  const isListEmpty = list.length === 0;
  const results = `${list.length} result${list.length == 1 ? '' : 's'} in view`;

  return (
    <Flex data-cy={`CardList-${viewport}`} sx={{ flexDirection: 'column', gap: 2, padding: 2 }}>
      <Flex sx={{ justifyContent: 'space-between', paddingX: 2, paddingTop: 2, fontSize: 2 }}>
        <Text data-cy="list-results">{results}</Text>
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <Text>Most recently active</Text>
          <Icon glyph="arrow-full-down" />
        </Flex>
      </Flex>
      {isListEmpty && EMPTY_LIST}
      {!isListEmpty && (
        <>
          <Box sx={{ columnCount: [1, 2, 2, 3], columnGap: 0, '& > *': { breakInside: 'avoid' } }}>
            {displayItems}
          </Box>
          {hasMore && (
            <Flex sx={{ justifyContent: 'center' }}>
              <Button onClick={addRenderItems}>Show more</Button>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};
