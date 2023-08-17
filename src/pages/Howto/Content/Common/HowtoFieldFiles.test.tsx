import { render, screen } from '@testing-library/react'
import { HowtoProvider } from 'src/test/components'

import { HowtoFieldFiles } from '.'

describe('HowtoFieldFiles', () => {
  it('renders', async () => {
    const props = {
      fileEditMode: true,
      files: [],
      onClick: jest.fn(),
      showInvalidFileWarning: false,
    }

    render(
      <HowtoProvider>
        <HowtoFieldFiles {...props} />
      </HowtoProvider>,
    )

    await screen.findByText(
      'Do you have supporting files to help others replicate your How-to?',
    )
  })
  // Will add behavioural test when #2698 is merged in:
  // - File editmode
  // - onClick called on click
  // - Show error message
})
