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
      _created: '2022-01-01',
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
    },
    {
      title: 'Item 2',
      _modified: '2022-02-01',
      _created: '2022-02-01',
      votedUsefulBy: ['user3'],
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

  beforeEach(() => {
    decorator = new FilterSorterDecorator(mockItems)
  })

  //#region Sorting
  test('sort by latest modified', () => {
    const sortedItems = decorator.sort('Modified')
    expect(sortedItems[0]._modified).toBe('2022-02-01')
    expect(sortedItems[1]._modified).toBe('2022-01-01')
  })

  test('sort by latest created', () => {
    const sortedItems = decorator.sort('Created')
    expect(sortedItems[0]._created).toBe('2022-02-01')
    expect(sortedItems[1]._created).toBe('2022-01-01')
  })

  test('sort by most useful', () => {
    const sortedItems = decorator.sort('MostUseful')
    expect(sortedItems[0].votedUsefulBy.length).toBe(2)
    expect(sortedItems[1].votedUsefulBy.length).toBe(1)
  })

  test('sort by updates', () => {
    const sortedItems = decorator.sort('Updates')
    expect(sortedItems[0].updates.length).toBe(2)
    expect(sortedItems[1].updates.length).toBe(2)
  })

  test('sort by comments', () => {
    const sortedItems = decorator.sort('Comments')
    expect(decorator.calculateTotalComments(sortedItems[0])).toBe(4)
    expect(decorator.calculateTotalComments(sortedItems[1])).toBe(3)
  })

  test('get sorted items with no active sorter', () => {
    const sortedItems = decorator.getSortedItems()
    expect(sortedItems.length).toEqual(mockItems.length) // No sorting applied, should return original order
    expect(sortedItems[0].title).toEqual(mockItems[0].title)
  })

  test('get sorted items with default sorting option', () => {
    decorator.activeSorter = ItemSortingOption.None
    const sortedItems = decorator.getSortedItems()
    expect(sortedItems.length).toEqual(mockItems.length) // No sorting applied, should return original order
    expect(sortedItems[0].title).toEqual(mockItems[0].title)
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
