import { SITE, VERSION, DEV_SITE_ROLE } from 'src/config/config'
import Text from 'src/components/Text'
import { UserRole } from 'src/models'
import { Flex, Box } from 'theme-ui'
import Select from 'react-select'
import { observer } from 'mobx-react-lite'
import { useCommonStores } from 'src/index'

/**
 * A simple header component that reminds developers that they are working on a dev
 * version of the platform, and provide the option to toggle between different dev sites
 */
const DevSiteHeader = observer(() => {
  const { themeStore } = useCommonStores().stores
  const theme = themeStore.currentTheme.styles
  return (
    <>
      {showDevSiteHeader() && (
        <Flex
          data-cy="devSiteHeader"
          bg={theme.colors.red2}
          py={1}
          px={1}
          style={{ alignItems: 'center', zIndex: 3001 }}
        >
          <Text color={'white'} medium txtcenter sx={{ flex: '1' }}>
            This is a dev version of the platform (v{VERSION})
          </Text>
          <Flex
            data-cy="devSiteRoleSelectContainer"
            sx={{ alignItems: 'center' }}
            ml={2}
          >
            <Text color={'white'} medium mr="1" title={SITE}>
              View as:
            </Text>
            <Box sx={{ width: '150px' }} mr={3}>
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
          <Flex data-cy="devSiteSelectContainer" sx={{ alignItems: 'center' }}>
            <Text color={'white'} medium mr="1" title={SITE}>
              Site:
            </Text>
            <Box sx={{ width: '130px' }} mr={3}>
              <Select
                options={devSites}
                placeholder="Site"
                defaultValue={devSites.find(s => s.value === SITE)}
                onChange={(s: any) => setSite(s.value)}
              />
            </Box>
          </Flex>
          <Flex data-cy="devSiteSelectContainer" sx={{ alignItems: 'center' }}>
            <Text color={'white'} medium mr="1" title={SITE}>
              Theme:
            </Text>
            <Box sx={{ width: '180px' }}>
              <Select
                options={availableThemes}
                placeholder="Pick a theme"
                defaultValue={availableThemes.find(s => s.value === SITE)}
                onChange={(selectedElement: any) => {
                  const theme = selectedElement?.value || ''
                  localStorage.setItem('platformTheme', theme)
                  themeStore.setActiveTheme(theme)
                }}
              />
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  )
})

function showDevSiteHeader() {
  return (
    devSites.some(s => s.value === SITE) ||
    window.location?.hostname === 'localhost'
  )
}

const availableThemes = [
  { value: 'precious-plastic', label: 'Precious Plastic' },
  { value: 'project-kamp', label: 'Project Kamp' },
]

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
