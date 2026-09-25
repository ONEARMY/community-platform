import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Card> = {
  title: 'ui/Card',
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader>
        <CardTitle>Profile type</CardTitle>
        <CardDescription>Members grouped by profile type</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-semibold">128</span>
      </CardContent>
    </Card>
  ),
};

export const Flat: Story = {
  render: () => (
    <Card variant="flat" style={{ width: 320 }}>
      <h2 className="m-0 font-heading text-card-heading">Research overview</h2>
      <span className="text-sm text-muted-foreground">Matches the legacy oa-components card.</span>
    </Card>
  ),
};

const profileTypeCounts = [
  { name: 'Member', count: 812 },
  { name: 'Space', count: 46 },
  { name: 'Collection', count: 12 },
];

export const WithStatTiles: Story = {
  render: () => (
    <Card style={{ width: 420 }}>
      <CardHeader>
        <CardTitle>Profile type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {profileTypeCounts.map((profileType) => (
            <div key={profileType.name} className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">{profileType.count}</span>
              <span className="text-sm text-muted-foreground">{profileType.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};
