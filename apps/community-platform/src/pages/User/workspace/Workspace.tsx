// assets profileType
import MemberBadge from '../../../assets/images/badges/pt-member.svg'
// Highlights
import CollectionHighlight from '../../../assets/images/highlights/highlight-collection-point.svg'
import LocalCommunityHighlight from '../../../assets/images/highlights/highlight-local-community.svg'
import MachineHighlight from '../../../assets/images/highlights/highlight-machine-shop.svg'
import MemberHighlight from '../../../assets/images/highlights/highlight-member.svg'
import WorkspaceHighlight from '../../../assets/images/highlights/highlight-workspace.svg'
import { getSupportedProfileTypes } from '../../../modules/profile'
import { ProfileType } from '../../../modules/profile/types'

import type { PlatformTheme } from '@onearmy.apps/themes'

const findWordspaceHighlight = (workspaceType?: string): string => {
  switch (workspaceType) {
    case ProfileType.WORKSPACE:
      return WorkspaceHighlight
    case ProfileType.MEMBER:
      return MemberHighlight
    case ProfileType.MACHINE_BUILDER:
      return MachineHighlight
    case ProfileType.COMMUNITY_BUILDER:
      return LocalCommunityHighlight
    case ProfileType.COLLECTION_POINT:
      return CollectionHighlight
    default:
      return MemberHighlight
  }
}

const findWorkspaceBadgeNullable = (
  workspaceType?: string,
  useCleanImage?: boolean,
): string | null => {
  if (!workspaceType) {
    return null
  }

  const foundProfileTypeObj = getSupportedProfileTypes().find(
    (type) => type.label === workspaceType,
  )

  if (!foundProfileTypeObj) {
    return null
  }

  if (useCleanImage && foundProfileTypeObj.cleanImageSrc) {
    return foundProfileTypeObj.cleanImageSrc
  }

  return foundProfileTypeObj.imageSrc || null
}

const findWorkspaceBadge = (
  workspaceType?: string,
  ifCleanImage?: boolean,
  verifiedUser?: boolean,
  currentTheme?: PlatformTheme,
): string => {
  if (!workspaceType) {
    return MemberBadge
  }

  const foundProfileTypeObj = getSupportedProfileTypes(currentTheme).find(
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
  findWordspaceHighlight,
  findWorkspaceBadge,
  findWorkspaceBadgeNullable,
}
