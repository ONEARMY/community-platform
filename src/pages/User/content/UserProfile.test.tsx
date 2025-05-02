import { render, screen } from '@testing-library/react'
import { useLocation } from '@remix-run/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it, Mock, vi } from 'vitest'

import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { UserProfile } from './UserProfile'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@theme-ui/core'

const Theme = testingThemeStyles

vi.mock('src/common/hooks/useCommonStores', () => {
  return {
    useCommonStores: () => ({
      stores: {
        userStore: {
          getUserEmail: () => vi.fn().mockReturnValue('Bob@email.com'),
          activeUser: () => vi.fn().mockReturnValue(true),
        },
      },
    }),
  }
})

vi.mock('@remix-run/react', async () => ({
  ...(await vi.importActual('@remix-run/react')),
  useLocation: vi.fn(),
}))

describe('UserContactForm', () => {
  const profileUser = FactoryUser({ isContactableByPublic: true })
  ;(useLocation as Mock).mockImplementation(() => ({
    pathname: '/initial',
  }))

  it("Don't render contact tab if seeing own profile", () => {
    const { container } = render(
      <Provider {...useCommonStores().stores}>
        <BrowserRouter>
          <ThemeProvider theme={Theme}>
            <UserProfile
              user={profileUser}
              isViewingOwnProfile={true}
              docs={{ library: [], research: [] }}
            ></UserProfile>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>,
    )
    expect(container.innerHTML).not.contains('contact-tab')
  })
})
