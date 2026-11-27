import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import type { ChartConfig } from './chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';

const config: ChartConfig = { total: { label: 'Notifications', color: 'var(--color-chart-2)' } };

const data = [
  { week: '3 Nov', total: 120 },
  { week: '10 Nov', total: 180 },
  { week: '17 Nov (current)', total: 64 },
];

const meta: Meta<typeof ChartContainer> = {
  title: 'ui/Chart',
  component: ChartContainer,
};
export default meta;

type Story = StoryObj<typeof ChartContainer>;

export const Bars: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-full max-w-lg">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
