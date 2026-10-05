import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { InformationTooltip } from './information-tooltip';

describe('InformationTooltip', () => {
  it('renders a focusable trigger labelled with the tooltip text', () => {
    const { getByLabelText } = render(<InformationTooltip tooltip="Some helpful info" />);

    expect(getByLabelText('Some helpful info')).toHaveAttribute('tabindex', '0');
  });

  it('shows the tooltip text when the trigger receives keyboard focus', async () => {
    const { findByText } = render(<InformationTooltip tooltip="Some helpful info" />);

    await userEvent.tab();

    expect(await findByText('Some helpful info')).toBeInTheDocument();
  });
});
