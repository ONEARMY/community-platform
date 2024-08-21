import '@testing-library/jest-dom/vitest'

import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { CardListItem } from './CardListItem'

import type { IProfileTypeName } from 'oa-shared'

describe('ContentStatistics', () => {
  it('contains the views, star, comment and update icons', () => {
    const item = {
      _id: 'more-cheese-gromit',
      type: 'member' as IProfileTypeName,
    }
    const onClick = vi.fn()

    const { getByTestId } = render(
      <CardListItem item={item} onClick={onClick} />,
    )

    fireEvent.click(getByTestId('CardListItem'))

    expect(onClick).toHaveBeenCalled()
  })
})
