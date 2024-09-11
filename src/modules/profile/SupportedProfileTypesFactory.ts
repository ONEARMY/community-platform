import { ProfileTypeList } from 'oa-shared'
import LogoCollection from 'src/assets/icons/map-collection.svg'
import LogoCollectionVerified from 'src/assets/icons/map-collection-verified.svg'
import LogoCommunity from 'src/assets/icons/map-community.svg'
import LogoCommunityVerified from 'src/assets/icons/map-community-verified.svg'
import LogoMachine from 'src/assets/icons/map-machine.svg'
import LogoMachineVerified from 'src/assets/icons/map-machine-verified.svg'
import LogoWorkspace from 'src/assets/icons/map-workspace.svg'
import LogoWorkspaceVerified from 'src/assets/icons/map-workspace-verified.svg'
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.svg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.svg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.svg'
import SpaceBadge from 'src/assets/images/badges/pt-space.svg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import FixingFashionMember from 'src/assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import FixingFashionSpace from 'src/assets/images/themes/fixing-fashion/avatar_space_sm.svg'
import PreciousPlasticMember from 'src/assets/images/themes/precious-plastic/avatar_member_sm.svg'
import ProjectKampMember from 'src/assets/images/themes/project-kamp/avatar_member_sm.svg'
import ProjectKampSpace from 'src/assets/images/themes/project-kamp/avatar_space_sm.svg'

import type { PlatformTheme } from 'oa-themes'
import type { IProfileTypeDetails } from './types'

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
  const PROFILE_TYPES: IProfileTypeDetails[] = [
    {
      label: ProfileTypeList.MEMBER,
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
      label: ProfileTypeList.SPACE,
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
      label: ProfileTypeList.WORKSPACE,
      textLabel: 'I run a workspace',
      imageSrc: WorkspaceBadge,
      cleanImageSrc: LogoWorkspace,
      cleanImageVerifiedSrc: LogoWorkspaceVerified,
    },
    {
      label: ProfileTypeList.MACHINE_BUILDER,
      textLabel: 'I build machines',
      imageSrc: MachineBadge,
      cleanImageSrc: LogoMachine,
      cleanImageVerifiedSrc: LogoMachineVerified,
    },
    {
      label: ProfileTypeList.COMMUNITY_BUILDER,
      textLabel: 'I run a local community',
      imageSrc: LocalComBadge,
      cleanImageSrc: LogoCommunity,
      cleanImageVerifiedSrc: LogoCommunityVerified,
    },
    {
      label: ProfileTypeList.COLLECTION_POINT,
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
