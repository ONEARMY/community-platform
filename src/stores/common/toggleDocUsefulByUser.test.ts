import { toggleDocUsefulByUser } from './toggleDocUsefulByUser'

const mockDoc = jest.fn()
const mockGetDoc = jest.fn()
const mockUpdateDoc = jest.fn()
const mockIncrement = jest.fn()

jest.mock('firebase/firestore', () => ({
  doc: (db, colName, id) => mockDoc(db, colName, id),
  getDoc: (ref) => mockGetDoc(ref),
  updateDoc: (ref, value) => mockUpdateDoc(ref, value),
  increment: (value) => mockIncrement(value),
}))

describe('Useful', () => {
  it('marks an item as useful', async () => {
    mockGetDoc.mockResolvedValue({ data: () => ({ votedUsefulBy: [] }) })

    // Act
    await toggleDocUsefulByUser('howtos', 'id', 'an-interested-user')

    // Assert
    expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, {
      _id: 'id',
      votedUsefulBy: ['an-interested-user'],
      totalUsefulVotes: 1,
    })

    expect(mockIncrement).toHaveBeenCalledWith(1)
  })

  it('removes vote from an item', async () => {
    mockGetDoc.mockResolvedValue({
      data: () => ({ votedUsefulBy: ['an-interested-user'] }),
    })

    // Act
    await toggleDocUsefulByUser('howtos', 'id', 'an-interested-user')

    // Assert
    expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, {
      _id: 'id',
      votedUsefulBy: [],
      totalUsefulVotes: 0,
    })

    expect(mockIncrement).toHaveBeenCalledWith(-1)
  })

  it('removes vote from an item that has more votes', async () => {
    mockGetDoc.mockResolvedValue({
      data: () => ({ votedUsefulBy: ['an-interested-user', 'another user'] }),
    })

    // Act
    await toggleDocUsefulByUser('howtos', 'id', 'an-interested-user')

    // Assert
    expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, {
      _id: 'id',
      votedUsefulBy: ['another user'],
      totalUsefulVotes: 1,
    })

    expect(mockIncrement).toHaveBeenCalledWith(-1)
  })
})
