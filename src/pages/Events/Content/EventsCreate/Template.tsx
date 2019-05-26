import { IEvent } from 'src/models/events.models'

const INITIAL_VALUES: Partial<IEvent> = {
  tags: {},
  location: {
    address: '',
    name: '',
    country: '',
    countryCode: '',
    lat: 0,
    lng: 0,
  },
}

export default {
  INITIAL_VALUES,
}
