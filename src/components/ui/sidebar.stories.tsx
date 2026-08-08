import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderIcon, TagIcon, UsersIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'ui/Sidebar',
  component: Sidebar,
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

const NAV_ITEMS = [
  { label: 'Categories', icon: FolderIcon, active: true },
  { label: 'Tags', icon: TagIcon, active: false },
  { label: 'Users', icon: UsersIcon, active: false },
];

function SidebarDemo(collapsible: 'offcanvas' | 'icon') {
  return (
    <SidebarProvider style={{ minHeight: 420 }}>
      <Sidebar collapsible={collapsible}>
        <SidebarHeader>
          <span style={{ padding: '0 8px', fontSize: 14, fontWeight: 600 }}>Admin</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 48,
            borderBottom: '1px solid var(--border)',
            padding: '0 16px',
          }}
        >
          <SidebarTrigger />
          <span style={{ fontSize: 14 }}>Admin / Categories</span>
        </header>
        <div style={{ padding: 16, fontSize: 14, color: 'var(--muted-foreground)' }}>
          Page content goes here.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Default: Story = {
  render: () => SidebarDemo('offcanvas'),
};

export const CollapsibleIcon: Story = {
  render: () => SidebarDemo('icon'),
};
