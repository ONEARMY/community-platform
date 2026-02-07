import { Button } from 'oa-components';
import { useContext } from 'react';
import { Box, Flex } from 'theme-ui';

import { MapContext } from '../../MapContext';
import { MapWithListHeader } from './MapWithListHeader';

export const MapList = () => {
  const mapState = useContext(MapContext);

  if (!mapState) {
    return null;
  }

  const mobileListDisplay = mapState.isMobile ? 'block' : 'none';

  return (
    <>
      {/* Desktop list view */}
      <Box
        sx={{
          display: ['none', 'none', 'block', 'block'],
          background: 'white',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <MapWithListHeader viewport="desktop" />
      </Box>

      {/* Mobile/tablet list view */}
      <Box
        sx={{
          display: [mobileListDisplay, mobileListDisplay, 'none', 'none'],
          background: 'white',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <Flex
          sx={{
            justifyContent: 'center',
            paddingBottom: 2,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
          }}
        >
          <Button
            data-cy="ShowMapButton"
            icon="map"
            sx={{ position: 'sticky', marginTop: 2 }}
            onClick={() => mapState.setIsMobile(false)}
            small
          >
            Show map view
          </Button>
        </Flex>
        <MapWithListHeader viewport="mobile" />
      </Box>
    </>
  );
};
