import type { StoryObj, StoryFn, Meta } from '@storybook/react'
import { MemberBadge } from './MemberBadge'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/MemberBadge',
  component: MemberBadge,
} as Meta<typeof MemberBadge>

export const Basic: StoryFn<typeof MemberBadge> = () => <MemberBadge />

export const Sizes: StoryObj<typeof MemberBadge> = {
  render: (args) => (
    <>
      <MemberBadge size={args.size} />
      <MemberBadge size={(args.size || 40) * 2} />
      <MemberBadge size={(args.size || 40) * 3} />
    </>
  ),
}

export const TypeMember: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={'member'} />
    <MemberBadge size={100} profileType={'member'} useLowDetailVersion />
  </>
)
export const TypeWorkspace: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={'workspace'} />
    <MemberBadge size={100} profileType={'workspace'} useLowDetailVersion />
  </>
)
export const TypeCommunityBuilder: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={'community-builder'} />
    <MemberBadge
      size={100}
      profileType={'community-builder'}
      useLowDetailVersion
    />
  </>
)
export const TypeCollectionPoint: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={'collection-point'} />
    <MemberBadge
      size={100}
      profileType={'collection-point'}
      useLowDetailVersion
    />
  </>
)
export const TypeMachineBuilder: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={'machine-builder'} />
    <MemberBadge
      size={100}
      profileType={'machine-builder'}
      useLowDetailVersion
    />
  </>
)

export const TypeSpace: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={'space'} />
    <MemberBadge size={100} profileType={'space'} useLowDetailVersion />
  </>
)
