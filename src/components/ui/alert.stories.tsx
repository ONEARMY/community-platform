import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'ui/Alert',
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert style={{ width: 420 }}>
      <AlertTitle>Heads up. After this you need to fill in some information.</AlertTitle>
      <AlertDescription>
        A <strong>link to your website</strong> or social media and <strong>pictures</strong> to
        verify that you work with plastic.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" style={{ width: 420 }}>
      <AlertTitle>Your application could not be sent</AlertTitle>
      <AlertDescription>Check your connection and try again.</AlertDescription>
    </Alert>
  ),
};
