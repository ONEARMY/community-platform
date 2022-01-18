import React, { useEffect, useState, memo } from 'react'
import { IMapControllerState, IMapControllerProps, IFilterChange } from '../types'
import { getNewState } from './library/getNewState'

const getInitialState = (): IMapControllerState => {
  return {
    mapPinsGrouped: {},
    filteredPins: [],
    filters: {}
  }
}

export const MapController = ({ children, mapPins, handleClickOnPin }: IMapControllerProps) => {
  const [state, setState] = useState<IMapControllerState>(getInitialState())

  // Update the internal state when mapPins change
  useEffect(() => {
    setState(actualState => getNewState(actualState, { type: "SET_DATA", payload: mapPins }))
  }, [mapPins])

  const handleFilterChange = (newFilter: IFilterChange): void => {
    setState(actualState => getNewState(actualState, { type: "SET_FILTER", payload: newFilter }))
  }

  // children with updated data  
  const Content = React.Children.map(children, child => {
    /* istanbul ignore else: We only test valid components  */
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        filteredPins: state.filteredPins,
        filters: state.filters,
        onChange: handleFilterChange,
        onClick: handleClickOnPin
      });
    }
    /* istanbul ignore next: We only test valid components  */
    return child;
  })
  return (
    <div>{Content}</div>
  )
}

export default memo(MapController)