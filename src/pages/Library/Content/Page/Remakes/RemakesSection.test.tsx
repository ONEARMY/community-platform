import '@testing-library/jest-dom/vitest';

import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { FactoryLibraryItem } from 'src/test/factories/Library';
import { FactoryRemake } from 'src/test/factories/Remake';
import { FactoryUser } from 'src/test/factories/User';
import { ThemeProvider } from '@theme-ui/core';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { RemakesSection } from './RemakesSection';

import type { Project, Remake } from 'oa-shared';

const mockUseProfileStore = vi.hoisted(() => vi.fn());
const mockGetRemakes = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

vi.mock('src/services/remakeService', () => ({
  remakeService: {
    getRemakes: mockGetRemakes,
    createRemake: vi.fn(),
    updateRemake: vi.fn(),
    deleteRemake: vi.fn(),
  },
}));

vi.mock('./RemakeFormModal', () => ({
  RemakeFormModal: ({ onCreated }: { onCreated: (remake: Remake) => void }) => (
    <button
      type="button"
      data-cy="stub-remake-created"
      onClick={() => onCreated(FactoryRemake({ description: 'Freshly created remake' }))}
    >
      created
    </button>
  ),
}));

const project = FactoryLibraryItem() as Project;

const getWrapper = (onRemakeCountChange?: (count: number) => void) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <RemakesSection project={project} onRemakeCountChange={onRemakeCountChange} />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('RemakesSection', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the empty state when there are no remakes', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockResolvedValue([]);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.getByText('Remakes')).toBeInTheDocument();
      expect(wrapper.getByText('Make this and share with us!')).toBeInTheDocument();
      expect(wrapper.getByText('Try this tutorial and share with the community.')).toBeInTheDocument();
      expect(wrapper.getByText('Upload your remake')).toBeInTheDocument();
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).not.toBeInTheDocument();
    });
  });

  it('shows an error instead of the empty state when the fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockRejectedValue(new Error('Network error'));

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).toBeInTheDocument();
      expect(wrapper.getByText('Error loading remakes. Please try again later.')).toBeInTheDocument();
      expect(wrapper.container.querySelector('[data-cy=remakes-empty-state]')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('shows an error instead of the empty state when the server returns an error status', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockRejectedValue(new Error('Failed to fetch remakes'));

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).toBeInTheDocument();
      expect(wrapper.container.querySelector('[data-cy=remakes-empty-state]')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('refetches when the retry button is clicked after a failed load', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockRejectedValueOnce(new Error('Network error'));
    mockGetRemakes.mockResolvedValueOnce([FactoryRemake()]);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remakes-retry]')).toBeInTheDocument();
    });

    await userEvent.click(wrapper.container.querySelector('[data-cy=remakes-retry]'));

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remake-card]')).toBeInTheDocument();
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).not.toBeInTheDocument();
    });
    expect(mockGetRemakes).toHaveBeenCalledTimes(2);

    consoleSpy.mockRestore();
  });

  it('refetches the list when a remake is created while the list failed to load', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockRejectedValueOnce(new Error('Network error'));
    mockGetRemakes.mockResolvedValueOnce([FactoryRemake(), FactoryRemake()]);
    const onRemakeCountChange = vi.fn();

    let wrapper;
    act(() => {
      wrapper = getWrapper(onRemakeCountChange);
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).toBeInTheDocument();
    });

    await userEvent.click(wrapper.container.querySelector('[data-cy=upload-remake]'));
    await userEvent.click(wrapper.container.querySelector('[data-cy=stub-remake-created]'));

    await waitFor(() => {
      expect(wrapper.container.querySelectorAll('[data-cy=remake-card]')).toHaveLength(2);
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).not.toBeInTheDocument();
    });
    expect(mockGetRemakes).toHaveBeenCalledTimes(2);
    expect(onRemakeCountChange).toHaveBeenLastCalledWith(2);

    consoleSpy.mockRestore();
  });

  it('prepends the created remake without refetching once the list has loaded', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockResolvedValue([]);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remakes-empty-state]')).toBeInTheDocument();
    });

    await userEvent.click(wrapper.container.querySelector('[data-cy=upload-remake]'));
    await userEvent.click(wrapper.container.querySelector('[data-cy=stub-remake-created]'));

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remake-card]')).toBeInTheDocument();
      expect(wrapper.container.querySelector('[data-cy=remakes-empty-state]')).not.toBeInTheDocument();
    });
    expect(mockGetRemakes).toHaveBeenCalledTimes(1);
  });

  it('shows neither the empty state nor cards while the remakes are still loading', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    let resolveRemakes!: (remakes: Remake[]) => void;
    mockGetRemakes.mockReturnValue(
      new Promise<Remake[]>((resolve) => {
        resolveRemakes = resolve;
      }),
    );

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    expect(wrapper.container.querySelector('[data-cy=remakes-empty-state]')).not.toBeInTheDocument();
    expect(wrapper.container.querySelector('[data-cy=remake-card]')).not.toBeInTheDocument();

    await act(async () => {
      resolveRemakes([FactoryRemake()]);
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remake-card]')).toBeInTheDocument();
    });
  });

  it('renders a card per remake and the count', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    const remakes: Remake[] = [FactoryRemake(), FactoryRemake(), FactoryRemake()];
    mockGetRemakes.mockResolvedValue(remakes);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.getByText('3 remakes')).toBeInTheDocument();
      expect(wrapper.container.querySelectorAll('[data-cy=remake-card]')).toHaveLength(3);
    });
  });

  it('shows the ghost card only when there is exactly one remake', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockResolvedValue([FactoryRemake()]);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.getByText('1 remake')).toBeInTheDocument();
      expect(wrapper.container.querySelector('[data-cy=remake-ghost-card]')).toBeInTheDocument();
      expect(wrapper.getByText('Your remake here!')).toBeInTheDocument();
    });
  });

  it('paginates when there are more than 12 remakes', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    const remakes = Array.from({ length: 13 }, () => FactoryRemake());
    mockGetRemakes.mockResolvedValue(remakes);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelectorAll('[data-cy=remake-card]')).toHaveLength(12);
      expect(wrapper.container.querySelector('[data-cy=pagination]')).toBeInTheDocument();
      expect(wrapper.getByText('of 2')).toBeInTheDocument();
    });
  });

  it('does not paginate with 12 or fewer remakes', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockResolvedValue(Array.from({ length: 12 }, () => FactoryRemake()));

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelectorAll('[data-cy=remake-card]')).toHaveLength(12);
      expect(wrapper.container.querySelector('[data-cy=pagination]')).not.toBeInTheDocument();
    });
  });

  it('reports the loaded count once the remakes have been fetched', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockResolvedValue([FactoryRemake(), FactoryRemake(), FactoryRemake()]);
    const onRemakeCountChange = vi.fn();

    act(() => {
      getWrapper(onRemakeCountChange);
    });

    await waitFor(() => {
      expect(onRemakeCountChange).toHaveBeenCalledWith(3);
    });
  });

  it('does not report a count while the remakes are still loading', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    let resolveRemakes!: (remakes: Remake[]) => void;
    mockGetRemakes.mockReturnValue(
      new Promise<Remake[]>((resolve) => {
        resolveRemakes = resolve;
      }),
    );
    const onRemakeCountChange = vi.fn();

    act(() => {
      getWrapper(onRemakeCountChange);
    });

    expect(onRemakeCountChange).not.toHaveBeenCalled();

    await act(async () => {
      resolveRemakes([FactoryRemake()]);
    });

    await waitFor(() => {
      expect(onRemakeCountChange).toHaveBeenCalledWith(1);
    });
  });

  it('does not report a count when the fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    mockGetRemakes.mockRejectedValue(new Error('Network error'));
    const onRemakeCountChange = vi.fn();

    let wrapper;
    act(() => {
      wrapper = getWrapper(onRemakeCountChange);
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remakes-fetch-error]')).toBeInTheDocument();
    });

    expect(onRemakeCountChange).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('opens the view modal when a card is clicked', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });
    const remake = FactoryRemake({ description: 'My remake description' });
    mockGetRemakes.mockResolvedValue([remake]);

    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remake-card]')).toBeInTheDocument();
    });

    await userEvent.click(wrapper.container.querySelector('[data-cy=remake-card]'));

    await waitFor(() => {
      expect(wrapper.container.querySelector('[data-cy=remake-view-modal]')).toBeInTheDocument();
      expect(wrapper.getByText('My remake description')).toBeInTheDocument();
    });
  });
});
