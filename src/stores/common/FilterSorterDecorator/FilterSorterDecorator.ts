import { action, observable } from 'mobx'
import type { IComment } from 'src/models'
import type { ICategory } from 'src/models/categories.model'

export interface IItem {
  _modified: string
  _created: string
  votedUsefulBy?: string[]
  category?: ICategory
  researchCategory?: ICategory
  updates?: {
    comments?: IComment[]
  }[]
}

export class FilterSorterDecorator<T extends IItem> {
  @observable
  public searchValue: string

  @observable
  public activeSorter: string

  @observable
  public allItems: T[] = []

  public SEARCH_WEIGHTS: { name: string; weight: number }[]

  public calculateTotalComments = (item: T) => {
    if (item.updates) {
      const commentOnUpdates = item.updates.reduce((totalComments, update) => {
        const updateCommentsLength = update.comments
          ? update.comments.length
          : 0
        return totalComments + updateCommentsLength
      }, 0)

      return commentOnUpdates ? commentOnUpdates : '0'
    } else {
      return '0'
    }
  }

  constructor(_allItems: T[]) {
    this.searchValue = ''
    this.activeSorter = 'comments'
    this.allItems = _allItems
    this.SEARCH_WEIGHTS = [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.2 },
      { name: '_createdBy', weight: 0.15 },
      { name: 'steps.title', weight: 0.1 },
      { name: 'steps.text', weight: 0.05 },
    ]
  }

  public filterByCategory(listItems: T[] = [], category: string): T[] {
    return category
      ? listItems.filter((obj) => {
          if (obj.category) return obj.category?.label === category
          else {
            return obj.researchCategory?.label === category
          }
        })
      : listItems
  }

  private sortByLatestModified(listItems: T[]) {
    const _listItems = listItems || this.allItems
    return _listItems.sort((a, b) => (a._modified < b._modified ? 1 : -1))
  }

  private sortByLatestCreated(listItems: T[]) {
    const _listItems = listItems || this.allItems
    return _listItems.sort((a, b) => (a._created < b._created ? 1 : -1))
  }

  private sortByMostUseful(listItems: T[]) {
    const _listItems = listItems || this.allItems
    return _listItems.sort((a, b) =>
      (a.votedUsefulBy || []).length < (b.votedUsefulBy || []).length ? 1 : -1,
    )
  }

  private sortByUpdates(listItems: T[]) {
    const _listItems = listItems || this.allItems
    return _listItems.sort((a, b) =>
      (a.updates || []).length < (b.updates || []).length ? 1 : -1,
    )
  }

  private sortByComments(listItems: T[]) {
    const _listItems = listItems || this.allItems

    return _listItems.sort((a, b) =>
      this.calculateTotalComments(a) < this.calculateTotalComments(b) ? 1 : -1,
    )
  }

  @action
  public getSortedItems(): any[] {
    let validItems = this.allItems.slice()

    if (this.activeSorter) {
      switch (this.activeSorter) {
        case 'modified':
          validItems = this.sortByLatestModified(validItems)
          break

        case 'created':
          validItems = this.sortByLatestCreated(validItems)
          break

        case 'most useful':
          validItems = this.sortByMostUseful(validItems)
          break

        case 'comments':
          validItems = this.sortByComments(validItems)
          break

        case 'updates':
          validItems = this.sortByUpdates(validItems)
          break

        default:
          validItems = this.sortByLatestModified(validItems)
          break
      }
    }

    return validItems
  }

  @action
  public sort(query: string): any[] {
    this.activeSorter = query

    return this.getSortedItems()
  }
}
