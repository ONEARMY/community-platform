import { IMapPin } from 'src/models/map.model'
import { toTimestamp } from 'src/utils/helpers'

export const MAP_PINS: IMapPin[] = [
  {
    location: {
      lat: 51.4416,
      lng: 5.4697,
      country: 'Netherlands',
      countryCode: 'NL',
      name: 'Eindhoven',
    },
    _id: 'pin1',
    type: 'machine_builder',
    _deleted: false,
    _createdBy: 'myUserName',
    _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
    _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  },
  {
    location: {
      lat: 50.8225,
      lng: 0.1372,
      country: 'United Kingdom',
      countryCode: 'UK',
      name: 'Brighton',
    },
    _id: 'pin2',
    type: 'wants_to_get_started',
    _deleted: false,
    _createdBy: 'anotherUsername',
    _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
    _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  },
]
