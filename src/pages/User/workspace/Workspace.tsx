import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import { getSupportedProfileTypes } from 'src/modules/profile'

const findWorkspaceBadge = (
  workspaceType?: string,
  ifCleanImage?: boolean,
  verifiedUser?: boolean,
): string => {
  if (!workspaceType) {
    return MemberBadge
  }

  const foundProfileTypeObj = getSupportedProfileTypes().find(
    (type) => type.label === workspaceType,
  )
  if (foundProfileTypeObj) {
    if (ifCleanImage) {
      if (verifiedUser && foundProfileTypeObj.cleanImageVerifiedSrc) {
        return foundProfileTypeObj.cleanImageVerifiedSrc
      } else if (foundProfileTypeObj.cleanImageSrc) {
        return foundProfileTypeObj.cleanImageSrc
      }
    }
    if (foundProfileTypeObj.imageSrc) {
      return foundProfileTypeObj.imageSrc
    }
  }

  return MemberBadge
}

export default {
  findWorkspaceBadge,
}
