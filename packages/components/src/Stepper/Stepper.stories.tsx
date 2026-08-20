import { Stepper } from './Stepper';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/Stepper',
  component: Stepper,
} as Meta<typeof Stepper>;

const steps = ['Sign-up', 'Verify email', 'Application form'];

export const FirstStep: StoryFn<typeof Stepper> = () => <Stepper steps={steps} activeStep={0} />;

export const MiddleStep: StoryFn<typeof Stepper> = () => <Stepper steps={steps} activeStep={1} />;

export const LastStep: StoryFn<typeof Stepper> = () => <Stepper steps={steps} activeStep={2} />;
