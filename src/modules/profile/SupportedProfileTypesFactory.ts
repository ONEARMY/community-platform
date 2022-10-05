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
import FixingFashionMember from 'src/assets/images/themes/fixing-fashion/avatar_member.svg'
import FixingFashionSpace from 'src/assets/images/themes/fixing-fashion/avatar_space.svg'
import type { IProfileType } from './types'
import type { PlatformTheme } from 'src/themes/types'

export const ProfileType = {
  MEMBER: 'member',
  SPACE: 'space',
  WORKSPACE: 'workspace',
  MACHINE_BUILDER: 'machine-builder',
  COMMUNITY_BUILDER: 'community-builder',
  COLLECTION_POINT: 'collection-point',
} as const

const DEFAULT_PROFILE_TYPES =
  'member,workspace,community-builder,collection-point,machine-builder'

function getProfileTypes(currentTheme?: PlatformTheme) {
  const memberImageSrc =
    currentTheme && currentTheme.id === 'fixing-fashion'
      ? FixingFashionMember
      : MemberBadge
  const spaceImageSrc =
    currentTheme && currentTheme.id === 'fixing-fashion'
      ? FixingFashionSpace
      : SpaceBadge

  const PROFILE_TYPES: IProfileType[] = [
    {
      label: ProfileType.MEMBER,
      textLabel: 'I am a member',
      imageSrc: memberImageSrc,
      cleanImageSrc: memberImageSrc,
      cleanImageVerifiedSrc: memberImageSrc,
    },
    {
      label: ProfileType.SPACE,
      textLabel: 'I run a space',
      imageSrc: spaceImageSrc,
      cleanImageSrc: spaceImageSrc,
      cleanImageVerifiedSrc: spaceImageSrc,
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

  return PROFILE_TYPES
}

export function SupportedProfileTypesFactory(
  configurationString: string,
  currentTheme?: PlatformTheme,
) {
  const supportedProfileTypes = (configurationString || DEFAULT_PROFILE_TYPES)
    .split(',')
    .map((s) => s.trim())
  return () =>
    getProfileTypes(currentTheme).filter(({ label }) =>
      supportedProfileTypes.includes(label),
    )
}
