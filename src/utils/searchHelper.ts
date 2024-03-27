import { stopwords } from './stopwords'

export const getKeywords = (text: string) => {
  const words = text.toLowerCase().split(' ') // lowercase so comparisons are accurate
  const filteredWords = words.filter((word) => !stopwords.has(word)) // filter stopwords
  return Array.from(new Set(filteredWords)) // avoid duplicates
}
