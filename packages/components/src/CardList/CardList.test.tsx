import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { EMPTY_LIST, type IProps } from './CardList'
import {
  Default,
  FiltedDisplay,
  WhenFiltedDisplayIsZero,
} from './CardList.stories'

describe('CardList', () => {
  it('Shows all items when no filtering is done', () => {
    const { getAllByTestId } = render(<Default {...(Default.args as IProps)} />)

    expect(getAllByTestId('CardListItem').length).toBe(4)
  })

  it('Shows only filted items when provided', () => {
    const { getAllByTestId } = render(
      <FiltedDisplay {...(FiltedDisplay.args as IProps)} />,
    )

    expect(getAllByTestId('CardListItem').length).toBe(2)
  })

  it('Shows the no items label when filted items is empty', () => {
    const { getByText } = render(
      <WhenFiltedDisplayIsZero {...(WhenFiltedDisplayIsZero.args as IProps)} />,
    )

    expect(getByText(EMPTY_LIST)).toBeInTheDocument()
  })
})
