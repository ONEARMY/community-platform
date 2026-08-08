import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const meta: Meta<typeof Table> = {
  title: 'ui/Table',
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table>;

const categories = [
  { name: 'Bottles', type: 'Projects', description: 'PET bottle recycling machines' },
  { name: 'Community', type: 'Questions', description: 'General community questions' },
  { name: 'Updates', type: 'News', description: 'Platform announcements' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.name}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.type}</TableCell>
            <TableCell className="text-muted-foreground">{category.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaptionAndFooter: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of categories.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.name}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{categories.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
