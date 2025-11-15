import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DownloadWrapper } from './DownloadWrapper'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockedUsedNavigate,
}))

vi.mock('./UserAction', () => ({
  UserAction: ({ loggedOut }: { loggedOut: React.ReactNode }) => (
    <>{loggedOut}</>
  ),
}))

vi.mock('src/common/hooks/useCommonStores', () => ({
  __esModule: true,
  useCommonStores: vi.fn(),
}))

describe('DownloadWrapper', () => {
  it('renders DownloadButton with isLoggedIn=false and shows DownloadCounter', () => {
    render(
      <DownloadWrapper
        fileDownloadCount={42}
        fileLink="https://example.com/file.pdf"
        files={[]}
      />,
    )

    expect(screen.getByText('Download files')).toBeInTheDocument()
    expect(screen.getByText('42 downloads')).toBeInTheDocument()
  })
})
