import { observable, action } from 'mobx'
import { afs } from 'src/utils/firebase'
import { IEvent } from 'src/models/events.models'

export class EventStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allEvents: IEvent[]
  @observable
  public activeEvent: IEvent | undefined
  @observable
  public eventViewType: 'map' | 'list'

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

  public setEventView(type: 'map' | 'list') {
    this.eventViewType = type
    console.log('event view type', this.eventViewType)
  }
}
