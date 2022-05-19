import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { MemberBadge } from './MemberBadge'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Base Components/MemberBadge',
  component: MemberBadge,
} as ComponentMeta<typeof MemberBadge>

export const Basic: ComponentStory<typeof MemberBadge> = () => <MemberBadge />

export const Sizes: ComponentStory<typeof MemberBadge> = (args) => (
  <MemberBadge size={args.size} />
)

export const TypeMember: ComponentStory<typeof MemberBadge> = () => (
  <MemberBadge size={100} profileType={'member'} />
)
export const TypeWorkspace: ComponentStory<typeof MemberBadge> = () => (
  <MemberBadge size={100} profileType={'workspace'} />
)
export const TypeCommunityBuilder: ComponentStory<typeof MemberBadge> = () => (
  <MemberBadge size={100} profileType={'community-builder'} />
)
export const TypeCollectionPoint: ComponentStory<typeof MemberBadge> = () => (
  <MemberBadge size={100} profileType={'collection-point'} />
)
export const TypeMachineBuilder: ComponentStory<typeof MemberBadge> = () => (
  <MemberBadge size={100} profileType={'machine-builder'} />
)
