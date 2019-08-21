import { observable, action } from 'mobx'
import {
  IDiscussionComment,
  IDiscussionPost,
  IPostFormInput,
} from 'src/models/discussions.models'
import { Database } from '../database'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'
import { Subscription } from 'rxjs'
import { IDBEndpoint } from 'src/models/common.models'

export class DiscussionsStore extends ModuleStore {
  private allDiscussionComments$ = new Subscription()
  @observable
  public activeDiscussion: IDiscussionPost | undefined
  @observable
  public allDiscussionComments: IDiscussionComment[] = []
  @observable
  public allDiscussions: IDiscussionPost[]

  // when initiating, discussions will be fetched via common method in module.store.ts
  // keep results of allDocs and activeDoc in sync with local varialbes
  constructor() {
    super('v2_discussions')
    this.allDocs$.subscribe(docs => (this.allDiscussions = docs))
    this.activeDoc$.subscribe(doc => (this.activeDiscussion = doc))
    this._addCommentsSubscription()
  }

  @action
  public async setActiveDiscussion(slug: string) {
    this.setActiveDoc('slug', slug)
  }

  @action
  public createComment(
    discussionID: string,
    comment: string,
    repliesToId?: string,
  ) {
    // cast endpoing to IDB endpoints as no way in typescript ot handle regex for subcollection path
    const endpoint = `discussions/${discussionID}/comments` as IDBEndpoint
    const values: IDiscussionComment = {
      ...Database.generateDocMeta(endpoint),
      comment,
      _discussionID: discussionID,
      replies: [],
      repliesTo: repliesToId ? repliesToId : discussionID,
      type: 'discussionComment',
    }
    return Database.setDoc(
      `discussions/${discussionID}/comments/${values._id}`,
      values,
    )
  }

  @action
  public async deleteDiscussion(discussion: IDiscussionPost) {
    return Database.deleteDoc(`discussions/${discussion._id}`)
  }

  @action
  public async saveDiscussion(discussion: IDiscussionPost | IPostFormInput) {
    // differentiate between creating a new discussion and saving an old discussion
    let d: IDiscussionPost
    if (discussion.hasOwnProperty('_id')) {
      d = discussion as IDiscussionPost
      await Database.setDoc(`discussions/${d._id}`, d)
    } else {
      d = await this._createNewDiscussion(discussion as IPostFormInput)
      await Database.setDoc(`discussions/${d._id}`, d)
    }
    // after creation want to return so slug or id can be used for navigation etc.
    return d
  }

  private async _createNewDiscussion(values: IPostFormInput) {
    console.log('adding discussion', values)
    const discussion: IDiscussionPost = {
      ...Database.generateDocMeta('v2_discussions'),
      _commentCount: 0,
      _last3Comments: [],
      _usefulCount: 0,
      _viewCount: 0,
      content: values.content,
      isClosed: false,
      slug: stripSpecialCharacters(values.title),
      tags: values.tags,
      title: values.title,
      type: 'discussionQuestion',
    }
    await Database.checkSlugUnique('v2_discussions', discussion.slug)
    return discussion
  }

  // want to add an additional listener so that when the active discussion changes
  // any comments are also loaded from subcollection
  private _addCommentsSubscription() {
    this.allDiscussionComments$.unsubscribe()
    this.activeDoc$.subscribe(doc => {
      if (doc) {
        const endpoint = `discussions/${doc._id}/comments` as IDBEndpoint
        this.allDiscussionComments$ = Database.getCollection(
          endpoint,
        ).subscribe(docs => {
          this.allDiscussionComments = docs
        })
      }
    })
  }
}
