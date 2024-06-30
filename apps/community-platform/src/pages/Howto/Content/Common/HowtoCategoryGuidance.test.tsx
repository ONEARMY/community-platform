import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { guidance } from '../../../../pages/Howto/labels'
import { HowtoProvider } from '../../../../test/components'
import { FactoryCategory } from '../../../../test/factories/Category'
import { HowtoCategoryGuidance } from './HowtoCategoryGuidance'

describe('HowtoCategoryGuidance', () => {
  it('renders expected main content when a category that exists is present', async () => {
    render(
      <HowtoProvider>
        <HowtoCategoryGuidance category={FactoryCategory} type="main" />
      </HowtoProvider>,
    )

    const guidanceFirstLine = guidance.moulds.main.slice(0, 40)

    await screen.findByText(guidanceFirstLine, { exact: false })
  })

  it('renders expected files content when a category that exists is present', async () => {
    render(
      <HowtoProvider>
        <HowtoCategoryGuidance category={FactoryCategory} type="files" />
      </HowtoProvider>,
    )

    const filesGuidance = guidance.moulds.files

    await screen.findByText(filesGuidance, { exact: false })
  })

  it('renders nothing when not visible', () => {
    const { container } = render(
      <HowtoProvider>
        <HowtoCategoryGuidance category={undefined} type="main" />
      </HowtoProvider>,
    )

    expect(container.innerHTML).toBe('')
  })
})
