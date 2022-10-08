import CollectionBadge from 'src/assets/images/badges/pt-collection-point.svg'
import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import SpaceBadge from 'src/assets/images/badges/pt-space.svg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.svg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.svg'
import LogoWorkspace from 'src/assets/icons/map-workspace.svg'
import LogoCollection from 'src/assets/icons/map-collection.svg'
import LogoMachine from 'src/assets/icons/map-machine.svg'
import LogoCommunity from 'src/assets/icons/map-community.svg'
import LogoWorkspaceVerified from 'src/assets/icons/map-workspace-verified.svg'
import LogoCollectionVerified from 'src/assets/icons/map-collection-verified.svg'
import LogoMachineVerified from 'src/assets/icons/map-machine-verified.svg'
import LogoCommunityVerified from 'src/assets/icons/map-community-verified.svg'
import type { IProfileType } from './types'
import type { PlatformTheme } from 'src/themes/types'
import FixingFashionMember from 'src/assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import FixingFashionSpace from 'src/assets/images/themes/fixing-fashion/avatar_space_sm.svg'
import PreciousPlasticMember from 'src/assets/images/themes/precious-plastic/avatar_member_sm.svg'
import ProjectKampMember from 'src/assets/images/themes/project-kamp/avatar_member_sm.svg'
import ProjectKampSpace from 'src/assets/images/themes/project-kamp/avatar_space_sm.svg'

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

const MemberAndSpace = {
  'fixing-fashion': {
    member: FixingFashionMember,
    space: FixingFashionSpace,
  },
  'precious-plastic': {
    member: PreciousPlasticMember,
    space: undefined,
  },
  'project-kamp': {
    member: ProjectKampMember,
    space: ProjectKampSpace,
  },
}

function getProfileTypes(currentTheme?: PlatformTheme) {
  const PROFILE_TYPES: IProfileType[] = [
    {
      label: ProfileType.MEMBER,
      textLabel: 'I am a member',
      imageSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].member
        : MemberBadge,
      cleanImageSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].member
        : MemberBadge,
      cleanImageVerifiedSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].member
        : MemberBadge,
    },
    {
      label: ProfileType.SPACE,
      textLabel: 'I run a space',
      imageSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].space
        : SpaceBadge,
      cleanImageSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].space
        : SpaceBadge,
      cleanImageVerifiedSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].space
        : SpaceBadge,
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
