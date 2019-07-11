import * as React from 'react'
import { HowtoPage } from './Howto/Howto'
import { ProfilePage } from './Profile/Profile'
import { FeedbackPage } from './Feedback/Feedback'
import { SITE } from 'src/config/config'
import { DiscussionsPage } from './Discussions'
import { EventsPage } from './Events/Events'
import { NotFoundPage } from './NotFound/NotFound'
import { AdminPage } from './admin/Admin'
import { MapsPage } from './Maps/Maps'

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
const profile = {
  path: '/profile',
  component: <ProfilePage />,
  title: 'Profile',
  description: '',
}
const feedback = {
  path: '/feedback',
  component: <FeedbackPage />,
  title: 'Feedback',
  description: 'Let us know what you think!',
}
const discussions = {
  path: '/discussions',
  component: <DiscussionsPage />,
  title: 'Discussions',
  description: '',
}
const events = {
  path: '/events',
  component: <EventsPage />,
  title: 'Events',
  description: 'Welcome to Events',
}
const maps = {
  path: '/maps',
  component: <MapsPage />,
  title: 'Maps',
  description: '',
  fullPageWidth: true,
}
const admin = {
  path: '/admin',
  component: <AdminPage />,
  title: 'Admin',
  description: '',
}

// community pages (various pages hidden on production build)
const devCommunityPages = [howTo, events, discussions]
const prodCommunityPages = [howTo, events]
const communityPages =
  SITE === 'production' ? prodCommunityPages : devCommunityPages
// community 'more' dropdown pages (various pages hidden on production build)
const devCommunityPagesMore = [maps]
const prodCommunityPagesMore = []
const communityPagesMore =
  SITE === 'production' ? prodCommunityPagesMore : devCommunityPagesMore

export const COMMUNITY_PAGES: IPageMeta[] = communityPages
export const COMMUNITY_PAGES_MORE: IPageMeta[] = communityPagesMore
export const COMMUNITY_PAGES_PROFILE: IPageMeta[] = [profile, feedback]
export const ADMIN_PAGES: IPageMeta[] = [admin]
