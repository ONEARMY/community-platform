import { formatLowerNoSpecial } from './helpers'

export const convertToSlug = (text: string) => {
  return formatLowerNoSpecial(text)
}
