import { ProfileTypeList } from 'oa-shared'

import type { Profile } from 'oa-shared'

const nonMemberProfileTypes = Object.values(ProfileTypeList).filter(
  (type) => type !== 'member',
)

export const isProfileComplete = (user: Partial<Profile>): boolean => {
  const { about, coverImages, displayName, photo } = user

  const isBasicInfoFilled = !!(about && displayName)

  const isMember = user.type === ProfileTypeList.MEMBER
  const isSpace = !!nonMemberProfileTypes.find((type) => type === user.type)

  const isMemberFilled = isMember && !!photo?.id
  const isSpaceFilled = isSpace && !!coverImages && !!coverImages[0]?.publicUrl

  return isBasicInfoFilled && (isMemberFilled || isSpaceFilled)
}
