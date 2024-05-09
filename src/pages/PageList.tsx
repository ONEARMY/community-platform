import { lazy } from 'react'
import { MODULE } from 'src/modules'

import { mapPinService, MapPinServiceContext } from './Maps/map.service'
import { QuestionModule } from './Question'
import { ResearchModule } from './Research'

import type { UserRole } from 'oa-shared'
import type { CSSObject } from 'theme-ui'
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
const User = lazy(
  () => import(/* webpackChunkName: "User" */ './User/user.routes'),
)

const SignUpMessagePage = lazy(
  () =>
    import(/* webpackChunkName: "SignUpMessage" */ './SignUp/SignUpMessage'),
)
const SignUpPage = lazy(
  () => import(/* webpackChunkName: "SignUp" */ './SignUp/SignUp'),
)
const SignInPage = lazy(
  () => import(/* webpackChunkName: "SignIn" */ './SignIn/SignIn'),
)
const PrivacyPolicy = lazy(
  () => import(/* webpackChunkName: "privacy" */ './policy/PrivacyPolicy'),
)
const TermsPolicy = lazy(
  () => import(/* webpackChunkName: "terms" */ './policy/TermsPolicy'),
)
const Unsubscribe = lazy(
  () => import(/* webpackChunkName: "terms" */ './Unsubscribe/Unsubscribe'),
)

const Patreon = lazy(
  () => import(/* webpackChunkName: "terms" */ './Patreon/Patreon'),
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
  component: (
    <MapPinServiceContext.Provider value={mapPinService}>
      <MapsPage />
    </MapPinServiceContext.Provider>
  ),
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
  exact: true,
  component: <SignUpPage />,
  title: 'Sign Up',
  description: '',
}

const signin = {
  moduleName: MODULE.USER,
  path: '/sign-in',
  exact: true,
  component: <SignInPage />,
  title: 'Sign In',
  description: '',
}

const signupmessage = {
  moduleName: MODULE.USER,
  path: '/sign-up-message',
  exact: true,
  component: <SignUpMessagePage />,
  title: 'Sign Up Message',
  description: '',
}

const privacyPolicy = {
  moduleName: MODULE.CORE,
  path: '/privacy',
  exact: true,
  component: <PrivacyPolicy />,
  title: 'Privacy Policy',
  description: '',
}
const termsPolicy = {
  moduleName: MODULE.CORE,
  path: '/terms',
  exact: true,
  component: <TermsPolicy />,
  title: 'Terms of Use',
  description: '',
}

const unsubscribe = {
  moduleName: MODULE.CORE,
  path: '/unsubscribe',
  component: <Unsubscribe />,
  title: 'Unsubscribe',
  description: '',
}

const patreon = {
  moduleName: MODULE.CORE,
  path: '/patreon',
  component: <Patreon />,
  title: 'Patreon',
  description: '',
}

export const COMMUNITY_PAGES: IPageMeta[] = [
  howTo,
  maps,
  academy,
  ResearchModule,
  QuestionModule,
]
/** Additional pages to show in signed-in profile dropdown */
export const COMMUNITY_PAGES_PROFILE: IPageMeta[] = [settings]
export const POLICY_PAGES: IPageMeta[] = [privacyPolicy, termsPolicy]
export const NO_HEADER_PAGES: IPageMeta[] = [
  user,
  signup,
  signupmessage,
  signin,
  ResearchModule, // CC 2021-06-24 - Temporary - make research module accessible to all in production but hide from nav
  unsubscribe,
  QuestionModule,
  patreon,
]
