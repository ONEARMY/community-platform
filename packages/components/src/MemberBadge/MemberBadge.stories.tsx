import { faker } from '@faker-js/faker';

import { MemberBadge } from './MemberBadge';

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import type { ProfileType } from 'oa-shared';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/MemberBadge',
  component: MemberBadge,
} as Meta<typeof MemberBadge>;
const machineBuilder: ProfileType = {
  name: 'machine-builder',
  description: 'A machine builder profile',
  displayName: 'Machine Builder',
  id: 1,
  imageUrl: faker.image.avatar(),
  mapPinName: 'Machine Builder',
  order: 1,
  smallImageUrl: faker.image.avatar(),
  isSpace: true,
};
const member: ProfileType = {
  name: 'member',
  description: 'A member profile',
  displayName: 'Member',
  id: 2,
  imageUrl: faker.image.avatar(),
  mapPinName: 'Member',
  order: 1,
  smallImageUrl: faker.image.avatar(),
  isSpace: false,
};

export const Basic: StoryFn<typeof MemberBadge> = () => <MemberBadge />;

export const Sizes: StoryObj<typeof MemberBadge> = {
  render: (args) => (
    <>
      <MemberBadge size={args.size} />
      <MemberBadge size={(args.size || 40) * 2} />
      <MemberBadge size={(args.size || 40) * 3} />
    </>
  ),
};

export const TypeMember: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={member} />
    <MemberBadge size={100} profileType={member} useLowDetailVersion />
  </>
);

export const TypeMachineBuilder: StoryFn<typeof MemberBadge> = () => (
  <>
    <MemberBadge size={100} profileType={machineBuilder} />
    <MemberBadge size={100} profileType={machineBuilder} useLowDetailVersion />
  </>
);
