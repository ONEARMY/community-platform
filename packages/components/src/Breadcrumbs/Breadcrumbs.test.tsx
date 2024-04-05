import { render } from '../tests/utils'
import { Default, Shortened, NoCategory } from './Breadcrumbs.stories'
import type { BreadcrumbsProps } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('validate full breadcrumbs', () => {
    const { getByText } = render(
      <Default {...(Default.args as BreadcrumbsProps)} />,
    )

    expect(getByText('Category')).toBeInTheDocument()
  })

  it('validate shortened breadcrumbs', () => {
    const { getByText } = render(
      <Shortened {...(Shortened.args as BreadcrumbsProps)} />,
    )

    expect(getByText('...')).toBeInTheDocument()
  })

  it('validate no category breadcrumbs', () => {
    const { getAllByRole } = render(
      <NoCategory {...(NoCategory.args as BreadcrumbsProps)} />,
    )

    const chevrons = getAllByRole('img')
    expect(chevrons).toHaveLength(1)
  })
})
