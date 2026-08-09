import { ChevronRightIcon, FolderIcon, UsersIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

const ADMIN_NAV_ITEMS = [
  { label: 'Categories', href: '/admin/categories', icon: FolderIcon },
  {
    label: 'Users',
    icon: UsersIcon,
    items: [
      { label: 'Overview', href: '/admin/users' },
      { label: 'Supporters', href: '/admin/supporters' },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="px-2 text-sm font-semibold group-data-[collapsible=icon]:hidden">
          Admin
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV_ITEMS.map((item) =>
                'items' in item ? (
                  <SidebarMenuItem key={item.label}>
                    <Collapsible
                      defaultOpen={item.items?.some((subItem) =>
                        location.pathname.startsWith(subItem.href),
                      )}
                    >
                      <CollapsibleTrigger
                        className="group"
                        render={
                          <SidebarMenuButton tooltip={item.label}>
                            <item.icon />
                            <span>{item.label}</span>
                            <ChevronRightIcon className="ml-auto transition-transform group-data-[panel-open]:rotate-90" />
                          </SidebarMenuButton>
                        }
                      />
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                isActive={location.pathname === subItem.href}
                                render={<Link to={subItem.href} />}
                              >
                                <span>{subItem.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(item.href)}
                      tooltip={item.label}
                      render={<Link to={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
