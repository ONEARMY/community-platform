import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'ui/Tabs',
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const items = ['Profile', 'Map', 'Notifications', 'Account'];

const renderTabs = (variant: 'default' | 'line' | 'outline', orientation?: 'vertical') => (
  <Tabs defaultValue="Profile" orientation={orientation}>
    <TabsList variant={variant}>
      {items.map((item) => (
        <TabsTrigger key={item} value={item}>
          {item}
        </TabsTrigger>
      ))}
    </TabsList>
    {items.map((item) => (
      <TabsContent key={item} value={item}>
        {item} content
      </TabsContent>
    ))}
  </Tabs>
);

export const Default: Story = {
  render: () => renderTabs('default'),
};

export const Line: Story = {
  render: () => renderTabs('line'),
};

export const Outline: Story = {
  render: () => renderTabs('outline'),
};

export const OutlineVertical: Story = {
  render: () => renderTabs('outline', 'vertical'),
};

export const OutlineMobile: Story = {
  render: () => renderTabs('outline'),
  globals: { viewport: { value: 'mobile1' } },
};
