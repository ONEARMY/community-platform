import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const meta: Meta<typeof Select> = {
  title: 'ui/Select',
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

const CATEGORY_TYPE_OPTIONS = [
  { value: 'questions', label: 'Questions' },
  { value: 'projects', label: 'Projects' },
  { value: 'research', label: 'Research' },
  { value: 'news', label: 'News' },
];

export const Default: Story = {
  render: () => (
    <Select items={CATEGORY_TYPE_OPTIONS}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select items={CATEGORY_TYPE_OPTIONS} defaultValue="projects">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select items={CATEGORY_TYPE_OPTIONS} disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};
