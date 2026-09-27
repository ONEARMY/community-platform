import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkifyText } from './linkify-text';

const meta: Meta<typeof LinkifyText> = {
  title: 'ui/LinkifyText',
  component: LinkifyText,
};
export default meta;

type Story = StoryObj<typeof LinkifyText>;

export const Default: Story = {
  args: {
    children:
      'There are some link.info hidden in this text. https://example.com if you can spot all of them.',
  },
};

export const WithoutLinks: Story = {
  args: {
    children: 'This text does not contain a link.',
  },
};
