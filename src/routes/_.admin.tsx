import { ChevronRightIcon } from 'lucide-react';
import { UserRole } from 'oa-shared';
import type { MiddlewareFunction } from 'react-router';
import { Outlet, useMatches } from 'react-router';
import { requireRole } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { AdminSidebar } from 'src/pages/Admin/AdminSidebar';
import Main from 'src/pages/common/Layout/Main';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AdminRouteHandle {
  breadcrumb?: string;
  breadcrumbParent?: string;
}

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRole(UserRole.ADMIN, 'admin'),
];

export default function AdminLayout() {
  const matches = useMatches();
  const handle = matches
    .map((match) => match.handle as AdminRouteHandle | undefined)
    .filter((routeHandle) => routeHandle?.breadcrumb)
    .at(-1);

  const crumbs = ['Admin', handle?.breadcrumbParent, handle?.breadcrumb].filter(Boolean);

  return (
    <Main style={{ flex: 1 }} ignoreMaxWidth>
      <SidebarProvider className="min-h-0 flex-1">
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <nav className="flex items-center gap-1 text-sm">
              {crumbs.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-1">
                  {index > 0 && <ChevronRightIcon className="size-4 text-muted-foreground" />}
                  <span
                    className={
                      index === crumbs.length - 1 ? 'font-medium' : 'text-muted-foreground'
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </header>
          <div className="flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Main>
  );
}
