import '@testing-library/jest-dom/vitest';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CONNECT_BUTTON_TEXT,
  HEADING,
  PatreonIntegration,
  REMOVE_BUTTON_TEXT,
  SUCCESS_MESSAGE,
  SUPPORTER_MESSAGE,
  UPDATE_BUTTON_TEXT,
} from './PatreonIntegration';

import type { IPatreonUser } from 'oa-shared';
import type { Mock } from 'vitest';
import { TenantContext } from 'src/pages/common/TenantContext';

// Mock setup first (hoisted to the top by Vitest)
vi.mock('src/services/patreonService', () => {
  return {
    patreonService: {
      getCurrentUserPatreon: vi.fn(),
      disconnectUserPatreon: vi.fn(),
    },
  };
});

// Import the mocked service *after* vi.mock()
import { patreonService } from 'src/services/patreonService';

const mockTenantContext = {
  patreonId: 'mock-patreon-client-id',
  siteName: 'Test Site',
  siteUrl: 'https://test.com',
  messageSignOff: 'Test',
  emailFrom: 'test@test.com',
  siteImage: 'test.png',
  noMessaging: false,
  libraryHeading: 'Library',
  academyResource: 'Academy',
  profileGuidelines: 'Guidelines',
  questionsGuidelines: 'Questions',
  supportedModules: 'modules',
  environment: {},
};

const renderWithTenantContext = (component: React.ReactNode) => {
  return render(<TenantContext.Provider value={mockTenantContext}>{component}</TenantContext.Provider>);
};

const MOCK_PATREON_TIER_TITLE = 'Patreon Tier Title';
const mockPatreonSupporter = {
  isSupporter: true,
  patreon: {
    attributes: {
      thumb_url: 'https://patreon.com',
    },
    membership: {
      tiers: [
        {
          id: '123',
          attributes: {
            title: MOCK_PATREON_TIER_TITLE,
            image_url: 'https://patreon.com',
          },
        },
      ],
    },
  } as IPatreonUser,
};

const WRONG_PATREON_TIER_TITLE = 'Wrong Patreon Tier Title';
const mockPatreonNotSupporter = {
  isSupporter: false,
  patreon: {
    attributes: {
      thumb_url: 'https://patreon.com',
    },
    membership: {
      tiers: [
        {
          id: '456',
          attributes: {
            title: WRONG_PATREON_TIER_TITLE,
            image_url: 'https://patreon.com',
          },
        },
      ],
    },
  } as IPatreonUser,
};

describe('PatreonIntegration', () => {
  describe('not connected', () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      // Return null or undefined to simulate not connected
      (patreonService.getCurrentUserPatreon as Mock).mockResolvedValue(null);

      await act(async () => {
        renderWithTenantContext(<PatreonIntegration />);
      });
    });

    it('renders correctly', () => {
      expect(screen.getByText(HEADING)).toBeInTheDocument();
      expect(screen.getByText(CONNECT_BUTTON_TEXT)).toBeInTheDocument();
    });
  });

  describe('not supporter', () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      (patreonService.getCurrentUserPatreon as Mock).mockResolvedValue(mockPatreonNotSupporter);

      await act(async () => {
        renderWithTenantContext(<PatreonIntegration />);
      });
    });

    it('displays the connected Patreon account information and buttons', () => {
      expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText(UPDATE_BUTTON_TEXT)).toBeInTheDocument();
      expect(screen.getByText(REMOVE_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('does not display supporter message or invalid tier', () => {
      expect(screen.queryByText(SUPPORTER_MESSAGE)).not.toBeInTheDocument();
      expect(screen.queryByText(WRONG_PATREON_TIER_TITLE)).not.toBeInTheDocument();
    });
  });

  describe('with supporter', () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      (patreonService.getCurrentUserPatreon as Mock).mockReturnValue(mockPatreonSupporter);
      await act(async () => {
        renderWithTenantContext(<PatreonIntegration />);
      });
    });

    it('displays the connected Patreon account information and buttons', () => {
      expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText(SUPPORTER_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText('Patreon Tier Title')).toBeInTheDocument();
      expect(screen.getByText(UPDATE_BUTTON_TEXT)).toBeInTheDocument();
      expect(screen.getByText(REMOVE_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('calls removePatreonConnection when "Remove Connection" button is clicked', async () => {
      await act(async () => {
        fireEvent.click(screen.getByText(REMOVE_BUTTON_TEXT));
      });
      expect(patreonService.disconnectUserPatreon).toHaveBeenCalled();
    });
  });

  describe('without patreonId', () => {
    it('does not render when patreonId is not provided', () => {
      const contextWithoutPatreonId = {
        ...mockTenantContext,
        patreonId: '',
      };

      const { container } = render(
        <TenantContext.Provider value={contextWithoutPatreonId}>
          <PatreonIntegration />
        </TenantContext.Provider>,
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText(HEADING)).not.toBeInTheDocument();
    });
  });
});
