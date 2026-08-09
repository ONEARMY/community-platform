import { UsersOverviewPage } from 'src/pages/Admin/Users/UsersOverviewPage';

export const handle = { breadcrumb: 'Overview', breadcrumbParent: 'Users' };

export default function Index() {
  return <UsersOverviewPage />;
}
