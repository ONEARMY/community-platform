import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { MemberBadge } from './MemberBadge'

export default {
  title: 'Base Components/MemberBadge',
  component: MemberBadge,
} as ComponentMeta<typeof MemberBadge>

const Base: ComponentStory<typeof MemberBadge> = (args: any) => (
  <MemberBadge {...args} />
)

export const Member = Base.bind({})

export const Size = Base.bind({})
Size.args = {
  size: 100,
}

export const ProfileTypeMember = Base.bind({})
ProfileTypeMember.args = {
  profileType: 'member',
}
export const ProfileTypeWorkspace = Base.bind({})
ProfileTypeWorkspace.args = {
  profileType: 'workspace',
}
export const ProfileTypeCommunityBuild = Base.bind({})
ProfileTypeCommunityBuild.args = {
  profileType: 'community-builder',
}
export const ProfileTypeCollectionPoint = Base.bind({})
ProfileTypeCollectionPoint.args = {
  profileType: 'collection-point',
}
export const ProfileTypeMachineBuilder = Base.bind({})
ProfileTypeMachineBuilder.args = {
  profileType: 'machine-builder',
}
