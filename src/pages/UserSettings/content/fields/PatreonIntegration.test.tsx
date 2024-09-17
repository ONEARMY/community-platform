import '@testing-library/jest-dom/vitest'

import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CONNECT_BUTTON_TEXT,
  HEADING,
  PatreonIntegration,
  REMOVE_BUTTON_TEXT,
  SUCCESS_MESSAGE,
  SUPPORTER_MESSAGE,
  UPDATE_BUTTON_TEXT,
} from './PatreonIntegration'

import type { IUser } from 'src/models'

const mockUser = {
  userName: 'test',
} as IUser

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
} as unknown as IUser

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
} as unknown as IUser

const mockRemovePatreonConnection = vi.fn()

vi.mock('src/common/hooks/useCommonStores', () => ({
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
      expect(screen.getByText(CONNECT_BUTTON_TEXT)).toBeInTheDocument()
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
  })
})
