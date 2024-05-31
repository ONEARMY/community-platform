import '@testing-library/jest-dom'

import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Username } from './Username'
import {
  InvalidCountryCode,
  UnverifiedSupporter,
  Verified,
  VerifiedSupporter,
  WithoutFlag,
} from './Username.stories'

describe('Username', () => {
  it('shows an unknown flag for empty value', () => {
    const { getByTestId } = render(<Username {...WithoutFlag.args} />)

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })

  it('shows an unknown flag for an invalid country code', () => {
    const { getByTestId } = render(<Username {...InvalidCountryCode.args} />)

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })

  it('shows a verified badge when the user is verified', () => {
    const { getByTestId } = render(<Username {...Verified.args} />)
    expect(getByTestId('Username: verified badge')).toBeInTheDocument()
  })

  it('shows a supporter badge when the user is a supporter and also unverified', () => {
    const { getByTestId } = render(<Username {...UnverifiedSupporter.args} />)
    expect(getByTestId('Username: supporter badge')).toBeInTheDocument()
  })

  it('shows a verified badge when the user is verified and also a supporter', () => {
    const { getByTestId } = render(<Username {...VerifiedSupporter.args} />)
    expect(getByTestId('Username: verified badge')).toBeInTheDocument()
  })
})
