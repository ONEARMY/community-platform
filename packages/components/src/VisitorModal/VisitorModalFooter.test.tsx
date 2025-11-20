import '@testing-library/jest-dom/vitest';

import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { VisitorModalFooter } from './VisitorModalFooter';

describe('VisitorModalFooter', () => {
  it('shows the contact button', () => {
    const { getByText } = render(<VisitorModalFooter hide={() => {}} />);

    expect(getByText('Contact the space')).toBeInTheDocument();
  });

  it('passes the "contact" target to the hide function on click', () => {
    const hideTrigger = vi.fn();
    const { getByText } = render(<VisitorModalFooter hide={hideTrigger} />);

    act(() => {
      getByText('Contact the space').click();
    });

    expect(hideTrigger).toHaveBeenCalledWith('contact');
  });
});
