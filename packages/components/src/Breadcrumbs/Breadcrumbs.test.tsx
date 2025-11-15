import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('validate full breadcrumbs', () => {
    const { getByText, getAllByTestId } = render(
      <Breadcrumbs
        steps={[
          {
            text: 'Question',
            link: '/questions',
          },
          {
            text: 'Category',
            link: '/questions?category=Category',
          },
          {
            text: 'Are we real?',
          },
        ]}
      />,
    )

    expect(getByText('Question')).toBeInTheDocument()
    expect(getByText('Category')).toBeInTheDocument()
    expect(getByText('Are we real?')).toBeInTheDocument()
    const chevrons = getAllByTestId('breadcrumbsChevron')
    expect(chevrons).toHaveLength(2)
  })

  it('validate no category breadcrumbs', () => {
    const { getByText, getAllByTestId } = render(
      <Breadcrumbs
        steps={[
          {
            text: 'Question',
            link: '/questions',
          },
          {
            text: 'Are we real?',
          },
        ]}
      />,
    )

    expect(getByText('Question')).toBeInTheDocument()
    expect(getByText('Are we real?')).toBeInTheDocument()
    const chevrons = getAllByTestId('breadcrumbsChevron')
    expect(chevrons).toHaveLength(1)
  })
})
