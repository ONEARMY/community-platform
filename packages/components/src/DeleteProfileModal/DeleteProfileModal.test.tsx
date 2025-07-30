import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './DeleteProfileModal.stories'

import type { IProps } from './DeleteProfileModal'

describe('DeleteProfileModal', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Delete account')).toBeInTheDocument()
  })
})
