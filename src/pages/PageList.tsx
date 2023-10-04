import { lazy } from 'react'
import type { CSSObject } from '@styled-system/css'
import type { UserRole } from 'src/models/user.models'
import { ResearchModule } from './Research'
import { MODULE } from 'src/modules'
/**
 * Import all pages for use in lazy loading
 * NOTE - requires default export in page class (https://reactjs.org/docs/code-splitting.html#named-exports)
 */
const HowtoPage = lazy(
  () => import(/* webpackChunkName: "Howto" */ './Howto/Howto'),
)
const SettingsPage = lazy(
  () => import(/* webpackChunkName: "Settings" */ './UserSettings'),
)

const AcademyPage = lazy(
  () => import(/* webpackChunkName: "Academy" */ './Academy/Academy'),
)
const MapsPage = lazy(
  () => import(/* webpackChunkName: "Maps" */ './Maps/Maps'),
)
const User = lazy(() => import(/* webpackChunkName: "User" */ './User/User'))

const SignUpMessagePage = lazy(
  () =>
    import(/* webpackChunkName: "SignUpMessage" */ './SignUp/SignUpMessage'),
)
const ResendSignUpMessagePage = lazy(
  () =>
    import(
      /* webpackChunkName: "ResendSignUpMessage" */ './SignUp/ResendSignUpMessage'
    ),
)
const SignUpPage = lazy(
  () => import(/* webpackChunkName: "SignUp" */ './SignUp/SignUp'),
)
const SignInPage = lazy(
  () => import(/* webpackChunkName: "SignIn" */ './SignIn/SignIn'),
)
const ForgotPasswordPage = lazy(
  () =>
    import(
      /* webpackChunkName: "ForgotPassword" */ './Password/ForgotPassword'
    ),
)
const ForgotPasswordMessagePage = lazy(
  () =>
    import(
      /* webpackChunkName: "ForgotPasswordMessage" */ './Password/ForgotPasswordMessage'
    ),
)
const PrivacyPolicy = lazy(
  () => import(/* webpackChunkName: "privacy" */ './policy/privacy'),
)
const TermsPolicy = lazy(
  () => import(/* webpackChunkName: "terms" */ './policy/terms'),
)

export const getAvailablePageList = (supportedModules: MODULE[]): IPageMeta[] =>
  COMMUNITY_PAGES.filter((pageItem) =>
    supportedModules.includes(pageItem.moduleName),
  )

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
  component: <AcademyPage />,
  title: 'Academy',
  description: 'Demo external page embed',
  customStyles: {
    flex: 1,
  },
  fullPageWidth: true,
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
  academy,
  ResearchModule,
]
/** Additional pages to show in signed-in profile dropdown */
export const COMMUNITY_PAGES_PROFILE: IPageMeta[] = [settings]
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
