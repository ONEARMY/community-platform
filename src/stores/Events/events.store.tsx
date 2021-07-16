import { observable, computed, toJS, makeObservable } from 'mobx'
import { IEventFormInput, IEventDB, IEvent } from 'src/models/events.models'
import { ModuleStore } from '../common/module.store'
import Filters from 'src/utils/filters'
import { ISelectedTags } from 'src/models/tags.model'
import { RootStore } from '..'
import { ILocation } from 'src/models/common.models'
import {
  stripSpecialCharacters,
  hasAdminRights,
  needsModeration,
} from 'src/utils/helpers'
import { IUser } from 'src/models/user.models'

export class EventStore extends ModuleStore {
  constructor(rootStore: RootStore) {
    super(rootStore, 'events')
    this.allDocs$.subscribe((docs: IEventDB[]) => {
      this.allEvents = docs.sort((a, b) => (a.date > b.date ? 1 : -1))
    })
    makeObservable(this)
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
    // HACK - ARH - 2019/12/11 filter unaccepted events, should be done serverside
    const activeUser = this.activeUser
    const isAdmin = hasAdminRights(activeUser)

    return this.allEvents.filter(event => {
      // dates saved as yyyy-mm-dd string so convert to date object for comparison
      return (
        Filters.newerThan(event.date, 'yesterday') &&
        (event.moderation === 'accepted' ||
          (activeUser && event._createdBy === activeUser.userName) ||
          (isAdmin && event.moderation !== 'rejected'))
      )
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

  // Moderate Event
  public async moderateEvent(event: IEvent) {
    if (!hasAdminRights(toJS(this.activeUser))) {
      return false
    }
    const ref = this.db.collection('events').doc(event._id)
    return ref.set(toJS(event))
  }

  public needsModeration(event: IEvent) {
    return needsModeration(event, toJS(this.activeUser))
  }

  public async uploadEvent(values: IEventFormInput) {
    const user = this.activeUser as IUser
    try {
      // add event meta fields and format date
      const event: IEvent = {
        ...values,
        date: new Date(Date.parse(values.date as string)).toISOString(),
        slug: stripSpecialCharacters(values.title),
        _createdBy: user.userName,
        moderation: 'awaiting-moderation',
      }
      const doc = this.db.collection('events').doc()
      return doc.set(event)
    } catch (error) {
      throw Error
    }
  }
}
