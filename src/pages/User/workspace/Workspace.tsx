import { PROFILE_TYPES } from 'src/mocks/user_pp.mock'

// Highlights
import CollectionHighlight from 'src/assets/images/highlights/highlight-collection-point.svg'
import LocalCommunityHighlight from 'src/assets/images/highlights/highlight-local-community.svg'
import MachineHighlight from 'src/assets/images/highlights/highlight-machine-shop.svg'
import WorkspaceHighlight from 'src/assets/images/highlights/highlight-workspace.svg'
import MemberHighlight from 'src/assets/images/highlights/highlight-member.svg'

// assets profileType
import MemberBadge from 'src/assets/images/badges/pt-member.svg'

function findWordspaceHighlight(workspaceType?: string): string {
  switch (workspaceType) {
    case 'workspace':
      return WorkspaceHighlight
    case 'member':
      return MemberHighlight
    case 'machine-builder':
      return MachineHighlight
    case 'community-builder':
      return LocalCommunityHighlight
    case 'collection-point':
      return CollectionHighlight
    default:
      return MemberHighlight
  }
}

function findWorkspaceBadgeNullable(
  workspaceType?: string,
  useCleanImage?: boolean,
): string | null {
  if (!workspaceType) {
    return null
  }

  const foundProfileTypeObj = PROFILE_TYPES.find(
    type => type.label === workspaceType,
  )

  if (!foundProfileTypeObj) {
    return null
  }
  
  if (useCleanImage && foundProfileTypeObj.cleanImageSrc) {
    return foundProfileTypeObj.cleanImageSrc
  }

  return foundProfileTypeObj.imageSrc || null
}

function findWorkspaceBadge(
  workspaceType?: string,
  ifCleanImage?: boolean,
): string {
  if (!workspaceType) {
    return MemberBadge
  }

  const foundProfileTypeObj = PROFILE_TYPES.find(
    type => type.label === workspaceType,
  )

  if (foundProfileTypeObj) {
    if (ifCleanImage && foundProfileTypeObj.cleanImageSrc) {
      return foundProfileTypeObj.cleanImageSrc
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
