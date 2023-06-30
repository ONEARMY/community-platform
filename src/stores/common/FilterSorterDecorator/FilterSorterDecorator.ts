import Fuse from 'fuse.js'
import { action, observable } from 'mobx'
import type { IComment } from 'src/models'
import type { ICategory } from 'src/models/categories.model'

export interface IItem {
  _modified: string
  _created: string
  title?: string
  votedUsefulBy?: string[]
  category?: ICategory
  researchCategory?: ICategory
  updates?: {
    comments?: IComment[]
  }[]
}

export enum ItemSortingOption {
  None = 'None',
  Modified = 'Modified',
  Created = 'Created',
  MostUseful = 'MostUseful',
  Comments = 'Comments',
  Updates = 'Updates',
}

export class FilterSorterDecorator<T extends IItem> {
  @observable
  public activeSorter: ItemSortingOption

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
    this.activeSorter = ItemSortingOption.None
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
    /* eslint-disable no-console */
    console.log(listItems)

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
  public getSortedItems(): T[] {
    let validItems = this.allItems.slice()

    if (this.activeSorter) {
      switch (this.activeSorter) {
        case ItemSortingOption.Modified:
          validItems = this.sortByLatestModified(validItems)
          break

        case ItemSortingOption.Created:
          validItems = this.sortByLatestCreated(validItems)
          break

        case ItemSortingOption.MostUseful:
          validItems = this.sortByMostUseful(validItems)
          break

        case ItemSortingOption.Comments:
          validItems = this.sortByComments(validItems)
          break

        case ItemSortingOption.Updates:
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
    const sortingOption: ItemSortingOption =
      ItemSortingOption[query as keyof typeof ItemSortingOption]
    this.activeSorter = sortingOption

    return this.getSortedItems()
  }

  @action
  public search(listItem: T[], searchValue: string): any {
    if (searchValue) {
      const fuse = new Fuse(listItem, {
        keys: this.SEARCH_WEIGHTS,
      })

      // Currently Fuse returns objects containing the search items, hence the need to map. https://github.com/krisk/Fuse/issues/532
      return fuse.search(searchValue).map((v) => v.item)
    } else {
      return listItem
    }
  }
}
