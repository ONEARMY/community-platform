import { render, screen } from '@testing-library/react'
import { guidance } from 'src/pages/Library/labels'
import { FactoryCategory } from 'src/test/factories/Category'
import { describe, expect, it } from 'vitest'

import { LibraryCategoryGuidance } from './LibraryCategoryGuidance'
import { LibraryFormProvider } from './LibraryFormProvider'

describe('HowtoCategoryGuidance', () => {
  it('renders expected main content when a category that exists is present', async () => {
    render(
      <LibraryFormProvider>
        <LibraryCategoryGuidance category={FactoryCategory} type="main" />
      </LibraryFormProvider>,
    )

    const guidanceFirstLine = guidance.moulds.main.slice(0, 40)

    await screen.findByText(guidanceFirstLine, { exact: false })
  })

  it('renders nothing when not visible', () => {
    const { container } = render(
      <LibraryFormProvider>
        <LibraryCategoryGuidance category={undefined} type="main" />
      </LibraryFormProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
