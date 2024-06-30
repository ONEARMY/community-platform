import '@testing-library/jest-dom/vitest'

import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CONNECT_BUTTON_TEXT,
  HEADING,
  ONE_ARMY_PATREON_URL,
  PatreonIntegration,
  REMOVE_BUTTON_TEXT,
  SUCCESS_MESSAGE,
  SUPPORTER_MESSAGE,
  UPDATE_BUTTON_TEXT,
} from './PatreonIntegration'

import type { IUserPP } from '../../../../models'

const mockUser = {
  userName: 'test',
} as IUserPP

const MOCK_PATREON_TIER_TITLE = 'Patreon Tier Title'
const mockPatreonSupporter = {
  ...mockUser,
  badges: {
    supporter: true,
  },
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
  },
} as unknown as IUserPP

const WRONG_PATREON_TIER_TITLE = 'Wrong Patreon Tier Title'
const mockPatreonNotSupporter = {
  ...mockUser,
  badges: {
    supporter: false,
  },
  patreon: {
    attributes: {
      thumb_url: 'https://patreon.com',
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
    membership: {
      tiers: [],
    },
  },
} as unknown as IUserPP

const mockRemovePatreonConnection = vi.fn()

vi.mock('../../../../common/hooks/useCommonStores', () => ({
  useCommonStores: () => ({
    stores: {
      userStore: {
        removePatreonConnection: mockRemovePatreonConnection,
      },
    },
  }),
}))

describe('PatreonIntegration', () => {
  describe('not connected', () => {
    beforeEach(() => {
      render(<PatreonIntegration user={mockUser} />)
    })

    it('renders correctly', () => {
      expect(screen.getByText(HEADING)).toBeInTheDocument()
    })

    it('displays instructions on how to connect and connect button', () => {
      expect(screen.getByText(CONNECT_BUTTON_TEXT)).toBeInTheDocument()
      expect(
        screen.getByText((t) =>
          t.includes('Connect your Patreon account by clicking below'),
        ),
      ).toBeInTheDocument()
    })

    it('links to one army patreon page', () => {
      expect(screen.getByTestId('patreon-link')).toBeInTheDocument()
    })
  })

  describe('with supporter', () => {
    beforeEach(() => {
      render(<PatreonIntegration user={mockPatreonSupporter} />)
    })

    it('displays the connected Patreon account information and buttons', () => {
      expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument()
      expect(screen.getByText(SUPPORTER_MESSAGE)).toBeInTheDocument()
      expect(screen.getByText('Patreon Tier Title')).toBeInTheDocument()
      expect(screen.getByText(UPDATE_BUTTON_TEXT)).toBeInTheDocument()
      expect(screen.getByText(REMOVE_BUTTON_TEXT)).toBeInTheDocument()
    })

    it('calls removePatreonConnection when "Remove Connection" button is clicked', () => {
      act(() => {
        fireEvent.click(screen.getByText(REMOVE_BUTTON_TEXT))
      })
      expect(mockRemovePatreonConnection).toHaveBeenCalledWith(
        mockUser.userName,
      )
      expect(screen.getByText(CONNECT_BUTTON_TEXT)).toBeInTheDocument()
    })
  })

  describe('not supporter', () => {
    beforeEach(() => {
      render(<PatreonIntegration user={mockPatreonNotSupporter} />)
    })

    it('displays the connected Patreon account information and buttons', () => {
      expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument()
      expect(screen.getByText(UPDATE_BUTTON_TEXT)).toBeInTheDocument()
      expect(screen.getByText(REMOVE_BUTTON_TEXT)).toBeInTheDocument()
    })

    it('does not display supporter message or invalid tier', () => {
      expect(screen.queryByText(SUPPORTER_MESSAGE)).not.toBeInTheDocument()
      expect(
        screen.queryByText(WRONG_PATREON_TIER_TITLE),
      ).not.toBeInTheDocument()
    })

    it('displays become a supporter message', () => {
      expect(
        screen.getByText((t) =>
          t.includes(
            'It looks like you are not an active supporter of this project.',
          ),
        ),
      ).toBeInTheDocument()
    })
  })
})
