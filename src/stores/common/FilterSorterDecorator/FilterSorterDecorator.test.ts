import { FilterSorterDecorator, IItem } from './FilterSorterDecorator'

describe('FilterSorterDecorator', () => {
  let decorator: FilterSorterDecorator<IItem>
  const mockItems: IItem[] = [
    {
      _modified: '2022-01-01',
      _created: '2022-01-01',
      votedUsefulBy: ['user1', 'user2'],
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
      _modified: '2022-02-01',
      _created: '2022-02-01',
      votedUsefulBy: ['user3'],
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

  test('sort by latest modified', () => {
    const sortedItems = decorator.sort('modified')
    expect(sortedItems[0]._modified).toBe('2022-02-01')
    expect(sortedItems[1]._modified).toBe('2022-01-01')
  })

  test('sort by latest created', () => {
    const sortedItems = decorator.sort('created')
    expect(sortedItems[0]._created).toBe('2022-02-01')
    expect(sortedItems[1]._created).toBe('2022-01-01')
  })

  test('sort by most useful', () => {
    const sortedItems = decorator.sort('most useful')
    expect(sortedItems[0].votedUsefulBy.length).toBe(2)
    expect(sortedItems[1].votedUsefulBy.length).toBe(1)
  })

  test('sort by comments', () => {
    const sortedItems = decorator.sort('comments')
    expect(decorator.calculateTotalComments(sortedItems[0])).toBe(4)
    expect(decorator.calculateTotalComments(sortedItems[1])).toBe(3)
  })

  test('sort by updates', () => {
    const sortedItems = decorator.sort('updates')
    expect(sortedItems[0].updates.length).toBe(2)
    expect(sortedItems[1].updates.length).toBe(1)
  })
})
