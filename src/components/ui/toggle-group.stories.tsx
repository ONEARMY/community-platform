import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './button';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const meta: Meta<typeof ToggleGroup> = {
  title: 'ui/ToggleGroup',
  component: ToggleGroup,
};
export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  render: () => (
    <ToggleGroup defaultValue={['unread']}>
      <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['grid']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ToggleGroup value={value} onValueChange={setValue}>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="map">Map</ToggleGroupItem>
        </ToggleGroup>
        <span style={{ fontSize: 12 }}>Selected: {value.join(', ') || 'none'}</span>
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup multiple defaultValue={['bold']}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['default', 'outline', 'ghost'] as const).map((variant) => (
        <ToggleGroup key={variant} variant={variant} defaultValue={['one']}>
          <ToggleGroupItem value="one">One</ToggleGroupItem>
          <ToggleGroupItem value="two">Two</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
};

/** Each size lines up with the Button of the same size. */
export const AlignsWithButton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ToggleGroup size={size} defaultValue={['unread']}>
            <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
            <ToggleGroupItem value="all">All</ToggleGroupItem>
          </ToggleGroup>
          <Button size={size} variant="outline">
            Mark all read
          </Button>
          <span style={{ fontSize: 12 }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup disabled defaultValue={['unread']}>
      <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
    </ToggleGroup>
  ),
};
