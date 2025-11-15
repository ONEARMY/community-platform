import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { DownloadButton } from './DownloadButton'

describe('DownloadButton', () => {
  it('renders the default state', () => {
    const { getByText } = render(<DownloadButton onClick={() => {}} />)

    expect(getByText('Download files')).toBeInTheDocument()
  })

  it('renders the custom options', () => {
    const { getByText } = render(
      <DownloadButton
        onClick={() => {}}
        glyph="download-cloud"
        label="Hello there"
      />,
    )

    expect(getByText('Hello there')).toBeInTheDocument()
  })
})
