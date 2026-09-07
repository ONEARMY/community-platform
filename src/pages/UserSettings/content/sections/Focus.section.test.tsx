import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import type { ProfileType } from 'oa-shared';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FocusSection } from './Focus.section';

const mockUseProfileStore = vi.hoisted(() => vi.fn());
const mockUpdateProfileType = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

vi.mock('src/services/profileService', () => ({
  profileService: {
    updateProfileType: (...args: unknown[]) => mockUpdateProfileType(...args),
  },
}));

vi.mock('src/common/Toast', () => ({
  useToast: () => ({
    promise: (promise: Promise<unknown>, opts: { success: (data: unknown) => string }) => {
      promise.then((data) => opts.success(data));
      return 1;
    },
  }),
}));

const workspace = {
  id: 2,
  name: 'workspace',
  isSpace: true,
  displayName: 'Workspace',
  description: 'Place where plastic gets transformed into materials or products.',
  imageUrl: '',
  smallImageUrl: '',
  mapPinName: '',
  order: 2,
} as ProfileType;

const machineBuilder = {
  id: 3,
  name: 'machine-builder',
  isSpace: true,
  displayName: 'Machine Builder',
  description: 'Builds machines.',
  imageUrl: '',
  smallImageUrl: '',
  mapPinName: '',
  order: 3,
} as ProfileType;

const member = {
  id: 1,
  name: 'member',
  isSpace: false,
  displayName: 'Member',
  description: 'A member.',
  imageUrl: '',
  smallImageUrl: '',
  mapPinName: '',
  order: 1,
} as ProfileType;

const profileTypes = [member, workspace, machineBuilder];

const byCy = (container: HTMLElement, cy: string) =>
  container.querySelector<HTMLElement>(`[data-cy="${cy}"]`);

describe('FocusSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render for member profiles', () => {
    mockUseProfileStore.mockReturnValue({
      profile: FactoryUser({ type: member }),
      profileTypes,
      update: vi.fn(),
      refresh: vi.fn(),
    });

    const { container } = render(<FocusSection />);

    expect(byCy(container, 'FocusSection')).toBeNull();
  });

  it('shows the current profile type with a change button for organisations', () => {
    mockUseProfileStore.mockReturnValue({
      profile: FactoryUser({ type: workspace }),
      profileTypes,
      update: vi.fn(),
      refresh: vi.fn(),
    });

    const { container, getByText } = render(<FocusSection />);

    expect(byCy(container, 'FocusSection')).toBeInTheDocument();
    expect(getByText('Workspace')).toBeInTheDocument();
    expect(byCy(container, 'focus-change')).toBeInTheDocument();
    expect(byCy(container, 'focus-save')).toBeNull();
  });

  it('reveals the type picker when change is clicked', () => {
    mockUseProfileStore.mockReturnValue({
      profile: FactoryUser({ type: workspace }),
      profileTypes,
      update: vi.fn(),
      refresh: vi.fn(),
    });

    const { container } = render(<FocusSection />);

    act(() => {
      fireEvent.click(byCy(container, 'focus-change')!);
    });

    expect(byCy(container, 'focus-save')).toBeInTheDocument();
    expect(byCy(container, 'workspace')).toBeInTheDocument();
    expect(byCy(container, 'machine-builder')).toBeInTheDocument();
    expect(byCy(container, 'member')).toBeNull();
  });

  it('saves the newly selected focus', async () => {
    const update = vi.fn();
    const refresh = vi.fn();
    mockUpdateProfileType.mockResolvedValue(FactoryUser({ type: machineBuilder }));
    mockUseProfileStore.mockReturnValue({
      profile: FactoryUser({ type: workspace }),
      profileTypes,
      update,
      refresh,
    });

    const { container } = render(<FocusSection />);

    act(() => {
      fireEvent.click(byCy(container, 'focus-change')!);
    });

    const machineRadio = byCy(container, 'machine-builder')!.querySelector('input')!;
    act(() => {
      fireEvent.click(machineRadio);
    });
    act(() => {
      fireEvent.click(byCy(container, 'focus-save')!);
    });

    await waitFor(() => {
      expect(mockUpdateProfileType).toHaveBeenCalledWith(machineBuilder.id);
      expect(update).toHaveBeenCalled();
    });
  });

  it('does not save when the focus is unchanged', () => {
    mockUseProfileStore.mockReturnValue({
      profile: FactoryUser({ type: workspace }),
      profileTypes,
      update: vi.fn(),
      refresh: vi.fn(),
    });

    const { container } = render(<FocusSection />);

    act(() => {
      fireEvent.click(byCy(container, 'focus-change')!);
    });
    act(() => {
      fireEvent.click(byCy(container, 'focus-save')!);
    });

    expect(mockUpdateProfileType).not.toHaveBeenCalled();
  });
});
