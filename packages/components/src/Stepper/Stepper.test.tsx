import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { Stepper } from './Stepper';

const steps = ['Sign-up', 'Verify email', 'Application form'];

describe('Stepper', () => {
  it('renders all steps', () => {
    const { getByText } = render(<Stepper steps={steps} activeStep={0} />);

    expect(getByText('Sign-up')).toBeInTheDocument();
    expect(getByText('Verify email')).toBeInTheDocument();
    expect(getByText('Application form')).toBeInTheDocument();
  });

  it('highlights the active step', () => {
    const { getByText } = render(<Stepper steps={steps} activeStep={1} />);

    expect(getByText('Verify email')).toHaveStyle({ fontWeight: 'bold' });
    expect(getByText('Application form')).not.toHaveStyle({ fontWeight: 'bold' });
  });
});
