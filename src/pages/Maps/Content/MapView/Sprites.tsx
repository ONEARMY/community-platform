import L from 'leaflet'
import { IModerationStatus } from 'oa-shared'
import clusterIcon from 'src/assets/icons/map-cluster.svg'
import AwaitingModerationHighlight from 'src/assets/icons/map-unpproved-pin.svg'
import { logger } from 'src/logger'
import Workspace from 'src/pages/User/workspace/Workspace'

import type { MarkerCluster } from 'leaflet'
import type { IMapPin } from 'src/models/maps.models'

import './sprites.css'

/**
 * Generate custom cluster icon, including style formatting, size, image etc.
 * @param opts - optional parameters could be passed from parent,
 * such as total pins. Currently none used, but retaining
 */
export const createClusterIcon = () => {
  return (cluster: MarkerCluster) => {
    const className = ['icon']
    let icon: any
    if (cluster.getChildCount() > 1) {
      className.push('icon-cluster-many')
      icon = clusterIcon
    } else if (cluster.getChildCount() === 1) {
      icon = cluster[0].pinType.icon
    }
    const { fontSize, iconSize, lineHeight } = getClusterSizes(cluster)

    return L.divIcon({
      html: `<img src="${icon}" /><span class="icon-cluster-text" style="font-size: ${fontSize}px; line-height: ${lineHeight}px">${cluster.getChildCount()}</span>`,
      className: className.join(' '),
      iconSize: L.point(iconSize, iconSize, true),
    })
  }
}

export const createMarkerIcon = (pin: IMapPin) => {
  const icon =
    pin.moderation === IModerationStatus.ACCEPTED
      ? Workspace.findWorkspaceBadge(pin.type, true, pin.verified)
      : AwaitingModerationHighlight
  if (!pin.type) {
    logger.debug('NO TYPE', pin)
  }
  return L.divIcon({
    className: `icon-marker icon-${pin.type}`,
    html: `<img src="${icon}" />`,
    iconSize: L.point(38, 38, true),
  })
}

/**
 * Depending on size of cluster, return range for font and icon sizes
 * to scale cluster depending on value and ensure fits in icon
 * @param cluster - MarkerCluster passed from creation function
 */
const getClusterSizes = (cluster: MarkerCluster) => {
  const count = cluster.getChildCount()
  const order = Math.round(count).toString().length
  switch (order) {
    case 1:
      return {
        fontSize: 20,
        iconSize: 26,
        lineHeight: 26,
      }
    case 2:
      return {
        fontSize: 20,
        iconSize: 32,
        lineHeight: 32,
      }

    default:
      return {
        fontSize: 20,
        iconSize: 44,
        lineHeight: 44,
      }
  }
}
