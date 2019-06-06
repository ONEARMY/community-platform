import L from 'leaflet'
import './sprites.css'

// mmm curry
export const createClusterIcon = entityType => {
  return cluster => {
    return L.divIcon({
      html: `${cluster.getChildCount()}`,
      className: `icon-cluster-${entityType}`,
      iconSize: L.point(35, 35, true),
    })
  }
}

export const createMarkerIcon = data => {
  const { entityType } = data
  return data.entityType === 'individual'
    ? L.divIcon({
        className: `icon-marker-${entityType}`,
        html: `&nbsp;`,
        iconSize: L.point(12, 12, true),
      })
    : L.divIcon({
        className: `icon-marker-${entityType}`,
        html: `${data.pinType.charAt(0).toUpperCase()}`,
        iconSize: L.point(23, 23, true),
      })
}
