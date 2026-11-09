import '@testing-library/jest-dom/vitest';
import { act, waitFor } from '@testing-library/react';
import { FactoryMapPin } from 'src/test/factories/MapPin';
import { factoryImage, FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';
import { FormProvider } from './__mocks__/FormProvider';
import { SettingsPageMapPin } from './SettingsPageMapPin';
import type { PinProfile, ProfileType } from 'oa-shared';

const completeProfile = {
  about: 'A member',
  displayName: 'Jeffo',
  website: 'www.example.com',
  type: {
    id: 1,
    name: 'member',
    isSpace: false,
  } as ProfileType,
  photo: factoryImage,
};
const mockUseProfileStore = vi.hoisted(() => vi.fn());
const mockGetMapPinById = vi.hoisted(() => vi.fn());
const mockGetCurrentUserMapPin = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../Maps/map.service', () => ({
  mapPinService: {
    getMapPinById: mockGetMapPinById,
    getCurrentUserMapPin: mockGetCurrentUserMapPin,
  },
}));

describe('SettingsPageMapPin', () => {
  it('renders for no pin', async () => {
    const mockUser = FactoryUser(completeProfile);
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
      isComplete: true,
    });
    mockGetCurrentUserMapPin.mockResolvedValue(null);

    // Act
    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.getAllByTestId('NoLocationDataTextDisplay')).toHaveLength(1);
      expect(wrapper.queryAllByTestId('LocationDataTextDisplay')).toHaveLength(0);
    });
  });

  it('renders for member', async () => {
    const mockUser = FactoryUser(completeProfile);
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
    });
    mockGetCurrentUserMapPin.mockResolvedValue(null);

    // Act
    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.getAllByTestId('descriptionMember')).toHaveLength(1);
      expect(wrapper.queryAllByTestId('notApprovedYet')).toHaveLength(0);
    });
  });

  it('renders for space', async () => {
    const moderationFeedback = 'Need a better name';
    const mockUser = FactoryUser({
      about: 'An important space',
      displayName: 'Jeffo',
      type: {
        id: 1,
        name: 'community-builder',
        isSpace: true,
      } as ProfileType,
      coverImages: [factoryImage],
    });
    const mockPin = FactoryMapPin({
      country: 'Portugal',
      countryCode: 'pt',
      name: 'Super cool place',
      moderation: 'improvements-needed',
      moderationFeedback,
      profile: mockUser as PinProfile,
    });

    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
      isComplete: true,
    });
    mockGetCurrentUserMapPin.mockResolvedValue(mockPin); // Mock a pin for a space

    // Act
    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('descriptionMember')).toHaveLength(0);
      expect(wrapper.getAllByTestId('notApprovedYet')).toHaveLength(1);
      expect(wrapper.getAllByText(mockPin.name, { exact: false })).toHaveLength(1);
      expect(wrapper.queryAllByText(moderationFeedback, { exact: false })).toHaveLength(0);
    });
  });

  it('lets an organisation awaiting approval add a pin that is not public yet', async () => {
    const mockUser = FactoryUser({
      displayName: 'Jeffo',
      type: { id: 1, name: 'workspace', isSpace: true } as ProfileType,
      moderation: 'awaiting-moderation',
    });
    mockUseProfileStore.mockReturnValue({ profile: mockUser, update: vi.fn(), isComplete: true });
    mockGetCurrentUserMapPin.mockResolvedValue(null);

    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.getAllByTestId('notApprovedYet')).toHaveLength(1);
      expect(wrapper.getAllByTestId('NoLocationDataTextDisplay')).toHaveLength(1);
    });
  });

  it('treats the organisation, not an old pin status, as what makes the pin public', async () => {
    const mockUser = FactoryUser({
      displayName: 'Jeffo',
      type: { id: 1, name: 'workspace', isSpace: true } as ProfileType,
      moderation: null,
    });
    mockUseProfileStore.mockReturnValue({ profile: mockUser, update: vi.fn(), isComplete: true });
    mockGetCurrentUserMapPin.mockResolvedValue(
      FactoryMapPin({ moderation: 'accepted', profile: mockUser as PinProfile }),
    );

    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.getAllByTestId('LocationDataTextDisplay')).toHaveLength(1);
      expect(wrapper.getAllByTestId('notApprovedYet')).toHaveLength(1);
    });
  });

  it('shows no approval note to an approved organisation', async () => {
    const mockUser = FactoryUser({
      displayName: 'Jeffo',
      type: { id: 1, name: 'workspace', isSpace: true } as ProfileType,
      moderation: 'accepted',
    });
    mockUseProfileStore.mockReturnValue({ profile: mockUser, update: vi.fn(), isComplete: true });
    mockGetCurrentUserMapPin.mockResolvedValue(null);

    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('notApprovedYet')).toHaveLength(0);
      expect(wrapper.getAllByTestId('NoLocationDataTextDisplay')).toHaveLength(1);
    });
  });

  it('renders for user with incomplete profile', async () => {
    const mockUser = FactoryUser({
      displayName: 'Jeffo',
      type: {
        id: 1,
        name: 'member',
        isSpace: false,
      } as ProfileType,
      photo: factoryImage,
    });
    mockUseProfileStore.mockReturnValue({
      profile: mockUser,
      update: vi.fn(),
      isComplete: false,
    });
    mockGetCurrentUserMapPin.mockResolvedValue(null);

    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageMapPin />);
    });

    await waitFor(() => {
      expect(wrapper.queryAllByTestId('IncompleteProfileTextDisplay')).toHaveLength(1);
      expect(wrapper.queryAllByTestId('complete-profile-button')).toHaveLength(1);
    });
  });
});
