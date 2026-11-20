import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './stepper';

const steps = ['Sign-up', 'Verify email', 'Application form'];

describe('Stepper', () => {
  it('renders all steps', () => {
    const { getByText } = render(<Stepper steps={steps} activeStep={0} />);

    for (const step of steps) {
      expect(getByText(step)).toBeInTheDocument();
    }
  });

  it('highlights only the active step', () => {
    const { getByText } = render(<Stepper steps={steps} activeStep={1} />);

    expect(getByText('Verify email')).toHaveClass('font-bold');
    expect(getByText('Sign-up')).not.toHaveClass('font-bold');
    expect(getByText('Application form')).not.toHaveClass('font-bold');
  });

  it('marks steps up to the active one as reached', () => {
    const { getByText } = render(<Stepper steps={steps} activeStep={1} />);

    expect(getByText('Sign-up')).toHaveClass('text-foreground');
    expect(getByText('Verify email')).toHaveClass('text-foreground');
    expect(getByText('Application form')).toHaveClass('text-muted-foreground');
  });
});
