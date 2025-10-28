import type { Profile } from 'oa-shared'

export const isProfileComplete = (user: Partial<Profile>): boolean => {
  const { about, coverImages, displayName, photo } = user

  const isBasicInfoFilled = !!(about && displayName)

  const isMember = user.type?.name === 'member'
  const isSpace = !isMember

  const isMemberFilled = isMember && !!photo?.id
  const isSpaceFilled = isSpace && !!coverImages && !!coverImages[0]?.publicUrl

  return isBasicInfoFilled && (isMemberFilled || isSpaceFilled)
}

export const getMissingProfileFields = (user: Partial<Profile>): string[] => {
  const { about, coverImages, displayName, photo } = user
  const missing: string[] = []

  if (!displayName) {
    missing.push('Display name')
  }

  if (!about) {
    missing.push('About')
  }

  const isMember = user.type?.name === 'member'

  if (isMember && !photo?.id) {
    missing.push('Profile photo')
  } else if (!isMember && (!coverImages || !coverImages[0]?.publicUrl)) {
    missing.push('Cover image')
  }

  return missing
}
