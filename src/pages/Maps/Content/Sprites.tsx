import L from 'leaflet'
import './sprites.css'
import { IMapPin } from 'src/models/maps.models'

// mmm curry
export const createClusterIcon = clusterKey => {
  return cluster => {
    return L.divIcon({
      html: `${cluster.getChildCount()}`,
      className: `icon-cluster-${clusterKey}`,
      iconSize: L.point(35, 35, true),
    })
  }
}

export const createMarkerIcon = (pin: IMapPin) => {
  const { grouping, icon } = pin.pinType
  return icon === ''
    ? L.divIcon({
        className: `icon-marker-${grouping}`,
        html: `&nbsp;`,
        iconSize: L.point(13, 13, true),
      })
    : L.divIcon({
        className: `icon-marker-${grouping}`,
        html: `${icon}`,
        iconSize: L.point(23, 23, true),
      })
}
