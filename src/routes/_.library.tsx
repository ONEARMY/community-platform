/* eslint-disable unicorn/filename-case */
import { Outlet } from '@remix-run/react'
import Main from 'src/pages/common/Layout/Main'

export async function loader() {
  return null
}

// This is a Layout file, it will render for all library routes
export default function Index() {
  return (
    <Main sx={{ flex: 1 }}>
      <Outlet />
    </Main>
  )
}
