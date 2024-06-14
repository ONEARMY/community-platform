import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './DownloadButton.stories'

import type { IProps } from './DownloadButton'

describe('DownloadButton', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Download files')).toBeInTheDocument()
  })
})
