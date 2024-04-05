import { render } from '../tests/utils'
import { Default } from './Breadcrumbs.stories'
import type { BreadcrumbsProps } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as BreadcrumbsProps)} />,
    )

    expect(getByText('Breadcrumbs')).toBeInTheDocument();
  })
})
