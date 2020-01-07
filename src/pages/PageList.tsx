import * as React from 'react'
import { HowtoPage } from './Howto/Howto'
import { SettingsPage } from './Settings'
import { SITE } from 'src/config/config'
import { EventsPage } from './Events/Events'
import { AdminPage } from './admin/Admin'
import { MapsPage } from './Maps/Maps'
import { User } from './User/User'
import { ExternalEmbed } from 'src/components/ExternalEmbed/ExternalEmbed'
import { SignUpMessagePage } from './SignUp/SignUpMessage'
import { ResendSignUpMessagePage } from './SignUp/ResendSignUpMessage'
import SignUpPage from './SignUp/SignUp'
import SignInPage from './SignIn/SignIn'
import { ForgotPasswordPage } from './Password/ForgotPassword'
import { ForgotPasswordMessagePage } from './Password/ForgotPasswordMessage'
import { CSSObject } from '@styled-system/css'
import { Route } from 'react-router'

export interface IPageMeta {
  path: string
  component: any
  title: string
  description: string
  exact?: boolean
  fullPageWidth?: boolean
  customStyles?: CSSObject
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
  title: 'Profile',
  description: 'Profile',
}
const academy = {
  path: '/academy',
  component: (
    <Route
      render={props => (
        // NOTE - for embed to work github.io site also must host at same path, i.e. /academy
        <ExternalEmbed
          src={`https://onearmy.github.io${props.location.pathname}`}
          {...props}
        />
      )}
    />
  ),
  title: 'Academy',
  description: 'Demo external page embed',
  customStyles: { position: 'absolute', height: '100%', width: '100%' },
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
  customStyles: {
    position: 'relative',
    margin: '0',
    padding: '0',
    width: '100vw',
  },
  fullPageWidth: true,
}
const admin = {
  path: '/admin',
  component: <AdminPage />,
  title: 'Admin',
  description: '',
}

const signup = {
  path: '/sign-up',
  component: <SignUpPage />,
  title: 'Sign Up',
  description: '',
}

const signin = {
  path: '/sign-in',
  component: <SignInPage />,
  title: 'Sign In',
  description: '',
}

const signupmessage = {
  path: '/sign-up-message',
  component: <SignUpMessagePage />,
  title: 'Sign Up Message',
  description: '',
}

const resendsignupmessage = {
  path: '/resend-sign-up-message',
  component: <ResendSignUpMessagePage />,
  title: 'Resend Sign Up Message',
  description: '',
}

const forgotpassword = {
  path: '/forgot-password',
  component: <ForgotPasswordPage />,
  title: 'Forgot Password',
  description: '',
}

const forgotpasswordmessage = {
  path: '/forgot-password-message',
  component: <ForgotPasswordMessagePage />,
  title: 'Forgot Password Message',
  description: '',
}

// community pages (various pages hidden on production build)
const devCommunityPages = [howTo, maps, events, academy]
const prodCommunityPages = [howTo, maps, events, academy]
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
export const NO_HEADER_PAGES: IPageMeta[] = [
  user,
  signup,
  signupmessage,
  resendsignupmessage,
  signin,
  forgotpassword,
  forgotpasswordmessage,
]
