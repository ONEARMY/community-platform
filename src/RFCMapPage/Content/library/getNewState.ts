import { 
  IMapControllerState, IMapControllerActions, IMapPinGrouped, IFilters, IPinProps
} from '../../types'
import { groupPins, unGroupPins, getFilters } from './utils'

const getFilteredPins = (mapPinsGrouped: IMapPinGrouped, filters: IFilters): IPinProps[] => {
  const activeFilters = Object.values(filters).filter(f => f.active).map(f => f.name)
  const result: IPinProps[] = [] 
  activeFilters.forEach(f => result.push(...mapPinsGrouped[f]))
  return result
}

export const getNewState = (actualState: IMapControllerState, action: IMapControllerActions): IMapControllerState =>  {
  let newState = { ...actualState } 

  switch (action.type) {
    case "SET_DATA":
      const mapPinsGrouped = groupPins(action.payload)
      const filters = getFilters(mapPinsGrouped)
      newState = {...actualState, mapPinsGrouped, filters, filteredPins: unGroupPins(mapPinsGrouped) }     
      break;      
    case "SET_FILTER":
      const newFilter = {...actualState.filters}
      newFilter[action.payload.name].active = action.payload.active
      const filteredPins = getFilteredPins(actualState.mapPinsGrouped, newFilter) 
      newState = {...actualState, filters:newFilter, filteredPins }     
      break;
  }
  return newState
}
