import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './CategoryVerticalList.stories'

import type { IProps } from './CategoryVerticalList'

describe('CategoryVerticalList', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('CategoryVerticalList')).toBeInTheDocument()
  })
})
