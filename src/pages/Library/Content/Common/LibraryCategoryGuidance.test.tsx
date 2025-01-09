import { render, screen } from '@testing-library/react'
import { guidance } from 'src/pages/Library/labels'
import { FactoryCategory } from 'src/test/factories/Category'
import { describe, expect, it } from 'vitest'

import { HowtoCategoryGuidance } from './LibraryCategoryGuidance'
import { HowtoFormProvider } from './LibraryFormProvider'

describe('HowtoCategoryGuidance', () => {
  it('renders expected main content when a category that exists is present', async () => {
    render(
      <HowtoFormProvider>
        <HowtoCategoryGuidance category={FactoryCategory} type="main" />
      </HowtoFormProvider>,
    )

    const guidanceFirstLine = guidance.moulds.main.slice(0, 40)

    await screen.findByText(guidanceFirstLine, { exact: false })
  })

  it('renders expected files content when a category that exists is present', async () => {
    render(
      <HowtoFormProvider>
        <HowtoCategoryGuidance category={FactoryCategory} type="files" />
      </HowtoFormProvider>,
    )

    const filesGuidance = guidance.moulds.files

    await screen.findByText(filesGuidance, { exact: false })
  })

  it('renders nothing when not visible', () => {
    const { container } = render(
      <HowtoFormProvider>
        <HowtoCategoryGuidance category={undefined} type="main" />
      </HowtoFormProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
