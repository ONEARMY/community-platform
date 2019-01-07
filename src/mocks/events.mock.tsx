import { IEventFilters, IEvent } from 'src/models/events.models'

const d = new Date()
export const EVENT_FILTERS: IEventFilters = {
  dateFrom: d,
  dateTo: new Date(d.getFullYear() + 1, d.getMonth(), d.getDay()),
  location: '',
  project: '',
  type: 'All',
}

export const EVENT_PROJECTS = [
  { label: 'All Projects', value: '' },
  { label: 'Precious Plastic', value: 'precious-plastic' },
  { label: 'Project Kamp', value: 'project-kamp' },
  { label: 'Story Hopper', value: 'story-hopper' },
]

export const EVENT_LOCATIONS = [
  { label: 'Everywhere', value: '' },
  { label: 'Netherlands', value: 'NL' },
]

export const EVENT_TYPES = [
  'All',
  'Workshops',
  'Community Meetups',
  'Exhibitions',
  'Open Workspace',
  'Talks',
  'Clean Ups',
  'Everything Else',
]

export const TIMEFRAMES = [
  { value: 'weekend', label: 'This Weekend' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
]

export const EVENTS: IEvent[] = [
  {
    name: 'Open Workspace and Free Lunch - Eindhoven',
    location: {
      lat: 51.4416,
      lng: 5.4697,
      country: 'NL',
      city: 'Eindhoven',
    },
    description:
      'The family moved to New York City in 1940. The next year Eisuke was transferred from New York City',
    host: 'PlasticNL',
    image: 'https://picsum.photos/200/300/?random',
    date: new Date(2019, 6, 13),
    type: 'Workshops',
    _slug: 'open-workshop-and-free-lunch---brighton',
    _created: new Date(),
    _modified: new Date(),
  },
  {
    name: 'Beach Clean in Brighton',
    location: {
      lat: 50.8225,
      lng: 0.1372,
      country: 'UK',
      city: 'Brighton',
    },
    description:
      'In meteorology, a cloud is an aerosol ocnsisting of a visible mass of rain dropletx, frozen crystals, or other particles suspended in the atmospher',
    host: 'BeachCleans',
    image: 'https://picsum.photos/150/100/?random',
    date: new Date(2019, 6, 26),
    type: 'Workshops',
    _slug: 'open-workshop-and-free-lunch---brighton',
    _created: new Date(),
    _modified: new Date(),
  },
]

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
