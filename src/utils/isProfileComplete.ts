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
