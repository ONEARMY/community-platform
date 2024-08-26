import { ProfileTypeList } from 'oa-shared'
import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import CollectionHighlight from 'src/assets/images/highlights/highlight-collection-point.svg'
import LocalCommunityHighlight from 'src/assets/images/highlights/highlight-local-community.svg'
import MachineHighlight from 'src/assets/images/highlights/highlight-machine-shop.svg'
import MemberHighlight from 'src/assets/images/highlights/highlight-member.svg'
import WorkspaceHighlight from 'src/assets/images/highlights/highlight-workspace.svg'
import { getSupportedProfileTypes } from 'src/modules/profile'

import type { PlatformTheme } from 'oa-themes'

const findWordspaceHighlight = (workspaceType?: string): string => {
  switch (workspaceType) {
    case ProfileTypeList.WORKSPACE:
      return WorkspaceHighlight
    case ProfileTypeList.MEMBER:
      return MemberHighlight
    case ProfileTypeList.MACHINE_BUILDER:
      return MachineHighlight
    case ProfileTypeList.COMMUNITY_BUILDER:
      return LocalCommunityHighlight
    case ProfileTypeList.COLLECTION_POINT:
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
