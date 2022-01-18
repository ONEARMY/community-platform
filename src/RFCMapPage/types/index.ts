import { IMapPin, IMapGrouping } from './legacy'
export * from './legacy'
export interface IMapFilter extends IMapGrouping {
  name: string
  active: boolean
}
export interface IFilters {
  [name: string]: IMapFilter
}
export interface IFilterChange {
  name: string
  active: boolean
}
export interface IPinProps extends IMapPin {
  icon: string
}
export interface IMapPinGrouped {
  [name: string]: IPinProps[]
}
export interface ILeafletMapProps {
  filteredPins?: IPinProps[]
  filters?: IFilters
  onChange?: (e: IFilterChange) => void  
  onClick?: (id: string) => void
  zoom: number
  center: [number, number]
  style: Record<string, unknown>
  iconUrlBase: string
}
export interface ICheckboxProps {
  name: string
  label: string
  checked: boolean
  style?: Record<string, unknown>
  onChange: (e: any) => void
}
export interface IMapControlsProps {
  filters: IFilters
  onChange: (e: IFilterChange) => void
} 
export interface IMapControllerProps {
  children: React.ReactNode
  mapPins: IMapPin[]
  handleClickOnPin: (id: string) => void
}

export interface IMapControllerState {
  mapPinsGrouped: IMapPinGrouped
  filteredPins: IPinProps[]
  filters: IFilters
}
export type IMapControllerActions = 
| { type: "SET_DATA", payload: IMapPin[] }
| { type: "SET_FILTER", payload: IFilterChange }
