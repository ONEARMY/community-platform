import { Outlet } from 'react-router';
import Main from 'src/pages/common/Layout/Main';

export default function Index() {
  return (
    <Main
      style={{ flex: 1, marginBottom: 'calc(var(--spacing) * -9)' }}
      className="bg-secondary pb-9"
    >
      <Outlet />
    </Main>
  );
}
