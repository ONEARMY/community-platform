import { IEventFilters, IEvent } from 'src/models/events.models'
import { MOCK_DB_META } from './db.mock'
import { MOCK_LOCATION } from './location.mock'

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
    title: 'Open Workspace and Free Lunch - Eindhoven',
    location: MOCK_LOCATION(1),
    ...MOCK_DB_META('event1'),
    date: new Date('Friday, January 2, 2015 12:59 AM').toISOString(),
    slug: 'open-workshop-and-free-lunch---brighton',
    tags: {},
    url: 'http://fakeurl.com',
    _createdBy: 'exampleUser',
    moderation: 'awaiting-moderation',
  },
  {
    title: 'Beach Clean in Brighton',
    location: MOCK_LOCATION(2),
    ...MOCK_DB_META('event2'),
    date: new Date('Friday, January 2, 2015 12:59 AM').toISOString(),
    slug: 'open-workshop-and-free-lunch---brighton',
    tags: {},
    url: 'http://fakeurl.com',
    _createdBy: 'exampleUser',
    moderation: 'rejected',
  },
  {
    title: 'Beach Clean in Tel Aviv',
    location: MOCK_LOCATION(2),
    ...MOCK_DB_META('event2'),
    date: new Date('Friday, January 2, 2015 12:59 AM').toISOString(),
    slug: 'open-workshop-and-free-lunch---brighton',
    tags: {},
    url: 'http://fakeurl.com',
    _createdBy: 'exampleUser',
    moderation: 'accepted',
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
