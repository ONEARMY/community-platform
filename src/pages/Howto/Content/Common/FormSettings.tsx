const makeEntry = (value: string, label?: string) => {
  return { value, label: label || value }
}

export const TIME_OPTIONS = [
  makeEntry('< 1 hour'),
  makeEntry('< 5 hours'),
  makeEntry('< 1 day'),
  makeEntry('< 1 week'),
  makeEntry('1-2 weeks'),
  makeEntry('3-4 weeks'),
  makeEntry('1+ months'),
]

export const DIFFICULTY_OPTIONS = [
  makeEntry('Easy'),
  makeEntry('Medium'),
  makeEntry('Hard'),
  makeEntry('Very Hard'),
]
