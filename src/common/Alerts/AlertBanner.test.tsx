import '@testing-library/jest-dom/vitest';

import { render, screen, waitFor } from '@testing-library/react';
import { bannerService } from 'src/pages/common/banner.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AlertBanner } from './AlertBanner';

describe('AlertBanner', () => {
  const mockBanner = {
    id: 1,
    text: 'Test Banner',
    url: 'https://example.com',
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  beforeEach(() => {
    vi.spyOn(bannerService, 'getBanner').mockResolvedValue(mockBanner);
  });

  it('renders banner text', async () => {
    render(<AlertBanner />);
    await waitFor(() => {
      expect(screen.getByText('Test Banner')).toBeInTheDocument();
    });
  });

  it('renders link when url is present', async () => {
    render(<AlertBanner />);
    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });

  it('renders text when url is not present', async () => {
    vi.spyOn(bannerService, 'getBanner').mockResolvedValue({
      id: 1,
      text: 'text no url',
      url: '',
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    render(<AlertBanner />);
    await waitFor(() => {
      expect(screen.getByText('text no url')).toBeInTheDocument();
    });
  });

  it('renders nothing if no banner text', async () => {
    vi.spyOn(bannerService, 'getBanner').mockResolvedValue({
      id: 1,
      text: '',
      url: '',
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    const { container } = render(<AlertBanner />);
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});
