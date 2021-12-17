import { lazy } from 'react'
import { CSSObject } from '@styled-system/css'
import { UserRole } from 'src/models/user.models'
import { ResearchModule } from './Research'
import { MODULE } from 'src/modules'

/**
 * Import all pages for use in lazy loading
 * NOTE - requires default export in page class (https://reactjs.org/docs/code-splitting.html#named-exports)
 */
const HowtoPage = lazy(() => import('./Howto/Howto'))
const SettingsPage = lazy(() => import('./Settings'))

const AcademyPage = lazy(() => import('./Academy/Academy'));
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

export function getAvailablePageList(supportedModules: MODULE[]): IPageMeta[] {
  return COMMUNITY_PAGES.filter(pageItem =>
    supportedModules.includes(pageItem.moduleName),
  )
}

export interface IPageMeta {
  moduleName: MODULE
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
  moduleName: MODULE.HOWTO,
  path: '/how-to',
  component: <HowtoPage />,
  title: 'How-to',
  description: 'Welcome to how-to',
}
const settings = {
  moduleName: MODULE.USER,
  path: '/settings',
  component: <SettingsPage />,
  title: 'Settings',
  description: 'Settings',
}
const user = {
  moduleName: MODULE.USER,
  path: '/u',
  component: <User />,
  title: 'Profile',
  description: 'Profile',
}
const academy = {
  moduleName: MODULE.ACADEMY,
  path: '/academy',
  component: <AcademyPage/>,
  title: 'Academy',
  description: 'Demo external page embed',
  customStyles: {
    flex: 1,
  },
  fullPageWidth: true,
}
const events = {
  moduleName: MODULE.EVENTS,
  path: '/events',
  component: <EventsPage />,
  title: 'Events',
  description: 'Welcome to Events',
}
const maps = {
  moduleName: MODULE.MAP,
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
  moduleName: MODULE.USER,
  path: '/admin',
  component: <AdminPage />,
  title: 'Admin',
  description: '',
}

const signup = {
  moduleName: MODULE.USER,
  path: '/sign-up',
  component: <SignUpPage />,
  title: 'Sign Up',
  description: '',
}

const signin = {
  moduleName: MODULE.USER,
  path: '/sign-in',
  component: <SignInPage />,
  title: 'Sign In',
  description: '',
}

const signupmessage = {
  moduleName: MODULE.USER,
  path: '/sign-up-message',
  component: <SignUpMessagePage />,
  title: 'Sign Up Message',
  description: '',
}

const resendsignupmessage = {
  moduleName: MODULE.USER,
  path: '/resend-sign-up-message',
  component: <ResendSignUpMessagePage />,
  title: 'Resend Sign Up Message',
  description: '',
}

const forgotpassword = {
  moduleName: MODULE.USER,
  path: '/forgot-password',
  component: <ForgotPasswordPage />,
  title: 'Forgot Password',
  description: '',
}

const forgotpasswordmessage = {
  moduleName: MODULE.USER,
  path: '/forgot-password-message',
  component: <ForgotPasswordMessagePage />,
  title: 'Forgot Password Message',
  description: '',
}
const privacyPolicy = {
  moduleName: MODULE.CORE,
  path: '/privacy',
  component: <PrivacyPolicy />,
  title: 'Privacy Policy',
  description: '',
}
const termsPolicy = {
  moduleName: MODULE.CORE,
  path: '/terms',
  component: <TermsPolicy />,
  title: 'Terms of Use',
  description: '',
}

export const COMMUNITY_PAGES: IPageMeta[] = [
  howTo,
  maps,
  events,
  academy,
  ResearchModule,
]
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
