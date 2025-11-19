import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { fakePinProfile, fakeProfileType } from '../utils'
import { CardProfile } from './CardProfile'

import type { MapPin, PinProfile } from 'oa-shared'

describe('CardProfile', () => {
  it('renders the member profile', () => {
    const member: PinProfile = fakePinProfile()
    const { getByTestId } = render(
      <CardProfile item={{ profile: member } as MapPin} />,
    )

    expect(getByTestId('CardDetailsMemberProfile')).toBeInTheDocument()
  })
  it('renders the space profile', () => {
    const space: PinProfile = fakePinProfile({
      type: fakeProfileType({ isSpace: true }),
    })
    const { getByTestId } = render(
      <CardProfile item={{ profile: space } as MapPin} />,
    )

    expect(getByTestId('CardDetailsSpaceProfile')).toBeInTheDocument()
  })
})
