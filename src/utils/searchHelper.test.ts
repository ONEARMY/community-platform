import '@testing-library/jest-dom'

import { describe, expect, it } from 'vitest'

import { getKeywords } from './searchHelper'

describe('searchHelper', () => {
  it('should return all lowercase words of a string', () => {
    // act
    const words = getKeywords('Test1 teSt2 teST3')

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

  it('should normalize diatrics and filter stopwords', () => {
    // act
    const words = getKeywords('I ám test1 and thémselves')

    // assert
    expect(words).toEqual(['test1'])
  })

  it('should return normalized words', () => {
    // act
    const words = getKeywords('Tésting wórds açaí')

    // assert
    expect(words).toEqual(['testing', 'words', 'acai'])
  })

  it('should remove special characters', () => {
    // act
    const words = getKeywords('Good morning!')

    // assert
    expect(words).toEqual(['good', 'morning'])
  })
})
