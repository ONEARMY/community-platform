export interface Result {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: Array<string>
  display_name: string
  lat: string
  lon: string
  class: string
  type: string
  importance: number
  icon?: string
}
