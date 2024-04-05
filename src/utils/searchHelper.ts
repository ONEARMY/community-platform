import { stopwords } from './stopwords'

export const getKeywords = (text: string) => {
  const words = text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .trim()
    .split(' ') // normalize and lowercase
  const filteredWords = words.filter((word) => !stopwords.has(word)) // filter stopwords
  const uniqueWords = new Set(filteredWords) // avoid duplicates
  uniqueWords.delete('') // remove empty space
  return Array.from(uniqueWords) // return as an array
}
