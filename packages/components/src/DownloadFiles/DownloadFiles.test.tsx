import { render } from '../tests/utils'
import type { DownloadFilesProps } from './DownloadFiles'
import { Default } from './DownloadFiles.stories'

describe('DownloadFiles', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as DownloadFilesProps)} />,
    )

    expect(getByText('Download files')).toBeInTheDocument()
  })
})
