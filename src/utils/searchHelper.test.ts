import '@testing-library/jest-dom'

import { getKeywords } from './searchHelper'

describe('searchHelper', () => {
  it('should return all words of a string', () => {
    // act
    const words = getKeywords('test1 test2 test3')

    // assert
    expect(words).toEqual(['test1', 'test2', 'test3'])
  })

  it('should not return duplicate words', () => {
    // act
    const words = getKeywords('test1 test1')

    // assert
    expect(words).toEqual(['test1'])
  })

  it('should filter stopwords', () => {
    // act
    const words = getKeywords('i am test1 and themselves')

    // assert
    expect(words).toEqual(['test1'])
  })
})
