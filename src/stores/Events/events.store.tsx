import { observable, computed } from 'mobx'
import { IEvent, IEventFormInput } from 'src/models/events.models'
import { ModuleStore } from '../common/module.store'
import { Database } from '../database'
import Filters from 'src/utils/filters'
import { ISelectedTags } from 'src/models/tags.model'
import { RootStore } from '..'
import { ILocation } from 'src/components/LocationSearch/LocationSearch'

export class EventStore extends ModuleStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allEvents: IEvent[]
  @observable
  public activeEvent: IEvent | undefined
  @observable
  public selectedTags: ISelectedTags
  @observable
  public selectedLocation: ILocation
  @observable
  public eventViewType: 'map' | 'list'
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
    return this.selectedLocation.value !== ''
      ? this.filteredCollectionByTags(
          this.filteredCollectionByLocation(
            this.upcomingEvents,
            this.selectedLocation,
          ),
          this.selectedTags,
        )
      : this.filteredCollectionByTags(this.upcomingEvents, this.selectedTags)
  }

  constructor(rootStore: RootStore) {
    super('v2_events')
    this.allDocs$.subscribe((docs: IEvent[]) => {
      this.allEvents = docs.sort((a, b) => (a.date > b.date ? 1 : -1))
    })
    this.selectedTags = {}
    this.initLocation()
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

  public async uploadEvent(values: IEventFormInput, id: string) {
    console.log('uploading event', id)
    console.log('values', values)
    try {
      const event: IEventFormInput = {
        ...Database.generateDocMeta('v2_events'),
        ...values,
        // convert string yyyy-mm-dd format to time string
        date: new Date(Date.parse(values.date as string)).toISOString(),
      }
      console.log('populating database', event)
      this.updateDatabase(event)
      console.log('event added')
      return event
    } catch (error) {
      console.log('error', error)
      throw new Error(error.message)
    }
  }

  public setEventView(type: 'map' | 'list') {
    this.eventViewType = type
    console.log('event view type', this.eventViewType)
  }

  public generateID = () => {
    return Database.generateDocId('v2_events')
  }
  private updateDatabase(event: IEventFormInput) {
    return Database.setDoc(`v2_events/${event._id}`, event)
  }
}
