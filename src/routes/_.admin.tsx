import { UserRole } from 'oa-shared';
import { Fragment } from 'react';
import type { MiddlewareFunction } from 'react-router';
import { Outlet, useMatches } from 'react-router';
import { requireRole } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { AdminSidebar } from 'src/pages/Admin/AdminSidebar';
import Main from 'src/pages/common/Layout/Main';
import { ForbiddenPage } from 'src/pages/Forbidden/labels';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AdminRouteHandle {
  breadcrumb?: string;
  breadcrumbParent?: string;
}

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRole(UserRole.ADMIN, ForbiddenPage.ADMIN),
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
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;
                  return (
                    <Fragment key={crumb}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{crumb}</BreadcrumbPage>
                        ) : (
                          <span className="px-3 py-1 whitespace-nowrap">{crumb}</span>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Main>
  );
}
