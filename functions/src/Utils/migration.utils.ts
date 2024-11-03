import { CONFIG } from '../config/config'

export function migrationEnabled() {
  switch (CONFIG.deployment.site_url) {
    case 'https://dev.onearmy.world':
    case 'https://dev.community.projectkamp.com':
    case 'https://dev.community.fixing.fashion':
      return true
    default:
      return false
  }
}

export function migrationProject() {
  switch (CONFIG.deployment.site_url) {
    case 'https://dev.onearmy.world':
      return 'dev_pp'
    case 'https://community.preciousplastic.com':
      return 'prod_pp'
    case 'https://dev.community.projectkamp.com':
      return 'dev_pk'
    case 'https://community.projectkamp.com':
      return 'prod_pk'
    case 'https://dev.community.fixing.fashion':
      return 'dev_ff'
    case 'https://community.fixing.fashion':
      return 'prod_ff'
    default:
      return null
  }
}
