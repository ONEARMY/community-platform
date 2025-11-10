import { Outlet } from 'react-router';
import Main from 'src/pages/common/Layout/Main'

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  )
}
