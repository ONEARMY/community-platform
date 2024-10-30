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
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import FixingFashionMember from 'src/assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import FixingFashionSpace from 'src/assets/images/themes/fixing-fashion/avatar_space_sm.svg'
import PreciousPlasticMember from 'src/assets/images/themes/precious-plastic/avatar_member_sm.svg'
import ProjectKampMember from 'src/assets/images/themes/project-kamp/avatar_member_sm.svg'
import ProjectKampSpace from 'src/assets/images/themes/project-kamp/avatar_space_sm.svg'
import { getConfigurationOption } from 'src/config/config'

import type { IProfileTypeDetails } from './types'

const MemberAndSpace = {
  'fixing-fashion': {
    member: FixingFashionMember,
    space: FixingFashionSpace,
  },
  'precious-plastic': {
    member: PreciousPlasticMember,
    space: LogoCommunity,
  },
  'project-kamp': {
    member: ProjectKampMember,
    space: ProjectKampSpace,
  },
}
type ProfileType = keyof typeof MemberAndSpace

const getProfileTypes = () => {
  const theme = getConfigurationOption(
    'VITE_THEME',
    'precious-plastic',
  ) as ProfileType

  const PROFILE_TYPES: IProfileTypeDetails[] = [
    {
      label: ProfileTypeList.MEMBER,
      textLabel: 'I am a member',
      imageSrc: MemberAndSpace[theme].member,
      cleanImageSrc: MemberAndSpace[theme].member,
      cleanImageVerifiedSrc: MemberAndSpace[theme].member,
    },
    {
      label: ProfileTypeList.SPACE,
      textLabel: 'I run a space',
      imageSrc: MemberAndSpace[theme].space,
      cleanImageSrc: MemberAndSpace[theme].space,
      cleanImageVerifiedSrc: MemberAndSpace[theme].space,
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

export const SupportedProfileTypesFactory = (configurationString: string) => {
  const supportedProfileTypes = configurationString
    .split(',')
    .map((s) => s.trim())
  return () =>
    getProfileTypes().filter(({ label }) =>
      supportedProfileTypes.includes(label),
    )
}
