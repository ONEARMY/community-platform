import { render } from '../tests/utils'
import { Default, NoCategory } from './Breadcrumbs.stories'

import type { BreadcrumbsProps } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('validate full breadcrumbs', () => {
    const { getByText, getAllByTestId } = render(
      <Default {...(Default.args as BreadcrumbsProps)} />,
    )

    expect(getByText('Question')).toBeInTheDocument()
    expect(getByText('Category')).toBeInTheDocument()
    expect(getByText('Are we real?')).toBeInTheDocument()
    const chevrons = getAllByTestId('breadcrumbsChevron')
    expect(chevrons).toHaveLength(2)
  })

  it('validate no category breadcrumbs', () => {
    const { getByText, getAllByTestId } = render(
      <NoCategory {...(NoCategory.args as BreadcrumbsProps)} />,
    )

    expect(getByText('Question')).toBeInTheDocument()
    expect(getByText('Are we real?')).toBeInTheDocument()
    const chevrons = getAllByTestId('breadcrumbsChevron')
    expect(chevrons).toHaveLength(1)
  })
})
