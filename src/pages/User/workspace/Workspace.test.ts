import { describe, expect, it } from 'vitest'

import Workspace from './Workspace'

describe('findWorkspaceBadgeNullable', () => {
  it('returns a null value', () => {
    expect(Workspace.findWorkspaceBadgeNullable()).toBeNull()
  })

  it('returns null for invalid profile type', () => {
    expect(Workspace.findWorkspaceBadgeNullable('fake')).toBeNull()
  })

  it('returns a profile image', () => {
    expect(Workspace.findWorkspaceBadgeNullable('member')).to.satisfy((image) =>
      image.endsWith('avatar_member_sm.svg'),
    )
  })

  it('returns a "clean" profile image', () => {
    expect(Workspace.findWorkspaceBadgeNullable('member', true)).to.satisfy(
      (image) => image.endsWith('avatar_member_sm.svg'),
    )
  })
})
