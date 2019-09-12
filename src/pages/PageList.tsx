import * as React from 'react'
import { HowtoPage } from './Howto/Howto'
import { SettingsPage } from './Settings'
import { SITE } from 'src/config/config'
import { EventsPage } from './Events/Events'
import { AdminPage } from './admin/Admin'
import { MapsPage } from './Maps/Maps'
import { User } from './User/User'
import { ExternalEmbed } from 'src/components/ExternalEmbed/ExternalEmbed'
import PageContainer from 'src/components/Layout/PageContainer'

export interface IPageMeta {
  path: string
  component: any
  title: string
  description: string
  exact?: boolean
  fullPageWidth?: boolean
}

const howTo = {
  path: '/how-to',
  component: <HowtoPage />,
  title: 'How-to',
  description: 'Welcome to how-to',
}
const settings = {
  path: '/settings',
  component: <SettingsPage />,
  title: 'Settings',
  description: 'Settings',
}
const user = {
  path: '/u',
  component: <User />,
  title: 'User profile',
  description: 'User profile',
}
const academy = {
  path: '/academy',
  component: (
    <ExternalEmbed src="https://onearmy.github.io/docs-demo/docs/intro" />
  ),
  title: 'Academy',
  description: 'Demo external page embed',
  fullPageWidth: true,
}
const events = {
  path: '/events',
  component: <EventsPage />,
  title: 'Events',
  description: 'Welcome to Events',
}
const maps = {
  path: '/map',
  component: <MapsPage />,
  title: 'Map',
  description: 'Welcome to the Map',
  fullPageWidth: true,
}
const admin = {
  path: '/admin',
  component: <AdminPage />,
  title: 'Admin',
  description: '',
}

// community pages (various pages hidden on production build)
const devCommunityPages = [howTo, events, maps, academy]
const prodCommunityPages = [howTo, events, maps]
const communityPages =
  SITE === 'production' ? prodCommunityPages : devCommunityPages
// community 'more' dropdown pages (various pages hidden on production build)
const devCommunityPagesMore = []
const prodCommunityPagesMore = []
const communityPagesMore =
  SITE === 'production' ? prodCommunityPagesMore : devCommunityPagesMore

export const COMMUNITY_PAGES: IPageMeta[] = communityPages
export const COMMUNITY_PAGES_MORE: IPageMeta[] = communityPagesMore
export const COMMUNITY_PAGES_PROFILE: IPageMeta[] = [settings]
export const ADMIN_PAGES: IPageMeta[] = [admin]
export const NO_HEADER_PAGES: IPageMeta[] = [user]
