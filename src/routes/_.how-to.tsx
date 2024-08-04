/* eslint-disable unicorn/filename-case */
import { Outlet } from '@remix-run/react'
import Main from 'src/pages/common/Layout/Main'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

// This is a Layout file, it will render for all howto routes
export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="How To" />
      <Outlet />
    </Main>
  )
}
