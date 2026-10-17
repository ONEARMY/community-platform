import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FlagIcon } from './flag-icon';

describe('FlagIcon', () => {
  it('renders the flag image for the country code', () => {
    const { getByTitle } = render(<FlagIcon countryCode="NL" />);

    const flag = getByTitle('NL');
    expect(flag).toHaveAttribute('data-cy', 'country:NL');
    expect(flag.getAttribute('src')).toMatch(/\/nl\.svg$/);
  });

  it('renders at the default size', () => {
    const { getByTitle } = render(<FlagIcon countryCode="NL" />);

    expect(getByTitle('NL')).toHaveStyle({ width: '21px', height: '14px' });
  });

  it('renders at the small size', () => {
    const { getByTitle } = render(<FlagIcon countryCode="NL" size="sm" />);

    expect(getByTitle('NL')).toHaveStyle({ width: '14px', height: '9px' });
  });
});
