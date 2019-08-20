import { observable, computed } from 'mobx'
import { IEvent, IEventFormInput } from 'src/models/events.models'
import { ModuleStore } from '../common/module.store'
import { Database } from '../database'
import Filters from 'src/utils/filters'

export class EventStore extends ModuleStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allEvents: IEvent[]
  @observable
  public activeEvent: IEvent | undefined
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

  constructor() {
    super('v2_events')
    this.allDocs$.subscribe((docs: IEvent[]) => {
      this.allEvents = docs.sort((a, b) => (a.date > b.date ? 1 : -1))
    })
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
