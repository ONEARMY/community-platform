import LogoCollection from '../../assets/icons/map-collection.svg'
import LogoCollectionVerified from '../../assets/icons/map-collection-verified.svg'
import LogoCommunity from '../../assets/icons/map-community.svg'
import LogoCommunityVerified from '../../assets/icons/map-community-verified.svg'
import LogoMachine from '../../assets/icons/map-machine.svg'
import LogoMachineVerified from '../../assets/icons/map-machine-verified.svg'
import LogoWorkspace from '../../assets/icons/map-workspace.svg'
import LogoWorkspaceVerified from '../../assets/icons/map-workspace-verified.svg'
import CollectionBadge from '../../assets/images/badges/pt-collection-point.svg'
import LocalComBadge from '../../assets/images/badges/pt-local-community.svg'
import MachineBadge from '../../assets/images/badges/pt-machine-shop.svg'
import SpaceBadge from '../../assets/images/badges/pt-space.svg'
import WorkspaceBadge from '../../assets/images/badges/pt-workspace.svg'
import FixingFashionMember from '../../assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import FixingFashionSpace from '../../assets/images/themes/fixing-fashion/avatar_space_sm.svg'
import PreciousPlasticMember from '../../assets/images/themes/precious-plastic/avatar_member_sm.svg'
import ProjectKampMember from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import ProjectKampSpace from '../../assets/images/themes/project-kamp/avatar_space_sm.svg'

import type { PlatformTheme } from '@onearmy.apps/themes'
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

const getProfileTypes = (currentTheme?: PlatformTheme) => {
  const PROFILE_TYPES: IProfileType[] = [
    {
      label: ProfileType.MEMBER,
      textLabel: 'I am a member',
      imageSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].member
        : PreciousPlasticMember,
      cleanImageSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].member
        : PreciousPlasticMember,
      cleanImageVerifiedSrc: currentTheme
        ? MemberAndSpace[currentTheme.id].member
        : PreciousPlasticMember,
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

export const SupportedProfileTypesFactory = (
  configurationString: string,
  currentTheme?: PlatformTheme,
) => {
  const supportedProfileTypes = (configurationString || DEFAULT_PROFILE_TYPES)
    .split(',')
    .map((s) => s.trim())
  return () =>
    getProfileTypes(currentTheme).filter(({ label }) =>
      supportedProfileTypes.includes(label),
    )
}
