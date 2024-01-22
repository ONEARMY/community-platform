import { addDays } from 'date-fns'
import { IModerationStatus, ResearchUpdateStatus } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'

import {
  FilterSorterDecorator,
  ItemSortingOption,
} from './FilterSorterDecorator'

import type { IItem } from './FilterSorterDecorator'

describe('FilterSorterDecorator', () => {
  let decorator: FilterSorterDecorator<IItem>
  const mockItems: IItem[] = [
    {
      title: 'Item 1',
      _modified: '2022-01-01',
      _contentModifiedTimestamp: '2022-01-01',
      _created: '2022-01-01',
      _createdBy: 'user3',
      moderation: IModerationStatus.ACCEPTED,
      votedUsefulBy: ['user1', 'user2'],
      category: {
        _contentModifiedTimestamp: '2022-12-24T07:50:55.226Z',
        _created: '2022-12-24T07:50:55.226Z',
        _modified: '2022-12-24T07:50:55.226Z',
        label: 'Category 1',
        _deleted: false,
        _id: '5jxuTdvzSBuCtqcH36MV',
      },
      updates: [
        {
          status: ResearchUpdateStatus.PUBLISHED,
          comments: [
            {
              _id: '1',
              _created: '2022-01-01',
              _creatorId: 'user1',
              creatorName: 'John',
              text: 'Comment 1',
            },
            {
              _id: '2',
              _created: '2022-01-02',
              _creatorId: 'user2',
              creatorName: 'Jane',
              text: 'Comment 2',
            },
          ],
        },
        {
          status: ResearchUpdateStatus.PUBLISHED,
          comments: [
            {
              _id: '3',
              _created: '2022-01-03',
              _creatorId: 'user3',
              creatorName: 'Bob',
              text: 'Comment 3',
            },
          ],
        },
      ],
      collaborators: ['user1'],
    },
    {
      title: 'Item 2',
      _modified: '2022-02-01',
      _contentModifiedTimestamp: '2022-02-01',
      _created: '2022-02-01',
      _createdBy: 'user1',
      moderation: IModerationStatus.ACCEPTED,
      votedUsefulBy: ['user3'],
      total_downloads: 10,
      researchCategory: {
        _contentModifiedTimestamp: '2022-12-24T07:50:55.226Z',
        _created: '2022-12-24T07:50:55.226Z',
        _modified: '2022-12-24T07:50:55.226Z',
        label: 'Research Category 2',
        _deleted: false,
        _id: '5jxuTdvzSBuCtqcH36MV',
      },
      updates: [
        {
          status: ResearchUpdateStatus.PUBLISHED,
          comments: [
            {
              _id: '4',
              _created: '2022-02-01',
              _creatorId: 'user4',
              creatorName: 'Alice',
              text: 'Comment 4',
            },
          ],
        },
        {
          status: ResearchUpdateStatus.PUBLISHED,
          comments: [
            {
              _id: '5',
              _created: '2022-02-02',
              _creatorId: 'user5',
              creatorName: 'Eve',
              text: 'Comment 5',
            },
            {
              _id: '6',
              _created: '2022-02-03',
              _creatorId: 'user6',
              creatorName: 'David',
              text: 'Comment 6',
            },
            {
              _id: '7',
              _created: '2022-02-04',
              _creatorId: 'user7',
              creatorName: 'Grace',
              text: 'Comment 7',
            },
          ],
        },
      ],
    },
  ]

  // Helper function to create items with default values
  const getItems = (rules: any) => {
    const items: IItem[] = []
    for (let i = 0; i < rules.length; i++) {
      items.push({
        title: rules[i].title || `Item ${i}`,
        _modified: rules[i]._modified || '2022-01-01',
        _contentModifiedTimestamp:
          rules[i]._contentModifiedTimestamp || '2022-01-01',
        _created: rules[i]._created || '2022-01-01',
        _createdBy: rules[i]._createdBy || `user${i}`,
        moderation: rules[i].moderation || IModerationStatus.ACCEPTED,
        votedUsefulBy: rules[i].votedUsefulBy || undefined,
        total_downloads: rules[i].total_downloads || 0,
        collaborators: rules[i].collaborators || undefined,
        category: rules[i].category
          ? {
              _id: rules[1].category._id || '5jxuTdvzSBuCtqcH36MV',
              _created:
                rules[1].category._created || '2022-12-24T07:50:55.226Z',
              _modified:
                rules[1].category._modified || '2022-12-24T07:50:55.226Z',
              _contentModifiedTimestamp:
                rules[1].category._contentModifiedTimestamp ||
                '2022-12-24T07:50:55.226Z',
              _deleted: rules[1].category._deleted || false,
              label: rules[1].category.label || `Category ${i}`,
            }
          : undefined,
        researchCategory: rules[i].researchCategory
          ? {
              _id: rules[1].researchCategory._id || '5jxuTdvzSBuCtqcH36MV',
              _created:
                rules[1].researchCategory._created ||
                '2022-12-24T07:50:55.226Z',
              _modified:
                rules[1].researchCategory._modified ||
                '2022-12-24T07:50:55.226Z',
              _contentModifiedTimestamp:
                rules[1].researchCategory._contentModifiedTimestamp ||
                '2022-12-24T07:50:55.226Z',
              _deleted: rules[1].researchCategory._deleted || false,
              label:
                rules[1].researchCategory.label || `Research Category ${i}`,
            }
          : undefined,
        updates: rules[i].updates
          ? rules[i].updates.map((update: any) => ({
              status: update.status || ResearchUpdateStatus.PUBLISHED,
              _deleted: update._deleted || false,
              comments: update.comments
                ? update.comments.map((comment: any, i: number) => ({
                    _id: comment._id || `${i}`,
                    _created: comment._created || '2022-01-01',
                    _creatorId: comment._creatorId || `user${i}`,
                    creatorName: comment.creatorName || 'John',
                    text: comment.text || `Comment ${i}`,
                  }))
                : undefined,
            }))
          : undefined,
        comments: rules[i].comments
          ? rules[i].comments.map((comment: any, i: number) => ({
              _id: comment._id || `${i}`,
              _created: comment._created || '2022-01-01',
              _creatorId: comment._creatorId || `user${i}`,
              creatorName: comment.creatorName || 'John',
              text: comment.text || `Comment ${i}`,
            }))
          : undefined,
      })
    }
    return items
  }

  beforeEach(() => {
    decorator = new FilterSorterDecorator()
  })

  //#region Sorting
  test('sort by latest modified', () => {
    const sortedItems = decorator.sort(
      ItemSortingOption.LatestUpdated,
      mockItems,
    )
    expect(sortedItems[0]._contentModifiedTimestamp).toBe('2022-02-01')
    expect(sortedItems[1]._contentModifiedTimestamp).toBe('2022-01-01')
  })

  test('sort by latest created', () => {
    const sortedItems = decorator.sort(ItemSortingOption.Newest, mockItems)
    expect(sortedItems[0]._created).toBe('2022-02-01')
    expect(sortedItems[1]._created).toBe('2022-01-01')
  })

  test('sort by most useful', () => {
    const sortedItems = decorator.sort(ItemSortingOption.MostUseful, mockItems)
    expect(sortedItems[0].votedUsefulBy!.length).toBe(2)
    expect(sortedItems[1].votedUsefulBy!.length).toBe(1)
  })

  test('sort by updates', () => {
    const sortedItems = decorator.sort(ItemSortingOption.Updates, mockItems)
    expect(sortedItems[0].updates!.length).toBe(2)
    expect(sortedItems[1].updates!.length).toBe(2)
  })

  test('sort by comments', () => {
    const sortedItems = decorator.sort(ItemSortingOption.Comments, mockItems)
    expect(sortedItems[0].title).toBe(mockItems[1].title)
    expect(sortedItems[1].title).toBe(mockItems[0].title)
  })

  test('sort by least comments', () => {
    const sortedItems = decorator.sort(
      ItemSortingOption.LeastComments,
      mockItems,
    )
    expect(sortedItems[0].title).toBe(mockItems[0].title)
    expect(sortedItems[1].title).toBe(mockItems[1].title)
  })

  test('sort by least comments (under comments)', () => {
    const items = getItems([
      { comments: [{}, {}, {}] },
      { comments: [{}, {}, {}, {}, {}, {}, {}] },
      { comments: [{}, {}, {}, {}, {}] },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LeastComments, items)
    expect(sortedItems[0].comments!.length).toBe(3)
    expect(sortedItems[1].comments!.length).toBe(5)
    expect(sortedItems[2].comments!.length).toBe(7)
  })

  test('sort by least comments (under updates)', () => {
    const items = getItems([
      { title: '1', updates: [{ comments: [{}, {}] }, { comments: [{}] }] },
      {
        title: '2',
        updates: [
          { comments: [{}, {}] },
          { comments: [{}, {}, {}, {}] },
          { comments: [{}] },
        ],
      },
      {
        title: '3',
        updates: [
          { comments: [{}] },
          { comments: [{}] },
          { comments: [{}] },
          { comments: [{}] },
          { comments: [{}] },
        ],
      },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LeastComments, items)
    expect(sortedItems[0].title).toBe('1')
    expect(sortedItems[1].title).toBe('3')
    expect(sortedItems[2].title).toBe('2')
  })

  test('sort by least comments 15 items', () => {
    const items = getItems([
      { title: '1', comments: [{}, {}, {}, {}, {}] },
      { title: '2', comments: [{}, {}] },
      { title: '3', comments: [] },
      { title: '4', comments: [{}, {}, {}, {}, {}, {}] },
      { title: '5', comments: [{}, {}, {}, {}] },
      { title: '6', comments: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}] },
      { title: '7', comments: [{}, {}, {}] },
      {
        title: '8',
        comments: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      },
      {
        title: '9',
        comments: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      },
      { title: '10', comments: [{}, {}, {}, {}, {}, {}, {}] },
      { title: '11', comments: [{}, {}, {}, {}, {}] },
      {
        title: '12',
        comments: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      },
      { title: '13', comments: [{}] },
      { title: '14', comments: [{}] },
      { title: '15', comments: [{}, {}] },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LeastComments, items)
    expect(sortedItems[0].title).toBe('3')
    expect(sortedItems[1].title).toBe('13')
    expect(sortedItems[2].title).toBe('14')
    expect(sortedItems[3].title).toBe('2')
    expect(sortedItems[4].title).toBe('15')
    expect(sortedItems[5].title).toBe('7')
    expect(sortedItems[6].title).toBe('5')
    expect(sortedItems[7].title).toBe('1')
    expect(sortedItems[8].title).toBe('11')
    expect(sortedItems[9].title).toBe('4')
    expect(sortedItems[10].title).toBe('10')
    expect(sortedItems[11].title).toBe('6')
    expect(sortedItems[12].title).toBe('8')
    expect(sortedItems[13].title).toBe('12')
    expect(sortedItems[14].title).toBe('9')
  })

  test('sort by least comments same number of comments (under comments)', () => {
    const items = getItems([
      { title: '1', comments: [{}, {}] },
      { title: '2', comments: [{}, {}] },
      { title: '3', comments: [{}] },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LeastComments, items)
    expect(sortedItems[0].title).toBe('3')
    expect(sortedItems[1].title).toBe('1')
    expect(sortedItems[2].title).toBe('2')
  })

  test('sort by least comments same number of comments (under updates)', () => {
    const items = getItems([
      { title: '1', updates: [{ comments: [{}, {}] }] },
      { title: '2', updates: [{ comments: [{}, {}] }] },
      { title: '3', updates: [{ comments: [{}] }, {}, {}] },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LeastComments, items)
    expect(sortedItems[0].title).toBe('3')
    expect(sortedItems[1].title).toBe('1')
    expect(sortedItems[2].title).toBe('2')
  })

  test('sort by least comments (one comments one updates)', () => {
    const items = getItems([
      { title: '1', comments: [{}, {}, {}, {}] },
      { title: '2', updates: [{ comments: [{}, {}] }, { comments: [{}] }] },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LeastComments, items)
    expect(sortedItems[0].title).toBe('2')
    expect(sortedItems[1].title).toBe('1')
  })

  test('sort by latest comments', () => {
    const sortedItems = decorator.sort(
      ItemSortingOption.LatestComments,
      mockItems,
    )
    expect(sortedItems[0].title).toBe(mockItems[1].title)
    expect(sortedItems[1].title).toBe(mockItems[0].title)
  })

  test('sort by latest comments (under comments)', () => {
    const items = getItems([
      {
        title: '1',
        comments: [{ _created: addDays(new Date(), -1).toISOString() }],
      },
      {
        title: '2',
        comments: [
          { _created: addDays(new Date(), -6).toISOString() },
          { _created: addDays(new Date(), -5).toISOString() },
          { _created: addDays(new Date(), -5).toISOString() },
          { _created: addDays(new Date(), -2).toISOString() },
        ],
      },
      {
        title: '3',
        comments: [
          { _created: addDays(new Date(), -12).toISOString() },
          { _created: addDays(new Date(), -10).toISOString() },
          { _created: addDays(new Date(), 0).toISOString() },
        ],
      },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LatestComments, items)
    expect(sortedItems[0].title).toBe('3')
    expect(sortedItems[1].title).toBe('1')
    expect(sortedItems[2].title).toBe('2')
  })

  test('sort by latest comments same number of comments (under updates)', () => {
    const items = getItems([
      {
        title: '1',
        updates: [
          {
            comments: [
              { _created: addDays(new Date(), -3).toISOString() },
              { _created: addDays(new Date(), 0).toISOString() },
            ],
          },
        ],
      },
      {
        title: '2',
        updates: [
          {
            comments: [
              { _created: addDays(new Date(), 0).toISOString() },
              { _created: addDays(new Date(), -6).toISOString() },
            ],
          },
        ],
      },
      { title: '3', updates: [] },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LatestComments, items)
    expect(sortedItems[0].title).toBe('1')
    expect(sortedItems[1].title).toBe('2')
    expect(sortedItems[2].title).toBe('3')
  })

  test('sort by latest comments (one comments one updates)', () => {
    const items = getItems([
      {
        title: '1',
        comments: [{ _created: addDays(new Date(), -3).toISOString() }],
      },
      {
        title: '2',
        updates: [
          { comments: [{ _created: addDays(new Date(), 0).toISOString() }] },
        ],
      },
    ])
    const sortedItems = decorator.sort(ItemSortingOption.LatestComments, items)
    expect(sortedItems[0].title).toBe('2')
    expect(sortedItems[1].title).toBe('1')
  })

  test('sort by total_downloads', () => {
    const sortedItems = decorator.sort(
      ItemSortingOption.TotalDownloads,
      mockItems,
    )
    expect(sortedItems[0].title).toBe(mockItems[1].title)
    expect(sortedItems[1].title).toBe(mockItems[0].title)
  })

  test('get sorted items with no active sorter', () => {
    const sortedItems = decorator.getSortedItems(mockItems)
    expect(sortedItems.length).toEqual(mockItems.length) // No sorting applied, should return original order
    expect(sortedItems[0].title).toEqual(mockItems[0].title)
  })

  test('get sorted items with default sorting option', () => {
    decorator.activeSorter = ItemSortingOption.None
    const sortedItems = decorator.getSortedItems(mockItems)
    expect(sortedItems.length).toEqual(mockItems.length) // No sorting applied, should return original order
    expect(sortedItems[0].title).toEqual(mockItems[0].title)
  })

  test('sorted items stay in same order if they have equal values', () => {
    const mockItems: IItem[] = [
      {
        _modified: '2022-10-10',
        _contentModifiedTimestamp: '2022-10-10',
        _createdBy: 'user1',
        title: 'Item 1',
        _created: '2022-10-10',
        votedUsefulBy: ['user2'],
      },
      {
        _modified: '2022-10-10',
        _contentModifiedTimestamp: '2022-10-10',
        _createdBy: 'user1',
        title: 'Item 2',
        _created: '2022-10-10',
        votedUsefulBy: ['user2'],
      },
    ]

    decorator = new FilterSorterDecorator()

    const sortedItems = decorator.sort(ItemSortingOption.MostUseful, mockItems)
    expect(sortedItems[0].title).toEqual(mockItems[0].title)
    expect(sortedItems[1].title).toEqual(mockItems[1].title)
  })

  describe('sorting multiple items by moderation status', () => {
    const mockUser = FactoryUser({ userName: 'user2' })

    const mockItemsWithModeration = mockItems.concat([
      {
        _modified: '2022-10-10',
        _contentModifiedTimestamp: '2022-10-10',
        _createdBy: 'user2',
        title: 'Item 3',
        _created: '2022-10-10',
        moderation: IModerationStatus.ACCEPTED,
      },
      {
        _modified: '2022-10-10',
        _contentModifiedTimestamp: '2022-10-10',
        _createdBy: 'user2',
        title: 'Item 4',
        _created: '2022-10-10',
        moderation: IModerationStatus.DRAFT,
      },
      {
        _modified: '2022-01-01',
        _contentModifiedTimestamp: '2022-01-01',
        _createdBy: 'user2',
        title: 'Item 5',
        _created: '2022-01-01',
        moderation: IModerationStatus.REJECTED,
      },
      {
        _modified: '2022-01-01',
        _contentModifiedTimestamp: '2022-01-01',
        _createdBy: 'user2',
        title: 'Item 6',
        _created: '2022-01-01',
        moderation: IModerationStatus.AWAITING_MODERATION,
      },
      {
        _modified: '2022-01-01',
        _contentModifiedTimestamp: '2022-01-01',
        _createdBy: 'user3',
        title: 'Item 7',
        _created: '2022-01-01',
        moderation: IModerationStatus.ACCEPTED,
      },
    ])

    decorator = new FilterSorterDecorator()
    const sortedItems = decorator.getSortedItems(
      mockItemsWithModeration,
      mockUser,
    )

    it('sort items created by user2 at the start of the list if they have moderation', () => {
      expect(sortedItems[0]._createdBy).toEqual('user2')
      expect(sortedItems[0].moderation).toEqual(IModerationStatus.DRAFT)
      expect(sortedItems[0].title).toEqual('Item 4')

      expect(sortedItems[1]._createdBy).toEqual('user2')
      expect(sortedItems[1].moderation).toEqual(IModerationStatus.REJECTED)
      expect(sortedItems[1].title).toEqual('Item 5')

      expect(sortedItems[2]._createdBy).toEqual('user2')
      expect(sortedItems[2].moderation).toEqual(
        IModerationStatus.AWAITING_MODERATION,
      )
      expect(sortedItems[2].title).toEqual('Item 6')
    })
  })

  //#endregion Sorting

  //#region  Filter
  test('filter by category', () => {
    const category = 'Category 1'
    const filteredItems = decorator.filterByCategory(mockItems, category)
    expect(filteredItems.length).toBe(1)
    expect(filteredItems[0].category?.label).toBe(category)
  })

  test('filter by research category', () => {
    const category = 'Research Category 2'
    const filteredItems = decorator.filterByCategory(mockItems, category)
    expect(filteredItems.length).toBe(1)
    expect(filteredItems[0].researchCategory?.label).toBe(category)
  })

  test('filter by author', () => {
    const author = 'user3'
    const filteredItems = decorator.filterByAuthor(mockItems, author)
    expect(filteredItems.length).toBe(1)
    expect(filteredItems[0]._createdBy).toBe(author)
  })

  test('filter by collaborator', () => {
    const author = 'user1'
    const filteredItems = decorator.filterByAuthor(mockItems, author)
    expect(filteredItems.length).toBe(2)
    expect(filteredItems[0].collaborators).toContain(author)
    expect(filteredItems[1]._createdBy).toBe(author)
  })

  //#endregion Filter

  //#region  Search

  test('search with empty search value', () => {
    const searchValue = ''
    const searchResult = decorator.search(mockItems, searchValue)
    expect(searchResult).toEqual(mockItems) // No search value provided, should return original list
  })

  test('search with matching search value', () => {
    const searchValue = 'Item 2'
    const searchResult = decorator.search(mockItems, searchValue)
    expect(searchResult[0].title).toBe(searchValue)
  })

  test('search with non-matching search value', () => {
    const searchValue = 'Non-existent comment'
    const searchResult = decorator.search(mockItems, searchValue)
    expect(searchResult.length).toBe(0)
  })

  //#endregion Search
})
