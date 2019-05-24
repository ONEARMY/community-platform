import { observable, action } from 'mobx'
import { afs } from 'src/utils/firebase'
import { IEvent, IEventFormInput } from 'src/models/events.models'
import { ModuleStore } from '../common/module.store'
import { Database } from '../database'

export class EventStore extends ModuleStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allEvents: IEvent[]
  @observable
  public activeEvent: IEvent | undefined
  @observable
  public eventViewType: 'map' | 'list'

  constructor() {
    super('eventsV1')
  }

  @action
  public async getEventsList() {
    const ref = await afs.collection('events').get()
    this.allEvents = ref.docs.map(doc => doc.data() as IEvent)
    console.log('events retrieved', this.allEvents)
  }

  public async getEventBySlug(slug: string) {
    const ref = afs
      .collection('events')
      .where('slug', '==', slug)
      .limit(1)
    const collection = await ref.get()
    this.activeEvent =
      collection.docs.length > 0
        ? (collection.docs[0].data() as IEvent)
        : undefined
    return this.activeEvent
  }

  public async uploadEvent(values: IEventFormInput, id: string) {
    console.log('uploading event', id)
    console.log('values', values)
    try {
      const event: IEventFormInput = {
        ...values,
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
