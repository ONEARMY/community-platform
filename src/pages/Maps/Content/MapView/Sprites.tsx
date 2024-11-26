import { useEffect } from 'react'
import L from 'leaflet'
import { IModerationStatus } from 'oa-shared'
import clusterIcon from 'src/assets/icons/map-cluster.svg'
import AwaitingModerationHighlight from 'src/assets/icons/map-unpproved-pin.svg'
import { logger } from 'src/logger'
import Workspace from 'src/pages/User/workspace/Workspace'
import { useThemeUI } from 'theme-ui'

import type { MarkerCluster } from 'leaflet'
import type { IMapPin } from 'oa-shared'

import './sprites.css'

/**
 * Generate custom cluster icon, including style formatting, size, image etc.
 * @param opts - optional parameters could be passed from parent,
 * such as total pins. Currently none used, but retaining
 */
export const createClusterIcon = () => {
  const { theme } = useThemeUI() as any
  const path = clusterIcon
  let iconAsString: string = ''
  useEffect(() => {
    fetch(path)
      .then((response) => response.text())
      .then((data) => {
        iconAsString = data.replaceAll(
          /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/g,
          theme.colors.accent.base,
        )
      })
      .catch((fetchError) => console.error(fetchError))
  }, [path, theme])
  return (cluster: MarkerCluster) => {
    const className = ['icon']
    let icon: any
    let outlineSize: number = 0
    const clusterChildCount: number = cluster.getChildCount()
    if (clusterChildCount > 1) {
      className.push('icon-cluster-many')
      icon = iconAsString
      // Calcute Outline CSS
      if (clusterChildCount > 49) {
        outlineSize = 24
      } else {
        outlineSize = 4 + ((clusterChildCount - 2) / 50) * 20
      }
    } else if (clusterChildCount === 1) {
      icon = `<img src="${cluster[0].pinType.icon} />`
    }
    const { fontSize, iconSize, lineHeight } = getClusterSizes(cluster)

    // Prepare Outline CSS for groups
    const borderRadius = lineHeight / 2
    const themeBaseColorForRgba: RegExpExecArray | null =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme.colors.accent.base)

    return L.divIcon({
      html: `${icon}<span class="icon-cluster-text" style="
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        border-radius: ${borderRadius}px;
        outline: ${outlineSize}px solid rgba(
          ${parseInt(themeBaseColorForRgba![1], 16)},
          ${parseInt(themeBaseColorForRgba![2], 16)},
          ${parseInt(themeBaseColorForRgba![3], 16)}, 0.5);
        ">${clusterChildCount}</span>`,
      className: className.join(' '),
      iconSize: L.point(iconSize, iconSize, true),
    })
  }
}

export const createMarkerIcon = (pin: IMapPin, draggable?: boolean) => {
  const icon =
    pin.moderation === IModerationStatus.ACCEPTED
      ? Workspace.findWorkspaceBadge(pin.type, true, pin.verified)
      : AwaitingModerationHighlight
  if (!pin.type) {
    logger.debug('NO TYPE', pin)
  }
  return L.divIcon({
    className: `icon-marker icon-${pin.type}`,
    html: `<img data-cy="pin-${pin._id}" src="${icon}" style="${draggable ? 'cursor: grab' : ''}" />`,
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
