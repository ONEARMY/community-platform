import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx'
import { cloneDeep } from 'lodash'
import { createContext, useContext } from 'react'
import { logger } from 'src/logger'
import type { IUser } from 'src/models'
import { formatLowerNoSpecial } from 'src/utils/helpers'
import type { IQuestion, IQuestionDB } from '../../models/question.models'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '../index'
import type { DocReference } from '../databaseV2/DocReference'

const COLLECTION_NAME = 'question'

export class QuestionStore extends ModuleStore {
  @observable
  public allQuestionItems: IQuestion.Item[] = []

  @observable
  public activeQuestionItem: IQuestion.Item | undefined

  @observable
  public updateUploadStatus: IUpdateUploadStatus =
    getInitialUpdateUploadStatus()

  constructor(rootStore: RootStore) {
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    super.init()

    this.allDocs$.subscribe((docs: IQuestion.Item[]) => {
      logger.debug('docs', docs)
      const activeItems = [...docs].filter((doc) => {
        return !doc._deleted
      })

      runInAction(() => {
        this.allQuestionItems = activeItems
      })
    })
  }

  @action
  public async setActiveQuestionItemBySlug(slug?: string) {
    logger.debug(`setActiveQuestionItemBySlug:`, { slug })
    let activeQuestionItem: IQuestionDB | undefined = undefined

    if (slug) {
      activeQuestionItem = await this._getQuestionItemBySlug(slug)

      if (activeQuestionItem) {
        activeQuestionItem.description = changeUserReferenceToPlainText(
          activeQuestionItem.description,
        )
      }
    }

    runInAction(() => {
      this.activeQuestionItem = activeQuestionItem
    })
    return activeQuestionItem
  }

  public async addSubscriberToQuestionArticle(
    docId: string,
    userId: string,
  ): Promise<void> {
    const dbRef = this.db.collection<IQuestion.Item>(COLLECTION_NAME).doc(docId)

    const QuestionData = await toJS(dbRef.get('server'))
    if (QuestionData && !(QuestionData?.subscribers || []).includes(userId)) {
      const updatedItem = await this._updateQuestionItem(dbRef, {
        ...QuestionData,
        subscribers: [userId].concat(QuestionData?.subscribers || []),
      })

      if (updatedItem) {
        this.setActiveQuestionItemBySlug(updatedItem.slug)
      }
    }

    return
  }

  public async removeSubscriberFromQuestionArticle(
    docId: string,
    userId: string,
  ): Promise<void> {
    const dbRef = this.db.collection<IQuestion.Item>(COLLECTION_NAME).doc(docId)

    const QuestionData = await toJS(dbRef.get('server'))
    if (QuestionData) {
      const updatedItem = await this._updateQuestionItem(dbRef, {
        ...QuestionData,
        subscribers: (QuestionData?.subscribers || []).filter(
          (id) => id !== userId,
        ),
      })

      if (updatedItem) {
        this.setActiveQuestionItemBySlug(updatedItem.slug)
      }
    }

    return
  }

  @action
  public async deleteQuestion(id: string) {
    try {
      const dbRef = this.db.collection<IQuestionDB>(COLLECTION_NAME).doc(id)
      const QuestionData = await toJS(dbRef.get('server'))

      const user = this.activeUser

      if (id && QuestionData && user) {
        await this._updateQuestionItem(dbRef, {
          ...QuestionData,
          _deleted: true,
        })

        if (this.activeQuestionItem !== undefined) {
          this.allQuestionItems = this.allQuestionItems.filter(
            (QuestionItem) => {
              return QuestionItem._id !== QuestionData._id
            },
          )
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  private async addUserReference(str: string): Promise<{
    text: string
    users: string[]
  }> {
    const { text, mentionedUsers: users } = await changeMentionToUserReference(
      str,
      this.userStore,
    )
    return {
      text,
      users,
    }
  }

  public async uploadQuestion(values: IQuestion.FormInput) {
    logger.debug('uploading question')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .doc(values._id)
    const user = this.activeUser as IUser

    try {
      // create previousSlugs based on available slug or title
      const previousSlugs: string[] = []
      if (values.slug) {
        previousSlugs.push(values.slug)
      } else if (values.title) {
        const titleToSlug = formatLowerNoSpecial(values.title)
        previousSlugs.push(titleToSlug)
      }

      const QuestionItem: IQuestion.Item = {
        ...values,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        _deleted: false,
        moderation: values.moderation ? values.moderation : 'accepted', // No moderation needed for Questiones for now
      }
      logger.debug('populating database', QuestionItem)
      // set the database document
      const updatedItem = await this._updateQuestionItem(
        dbRef,
        QuestionItem,
        true,
      )
      logger.debug('post added')
      if (updatedItem) {
        this.setActiveQuestionItemBySlug(updatedItem.slug)
      }
    } catch (error) {
      logger.debug('error', error)
      //TODO: Add error handling here :(
      //throw new Error(error.message)
    }
  }

  @computed
  get userVotedActiveQuestionUseful(): boolean {
    if (!this.activeUser) return false
    return (this.activeQuestionItem?.votedUsefulBy || []).includes(
      this.activeUser.userName,
    )
  }

  @computed
  get userHasSubscribed(): boolean {
    return (
      this.activeQuestionItem?.subscribers?.includes(
        this.activeUser?.userName ?? '',
      ) ?? false
    )
  }

  @computed
  get votedUsefulCount(): number {
    return (this.activeQuestionItem?.votedUsefulBy || []).length
  }

  /**
   * Updates supplied dbRef after
   * converting @mentions to user references
   * on all required properties within QuestionItem object.
   *
   */
  private async _updateQuestionItem(
    dbRef: DocReference<IQuestion.Item>,
    QuestionItem: IQuestion.Item,
    setLastEditTimestamp = false,
  ) {
    const { text: QuestionDescription, users } = await this.addUserReference(
      QuestionItem.description,
    )
    logger.debug('updateQuestionItem', {
      QuestionItem,
    })

    const mentions: any = []

    ;(users || []).map((username) => {
      mentions.push({
        username,
        location: 'description',
      })
    })

    if (QuestionItem.previousSlugs === undefined) {
      QuestionItem.previousSlugs = []
    }

    if (!QuestionItem.previousSlugs.includes(QuestionItem.slug)) {
      QuestionItem.previousSlugs.push(QuestionItem.slug)
    }

    await dbRef.set(
      {
        ...cloneDeep(QuestionItem),
        description: QuestionDescription,
      },
      {
        set_last_edit_timestamp: setLastEditTimestamp,
      },
    )

    return await dbRef.get()
  }

  private async _getQuestionItemBySlug(
    slug: string,
  ): Promise<IQuestionDB | undefined> {
    const collection = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)

    if (collection && collection.length) {
      return collection[0]
    }

    const previousSlugCollection = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('previousSlugs', 'array-contains', slug)

    if (previousSlugCollection && previousSlugCollection.length) {
      return previousSlugCollection[0]
    }

    return undefined
  }
}

export interface IUpdateUploadStatus {
  Start: boolean
  Images: boolean
  Files: boolean
  Database: boolean
  Complete: boolean
}

const getInitialUpdateUploadStatus = (): IUpdateUploadStatus => ({
  Start: false,
  Images: false,
  Files: false,
  Database: false,
  Complete: false,
})

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the QuestionStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const QuestionStoreContext = createContext<QuestionStore>(null as any)
export const useQuestionStore = () => useContext(QuestionStoreContext)
