import { memo } from 'react'
import { IMapControlsProps, IMapFilter } from '../../../types'

import Checkbox from '../filterOne/Checkbox'

const sortByGrouping = (a: IMapFilter, b: IMapFilter): number => {
  if (a.grouping === b.grouping) {
    return 0
  } else if (a.grouping > b.grouping) {
    return 1
  } else {
    return -1
  }
}

const MapControls = ({ filters, onChange }: IMapControlsProps) => {
  return (
    <ul style={{ margin: 'auto', padding: '5px', backgroundColor: 'white' }}>
      {Object.values(filters).sort((a, b) => sortByGrouping(a, b)).map(f =>
        <li key={f.name} style={{ listStyleType: 'none' }}>
          <Checkbox key={f.name} name={f.name} label={`${f.displayName} (${f._count})`} checked={f.active} onChange={onChange} />
        </li>
      )}
    </ul>
  )
}

export default memo(MapControls)