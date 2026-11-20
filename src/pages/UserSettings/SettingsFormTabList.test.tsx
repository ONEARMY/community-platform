import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

const setScrollSize = (
  element: HTMLElement,
  sizes: { clientWidth: number; scrollWidth: number },
) => {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: sizes.clientWidth });
  Object.defineProperty(element, 'scrollWidth', { configurable: true, value: sizes.scrollWidth });
};

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it('shows no scroll arrows when all tabs fit', () => {
    renderTabList(tabs, 'horizontal');

    const list = screen.getByRole('tablist');
    setScrollSize(list, { clientWidth: 300, scrollWidth: 300 });
    fireEvent.scroll(list);

    expect(document.querySelector('[data-cy="tabs-scroll-start"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-cy="tabs-scroll-end"]')).not.toBeInTheDocument();
  });

  it('shows a scroll arrow on each side that has hidden tabs', () => {
    renderTabList(tabs, 'horizontal');

    const list = screen.getByRole('tablist');
    setScrollSize(list, { clientWidth: 200, scrollWidth: 500 });

    list.scrollLeft = 0;
    fireEvent.scroll(list);
    expect(document.querySelector('[data-cy="tabs-scroll-start"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-cy="tabs-scroll-end"]')).toBeInTheDocument();

    list.scrollLeft = 150;
    fireEvent.scroll(list);
    expect(document.querySelector('[data-cy="tabs-scroll-start"]')).toBeInTheDocument();
    expect(document.querySelector('[data-cy="tabs-scroll-end"]')).toBeInTheDocument();

    list.scrollLeft = 300;
    fireEvent.scroll(list);
    expect(document.querySelector('[data-cy="tabs-scroll-start"]')).toBeInTheDocument();
    expect(document.querySelector('[data-cy="tabs-scroll-end"]')).not.toBeInTheDocument();
  });

  it('scrolls the tab list when an arrow is pressed', () => {
    renderTabList(tabs, 'horizontal');

    const list = screen.getByRole('tablist');
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;
    setScrollSize(list, { clientWidth: 200, scrollWidth: 500 });
    fireEvent.scroll(list);

    fireEvent.click(document.querySelector('[data-cy="tabs-scroll-end"]') as HTMLElement);

    expect(scrollBy).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' });
  });
});
