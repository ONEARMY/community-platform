import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const renderTabs = (orientation?: 'horizontal' | 'vertical') =>
  render(
    <Tabs defaultValue="first" orientation={orientation}>
      <TabsList variant="outline">
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="first">First panel</TabsContent>
      <TabsContent value="second">Second panel</TabsContent>
    </Tabs>,
  );

describe('Tabs', () => {
  it('shows the panel of the selected tab', async () => {
    const user = userEvent.setup();
    renderTabs();

    expect(screen.getByText('First panel')).toBeInTheDocument();
    expect(screen.queryByText('Second panel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Second' }));

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Second panel')).toBeInTheDocument();
    expect(screen.queryByText('First panel')).not.toBeInTheDocument();
  });

  it('defaults to horizontal orientation', () => {
    renderTabs();

    expect(screen.getByRole('tablist')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports vertical orientation', () => {
    renderTabs('vertical');

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
