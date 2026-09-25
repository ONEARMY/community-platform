import type { Meta, StoryObj } from '@storybook/react-vite';
import Update from './icons/update.svg?react';
import { Alert, AlertDescription, AlertTitle } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'ui/Alert',
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <AlertDescription>An information message</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <AlertDescription>A successful message</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertDescription>A warning message</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertDescription>An error message</AlertDescription>
    </Alert>
  ),
};

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertDescription>A neutral message</AlertDescription>
    </Alert>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Alert variant="info" className="text-left">
      <AlertTitle>Moderator Feedback</AlertTitle>
      <AlertDescription>
        Please add a cover image that shows the topic of the guide.
      </AlertDescription>
    </Alert>
  ),
};

export const WithHeadingTitle: Story = {
  render: () => (
    <Alert variant="info" className="text-left">
      <AlertTitle size="lg">Moderator Feedback</AlertTitle>
      <AlertDescription size="sm">
        Please add a cover image that shows the topic of the guide.
      </AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Alert variant="warning" className="text-left">
      <Update />
      <AlertTitle>Your pin status is awaiting moderation</AlertTitle>
      <AlertDescription>
        Moderator feedback: add a short description of your space.
      </AlertDescription>
    </Alert>
  ),
};

export const DestructiveLong: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertDescription>
        An error message: Veniam explicabo dolor ipsam impedit. Eum eos ut et consequatur eos eaque
        explicabo et inventore. Aperiam aut consequatur sit ut. Iusto consequatur enim placeat enim
        quia voluptas pariatur. Culpa quaerat placeat magni et autem earum placeat deserunt eum. A
        autem enim dolorum. Quo sint nisi vel. Voluptate voluptates alias repudiandae doloribus nemo.
        Quia aperiam nihil magnam quos ut id. Pariatur itaque sint. Id vel aliquid ullam delectus
        animi quis.
      </AlertDescription>
    </Alert>
  ),
};
