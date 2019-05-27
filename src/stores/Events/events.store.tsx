import { observable, computed } from 'mobx'
import { IEvent, IEventFormInput } from 'src/models/events.models'
import { ModuleStore } from '../common/module.store'
import { Database } from '../database'
import Filters from 'src/utils/filters'
import { toDate } from 'src/utils/helpers'

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
    super('eventsV1')
    this.allDocs$.subscribe((docs: IEvent[]) => {
      // convert firestore timestamp back to date objects
      this.allEvents = [
        ...docs.map(doc => ({ ...doc, date: toDate(doc.date) })),
      ]
    })
  }

  public async uploadEvent(values: IEventFormInput, id: string) {
    console.log('uploading event', id)
    console.log('values', values)
    try {
      const event: IEventFormInput = {
        ...Database.generateDocMeta('eventsV1'),
        ...values,
        // convert string yyyy-mm-dd format to timestamp
        date: Database.generateTimestamp(
          new Date(Date.parse(values.date as string)),
        ),
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
    return Database.generateDocId('eventsV1')
  }
  private updateDatabase(event: IEventFormInput) {
    return Database.setDoc(`eventsV1/${event._id}`, event)
  }
}
