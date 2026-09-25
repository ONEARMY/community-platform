import type { Meta, StoryObj } from '@storybook/react-vite';
import Account from './account.svg?react';
import Check from './check.svg?react';
import ChevronDown from './chevron-down.svg?react';
import ChevronLeft from './chevron-left.svg?react';
import ChevronRight from './chevron-right.svg?react';
import ChevronUp from './chevron-up.svg?react';
import Close from './close.svg?react';
import Comment from './comment.svg?react';
import Notifications from './notifications.svg?react';
import NotificationsActive from './notifications-active.svg?react';
import Search from './search.svg?react';
import Thunderbolt from './thunderbolt.svg?react';
import Update from './update.svg?react';

const icons = {
  Account,
  Check,
  Close,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Notifications,
  NotificationsActive,
  Comment,
  Update,
  Thunderbolt,
};

const meta: Meta = {
  title: 'ui/Icons',
};
export default meta;

type Story = StoryObj;

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {Object.entries(icons).map(([name, IconComponent]) => (
        <div
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          <IconComponent style={{ width: 24, height: 24 }} />
          <span style={{ fontSize: 12 }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ color: 'var(--color-primary)', display: 'flex', gap: 16 }}>
      <Close style={{ width: 32, height: 32 }} />
      <Search style={{ width: 32, height: 32 }} />
      <Notifications style={{ width: 32, height: 32 }} />
    </div>
  ),
};
