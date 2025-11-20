import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { render, screen } from '@testing-library/react';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';
import { FactoryUser } from 'src/test/factories/User';
import { describe, it, vi } from 'vitest';

import { ImpactMissing } from './ImpactMissing';
import { invisible, missing, reportYearLabel } from './labels';

import type { Profile } from 'oa-shared';

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: vi.fn(() => ({
    profile: FactoryUser({ username: 'activeUser' }),
  })),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ImpactMissing', () => {
  describe('[public]', () => {
    it('renders message that impact is missing', async () => {
      render(
        <ProfileStoreProvider>
          <ImpactMissing
            fields={undefined}
            owner={undefined}
            year={2023}
            visibleFields={undefined}
          />
        </ProfileStoreProvider>,
      );

      await screen.findByText(missing.user.label);
    });

    it('renders right message and button for impact report year', async () => {
      render(
        <ProfileStoreProvider>
          <ImpactMissing
            fields={undefined}
            owner={undefined}
            year={2022}
            visibleFields={undefined}
          />
        </ProfileStoreProvider>,
      );

      await screen.findByText(reportYearLabel);
      await screen.findByText(`2022 ${missing.user.link}`);
    });

    it('renders message that all data is invisible', async () => {
      const fields = [
        {
          id: 'volunteers',
          value: 45,
          isVisible: true,
        },
      ];

      render(
        <ProfileStoreProvider>
          <ImpactMissing fields={fields} owner={undefined} year={2022} visibleFields={[]} />
        </ProfileStoreProvider>,
      );
      await screen.findByText(invisible.user.label);
    });
  });

  describe('[page owner]', () => {
    it('renders right message for impact owner', async () => {
      const user = FactoryUser({ username: 'activeUser' }) as Profile;
      const router = createMemoryRouter(
        createRoutesFromElements(
          <Route
            index
            element={
              <ImpactMissing
                fields={undefined}
                owner={user}
                year={2023}
                visibleFields={undefined}
              />
            }
          />,
        ),
      );

      const container = render(
        <ProfileStoreProvider>
          <RouterProvider router={router} />
        </ProfileStoreProvider>,
      );

      await container.findByText(missing.owner.label);
    });
  });
});
