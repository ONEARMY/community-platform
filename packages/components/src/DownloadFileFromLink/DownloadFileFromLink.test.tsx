import '@testing-library/jest-dom'

import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Default } from './DownloadFileFromLink.stories'

import type { DownloadFileFromLinkProps } from './DownloadFileFromLink'

describe('DownloadFiles', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as DownloadFileFromLinkProps)} />,
    )

    expect(getByText('Download files')).toBeInTheDocument()
  })
})
