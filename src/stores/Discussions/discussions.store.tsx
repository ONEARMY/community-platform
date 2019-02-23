import { observable, action } from 'mobx'
import {
  IDiscussionComment,
  IDiscussionPost,
  IPostFormInput,
} from 'src/models/discussions.models'
import { Database } from '../database'
import helpers from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'

export class DiscussionsStore extends ModuleStore {
  @observable
  public activeDiscussion: IDiscussionPost | undefined
  @observable
  public allDiscussionComments: IDiscussionComment[] = []
  @observable
  public allDiscussions: IDiscussionPost[]

  // when initiating discussions will be fetched from module.store.ts method
  // keep results of allDocs and activeDoc in sync with local varialbes
  constructor() {
    super('discussions')
    this.allDocs$.subscribe(docs => (this.allDiscussions = docs))
    this.activeDoc$.subscribe(doc => (this.activeDiscussion = doc))
  }

  @action
  public async setActiveDiscussion(slug: string) {
    this.setActiveDoc('slug', slug)
  }

  @action
  public async createDiscussion(values: IPostFormInput) {
    console.log('adding discussion', values)
    const discussion: IDiscussionPost = {
      _commentCount: 0,
      _created: Database.generateTimestamp(),
      _id: Database.generateId('discussions'),
      _last3Comments: [],
      _lastResponse: null,
      _modified: Database.generateTimestamp(),
      _usefullCount: 0,
      _viewCount: 0,
      _deleted: false,
      content: values.content,
      createdBy: Database.getUser() as string,
      isClosed: false,
      slug: helpers.stripSpecialCharacters(values.title),
      tags: values.tags,
      title: values.title,
      type: 'discussionQuestion',
    }
    await this.saveDiscussion(discussion)
    return discussion
  }

  public async saveDiscussion(discussion: IDiscussionPost) {
    return Database.setDoc(`discussions/${discussion._id}`, discussion)
  }
}
