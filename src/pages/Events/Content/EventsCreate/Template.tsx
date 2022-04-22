import type { IEventFormInput } from 'src/models/events.models'

const INITIAL_VALUES: IEventFormInput = {
  title: '',
  date: '',
  url: '',
  tags: {},
  location: {
    name: '',
    country: '',
    countryCode: '',
    administrative: '',
    latlng: {
      lat: 0,
      lng: 0,
    },
    postcode: '',
    value: '',
  },
}

export default {
  INITIAL_VALUES,
}
