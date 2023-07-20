import { render } from '../tests/utils'
import type { DownloadFileFromLinkProps } from './DownloadFileFromLink'
import { Default } from './DownloadFileFromLink.stories'

describe('DownloadFiles', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as DownloadFileFromLinkProps)} />,
    )

    expect(getByText('Download files')).toBeInTheDocument()
  })
})
