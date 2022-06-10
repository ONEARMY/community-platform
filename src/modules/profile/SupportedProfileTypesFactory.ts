import CollectionBadge from 'src/assets/images/badges/pt-collection-point.svg'
import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import SpaceBadge from 'src/assets/images/badges/pt-space.svg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.svg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.svg'
import LogoWorkspace from 'src/assets/icons/map-workspace.svg'
import LogoCollection from 'src/assets/icons/map-collection.svg'
import LogoMember from 'src/assets/icons/map-member.svg'
import LogoMachine from 'src/assets/icons/map-machine.svg'
import LogoCommunity from 'src/assets/icons/map-community.svg'
import LogoWorkspaceVerified from 'src/assets/icons/map-workspace-verified.svg'
import LogoCollectionVerified from 'src/assets/icons/map-collection-verified.svg'
import LogoMemberVerified from 'src/assets/icons/map-member-verified.svg'
import LogoMachineVerified from 'src/assets/icons/map-machine-verified.svg'
import LogoCommunityVerified from 'src/assets/icons/map-community-verified.svg'
import type { IProfileType } from './types'

export const ProfileType = {
  MEMBER: 'member',
  SPACE: 'space',
  WORKSPACE: 'workspace',
  MACHINE_BUILDER: 'machine-builder',
  COMMUNITY_BUILDER: 'community-builder',
  COLLECTION_POINT: 'collection-point',
} as const

const DEFAULT_PROFILE_TYPES =
  'member,space,workspace,community-builder,collection-point,machine-builder'

const PROFILE_TYPES: IProfileType[] = [
  {
    label: ProfileType.MEMBER,
    textLabel: 'I am a member',
    imageSrc: MemberBadge,
    cleanImageSrc: LogoMember,
    cleanImageVerifiedSrc: LogoMemberVerified,
  },
  {
    label: ProfileType.SPACE,
    textLabel: 'I run a space',
    imageSrc: SpaceBadge,
    cleanImageSrc: SpaceBadge,
    cleanImageVerifiedSrc: LogoMemberVerified,
  },
  {
    label: ProfileType.WORKSPACE,
    textLabel: 'I run a workspace',
    imageSrc: WorkspaceBadge,
    cleanImageSrc: LogoWorkspace,
    cleanImageVerifiedSrc: LogoWorkspaceVerified,
  },
  {
    label: ProfileType.MACHINE_BUILDER,
    textLabel: 'I build machines',
    imageSrc: MachineBadge,
    cleanImageSrc: LogoMachine,
    cleanImageVerifiedSrc: LogoMachineVerified,
  },
  {
    label: ProfileType.COMMUNITY_BUILDER,
    textLabel: 'I run a local community',
    imageSrc: LocalComBadge,
    cleanImageSrc: LogoCommunity,
    cleanImageVerifiedSrc: LogoCommunityVerified,
  },
  {
    label: ProfileType.COLLECTION_POINT,
    textLabel: 'I collect & sort plastic',
    imageSrc: CollectionBadge,
    cleanImageSrc: LogoCollection,
    cleanImageVerifiedSrc: LogoCollectionVerified,
  },
]

export function SupportedProfileTypesFactory(configurationString: string) {
  const supportedProfileTypes = (configurationString || DEFAULT_PROFILE_TYPES)
    .split(',')
    .map((s) => s.trim())
  return () =>
    PROFILE_TYPES.filter(({ label }) => supportedProfileTypes.includes(label))
}
