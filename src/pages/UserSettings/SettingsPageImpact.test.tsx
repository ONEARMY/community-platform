import '@testing-library/jest-dom/vitest';

import { act, waitFor } from '@testing-library/react';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';

import { FormProvider } from './__mocks__/FormProvider';
import { SettingsPageImpact } from './SettingsPageImpact';

import type { ProfileType } from 'oa-shared';

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: FactoryUser({
      type: {
        id: 1,
        displayName: 'space',
        name: 'space',
        isSpace: true,
      } as ProfileType,
      impact: {
        2023: [
          {
            id: 'plastic',
            value: 43000,
            isVisible: true,
          },
          {
            id: 'volunteers',
            value: 45,
            isVisible: false,
          },
        ],
      },
    }),
  }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('SettingsPageImpact', () => {
  it('renders existing and missing impact', async () => {
    // Act
    let wrapper;
    act(() => {
      wrapper = FormProvider(<SettingsPageImpact />);
    });

    await waitFor(() => {
      expect(wrapper.getAllByText('43,000 Kg of plastic', { exact: false })).toHaveLength(1);
      expect(wrapper.getAllByText('45 volunteers', { exact: false })).toHaveLength(1);

      expect(wrapper.getAllByText('Edit data', { exact: false })).toHaveLength(6);
      expect(wrapper.getAllByText('Do you have impact data for this year?')).toHaveLength(5);
    });
  });
});
