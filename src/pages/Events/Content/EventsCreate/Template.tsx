import { IEvent } from 'src/models/events.models'

const INITIAL_VALUES: Partial<IEvent> = {
  tags: {},
  location: {
    address: '',
    city: '',
    country: '',
    lat: 0,
    lng: 0,
  },
}

export default {
  INITIAL_VALUES,
}
