import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUsefulStatistic } from './statistics';

import type { ProfileListItem } from 'oa-shared';

const mockUsefulVoters = vi.hoisted(() => vi.fn());

vi.mock('src/services/usefulService', () => ({
  usefulService: { usefulVoters: mockUsefulVoters },
}));

const voters: ProfileListItem[] = [
  {
    id: 1,
    username: 'demo_user',
    displayName: 'Demo User',
    photo: null,
    country: 'UK',
    badges: [],
    type: null,
  },
];

describe('createUsefulStatistic', () => {
  beforeEach(() => {
    mockUsefulVoters.mockReset();
  });

  it('has no voters modal by default', () => {
    const stat = createUsefulStatistic('questions', 1, 3);

    expect(stat.stat).toBe(3);
    expect(stat.onOpen).toBeUndefined();
    expect(stat.modalComponent).toBeUndefined();
  });

  it('loads voters and renders them in a profile list', async () => {
    mockUsefulVoters.mockResolvedValue(voters);
    const stat = createUsefulStatistic('questions', 7, 1, true);

    const profiles = await stat.onOpen!();
    expect(mockUsefulVoters).toHaveBeenCalledWith('questions', 7);
    expect(profiles).toEqual(voters);

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>{stat.modalComponent!(profiles)}</MemoryRouter>
      </ThemeProvider>,
    );
    expect(screen.getByText('Others that found it useful')).toBeInTheDocument();
    expect(screen.getByText('demo_user')).toBeInTheDocument();
  });

  it('returns an empty list when loading voters fails', async () => {
    mockUsefulVoters.mockRejectedValue(new Error('boom'));
    const stat = createUsefulStatistic('questions', 7, 1, true);

    expect(await stat.onOpen!()).toEqual([]);
  });
});
