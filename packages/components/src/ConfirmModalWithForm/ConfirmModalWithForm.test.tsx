import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './ConfirmModalWithForm.stories'

import type { IProps } from './ConfirmModalWithForm'

describe('ConfirmModalWithForm', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('ConfirmModalWithForm')).toBeInTheDocument()
  })
})
