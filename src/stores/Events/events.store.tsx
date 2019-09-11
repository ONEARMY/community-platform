import { observable, computed } from 'mobx'
import { IEventFormInput, IEventDB, IEvent } from 'src/models/events.models'
import { ModuleStore } from '../common/module.store'
import { DatabaseV2 } from '../databaseV2'
import Filters from 'src/utils/filters'
import { ISelectedTags } from 'src/models/tags.model'
import { RootStore } from '..'
import { ILocation } from 'src/components/LocationSearch/LocationSearch'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { UserStore } from '../User/user.store'
import { IUser } from 'src/models/user.models'

export class EventStore extends ModuleStore {
  db: DatabaseV2
  userStore: UserStore
  constructor(private rootStore: RootStore) {
    super('v2_events')
    this.db = rootStore.dbV2
    this.allDocs$.subscribe((docs: IEventDB[]) => {
      this.allEvents = docs.sort((a, b) => (a.date > b.date ? 1 : -1))
    })
    this.selectedTags = {}
    this.initLocation()
  }
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allEvents: IEventDB[] = []
  @observable
  public activeEvent: IEventDB | undefined
  @observable
  public selectedTags: ISelectedTags
  @observable
  public selectedLocation: ILocation
  @computed get upcomingEvents() {
    return this.allEvents.filter(event => {
      // dates saved as yyyy-mm-dd string so convert to date object for comparison
      return Filters.newerThan(event.date, 'yesterday')
    })
  }
  @computed get pastEvents() {
    return this.allEvents.filter(event => {
      return Filters.olderThan(event.date, 'today')
    })
  }

  @computed get filteredEvents() {
    if (this.selectedLocation.value !== '') {
      const eventsByLocation = this.filterCollectionByLocation(
        this.upcomingEvents,
        this.selectedLocation,
      )
      return this.filterCollectionByTags(eventsByLocation, this.selectedTags)
    } else {
      return this.filterCollectionByTags(this.upcomingEvents, this.selectedTags)
    }
  }

  public updateSelectedTags(tagKey: ISelectedTags) {
    this.selectedTags = tagKey
  }
  public updateSelectedLocation(loc: ILocation) {
    this.selectedLocation = loc
  }
  public clearLocationSearch() {
    this.initLocation()
  }
  initLocation() {
    this.selectedLocation = {
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
    }
  }

  public async uploadEvent(values: IEventFormInput) {
    const user = this.rootStore.stores.userStore.user as IUser
    try {
      // add event meta fields and format date
      const event: IEvent = {
        ...values,
        date: new Date(Date.parse(values.date as string)).toISOString(),
        slug: stripSpecialCharacters(values.title),
        _createdBy: user.userName,
      }
      const doc = this.db.collection('v2_events').doc()
      return doc.set(event)
    } catch (error) {
      throw Error
    }
  }
}
