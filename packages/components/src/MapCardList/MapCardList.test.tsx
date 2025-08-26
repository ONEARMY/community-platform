import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { EMPTY_LIST, type IProps } from './MapCardList'
import { Default, WhenDisplayIsZero } from './MapCardList.stories'

describe('CardList', () => {
  it('Shows all items when no filtering is done', () => {
    const { getAllByTestId } = render(<Default {...(Default.args as IProps)} />)

    expect(getAllByTestId('CardListItem').length).toBe(4)
  })

  it('Shows the no item label when filted items is empty', () => {
    const { getByText } = render(
      <WhenDisplayIsZero {...(WhenDisplayIsZero.args as IProps)} />,
    )

    expect(getByText(EMPTY_LIST)).toBeInTheDocument()
  })
})
