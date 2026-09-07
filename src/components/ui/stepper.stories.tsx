import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './stepper';

const meta: Meta<typeof Stepper> = {
  title: 'ui/Stepper',
  component: Stepper,
};
export default meta;

type Story = StoryObj<typeof Stepper>;

const steps = ['Sign-up', 'Verify email', 'Application form'];

export const FirstStep: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Stepper steps={steps} activeStep={0} />
    </div>
  ),
};

export const MiddleStep: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Stepper steps={steps} activeStep={1} />
    </div>
  ),
};

export const LastStep: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Stepper steps={steps} activeStep={2} />
    </div>
  ),
};
