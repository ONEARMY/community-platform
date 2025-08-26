import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Member, Space } from './CardProfile.stories'

import type { IProps } from './CardProfile'

describe('CardProfile', () => {
  it('renders the member profile', () => {
    const { getByTestId } = render(<Member {...(Member.args as IProps)} />)

    expect(getByTestId('CardDetailsMemberProfile')).toBeInTheDocument()
  })
  it('renders the space profile', () => {
    const { getByTestId } = render(<Space {...(Space.args as IProps)} />)

    expect(getByTestId('CardDetailsSpaceProfile')).toBeInTheDocument()
  })
})
