import Fuse from 'fuse.js'
import { action, observable } from 'mobx'
import { IModerationStatus } from 'oa-shared'
import { getResearchTotalCommentCount } from 'src/utils/helpers'

import type { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'
import type { IComment, IUser } from 'src/models'
import type { ICategory } from 'src/models/categories.model'

export interface IItem {
  _modified: string
  _contentModifiedTimestamp: string
  _created: string
  _createdBy: string
  title?: string
  votedUsefulBy?: string[]
  category?: ICategory
  researchCategory?: ICategory
  researchStatus?: ResearchStatus
  updates?: {
    _deleted?: boolean
    comments?: IComment[]
    status: ResearchUpdateStatus
  }[]
  moderation?: IModerationStatus
  collaborators?: string[]
  total_downloads?: number
  comments?: IComment[]
  totalCommentCount?: number
}

export enum ItemSortingOption {
  None = 'None',
  LatestUpdated = 'LatestUpdated',
  Newest = 'Newest',
  MostUseful = 'MostUseful',
  Comments = 'MostComments',
  LeastComments = 'LeastComments',
  LatestComments = 'LatestComments',
  Updates = 'MostUpdates',
  TotalDownloads = 'TotalDownloads',
  MostRelevant = 'MostRelevant',
  /**
   * @deprecated This won't be supported with direct firebase queries
   */
  Random = 'Random',
  SearchResults = 'SearchResults',
}

export interface AuthorOption {
  label: IUser['userName']
  value: IUser['userName']
}

export class FilterSorterDecorator<T extends IItem> {
  @observable
  public activeSorter: ItemSortingOption

  public SEARCH_WEIGHTS: { name: string; weight: number }[]

  constructor() {
    this.activeSorter = ItemSortingOption.None
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

  public filterByAuthor(listItems: T[] = [], author: IUser['userName']): T[] {
    return author
      ? listItems.filter((obj) => {
          return (
            obj._createdBy === author ||
            (obj.collaborators && obj.collaborators.includes(author))
          )
        })
      : listItems
  }

  public filterByStatus(listItems: T[] = [], status: ResearchStatus): T[] {
    return status
      ? listItems.filter((obj) => {
          return (obj.researchStatus || 'In progress') === status
        })
      : listItems
  }

  private sortByProperty(listItems: T[], propertyName: keyof IItem): T[] {
    return [...listItems].sort((a, b) => {
      const valueA = a[propertyName]
      const valueB = b[propertyName]

      const lengthA = Array.isArray(valueA) ? valueA.length : valueA ?? 0
      const lengthB = Array.isArray(valueB) ? valueB.length : valueB ?? 0

      if (lengthA === lengthB) {
        return 0
      }

      return lengthA < lengthB ? 1 : -1
    })
  }

  private sortByLatestModified(listItems: T[]) {
    return [...listItems].sort((a, b) => {
      const dateA = new Date(
        a._contentModifiedTimestamp || a._modified,
      ).toISOString()
      const dateB = new Date(
        b._contentModifiedTimestamp || b._modified,
      ).toISOString()
      if (dateA === dateB) {
        return 0
      }

      return dateA < dateB ? 1 : -1
    })
  }

  private sortByMostDownloads(listItems: T[]) {
    return this.sortByProperty(listItems, 'total_downloads')
  }

  private sortByLatestCreated(listItems: T[]) {
    return this.sortByProperty(listItems, '_created')
  }

  private sortByMostUseful(listItems: T[]) {
    return this.sortByProperty(listItems, 'votedUsefulBy')
  }

  private sortByUpdates(listItems: T[]) {
    return this.sortByProperty(listItems, 'updates')
  }

  private sortBySearchRanking(listItems: T[]) {
    return listItems
  }

  private sortByComments(listItems: T[]) {
    return [...listItems].sort((a, b) => {
      const totalCommentsA =
        a.comments?.length || getResearchTotalCommentCount(a)
      const totalCommentsB =
        b.comments?.length || getResearchTotalCommentCount(b)

      if (totalCommentsA === totalCommentsB) {
        return 0
      }

      return totalCommentsA < totalCommentsB ? 1 : -1
    })
  }

  private sortByLeastComments(listItems: T[]) {
    return [...listItems].sort((a, b) => {
      const totalCommentsA =
        a.comments?.length || getResearchTotalCommentCount(a)
      const totalCommentsB =
        b.comments?.length || getResearchTotalCommentCount(b)

      if (totalCommentsA === totalCommentsB) {
        return 0
      }
      return totalCommentsA > totalCommentsB ? 1 : -1
    })
  }

  private sortByLatestComments(listItems: T[]) {
    return [...listItems].sort((a, b) => {
      const latestCommentA = this.getLatestComment(a)
      const latestCommentB = this.getLatestComment(b)

      if (!latestCommentA && !latestCommentB) {
        return 0
      } else if (!latestCommentA) {
        return 1
      } else if (!latestCommentB) {
        return -1
      }

      if (latestCommentA._created === latestCommentB._created) {
        return 0
      }

      return latestCommentA._created < latestCommentB._created ? 1 : -1
    })
  }

  private getLatestComment(item) {
    if (item.comments && item.comments.length > 0) {
      return item.comments.sort((a, b) => (a._created < b._created ? 1 : -1))[0]
    } else if (item.updates && getResearchTotalCommentCount(item) > 0) {
      const comments = item.updates
        .map((update) => update.comments ?? [])
        .flat()
      return comments.sort((a, b) => (a._created < b._created ? 1 : -1))[0]
    } else {
      return null
    }
  }

  private sortByModerationStatus(listItems: T[], user?: IUser) {
    const isCreatedByUser = (item: T) =>
      user && item._createdBy === user.userName
    const isModerationMatch = (item: T) =>
      item.moderation === IModerationStatus.DRAFT ||
      item.moderation === IModerationStatus.AWAITING_MODERATION ||
      item.moderation === IModerationStatus.REJECTED

    return [...listItems].sort((a, b) => {
      const aMatchesCondition = isCreatedByUser(a) && isModerationMatch(a)
      const bMatchesCondition = isCreatedByUser(b) && isModerationMatch(b)

      if (aMatchesCondition && !bMatchesCondition) {
        return -1
      }

      if (!aMatchesCondition && bMatchesCondition) {
        return 1
      }

      return 0
    })
  }

  private sortRandomly(listItems: T[]) {
    const _listItems = [...listItems]

    // randomize array by using Fisher-Yates algorith
    for (let i = _listItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = _listItems[i]
      _listItems[i] = _listItems[j]
      _listItems[j] = temp
    }

    return _listItems
  }

  @action
  public getSortedItems(listItems: T[], activeUser?: IUser): T[] {
    let validItems = listItems

    if (this.activeSorter) {
      switch (this.activeSorter) {
        case ItemSortingOption.LatestUpdated:
          validItems = this.sortByLatestModified(validItems)
          break

        case ItemSortingOption.Newest:
          validItems = this.sortByLatestCreated(validItems)
          break

        case ItemSortingOption.MostUseful:
          validItems = this.sortByMostUseful(validItems)
          break

        case ItemSortingOption.Comments:
          validItems = this.sortByComments(validItems)
          break

        case ItemSortingOption.LeastComments:
          validItems = this.sortByLeastComments(validItems)
          break

        case ItemSortingOption.LatestComments:
          validItems = this.sortByLatestComments(validItems)
          break

        case ItemSortingOption.Updates:
          validItems = this.sortByUpdates(validItems)
          break

        case ItemSortingOption.TotalDownloads:
          validItems = this.sortByMostDownloads(validItems)
          break

        case ItemSortingOption.Random:
          validItems = this.sortRandomly(validItems)
          break

        case ItemSortingOption.SearchResults:
          validItems = this.sortBySearchRanking(validItems)
          break

        default:
          break
      }
    }

    validItems = this.sortByModerationStatus(validItems, activeUser)

    return validItems
  }

  @action
  public sort(
    sorter: ItemSortingOption,
    listItems: T[],
    activeUser?: IUser,
  ): T[] {
    this.activeSorter = sorter

    return this.getSortedItems(listItems, activeUser)
  }

  @action
  public search(listItem: T[], searchValue: string): any {
    if (searchValue) {
      const fuse = new Fuse(listItem, {
        includeScore: true,
        keys: this.SEARCH_WEIGHTS,
      })

      return fuse
        .search(searchValue)
        .filter((r) => (r.score || 1) <= 0.8)
        .sort((a, b) => (a.score || 0) - (b.score || 0))
        .map((v) => v.item)
    } else {
      return listItem
    }
  }
}
