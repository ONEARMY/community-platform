import '@testing-library/jest-dom/vitest';
import type { JwtPayload } from '@supabase/supabase-js';
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { SessionContext } from 'src/pages/common/SessionContext';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MapsPage from './Maps.client';
import { mapPinService } from './map.service';

vi.mock('./map.service', () => ({
  mapPinService: {
    getMapPins: vi.fn().mockResolvedValue([]),
    getMapPinById: vi.fn(),
    getCurrentUserMapPin: vi.fn().mockResolvedValue(null),
    getMapFilters: vi.fn().mockResolvedValue(null),
  },
}));
vi.mock('./Content/MapView/MapList', () => ({ MapList: () => null }));
vi.mock('./Content/MapView/MapView.client', () => ({ MapView: () => null }));

const renderMap = (claims: JwtPayload | null) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/map']}>
        <SessionContext.Provider value={claims}>
          <MapsPage />
        </SessionContext.Provider>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('MapsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not fetch the user's map pin when logged out", async () => {
    renderMap(null);

    await waitFor(() => expect(mapPinService.getMapPins).toHaveBeenCalled());
    expect(mapPinService.getCurrentUserMapPin).not.toHaveBeenCalled();
  });

  it("fetches the user's map pin when logged in", async () => {
    renderMap({ sub: 'auth-1' } as JwtPayload);

    await waitFor(() => expect(mapPinService.getCurrentUserMapPin).toHaveBeenCalledTimes(1));
  });
});
