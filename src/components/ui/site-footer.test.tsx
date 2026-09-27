import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('renders as the page contentinfo landmark', () => {
    const { getByRole } = render(<SiteFooter siteName="Precious Plastic" />);

    expect(getByRole('contentinfo')).toBeInTheDocument();
  });

  it('names the tenant site alongside the One Army attribution', () => {
    const { getByRole } = render(<SiteFooter siteName="Precious Plastic" />);

    expect(getByRole('contentinfo')).toHaveTextContent(
      'Precious Plastic is a project by One Army.',
    );
  });

  it('opens outbound links safely in a new tab', () => {
    const { getAllByRole } = render(<SiteFooter siteName="Precious Plastic" />);

    const links = getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://onearmy.earth/');
    expect(links[1]).toHaveAttribute('href', 'https://platform.onearmy.earth/');
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('forwards className and footer props', () => {
    const { getByRole } = render(
      <SiteFooter siteName="Precious Plastic" id="site-footer" className="mt-0" />,
    );

    expect(getByRole('contentinfo')).toHaveAttribute('id', 'site-footer');
    expect(getByRole('contentinfo')).toHaveClass('mt-0');
  });
});
