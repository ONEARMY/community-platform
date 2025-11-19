import { Outlet } from 'react-router'
import Main from 'src/pages/common/Layout/Main'

export async function loader() {
  return null
}

// This is a Layout file, it will render for all research routes
export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  )
}
