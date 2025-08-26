import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Username } from './Username'
import {
  InvalidCountryCode,
  // OneBadge,
  // TwoBadges,
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

  // it('shows one badge', () => {
  //   const { getByTestId } = render(<Username {...OneBadge.args} />)
  //   expect(
  //     getByTestId(`Username: ${OneBadge.args.user.badges[0].name} badge`),
  //   ).toBeInTheDocument()
  // })

  // it('shows two badges', () => {
  //   const { getByTestId } = render(<Username {...TwoBadges.args} />)
  //   expect(
  //     getByTestId(`Username: ${OneBadge.args.user.badges[0].name} badge`),
  //   ).toBeInTheDocument()
  //   expect(
  //     getByTestId(`Username: ${OneBadge.args.user.badges[1].name} badge`),
  //   ).toBeInTheDocument()
  // })
})
