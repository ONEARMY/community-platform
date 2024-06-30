import { OsmGeocoding } from '@onearmy.apps/components'

import { logger } from '../../logger'
import { getLocationData } from '../../utils/getLocationData'

import type { FieldProps } from './types'

interface IExtendedFieldProps extends FieldProps {
  // add additional onChange style method to respond more directly to value changes
  // without need for react-final-form listener
  customChange?: (location) => void
}

export const LocationSearchField = ({
  input,
  customChange,
}: IExtendedFieldProps) => (
  <div style={{ position: 'relative', height: '44px' }}>
    <div style={{ position: 'absolute', width: '100%' }}>
      <OsmGeocoding
        callback={async (data) => {
          logger.debug(data, 'LocationSearch.field.ReactOsmGeocoding')
          if (data.lat && data.lon) {
            // onPositionChanged({
            // lat: data.lat,
            // lng: data.lon,
            // })
            // setCenter([data.lat, data.lon])
            // setZoom(15)

            const location = await getLocationData({
              lat: data.lat,
              lng: data.lon,
            })

            input.onChange(location)
            if (customChange) {
              customChange(location)
            }
            input.onBlur()
          }
        }}
        countrycodes=""
        acceptLanguage="en"
      />
    </div>
  </div>
)
