import { getDiscussionCollectionName, randomID } from './db.utils'

describe('getDiscussionCollectionName', () => {
  it('should return "questions" when sourceType is "question"', () => {
    const result = getDiscussionCollectionName('question')
    expect(result).toBe('questions')
  })

  it('should return "howtos" when sourceType is "howto"', () => {
    const result = getDiscussionCollectionName('howto')
    expect(result).toBe('howtos')
  })

  it('should return null when sourceType is unrecognized', () => {
    const result = getDiscussionCollectionName('unknown')
    expect(result).toBe(null)
  })
  it('should return null when sourceType is an empty string', () => {
    const result = getDiscussionCollectionName('')
    expect(result).toBeNull()
  })

  it('should return "research" when sourceType is "researchUpdate"', () => {
    const result = getDiscussionCollectionName('researchUpdate')
    expect(result).toBe('research')
  })
})

describe('randomID', () => {
  // generates a string of length 20
  it('should generate a string of length 20 and include only alphanumeric characters', () => {
    const id = randomID()
    const alphanumericRegex = /^[a-zA-Z0-9]+$/
    expect(id).toHaveLength(20)
    expect(alphanumericRegex.test(id)).toBe(true)
  })
})
