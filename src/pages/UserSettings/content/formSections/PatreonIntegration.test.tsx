import * as React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PatreonIntegration } from './PatreonIntegration' // Adjust the import path accordingly

jest.mock('src/index', () => ({
  useCommonStores: () => ({
    stores: {
      userStore: {
        user: {
          userName: 'testUser',
          patreon: {
            attributes: {
              thumb_url: 'testThumbUrl',
            },
            membership: {
              tiers: [
                {
                  id: 'testTierId',
                  attributes: {
                    image_url: 'testImageUrl',
                    title: 'Test Tier',
                  },
                },
              ],
            },
          },
        },
        removePatreonConnection: jest.fn(),
      },
    },
  }),
}))

describe('PatreonIntegration', () => {
  it('renders correctly', () => {
    render(<PatreonIntegration />)
    expect(screen.getByText('❤️ Become a Supporter')).toBeInTheDocument()
  })

  it('displays the connected Patreon account information', () => {
    render(<PatreonIntegration />)
    expect(
      screen.getByText('Successfully linked Patreon account!'),
    ).toBeInTheDocument()
    expect(screen.getByText('Update Patreon Data')).toBeInTheDocument()
    expect(screen.getByText('Remove Connection')).toBeInTheDocument()
  })

  it('calls removePatreonConnection when "Remove Connection" button is clicked', async () => {
    render(<PatreonIntegration />)
    await act(async () => {
      fireEvent.click(screen.getByText('Remove Connection'))
    })
    expect(
      screen.getByText(
        'Support us on Patreon to get a badge here on the platform and special insights and voting rights on decisions.',
      ),
    ).toBeInTheDocument()
  })
})
