import L, { MarkerCluster } from 'leaflet'
import './sprites.css'
import { IMapPin } from 'src/models/maps.models'
import clusterIcon from 'src/assets/icons/map-cluster.svg'
import Workspace from 'src/pages/User/workspace/Workspace'

import AwaitingModerationHighlight from 'src/assets/icons/map-unpproved-pin.svg'
import { logger } from 'workbox-core/_private'

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
    pin.moderation === 'accepted'
      ? Workspace.findWorkspaceBadge(pin.type, true)
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
function getClusterSizes(cluster: MarkerCluster) {
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
/*************************************************************************
 *  Deprecated
 *  The code below is not currently in use, but will be retained
 *  in case we decide in the near future to add more fine-grained
 *  control of clusters, such as a more-linear size scaling (see scale fn)
 *  or custom classes
 *************************************************************************/

// if(cluster.getChildCount() > 999) {
//   className.push('icon-cluster-thousands')
// } else if(cluster.getChildCount() > 99) {
//   className.push('icon-cluster-hundreds')
// } else if(cluster.getChildCount() > 9) {
//   className.push('icon-cluster-tens')
// }

// const iconSize = scale(0, totalEntries, cluster.getChildCount(), 35, 50)
// const fontSize = scale(0, totalEntries, cluster.getChildCount(), 24, 36)
// const lineHeight = scale(0, totalEntries, cluster.getChildCount(), 36, 50)

// Scale the cluster size between 35 and 50
// https://stackoverflow.com/a/929104
// function scale(
//   oldMin: number,
//   oldMax: number,
//   oldValue: number,
//   newMin: number,
//   newMax: number,
// ): number {
//   return Math.ceil(
//     ((oldValue - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin,
//   )
// }
