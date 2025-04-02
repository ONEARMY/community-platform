import { useContext } from 'react'
import { Outlet } from '@remix-run/react'
import { isModuleSupported, MODULE } from 'src/modules'
import { EnvironmentContext } from 'src/pages/common/EnvironmentContext'
import Main from 'src/pages/common/Layout/Main'

export async function loader() {
  return null
}

export default function Index() {
  const env = useContext(EnvironmentContext)

  if (!isModuleSupported(env?.VITE_SUPPORTED_MODULES || '', MODULE.NEWS)) {
    return null
  }

  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  )
}
