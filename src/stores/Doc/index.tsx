import { observable, action } from 'mobx';
import { db } from "../../utils/firebase";

export default class Doc {

  @observable
  public docs: any[] = [];

  @action
  public async getDocList() {
    const ref = await db.collection("tutorials").get();
    this.docs = ref.docs.map(doc => doc.data());
  }
}
