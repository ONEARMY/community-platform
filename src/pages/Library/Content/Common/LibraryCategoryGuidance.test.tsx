import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { guidance } from '../../labels'
import { LibraryCategoryGuidance } from './LibraryCategoryGuidance'
import { LibraryFormProvider } from './LibraryFormProvider'

describe('LibraryCategoryGuidance', () => {
  it('renders expected main content when a category that exists is present', async () => {
    render(
      <LibraryFormProvider>
        <LibraryCategoryGuidance
          category={{
            id: 1,
            createdAt: faker.date.past(),
            modifiedAt: faker.date.past(),
            name: 'Moulds',
            type: 'projects',
          }}
          type="main"
        />
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
