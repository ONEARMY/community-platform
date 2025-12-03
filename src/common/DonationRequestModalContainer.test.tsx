import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DonationRequestModalContainer } from './DonationRequestModalContainer';

const mockDonationSettings = {
  spaceName: 'Test Space',
  description: 'Test Description',
  imageUrl: 'https://example.com/image.jpg',
  campaignId: 'test-campaign-123',
};

describe('DonationRequestModalContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render modal when isOpen is false', () => {
    global.fetch = vi.fn();

    render(<DonationRequestModalContainer isOpen={false} onDidDismiss={vi.fn()} />);

    expect(screen.queryByTestId('DonationRequest')).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches settings and renders modal when isOpen is true', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('DonationRequest')).toBeTruthy();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/donation-settings/default');
  });

  it('fetches settings with profileId when provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} profileId={42} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/donation-settings/42');
    });
  });

  it('does not render modal when campaignId is missing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ...mockDonationSettings, campaignId: '' }),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(screen.queryByTestId('DonationRequest')).toBeNull();
  });

  it('renders children inside the modal', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(
      <DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()}>
        <div data-testid="child-content">Child Content</div>
      </DonationRequestModalContainer>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('DonationRequest')).toBeTruthy();
    });

    expect(screen.getByTestId('child-content')).toBeTruthy();
  });

  it('does not refetch settings if already loaded', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    const { rerender } = render(
      <DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('DonationRequest')).toBeTruthy();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    rerender(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('displays the space name in the modal title', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Support ' + mockDonationSettings.spaceName)).toBeTruthy();
    });
  });

  it('displays the description in the modal', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(mockDonationSettings.description)).toBeTruthy();
    });
  });

  it('renders iframe with correct src including campaignId', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      const iframe = screen.getByTestId('donationRequestIframe');
      expect(iframe).toBeTruthy();
      expect(iframe.getAttribute('src')).toBe(
        `https://donorbox.org/embed/${mockDonationSettings.campaignId}?hide_donation_meter=true`,
      );
    });
  });

  it('renders image when imageUrl is provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockDonationSettings),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      const image = screen.getByTestId('donationRequestImage');
      expect(image).toBeTruthy();
      expect(image.getAttribute('src')).toBe('https://example.com/image.jpg');
    });
  });

  it('displays generic title when spaceName is empty', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ...mockDonationSettings, spaceName: '' }),
    });

    render(<DonationRequestModalContainer isOpen={true} onDidDismiss={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Support our work')).toBeTruthy();
    });
  });
});
