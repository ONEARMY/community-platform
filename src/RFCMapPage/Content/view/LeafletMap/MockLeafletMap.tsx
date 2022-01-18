import { ILeafletMapProps } from '../../../types'
import MapControls from '../MapControls/MapControls'

export default ({ filteredPins = [], filters = {}, onChange = () => {}, onClick = () => {} }: ILeafletMapProps) => {
  return (
    <div>
      <MapControls filters={filters} onChange={onChange} />

      <p>filteredPins.length: <span data-testid="filteredPinsCounter">{filteredPins.length}</span></p>
      <ul>{filteredPins.map(d =>
        <li key={d._id}><button onClick={() => onClick(d._id)}>{d._id}</button>{` ${d.type} ${d.subType ? d.subType : ''}`}</li>
        )}</ul>
    </div>
  )
}
