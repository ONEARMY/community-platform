import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Tabs } from '@/components/ui/tabs';
import { SettingsFormTabList } from './SettingsFormTabList';
import type { ISettingsTab } from './types';

const tabs: ISettingsTab[] = [
  { title: 'Profile', route: '/settings/profile', glyph: 'profile', body: () => null },
  { title: 'Account', route: '/settings/account', glyph: 'account', body: () => null },
];

const renderTabList = (items: ISettingsTab[], orientation: 'horizontal' | 'vertical') =>
  render(
    <MemoryRouter>
      <Tabs value="/settings/account" orientation={orientation}>
        <SettingsFormTabList tabs={items} />
      </Tabs>
    </MemoryRouter>,
  );

describe('SettingsFormTabList', () => {
  it.each(['horizontal', 'vertical'] as const)('renders %s tabs as links', (orientation) => {
    renderTabList(tabs, orientation);

    expect(screen.getByRole('tablist')).toHaveAttribute('data-orientation', orientation);
    expect(screen.getByRole('tab', { name: /Profile/ })).toHaveAttribute(
      'href',
      '/settings/profile',
    );
    expect(screen.getByRole('tab', { name: /Account/ })).toHaveAttribute(
      'data-cy',
      'tab-Account',
    );
  });

  it('marks the current route as selected', () => {
    renderTabList(tabs, 'vertical');

    expect(screen.getByRole('tab', { name: /Account/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Profile/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('renders nothing for a single tab', () => {
    renderTabList([tabs[0]], 'vertical');

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
