import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
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
