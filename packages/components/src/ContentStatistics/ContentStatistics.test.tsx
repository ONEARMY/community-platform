import '@testing-library/jest-dom/vitest';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { ContentStatistics } from './ContentStatistics';

import type { IStatistic } from './types';

const usefulStat = (overrides: Partial<IStatistic> = {}): IStatistic => ({
  icon: 'star',
  label: 'useful',
  stat: 2,
  onOpen: vi.fn().mockResolvedValue(['demo_user']),
  modalComponent: (data?: string[]) => <div data-testid="voters-modal">{data?.join(',')}</div>,
  ...overrides,
});

describe('ContentStatistics', () => {
  it('opens the modal with loaded data when clicked', async () => {
    const stat = usefulStat();
    render(<ContentStatistics statistics={[stat]} />);

    fireEvent.click(screen.getByTestId('ContentStatistics-star'));

    await waitFor(() => {
      expect(screen.getByTestId('voters-modal')).toHaveTextContent('demo_user');
    });
    expect(stat.onOpen).toHaveBeenCalledTimes(1);
  });

  it('does not open the modal when the stat is 0', async () => {
    const stat = usefulStat({ stat: 0 });
    render(<ContentStatistics statistics={[stat]} />);

    fireEvent.click(screen.getByTestId('ContentStatistics-star'));

    await waitFor(() => {
      expect(stat.onOpen).not.toHaveBeenCalled();
    });
    expect(screen.queryByTestId('voters-modal')).not.toBeInTheDocument();
  });

  it('does not open a modal when there is no modal component', async () => {
    const stat = usefulStat({ modalComponent: undefined });
    render(<ContentStatistics statistics={[stat]} />);

    fireEvent.click(screen.getByTestId('ContentStatistics-star'));

    await waitFor(() => {
      expect(stat.onOpen).not.toHaveBeenCalled();
    });
    expect(screen.queryByTestId('voters-modal')).not.toBeInTheDocument();
  });
});
