import { lazy } from 'react'
import { SITE } from 'src/config/config'
import { CSSObject } from '@styled-system/css'
import { Route } from 'react-router'
import { UserRole } from 'src/models/user.models'
import ExternalEmbed from 'src/components/ExternalEmbed/ExternalEmbed'
import { ResearchModule } from './Research'

/**
 * Import all pages for use in lazy loading
 * NOTE - requires default export in page class (https://reactjs.org/docs/code-splitting.html#named-exports)
 */
const HowtoPage = lazy(() => import('./Howto/Howto'))
const SettingsPage = lazy(() => import('./Settings'))

const EventsPage = lazy(() => import('./Events/Events'))
const AdminPage = lazy(() => import('./admin/Admin'))
const MapsPage = lazy(() => import('./Maps/Maps'))
const User = lazy(() => import('./User/User'))

const SignUpMessagePage = lazy(() => import('./SignUp/SignUpMessage'))
const ResendSignUpMessagePage = lazy(() =>
  import('./SignUp/ResendSignUpMessage'),
)
const SignUpPage = lazy(() => import('./SignUp/SignUp'))
const SignInPage = lazy(() => import('./SignIn/SignIn'))
const ForgotPasswordPage = lazy(() => import('./Password/ForgotPassword'))
const ForgotPasswordMessagePage = lazy(() =>
  import('./Password/ForgotPasswordMessage'),
)
const PrivacyPolicy = lazy(() => import('./policy/privacy'))
const TermsPolicy = lazy(() => import('./policy/terms'))

export interface IPageMeta {
  path: string
  component: any
  title: string
  description: string
  exact?: boolean
  fullPageWidth?: boolean
  customStyles?: CSSObject
  requiredRole?: UserRole
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
  customStyles: {
    flex: 1,
  },
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
const privacyPolicy = {
  path: '/privacy',
  component: <PrivacyPolicy />,
  title: 'Privacy Policy',
  description: '',
}
const termsPolicy = {
  path: '/terms',
  component: <TermsPolicy />,
  title: 'Terms of Use',
  description: '',
}

// community pages (various pages hidden on production build)
const devCommunityPages = [howTo, maps, events, academy, ResearchModule]
const prodCommunityPages = [howTo, maps, events, academy]
const communityPages = ['preview', 'production'].includes(SITE)
  ? prodCommunityPages
  : devCommunityPages
// community 'more' dropdown pages (various pages hidden on production build)
const devCommunityPagesMore = []
const prodCommunityPagesMore = []
const communityPagesMore = ['preview', 'production'].includes(SITE)
  ? prodCommunityPagesMore
  : devCommunityPagesMore

export const COMMUNITY_PAGES: IPageMeta[] = communityPages
export const COMMUNITY_PAGES_MORE: IPageMeta[] = communityPagesMore
export const COMMUNITY_PAGES_PROFILE: IPageMeta[] = [settings]
export const ADMIN_PAGES: IPageMeta[] = [admin]
export const POLICY_PAGES: IPageMeta[] = [privacyPolicy, termsPolicy]
export const NO_HEADER_PAGES: IPageMeta[] = [
  user,
  signup,
  signupmessage,
  resendsignupmessage,
  signin,
  forgotpassword,
  forgotpasswordmessage,
  ResearchModule, // CC 2021-06-24 - Temporary - make research module accessible to all in production but hide from nav
]
