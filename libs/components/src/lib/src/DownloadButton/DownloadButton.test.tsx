import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { CustomDetails, Default } from './DownloadButton.stories'

import type { IProps } from './DownloadButton'

describe('DownloadButton', () => {
  it('renders the default state', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Download files')).toBeInTheDocument()
  })

  it('renders the custom options', () => {
    const { getByText } = render(
      <CustomDetails {...(CustomDetails.args as IProps)} />,
    )

    expect(getByText('Hello there')).toBeInTheDocument()
  })
})
