import { observable, action } from 'mobx'
import {
  IDiscussionComment,
  IDiscussionPost,
} from 'src/models/discussions.models'
import { Database } from '../database'
import { Subject } from 'rxjs'

export class DiscussionsStore {
  isLoaded = new Subject<boolean>()
  // we have two property relating to docs that can be observed
  @observable
  public activeDiscussion: IDiscussionPost | undefined
  @observable
  public allDiscussionComments: IDiscussionComment[] = []
  @observable
  public allDiscussions: IDiscussionPost[] = []

  // call getDocList to query 'discussions' from db and map response to docs observable
  // note, the action will first quickly emit any cached results, followed by latest from server
  // and will continue to emit any changes
  @action
  public getDiscussionList() {
    Database.getCollection('discussions').subscribe(data => {
      console.log('data received', data)
      this.allDiscussions = data as IDiscussionPost[]
      if (data.length > 0) {
        this.isLoaded.complete()
      }
    })
  }
  // when getting a document by slug we want to do a quick query of current list of docs
  // in case of navigating directly to a page where this function is called on init we want to ensure docs loaded first
  // if cache loaded and
  @action
  public async getDiscussionBySlug(slug: string) {
    this.activeDiscussion = undefined
    const discussion = this.allDiscussions.find(d => d.slug === slug)
    if (!discussion) {
      // if data isn't loaded from cache yet try again once it is
      if (!this.isLoaded.isStopped) {
        this.isLoaded.subscribe(
          data => null,
          err => null,
          () => this.getDiscussionBySlug(slug),
        )
      } else {
        // cache data is loaded but doc doesn't exist. Query live server
        const results = await Database.queryCollection(
          'discussions',
          'slug',
          '==',
          slug,
        )
        this.activeDiscussion = results[0] as IDiscussionPost
      }
    } else {
      this.activeDiscussion = discussion
    }
  }

  public async saveDiscussion(discussion: IDiscussionPost) {
    return Database.setDoc(`discussions/${discussion._id}`, discussion)
  }
}
