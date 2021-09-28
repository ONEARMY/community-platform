import { useEffect } from 'react'
import { UserStore } from 'src/stores/User/user.store'
import { SITE, VERSION, DEV_SITE_ROLE } from 'src/config/config'
import Text from 'src/components/Text'
import theme from 'src/themes/styled.theme'
import { MOCK_AUTH_USERS, IMockAuthUser } from 'oa-shared'
import { Flex, Box } from 'rebass'
import Select from 'react-select'
import { inject, observer } from 'mobx-react'

type InjectedProps = { userStore: UserStore }

/**
 * A simple header component that reminds developers that they are working on a dev
 * version of the platform, and provide the option to toggle between different dev sites
 */
const DevSiteHeader = inject('userStore')(
  observer((props: any) => {
    const { userStore } = props as InjectedProps
    // load default viewas user
    const viewAsUsers = generateViewAsUserList()
    const defaultViewAsUserValue = localStorage.getItem('devSiteDefaultViewAs') || null
    const defaultViewAsUser = viewAsUsers.find(user => user.value === defaultViewAsUserValue) || viewAsUsers[0]
    // on first mount login as default user if provided
    useEffect(() => {
      console.log('set default user', userStore, defaultViewAsUser)
      setViewAsUser(userStore, defaultViewAsUser)
    })
    return (
      <>
        {devSites.find(s => s.value === SITE) && (
          <Flex
            data-cy="devSiteHeader"
            bg={theme.colors.red2}
            width={1}
            py={1}
            px={1}
            alignItems="center"
            style={{ zIndex: 3001 }}
          >
            <Text color={'white'} medium txtcenter flex="1">
              This is a dev version of the platform (v{VERSION})
            </Text>
            <Flex data-cy="devSiteRoleSelectContainer" alignItems="center" ml={2}>
              <Text color={'white'} medium mr="1" title={SITE}>
                View as:
              </Text>
              <Box width="150px" mr={3}>
                <Select
                  placeholder="Role"
                  options={viewAsUsers}
                  defaultValue={defaultViewAsUser}
                  onChange={(user: any) => setViewAsUser(userStore, user)}
                />
              </Box>
            </Flex>
            <Flex data-cy="devSiteSelectContainer" alignItems="center">
              <Text color={'white'} medium mr="1" title={SITE}>
                Site:
              </Text>
              <Box width="130px">
                <Select
                  options={devSites}
                  placeholder="Site"
                  defaultValue={devSites.find(s => s.value === SITE)}
                  onChange={(s: any) => setSite(s.value)}
                />
              </Box>
            </Flex>
          </Flex>
        )}
      </>
    )
  }),
)
// we have 2 different dev sites, only show this component when on one and provide select
const devSites: { value: typeof SITE; label: string }[] = [
  { value: 'dev_site', label: 'Dev' },
  { value: 'preview', label: 'Preview' },
]

type IViewAsUser = IMockAuthUser & { value: string | null }

/**
 * Generate a list of available mock/demo users to log in as, with added value field for
 * use in select box. Also includes a default 'Myself' role that will ignore demo user profile
 */
function generateViewAsUserList() {
  const viewAsUsers: IViewAsUser[] = [{ value: null, label: 'Myself', roles: [] } as any].concat(
    Object.entries(MOCK_AUTH_USERS).map(([role, user]) => ({
      value: role,
      ...user,
    })),
  )
  return viewAsUsers
}

/** Use localStorage to specify a site that will update from src/config */
const setSite = async (site: string) => {
  await clearCache(false)
  localStorage.setItem('devSiteVariant', site)
  localStorage.setItem('devSiteRole', DEV_SITE_ROLE)
  window.location.reload()
}

/** Use localStorage to specify a role that can be applied while testing on dev sites */
const setViewAsUser = async (userStore: UserStore, user: IViewAsUser) => {
  const { value, email, password } = user
  try {
    await userStore.logout()
    if (email && password) {
      await userStore.login('', email, password)
    }
    localStorage.removeItem('devSiteRole')
    if (value) {
      localStorage.setItem('devSiteRole', value)
    }
  } catch (error) {
    console.error(error)
  }

  // window.location.reload()
}

/** Delete local,session and indexedDB storage */
const clearCache = (reload = true) => {
  return new Promise(async resolve => {
    localStorage.clear()
    sessionStorage.clear()
    const req = indexedDB.deleteDatabase('OneArmyCache')
    req.onsuccess = () => {
      if (reload) {
        window.location.reload()
      }
      resolve(true)
    }
    req.onerror = () => {
      if (reload) {
        window.location.reload()
      }
      resolve(false)
    }
  })
}

export default DevSiteHeader
