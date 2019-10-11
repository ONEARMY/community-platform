import L from 'leaflet'
import './sprites.css'
import { IMapPinWithType } from 'src/models/maps.models'
import collectionIcon from 'src/assets/icons/map-cluster-workspace.svg'

// Scale the cluster size between 35 and 50
// https://stackoverflow.com/a/929104
function scale(
  oldMin: number,
  oldMax: number,
  oldValue: number,
  newMin: number,
  newMax: number,
): number {
  return Math.ceil(
    ((oldValue - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin,
  )
}

export const createClusterIcon = (
  clusterKey: string,
  something: any,
  totalEntries: number,
) => {
  return cluster => {
    const className = ['icon']
    let icon: any
    if (cluster.getChildCount() > 1) {
      className.push('icon-cluster-many')
      icon = collectionIcon
    } else if (cluster.getChildCount() === 1) {
      icon = cluster[0].pinType.icon
    }

    // if(cluster.getChildCount() > 999) {
    //   className.push('icon-cluster-thousands')
    // } else if(cluster.getChildCount() > 99) {
    //   className.push('icon-cluster-hundreds')
    // } else if(cluster.getChildCount() > 9) {
    //   className.push('icon-cluster-tens')
    // }

    const iconSize = scale(0, totalEntries, cluster.getChildCount(), 35, 50)
    const fontSize = scale(0, totalEntries, cluster.getChildCount(), 24, 36)
    const lineHeight = scale(0, totalEntries, cluster.getChildCount(), 36, 50)

    return L.divIcon({
      html: `<img src="${icon}" /><span class="icon-cluster-text" style="font-size: ${fontSize}px; line-height: ${lineHeight}px">${cluster.getChildCount()}</span>`,
      className: className.join(' '),
      iconSize: L.point(iconSize, iconSize, true),
    })
  }
}

export const createMarkerIcon = (pin: IMapPinWithType) => {
  const { grouping, icon } = pin.pinType
  return L.divIcon({
    className: `icon-marker-${grouping}`,
    html: `<img src="${icon}" />`,
    iconSize: L.point(38, 38, true),
  })
}
