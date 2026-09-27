import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRightIcon, UsersIcon } from 'lucide-react';
import { Button } from './button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from './sidebar';

const meta: Meta<typeof Collapsible> = {
  title: 'ui/Collapsible',
  component: Collapsible,
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible style={{ width: 320 }}>
      <CollapsibleTrigger render={<Button variant="outline" />}>
        What is a supporter badge?
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--muted-foreground)' }}>
          A badge granted to profiles that hold an active supporter tier.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen style={{ width: 320 }}>
      <CollapsibleTrigger render={<Button variant="outline" />}>Details</CollapsibleTrigger>
      <CollapsibleContent>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--muted-foreground)' }}>
          Rendered open by default via the `defaultOpen` prop.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const SidebarNavGroup: Story = {
  render: () => (
    <SidebarProvider style={{ minHeight: 260 }}>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger
                      className="group"
                      render={
                        <SidebarMenuButton tooltip="Users">
                          <UsersIcon />
                          <span>Users</span>
                          <ChevronRightIcon className="ml-auto transition-transform group-data-[panel-open]:rotate-90" />
                        </SidebarMenuButton>
                      }
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton isActive>
                            <span>Overview</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <span>Supporters</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};
