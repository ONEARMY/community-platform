import { ProfileTypeList } from 'oa-shared'

import type { IUserDB } from 'oa-shared'

const nonMemberProfileTypes = Object.values(ProfileTypeList).filter(
  (type) => type !== 'member',
)

export const isProfileComplete = (user: IUserDB): boolean => {
  const { about, coverImages, displayName, userImage } = user

  const isBasicInfoFilled = !!(about && displayName)

  const isMember = user.profileType === ProfileTypeList.MEMBER
  const isSpace = !!nonMemberProfileTypes.find(
    (type) => type === user.profileType,
  )

  const isMemberFilled = isMember && !!userImage?.downloadUrl
  const isSpaceFilled = isSpace && coverImages && !!coverImages[0]?.downloadUrl

  return isBasicInfoFilled && (isMemberFilled || isSpaceFilled)
}
