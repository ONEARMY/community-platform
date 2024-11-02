import { Outlet } from '@remix-run/react'
import Main from 'src/pages/common/Layout/Main'

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  )
}
