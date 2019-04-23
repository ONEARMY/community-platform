import { observable, action } from 'mobx'
import { afs } from '../../utils/firebase'
import { IHowto } from 'src/models/howto.models'
import { Database } from 'src/stores/database'

export class HowtoStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowto | undefined
  @observable
  public allHowtos: IHowto[] = []

  // call getDocList to query 'Howtos' from db and map response to docs observable
  @action
  public async getDocList() {
    const ref = await afs
      .collection('documentation')
      .orderBy('_created', 'desc')
      .get()

    this.allHowtos = ref.docs.map(doc => doc.data() as IHowto)
  }
  @action
  public async getDocBySlug(slug: string) {
    const ref = afs
      .collection('documentation')
      .where('slug', '==', slug)
      .limit(1)
    const collection = await ref.get()
    const activeHowto =
      collection.docs.length > 0
        ? (collection.docs[0].data() as IHowto)
        : undefined
    this.activeHowto = activeHowto
    return activeHowto
  }

  public isSlugUnique = async (slug: string) => {
    try {
      await Database.checkSlugUnique('documentation', slug)
    } catch (e) {
      return 'How-to titles must be unique, please try being more specific'
    }
  }
}
