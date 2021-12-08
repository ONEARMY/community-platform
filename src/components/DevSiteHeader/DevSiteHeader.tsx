import { SITE, VERSION, DEV_SITE_ROLE } from 'src/config/config'
import Text from 'src/components/Text'
import theme from 'src/themes/styled.theme'
import { UserRole } from 'src/models'
import { Flex, Box } from 'rebass/styled-components'
import Select from 'react-select'

/**
 * A simple header component that reminds developers that they are working on a dev
 * version of the platform, and provide the option to toggle between different dev sites
 */
const DevSiteHeader = () => (
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
              options={siteRoles}
              placeholder="Role"
              defaultValue={
                siteRoles.find(s => s.value === DEV_SITE_ROLE) || siteRoles[0]
              }
              onChange={(s: any) => setSiteRole(s.value)}
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
// we have 2 different dev sites, only show this component when on one and provide select
const devSites = [
  { value: 'localhost', label: 'Dev' },
  { value: 'preview', label: 'Preview' },
]
// dev site users can use either a default user profile or mock another admin role
const siteRoles: { value: UserRole | null; label: string }[] = [
  { value: null, label: 'User' },
  { value: 'beta-tester', label: 'Beta Tester' },
  { value: 'admin', label: 'Admin' },
  // { value: 'super-admin', label: 'Super Admin' },
]

/** Use localStorage to specify a site that will update from src/config */
const setSite = async (site: string) => {
  await clearCache(false)
  localStorage.setItem('devSiteVariant', site)
  localStorage.setItem('devSiteRole', DEV_SITE_ROLE)
  window.location.reload()
}

/** Use localStorage to specify a role that can be applied while testing on dev sites */
const setSiteRole = async (role: string) => {
  if (role) {
    localStorage.setItem('devSiteRole', role)
  } else {
    localStorage.removeItem('devSiteRole')
  }
  window.location.reload()
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
