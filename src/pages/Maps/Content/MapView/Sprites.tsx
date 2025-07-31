import { useEffect } from 'react'
import { divIcon, point } from 'leaflet'
import clusterIcon from 'src/assets/icons/map-cluster.svg'
import AwaitingModerationHighlight from 'src/assets/icons/map-unpproved-pin.svg'
import Workspace from 'src/pages/User/workspace/Workspace'
import { useThemeUI } from 'theme-ui'

import type { MarkerCluster } from 'leaflet'
import type { MapPin } from 'oa-shared'

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

    return divIcon({
      html: `${icon}<span class="icon-cluster-text" style="
        background: ${theme.colors.accent.base};
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        border-radius: ${borderRadius}px;
        outline: ${outlineSize}px solid rgba(
          ${parseInt(themeBaseColorForRgba![1], 16)},
          ${parseInt(themeBaseColorForRgba![2], 16)},
          ${parseInt(themeBaseColorForRgba![3], 16)}, 0.5);
        ">${clusterChildCount}</span>`,
      className: className.join(' '),
      iconSize: point(iconSize, iconSize, true),
    })
  }
}

export const createMarkerIcon = (pin: MapPin, draggable?: boolean) => {
  const icon =
    pin.moderation === 'accepted'
      ? Workspace.findWorkspaceBadge(pin.profile!.type, true)
      : AwaitingModerationHighlight
  return divIcon({
    className: `icon-marker icon-${pin.profile!.type}`,
    html: `<img data-cy="pin-${pin.id}" src="${icon}" style="${draggable ? 'cursor: grab' : ''}" />`,
    iconSize: point(38, 38, true),
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
        fontSize: 18,
        iconSize: 26,
        lineHeight: 22,
      }
    case 2:
      return {
        fontSize: 18,
        iconSize: 32,
        lineHeight: 28,
      }

    default:
      return {
        fontSize: 18,
        iconSize: 44,
        lineHeight: 40,
      }
  }
}
