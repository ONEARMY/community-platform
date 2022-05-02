import { capitalizeFirstLetter } from 'src/utils/helpers'

type InputModifiers = {
  capitalize?: boolean
}

export const processInputModifiers = (
  value: any,
  modifiers: InputModifiers = {},
) => {
  if (typeof value !== 'string') return value
  if (modifiers.capitalize) {
    value = capitalizeFirstLetter(value)
  }
  return value
}
