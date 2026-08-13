import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders as the page contentinfo landmark', () => {
    const { getByRole } = render(<SiteFooter siteName="Precious Plastic" />);

    expect(getByRole('contentinfo')).toBeInTheDocument();
  });
});
