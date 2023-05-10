import type { DownloadFilesProps } from './DownloadFiles'
import { Default } from './DownloadFiles.stories'
import { render } from '../tests/utils'

describe('DownloadFiles', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as DownloadFilesProps)} />,
    )

    expect(getByText('Download files')).toBeInTheDocument()
  })
})
